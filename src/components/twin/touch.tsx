import { useRef } from "react";

type Props = {
  onMove: (throttle: number, steer: number) => void;
  onPunch: (v: boolean) => void;
  onKill: (v: boolean) => void;
};

export function TouchPad({ onMove, onPunch, onKill }: Props) {
  const pad = useRef<HTMLDivElement>(null);
  const pointer = useRef<number | null>(null);

  function setFromEvent(e: React.PointerEvent) {
    const el = pad.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const steer = Math.max(-1, Math.min(1, -(x - 0.5) * 2));
    const throttle = Math.max(-1, Math.min(1, -(y - 0.5) * 2));
    onMove(throttle, steer);
  }

  return (
    <div className="mt-auto grid grid-cols-[1fr_auto] gap-3 lg:hidden">
      <div
        ref={pad}
        className="relative h-32 touch-none border-4 border-edge bg-pit"
        onPointerDown={(e) => {
          pointer.current = e.pointerId;
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          setFromEvent(e);
        }}
        onPointerMove={(e) => {
          if (pointer.current !== e.pointerId) return;
          setFromEvent(e);
        }}
        onPointerUp={(e) => {
          if (pointer.current !== e.pointerId) return;
          pointer.current = null;
          onMove(0, 0);
        }}
        onPointerCancel={() => {
          pointer.current = null;
          onMove(0, 0);
        }}
      >
        <span className="pointer-events-none absolute inset-0 grid place-items-center font-display text-[8px] text-fog">
          STICK
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="pixel-btn min-w-20 flex-1"
          onPointerDown={() => onPunch(true)}
          onPointerUp={() => onPunch(false)}
          onPointerCancel={() => onPunch(false)}
        >
          JAB
        </button>
        <button
          type="button"
          className="pixel-btn-kill min-w-20 flex-1"
          onPointerDown={() => onKill(true)}
          onPointerUp={() => onKill(false)}
          onPointerCancel={() => onKill(false)}
        >
          KILL
        </button>
      </div>
    </div>
  );
}
