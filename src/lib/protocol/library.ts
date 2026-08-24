import type { HouseSteelFrame, MoveClip } from "./types";
import { SAMPLE_HZ } from "./types";

function clip(
  id: string,
  name: string,
  durationMs: number,
  sample: (t: number) => { left: number; right: number; extend: number },
): MoveClip {
  const frames: HouseSteelFrame[] = [];
  const n = Math.round((durationMs / 1000) * SAMPLE_HZ);
  for (let i = 0; i < n; i++) {
    const t = (i / SAMPLE_HZ) * 1000;
    const s = sample(t);
    frames.push({
      t,
      drive: { left: s.left, right: s.right },
      arm: { extend: s.extend },
    });
  }
  return {
    id,
    name,
    createdAt: "2026-08-24T00:00:00.000Z",
    durationMs,
    sampleHz: SAMPLE_HZ,
    frames,
    origin: "seed",
  };
}

/** Teachable jab: roll in, snap the piston, coast, retract. Not a wiggle. */
export const JAB: MoveClip = clip("seed-jab", "JAB", 1400, (t) => {
  if (t < 180) return { left: 0.55, right: 0.55, extend: 0 };
  if (t < 280) return { left: 0.95, right: 0.95, extend: (t - 180) / 80 };
  if (t < 520) return { left: 0.7, right: 0.7, extend: 1 };
  if (t < 780) return { left: 0.2, right: 0.2, extend: 1 - (t - 520) / 260 };
  if (t < 1100) return { left: 0.05, right: 0.05, extend: 0 };
  return { left: 0, right: 0, extend: 0 };
});

export const SEED_MOVES: MoveClip[] = [JAB];

export function findMove(moves: MoveClip[], q: { id?: string; name?: string }): MoveClip | undefined {
  if (q.id) {
    const byId = moves.find((m) => m.id === q.id);
    if (byId) return byId;
  }
  if (q.name) {
    const n = q.name.trim().toUpperCase();
    return moves.find((m) => m.name.toUpperCase() === n);
  }
  return undefined;
}
