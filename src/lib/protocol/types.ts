/**
 * House Steel wire protocol v0.
 * Same JSON on the digital twin, HTTP API, MCP, and ESP32-S3 firmware.
 * Keep firmware/include/protocol.h in lockstep with this file.
 */

export const PROTOCOL_VERSION = 0 as const;
export const SAMPLE_HZ = 50;
export const RECORD_MIN_MS = 1000;
export const RECORD_MAX_MS = 3000;

/** Left/right wheel PWM. -1 full reverse … +1 full forward. */
export type DriveCommand = {
  left: number;
  right: number;
};

/** Prismatic punch: 0 retracted … 1 fully extended. */
export type ArmCommand = {
  extend: number;
};

export type RecordAction = {
  action: "start" | "stop";
  name?: string;
  /** Clamp 1–3 seconds on the recorder. */
  durationSec?: number;
};

export type PlayAction = {
  id?: string;
  name?: string;
};

export type HouseSteelFrame = {
  /** Milliseconds from clip start (record/play) or epoch (live). */
  t: number;
  drive: DriveCommand;
  arm: ArmCommand;
};

export type HouseSteelCommand = {
  v: typeof PROTOCOL_VERSION;
  drive: DriveCommand;
  arm: ArmCommand;
  record?: RecordAction;
  play?: PlayAction;
  /** Emergency stop: zeros drive, retracts arm, aborts record/play. */
  kill?: boolean;
};

export type MoveOrigin = "seed" | "crew" | "api";

export type MoveClip = {
  id: string;
  name: string;
  createdAt: string;
  durationMs: number;
  sampleHz: number;
  frames: HouseSteelFrame[];
  origin: MoveOrigin;
};

export type RobotSpec = {
  name: string;
  callsign: string;
  massKg: number;
  chassis: string;
  drive: string;
  arm: string;
  battery: string;
  arenaM: number;
  maxWheelMs: number;
  wheelBaseM: number;
  protocol: typeof PROTOCOL_VERSION;
};

export const ZERO_DRIVE: DriveCommand = { left: 0, right: 0 };
export const ZERO_ARM: ArmCommand = { extend: 0 };

export function clamp1(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(-1, Math.min(1, n));
}

export function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function liveCommand(
  drive: DriveCommand,
  arm: ArmCommand,
  extras: Partial<Omit<HouseSteelCommand, "v" | "drive" | "arm">> = {},
): HouseSteelCommand {
  return {
    v: PROTOCOL_VERSION,
    drive: { left: clamp1(drive.left), right: clamp1(drive.right) },
    arm: { extend: clamp01(arm.extend) },
    ...extras,
  };
}
