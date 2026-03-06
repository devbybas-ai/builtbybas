/**
 * Subtle PCB-style background for inner pages.
 * Static SVG only — no animations, no JS, server-renderable.
 * Very faint — fragments peek out of the darkness at the edges.
 */
export function PageBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 45%, rgba(10, 10, 15, 1) 0%, rgba(10, 10, 15, 0.85) 50%, transparent 100%)",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-25"
        viewBox="0 0 1000 600"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Parallel bus lines — horizontal */}
        <g stroke="rgba(0, 212, 255, 0.06)" strokeWidth="0.5" fill="none">
          <line x1="30" y1="40" x2="280" y2="40" />
          <line x1="30" y1="44" x2="260" y2="44" />
          <line x1="520" y1="40" x2="700" y2="40" />
          <line x1="740" y1="40" x2="970" y2="40" />
          <line x1="760" y1="44" x2="970" y2="44" />
          <line x1="50" y1="110" x2="200" y2="110" />
          <line x1="800" y1="110" x2="960" y2="110" />
          <line x1="30" y1="195" x2="170" y2="195" />
          <line x1="830" y1="195" x2="970" y2="195" />
          <line x1="30" y1="265" x2="130" y2="265" />
          <line x1="870" y1="265" x2="970" y2="265" />
          <line x1="30" y1="335" x2="130" y2="335" />
          <line x1="870" y1="335" x2="970" y2="335" />
          <line x1="30" y1="410" x2="160" y2="410" />
          <line x1="830" y1="410" x2="970" y2="410" />
          <line x1="50" y1="485" x2="200" y2="485" />
          <line x1="800" y1="485" x2="960" y2="485" />
          <line x1="30" y1="550" x2="280" y2="550" />
          <line x1="740" y1="550" x2="970" y2="550" />
        </g>

        {/* Vertical bus lines */}
        <g stroke="rgba(0, 212, 255, 0.06)" strokeWidth="0.5" fill="none">
          <line x1="60" y1="30" x2="60" y2="180" />
          <line x1="60" y1="420" x2="60" y2="570" />
          <line x1="160" y1="30" x2="160" y2="160" />
          <line x1="160" y1="420" x2="160" y2="570" />
          <line x1="340" y1="30" x2="340" y2="160" />
          <line x1="340" y1="380" x2="340" y2="570" />
          <line x1="660" y1="30" x2="660" y2="160" />
          <line x1="660" y1="380" x2="660" y2="570" />
          <line x1="840" y1="30" x2="840" y2="160" />
          <line x1="840" y1="420" x2="840" y2="570" />
          <line x1="940" y1="30" x2="940" y2="180" />
          <line x1="940" y1="420" x2="940" y2="570" />
        </g>

        {/* Short right-angle connectors */}
        <g stroke="rgba(0, 212, 255, 0.05)" strokeWidth="0.5" fill="none">
          <path d="M80,40 V70 H120" />
          <path d="M280,40 V60 H320" />
          <path d="M700,40 V60 H740" />
          <path d="M200,110 V140 H240" />
          <path d="M960,110 V140 H920" />
          <path d="M170,195 V220 H200" />
          <path d="M130,265 V290 H170" />
          <path d="M130,335 V360 H170" />
          <path d="M160,410 V435 H200" />
          <path d="M200,485 V510 H240" />
          <path d="M960,485 V510 H920" />
          <path d="M280,550 V530 H320" />
          <path d="M700,550 V530 H740" />
        </g>

        {/* Route traces — faint */}
        <g
          stroke="rgba(0, 212, 255, 0.05)"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="square"
        >
          <path d="M0,150 H200 V250 H350 V300 H500" />
          <path d="M0,300 H150 V350 H300 V300 H500" />
          <path d="M1000,150 H850 V250 H700 V300 H500" />
          <path d="M1000,300 H850 V350 H700 V300 H500" />
          <path d="M500,0 V100 H450 V200 H500 V300" />
          <path d="M500,600 V500 H450 V400 H500 V300" />
        </g>

        {/* IC chips — very subtle */}
        <g
          stroke="rgba(0, 212, 255, 0.06)"
          strokeWidth="0.5"
          fill="rgba(0, 212, 255, 0.02)"
        >
          <rect x="70" y="55" width="35" height="50" rx="1" />
          <rect x="870" y="55" width="50" height="40" rx="1" />
          <rect x="860" y="230" width="30" height="50" rx="1" />
          <rect x="70" y="250" width="30" height="45" rx="1" />
          <rect x="195" y="500" width="45" height="35" rx="1" />
          <rect x="760" y="500" width="45" height="35" rx="1" />
        </g>

        {/* Via holes */}
        <g fill="none" stroke="rgba(0, 212, 255, 0.06)" strokeWidth="0.5">
          <circle cx="200" cy="250" r="3" />
          <circle cx="350" cy="300" r="3" />
          <circle cx="700" cy="250" r="3" />
          <circle cx="600" cy="220" r="3" />
          <circle cx="850" cy="250" r="3" />
          <circle cx="450" cy="400" r="3" />
          <circle cx="550" cy="420" r="3" />
        </g>

        {/* Junction dots */}
        <g fill="rgba(0, 212, 255, 0.15)">
          <circle cx="200" cy="250" r="1" />
          <circle cx="350" cy="300" r="1" />
          <circle cx="500" cy="300" r="1.5" />
          <circle cx="700" cy="300" r="1" />
          <circle cx="150" cy="300" r="1" />
          <circle cx="850" cy="250" r="1" />
          <circle cx="500" cy="100" r="1" />
          <circle cx="500" cy="500" r="1" />
        </g>
      </svg>

      {/* Edge fades */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
