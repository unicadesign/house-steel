import { SEED_MOVES, findMove } from "@/lib/protocol/library";
import type { HouseSteelFrame, MoveClip } from "@/lib/protocol/types";
import { RECORD_MAX_MS, SAMPLE_HZ, ZERO_ARM, ZERO_DRIVE } from "@/lib/protocol/types";
import { attachInput, createInput, driveFromActions, sampleActions } from "@/lib/twin/input";
import { loadMoves, makeClip, persistCrewMoves, samplePlayback } from "@/lib/twin/moves";
import { drawFrame, VIEW, type DrawHud } from "@/lib/twin/renderer";
import {
  applyCommand,
  clearKill,
  createSim,
  FIXED_DT,
  killSim,
  snapshotFrame,
  speedMs,
  stepSim,
  type SimState,
} from "@/lib/twin/sim";
import { useEffect, useRef, useState } from "react";
import { TouchPad } from "./touch";

type Mode = "idle" | "record" | "play" | "kill";

type HudSnap = {
  mode: Mode;
  moveName: string;
  recT: number;
  recMax: number;
  playT: number;
  playMax: number;
  yaw: number;
  speed: number;
  extend: number;
  left: number;
  right: number;
};

const EMPTY_HUD: HudSnap = {
  mode: "idle",
  moveName: "JAB",
  recT: 0,
  recMax: RECORD_MAX_MS,
  playT: 0,
  playMax: 1,
  yaw: 0,
  speed: 0,
  extend: 0,
  left: 0,
  right: 0,
};

