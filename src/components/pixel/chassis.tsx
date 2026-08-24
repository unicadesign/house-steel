/** Unbuilt combat chassis — pixel schematic, not a finished machine. */
export function Chassis() {
  return (
    <svg
      viewBox="0 0 96 56"
      width="384"
      height="224"
      className="h-auto w-full max-w-[384px]"
      shapeRendering="crispEdges"
      aria-label="Unbuilt combat chassis schematic"
    >
      <rect width="96" height="56" fill="#0a0a0c" />
      {/* pit floor */}
      <rect x="0" y="48" width="96" height="8" fill="#141418" />
      <rect x="0" y="48" width="96" height="2" fill="#3a3a44" />
      {/* jack stands */}
      <rect x="18" y="40" width="4" height="10" fill="#3a3a44" />
      <rect x="66" y="40" width="4" height="10" fill="#3a3a44" />
      {/* wheels */}
      <rect x="12" y="32" width="12" height="12" fill="#3a3a44" />
      <rect x="15" y="35" width="6" height="6" fill="#0a0a0c" />
      <rect x="64" y="32" width="12" height="12" fill="#3a3a44" />
      <rect x="67" y="35" width="6" height="6" fill="#0a0a0c" />
      {/* hull */}
      <rect x="16" y="16" width="56" height="20" fill="#1c1c22" />
      <rect x="16" y="16" width="56" height="2" fill="#3a3a44" />
      <rect x="18" y="20" width="16" height="8" fill="#141418" />
      <rect x="38" y="20" width="16" height="8" fill="#141418" />
      {/* stub punch arm */}
      <rect x="72" y="20" width="16" height="8" fill="#ffb000" />
      <rect x="84" y="18" width="8" height="12" fill="#ffb000" />
      {/* hatch bolt */}
      <rect x="58" y="22" width="4" height="4" fill="#ffb000" />
      {/* TBD stamp */}
      <rect x="36" y="4" width="28" height="8" fill="#ffb000" />
    </svg>
  );
}
