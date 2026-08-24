import { SEED_MOVES } from "@/lib/protocol/library";
import { moveClipSchema } from "@/lib/protocol/schema";
import type { HouseSteelFrame, MoveClip } from "@/lib/protocol/types";
import { RECORD_MAX_MS, RECORD_MIN_MS, SAMPLE_HZ } from "@/lib/protocol/types";

const KEY = "house-steel.moves.v1";

function slug(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
}

export function loadMoves(): MoveClip[] {
  const seed = SEED_MOVES.map((m) => ({ ...m, frames: m.frames.map((f) => ({ ...f })) }));
  if (typeof localStorage === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    const parsed = moveClipSchema.array().parse(JSON.parse(raw));
    const crew = parsed.filter((m) => m.origin !== "seed");
    return [...seed, ...crew];
  } catch {
    return seed;
  }
}

export function persistCrewMoves(moves: MoveClip[]): void {
  if (typeof localStorage === "undefined") return;
  const crew = moves.filter((m) => m.origin !== "seed");
  localStorage.setItem(KEY, JSON.stringify(crew));
}

export function makeClip(name: string, frames: HouseSteelFrame[]): MoveClip {
  const durationMs = frames.length ? frames[frames.length - 1]!.t : 0;
  return {
    id: `crew-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4).toString(36)}`,
    name: slug(name) || "UNNAMED",
    createdAt: new Date().toISOString(),
    durationMs,
    sampleHz: SAMPLE_HZ,
    frames: frames.map((f) => ({
      t: f.t,
      drive: { left: f.drive.left, right: f.drive.right },
      arm: { extend: f.arm.extend },
    })),
    origin: "crew",
  };
}

export { RECORD_MAX_MS, RECORD_MIN_MS, SAMPLE_HZ };

export function samplePlayback(clip: MoveClip, tMs: number): HouseSteelFrame {
  if (clip.frames.length === 0) {
    return { t: tMs, drive: { left: 0, right: 0 }, arm: { extend: 0 } };
  }
  if (tMs <= clip.frames[0]!.t) return clip.frames[0]!;
  const last = clip.frames[clip.frames.length - 1]!;
  if (tMs >= last.t) return last;
  let lo = 0;
  let hi = clip.frames.length - 1;
  while (lo + 1 < hi) {
    const mid = (lo + hi) >> 1;
    if (clip.frames[mid]!.t <= tMs) lo = mid;
    else hi = mid;
  }
  const a = clip.frames[lo]!;
  const b = clip.frames[hi]!;
  const u = (tMs - a.t) / Math.max(1, b.t - a.t);
  return {
    t: tMs,
    drive: {
      left: a.drive.left + (b.drive.left - a.drive.left) * u,
      right: a.drive.right + (b.drive.right - a.drive.right) * u,
    },
    arm: { extend: a.arm.extend + (b.arm.extend - a.arm.extend) * u },
  };
}
