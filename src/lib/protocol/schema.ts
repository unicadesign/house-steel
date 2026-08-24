import { z } from "zod";
import { PROTOCOL_VERSION } from "./types";

export const driveSchema = z.object({
  left: z.number().min(-1).max(1),
  right: z.number().min(-1).max(1),
});

export const armSchema = z.object({
  extend: z.number().min(0).max(1),
});

export const recordActionSchema = z.object({
  action: z.enum(["start", "stop"]),
  name: z.string().min(1).max(24).optional(),
  durationSec: z.number().min(1).max(3).optional(),
});

export const playActionSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
});

export const commandSchema = z.object({
  v: z.literal(PROTOCOL_VERSION).default(PROTOCOL_VERSION),
  drive: driveSchema.default({ left: 0, right: 0 }),
  arm: armSchema.default({ extend: 0 }),
  record: recordActionSchema.optional(),
  play: playActionSchema.optional(),
  kill: z.boolean().optional(),
});

export const frameSchema = z.object({
  t: z.number(),
  drive: driveSchema,
  arm: armSchema,
});

export const moveClipSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(24),
  createdAt: z.string(),
  durationMs: z.number(),
  sampleHz: z.number(),
  frames: z.array(frameSchema).min(1),
  origin: z.enum(["seed", "crew", "api"]).default("crew"),
});
