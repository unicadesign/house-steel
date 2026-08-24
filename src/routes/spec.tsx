import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/spec")({
  component: Spec,
  head: () => ({ meta: [{ title: "SPEC · HOUSE STEEL" }] }),
});

const FIELDS: { key: string; label: string; note: string }[] = [
  { key: "SIZE", label: "SIZE", note: "Footprint, mass, class. Empty until measured." },
  { key: "DRIVE", label: "DRIVE", note: "How it moves. Empty until the motors exist." },
  { key: "PUNCH", label: "PUNCH", note: "The hit. Empty until the arm is real." },
  { key: "POWER", label: "POWER", note: "The pack. Empty until we buy one." },
];

function Spec() {
  return (
    <main className="px-4 py-6 sm:px-8">
      <p className="hud-label">MACHINE SPEC</p>
      <h1 className="mt-2 font-display text-lg text-amber">TBD</h1>
      <p className="mt-3 max-w-2xl font-mono text-xl text-fog">
        Honest empty sheet. The family fills these in the garage. No invented numbers on this page.
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className="border-4 border-edge bg-graphite p-4">
            <p className="hud-label">{f.label}</p>
            <p className="mt-3 font-display text-sm text-amber">TBD</p>
            <p className="mt-3 font-mono text-xl text-fog">{f.note}</p>
          </div>
        ))}
      </section>

      <p className="mt-8 max-w-2xl font-mono text-xl text-paper">
        Status: unbuilt. When a field is real, it stops being TBD. Until then it stays blank on
        purpose.
      </p>
    </main>
  );
}
