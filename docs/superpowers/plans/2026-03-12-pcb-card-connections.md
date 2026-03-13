# PCB Card Connections Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Anchor PCB fragments to specific content cards with right-angle routed connector traces and rectangular port pads, replacing the current floating fragment placement.

**Architecture:** A new `PCBConnection` wrapper component positions a `PCBFragment` alongside any card via flexbox, with a connector SVG layer bridging the gap. Hardcoded route definitions per variant+side guarantee visual quality. Parent grid components conditionally wrap specific cards.

**Tech Stack:** React, TypeScript, SVG, CSS keyframe animations, Tailwind CSS 4, Framer Motion (existing card animations preserved)

**Spec:** `docs/superpowers/specs/2026-03-12-pcb-card-connections-design.md`

---

## File Structure

| File | Action | Responsibility |
| --- | --- | --- |
| `src/components/public-site/PCBConnection.tsx` | Create | Wrapper: flexbox layout, connector SVG with routes + port pads, wraps PCBFragment + children |
| `src/components/public-site/__tests__/PCBConnection.test.tsx` | Create | Unit tests for PCBConnection |
| `src/components/public-site/ValueProposition.tsx` | Modify | Wrap cards at indices 0 and 2 in PCBConnection |
| `src/components/public-site/ServicesGrid.tsx` | Modify | Wrap cards at indices 1 and 4 in PCBConnection |
| `src/components/public-site/AboutValues.tsx` | Modify | Wrap card at index 1 in PCBConnection |
| `src/components/portfolio/ProjectGrid.tsx` | Modify | Wrap projects by ID in PCBConnection |
| `src/app/(public)/intake/page.tsx` | Modify | Wrap IntakeForm in PCBConnection |
| `src/app/page.tsx` | Modify | Remove PCBFragment instances |
| `src/app/(public)/services/page.tsx` | Modify | Remove PCBFragment instances + overflow-x-clip |
| `src/app/(public)/portfolio/page.tsx` | Modify | Remove PCBFragment instances + overflow-x-clip |
| `src/app/(public)/about/page.tsx` | Modify | Remove PCBFragment instances + overflow-x-clip |
| `src/app/(public)/intake/page.tsx` | Modify | Remove PCBFragment instances + overflow-x-clip |
| `src/app/(public)/terms/page.tsx` | Modify | Remove PCBFragment instances |
| `src/app/(public)/privacy/page.tsx` | Modify | Remove PCBFragment instances |
| `src/app/(public)/cookies/page.tsx` | Modify | Remove PCBFragment instance |
| `src/app/(public)/refund/page.tsx` | Modify | Remove PCBFragment instance |
| `src/app/(public)/ai-policy/page.tsx` | Modify | Remove PCBFragment instances |

---

## Chunk 1: PCBConnection Component + Tests

### Task 1: Write PCBConnection test file

**Files:**
- Create: `src/components/public-site/__tests__/PCBConnection.test.tsx`

- [ ] **Step 1: Create the test file with all test cases**

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PCBConnection } from "../PCBConnection";

// Mock PCBFragment to avoid SVG complexity in unit tests
vi.mock("../PCBFragment", () => ({
  PCBFragment: ({ variant, scale, className }: Record<string, unknown>) => (
    <div data-testid="pcb-fragment" data-variant={variant} data-scale={scale} className={className as string} />
  ),
}));

// Mock useReducedMotion
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

