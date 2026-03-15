# Visual Identity Upgrade — Design Spec

**Date:** 2026-03-12
**Author:** Bas Rosario + Claude (#OneTeam)
**Status:** Draft — awaiting approval

---

## Summary

Upgrade the BuiltByBas visual identity from "well-built dark tech template" to a distinctive, living design that reflects what the company builds: custom software systems. Four changes ship together as one cohesive update.

## Decisions Made

| Decision              | Choice                                                               | Rationale                                                           |
| --------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Display font          | Outfit (Google Fonts)                                                | Premium, refined, more personality than Inter without being loud    |
| Body font             | Inter (no change)                                                    | Stays for paragraphs, labels, form text                             |
| Secondary accent      | Vivid Green `#4ADE80`                                                | Distinct from cyan, signals growth/energy, reinforces tech identity |
| Primary accent        | Cyan `#00D4FF` (no change)                                           | Stays as primary — CTAs, gradient text, PCB traces, nav             |
| Hero headline         | "Software That Works Like Your Business Does"                        | Only BuiltByBas says this — tied to the actual value prop           |
| Value section heading | "The BuiltByBas Difference"                                          | Clean, brand-forward, not generic                                   |
| CTA heading           | "Tell Us How Your Business Works. We'll Build the System Around It." | Invites conversation, positions BuiltByBas as listener-first        |

---

## 1. Typography

### What changes
- All `h1`, `h2`, `h3` elements switch from Inter to Outfit
- Nav logo text ("Built By Bas") switches to Outfit
- Intake form step headings switch to Outfit

### What stays
- Body text (`p`, `span`): Inter
- Labels, descriptions, form inputs: Inter
- Small text, captions, badges: Inter

### Implementation
- Add Outfit via `next/font/google` in root layout alongside existing Inter, weights 600 and 700 only
- Expose as CSS variable `--font-outfit`
- Add to Tailwind CSS 4's `@theme inline` block as `--font-display: var(--font-outfit)` to create a `font-display` utility class
- Apply globally to all headings via CSS rule in `globals.css`:
  ```css
  h1, h2, h3 { font-family: var(--font-outfit), var(--font-inter), sans-serif; }
  ```
- No per-component className changes needed — headings inherit via the CSS rule

### Files affected
- `src/app/layout.tsx` — add Outfit font import (weights 600, 700)
- `src/app/globals.css` — add `--font-outfit` variable, heading font-family rule, `@theme inline` entry for `--font-display`

---

## 2. Secondary Color — Vivid Green `#4ADE80`

### Color role rules
- **Cyan (`#00D4FF`)** = action, tech, primary. CTAs, gradient text, PCB elements, nav active states, primary links.
- **Green (`#4ADE80`)** = growth, results, secondary. Secondary buttons, select badges, credential dots, check marks, progress indicators.
- **Never mix** cyan and green in the same element (no cyan-to-green gradients).

### Where green appears
| Element                                          | Current                                           | New                                                                                                        |
| ------------------------------------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Secondary buttons ("View Work", "View Our Work") | `border-white/10 text-muted-foreground`           | `border-green-400/30 text-green-400`                                                                       |
| Portfolio "platforms" category badge             | Violet (`bg-violet-500/20 text-violet-400`)       | Green (`bg-green-400/20 text-green-400`)                                                                   |
| About page credential dots                       | `bg-primary` (cyan)                               | `bg-green-400`                                                                                             |
| Service feature check marks                      | `text-primary` (cyan)                             | `text-green-400`                                                                                           |
| Intake progress bar fill                         | Cyan                                              | Green                                                                                                      |
| Stats bar card hover glow                        | `hover:border-primary/20 hover:shadow-primary/10` | `hover:border-green-400/20 hover:shadow-green-400/10` (border + shadow change, stat value text stays cyan) |

### Where cyan stays (no change)
- Primary CTA buttons ("Start a Project")
- Hero gradient text and shimmer
- PCB traces and animations (hero + new fragments)
- Navigation active/hover states
- Primary links throughout
- Glass card hover border glow

### CSS implementation
- Add `--color-accent-green: #4ADE80` to CSS variables (NOT `--color-secondary` — that's used by shadcn/ui)
- Add `--color-accent-green-hover: #22C55E` for hover state (Tailwind `green-500`)
- Use Tailwind `green-400` class where appropriate (maps to `#4ADE80`)
- The existing `--secondary` / `--color-secondary` variables remain untouched — they power shadcn/ui components

### Files affected
- `src/app/globals.css` — add secondary color variable
- `src/components/public-site/ValueProposition.tsx` — credential dot color
- `src/components/public-site/ServiceCard.tsx` — check mark color
- `src/components/public-site/AboutStory.tsx` — credential dot color
- `src/components/public-site/StatsBar.tsx` — hover color
- `src/components/public-site/Hero.tsx` — secondary button style
- `src/components/public-site/ProjectFilter.tsx` — platforms badge color
- `src/components/public-site/IntakeProgress.tsx` — progress bar fill
- Portfolio category color definitions (wherever they're mapped)

---

## 3. Headlines

Three text changes. No layout changes.

| File                                              | Element           | Old                                      | New                                                                  |
| ------------------------------------------------- | ----------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| `src/components/public-site/Hero.tsx`             | h1 AnimatedText   | "Custom Solutions for" + "Your Business" | "Software That Works Like" + "Your Business Does"                    |
| `src/components/public-site/ValueProposition.tsx` | h2                | "Why BuiltByBas?"                        | "The BuiltByBas Difference"                                          |
| `src/components/public-site/CTASection.tsx`       | h2 (default prop) | "Ready to Build Something Great?"        | "Tell Us How Your Business Works. We'll Build the System Around It." |

### Hero headline structure

The `AnimatedText` component receives line 1 as its `text` prop, then a `<br />` and `<span>` child for line 2 (gradient shimmer). New structure:

- Line 1 (AnimatedText): `"Software That Works Like"` (4 words, same as current 3 — slightly wider)
- Line 2 (gradient shimmer span): `"Your Business Does"` (3 words, one more than current 2)
- The `<br />` pattern is preserved
- Test at all breakpoints — "Your Business Does" is wider than "Your Business" and may need responsive font-size check on small screens

### CTA heading note

The new CTA heading (15 words) is significantly longer than the original (6 words). May need `text-2xl` on mobile instead of `text-3xl` to prevent overflow. Test at 375px viewport.

### Subtitle updates

The hero subtitle stays as-is: "Agency-quality software, websites, dashboards, and tools. Built fast, built right, built for your business." It complements the new headline well — the headline says *what*, the subtitle says *how*.

---

## 4. Living PCB Fragments

### Concept
The hero shows the full circuit board. Every other page shows *fragments* of it — small clusters of traces, chips, and vias that emerge from the dark background as the user scrolls. They're alive: traces pulse with data flow, vias breathe, chip LEDs cycle. The effect: the entire site is built on top of a living computing machine, and you catch glimpses of it working as you scroll.

### New component: `PCBFragment`

A reusable SVG component that renders a small piece of circuit board with embedded CSS/SMIL animations.

**Props:**
```typescript
type PCBVariant = "bus-cluster" | "ic-chip" | "via-cluster" | "trace-path" | "smd-components" | "corner-piece";

interface PCBFragmentProps {
  variant: PCBVariant;    // self-documenting variant name
  className?: string;     // positioning (absolute, top-right, etc.)
  flip?: boolean;         // mirror horizontally for variety
  scale?: number;         // size multiplier (default 1)
}
```

**Fragment variants (6 unique templates):**

1. **Bus cluster** — 3-4 parallel horizontal traces with a right-angle connector at the end, one trace has a slow pulse animation traveling along it
2. **IC chip** — small chip body with 4-6 pin lines, 2-3 LED dots that cycle on/off at different slow rates
3. **Via cluster** — 4-5 via holes connected by traces, vias have a gentle breathing glow animation
4. **Trace path** — a right-angle trace route with 2-3 junction nodes, a slow illumination pulse travels along the path
5. **SMD components** — 3-4 small surface-mount rectangles connected by traces, subtle trace pulse
6. **Corner piece** — an L-shaped arrangement of bus lines meeting at a junction, gentle node glow

**Each fragment is approximately 150-250px in size**, small enough to be ambient, large enough to be noticed.

### Animation rules

All animations are smooth and gradual. **No flickering, no abrupt changes.**

- **Trace pulses:** `strokeDashoffset` animation, 4-8 second cycle, `ease-in-out`. A glow travels along the trace like data moving.
- **Via breathing:** `opacity` animation, 3-6 second cycle, sinusoidal. Gentle `0.06 → 0.15 → 0.06`.
- **Chip LEDs:** `opacity` animation, each LED on its own 2-4 second cycle with offset start times. Smooth fade in/out, never abrupt on/off.
- **Junction nodes:** Slow, gentle brightness increase over 2-3 seconds, then slow fade. Random timing via CSS `animation-delay`. Never abrupt.
- **All animations via CSS `@keyframes` or SVG SMIL** — no JavaScript animation loops.

### Scroll behavior

- Fragments are `opacity: 0` by default
- Framer Motion `whileInView` triggers a smooth fade to `opacity: 1` (over 0.8-1s)
- When scrolled out of viewport, fades back to `opacity: 0`
- The internal CSS/SMIL animations run continuously once the SVG is rendered — the scroll just controls visibility
- Uses `viewport={{ amount: 0.3 }}` so fragments appear when 30% visible

### Placement per page

| Page         | Fragment 1                                              | Fragment 2                                              |
| ------------ | ------------------------------------------------------- | ------------------------------------------------------- |
| Services     | Top-right of grid (variant 1, bus cluster)              | Bottom-left below grid (variant 3, via cluster)         |
| Portfolio    | Behind filter bar, right side (variant 4, trace path)   | Bottom-right of grid (variant 2, IC chip)               |
| About        | Between story and values (variant 5, SMD components)    | Top-left of pillars section (variant 6, corner piece)   |
| Intake       | Behind form card, offset right (variant 3, via cluster) | Confirmation page, bottom-left (variant 1, bus cluster) |
| Policy pages | One fragment, top-right (variant 4, trace path)         | None — keep minimal                                     |

**Max 2 fragments per page.** This is enforced by placement design (the table above limits each page to 2 fragments), not by runtime logic. No intersection observer needed — just careful positioning so the viewport never shows more than 2 at once.

### Performance and accessibility

- `pointer-events: none` — fragments don't interfere with interaction
- `aria-hidden="true"` — invisible to screen readers
- Hidden on mobile: `hidden md:block` — no fragments below 768px
- `prefers-reduced-motion`: fragments show as static (no animation), reduced opacity
- CSS animations only — no JS `requestAnimationFrame` loops
- Fragments are lightweight SVGs (~2-5KB each)

### Visual consistency with hero

- Same cyan color: `rgba(0, 212, 255, ...)` at low opacities
- Same stroke widths: `0.5-1px`
- Same element styles: rounded-rect chips, circle vias, right-angle traces
- Same glow filter where applicable (`feGaussianBlur` with `stdDeviation: 1.5`)
- Overall opacity lower than hero (fragments at `0.06-0.15`, hero elements at `0.08-0.5`)

---

## 5. PCB Section Dividers

### New component: `PCBDivider`

A horizontal line between major homepage sections that looks like a circuit trace.

**Design:**
- A thin horizontal SVG trace (`strokeWidth: 0.8`, cyan at `opacity: 0.1`)
- A small junction node (circle) at the center with a gentle breathing glow
- Total width: `max-w-xs` (small, not full-width)
- Centered, with `my-4` margin

**Animation:**
- The trace has a subtle pulse that illuminates from center outward (2-3 seconds, repeating)
- The junction node breathes (`opacity: 0.15 → 0.35 → 0.15`, 4 second cycle)
- Scroll-triggered visibility via `whileInView`, same as fragments

**Placement:**
- Between Hero and Value Proposition
- Between Value Proposition and CTA
- Between sections on About page (story/values/pillars/timeline)
- Between sections on Services page

**Same performance rules as fragments** — hidden on mobile, respects reduced motion, CSS-only animation.

---

## What stays unchanged

- All existing layouts, grids, spacing, responsive breakpoints
- Glassmorphism card system (`glass-card`, `glass-card-hover`)
- Animation spring presets and motion components (`FadeIn`, `AnimatedText`)
- Hero background (`HeroBackground.tsx`) — completely untouched
- Mobile responsiveness patterns
- All accessibility features (skip link, focus styles, aria labels)
- shadcn/ui component library
- Color system for status badges (emerald/amber live status badges stay)
- Admin dashboard and client portal (public site only)

---

## Files created (new)

| File                                         | Purpose                                              |
| -------------------------------------------- | ---------------------------------------------------- |
| `src/components/public-site/PCBFragment.tsx` | Living circuit board fragment component (6 variants) |
| `src/components/public-site/PCBDivider.tsx`  | Circuit trace section divider                        |

## Files modified (existing)

| File                                              | Change                                                                          |
| ------------------------------------------------- | ------------------------------------------------------------------------------- |
| `src/app/layout.tsx`                              | Add Outfit font import                                                          |
| `src/app/globals.css`                             | Add `--font-outfit`, `--color-accent-green` variables, heading font-family rule |
| `src/components/public-site/Hero.tsx`             | New headline text, secondary button green accent                                |
| `src/components/public-site/ValueProposition.tsx` | New heading text                                                                |
| `src/components/public-site/CTASection.tsx`       | New heading text                                                                |
| `src/components/public-site/ServiceCard.tsx`      | Green check marks                                                               |
| `src/components/public-site/AboutStory.tsx`       | Green credential dots                                                           |
| `src/components/public-site/StatsBar.tsx`         | Green hover accent                                                              |
| `src/components/public-site/IntakeProgress.tsx`   | Green progress bar                                                              |
| `src/app/(public)/services/page.tsx`              | Add PCBFragment placements                                                      |
| `src/app/(public)/portfolio/page.tsx`             | Add PCBFragment placements                                                      |
| `src/app/(public)/about/page.tsx`                 | Add PCBFragment placements                                                      |
| `src/app/(public)/intake/page.tsx`                | Add PCBFragment placement                                                       |
| `src/app/page.tsx`                                | Add PCBDivider between sections (homepage is at root, not in route group)       |
| `src/data/portfolio.ts`                           | Platforms badge color: violet → green (`bg-green-400/30 text-green-300`)        |
| `src/app/(public)/privacy/page.tsx`               | Add one PCBFragment (variant "trace-path", top-right)                           |
| `src/app/(public)/terms/page.tsx`                 | Add one PCBFragment (variant "trace-path", top-right)                           |
| `src/app/(public)/cookies/page.tsx`               | Add one PCBFragment (variant "trace-path", top-right)                           |
| `src/app/(public)/refund/page.tsx`                | Add one PCBFragment (variant "trace-path", top-right)                           |
| `src/app/(public)/ai-policy/page.tsx`             | Add one PCBFragment (variant "trace-path", top-right)                           |

---

## Implementation order

1. **Typography** — lowest risk, global impact, immediately visible
2. **Headlines** — text-only changes, low risk
3. **Secondary color** — targeted component changes, moderate risk
4. **PCB fragments and dividers** — new components, highest complexity, highest reward

This ordering allows incremental testing after each step.

---

## Tests

New components require tests per project standards ("No shipping without tests").

| File                                                        | Tests                                                                                                                                                                  |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/public-site/__tests__/PCBFragment.test.tsx` | Each variant renders without error, `aria-hidden="true"` present, `pointer-events: none` applied, hidden on mobile (`hidden md:block`), reduced motion static behavior |
| `src/components/public-site/__tests__/PCBDivider.test.tsx`  | Renders without error, `aria-hidden="true"` present, reduced motion behavior                                                                                           |

Existing tests must continue to pass after all changes (`pnpm test`).

---

## Documentation updates

The implementing session must update per session protocol:

- `docs/HANDOFF.md` — what was done, what's next
- `AUDIT.md` — any issues found or resolved
- `MEMORY.md` — update portfolio category colors note (platforms: violet → green)

---

## Risk assessment

| Risk                                                     | Mitigation                                                                                               |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Font swap breaks layout widths                           | Outfit and Inter have similar metrics; visual check on all pages                                         |
| Green accent clashes with existing emerald status badges | Status badges (live/in-progress) stay on their existing colors; green accent only in specified locations |
| PCB fragments affect scroll performance                  | CSS-only animations, hidden on mobile, max 2 visible at once                                             |
| PCB fragments distract from content                      | Low opacity (0.06-0.15), positioned in margins/corners, never overlapping text                           |
| Headline text changes break AnimatedText word-splitting  | Test word count and line breaks at all breakpoints                                                       |

---

## Success criteria

After implementation, the site should:
1. Feel visually distinct from standard dark-mode tech templates
2. Have a living, breathing quality — the PCB machine hums beneath every page
3. Pass all existing tests (`pnpm test`)
4. Build successfully (`pnpm build`)
5. Maintain WCAG 2.1 AA compliance (contrast, reduced motion, screen reader compatibility)
6. Perform well on mobile (no PCB fragments below 768px, no JS animation loops)
