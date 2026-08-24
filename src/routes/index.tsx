import { createFileRoute, Link } from "@tanstack/react-router";
import { Chassis } from "@/components/pixel/chassis";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main>
      <section className="grid gap-0 border-b-4 border-edge md:grid-cols-2">
        <div className="flex flex-col justify-end border-b-4 border-edge bg-graphite p-5 md:border-r-4 md:border-b-0 sm:p-8">
          <p className="hud-label">BELGRADE GARAGE · 2026</p>
          <h1 className="mt-3 font-display text-xl leading-relaxed text-amber sm:text-3xl">
            HOUSE
            <br />
            STEEL
          </h1>
          <p className="mt-4 max-w-md font-mono text-xl text-paper sm:text-2xl">
            A family in Serbia is building a real combat robot. Marko leads. Crew is 10, 8, and 6.
            The machine is welded in the garage — not in this repo.
          </p>
          <p className="mt-4 font-mono text-xl text-fog">This site is the log. Nothing else.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/log" className="pixel-btn inline-flex items-center no-underline">
              OPEN THE LOG
            </Link>
            <Link to="/spec" className="pixel-btn-ghost inline-flex items-center no-underline">
              SPEC
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center bg-pit p-6 sm:p-8">
          <Chassis />
          <p className="mt-3 font-display text-[8px] text-fog">CHASSIS · UNBUILT</p>
        </div>
      </section>

      <section className="grid gap-0 md:grid-cols-3">
        <div className="border-b-4 border-edge p-5 md:border-r-4 md:border-b-0">
          <p className="hud-label">What this is</p>
          <p className="mt-3 font-mono text-xl text-paper">
            A pit-crew build log. Hardware, then numbers. Teachable later. Honest empty fields until
            the garage fills them.
          </p>
        </div>
        <div className="border-b-4 border-edge p-5 md:border-r-4 md:border-b-0">
          <p className="hud-label">What this is not</p>
          <ul className="mt-3 space-y-2 font-mono text-xl text-fog">
            <li>— not LEGO</li>
            <li>— not a toy story</li>
            <li>— not STEM Saturday</li>
            <li>— not a 2 m humanoid this year</li>
          </ul>
        </div>
        <div className="p-5">
          <p className="hud-label">Crew</p>
          <p className="mt-3 font-mono text-xl text-paper">
            Four stations. Initials only. The robot is real metal, later.
          </p>
          <Link to="/crew" className="mt-4 inline-block font-display text-[10px] text-amber">
            SEE THE CREW →
          </Link>
        </div>
      </section>
    </main>
  );
}
