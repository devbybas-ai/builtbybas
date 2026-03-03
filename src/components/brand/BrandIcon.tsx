export function BrandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter id="bbb-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bbb-layer-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Layer 3 — back, most faded */}
      <path
        d="M4 38 L40 33 L40 43 L4 48 Z"
        fill="#070E1A"
        stroke="rgba(0,212,255,0.22)"
        strokeWidth="0.75"
      />
      <line x1="8" y1="39.6" x2="30" y2="36.5" stroke="rgba(0,212,255,0.18)" strokeWidth="0.5" strokeDasharray="4 3" />
      <line x1="8" y1="42.5" x2="20" y2="40.8" stroke="rgba(0,212,255,0.12)" strokeWidth="0.5" strokeDasharray="3 4" />

      {/* Layer 2 — middle */}
      <path
        d="M4 26 L40 21 L40 31 L4 36 Z"
        fill="#0B1624"
        stroke="rgba(0,212,255,0.48)"
        strokeWidth="0.75"
      />
      <line x1="8" y1="27.6" x2="34" y2="23.9" stroke="rgba(0,212,255,0.38)" strokeWidth="0.5" strokeDasharray="4 3" />
      <line x1="8" y1="31.2" x2="24" y2="28.4" stroke="rgba(0,212,255,0.22)" strokeWidth="0.5" strokeDasharray="3 4" />

      {/* Layer 1 — front, brightest */}
      <path
        d="M4 14 L40 9 L40 19 L4 24 Z"
        fill="#0F1E30"
        stroke="#00D4FF"
        strokeWidth="1"
        filter="url(#bbb-layer-glow)"
      />
      <line x1="8" y1="15.6" x2="36" y2="11.6" stroke="rgba(0,212,255,0.62)" strokeWidth="0.55" strokeDasharray="4 3" />
      <line x1="8" y1="19.2" x2="26" y2="16.1" stroke="rgba(0,212,255,0.35)" strokeWidth="0.55" strokeDasharray="3 4" />
      <line x1="28" y1="11.8" x2="36" y2="10.7" stroke="rgba(0,212,255,0.25)" strokeWidth="0.55" strokeDasharray="2 3" />

      {/* B — white, glowing, centered */}
      <text
        x="22"
        y="43"
        fontFamily="system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="32"
        fill="white"
        textAnchor="middle"
        filter="url(#bbb-glow)"
      >
        B
      </text>
    </svg>
  );
}
