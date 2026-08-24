import {
  ARENA_M,
  ARM_LEN,
  CHASSIS_L,
  CHASSIS_W,
  type SimState,
} from "./sim";

export const VIEW = 256;

const C = {
  pit: "#0a0a0c",
  floor: "#14141a",
  plate: "#1c1c24",
  plate2: "#121218",
  grid: "#26262e",
  bolt: "#3a3a44",
  amber: "#ffb000",
  amberDim: "#8a5a00",
  paper: "#e8e4d8",
  chassis: "#3e3e48",
  chassisHi: "#5a5a66",
  chassisLo: "#2a2a32",
  outline: "#07070a",
  wheel: "#0c0c10",
  wheelHi: "#2a2a30",
  visor: "#7ec8e3",
  visorHot: "#d2f4ff",
  fist: "#d8d4c8",
  piston: "#9a968c",
  kill: "#e23d3d",
  rec: "#e23d3d",
  ok: "#3dd68c",
  dust: "#8a8a96",
};

export type DrawHud = {
  mode: "idle" | "record" | "play" | "kill";
  moveName: string;
  recT: number;
  recMax: number;
  playT: number;
  playMax: number;
};

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}

export function worldToView(x: number, y: number): { x: number; y: number } {
  const pad = 16;
  const inner = VIEW - pad * 2;
  const ppm = inner / ARENA_M;
  return { x: VIEW / 2 + x * ppm, y: VIEW / 2 - y * ppm };
}

export function ppm(): number {
  const pad = 16;
  return (VIEW - pad * 2) / ARENA_M;
}

function drawFloor(ctx: CanvasRenderingContext2D) {
  px(ctx, 0, 0, VIEW, VIEW, C.pit);
  const pad = 16;
  px(ctx, pad, pad, VIEW - pad * 2, VIEW - pad * 2, C.floor);
  const tile = 16;
  for (let y = pad; y < VIEW - pad; y += tile) {
    for (let x = pad; x < VIEW - pad; x += tile) {
      const odd = ((x - pad) / tile + (y - pad) / tile) % 2 === 0;
      if (odd) px(ctx, x, y, tile, tile, C.plate);
      px(ctx, x + 7, y + 7, 2, 2, C.bolt);
    }
  }
  // hazard border
  const stripe = 6;
  for (let i = 0; i < VIEW - pad * 2; i += 10) {
    const on = Math.floor(i / 5) % 2 === 0;
    const col = on ? C.amber : C.outline;
    px(ctx, pad + i, pad - stripe, 5, stripe, col);
    px(ctx, pad + i, VIEW - pad, 5, stripe, col);
    px(ctx, pad - stripe, pad + i, stripe, 5, col);
    px(ctx, VIEW - pad, pad + i, stripe, 5, col);
  }
  // corner posts
  for (const [x, y] of [
    [pad - 4, pad - 4],
    [VIEW - pad - 4, pad - 4],
    [pad - 4, VIEW - pad - 4],
    [VIEW - pad - 4, VIEW - pad - 4],
  ] as const) {
    px(ctx, x, y, 8, 8, C.amber);
    px(ctx, x + 2, y + 2, 4, 4, C.outline);
  }
}

