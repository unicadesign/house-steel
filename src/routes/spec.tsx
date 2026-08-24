import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ROBOT_SPEC } from "@/lib/protocol/spec";
import { PROTOCOL_VERSION, SAMPLE_HZ } from "@/lib/protocol/types";

export const Route = createFileRoute("/spec")({
  component: Spec,
  head: () => ({ meta: [{ title: "SPEC · HOUSE STEEL" }] }),
});

function Spec() {
  return (
    <main className="overflow-x-hidden px-4 py-6 sm:px-8">
      <p className="hud-label">SPEC / BOM / PROTOCOL</p>
      <h1 className="mt-2 font-display text-lg text-amber">ATOM-0 · v0</h1>
      <p className="mt-3 max-w-2xl font-mono text-xl text-fog">
        The twin, the HTTP API, MCP, and the ESP32-S3 firmware share one JSON object:{" "}
        <span className="text-paper">drive, arm, record, play, kill</span>. Protocol v{PROTOCOL_VERSION}.{" "}
        {SAMPLE_HZ} Hz clips.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <Panel title="Machine">
          <Row k="Callsign" v={ROBOT_SPEC.callsign} />
          <Row k="Mass" v={`${ROBOT_SPEC.massKg} kg`} />
          <Row k="Chassis" v={ROBOT_SPEC.chassis} />
          <Row k="Drive" v={ROBOT_SPEC.drive} />
          <Row k="Arm" v={ROBOT_SPEC.arm} />
          <Row k="Battery" v={ROBOT_SPEC.battery} />
          <Row k="Arena" v={`${ROBOT_SPEC.arenaM} m square (twin)`} />
        </Panel>
        <Panel title="Wire">
          <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-all font-mono text-lg text-ice">{JSON_EXAMPLE}</pre>
        </Panel>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-sm text-paper">BOM · honest v0</h2>
        <div className="mt-3 overflow-x-auto border-4 border-edge">
          <table className="w-full min-w-[32rem] text-left font-mono text-lg">
            <thead className="bg-steel text-amber">
              <tr>
                <th className="px-3 py-2">Item</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Note</th>
              </tr>
            </thead>
            <tbody className="text-paper">
              {BOM.map((r) => (
                <tr key={r[0]} className="border-t-2 border-edge">
                  <td className="px-3 py-2">{r[0]}</td>
                  <td className="px-3 py-2 text-amber">{r[1]}</td>
                  <td className="px-3 py-2 text-fog">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-mono text-lg text-fog">
          Full write-up in docs/BOM.md · safety in docs/SAFETY.md · agents read /llms.txt
        </p>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <Link to="/firmware" className="pixel-btn-ghost text-center no-underline">
          FIRMWARE
        </Link>
        <a href="/openapi.yaml" className="pixel-btn-ghost text-center no-underline">
          OPENAPI
        </a>
        <a href="/api/spec" className="pixel-btn-ghost text-center no-underline">
          GET /api/spec
        </a>
      </section>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-4 border-edge bg-graphite p-4">
      <p className="hud-label">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-edge py-1 font-mono text-lg">
      <span className="text-fog">{k}</span>
      <span className="text-paper">{v}</span>
    </div>
  );
}

const JSON_EXAMPLE = `{
  "v": 0,
  "drive": { "left": 0.4, "right": 0.4 },
  "arm": { "extend": 0 },
  "record": { "action": "start", "name": "JAB" },
  "play": { "name": "JAB" },
  "kill": false
}`;

const BOM: [string, string, string][] = [
  ["ESP32-S3 DevKit", "1", "USB serial + later radio"],
  ["Brushed DC gearmotor", "2", "diff drive, ~1.4 m/s target"],
  ["TB6612 or DRV8833", "1", "dual H-bridge"],
  ["Metal-gear servo", "1–2", "prismatic jab 0–1"],
  ["ALU plate + PETG", "1", "no spinner, no 2 m frame"],
  ["3S LiPo 450–850 mAh", "1", "see SAFETY.md"],
  ["Wheels + hubs", "2", "rubber, ~60 mm"],
  ["Kill switch", "1", "hardware, not just Space"],
];