export function Arena() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<SimState>(createSim());
  const inputRef = useRef(createInput());
  const modeRef = useRef<Mode>("idle");
  const recordBuf = useRef<HouseSteelFrame[]>([]);
  const recAcc = useRef(0);
  const recClock = useRef(0);
  const playClip = useRef<MoveClip | null>(null);
  const playClock = useRef(0);
  const selectedId = useRef("seed-jab");
  const namingRef = useRef(false);

  const [hud, setHud] = useState<HudSnap>(EMPTY_HUD);
  const [moves, setMoves] = useState<MoveClip[]>(SEED_MOVES);
  const [selected, setSelected] = useState("seed-jab");
  const [naming, setNaming] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [notice, setNotice] = useState("WASD drive · J punch · SPACE kill · R record · P play");

  useEffect(() => {
    setMoves(loadMoves());
  }, []);

  useEffect(() => {
    selectedId.current = selected;
  }, [selected]);

  useEffect(() => {
    namingRef.current = naming;
    inputRef.current.enabled = !naming;
  }, [naming]);

  useEffect(() => {
    const input = inputRef.current;
    const detach = attachInput(input, window);

    const probe = {
      getYaw: () => simRef.current.yaw,
      getSpeed: () => speedMs(simRef.current),
      setSteer: (v: number) => {
        input.injectSteer = v;
      },
      setThrottle: (v: number) => {
        input.injectThrottle = v;
      },
      setKeys: (codes: string[]) => {
        input.injectKeys = codes;
      },
    };
    window.__controlsTest = probe;

    const canvas = canvasRef.current;
    if (!canvas) return () => detach();
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => detach();

    let raf = 0;
    let acc = 0;
    let last = performance.now();
    let hudTick = 0;

    const loop = (now: number) => {
      const raw = Math.min(0.1, (now - last) / 1000);
      last = now;
      acc += raw;
      const sim = simRef.current;
      const actions = sampleActions(input);

      if (actions.kill && modeRef.current !== "kill") {
        modeRef.current = "kill";
        killSim(sim);
        playClip.current = null;
        recordBuf.current = [];
        recClock.current = 0;
        setNotice("KILL — motors zeroed. Press a drive key to reset.");
      }

      if (modeRef.current === "kill" && !actions.kill && (actions.throttle !== 0 || actions.steer !== 0)) {
        modeRef.current = "idle";
        clearKill(sim);
        setNotice("Reset. Pit live.");
      }

      if (modeRef.current !== "kill" && actions.recordEdge && !namingRef.current) {
        if (modeRef.current === "record") {
          finishRecord();
        } else {
          modeRef.current = "record";
          recordBuf.current = [];
          recAcc.current = 0;
          recClock.current = 0;
          playClip.current = null;
          setNotice("RECORD — 1 to 3 seconds. R or timer to stop.");
        }
      }

      if (modeRef.current !== "kill" && actions.playEdge && !namingRef.current) {
        const clip = findMove(loadMoves(), { id: selectedId.current }) ?? loadMoves()[0];
        if (clip) {
          modeRef.current = "play";
          playClip.current = clip;
          playClock.current = 0;
          setNotice(`PLAY ${clip.name}`);
        }
      }

      while (acc >= FIXED_DT) {
        if (modeRef.current === "play" && playClip.current) {
          const frame = samplePlayback(playClip.current, playClock.current * 1000);
          applyCommand(sim, {
            v: 0,
            drive: frame.drive,
            arm: frame.arm,
          });
          playClock.current += FIXED_DT;
          if (playClock.current * 1000 >= playClip.current.durationMs) {
            modeRef.current = "idle";
            playClip.current = null;
            applyCommand(sim, { v: 0, drive: ZERO_DRIVE, arm: ZERO_ARM });
          }
        } else if (modeRef.current !== "kill") {
          const drive = driveFromActions(actions);
          applyCommand(sim, {
            v: 0,
            drive,
            arm: { extend: actions.punch ? 1 : 0 },
          });
        }
        stepSim(sim, FIXED_DT);
        acc -= FIXED_DT;

        if (modeRef.current === "record") {
          recClock.current += FIXED_DT;
          recAcc.current += FIXED_DT;
          const period = 1 / SAMPLE_HZ;
          if (recAcc.current >= period) {
            recAcc.current -= period;
            recordBuf.current.push(snapshotFrame(sim, recClock.current * 1000));
          }
          if (recClock.current * 1000 >= RECORD_MAX_MS) finishRecord();
        }
      }

      const hudDraw: DrawHud = {
        mode: modeRef.current,
        moveName:
          modeRef.current === "play"
            ? (playClip.current?.name ?? "")
            : modeRef.current === "record"
              ? "REC"
              : (findMove(moves, { id: selectedId.current })?.name ?? ""),
        recT: recClock.current * 1000,
        recMax: RECORD_MAX_MS,
        playT: playClock.current * 1000,
        playMax: playClip.current?.durationMs ?? 1,
      };
      drawFrame(ctx, sim, hudDraw);

      hudTick += raw;
      if (hudTick > 0.08) {
        hudTick = 0;
        setHud({
          mode: modeRef.current,
          moveName: hudDraw.moveName,
          recT: hudDraw.recT,
          recMax: hudDraw.recMax,
          playT: hudDraw.playT,
          playMax: hudDraw.playMax,
          yaw: sim.yaw,
          speed: speedMs(sim),
          extend: sim.extend,
          left: sim.cmd.left,
          right: sim.cmd.right,
        });
      }

      raf = requestAnimationFrame(loop);
    };

    function finishRecord() {
      if (modeRef.current !== "record") return;
      modeRef.current = "idle";
      const frames = recordBuf.current;
      recordBuf.current = [];
      if (frames.length < 8) {
        setNotice("Clip too short. Hold R for a real jab.");
        return;
      }
      (window as unknown as { __pendingFrames?: HouseSteelFrame[] }).__pendingFrames = frames;
      setNameDraft("JAB");
      setNaming(true);
      setNotice("Name the clip.");
    }

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      detach();
      delete window.__controlsTest;
    };
    // moves is read live via selectedId / loadMoves inside the loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function commitName(raw: string) {
    const frames = (window as unknown as { __pendingFrames?: HouseSteelFrame[] }).__pendingFrames;
    setNaming(false);
    inputRef.current.enabled = true;
    if (!frames?.length) return;
    const clip = makeClip(raw || "JAB", frames);
    persistCrewMoves([...loadMoves(), clip]);
    const all = loadMoves();
    setMoves(all);
    setSelected(clip.id);
    selectedId.current = clip.id;
    setNotice(`Saved ${clip.name} · ${(clip.durationMs / 1000).toFixed(2)}s`);
    delete (window as unknown as { __pendingFrames?: HouseSteelFrame[] }).__pendingFrames;
  }

  function onPlay(id: string) {
    setSelected(id);
    selectedId.current = id;
    const clip = findMove(loadMoves(), { id });
    if (!clip) return;
    modeRef.current = "play";
    playClip.current = clip;
    playClock.current = 0;
    setNotice(`PLAY ${clip.name}`);
  }

  function onDelete(id: string) {
    const all = loadMoves().filter((m) => m.id !== id || m.origin === "seed");
    persistCrewMoves(all.filter((m) => m.origin !== "seed"));
    setMoves(loadMoves());
    if (selected === id) {
      setSelected("seed-jab");
      selectedId.current = "seed-jab";
    }
  }

  const input = inputRef.current;

  return (
    <div className="flex min-h-[calc(100dvh-52px)] flex-col bg-pit lg:flex-row">
      <div ref={wrapRef} className="relative flex min-h-[50dvh] flex-1 items-center justify-center bg-pit p-2">
        <canvas
          ref={canvasRef}
          width={VIEW}
          height={VIEW}
          className="pixel max-h-[min(72dvh,100vw)] w-full max-w-[min(72dvh,100vw)] touch-none border-4 border-edge bg-graphite"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      <aside className="flex w-full flex-col gap-3 border-t-4 border-edge bg-graphite p-3 lg:w-80 lg:border-t-0 lg:border-l-4">
        <div className="flex items-center justify-between">
          <p className="font-display text-[10px] text-amber">{hud.mode.toUpperCase()}</p>
          <p className="font-display text-[8px] text-fog">ATOM-0</p>
        </div>
        <p className="font-mono text-lg text-paper">{notice}</p>
        <div className="grid grid-cols-2 gap-2 font-mono text-lg">
          <Meter label="L WHEEL" value={(hud.left + 1) / 2} />
          <Meter label="R WHEEL" value={(hud.right + 1) / 2} />
          <Meter label="ARM" value={hud.extend} accent />
          <Meter label="SPEED" value={Math.min(1, Math.abs(hud.speed) / 1.4)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="pixel-btn"
            onClick={() => {
              input.recordPulse = true;
            }}
          >
            RECORD
          </button>
          <button type="button" className="pixel-btn-ghost" onClick={() => onPlay(selected)}>
            PLAY
          </button>
          <button
            type="button"
            className="pixel-btn-kill"
            onClick={() => {
              input.killPulse = true;
              modeRef.current = "kill";
              killSim(simRef.current);
              setNotice("KILL");
            }}
          >
            KILL
          </button>
        </div>
        <p className="hud-label">Move library · localStorage</p>
        <ul className="flex max-h-48 flex-col gap-1 overflow-auto">
          {moves.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => {
                  setSelected(m.id);
                  selectedId.current = m.id;
                }}
                className={
                  "flex w-full min-h-11 items-center justify-between px-2 font-display text-[9px] " +
                  (selected === m.id ? "bg-amber text-pit" : "bg-steel text-paper hover:bg-panel")
                }
              >
                <span>{m.name}</span>
                <span className={selected === m.id ? "text-pit" : "text-fog"}>
                  {(m.durationMs / 1000).toFixed(1)}s
                </span>
              </button>
              {m.origin !== "seed" ? (
                <button
                  type="button"
                  className="mt-0.5 font-display text-[8px] text-kill"
                  onClick={() => onDelete(m.id)}
                >
                  DELETE
                </button>
              ) : (
                <p className="hud-label px-1 py-1">seed · teachable jab</p>
              )}
            </li>
          ))}
        </ul>
        <TouchPad
          onMove={(throttle, steer) => {
            input.touch.throttle = throttle;
            input.touch.steer = steer;
          }}
          onPunch={(v) => {
            input.touch.punch = v;
          }}
          onKill={(v) => {
            input.touch.kill = v;
          }}
        />
      </aside>

      {naming ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-pit/80 p-4">
          <form
            className="w-full max-w-sm border-4 border-amber bg-graphite p-4"
            onSubmit={(e) => {
              e.preventDefault();
              commitName(nameDraft);
            }}
          >
            <p className="font-display text-[10px] text-amber">NAME THE CLIP</p>
            <p className="mt-2 font-mono text-lg text-fog">1–3s of drive + arm. Caps lock on purpose.</p>
            <input
              autoFocus
              className="pixel-field mt-3"
              maxLength={24}
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              aria-label="Move name"
            />
            <div className="mt-3 flex gap-2">
              <button type="submit" className="pixel-btn flex-1">
                SAVE
              </button>
              <button
                type="button"
                className="pixel-btn-ghost flex-1"
                onClick={() => {
                  setNaming(false);
                  inputRef.current.enabled = true;
                }}
              >
                DISCARD
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function Meter({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div>
      <p className="hud-label">{label}</p>
      <div className="mt-1 h-3 border-2 border-edge bg-pit">
        <div
          className={"h-full " + (accent ? "bg-ice" : "bg-amber")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setSteer?: (v: number) => void;
      setThrottle?: (v: number) => void;
      setKeys?: (codes: string[]) => void;
    };
  }
}
