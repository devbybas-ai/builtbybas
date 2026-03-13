"use client";

import { useId } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

export type PCBVariant =
  | "bus-cluster"
  | "ic-chip"
  | "via-cluster"
  | "trace-path"
  | "smd-components"
  | "corner-piece";

type ConnectorDir = "top" | "right" | "bottom" | "left";

interface PCBFragmentProps {
  variant: PCBVariant;
  className?: string;
  flip?: boolean;
  scale?: number;
  /** Directions where connector traces extend out toward adjacent content */
  connectors?: ConnectorDir[];
}

const W = 400;
const H = 280;

const ANIM_CSS = `
@keyframes pcb-flow{0%{stroke-dashoffset:400}100%{stroke-dashoffset:-400}}
@keyframes pcb-glow{0%,100%{opacity:.2}50%{opacity:1}}
@keyframes pcb-conn{0%{stroke-dashoffset:80}100%{stroke-dashoffset:-80}}
.pcb-sig{stroke-dasharray:20 380;animation:pcb-flow 4s linear infinite}
.pcb-sig-s{stroke-dasharray:25 375;animation:pcb-flow 7s linear infinite}
.pcb-led{animation:pcb-glow 3s ease-in-out infinite}
.pcb-led-alt{animation:pcb-glow 4.5s ease-in-out 1s infinite}
.pcb-conn{stroke-dasharray:8 72;animation:pcb-conn 3s linear infinite}
`;

interface TraceData {
  traces: string[];
  pulseTraces: string[];
  junctions: [number, number, number][];
  vias?: [number, number, number][];
  pads?: [number, number, number, number][];
  chip?: [number, number, number, number];
  leds?: [number, number, string][];
}

const TRACES: Record<PCBVariant, TraceData> = {
  "bus-cluster": {
    traces: [
      "M40,60 H220 V100 H340",
      "M40,72 H210 V112 H330",
      "M40,84 H200 V124 H320",
      "M40,96 H190 V136 H310",
      "M220,100 V170 H160",
      "M160,170 H100 V220",
    ],
    pulseTraces: ["M40,84 H200 V124 H320", "M220,100 V170 H160"],
    junctions: [
      [220, 100, 3], [210, 112, 2.5], [200, 124, 2.5], [190, 136, 2.5],
      [340, 100, 2], [160, 170, 2.5], [100, 220, 2],
    ],
    pads: [[100, 53, 22, 10], [260, 94, 18, 9], [130, 162, 20, 10]],
    leds: [[350, 42, "#00D4FF"], [362, 42, "#4ADE80"]],
  },
  "ic-chip": {
    traces: [
      "M100,85 H140", "M100,100 H140", "M100,120 H140",
      "M100,140 H140", "M100,155 H140",
      "M260,85 H300", "M260,100 H300", "M260,120 H300",
      "M260,140 H300", "M260,155 H300",
      "M100,85 H60 V50 H110",
      "M100,155 H50 V210 H100",
      "M300,100 H350 V55",
      "M300,140 H340 V200 H300",
    ],
    pulseTraces: ["M100,120 H140", "M260,120 H300", "M100,85 H60 V50 H110"],
    junctions: [
      [110, 50, 2], [100, 210, 2], [350, 55, 2], [300, 200, 2],
    ],
    chip: [140, 70, 120, 100],
    leds: [[170, 78, "#00D4FF"], [190, 78, "#00D4FF"], [210, 78, "#4ADE80"]],
  },
  "via-cluster": {
    traces: [
      "M80,65 H170 V110",
      "M170,110 H280 V170",
      "M170,110 V170 H120",
      "M280,170 V225 H210",
      "M120,170 V220 H210",
    ],
    pulseTraces: ["M80,65 H170 V110 H280 V170"],
    junctions: [[55, 65, 2], [310, 170, 2], [210, 240, 2]],
    vias: [
      [80, 65, 10], [170, 110, 12], [280, 170, 10],
      [120, 170, 9], [210, 225, 9],
    ],
    leds: [[345, 42, "#00D4FF"], [357, 42, "#4ADE80"]],
  },
  "trace-path": {
    traces: [
      "M50,45 H150 V90 H100 V140 H220 V195 H130 V240",
      "M57,52 H143 V97 H107 V147 H213 V202 H137 V247",
      "M150,90 H240", "M100,140 H55", "M220,195 H300",
    ],
    pulseTraces: ["M50,45 H150 V90 H100 V140 H220 V195 H130 V240"],
    junctions: [
      [50, 45, 2.5], [130, 240, 2.5], [240, 90, 2],
      [55, 140, 2], [300, 195, 2],
    ],
    pads: [[80, 80, 16, 8], [140, 130, 16, 8], [195, 185, 16, 8]],
    leds: [[350, 240, "#00D4FF"]],
  },
  "smd-components": {
    traces: [
      "M60,80 H160 V125 H270",
      "M270,125 V180 H330",
      "M60,80 V150 H120",
      "M330,180 H360 V125",
      "M120,150 V210", "M360,125 H375",
    ],
    pulseTraces: ["M60,80 H160 V125 H270 V180 H330"],
    junctions: [
      [160, 125, 2.5], [270, 125, 2], [45, 80, 2],
      [375, 125, 2], [120, 210, 2],
    ],
    pads: [
      [45, 72, 26, 14], [258, 117, 22, 13],
      [320, 172, 24, 13], [112, 142, 16, 20],
    ],
    leds: [[345, 42, "#00D4FF"], [357, 42, "#00D4FF"], [369, 42, "#4ADE80"]],
  },
  "corner-piece": {
    traces: [
      "M100,38 V145 H200", "M115,38 V133 H215", "M130,38 V121 H230",
      "M175,145 H340", "M183,155 H340", "M191,165 H340",
      "M100,145 H175", "M115,133 V155 H183", "M130,121 V165 H191",
    ],
    pulseTraces: ["M100,38 V145 H340", "M130,38 V121 H230"],
    junctions: [
      [100, 145, 3], [115, 133, 2.5], [130, 121, 2.5],
      [340, 145, 2], [340, 155, 2], [340, 165, 2],
    ],
    vias: [[110, 145, 12]],
    pads: [[220, 138, 20, 10], [270, 158, 18, 9]],
    leds: [[345, 42, "#00D4FF"], [357, 42, "#4ADE80"]],
  },
};

