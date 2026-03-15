# PCB Card Connections — Design Spec

**Date:** 2026-03-12
**Author:** Bas Rosario + Claude (#OneTeam)
**Status:** Approved — ready for implementation
**Depends on:** Visual Identity Upgrade (2026-03-12-visual-identity-upgrade-design.md) — PCBFragment component must exist

---

## Summary

Redesign how PCB fragments connect to content cards across the site. Fragments move from floating independently in page margins to being **structurally anchored to specific content cards**. Connector traces use right-angle PCB routing and terminate at rectangular port pads on the card border — no circles, no overlap. The effect: every connected fragment looks like it's feeding data into the card it's attached to.

Not every card gets a connection. Placements are hand-picked to feel organic, not repetitive.

---

## Decisions Made

| Decision             | Choice                                             | Rationale                                                                                    |
| -------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Connection style     | B+C hybrid: routed traces with port pads           | Right-angle routing feels authentic to PCB design; port pads are clean without circles       |
| Fragment positioning | Card-anchored (fragment is part of card component) | Guarantees pixel-perfect alignment at every breakpoint without DOM measurement               |
| Randomness           | Hand-picked "curated random" (option A)            | Full control over which cards look best; avoids pattern fatigue without layout jank          |
| Variant strategy     | Use all 6 existing variants as-is (option A)       | Existing variety (IC chips, via clusters, bus lines) gives each connection its own character |
| Port termination     | Rectangular pads, no circles                       | Clean, intentional look — traces dock like cables into a device                              |

---

## 1. Architecture — Card-Anchored PCB Connections

### Core change

PCB fragments move from being independently positioned (`absolute` in page margins) to being structurally anchored to specific content cards. The card component gains an optional `pcbConnection` prop that renders:

1. A recessed PCB fragment (existing variant SVGs — dark interior, animated traces, LEDs, signal pulses)
2. Right-angle routed connector traces from fragment junctions to the card edge
3. Small rectangular port pads on the card border where traces dock

### Component structure

- A new `PCBConnection` wrapper component handles fragment + connector + port rendering around any card
- `PCBConnection` wraps card children externally — **card components themselves are not modified**
- Parent grid/layout components (`ServicesGrid`, `ValueProposition`, portfolio grid, about page sections) conditionally wrap specific cards in `PCBConnection` at render time
- `ValueCard` is a private function inside `ValueProposition.tsx` (not an exported component) — `ValueProposition` handles wrapping internally by index

### Prop interface

```typescript
interface PCBConnectionConfig {
  side: "left" | "right";
  variant: PCBVariant; // existing 6 variants
  scale?: number;      // fragment size (default ~0.4)
  flip?: boolean;      // mirror for variety
}
```

### What this replaces

- Remove all current `<PCBFragment>` instances from page files (the absolute-positioned ones)
- Remove `overflow-x-clip` from `<main>` elements (no longer needed — fragments don't overflow)
- The `PCBFragment` component stays but is consumed by the new `PCBConnection` wrapper rather than placed directly in pages

---

## 2. Connector Routing & Port Design

### Connector traces

Route from fragment junction nodes to the card edge using right-angle PCB paths:

- **2-4 traces per connection** (varies by variant for organic feel)
- Each trace exits a junction node inside the fragment, runs horizontally, makes one right-angle bend, then runs straight to the card border
- **Junction nodes at bends** — small glowing circles (1.5-2px radius, low opacity cyan)
- Trace stroke style: `rgba(0,212,255,0.12)`, strokeWidth `0.6`

### Connector routing geometry

The `PCBConnection` component renders **its own connector SVG layer** between the fragment and card. This is separate from (and replaces) the existing `connectors` prop on `PCBFragment`. When used inside `PCBConnection`, `PCBFragment` is rendered **without** the `connectors` prop — `PCBConnection` draws connectors externally.

**Coordinate system:** The connector SVG has its own viewBox spanning the gap between fragment and card. It receives hardcoded route definitions per variant+side combination:

```typescript
type ConnectorRoute = {
  // Points in connector SVG space (0,0 = top-left of gap area)
  path: string;           // SVG path with right-angle segments
  portY: number;          // Y position of the port pad on card edge
  junctions: [number, number][]; // [x,y] positions of bend nodes
};

// Hardcoded per variant+side — 6 variants × 2 sides = 12 route sets
const CONNECTOR_ROUTES: Record<`${PCBVariant}-${Side}`, ConnectorRoute[]>;
```

Each variant has **2-4 routes per side**, chosen to exit from junction nodes near the fragment's connecting edge. The routes are hardcoded, not procedural — this guarantees visual quality and allows per-variant tuning.

**Vertical alignment:** The connector SVG is rendered at the same height as the fragment (using the fragment's scaled height). The fragment and connector share a vertical coordinate space. The card stretches to its content height independently. Port pads are positioned within the connector's vertical range — they don't need to align with any specific card content position.

**Pulse direction:** All connector paths are authored with the path direction flowing **from fragment toward card**, so the existing `pcb-conn` stroke-dashoffset animation naturally pulses in the correct direction regardless of left/right side.

### Port pads on card border

- Small rectangles (~3x6px in SVG space) at each trace termination point
- `rgba(0,212,255,0.18)` fill — subtle, not loud
- No circles, no glow — just clean rectangular pads flush with the card edge
- Positioned vertically along the card's connecting side, spaced to align with internal trace routing

### Animation

- Connector traces use `pcb-conn` stroke-dashoffset animation — a pulse traveling from fragment toward the card (data flowing in)
- Port pads are static — no animation on the receiving end
- Fragment internals keep their existing animations (signal pulses, LED glows, via breathing)

### Spacing

- Fragment sits in the margin area with a fixed `gap-2` (8px) between fragment edge and card edge
- Connector SVG fills this 8px gap, bridging the traces
- The whole assembly (fragment + connectors + card) stays within the content area — no overflow needed

---

## 3. Placement Map

Hand-picked placements. Not every card, varied sides, different variants.

| Page      | Connected Content                        | Side  | Variant        | Rationale                                           |
| --------- | ---------------------------------------- | ----- | -------------- | --------------------------------------------------- |
| Homepage  | Value card #1 ("Custom, Not Templated")  | left  | bus-cluster    | First thing below hero — sets the tone              |
| Homepage  | Value card #3 ("Ongoing, Not Abandoned") | right | ic-chip        | Bookends the row, balances #1                       |
| Services  | Service card #2 (second in grid)         | right | trace-path     | Avoids the obvious first card                       |
| Services  | Service card #5 (fifth in grid)          | left  | via-cluster    | Deep enough down the page to surprise               |
| Portfolio | Project matched by `id` (1st pick)       | left  | smd-components | Leads the showcase                                  |
| Portfolio | Project matched by `id` (2nd pick)       | right | corner-piece   | Staggers with 1st pick                              |
| About     | AboutValues card #2 ("Built to Last")    | right | bus-cluster    | Middle of the values section                        |
| Intake    | Form card                                | left  | ic-chip        | The main content — data literally feeding into form |

### Rules

- **Max 2 connections per page**
- **Never two on the same side consecutively** (alternate left/right)
- **Mobile:** connections hidden entirely (`hidden md:block`)
- **Legal/policy pages:** no connections (Privacy, Terms, Cookies, Refund, AI Policy)
- **PCBDivider:** stays as-is between homepage sections — separate from this system

---

## 4. Component Design

### New component: `PCBConnection`

Wraps any content card and renders the fragment + connectors on the specified side.

```typescript
interface PCBConnectionProps {
  config: PCBConnectionConfig;
  children: React.ReactNode; // the card content
}
```

**Rendering logic:**

1. Outer `div` uses `flex` layout: fragment on one side, card on the other (order depends on `side`)
2. Fragment renders via existing `PCBFragment` component (no changes to its internals)
3. Connector SVG layer sits between fragment and card, containing:
   - Right-angle routed traces from fragment edge nodes to card border
   - Junction nodes at bends
   - Port pad rectangles at card border
   - Animated pulse on traces
4. Card content renders as `children`

**Responsive behavior:**

- Below `md` breakpoint: fragment and connectors hidden, card renders full-width normally
- Above `md`: full assembly visible

### How wrapping works

`PCBConnection` is a pure wrapper — card components are **not modified**. Parent layout components wrap specific cards:

```tsx
// Example in ServicesGrid — card at index 1 gets a connection
{services.map((service, i) => {
  const card = <ServiceCard service={service} />;
  if (i === 1) {
    return <PCBConnection key={service.id} config={{ side: "right", variant: "trace-path" }}>{card}</PCBConnection>;
  }
  return card;
})}
```

### Modified components

| Component                                          | Change                                                    |
| -------------------------------------------------- | --------------------------------------------------------- |
| `ServicesGrid`                                     | Wrap cards at indices 1 and 4 in `PCBConnection`          |
| `ValueProposition` (internal `ValueCard` function) | Wrap cards at indices 0 and 2 in `PCBConnection`          |
| Portfolio grid component (in portfolio page file)  | Wrap projects matched by `id` in `PCBConnection`          |
| `AboutValues.tsx` (internal card rendering)        | Wrap card at index 1 ("Built to Last") in `PCBConnection` |
| Intake page                                        | Wrap form card in `PCBConnection`                         |

**Index fragility note:** Service card connections are tied to array indices. If services are added/removed, verify the connected indices still make visual sense. Consider matching by service `id` if the service list becomes dynamic.

**Portfolio filtering note:** The portfolio grid uses dynamic filtering (`activeFilter`, `activeSubcategory`). Connections are matched by project `id`, not array index, so they persist correctly when the user changes filters. If a connected project is filtered out, its connection simply doesn't render — no layout artifacts.

**Client component note:** `PCBConnection` must be `"use client"` since it consumes `PCBFragment` (which uses `useId` and `useReducedMotion`).

### Removed from pages

All `<PCBFragment>` instances currently placed directly in page files:

| Page      | Current fragments removed                |
| --------- | ---------------------------------------- |
| Homepage  | 2 (trace-path, via-cluster)              |
| Services  | 3 (bus-cluster, via-cluster, trace-path) |
| Portfolio | 3 (fragments in portfolio page)          |
| About     | 4 (fragments in about page)              |
| Intake    | 2 (fragments in intake page)             |
| Terms     | 2                                        |
| Privacy   | 2                                        |
| Cookies   | 1                                        |
| Refund    | 1                                        |
| AI Policy | 2                                        |

`overflow-x-clip` class removed from all `<main>` elements.

---

## 5. Performance & Accessibility

- **`pointer-events: none`** on fragment and connector layers — no interaction interference
- **`aria-hidden="true"`** on the entire PCBConnection wrapper — invisible to screen readers
- **`hidden md:block`** — no fragments or connectors below 768px
- **`prefers-reduced-motion`** — fragments show as static (no animation), connectors visible but no pulse
- **CSS animations only** — no JS animation loops
- **No DOM measurement** — vertical alignment is within the connector SVG's coordinate space; horizontal alignment is structural (flexbox)

---

## 6. Files Affected

### New file

| File                                           | Purpose                                         |
| ---------------------------------------------- | ----------------------------------------------- |
| `src/components/public-site/PCBConnection.tsx` | Wrapper component: fragment + connectors + card |

### Modified files

| File                                              | Change                                              |
| ------------------------------------------------- | --------------------------------------------------- |
| `src/components/public-site/ValueProposition.tsx` | Wrap cards #0 and #2 in `PCBConnection`             |
| `src/components/public-site/ServicesGrid.tsx`     | Wrap cards #1 and #4 in `PCBConnection`             |
| `src/app/page.tsx`                                | Remove `<PCBFragment>` instances                    |
| `src/app/(public)/services/page.tsx`              | Remove `<PCBFragment>` instances, `overflow-x-clip` |
| `src/app/(public)/portfolio/page.tsx`             | Remove `<PCBFragment>` instances, `overflow-x-clip` |
| `src/app/(public)/about/page.tsx`                 | Remove `<PCBFragment>` instances, `overflow-x-clip` |
| `src/app/(public)/intake/page.tsx`                | Remove `<PCBFragment>` instances, `overflow-x-clip` |
| `src/app/(public)/terms/page.tsx`                 | Remove `<PCBFragment>` instances                    |
| `src/app/(public)/privacy/page.tsx`               | Remove `<PCBFragment>` instances                    |
| `src/app/(public)/cookies/page.tsx`               | Remove `<PCBFragment>` instance                     |
| `src/app/(public)/refund/page.tsx`                | Remove `<PCBFragment>` instance                     |
| `src/app/(public)/ai-policy/page.tsx`             | Remove `<PCBFragment>` instances                    |

### Unchanged

- `PCBFragment.tsx` — internals unchanged; when used inside `PCBConnection`, rendered **without** the `connectors` prop (PCBConnection draws its own external connectors with rectangular port pads instead of the built-in circle-based connector endpoints)
- `PCBDivider.tsx` — stays as-is between homepage sections
- `HeroBackground.tsx` — untouched
- All admin/portal components — public site only

---

## 7. Tests

| File                                                          | Tests                                                                                                                                                        |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/components/public-site/__tests__/PCBConnection.test.tsx` | Renders card content, fragment hidden on mobile, `aria-hidden` present, `pointer-events: none` applied, left/right side positioning, reduced motion behavior |

Existing tests must continue to pass after all changes (`pnpm test`).

---

## 8. Risk Assessment

| Risk                                             | Mitigation                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| Fragment + card alignment breaks at breakpoints  | Flexbox structural alignment — no calculation needed               |
| Connector routing looks awkward on some variants | Hand-picked placements allow variant/card pairing optimization     |
| Cards with connections look too busy             | Low opacity traces, subtle port pads, tested during implementation |
| Removing floating fragments reduces ambient feel | Legal/minimal pages lose fragments, but connected cards are richer |
| Portfolio/About card structures differ           | PCBConnection wraps any children — card internals don't change     |

---

## Success Criteria

After implementation:

1. Every connected fragment's traces terminate precisely at the card edge with port pads
2. Connections feel like data flowing from the circuit board into the content
3. Non-connected cards look normal — no visual artifacts
4. The effect feels intentional and curated, not repetitive
5. All existing tests pass (`pnpm test`)
6. Build succeeds (`pnpm build`)
7. Mobile shows cards without fragments (clean, no broken layout)
8. Reduced motion shows static fragments with visible but unanimated connectors
