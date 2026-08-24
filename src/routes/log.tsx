import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/log")({
  component: Log,
  head: () => ({ meta: [{ title: "LOG · HOUSE STEEL" }] }),
});

function Log() {
  return (
    <main className="px-4 py-6 sm:px-8">
      <p className="hud-label">PIT LOG</p>
      <h1 className="mt-2 font-display text-lg text-amber">EPISODE 0</h1>
      <p className="mt-1 font-display text-[10px] text-fog">2026-08-24 · Belgrade</p>

      <article className="mt-8 max-w-2xl border-4 border-edge bg-graphite p-5">
        <p className="font-display text-[10px] text-ok">STATUS · TWIN ONLINE</p>
        <h2 className="mt-3 font-display text-sm leading-relaxed text-paper">
          Real robot. Teachable jab. Not LEGO. Not a 2 m humanoid yet.
        </h2>
        <p className="mt-4 font-mono text-xl text-paper">
          House Steel is a family pit in Serbia: Marko plus three crew (10, 8, 6). The machine is
          one kilogram of PETG, aluminium, two motors and a punching arm. The software this episode
          is the pit log and the digital twin — same JSON the firmware will speak.
        </p>
        <p className="mt-4 font-mono text-xl text-fog">
          North star is Real Steel, 2011, Atom: underdog, teachable moves. We are not building Zeus.
          We are not building a horizontal spinner. We are teaching a jab you can see, name, and
          replay. Record 1–3 seconds of drive + arm. Play it back. Kill is Space. When the metal
          exists, the site swaps transport. The protocol does not change.
        </p>
        <p className="mt-4 font-mono text-xl text-paper">
          Out of scope this run: buying parts, cameras, training a policy, ROS 2, Unity, a shop.
          Hardware after the twin is proud.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/lab" className="pixel-btn no-underline">
            OPEN LAB
          </Link>
          <Link to="/crew" className="pixel-btn-ghost no-underline">
            CREW
          </Link>
        </div>
      </article>
    </main>
  );
}
