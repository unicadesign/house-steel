import type { RobotSpec } from "./types";
import { PROTOCOL_VERSION } from "./types";

export const ROBOT_SPEC: RobotSpec = {
  name: "ATOM-0",
  callsign: "ATOM-0",
  massKg: 1,
  chassis: "PETG shell on ALU plate",
  drive: "2× brushed DC, differential, TB6612",
  arm: "1× metal-gear servo, prismatic jab 0–1",
  battery: "3S LiPo 450–850 mAh",
  arenaM: 1.8,
  maxWheelMs: 1.4,
  wheelBaseM: 0.14,
  protocol: PROTOCOL_VERSION,
};

export const CREW = [
  {
    id: "lead",
    initials: "MR",
    name: "Marko Randelovic",
    role: "Lead",
    station: "Systems architecture, pit boss",
    age: null as number | null,
    accent: "amber",
  },
  {
    id: "drive",
    initials: "DRV",
    name: "Drive",
    role: "Systems / Drive",
    station: "Differential mix, wheel response, kill path",
    age: 10,
    accent: "ice",
  },
  {
    id: "arm",
    initials: "ARM",
    name: "Arm",
    role: "Arm",
    station: "Punch geometry, servo throw, jab timing",
    age: 8,
    accent: "amber",
  },
  {
    id: "test",
    initials: "TST",
    name: "Test",
    role: "Test protocol",
    station: "Record/play, kill drill, clip naming",
    age: 6,
    accent: "ok",
  },
] as const;