function drawRobot(ctx: CanvasRenderingContext2D, sim: SimState) {
  const p = worldToView(sim.x, sim.y);
  const s = ppm();
  ctx.save();
  ctx.translate(Math.round(p.x), Math.round(p.y));
  ctx.rotate(-sim.yaw);
  ctx.imageSmoothingEnabled = false;

  const cw = CHASSIS_W * s;
  const cl = CHASSIS_L * s;
  const hx = cw / 2;
  const hy = cl / 2;

  // wheels
  const wh = cl * 0.72;
  const ww = Math.max(3, s * 0.03);
  const spin = ((sim.vl + sim.vr) * 8) % 6;
  px(ctx, -hx - ww, -wh / 2, ww, wh, C.wheel);
  px(ctx, hx, -wh / 2, ww, wh, C.wheel);
  px(ctx, -hx - ww + 1, -wh / 2 + ((spin + 8) % (wh - 2)), ww - 2, 2, C.wheelHi);
  px(ctx, hx + 1, -wh / 2 + ((spin + 8) % (wh - 2)), ww - 2, 2, C.wheelHi);

  // chassis
  px(ctx, -hx, -hy, cw, cl, C.outline);
  px(ctx, -hx + 1, -hy + 1, cw - 2, cl - 2, C.chassis);
  px(ctx, -hx + 2, -hy + 2, cw - 4, 3, C.chassisHi);
  // amber hood stripe
  px(ctx, -3, -hy + 3, 6, cl - 6, C.amberDim);
  px(ctx, -2, -hy + 4, 4, cl - 8, C.amber);

  // visor
  const visor = sim.kill ? C.kill : sim.extend > 0.6 ? C.visorHot : C.visor;
  px(ctx, -5, -hy + 5, 10, 4, C.outline);
  px(ctx, -4, -hy + 6, 8, 2, visor);

  // arm piston — a punch, not a wiggle
  const reach = (0.04 + sim.extend * ARM_LEN) * s;
  const fist = 6 + sim.extend * 2;
  px(ctx, -2, -hy - reach, 4, reach + 2, C.piston);
  px(ctx, -3, -hy - reach - 1, 6, 3, C.chassisLo);
  px(ctx, -fist / 2, -hy - reach - fist + 1, fist, fist, C.outline);
  px(ctx, -fist / 2 + 1, -hy - reach - fist + 2, fist - 2, fist - 2, C.fist);
  if (sim.extend > 0.7) {
    px(ctx, -fist / 2 - 3, -hy - reach - fist - 2, 2, 2, C.paper);
    px(ctx, fist / 2 + 1, -hy - reach - fist - 3, 2, 2, C.paper);
    px(ctx, -1, -hy - reach - fist - 5, 2, 3, C.amber);
  }
  if (sim.punchFlash > 0) {
    const f = sim.punchFlash;
    px(ctx, -fist, -hy - reach - fist - 4, fist * 2, 2, C.amber);
    ctx.globalAlpha = f;
    px(ctx, -12, -hy - reach - 16, 24, 8, C.amber);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function drawHud(ctx: CanvasRenderingContext2D, sim: SimState, hud: DrawHud) {
  ctx.imageSmoothingEnabled = false;
  ctx.font = "8px 'Press Start 2P', monospace";
  ctx.fillStyle = C.paper;

  const v = ((sim.vl + sim.vr) * 0.5).toFixed(2);
  ctx.fillText(`V ${v}`, 6, 12);
  ctx.fillText(`YAW ${((sim.yaw * 180) / Math.PI).toFixed(0)}`, 6, 24);

  const modeCol =
    hud.mode === "kill" ? C.kill : hud.mode === "record" ? C.rec : hud.mode === "play" ? C.ok : C.amber;
  ctx.fillStyle = modeCol;
  const label = hud.mode === "idle" ? "LIVE" : hud.mode.toUpperCase();
  ctx.fillText(label, VIEW - 8 - label.length * 8, 12);

  if (hud.moveName) {
    ctx.fillStyle = C.amber;
    const nm = hud.moveName.slice(0, 12);
    ctx.fillText(nm, VIEW / 2 - nm.length * 4, 12);
  }

  if (hud.mode === "record") {
    const w = 80;
    const x = VIEW / 2 - w / 2;
    px(ctx, x, VIEW - 14, w, 6, C.outline);
    px(ctx, x + 1, VIEW - 13, Math.round((w - 2) * Math.min(1, hud.recT / hud.recMax)), 4, C.rec);
  }
  if (hud.mode === "play") {
    const w = 80;
    const x = VIEW / 2 - w / 2;
    px(ctx, x, VIEW - 14, w, 6, C.outline);
    px(ctx, x + 1, VIEW - 13, Math.round((w - 2) * Math.min(1, hud.playT / Math.max(1, hud.playMax))), 4, C.ok);
  }

  if (hud.mode === "kill") {
    ctx.fillStyle = "rgba(226,61,61,0.18)";
    ctx.fillRect(0, 0, VIEW, VIEW);
    ctx.fillStyle = C.kill;
    ctx.font = "16px 'Press Start 2P', monospace";
    ctx.fillText("KILL", VIEW / 2 - 32, VIEW / 2);
  }
}

export function drawFrame(ctx: CanvasRenderingContext2D, sim: SimState, hud: DrawHud) {
  ctx.imageSmoothingEnabled = false;
  drawFloor(ctx);
  drawRobot(ctx, sim);
  drawHud(ctx, sim, hud);
}
