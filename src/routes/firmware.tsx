import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/firmware")({
  component: Firmware,
  head: () => ({ meta: [{ title: "FIRMWARE · HOUSE STEEL" }] }),
});

function Firmware() {
  return (
    <main className="px-4 py-6 sm:px-8">
      <p className="hud-label">ESP32-S3 · PlatformIO</p>
      <h1 className="mt-2 font-display text-lg text-amber">FIRMWARE</h1>
      <p className="mt-3 max-w-2xl font-mono text-xl text-fog">
        Same JSON as the twin. When metal exists, the site swaps transport. Do not invent a second
        protocol.
      </p>
      <pre className="mt-6 overflow-x-auto border-4 border-edge bg-graphite p-4 font-mono text-lg text-ice">
        {`cd firmware
pio run -t upload
# USB serial, newline-delimited JSON
{"v":0,"drive":{"left":0.2,"right":0.2},"arm":{"extend":0},"kill":false}`}
      </pre>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="border-4 border-edge bg-graphite p-4">
          <p className="hud-label">Pins (DevKit-C1, change in platformio.ini)</p>
          <ul className="mt-3 space-y-1 font-mono text-lg text-paper">
            <li>AIN1 / AIN2 · left motor</li>
            <li>BIN1 / BIN2 · right motor</li>
            <li>PWM A/B · TB6612 PWMA/PWMB</li>
            <li>GPIO 4 · punch servo</li>
            <li>GPIO 5 · hardware kill (NC)</li>
          </ul>
        </div>
        <div className="border-4 border-edge bg-graphite p-4">
          <p className="hud-label">Commands</p>
          <ul className="mt-3 space-y-1 font-mono text-lg text-paper">
            <li>drive.left / drive.right · -1…1</li>
            <li>arm.extend · 0…1</li>
            <li>record.start / record.stop</li>
            <li>play.name</li>
            <li>kill: true · motors 0, servo in</li>
          </ul>
        </div>
      </section>
      <p className="mt-6 font-mono text-xl text-fog">
        Header: firmware/include/protocol.h · must match src/lib/protocol/types.ts
      </p>
    </main>
  );
}
