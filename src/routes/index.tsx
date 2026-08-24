import { createFileRoute, Link } from "@tanstack/react-router";
import { ROBOT_SPEC } from "@/lib/protocol/spec";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main>
      <section className="relative overflow-hidden border-b-4 border-edge">
        <img
          src="/art/hero.jpg"
          alt="ATOM-0 in the pit, arm cocked for a jab"
          className="pixel h-[min(62dvh,520px)] w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-t from-pit via-pit/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 pb-16 sm:p-8 sm:pb-16">
          <p className="font-display text-[10px] text-amber">HOUSE STEEL · EPISODE 0</p>
          <h1 className="mt-3 font-display text-xl leading-relaxed text-paper sm:text-3xl">
            TEACH
            <br />
            THE JAB
          </h1>
          <p className="mt-3 max-w-xl font-mono text-xl text-paper sm:text-2xl">
            Real machine. One kilogram. Two wheels. One arm. Not Zeus. Not a spinner. Not next
            quarter's humanoid. ATOM-0 learns a move the way Atom did — you show it.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/lab" className="pixel-btn inline-flex items-center no-underline">
              ENTER THE LAB
            </Link>
            <Link to="/spec" className="pixel-btn-ghost inline-flex items-center no-underline">
              READ THE SPEC
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-0 border-b-4 border-edge md:grid-cols-4">
        {[
          ["MASS", `${ROBOT_SPEC.massKg} kg`],
          ["DRIVE", "DIFF 2×"],
          ["ARM", "1 JAB"],
          ["PACK", "3S LiPo"],
        ].map(([k, v]) => (
          <div key={k} className="border-b-4 border-edge p-4 md:border-b-0 md:border-r-4 md:last:border-r-0">
            <p className="hud-label">{k}</p>
            <p className="mt-2 font-display text-sm text-amber">{v}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-0 md:grid-cols-2">
        <div className="border-b-4 border-edge p-5 md:border-r-4 md:border-b-0">
          <p className="hud-label">Honest v0</p>
          <h2 className="mt-2 font-display text-sm text-paper">1 kg pit bot. This quarter.</h2>
          <p className="mt-3 font-mono text-xl text-fog">
            PETG over an ALU plate. Two motors. One or two servos. No weapon spinner — a teachable
            punch. The digital twin on this site is the same JSON the ESP32-S3 will speak when the
            metal exists. Record 1–3 seconds. Name it. Play it back. Kill is always Space.
          </p>
        </div>
        <div className="p-5">
          <p className="hud-label">What this is not</p>
          <ul className="mt-3 space-y-2 font-mono text-xl text-fog">
            <li>— not LEGO, not a classroom kit</li>
            <li>— not a 2 m humanoid (not this quarter)</li>
            <li>— not a neural net, not vision, not ROS 2</li>
            <li>— not BattleBots cosplay</li>
          </ul>
          <p className="mt-4 font-mono text-xl text-paper">
            Crew of four. Belgrade pit. Systems, arm, test protocol, lead.
          </p>
          <Link to="/crew" className="mt-4 inline-block font-display text-[10px] text-amber">
            SEE THE CREW →
          </Link>
        </div>
      </section>
    </main>
  );
}
