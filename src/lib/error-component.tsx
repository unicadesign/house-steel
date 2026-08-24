import type { ErrorComponentProps } from "@tanstack/react-router";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-pit px-6 text-center text-paper">
      <p className="font-display text-[10px] text-kill">FAULT</p>
      <h1 className="font-display text-sm text-amber">SYSTEM TRIP</h1>
      <p className="max-w-md font-mono text-xl text-fog break-words">
        {error.message || "Unexpected fault. Reload the pit."}
      </p>
    </main>
  );
}
