"use client";

import { PCBFragment } from "./PCBFragment";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { PCBVariant } from "./PCBFragment";

// --- Types ---

interface PCBConnectionConfig {
  side: "left" | "right";
  variant: PCBVariant;
  scale?: number;
  flip?: boolean;
}

interface PCBConnectionProps {
  config: PCBConnectionConfig;
  children: React.ReactNode;
}

type Side = "left" | "right";

interface ConnectorRoute {
  path: string;
  portY: number;
  junctions: [number, number][];
}

// --- Animation CSS (same keyframe as PCBFragment's pcb-conn) ---

const CONN_CSS = `
@keyframes pcb-conn-bridge{0%{stroke-dashoffset:80}100%{stroke-dashoffset:-80}}
.pcb-conn-bridge{stroke-dasharray:8 72;animation:pcb-conn-bridge 3s linear infinite}
`;

// --- Connector Routes ---
// Hardcoded per variant+side. Each route: path in connector SVG space,
// portY = Y where the port pad sits on the card edge,
// junctions = [x,y] bend points.
// Connector SVG viewBox: "0 0 40 H" where H = fragment height in SVG units (280).
// X=0 is the fragment edge, X=40 is the card edge.

const CONNECTOR_ROUTES: Record<`${PCBVariant}-${Side}`, ConnectorRoute[]> = {
  "bus-cluster-left": [
    { path: "M0,100 H18 V80 H40", portY: 80, junctions: [[18, 100]] },
    { path: "M0,136 H14 V120 H40", portY: 120, junctions: [[14, 136]] },
    { path: "M0,170 H22 V160 H40", portY: 160, junctions: [[22, 170]] },
  ],
  "bus-cluster-right": [
    { path: "M40,100 H22 V80 H0", portY: 80, junctions: [[22, 100]] },
    { path: "M40,136 H26 V120 H0", portY: 120, junctions: [[26, 136]] },
    { path: "M40,170 H18 V160 H0", portY: 160, junctions: [[18, 170]] },
  ],
  "ic-chip-left": [
    { path: "M0,85 H15 V70 H40", portY: 70, junctions: [[15, 85]] },
    { path: "M0,120 H20 V110 H40", portY: 110, junctions: [[20, 120]] },
    { path: "M0,155 H12 V150 H40", portY: 150, junctions: [[12, 155]] },
    { path: "M0,200 H25 V190 H40", portY: 190, junctions: [[25, 200]] },
  ],
  "ic-chip-right": [
    { path: "M40,85 H25 V70 H0", portY: 70, junctions: [[25, 85]] },
    { path: "M40,120 H20 V110 H0", portY: 110, junctions: [[20, 120]] },
    { path: "M40,155 H28 V150 H0", portY: 150, junctions: [[28, 155]] },
    { path: "M40,200 H15 V190 H0", portY: 190, junctions: [[15, 200]] },
  ],
  "via-cluster-left": [
    { path: "M0,65 H16 V55 H40", portY: 55, junctions: [[16, 65]] },
    { path: "M0,110 H22 V100 H40", portY: 100, junctions: [[22, 110]] },
    { path: "M0,170 H12 V155 H40", portY: 155, junctions: [[12, 170]] },
  ],
  "via-cluster-right": [
    { path: "M40,65 H24 V55 H0", portY: 55, junctions: [[24, 65]] },
    { path: "M40,110 H18 V100 H0", portY: 100, junctions: [[18, 110]] },
    { path: "M40,170 H28 V155 H0", portY: 155, junctions: [[28, 170]] },
  ],
  "trace-path-left": [
    { path: "M0,45 H20 V60 H40", portY: 60, junctions: [[20, 45]] },
    { path: "M0,90 H15 V105 H40", portY: 105, junctions: [[15, 90]] },
    { path: "M0,195 H25 V180 H40", portY: 180, junctions: [[25, 195]] },
  ],
  "trace-path-right": [
    { path: "M40,45 H20 V60 H0", portY: 60, junctions: [[20, 45]] },
    { path: "M40,90 H25 V105 H0", portY: 105, junctions: [[25, 90]] },
    { path: "M40,195 H15 V180 H0", portY: 180, junctions: [[15, 195]] },
  ],
  "smd-components-left": [
    { path: "M0,80 H18 V70 H40", portY: 70, junctions: [[18, 80]] },
    { path: "M0,125 H14 V115 H40", portY: 115, junctions: [[14, 125]] },
    { path: "M0,180 H22 V170 H40", portY: 170, junctions: [[22, 180]] },
  ],
  "smd-components-right": [
    { path: "M40,80 H22 V70 H0", portY: 70, junctions: [[22, 80]] },
    { path: "M40,125 H26 V115 H0", portY: 115, junctions: [[26, 125]] },
    { path: "M40,180 H18 V170 H0", portY: 170, junctions: [[18, 170]] },
  ],
  "corner-piece-left": [
    { path: "M0,38 H16 V50 H40", portY: 50, junctions: [[16, 38]] },
    { path: "M0,145 H20 V135 H40", portY: 135, junctions: [[20, 145]] },
    { path: "M0,165 H12 V175 H40", portY: 175, junctions: [[12, 165]] },
  ],
  "corner-piece-right": [
    { path: "M40,38 H24 V50 H0", portY: 50, junctions: [[24, 38]] },
    { path: "M40,145 H20 V135 H0", portY: 135, junctions: [[20, 145]] },
    { path: "M40,165 H28 V175 H0", portY: 175, junctions: [[28, 165]] },
  ],
};

