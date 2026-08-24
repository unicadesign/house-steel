import { clamp1 } from "@/lib/protocol/types";

const GAME_CODES = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyQ",
  "KeyE",
  "KeyJ",
  "KeyK",
  "KeyF",
  "KeyR",
  "KeyP",
  "Space",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
]);

export type TwinActions = {
  throttle: number;
  steer: number;
  tankLeft: boolean;
  tankRight: boolean;
  punch: boolean;
  punchAnalog: number;
  kill: boolean;
  recordEdge: boolean;
  playEdge: boolean;
};

export type InputSession = {
  keys: Set<string>;
  prevKeys: Set<string>;
  padRecord: boolean;
  padPlay: boolean;
  touch: { throttle: number; steer: number; punch: boolean; kill: boolean };
  injectSteer: number | null;
  injectThrottle: number | null;
  injectKeys: string[] | null;
  enabled: boolean;
  recordPulse: boolean;
  playPulse: boolean;
  killPulse: boolean;
};

export function createInput(): InputSession {
  return {
    keys: new Set(),
    prevKeys: new Set(),
    padRecord: false,
    padPlay: false,
    touch: { throttle: 0, steer: 0, punch: false, kill: false },
    injectSteer: null,
    injectThrottle: null,
    injectKeys: null,
    enabled: true,
    recordPulse: false,
    playPulse: false,
    killPulse: false,
  };
}

export function attachInput(session: InputSession, target: Window | HTMLElement): () => void {
  const isField = (el: EventTarget | null) => {
    if (!(el instanceof HTMLElement)) return false;
    const tag = el.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
  };

  const onDown = (e: KeyboardEvent) => {
    if (isField(e.target)) return;
    if (!session.enabled) return;
    if (GAME_CODES.has(e.code)) e.preventDefault();
    session.keys.add(e.code);
  };
  const onUp = (e: KeyboardEvent) => {
    session.keys.delete(e.code);
  };
  const onBlur = () => {
    session.keys.clear();
  };

  const el = target as Window;
  el.addEventListener("keydown", onDown);
  el.addEventListener("keyup", onUp);
  el.addEventListener("blur", onBlur);
  document.addEventListener("visibilitychange", onBlur);
  return () => {
    el.removeEventListener("keydown", onDown);
    el.removeEventListener("keyup", onUp);
    el.removeEventListener("blur", onBlur);
    document.removeEventListener("visibilitychange", onBlur);
  };
}

function radialDeadzone(x: number, y: number, dz = 0.15): { x: number; y: number } {
  const m = Math.hypot(x, y);
  if (m < dz) return { x: 0, y: 0 };
  const scale = (m - dz) / (1 - dz) / m;
  return { x: x * scale, y: y * scale };
}

function held(session: InputSession, code: string): boolean {
  if (session.injectKeys) return session.injectKeys.includes(code);
  return session.keys.has(code);
}

function just(session: InputSession, code: string): boolean {
  if (session.injectKeys) return session.injectKeys.includes(code) && !session.prevKeys.has(code);
  return session.keys.has(code) && !session.prevKeys.has(code);
}

export function sampleActions(session: InputSession): TwinActions {
  let throttle = 0;
  let steer = 0;
  if (held(session, "KeyW") || held(session, "ArrowUp")) throttle += 1;
  if (held(session, "KeyS") || held(session, "ArrowDown")) throttle -= 1;
  // A = player-left = +steer. D = player-right = -steer.
  if (held(session, "KeyA") || held(session, "ArrowLeft")) steer += 1;
  if (held(session, "KeyD") || held(session, "ArrowRight")) steer -= 1;

  throttle = clamp1(throttle + session.touch.throttle);
  steer = clamp1(steer + session.touch.steer);

  let punch = held(session, "KeyJ") || held(session, "KeyK") || held(session, "KeyF") || session.touch.punch;
  let punchAnalog = punch ? 1 : 0;
  let kill = held(session, "Space") || session.touch.kill;
  let recordEdge = just(session, "KeyR");
  let playEdge = just(session, "KeyP");
  const tankLeft = held(session, "KeyQ");
  const tankRight = held(session, "KeyE");

  if (typeof navigator !== "undefined" && navigator.getGamepads) {
    const pads = navigator.getGamepads();
    for (const pad of pads) {
      if (!pad) continue;
      const stick = radialDeadzone(pad.axes[0] ?? 0, pad.axes[1] ?? 0);
      throttle = clamp1(throttle + -stick.y);
      steer = clamp1(steer + -stick.x);
      const a = pad.buttons[0]?.pressed;
      const x = pad.buttons[2]?.pressed;
      const rt = pad.buttons[7]?.value ?? 0;
      if (a || x) punch = true;
      if (rt > 0.2) {
        punch = true;
        punchAnalog = Math.max(punchAnalog, rt);
      }
      if (pad.buttons[1]?.pressed) kill = true;
      const rec = Boolean(pad.buttons[8]?.pressed);
      const ply = Boolean(pad.buttons[9]?.pressed);
      if (rec && !session.padRecord) recordEdge = true;
      if (ply && !session.padPlay) playEdge = true;
      session.padRecord = rec;
      session.padPlay = ply;
      const dpadL = pad.buttons[14]?.pressed;
      const dpadR = pad.buttons[15]?.pressed;
      if (dpadL) steer = clamp1(steer + 1);
      if (dpadR) steer = clamp1(steer - 1);
      const dpadU = pad.buttons[12]?.pressed;
      const dpadD = pad.buttons[13]?.pressed;
      if (dpadU) throttle = clamp1(throttle + 1);
      if (dpadD) throttle = clamp1(throttle - 1);
    }
  }

  if (session.injectSteer !== null) steer = session.injectSteer;
  if (session.injectThrottle !== null) throttle = session.injectThrottle;

  if (session.recordPulse) {
    recordEdge = true;
    session.recordPulse = false;
  }
  if (session.playPulse) {
    playEdge = true;
    session.playPulse = false;
  }
  if (session.killPulse) {
    kill = true;
    session.killPulse = false;
  }

  session.prevKeys = new Set(session.injectKeys ?? session.keys);

  return {
    throttle: clamp1(throttle),
    steer: clamp1(steer),
    tankLeft,
    tankRight,
    punch,
    punchAnalog: punchAnalog || (punch ? 1 : 0),
    kill,
    recordEdge,
    playEdge,
  };
}

export function driveFromActions(a: TwinActions): { left: number; right: number } {
  if (a.tankLeft) return { left: -1, right: 1 };
  if (a.tankRight) return { left: 1, right: -1 };
  const mix = 0.42;
  return {
    left: clamp1(a.throttle - a.steer * mix),
    right: clamp1(a.throttle + a.steer * mix),
  };
}
