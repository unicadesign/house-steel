import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/crew")({
  component: Crew,
  head: () => ({ meta: [{ title: "CREW · HOUSE STEEL" }] }),
});

const CREW = [
  {
    mark: "MR",
    name: "Marko",
    role: "Lead",
    station: "Pit boss. Architecture. The garage.",
    meta: "LEAD",
    fill: "bg-amber",
  },
  {
    mark: "10",
    name: "10",
    role: "Systems / Drive",
    station: "How it moves. Wheels, mix, kill path.",
    meta: "AGE 10",
    fill: "bg-paper",
  },
  {
    mark: "08",
    name: "8",
    role: "Arm",
    station: "The punch. Geometry, throw, timing.",
    meta: "AGE 8",
    fill: "bg-amber",
  },
  {
    mark: "06",
    name: "6",
    role: "Test log",
    station: "What happened. What broke. Write it down.",
    meta: "AGE 6",
    fill: "bg-paper",
  },
] as const;

function Crew() {
  return (
    <main className="px-4 py-6 sm:px-8">
      <p className="hud-label">PIT CREW</p>
      <h1 className="mt-2 font-display text-lg text-amber">HOUSE STEEL</h1>
      <p className="mt-3 max-w-2xl font-mono text-xl text-fog">
        Four stations. Initials and age marks only — no stock kid photos, no portraits.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {CREW.map((c) => (
          <li key={c.mark} className="border-4 border-edge bg-graphite p-4">
            <Portrait mark={c.mark} fill={c.fill} />
            <p className="mt-4 font-display text-[10px] text-amber">{c.role.toUpperCase()}</p>
            <h2 className="mt-2 font-display text-sm text-paper">{c.name.toUpperCase()}</h2>
            <p className="mt-2 font-mono text-xl text-fog">{c.station}</p>
            <p className="mt-2 font-display text-[8px] text-fog">{c.meta}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Portrait({ mark, fill }: { mark: string; fill: string }) {
  const ch = mark.split("");
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
            key={`${mark}-${i}`}
            className={"grid size-8 place-items-center font-display text-[10px] text-pit " + fill}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
