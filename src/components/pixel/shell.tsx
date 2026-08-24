import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "PIT" },
  { to: "/lab", label: "LAB" },
  { to: "/spec", label: "SPEC" },
  { to: "/log", label: "LOG" },
  { to: "/crew", label: "CREW" },
  { to: "/firmware", label: "FW" },
] as const;

export function PixelShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lab = pathname === "/lab";

  return (
    <div className="relative min-h-dvh bg-pit text-paper">
      <div className="scanlines" aria-hidden="true" />
      <div className="crt-vignette" aria-hidden="true" />
      <header className="relative z-20 flex items-stretch border-b-4 border-edge bg-graphite">
        <Link
          to="/"
          className="flex items-center gap-3 border-r-4 border-edge px-3 py-3 text-amber no-underline sm:px-4"
        >
          <span className="grid size-8 place-items-center bg-amber text-pit" aria-hidden="true">
            <span className="font-display text-[10px] leading-none">HS</span>
          </span>
          <span className="hidden font-display text-[10px] leading-relaxed text-amber sm:block">
            HOUSE
            <br />
            STEEL
          </span>
        </Link>
        <nav className="flex min-w-0 flex-1 overflow-x-auto">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "flex min-h-11 min-w-11 items-center justify-center px-3 font-display text-[9px] no-underline sm:px-4 sm:text-[10px] " +
                  (active ? "bg-amber text-pit" : "text-fog hover:bg-steel hover:text-paper")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center border-l-4 border-edge px-3 font-display text-[8px] text-fog md:flex">
          ATOM-0
          <span className="ml-2 text-ok">● LIVE</span>
        </div>
      </header>
      <div className={lab ? "relative z-10" : "relative z-10 mx-auto w-full max-w-6xl"}>{children}</div>
    </div>
  );
}
