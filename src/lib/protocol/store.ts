import { SEED_MOVES, findMove } from "./library";
import type { HouseSteelFrame, MoveClip } from "./types";
import { SAMPLE_HZ } from "./types";

/** Ephemeral process store. Vercel instances do not share it. Seeds always exist. */
const extra: MoveClip[] = [];
let recording: { name?: string; started: number } | null = null;

export function listMoves(): MoveClip[] {
  return [...SEED_MOVES, ...extra];
}

export function getMove(q: { id?: string; name?: string }): MoveClip | undefined {
  return findMove(listMoves(), q);
}

export function addMove(clip: MoveClip): MoveClip {
  const existing = extra.findIndex((m) => m.id === clip.id || m.name === clip.name);
  if (existing >= 0) extra.splice(existing, 1, clip);
  else extra.push(clip);
  return clip;
}

export function startRecord(name?: string) {
  recording = { name, started: Date.now() };
  return recording;
}

export function stopRecord(frames: HouseSteelFrame[], name?: string): MoveClip {
  const n = name || recording?.name || "CLIP";
  recording = null;
  const slug = n
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  const clip: MoveClip = {
    id: `api-${Date.now().toString(36)}`,
    name: slug || "CLIP",
    createdAt: new Date().toISOString(),
    durationMs: frames.length ? frames[frames.length - 1]!.t : 0,
    sampleHz: SAMPLE_HZ,
    frames,
    origin: "api",
  };
  return addMove(clip);
}

export function isRecording() {
  return recording;
}

export const EPISODE_0 = {
  id: "ep-0",
  title: "Episode 0",
  date: "2026-08-24",
  place: "Belgrade",
  summary:
    "Real robot, teachable jab. Digital twin ships first. 1 kg, PETG/ALU, two motors, one arm. Not LEGO. Not a 2 m humanoid this quarter.",
};