// --- Fragment dimensions (must match PCBFragment.tsx) ---
const FRAG_W = 400;
const FRAG_H = 280;
const CONNECTOR_GAP = 75; // px gap between fragment and card edge

// --- Connector SVG ---

function ConnectorSVG({
  routes,
  side,
  height,
  animated,
}: {
  routes: ConnectorRoute[];
  side: Side;
  height: number;
  animated: boolean;
}) {
  const portX = side === "left" ? 35 : 0;

  return (
    <svg
      viewBox={`0 0 40 ${FRAG_H}`}
      preserveAspectRatio="none"
      className="pcb-connector"
      style={{ width: CONNECTOR_GAP, height, flexShrink: 0 }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {animated && <style>{CONN_CSS}</style>}

      {routes.map((route, i) => (
        <g key={i}>
          {/* Base trace */}
          <path
            d={route.path}
            stroke="rgba(0,212,255,0.175)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          {/* Animated pulse */}
          {animated && (
            <path
              d={route.path}
              stroke="rgba(0,212,255,0.25)"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className="pcb-conn-bridge"
              style={{ animationDelay: `${i * 0.7}s` }}
            />
          )}
          {/* Junction nodes at bends */}
          {route.junctions.map(([jx, jy], j) => (
            <circle
              key={j}
              cx={jx}
              cy={jy}
              r="3"
              fill="rgba(0,212,255,0.2)"
            />
          ))}
          {/* Port pad — rectangular, on card edge */}
          <rect
            className="pcb-port"
            x={portX}
            y={route.portY - 4}
            width="5"
            height="8"
            rx="0.5"
            fill="rgba(0,212,255,0.175)"
          />
        </g>
      ))}
    </svg>
  );
}

// --- Main Component ---

export function PCBConnection({ config, children }: PCBConnectionProps) {
  const { side, variant, scale = 0.5, flip } = config;
  const reducedMotion = useReducedMotion();
  const animated = !reducedMotion;
  const routeKey = `${variant}-${side}` as `${PCBVariant}-${Side}`;
  const routes = CONNECTOR_ROUTES[routeKey];
  const fragmentHeight = FRAG_H * scale;
  const fragmentWidth = FRAG_W * scale;
  const assemblyWidth = fragmentWidth + CONNECTOR_GAP;

  return (
    <div className="relative h-full">
      {/* Decorative: fragment + connector — absolutely positioned outside the card */}
      <div
        className="pointer-events-none hidden md:flex items-start absolute"
        aria-hidden="true"
        style={{
          top: 0,
          width: assemblyWidth,
          ...(side === "left"
            ? { right: "100%", flexDirection: "row" }
            : { left: "100%", flexDirection: "row-reverse" }),
        }}
      >
        <PCBFragment
          variant={variant}
          scale={scale}
          flip={flip}
        />
        <ConnectorSVG
          routes={routes}
          side={side}
          height={fragmentHeight}
          animated={animated}
        />
      </div>

      {/* Card content — takes up normal grid space, unchanged */}
      {children}
    </div>
  );
}