/* ---------- Connector geometry ---------- */
/* Connectors are traces that extend from fragment edge nodes outward,
   visually "plugging into" adjacent content like power connections. */

interface ConnectorLine {
  path: string;
  endX: number;
  endY: number;
}

function getConnectors(dir: ConnectorDir): ConnectorLine[] {
  const ext = 140; // how far out connectors extend
  switch (dir) {
    case "right":
      return [
        { path: `M${W - 30},100 H${W + ext}`, endX: W + ext, endY: 100 },
        { path: `M${W - 50},180 H${W - 20} V160 H${W + ext - 30}`, endX: W + ext - 30, endY: 160 },
      ];
    case "left":
      return [
        { path: `M30,120 H${-ext}`, endX: -ext, endY: 120 },
        { path: `M50,200 H30 V180 H${-ext + 30}`, endX: -ext + 30, endY: 180 },
      ];
    case "top":
      return [
        { path: `M160,30 V${-ext + 20}`, endX: 160, endY: -ext + 20 },
        { path: `M260,50 V30 H240 V${-ext + 40}`, endX: 240, endY: -ext + 40 },
      ];
    case "bottom":
      return [
        { path: `M150,${H - 30} V${H + ext}`, endX: 150, endY: H + ext },
        { path: `M280,${H - 50} V${H - 20} H260 V${H + ext - 30}`, endX: 260, endY: H + ext - 30 },
      ];
  }
}

/* ---------- SVG Rendering ---------- */

