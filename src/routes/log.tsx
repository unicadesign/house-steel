import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/log")({
  component: Log,
  head: () => ({ meta: [{ title: "LOG · HOUSE STEEL" }] }),
});

function Log() {
  return (
    <main className="px-4 py-6 sm:px-8">
      <p className="hud-label">PIT LOG</p>
      <h1 className="mt-2 font-display text-lg text-amber">EPISODES</h1>
      <p className="mt-3 max-w-2xl font-mono text-xl text-fog">
        One entry so far. More when the garage has something to write down.
      </p>

      <article className="mt-8 max-w-2xl border-4 border-edge bg-graphite p-5">
        <p className="font-display text-[10px] text-amber">EPISODE 00 · THE PLAN</p>
        <p className="mt-2 font-display text-[10px] text-fog">2026-08-24 · BELGRADE</p>
        <h2 className="mt-4 font-display text-sm leading-relaxed text-paper">
          Real robot. Teachable later. Not a 2 m humanoid this year.
        </h2>
        <p className="mt-4 font-mono text-xl text-paper">
          House Steel is Marko and three crew — 10, 8, and 6 — in a garage in Serbia. We are
          building a combat robot. Not LEGO. Not a classroom kit. Not a story about a toy.
        </p>
        <p className="mt-4 font-mono text-xl text-fog">
          The machine lives in the garage. This site is the log: what we planned, what we built,
          what broke. Spec fields stay TBD until they are real. A punch, a drive, a pack — when we
          have them, they go on the spec page.
        </p>
        <p className="mt-4 font-mono text-xl text-paper">
          Scope this year: a garage-scale fighter we can actually finish. Teachable later. No 2
          metre humanoid. No invented numbers. Hardware first, then the next episode.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/spec" className="pixel-btn no-underline">
            OPEN SPEC
          </Link>
          <Link to="/crew" className="pixel-btn-ghost no-underline">
            CREW
          </Link>
        </div>
      </article>
    </main>
  );
}
