import type { ArmCommand, DriveCommand, HouseSteelCommand, HouseSteelFrame } from "@/lib/protocol/types";
import { ZERO_ARM, ZERO_DRIVE, clamp1, clamp01 } from "@/lib/protocol/types";

export const ARENA_M = 1.8;
export const WHEELBASE_M = 0.14;
export const CHASSIS_L = 0.24;
export const CHASSIS_W = 0.18;
export const ARM_LEN = 0.14;
export const MAX_WHEEL_MS = 1.4;
export const WHEEL_TAU = 0.07;
export const PUNCH_OUT = 9;
export const PUNCH_IN = 5;
export const FIXED_DT = 1 / 120;

export type SimState = {
  x: number;
  y: number;
  yaw: number;
  vl: number;
  vr: number;
  extend: number;
  cmd: DriveCommand;
  armCmd: ArmCommand;
  kill: boolean;
  punchFlash: number;
};

export function createSim(): SimState {
  return {
    x: 0,
    y: -0.25,
    yaw: 0,
    vl: 0,
    vr: 0,
    extend: 0,
    cmd: { ...ZERO_DRIVE },
    armCmd: { ...ZERO_ARM },
    kill: false,
    punchFlash: 0,
  };
}

export function applyCommand(sim: SimState, cmd: HouseSteelCommand): void {
  if (cmd.kill) {
    killSim(sim);
    return;
  }
  sim.cmd = { left: clamp1(cmd.drive.left), right: clamp1(cmd.drive.right) };
  sim.armCmd = { extend: clamp01(cmd.arm.extend) };
}

export function killSim(sim: SimState): void {
  sim.cmd = { ...ZERO_DRIVE };
  sim.armCmd = { ...ZERO_ARM };
  sim.kill = true;
}

export function clearKill(sim: SimState): void {
  sim.kill = false;
}

function lag(current: number, target: number, dt: number, tau: number): number {
  const k = 1 - Math.exp(-dt / tau);
  return current + (target - current) * k;
}

/** World: +x right, +y up. yaw=0 faces +y. +yaw is CCW (player-left). */
export function stepSim(sim: SimState, dt: number): void {
  const cap = Math.min(dt, 0.05);
  const leftTarget = sim.kill ? 0 : sim.cmd.left * MAX_WHEEL_MS;
  const rightTarget = sim.kill ? 0 : sim.cmd.right * MAX_WHEEL_MS;
  sim.vl = lag(sim.vl, leftTarget, cap, WHEEL_TAU);
  sim.vr = lag(sim.vr, rightTarget, cap, WHEEL_TAU);

  const v = (sim.vl + sim.vr) * 0.5;
  const omega = (sim.vr - sim.vl) / WHEELBASE_M;
  sim.yaw += omega * cap;
  const fx = -Math.sin(sim.yaw);
  const fy = Math.cos(sim.yaw);
  sim.x += fx * v * cap;
  sim.y += fy * v * cap;

  const half = ARENA_M * 0.5 - 0.12;
  if (sim.x > half) {
    sim.x = half;
    if (fx > 0) {
      /* into +x wall */
    }
    sim.vl *= 0.2;
    sim.vr *= 0.2;
  }
  if (sim.x < -half) {
    sim.x = -half;
    sim.vl *= 0.2;
    sim.vr *= 0.2;
  }
  if (sim.y > half) {
    sim.y = half;
    sim.vl *= 0.2;
    sim.vr *= 0.2;
  }
  if (sim.y < -half) {
    sim.y = half * -1;
    sim.vl *= 0.2;
    sim.vr *= 0.2;
  }

  const want = sim.kill ? 0 : sim.armCmd.extend;
  const rate = want > sim.extend ? PUNCH_OUT : PUNCH_IN;
  const prev = sim.extend;
  if (sim.extend < want) sim.extend = Math.min(want, sim.extend + rate * cap);
  else sim.extend = Math.max(want, sim.extend - rate * cap);
  if (sim.extend > 0.85 && prev <= 0.85) sim.punchFlash = 1;
  if (sim.punchFlash > 0) sim.punchFlash = Math.max(0, sim.punchFlash - cap * 6);
}

export function headingForward(yaw: number): { x: number; y: number } {
  return { x: -Math.sin(yaw), y: Math.cos(yaw) };
}

export function snapshotFrame(sim: SimState, t: number): HouseSteelFrame {
  return {
    t,
    drive: { left: clamp1(sim.cmd.left), right: clamp1(sim.cmd.right) },
    arm: { extend: clamp01(sim.extend) },
  };
}

export function speedMs(sim: SimState): number {
  return (sim.vl + sim.vr) * 0.5;
}