function FragmentSVG({
  variant,
  animated,
  clipId,
  connectors,
}: {
  variant: PCBVariant;
  animated: boolean;
  clipId: string;
  connectors?: ConnectorDir[];
}) {
  const data = TRACES[variant];
  const shadowId = `${clipId}-sh`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className="h-full w-full"
      overflow="visible"
    >
      {animated && <style>{ANIM_CSS}</style>}

      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={W} height={H} />
        </clipPath>
        {/* Top inset shadow — stronger for depth */}
        <linearGradient id={shadowId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        {/* Left inset shadow */}
        <linearGradient id={`${shadowId}-l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(0,0,0,0.4)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        {/* Bottom highlight — light catching far edge */}
        <linearGradient id={`${shadowId}-b`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        {/* Right highlight */}
        <linearGradient id={`${shadowId}-r`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>

      {/* ===== RECESSED INTERIOR ===== */}
      {/* Slightly darker than page bg to create depth */}
      <rect width={W} height={H} rx="3" fill="#060609" />
      {/* Outer ridge — top-left dark edge (shadow side) */}
      <rect x="-1" y="-1" width={W + 2} height={H + 2} rx="4"
        fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" />
      {/* Outer ridge — bottom-right light edge (highlight side) */}
      <rect x="-0.5" y="-0.5" width={W + 1} height={H + 1} rx="3.5"
        fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      {/* Inner border — faint cyan glow */}
      <rect width={W} height={H} rx="3"
        fill="none" stroke="rgba(0,212,255,0.06)" strokeWidth="0.5" />

      {/* Inset depth shadows — all four edges */}
      <rect x="0" y="0" width={W} height="20" fill={`url(#${shadowId})`} />
      <rect x="0" y="0" width="24" height={H} fill={`url(#${shadowId}-l)`} />
      <rect x="0" y={H - 8} width={W} height="8" fill={`url(#${shadowId}-b)`} />
      <rect x={W - 8} y="0" width="8" height={H} fill={`url(#${shadowId}-r)`} />

      {/* ===== CIRCUIT TRACES ===== */}
      <g clipPath={`url(#${clipId})`}>
        {/* Base traces — brighter */}
        {data.traces.map((d, i) => (
          <path key={`t${i}`} d={d}
            stroke="rgba(0,212,255,0.15)" strokeWidth="0.8" />
        ))}

        {/* Animated signal pulses — brighter */}
        {data.pulseTraces.map((d, i) => (
          <path key={`p${i}`} d={d}
            stroke="rgba(0,212,255,0.4)" strokeWidth="1.2"
            strokeLinecap="round"
            className={animated ? (i % 2 === 0 ? "pcb-sig" : "pcb-sig-s") : undefined}
            opacity={animated ? 1 : 0} />
        ))}

        {/* IC Chip body */}
        {data.chip && (
          <>
            <rect
              x={data.chip[0]} y={data.chip[1]}
              width={data.chip[2]} height={data.chip[3]}
              rx="2" stroke="rgba(0,212,255,0.14)" strokeWidth="0.8"
              fill="none" />
            <circle
              cx={data.chip[0] + 12} cy={data.chip[1] + 12}
              r="3" stroke="rgba(0,212,255,0.08)" strokeWidth="0.5"
              fill="none" />
          </>
        )}

        {/* Via holes */}
        {data.vias?.map(([cx, cy, r], i) => (
          <g key={`v${i}`}>
            <circle cx={cx} cy={cy} r={r}
              stroke="rgba(0,212,255,0.14)" strokeWidth="0.6" fill="none" />
            <circle cx={cx} cy={cy} r={r * 0.35}
              fill="rgba(0,212,255,0.10)"
              className={animated ? (i % 2 === 0 ? "pcb-led" : "pcb-led-alt") : undefined}
              opacity={animated ? undefined : 0.1} />
          </g>
        ))}

        {/* SMD pads */}
        {data.pads?.map(([x, y, w, h], i) => (
          <rect key={`pad${i}`} x={x} y={y} width={w} height={h} rx="1"
            stroke="rgba(0,212,255,0.12)" strokeWidth="0.6" fill="none" />
        ))}

        {/* Junction nodes — brighter */}
        {data.junctions.map(([cx, cy, r], i) => (
          <circle key={`j${i}`} cx={cx} cy={cy} r={r}
            fill="rgba(0,212,255,0.25)"
            className={animated ? "pcb-led" : undefined}
            opacity={animated ? undefined : 0.25} />
        ))}

        {/* LED indicators */}
        {data.leds?.map(([cx, cy, color], i) => (
          <circle key={`led${i}`} cx={cx} cy={cy} r="2.5"
            fill={color as string}
            className={animated ? (i % 2 === 0 ? "pcb-led" : "pcb-led-alt") : undefined}
            opacity={animated ? undefined : 0.1} />
        ))}
      </g>

      {/* ===== CONNECTORS — traces extending toward content ===== */}
      {connectors?.map((dir) =>
        getConnectors(dir).map((conn, i) => (
          <g key={`${dir}-${i}`}>
            {/* Base connector trace */}
            <path d={conn.path}
              stroke="rgba(0,212,255,0.10)" strokeWidth="0.6" />
            {/* Animated pulse along connector */}
            <path d={conn.path}
              stroke="rgba(0,212,255,0.35)" strokeWidth="0.8"
              strokeLinecap="round"
              className={animated ? "pcb-conn" : undefined}
              opacity={animated ? 1 : 0} />
            {/* End node — where it "plugs in" */}
            <circle cx={conn.endX} cy={conn.endY} r="2"
              fill="rgba(0,212,255,0.20)"
              className={animated ? (i % 2 === 0 ? "pcb-led" : "pcb-led-alt") : undefined}
              opacity={animated ? undefined : 0.15} />
          </g>
        ))
      )}
    </svg>
  );
}

export function PCBFragment({
  variant,
  className,
  flip = false,
  scale = 1,
  connectors,
}: PCBFragmentProps) {
  const reducedMotion = useReducedMotion();
  const rawId = useId();
  const clipId = `pcb${rawId.replace(/:/g, "")}`;
  const animated = !reducedMotion;
  const width = W * scale;
  const height = H * scale;

  return (
    <div
      className={`pointer-events-none hidden md:block ${className ?? ""}`}
      style={{ width, height, overflow: "visible" }}
      aria-hidden="true"
    >
      <div style={flip ? { transform: "scaleX(-1)", overflow: "visible" } : { overflow: "visible" }}>
        <FragmentSVG variant={variant} animated={animated} clipId={clipId} connectors={connectors} />
      </div>
    </div>
  );
}
