import { createFileRoute } from "@tanstack/react-router";
import { CREW } from "@/lib/protocol/spec";

export const Route = createFileRoute("/crew")({
  component: Crew,
  head: () => ({ meta: [{ title: "CREW · HOUSE STEEL" }] }),
});

export function Crew() {
  return (
    <main className="px-4 py-6 sm:px-8">
      <p className="hud-label">PIT CREW</p>
      <h1 className="mt-2 font-display text-lg text-amber">HOUSE STEEL</h1>
      <p className="mt-3 max-w-2xl font-mono text-xl text-fog">
        Four stations. Pixel initials, not stock photos. Speak to them as engineers — because that
        is the job.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {CREW.map((c) => (
          <li key={c.id} className="border-4 border-edge bg-graphite p-4">
            <Portrait initials={c.initials} accent={c.accent} />
            <p className="mt-4 font-display text-[10px] text-amber">{c.role.toUpperCase()}</p>
            <h2 className="mt-2 font-display text-sm text-paper">{c.name}</h2>
            <p className="mt-2 font-mono text-xl text-fog">{c.station}</p>
            {c.age ? (
              <p className="mt-2 font-display text-[8px] text-fog">AGE {c.age}</p>
            ) : (
              <p className="mt-2 font-display text-[8px] text-fog">LEAD</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

function Portrait({ initials, accent }: { initials: string; accent: string }) {
  const fill = accent === "ice" ? "bg-ice" : accent === "ok" ? "bg-ok" : "bg-amber";
  const ch = initials.slice(0, 3).split("");
  return (
    <div className="flex h-28 items-end gap-1 bg-pit p-3" aria-hidden="true">
      <div className="relative h-20 w-16 bg-steel">
        <div className={"absolute inset-x-3 top-2 h-6 " + fill} />
        <div className="absolute inset-x-2 top-8 h-3 bg-edge" />
        <div className="absolute inset-x-4 bottom-2 h-6 bg-panel" />
      </div>
      <div className="mb-2 flex gap-1">
        {ch.map((c, i) => (
          <span
            key={`${initials}-${i}`}
            className={"grid size-8 place-items-center font-display text-[10px] text-pit " + fill}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