describe("PCBConnection", () => {
  const defaultConfig = { side: "left" as const, variant: "bus-cluster" as const };

  it("renders children (card content)", () => {
    render(
      <PCBConnection config={defaultConfig}>
        <div data-testid="card">Card Content</div>
      </PCBConnection>
    );
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("renders PCBFragment with correct variant", () => {
    render(
      <PCBConnection config={defaultConfig}>
        <div>Card</div>
      </PCBConnection>
    );
    const fragment = screen.getByTestId("pcb-fragment");
    expect(fragment).toHaveAttribute("data-variant", "bus-cluster");
  });

  it("has aria-hidden on the decorative wrapper", () => {
    const { container } = render(
      <PCBConnection config={defaultConfig}>
        <div>Card</div>
      </PCBConnection>
    );
    // The decorative elements (fragment + connectors) should be aria-hidden
    const decorative = container.querySelector("[aria-hidden='true']");
    expect(decorative).toBeInTheDocument();
  });

  it("has pointer-events-none on decorative elements", () => {
    const { container } = render(
      <PCBConnection config={defaultConfig}>
        <div>Card</div>
      </PCBConnection>
    );
    const decorative = container.querySelector(".pointer-events-none");
    expect(decorative).toBeInTheDocument();
  });

  it("hides fragment on mobile (hidden md:block)", () => {
    const { container } = render(
      <PCBConnection config={defaultConfig}>
        <div>Card</div>
      </PCBConnection>
    );
    const decorative = container.querySelector(".hidden.md\\:flex");
    expect(decorative).toBeInTheDocument();
  });

  it("renders fragment on left side when side='left'", () => {
    const { container } = render(
      <PCBConnection config={{ side: "left", variant: "bus-cluster" }}>
        <div data-testid="card">Card</div>
      </PCBConnection>
    );
    // In left config, fragment comes before card in flex order
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass("flex");
    // Fragment area should be flex-row (fragment first, then card)
    expect(wrapper).not.toHaveClass("flex-row-reverse");
  });

  it("renders fragment on right side when side='right'", () => {
    const { container } = render(
      <PCBConnection config={{ side: "right", variant: "ic-chip" }}>
        <div data-testid="card">Card</div>
      </PCBConnection>
    );
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveClass("flex-row-reverse");
  });

  it("renders connector SVG with port pads (rectangles, not circles)", () => {
    const { container } = render(
      <PCBConnection config={defaultConfig}>
        <div>Card</div>
      </PCBConnection>
    );
    const connectorSvg = container.querySelector("svg.pcb-connector");
    expect(connectorSvg).toBeInTheDocument();
    // Port pads are rectangles
    const rects = connectorSvg?.querySelectorAll("rect.pcb-port");
    expect(rects?.length).toBeGreaterThan(0);
    // No circles at port termination
    const portCircles = connectorSvg?.querySelectorAll("circle.pcb-port");
    expect(portCircles?.length ?? 0).toBe(0);
  });

  it("passes scale prop to PCBFragment", () => {
    render(
      <PCBConnection config={{ ...defaultConfig, scale: 0.5 }}>
        <div>Card</div>
      </PCBConnection>
    );
    const fragment = screen.getByTestId("pcb-fragment");
    expect(fragment).toHaveAttribute("data-scale", "0.5");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- --run src/components/public-site/__tests__/PCBConnection.test.tsx`
Expected: FAIL — `PCBConnection` module not found

- [ ] **Step 3: Commit test file**

```bash
git add src/components/public-site/__tests__/PCBConnection.test.tsx
git commit -m "test: add PCBConnection component tests (red phase)"
```

---

### Task 2: Build the PCBConnection component

**Files:**
- Create: `src/components/public-site/PCBConnection.tsx`

- [ ] **Step 1: Create PCBConnection with connector route data and rendering**

The component needs:
1. `PCBConnectionConfig` type and props
2. `CONNECTOR_ROUTES` — hardcoded route definitions for all 12 variant+side combos
3. `ConnectorSVG` — renders the bridge SVG with traces, junction nodes, and port pads
4. `PCBConnection` — flex wrapper that positions fragment, connector SVG, and card children

```tsx
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
    { path: "M40,180 H18 V170 H0", portY: 170, junctions: [[18, 180]] },
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
const FRAG_H = 280;

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
  // Port pads sit on the card edge: x=38-40 for left side, x=0-2 for right side
  const portX = side === "left" ? 37 : 0;

  return (
    <svg
      viewBox={`0 0 40 ${FRAG_H}`}
      className="pcb-connector"
      style={{ width: 8, height, flexShrink: 0 }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {animated && <style>{CONN_CSS}</style>}

      {routes.map((route, i) => (
        <g key={i}>
          {/* Base trace */}
          <path
            d={route.path}
            stroke="rgba(0,212,255,0.12)"
            strokeWidth="0.6"
          />
          {/* Animated pulse */}
          {animated && (
            <path
              d={route.path}
              stroke="rgba(0,212,255,0.35)"
              strokeWidth="0.8"
              strokeLinecap="round"
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
              r="1.5"
              fill="rgba(0,212,255,0.15)"
            />
          ))}
          {/* Port pad — rectangular, on card edge */}
          <rect
            className="pcb-port"
            x={portX}
            y={route.portY - 3}
            width="3"
            height="6"
            rx="0.5"
            fill="rgba(0,212,255,0.18)"
          />
        </g>
      ))}
    </svg>
  );
}

// --- Main Component ---

export function PCBConnection({ config, children }: PCBConnectionProps) {
  const { side, variant, scale = 0.4, flip } = config;
  const reducedMotion = useReducedMotion();
  const animated = !reducedMotion;
  const routeKey = `${variant}-${side}` as `${PCBVariant}-${Side}`;
  const routes = CONNECTOR_ROUTES[routeKey];
  const fragmentHeight = FRAG_H * scale;

  return (
    <div className={`flex items-start gap-0 ${side === "right" ? "flex-row-reverse" : ""}`}>
      {/* Decorative: fragment + connector */}
      <div
        className="pointer-events-none hidden md:flex items-start flex-shrink-0"
        aria-hidden="true"
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

      {/* Card content — fills remaining space */}
      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `pnpm test -- --run src/components/public-site/__tests__/PCBConnection.test.tsx`
Expected: All 8 tests PASS

- [ ] **Step 3: Fix any failing tests — iterate until green**

Adjust component structure or test selectors as needed until all tests pass.

- [ ] **Step 4: Run full test suite to check for regressions**

Run: `pnpm test -- --run`
Expected: All existing tests pass

- [ ] **Step 5: Commit**

```bash
git add src/components/public-site/PCBConnection.tsx src/components/public-site/__tests__/PCBConnection.test.tsx
git commit -m "feat: add PCBConnection wrapper component with connector routing and port pads"
```

---

## Chunk 2: Remove Floating Fragments from All Pages

### Task 3: Remove PCBFragment instances from homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Remove PCBFragment import and instances**

In `src/app/page.tsx`:
- Remove the import: `import { PCBFragment } from "@/components/public-site/PCBFragment";`
- Remove these two lines from inside `<main>`:
  ```tsx
  <PCBFragment variant="trace-path" scale={1.2} className="absolute -right-52 top-[28%]" connectors={["left"]} />
  <PCBFragment variant="via-cluster" scale={1.0} className="absolute -left-44 top-[62%]" connectors={["right"]} flip />
  ```
- Remove `overflow-x-clip` from the `<main>` className (change `"relative overflow-x-clip"` to `"relative"`)

- [ ] **Step 2: Verify build**

Run: `pnpm test -- --run && pnpm build`
Expected: Clean

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "refactor: remove floating PCBFragment instances from homepage"
```

---

### Task 4: Remove PCBFragment instances from services page

**Files:**
- Modify: `src/app/(public)/services/page.tsx`

- [ ] **Step 1: Remove PCBFragment import and all 3 instances**

In `src/app/(public)/services/page.tsx`:
- Remove the import: `import { PCBFragment } from "@/components/public-site/PCBFragment";`
- Remove all 3 `<PCBFragment ... />` lines from inside `<main>`
- Remove `overflow-x-clip` from the `<main>` className

- [ ] **Step 2: Commit**

```bash
git add src/app/(public)/services/page.tsx
git commit -m "refactor: remove floating PCBFragment instances from services page"
```

---

### Task 5: Remove PCBFragment instances from portfolio page

**Files:**
- Modify: `src/app/(public)/portfolio/page.tsx`

- [ ] **Step 1: Remove PCBFragment import and all instances**

In `src/app/(public)/portfolio/page.tsx`:
- Remove the import: `import { PCBFragment } from "@/components/public-site/PCBFragment";`
- Remove all `<PCBFragment ... />` lines
- Remove `overflow-x-clip` from the `<main>` className

- [ ] **Step 2: Commit**

```bash
git add src/app/(public)/portfolio/page.tsx
git commit -m "refactor: remove floating PCBFragment instances from portfolio page"
```

---

### Task 6: Remove PCBFragment instances from about page

**Files:**
- Modify: `src/app/(public)/about/page.tsx`

- [ ] **Step 1: Remove PCBFragment import and all 4 instances**

In `src/app/(public)/about/page.tsx`:
- Remove the import: `import { PCBFragment } from "@/components/public-site/PCBFragment";`
- Remove all 4 `<PCBFragment ... />` lines
- Remove `overflow-x-clip` from the `<main>` className

- [ ] **Step 2: Commit**

```bash
git add src/app/(public)/about/page.tsx
git commit -m "refactor: remove floating PCBFragment instances from about page"
```

---

### Task 7: Remove PCBFragment instances from intake page

**Files:**
- Modify: `src/app/(public)/intake/page.tsx`

- [ ] **Step 1: Remove PCBFragment import and all instances**

In `src/app/(public)/intake/page.tsx`:
- Remove the import: `import { PCBFragment } from "@/components/public-site/PCBFragment";`
- Remove all `<PCBFragment ... />` lines
- Remove `overflow-x-clip` from the `<main>` className

- [ ] **Step 2: Commit**

```bash
git add src/app/(public)/intake/page.tsx
git commit -m "refactor: remove floating PCBFragment instances from intake page"
```

---

### Task 8: Remove PCBFragment instances from legal/policy pages

**Files:**
- Modify: `src/app/(public)/terms/page.tsx`
- Modify: `src/app/(public)/privacy/page.tsx`
- Modify: `src/app/(public)/cookies/page.tsx`
- Modify: `src/app/(public)/refund/page.tsx`
- Modify: `src/app/(public)/ai-policy/page.tsx`

- [ ] **Step 1: Remove PCBFragment import and instances from all 5 policy pages**

For each of the 5 files:
- Remove the `PCBFragment` import line
- Remove all `<PCBFragment ... />` JSX lines
- If `overflow-x-clip` is in the `<main>` className, remove it

- [ ] **Step 2: Run full build check**

Run: `pnpm test -- --run && pnpm build`
Expected: Clean — no references to floating PCBFragment instances remain in any page file

- [ ] **Step 3: Commit**

```bash
git add src/app/(public)/terms/page.tsx src/app/(public)/privacy/page.tsx src/app/(public)/cookies/page.tsx src/app/(public)/refund/page.tsx src/app/(public)/ai-policy/page.tsx
git commit -m "refactor: remove floating PCBFragment instances from all policy pages"
```

---

## Chunk 3: Wire PCBConnection into Content Components

### Task 9: Wire PCBConnection into ValueProposition (homepage)

**Files:**
- Modify: `src/components/public-site/ValueProposition.tsx`

- [ ] **Step 1: Import PCBConnection**

Add to the imports at the top of `ValueProposition.tsx`:

```tsx
import { PCBConnection } from "@/components/public-site/PCBConnection";
```

- [ ] **Step 2: Wrap cards at indices 0 and 2**

In the `ValueProposition` component, find the `.map()` that renders `ValueCard` components. Currently:

```tsx
{values.map((value, index) => (
  <ValueCard
    key={value.title}
    value={value}
    index={index}
    animated={!shouldReduceMotion}
  />
))}
```

Change to:

```tsx
{values.map((value, index) => {
  const card = (
    <ValueCard
      key={value.title}
      value={value}
      index={index}
      animated={!shouldReduceMotion}
    />
  );
  if (index === 0) {
    return (
      <PCBConnection key={value.title} config={{ side: "left", variant: "bus-cluster", scale: 0.4 }}>
        {card}
      </PCBConnection>
    );
  }
  if (index === 2) {
    return (
      <PCBConnection key={value.title} config={{ side: "right", variant: "ic-chip", scale: 0.35 }}>
        {card}
      </PCBConnection>
    );
  }
  return card;
})}
```

- [ ] **Step 3: Run tests**

Run: `pnpm test -- --run`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/components/public-site/ValueProposition.tsx
git commit -m "feat: wire PCBConnection to homepage value cards #0 and #2"
```

---

### Task 10: Wire PCBConnection into ServicesGrid

**Files:**
- Modify: `src/components/public-site/ServicesGrid.tsx`

- [ ] **Step 1: Import PCBConnection**

Add to the imports:

```tsx
import { PCBConnection } from "@/components/public-site/PCBConnection";
```

- [ ] **Step 2: Wrap cards at indices 1 and 4**

`ServicesGrid` has a single shared `grid` variable (a React Fragment) that both the reduced-motion and animated branches render. Find the `const grid` definition:

```tsx
const grid = (
  <>
    {services.map((service) => (
      <ServiceCard
        key={service.id}
        service={service}
        onClick={
          service.walkthrough
            ? () => setActiveService(service)
            : undefined
        }
      />
    ))}
  </>
);
```

Change it to:

```tsx
const grid = (
  <>
    {services.map((service, index) => {
      const card = (
        <ServiceCard
          key={service.id}
          service={service}
          onClick={
            service.walkthrough
              ? () => setActiveService(service)
              : undefined
          }
        />
      );
      if (index === 1) {
        return (
          <PCBConnection key={service.id} config={{ side: "right", variant: "trace-path", scale: 0.4 }}>
            {card}
          </PCBConnection>
        );
      }
      if (index === 4) {
        return (
          <PCBConnection key={service.id} config={{ side: "left", variant: "via-cluster", scale: 0.35 }}>
            {card}
          </PCBConnection>
        );
      }
      return card;
    })}
  </>
);
```

**Note:** There is only ONE `.map()` call to change — it lives in the shared `const grid` variable, which is used by both render branches.

- [ ] **Step 3: Run tests**

Run: `pnpm test -- --run`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/components/public-site/ServicesGrid.tsx
git commit -m "feat: wire PCBConnection to service cards #1 and #4"
```

---

### Task 11: Wire PCBConnection into AboutValues

**Files:**
- Modify: `src/components/public-site/AboutValues.tsx`

- [ ] **Step 1: Import PCBConnection**

Add to the imports:

```tsx
import { PCBConnection } from "@/components/public-site/PCBConnection";
```

- [ ] **Step 2: Wrap card at index 1 ("Built to Last")**

Find the `values.map()`. Currently:

```tsx
{values.map((value, index) => (
  <ValuesCard
    key={value.title}
    value={value}
    index={index}
    animated={!shouldReduceMotion}
  />
))}
```

Change to:

```tsx
{values.map((value, index) => {
  const card = (
    <ValuesCard
      key={value.title}
      value={value}
      index={index}
      animated={!shouldReduceMotion}
    />
  );
  if (index === 1) {
    return (
      <PCBConnection key={value.title} config={{ side: "right", variant: "bus-cluster", scale: 0.35 }}>
        {card}
      </PCBConnection>
    );
  }
  return card;
})}
```

- [ ] **Step 3: Run tests**

Run: `pnpm test -- --run`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/components/public-site/AboutValues.tsx
git commit -m "feat: wire PCBConnection to AboutValues card #1 ('Built to Last')"
```

---

### Task 12: Wire PCBConnection into ProjectGrid (portfolio)

**Files:**
- Modify: `src/components/portfolio/ProjectGrid.tsx`

- [ ] **Step 1: Import PCBConnection**

Add to the imports:

```tsx
import { PCBConnection } from "@/components/public-site/PCBConnection";
```

- [ ] **Step 2: Verify project IDs in portfolio data**

Open `src/data/portfolio.ts` and confirm the exact `id` values for the first two projects. They should be `"the-colour-parlor"` and `"orca-child-in-the-wild"`. If different, use the actual IDs in the next step.

- [ ] **Step 3: Define connected project IDs**

Add a constant near the top of the file (after imports):

```tsx
/** Projects that get PCB connections — matched by ID so they persist through filtering */
const PCB_CONNECTIONS: Record<string, { side: "left" | "right"; variant: "smd-components" | "corner-piece" }> = {
  "the-colour-parlor": { side: "left", variant: "smd-components" },
  "orca-child-in-the-wild": { side: "right", variant: "corner-piece" },
};
```

- [ ] **Step 4: Wrap matched projects in both render paths**

In BOTH the reduced-motion and animated render paths, change:

```tsx
{filteredProjects.map((project) => (
  <ProjectCard key={project.id} project={project} />
))}
```

To:

```tsx
{filteredProjects.map((project) => {
  const card = <ProjectCard key={project.id} project={project} />;
  const conn = PCB_CONNECTIONS[project.id];
  if (conn) {
    return (
      <PCBConnection key={project.id} config={{ ...conn, scale: 0.35 }}>
        {card}
      </PCBConnection>
    );
  }
  return card;
})}
```

- [ ] **Step 5: Run tests**

Run: `pnpm test -- --run`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add src/components/portfolio/ProjectGrid.tsx
git commit -m "feat: wire PCBConnection to portfolio projects by ID"
```

---

### Task 13: Wire PCBConnection into intake page

**Files:**
- Modify: `src/app/(public)/intake/page.tsx`

- [ ] **Step 1: Import PCBConnection**

Add to the imports:

```tsx
import { PCBConnection } from "@/components/public-site/PCBConnection";
```

- [ ] **Step 2: Wrap the IntakeForm section**

Find the section that contains `<IntakeForm />` (wrapped in `<Suspense>`). Wrap the entire form section in PCBConnection:

```tsx
<PCBConnection config={{ side: "left", variant: "ic-chip", scale: 0.4 }}>
  <Suspense fallback={<div>Loading...</div>}>
    <IntakeForm />
  </Suspense>
</PCBConnection>
```

Note: The exact wrapping point depends on the current JSX structure. Wrap the form card content, not the outer section container with the heading.

- [ ] **Step 3: Run tests and build**

Run: `pnpm test -- --run && pnpm build`
Expected: All pass

- [ ] **Step 4: Commit**

```bash
git add src/app/(public)/intake/page.tsx
git commit -m "feat: wire PCBConnection to intake form card"
```

---

## Chunk 4: Final Verification

### Task 14: Full build and test verification

- [ ] **Step 1: Run full test suite**

Run: `pnpm test -- --run`
Expected: All tests pass (including new PCBConnection tests)

- [ ] **Step 2: Run TypeScript type check**

Run: `pnpm build`
Expected: Build succeeds with no type errors

- [ ] **Step 3: Visual spot-check**

Run: `pnpm dev`

Check these pages in the browser at desktop width (>768px):
- **Homepage** (`/`) — Value cards #1 and #3 should have PCB connections (left and right)
- **Services** (`/services`) — Cards #2 and #5 should have connections
- **Portfolio** (`/portfolio`) — The Colour Parlor and Orca Child should have connections
- **About** (`/about`) — "Built to Last" card should have a connection on the right
- **Intake** (`/intake`) — Form should have a connection on the left

Check at mobile width (<768px):
- All pages should show cards normally with NO fragments or connectors visible

Check at desktop with "prefers-reduced-motion: reduce" in devtools:
- Fragments should be static (no animations), connectors visible but no pulse

- [ ] **Step 4: Verify legal pages are clean**

Check `/terms`, `/privacy`, `/cookies`, `/refund`, `/ai-policy`:
- No PCB fragments visible anywhere
- Pages render normally

- [ ] **Step 5: Final commit if any visual tweaks were needed**

If any adjustments were made during visual review:

```bash
git add -A
git commit -m "fix: visual adjustments to PCBConnection placement after review"
```

---

### Task 15: Update documentation

**Files:**
- Modify: `docs/HANDOFF.md`
- Modify: `AUDIT.md` (if issues found)

- [ ] **Step 1: Update HANDOFF.md**

Add a new session section at the top describing:
- PCB Card Connections implemented per spec
- Floating fragments removed from all pages
- PCBConnection wrapper added to 8 cards across 5 pages
- Legal/policy pages cleaned up (no fragments)
- What's next

- [ ] **Step 2: Commit documentation**

```bash
git add docs/HANDOFF.md AUDIT.md
git commit -m "docs: update handoff for PCB card connections implementation"
```
