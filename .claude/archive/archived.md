# BuiltByBas -- Archived Session Logs

> Sessions 29-51 (2026-03-06 through 2026-03-14)
> Archived from HANDOFF.md to reduce active document size.
> These sessions are complete and preserved for historical reference.

---

## Session 51 Changes (2026-03-14)

**Bug Fixes (committed `e20af1a`):**

- CTA "Click Anywhere to Get Started" changed from emerald to bright white with white glow animation.
- iOS Safari scroll fix: body scroll lock on homepage (position fixed, overflow hidden, touch-action manipulation, overscroll-behavior none). Eliminates vertical scrollbar on iPhone 14 Pro Max.
- Services page mobile rendering fix: ServicesGrid IntersectionObserver fallback using requestAnimationFrame + getBoundingClientRect (same pattern as FadeIn/AnimatedText iOS fix).

**Concierge Smart Routing Redesign (brainstormed, spec'd, plan reviewed):**

- Spec: `docs/superpowers/specs/2026-03-14-concierge-smart-routing-design.md` (13 sections, approved)
- Plan: `docs/superpowers/plans/2026-03-14-concierge-smart-routing.md` (16 tasks, 4 chunks, reviewed)
- Replaces the 5-screen portfolio showcase funnel with a 7-screen smart intake router
- Every tap captures qualifying data: category, exact service, priority, timeline
- Auto-routes to `/intake?service=x&priority=y&timeline=z` with 4.44s confirmation screen
- Intake form skips service selection and timeline for concierge users (pre-filled)
- "Something Else" path gets generic priorities and full service selection in form
- Plan review loop complete: 6 critical issues and 10 important issues found and fixed

**Design decisions captured:**

- No em dashes in client-facing copy (feedback saved to memory)
- Spec headline: "What are we building?" (not "What are you building?")
- Query params for data handoff (bookmarkable, debuggable, survives new tabs)
- 4.44s auto-transition on confirmation screen with tap-to-skip
- Timeline options: ASAP, 2-4 weeks, 5-6 weeks, Flexible

**Commits this session:**

- `e20af1a` fix: white CTA glow, iOS scroll lock, services grid IntersectionObserver

**What the next session needs to do:**

1. Execute the plan using superpowers:subagent-driven-development skill
2. The plan has 4 chunks / 16 tasks:
   - Chunk 1 (Tasks 1-5): Data layer -- types, content, validation in concierge-content.ts, intake.ts, intake-validation.ts
   - Chunk 2 (Tasks 6-10): Concierge component -- state machine rewrite, icon map update, JSX screens, ConfirmationContent, CSS animation
   - Chunk 3 (Tasks 11-13): Intake form integration -- useIntakeForm hook, IntakeForm badge, BudgetOnlyStep
   - Chunk 4 (Tasks 14-16): Cleanup and verification -- remove payoff code, verify icons, full build/test
3. After implementation: deploy to VPS, smoke test all paths
4. Rotate Resend API key (ISS-12)

**Known issues:**

- 5/9 payoff combos map to All Beauty -- will be RESOLVED by removing payoff system entirely (part of this plan)
- Rotate Resend API key (ISS-12 -- still open)
- Marketing push, SMS notifications, modular AI provider architecture (future work)

---

## Session 50 Changes (2026-03-14)

**Desktop Navigation Redesigned:**

- Removed Services and Portfolio links from desktop nav.
- Removed "Start a Project" CTA button from desktop nav.
- Added centered browse prompt: "Just browsing, click here to view the BuiltByBas Portfolio." — "click here" is a cyan link to `/portfolio`.
- Home and About links remain on the left.
- Services link conditionally shown on non-homepage pages (left side, after About).
- Right side: "* Pricing varies by project" on non-home pages, spacer on home.
- Browse prompt absolutely centered using `pointer-events-none`/`pointer-events-auto` pattern — stays fixed regardless of left/right content changes.
- Mobile nav unchanged — still has all 4 links + Start a Project CTA.

**Welcome Screen Redesigned:**

- Complete three-tier layout: Brand (Welcome to / BuiltByBas) → Value Prop (subtitle + tagline) → CTA.
- Tagline: "Let's Talk About Your Business Needs." (white/80) + "Then We'll Build a System Around Them." (cyan).
- Title enlarged 130%: `text-6xl` mobile up to `text-9xl` lg. "Welcome to" as small uppercase label above brand wordmark.
- CTA: "Click Anywhere to Get Started" in emerald-400 with custom `cta-glow` animation (brightness pulse + emerald drop-shadow). Emerald accent bar below.
- Asymmetric flex spacers (1.2 / 1.6) for optical centering — CTA sits lower for natural visual weight.

**Service Card Pricing Removed:**

- Removed per-card price range badges from ServiceCard component.
- "* Pricing varies by project" moved to desktop nav (right side, non-home pages only).

**Portfolio Gallery Arrows:**

- Added animated left/right chevron arrows to `ProjectCardGallery`.
- Arrows appear with slide-in animation, scale on hover.
- Click navigates forward/back through screenshots, resets auto-cycle timer.
- Fully keyboard-accessible (`<button>` elements with `aria-label`).

**Homepage Scroll Lock:**

- Wrapped homepage in `fixed inset-0 overflow-hidden` — no vertical or horizontal scrolling on landing page.
- Added `ScrollToTop` component to root layout — all pages start at the top on navigation.

**Keyboard Accessibility (WCAG):**

- Added global `focus-visible` ring (2px cyan, 2px offset) — visible only on keyboard navigation (Tab), hidden on mouse click.
- Removed default `outline-ring/50` that showed on click.
- All interactive elements across the site (buttons, links, gallery arrows, concierge options) are keyboard-navigable.

**Tests:** 229/229 pass. tsc clean.

**Commits this session:**
- `0c4f0e9` feat: full-length PCB packet routes, matrix rain chips, welcome polish (session 49 carry-over)
- `961cae4` feat: desktop nav redesign, welcome screen polish, gallery arrows, scroll lock

**Known issues for next session:**
- 5 of 9 payoff combos still map to All Beauty Hair Studio
- Deploy all changes to VPS
- Rotate Resend API key
- Marketing push, SMS notifications, modular AI provider architecture

---

## Session 49 Changes (2026-03-14)

**Data Packet Animation — COMPLETE:**

- Full-length trace travel implemented: packets now traverse the entire board along existing r1-r16 PCB route paths (2500-2800ms travel time), no longer short edge-to-chip hops.
- 4 routes, all targeting edge chips (no center chips hit): Left edge to IC4 (right), Top to IC7 (bottom-right), Right to IC5 (left), Bottom to IC1 (top-left).
- Matrix rain effect on chip impact: when a data packet hits a chip, scrolling 1s and 0s (cyan, monospace) rain vertically inside the chip for 3.33s, clipped to chip boundaries. Staggered column speeds, no-wrap continuous scroll. Binary digits fade out 400ms before the glow fades.
- Chip fill animation preserved: directional fill (400ms) + matrix rain (3.33s) + glow fade (600ms).
- Pause between packets: 7.77s.
- IC chip blinking LEDs kept (6 dots on IC1, IC3, IC4, IC8).

**Welcome Screen Polish:**

- Title enlarged: `text-4xl` on mobile (was `text-[1.875rem]`), `text-5xl` on sm, scaling up to `text-7xl` on lg. "Welcome to BuiltByBas" is now the clear focal point.
- Subtitle shortened: "We build solutions shaped around your business." (was "Where we build solutions that work like your business does." — orphaned "does." on mobile).
- Tagline second line colored cyan: "We'll Build the System Around It." uses `text-primary`.
- No scroll on mobile: section locked to `h-[100svh]` with `overflow-hidden`.
- Content spacing tightened for better visual balance across breakpoints.

**Home Button Reset:**

- Clicking "Home" in nav while on the homepage now resets the concierge to the welcome screen (custom `concierge-reset` event). Works on both desktop and mobile nav.

**Tests:** 229/229 pass. tsc clean.

**Known issues for next session:**
- 5 of 9 payoff combos still map to All Beauty Hair Studio
- Deploy all changes to VPS
- Bas wants concierge on desktop too (not just mobile)

---

## Session 48 Changes (2026-03-14)

**Concierge UX Polish & Landing Page Streamlining:**

- **Portfolio carousel on payoff screen:** Single project card replaced with horizontal snap-scroll carousel showing all live + in-progress portfolio projects. CSS mask-image edge fade on both sides. Each payoff option starts on its matched project. Desktop: auto-scrolls every 3.33s with 2.22s initial delay, infinite loop via duplicated items, pauses on hover. Mobile: manual swipe with scroll-snap.
- **Branding unified:** "Built" (text-primary) "By" (white) "Bas" (text-primary) applied across all layout components — PublicHeader, PublicFooter, AdminSidebar, PortalSidebar, DemoSidebar. Nav logo text removed, nav links kept left, CTA right.
- **Personal name removed:** "Bas Rosario" replaced with "the BuiltByBas team" / "BuiltByBas staff" in AI policy page, proposal emails, proposal generator, JSON-LD schema.
- **Welcome screen improved:** "Tap/Click to get started" with pulse animation, white text, larger size.
- **Project detail overlay:** Clickable carousel cards open inline 80svh detail view with hidden scrollbar, close button returns to payoff.
- **ValueProposition section removed** from homepage.
- **CTA section removed** from homepage.
- **Footer removed** from homepage — landing page is now purely the concierge flow (nav + full-screen concierge, nothing below).
- **Tagline added to welcome screen:** "Tell Us How Your Business Works. / We'll Build the System Around It." — white, bold, 2 rows, below the subtitle.
- **Carousel cards enlarged** from 80% to 90% viewport width.

**HeroBackground Animation — PARTIAL (needs next session):**

- Removed center hub circle (the white-flashing circle at center).
- Removed old particle-to-center animation system (p1/p2/p3 + trace illumination dashes).
- Removed central processor radial gradient div.
- Added new JS-driven data packet animation: packet travels from screen edge along PCB traces to an IC chip, chip fills with light from impact side, fades, waits 4.44s, cycles through 4 chips from 4 edges.
- **ISSUE — Bas wants different behavior:** The data packet should travel the FULL LENGTH of the page along existing traces (like the old r1-r16 routes), not short paths from edges. The packet should traverse the entire screen following traces, then on reaching the far side, hit a chip and do the fill animation. The old particle behavior (traveling long routes) was correct — just redirect to chips instead of center hub.
- **Fix for next session:** Change PACKET_ROUTES to use the existing long r1-r16 route paths (which span the full board), but redirect their endpoints to nearby IC chips instead of center (500,300). Keep the chip fill-on-impact animation.

**Other changes:**

- All Beauty Hair Studio URL temporarily pointed to `http://72.62.200.30`.
- Chip trace animation (removed in Session 41) stays removed — only the new data packet system.

**Tests:** 229/229 pass. tsc clean. Build clean.

**Commits pushed to main:**
- `cb7e34f` feat: portfolio carousel on payoff screen
- `06dd839` feat: auto-scrolling infinite carousel on desktop
- `9074fdd` feat: data packet chip animation, remove center hub + ValueProposition
- `988c68d` feat: add tagline to welcome screen — 2-row white text
- `4904de6` feat: remove CTA section and footer from homepage
- Plus 5 earlier commits (nav cleanup, branding, name removal, welcome CTA, detail overlay, scrollbar fix, All Beauty URL)

**Known issues for next session:**
- Data packet animation needs rework — full-length trace travel, not short edge paths
- 5 of 9 payoff combos still map to All Beauty Hair Studio
- Deploy all changes to VPS
- Bas wants concierge on desktop too (not just mobile)

---

## Session 47 Changes (2026-03-13)

**Mobile Concierge Experience — IMPLEMENTED:**

Executed the 9-task implementation plan across 3 chunks. The mobile homepage now has a full-screen concierge flow instead of the traditional hero.

**What was built:**
- `src/lib/concierge-content.ts` — types, content map, `getPayoff()`, `getIntakeHref()`
- `src/components/public-site/ConciergeOption.tsx` — glassmorphism tap target with green selection glow
- `src/components/public-site/ConciergeScreen.tsx` — full-viewport animated container (spring transitions)
- `src/components/public-site/MobileConcierge.tsx` — state machine: greeting → followup → matching → payoff
- `src/components/public-site/Hero.tsx` — split into `<MobileConcierge />` (md:hidden) + desktop hero (hidden md:flex)

**Tests:** 16 new tests (7 content map + 9 component integration). Full suite: 227/227 pass. tsc clean. Build clean.

**Commits:** 7 atomic commits on `feature/mobile-concierge`, fast-forward merged to main.

**Known issues for next session:**
- 5 of 9 payoff combos map to All Beauty Hair Studio — needs more portfolio variety
- Bas wants concierge on desktop too — not just mobile
- Deploy to VPS pending

---

## Session 46 Changes (2026-03-13)

**Mobile Concierge Experience — DESIGNED & PLANNED:**

Brainstormed and designed a guided mobile concierge flow that replaces the traditional hero section on mobile. Instead of a "website with information," the mobile landing asks visitors two quick questions and delivers a tailored portfolio piece with an intent-matched CTA.

**Core philosophy:** "Good service listens before it speaks." The site is about the visitor, not about us.

**Flow (3 screens + matching interstitial):**
1. **Screen 1 — The Greeting:** "What are you building?" — 4 glassmorphism tap targets (Website, Web App, Platform, Something Else) + skip link to /services
2. **Screen 2 — The Follow-Up:** "What matters most?" — 3 options tailored to Screen 1 answer. "Something Else" skips straight to intake.
3. **Matching Animation:** 800ms labor illusion ("Finding your match...") — makes the result feel earned
4. **Screen 3 — The Payoff:** Tailored portfolio piece + intent-matched CTA (e.g., "Let's make your brand stand out") linking to `/intake?type={category}&priority={priority}` for progressive profiling

**Research-backed enhancements incorporated:**
- Intent-matched CTAs — per-combination CTA copy instead of generic button
- Progressive profiling — URL params carry concierge answers to intake form
- Labor illusion — brief matching animation increases perceived value

**Key design decisions:**
- Mobile only (`md:hidden`) — desktop hero unchanged
- Client-side state machine (4 `useState` states: greeting → followup → matching → payoff)
- Full viewport (`100svh`), no scroll on mobile landing
- Framer Motion `AnimatePresence` with spring physics (no duration — avoids Session 41 bug)
- Fresh start every visit — no cookies, no tracking
- `<noscript>` fallback with simplified layout

**Documents Created:**
- `docs/superpowers/specs/2026-03-13-mobile-concierge-design.md` — full design spec (approved after 2 review rounds)
- `docs/superpowers/plans/2026-03-13-mobile-concierge.md` — 9-task implementation plan across 3 chunks (approved after 2 review rounds)

**Implementation plan overview (9 tasks, 3 chunks):**
- Chunk 1: Content map (`concierge-content.ts`) + tests
- Chunk 2: UI components (`ConciergeOption`, `ConciergeScreen`, `MobileConcierge`) + Hero.tsx refactor
- Chunk 3: Integration tests + build verification + final commit

**New files to create:**
- `src/lib/concierge-content.ts` — types + content map + `getPayoff()` + `getIntakeHref()`
- `src/components/public-site/ConciergeOption.tsx` — glassmorphism tap target with selection glow
- `src/components/public-site/ConciergeScreen.tsx` — full-viewport animated container
- `src/components/public-site/MobileConcierge.tsx` — state machine wrapper with accessibility

**Files to modify:**
- `src/components/public-site/Hero.tsx` — split into mobile concierge (`md:hidden`) + desktop hero (`hidden md:flex`)

**Commits:**
- `524e2a6` — design spec
- `3b290ce` — implementation plan
- `e6abbf1` — research enhancements (intent-matched CTAs, progressive profiling, labor illusion)

**Build:** No code changes — design/planning session only. TypeScript clean.

## Session 45 Changes (2026-03-13)

**PCB Card Connections — IMPLEMENTED:**

Executed the PCB Card Connections plan. Created `PCBConnection` wrapper component that anchors PCB fragments to specific content cards with right-angle routed connector traces.

**New Files:**
- `src/components/public-site/PCBConnection.tsx` — wrapper component: positions PCBFragment + ConnectorSVG absolutely outside card boundaries. 12 hardcoded route sets (6 variants x 2 sides). Uses `preserveAspectRatio="none"` + `vectorEffect="non-scaling-stroke"` for uniform trace width.
- `src/components/public-site/__tests__/PCBConnection.test.tsx` — 9 tests covering rendering, accessibility, positioning, port pads (happy-dom environment)

**PCBConnection Placements (edge columns only):**
- Homepage ValueProposition: cards 0 (left, bus-cluster) and 2 (right, ic-chip)
- Services ServicesGrid: cards 0 (left, trace-path) and 5 (right, via-cluster)
- Portfolio ProjectGrid: the-colour-parlor (left, smd-components)
- About AboutValues: card 1 "Transparent Always" (right, bus-cluster)
- Intake: IntakeForm wrapper (left, ic-chip)

**Floating PCBFragments Removed:**
- Removed all standalone `<PCBFragment>` instances from 10 page files (homepage, services, portfolio, about, intake, terms, privacy, cookies, refund, ai-policy)
- Legal/policy pages now have no PCB decorations (clean)
- `overflow-x-clip` kept on pages with PCBConnection, removed from legal pages

**PCBDivider Removed:**
- Removed `<PCBDivider />` from homepage (2 instances) and about page (4 instances) — was overkill between sections now that cards have anchored connections

**Visual Tuning (iterative with Bas):**
- Fragment scale: 0.5 (200x140px)
- Connector gap: 75px
- Trace opacities: base 0.175, pulse 0.25, junctions 0.2, port pads 0.175 (dimmed 2x from initial)
- Port pads: 5x8px rectangles (not circles)
- Attempted recessed background on connector bridge — REVERTED (looked wrong)

**ValueProposition Fix:**
- Added `h-full` to `motion.div` wrapper in ValueCard so all 3 cards stretch to equal height

**Dependencies Added:**
- `happy-dom@20.8.4` (devDependency) — jsdom had ESM compatibility issues with vitest

**Build:** TypeScript clean, 211 tests pass, Next.js build passes.

## Session 44 Changes (2026-03-12)

**PCB Card Connections — Design + Plan Complete:**

Brainstormed and designed a new system for how PCB fragments connect to content cards. The current floating fragments (absolute-positioned in page margins) will be replaced with card-anchored connections where:

- Fragments attach structurally to specific content cards via a new `PCBConnection` wrapper component
- Connector traces use right-angle PCB routing with junction nodes at bends
- Traces terminate at rectangular port pads on the card border (no circles)
- Hand-picked "curated random" placements — not every card gets one, preventing pattern fatigue
- 8 connections across 5 pages (Homepage, Services, Portfolio, About, Intake)
- Legal/policy pages get no connections (cleaned up)
- All 6 existing PCBFragment variants reused as-is

**Documents Created:**
- `docs/superpowers/specs/2026-03-12-pcb-card-connections-design.md` — full design spec (approved after 3 review iterations)
- `docs/superpowers/plans/2026-03-12-pcb-card-connections.md` — implementation plan with 15 tasks across 4 chunks (approved after 2 review iterations)
- `docs/superpowers/specs/2026-03-12-visual-identity-upgrade-design.md` — tables formatted

**Additional Items Identified (not yet implemented):**
1. Hero subtitle: add "web apps" after "software" — keep 2 rows
2. Hero background: normalize thick traces to standard size
3. Stats bar cards: design upgrade needed (text is perfect, visuals need work)

**Files Changed:**
- `docs/superpowers/specs/2026-03-12-pcb-card-connections-design.md` — NEW
- `docs/superpowers/plans/2026-03-12-pcb-card-connections.md` — NEW
- `docs/superpowers/specs/2026-03-12-visual-identity-upgrade-design.md` — table formatting
- `scripts/format-tables.mjs` — added spec files to FILES array

**Build:** No code changes — design/planning session only.

## Session 43 Changes (2026-03-12)

**Attempted full-page circuit board background — REVERTED:**

Session 43 attempted to replace the per-page PCBFragment components with a single `SiteBackground` component (simplified circuit board grid covering the entire site) and `PCBRecess` overlays. Bas rejected this approach — it replaced the detailed, crafted PCBFragment SVGs (IC chips, vias, trace paths, connectors, recess depth effects, SMIL animations) with a generic minimal grid. The site lost its standout visual identity and looked cookie-cutter.

**What was reverted:**
- Deleted `SiteBackground.tsx` (simplified circuit board background)
- Deleted `PCBRecess.tsx` (transparent recess overlay)
- Removed SiteBackground import and `<SiteBackground />` from `layout.tsx`
- Restored all PCBFragment imports and instances across 10 page files (exact Session 42 placements)

**What was KEPT from Session 43:**
- Green "Your Business" shimmer text in Hero.tsx — `text-gradient-shimmer-green` class using `#4ADE80` green instead of cyan
- New `.text-gradient-shimmer-green` CSS class in `globals.css` (green gradient shimmer with 8s animation, 3s delay)

**PCBFragment behavior change:**
- Removed Framer Motion fade-in/fade-out animation from PCBFragment wrapper — fragments are now static `div` elements (no `motion.div`, no `initial/whileInView` opacity transitions)
- Fragments remain fixed in position and scroll naturally with the page content
- Internal CSS animations (trace pulses, LED glows, signal flows) still animate within each fragment
- Removed unused `framer-motion` import from PCBFragment.tsx

**Key feedback from Bas (saved to memory):**
- "I never and I mean never want you to take the easy road. I don't care how much work we have to do or how long it will take."
- Animation and visual identity work requires precision — broad-stroke simplifications destroy what makes the site stand out
- The crafted PCBFragment components with their recess depth, IC chips, vias, and connector traces are a core part of the site's identity

**Files Changed:**
- `src/app/layout.tsx` — removed SiteBackground import and component
- `src/components/public-site/PCBFragment.tsx` — removed motion.div wrapper, now static div; removed framer-motion import
- `src/components/public-site/Hero.tsx` — "Your Business" uses `text-gradient-shimmer-green` class
- `src/app/globals.css` — added `.text-gradient-shimmer-green` class
- `src/app/page.tsx` — PCBFragment instances restored
- `src/app/(public)/about/page.tsx` — 4 PCBFragment instances restored
- `src/app/(public)/services/page.tsx` — 3 PCBFragment instances restored
- `src/app/(public)/portfolio/page.tsx` — 3 PCBFragment instances restored
- `src/app/(public)/intake/page.tsx` — 2 PCBFragment instances restored
- `src/app/(public)/terms/page.tsx` — 2 PCBFragment instances restored
- `src/app/(public)/privacy/page.tsx` — 2 PCBFragment instances restored
- `src/app/(public)/cookies/page.tsx` — 1 PCBFragment instance restored
- `src/app/(public)/refund/page.tsx` — 1 PCBFragment instance restored
- `src/app/(public)/ai-policy/page.tsx` — 2 PCBFragment instances restored

**Deleted Files:**
- `src/components/public-site/SiteBackground.tsx` — removed (simplified background, rejected)
- `src/components/public-site/PCBRecess.tsx` — removed (recess overlay concept, not needed)

**Build:** TypeScript clean, Next.js build passes.

## Session 42 Changes (2026-03-12)

**PCB Fragment Visual Identity Upgrade — IN PROGRESS:**

The PCBFragment component went through a major design evolution based on iterative feedback:

1. **Started** with unscrewed panel concept (frame + screws + green circuit board substrate)
2. **Iterated** through: green substrate removed (didn't fit dark aesthetic) → frame removed → border animations removed → recessed-only look approved
3. **Current state**: Recessed dark interior with brighter circuit traces, animated signal pulses, and connector traces that extend toward adjacent content

**Component Changes (`PCBFragment.tsx`):**
- Removed outer panel frame, 3D bevel, and screw holes — just recessed interior
- Removed border/edge glow animations (cyan + green pulses along edges)
- Brightened all traces: base 0.08→0.15, pulse 0.25→0.4, junctions 0.15→0.25
- Added `connectors` prop: `("top" | "right" | "bottom" | "left")[]` — traces that extend beyond the fragment toward content, with animated pulse and end nodes
- Added `overflow="visible"` on SVG so connectors can extend beyond fragment bounds
- Renamed internal `PanelSVG` to `FragmentSVG` (no longer a panel)
- LED indicators slightly larger (r=2→2.5)

**Strategic Placement Across All Pages:**
- All fragments now use `scale` prop for varied sizes (0.3–0.55)
- Positioned in side margins with negative offsets (`-right-8`, `-left-6`, etc.)
- `overflow-x-clip` on all `<main>` elements to prevent horizontal scroll from overflow-visible connectors
- `connectors` prop used on every fragment — traces reach toward content
- Alternating left/right placement down each page
- Different variants per page for visual variety

| Page      | Fragments | Sizes      | Connectors        |
| --------- | --------- | ---------- | ----------------- |
| Homepage  | 2         | 0.5, 0.45  | left, right       |
| About     | 4         | 0.55–0.35  | alternating L/R   |
| Services  | 3         | 0.5–0.35   | left, right, left |
| Portfolio | 3         | 0.5–0.35   | left, right, left |
| Intake    | 2         | 0.45, 0.35 | left, right       |
| Terms     | 2         | 0.4, 0.3   | left, right       |
| Privacy   | 2         | 0.4, 0.3   | left, right       |
| Cookies   | 1         | 0.4        | left              |
| Refund    | 1         | 0.4        | left              |
| AI Policy | 2         | 0.4, 0.3   | left, right       |

**Design Principles Established:**
- Never on top of content, never underneath
- Fragments sit in page margins, partially off-screen
- Connectors extend from fragment nodes toward glass cards/content, as if "powering" them
- Style matches homepage PCBDivider aesthetic (cyan, dark, subtle)
- All animations respect `prefers-reduced-motion`

**What Still Needs Work (Next Session):**
- Visual review on all pages — check connector alignment with actual content positions
- May need per-page connector tuning based on visual review
- Subtle standalone touches: micro-nodes between sections, tiny trace accents
- The "plugged into content" concept can be enhanced with traces that visually connect to glass card borders
- Consider a small `PCBNode` component for standalone junction points

**Files Changed:**
- `src/components/public-site/PCBFragment.tsx` — complete rewrite
- `src/app/page.tsx` — added PCBFragment import + 2 fragments
- `src/app/(public)/about/page.tsx` — 4 fragments, varied sizes
- `src/app/(public)/services/page.tsx` — 3 fragments
- `src/app/(public)/portfolio/page.tsx` — 3 fragments, restructured
- `src/app/(public)/intake/page.tsx` — 2 fragments
- `src/app/(public)/terms/page.tsx` — 2 fragments
- `src/app/(public)/privacy/page.tsx` — 2 fragments, different variants
- `src/app/(public)/cookies/page.tsx` — 1 fragment
- `src/app/(public)/refund/page.tsx` — 1 fragment
- `src/app/(public)/ai-policy/page.tsx` — 2 fragments

## Session 41 Changes (2026-03-12)

**Animation System Fix — iOS Safari Bug Resolved:**
- Root cause: iOS Safari IntersectionObserver doesn't fire for elements already in viewport during Next.js client-side navigation, leaving content at `opacity: 0`
- Fix: Added `requestAnimationFrame` fallback in FadeIn.tsx and AnimatedText.tsx — on mount, manually checks `getBoundingClientRect` to detect elements already in viewport, sets `mountVisible` state as fallback trigger
- `animate={isInView || mountVisible ? "visible" : "hidden"}` — either trigger works

**Animation Timing Overhaul (site-wide):**
- Fixed spring+duration conflict in 7 components — `duration` property fights with spring `stiffness`/`damping`, causing choppy motion. Removed `duration` from all spring transitions
- Faster spring physics: `springs.smooth` changed from `stiffness: 100, damping: 20` to `stiffness: 200, damping: 26` — snappier, settles quickly, no bounce
- Hero subtitle delay: 0.4s → 0.2s, mobile CTA delay: 0.6s → 0.35s
- StatsBar base delay: 0.7s → 0.4s, stagger: 0.08/0.1 → 0.06
- ScrollTeaser delay: 1.5s → 0.6s
- All animations now feel coordinated and responsive

**Content Fix:**
- Removed duplicate "Human + AI" paragraph from AboutStory.tsx (stays only in AboutValues card)

**Files Changed:**
- `src/components/motion/FadeIn.tsx` — iOS Safari viewport fallback
- `src/components/motion/AnimatedText.tsx` — iOS Safari viewport fallback
- `src/lib/motion.ts` — faster smooth spring preset
- `src/components/public-site/Hero.tsx` — tighter animation delays
- `src/components/public-site/StatsBar.tsx` — removed duration conflict, tighter delays
- `src/components/public-site/CTASection.tsx` — removed duration conflict
- `src/components/public-site/ScrollTeaser.tsx` — reduced delay
- `src/components/public-site/AboutStory.tsx` — removed duplicate paragraph, removed duration conflict
- `src/components/public-site/AboutOneTeam.tsx` — removed duration conflict
- `src/components/public-site/AboutPillars.tsx` — removed duration conflict
- `src/components/public-site/AboutTimeline.tsx` — removed duration conflict
- `src/components/public-site/AboutValues.tsx` — removed duration conflict
- `src/components/public-site/ValueProposition.tsx` — removed duration conflict

**Other:**
- pnpm updated from 10.10.0 to 10.32.1

## Session 40 Changes (2026-03-11)

**Mobile Responsiveness Overhaul:**
- PublicHeader redesigned: full-screen overlay mobile nav with Framer Motion animations, staggered links, active page indicator (cyan dot), body scroll lock, route-aware auto-close, animated hamburger/X toggle
- Mobile header height reduced to h-14 (desktop stays h-16)
- Hero section rebuilt with flexbox layout (`h-[100svh]`, `justify-between`) — all content fits in one viewport on mobile
- Hero heading sized at `text-[2.25rem]` on mobile, subtitle flows naturally without forced `<br>`
- Mobile CTA buttons redesigned: "Start a Project" (h-13, rounded-2xl, arrow icon) + "View Our Work" (subtle, eye icon)
- Stats bar: 2x2 compact grid on mobile (rounded-xl, minimal borders), 4-column glass-card grid on tablet+
- Stats: "AI / Augmented Delivery" changed to "Direct / Dev Access"
- Mobile nav footer: quote "The best way to predict the future is to create it" + cyan divider + BuiltByBas brand
- Desktop stats cards raised with `md:mb-36`, Learn More raised with `md:mb-[66px]` (mobile margins independent)

**Viewport & Scroll Fixes:**
- Added Next.js `viewport` export: `minimumScale: 1, maximumScale: 5` — zoom in allowed, zoom out past 100% blocked
- `overflow-x: hidden` + `overscroll-behavior-x: none` on html/body (CSS) — no horizontal scroll
- `overflow-x-hidden` class on both `<html>` and `<body>` elements
- Hidden scrollbar CSS utility (`.scrollbar-none`)

**Animation System Changes (Session 40):**
- Viewport detection margin reduced from `-100px` to `-40px` (motion.ts)
- FadeIn.tsx: switched from `whileInView` to `useInView` hook + `animate` prop

**Other Changes:**
- CTA section mobile padding reduced (`px-5` instead of `px-8`)
- Footer links now have proper touch targets (h-10/h-9 with padding and hover states)
- Policy links bumped to `text-sm` on tablet+
- HeroBackground edge fades halved on mobile (`h-16`/`w-10` vs `h-32`/`w-20`)

## Session 39 Changes (2026-03-07)

**Eight Pillars Redesign (About Page):**
- Added concrete example text to every pillar card explaining what each pillar means in practice
- R3S card gets a dedicated risk/mitigation section (amber warning + green shield icons)
- Removed blue hover background and glow burst effect from pillar cards

**Blur Burst Removal (Site-wide):**
- Removed blur-md glow overlays from icon containers in AboutOneTeam, AboutValues, ValueProposition
- Removed g2 blur filter from HeroBackground center hub circle
- Toned down central processor radial glow (removed pulse animation, reduced opacity)
- Kept backdrop-blur on navigation/sticky bars (functional glassmorphism, not decorative)

**About Page Copy Updates:**
- "Veteran-Backed" credential card → "Built on Integrity" with new description
- Removed all "veteran" references from site metadata (layout.tsx, page.tsx, json-ld.ts)
- Updated origin story: "quality software built for how they actually operate in their daily businesses"
- Added third story paragraph: "Human + AI" — 20+ years of dev knowledge + AI speed, delivering unique custom solutions
- Credential cards vertically centered with story content (`items-center`)

**Governance Doc Updates:**
- Updated Pillar 8 in CLAUDE.md: renamed to "Robustness, Redundancy, Recovery, Strategy", added explicit Risk/Mitigation lines

**Files Changed:**
- `src/components/public-site/AboutPillars.tsx` - examples, R3S risk/mitigation, removed glow
- `src/components/public-site/AboutOneTeam.tsx` - removed blur burst from icon containers
- `src/components/public-site/AboutValues.tsx` - removed blur burst from icon containers
- `src/components/public-site/ValueProposition.tsx` - removed blur burst from icon containers
- `src/components/public-site/HeroBackground.tsx` - removed center hub blur filter, toned down radial glow
- `src/components/public-site/AboutStory.tsx` - story copy, Built on Integrity, Human+AI paragraph, centered grid
- `src/app/layout.tsx` - removed veteran from meta description
- `src/app/page.tsx` - removed veteran from meta description
- `src/lib/json-ld.ts` - removed veteran from structured data
- `.claude/CLAUDE.md` - updated R3S pillar definition with risk/mitigation
- `docs/HANDOFF.md` - session 39 notes

## Session 38 Changes (2026-03-07)

**Hero Section Overhaul:**
- Hero section set to exact viewport height (`h-[calc(100vh-4rem)]`) so "Why BuiltByBas?" no longer peeks when scrolled to top
- Scroll teaser pinned to bottom of hero with absolute positioning, changed to white text
- PCB background shifted down (`translate-y-[7%]`) so center hub sits between headline and cards
- Central processor glow orb moved down to `top-[65%]`
- IC chips and SMD components made fully opaque (`fill="rgb(8, 18, 28)"`) with SVG render order fix (split chipGroupRef into chipPathsRef + chipRectsRef)
- Added blinking processing LEDs to 4 select chips (fast 0.6s blink), IC 1 has 3 sequential LEDs
- Chip glow animation preserved when traces reach chips (overlay rects render after chip bodies)

**Animation Replay:**
- All Framer Motion animations now replay when scrolling back up (`viewportRepeat` with `once: false`)
- Applied to FadeIn, ValueProposition, CTASection, StatsBar

**Content Updates:**
- ValueProposition card updated: "Fast, Accurate, Reliable" with expanded description about AI-augmented delivery, human/code gates, documentation
- Delivery times scaled to "2-3 weeks for most projects" across ValueProposition and Services FAQ
- ScrollTeaser text changed to white

**Demo Data Anonymized:**
- All client names replaced with Client 1 through Client 10
- All phone numbers replaced with (111) 111-1111
- All emails replaced with `clientN@example.com`
- All business names replaced with "[Industry] Business N" (e.g., "Wellness Business 1", "Legal Business 1")
- Activity notes scrubbed of personal names

**Portfolio Cleanup:**
- Animation and Concept tabs hidden from portfolio filter bar
- Animation/concept projects excluded from "Live" grid view
- Created dedicated `/concepts` page (noindex, no nav link, direct URL only)
- ConceptGrid component with subcategory filter for the concepts page

**Visual Cleanup:**
- Removed decorative blur orb overlays from CTA section (top-left and bottom-right corner flares)

**Files Changed:**
- `src/components/public-site/HeroBackground.tsx` - PCB position, opaque chips, LEDs, split refs
- `src/components/public-site/Hero.tsx` - exact viewport height, absolute scroll teaser
- `src/components/public-site/ScrollTeaser.tsx` - white text
- `src/components/public-site/ValueProposition.tsx` - updated card copy, viewportRepeat
- `src/components/public-site/CTASection.tsx` - removed blur orbs, viewportRepeat
- `src/components/public-site/StatsBar.tsx` - viewportRepeat
- `src/components/motion/FadeIn.tsx` - viewportRepeat
- `src/lib/motion.ts` - added viewportRepeat export
- `src/app/(public)/services/page.tsx` - updated FAQ delivery timeline
- `src/data/demo-data.ts` - fully anonymized client data
- `src/components/portfolio/ProjectFilter.tsx` - hidden animation/concept tabs
- `src/components/portfolio/ConceptGrid.tsx` - new concept grid component
- `src/app/(public)/concepts/page.tsx` - new hidden concepts page
- `src/data/portfolio.ts` - excluded animation from "all" filter

## Session 37 Changes (2026-03-07)

**Interactive Public Demo Backend (`/demo`):**
- Full 8-page demo backend at `/demo` mirroring the admin CRM without auth
- All static mock data in `src/data/demo-data.ts` (no database, no API calls)
- `src/app/(public)/demo/layout.tsx` with `DemoSidebar` and amber demo mode banner
- `src/components/layout/DemoSidebar.tsx` with 8 nav items + "Start Your Project" CTA

**Demo Pages (all interactive, client-side state):**
- **Dashboard** (`/demo`) - 4 clickable stat cards routing to sections, complexity distribution bar, service demand grid, donut chart (budget ranges), industry mix cloud, top priority submissions, recent pipeline activity
- **Clients** (`/demo/clients`) - search bar, stage filter pills with counts, sort (Recent/Name/Revenue), expandable rows with stage update buttons
- **Pipeline** (`/demo/pipeline`) - HTML5 native drag-and-drop kanban (no extra deps), responsive 7-column grid (no horizontal scroll), click-to-move fallback, drop zone highlighting
- **Intake** (`/demo/intake`) - already existed from prior session
- **Projects** (`/demo/projects`) - progress +/-10% buttons, status auto-updates based on progress thresholds, "Mark as Completed" action, filter by status
- **Proposals** (`/demo/proposals`) - status filter pills, live stats (total/won value, conversion rate), expandable rows with status transitions
- **Invoices** (`/demo/invoices`) - "Mark as Paid" action, collection rate percentage, filter by status, expandable details
- **Analytics** (`/demo/analytics`) - time period selector (6M/YTD/12M), hover tooltips on bar chart, period total/average computed dynamically

**Demo Data Integrity:**
- All math verified: pipeline $126,000 (exact sum of 10 cards), revenue $98,000 (sum of monthly), 50% conversion rate (2/4 proposals)
- Real client removed: Lacy Thompson/Colour Parlor replaced with Rachel Simmons/Luxe Hair Lounge in all locations
- No negative numbers or decline messaging - all positive growth trends
- Proposal pricing bumped to realistic custom software values ($7,500-$24,000)
- Cross-page consistency verified (same client appears with matching amounts across pipeline, proposals, invoices, projects)

**Portfolio Updates:**
- BuiltByBas backend portfolio item now links to `/demo` instead of `https://builtbybas.com`
- Portfolio sorting: `statusOrder` record sorts live projects before in-progress before demo
- All 21 portfolio screenshots converted from PNG to WebP (2.2MB to 856KB, 61% reduction)
- Fixed case-sensitive folder naming (`Systems/` to `systems/`) for Linux VPS compatibility via two-step git mv

**About Page Refresh:**
- Content updates to about page
- `globals.css` updates

**Commits Pushed:**
- `a5d0e4f` feat: interactive public demo backend + portfolio sort
- `c6255bd` content: add builtbybas backend portfolio screenshots
- `b130405` fix: lowercase portfolio image folder for Linux case-sensitivity
- `2bce0b1` feat: about page refresh, globals.css updates, docs and knowledge base
- `ce3b189` perf: convert portfolio screenshots from PNG to WebP (2.2MB -> 856KB)

## Session 36 Changes (2026-03-06)

**Content Overhaul - Mdash Removal + I-to-We Story Arc:**
- Removed all AI-stereotypical mdashes from public-facing content across 28+ files
- Implemented I-to-we story arc on About page: cards 1-3 use "I", card 4 switches to "We"
- "Businesses Deserve Better" timeline card rewritten with lift-up messaging (no competitor bashing)
- AboutStory, AboutValues updated for we-voice (credential cards, values section)
- Mdashes removed from intake-questions, portfolio data, demo-seed, intake-scoring, admin titles, OG image

**Full Site Audit (4 Parallel Agents):**
- Content audit: all public text clean, no remaining mdashes in user-visible content
- SEO audit: sitemap expanded 5 to 52+ pages, homepage metadata added
- Accessibility audit: ProposalResponse.tsx fixed (textarea label, main landmark)
- Security/performance audit: env var consistency fixed, CSP updated for Umami, all security controls verified strong

**SEO Fixes:**
- `src/app/sitemap.ts` - now dynamically includes all portfolio pages + 5 policy pages
- `src/app/page.tsx` - added missing Metadata export (title + description)
- Admin page titles: mdash replaced with hyphen across 16 files

**Security Fixes:**
- Fixed 3 files using undefined `SITE_URL` env var (now `NEXT_PUBLIC_SITE_URL`)
- CSP in `next.config.ts` updated to allow `analytics.builtbybas.com` (script-src + connect-src)
- Umami SSL cert installed via certbot on VPS
- UFW rule added to block external access to port 3003 (Umami only via Nginx)

**RAI Compliance:**
- Added Section 6 to AUDIT.md with full RAI compliance audit (6 subsections)
- RAI-POLICY.md: removed #OneTeam reference, fixed mdash on line 9
- All human review gates verified, bias prevention confirmed, transparency checks pass

**Issues Found:** 12 total (ISS-4 through ISS-12), 11 closed, 1 open (ISS-12: rotate Resend API key)

## Session 35 Changes (2026-03-06)

**Legal Policies — 5 Public Pages (dated Jan 1, 2025):**
- **Privacy Policy** (`/privacy`) — data collection (intake form, Umami cookieless analytics), AI processing via Anthropic, data retention periods (3yr active clients, 1yr non-client intakes, 2yr proposals), full CCPA/CPRA rights (Right to Know, Delete, Correct, Opt-Out, Non-Discrimination), children's privacy (under 16)
- **Terms of Service** (`/terms`) — client responsibilities, IP ownership (full transfer on payment), pre-existing materials license, portfolio rights, payment terms (50% deposit, 1.5%/mo late fees, 30-day suspension), 30-day warranty period, liability cap (total project fees), indemnification, confidentiality (2yr survival), termination (client and company), force majeure, California law + AAA arbitration, mediation-first dispute resolution
- **Cookie Policy** (`/cookies`) — single strictly necessary cookie (session_token for auth), Umami cookieless analytics disclosure, no advertising/tracking/third-party cookies, DNT compliance
- **Refund & Cancellation Policy** (`/refund`) — non-refundable deposits (48hr grace period before work begins), cancellation table by project stage with pro-rated refunds, satisfaction guarantee, change order process, hosting cancellation (30-day notice, 2hr migration support)
- **Responsible AI Policy** (`/ai-policy`) — human review gates (no AI output reaches clients without human approval), what data goes to AI vs what never does, Anthropic zero-retention API, bias-free scoring (protected characteristics excluded), transparency commitment, client rights (opt-out of AI, request explanations), incident response (72hr client notification), EU AI Act / CCPA / GDPR compliance

**Website Footer — Policy Links:**
- Added policy links row to `PublicFooter.tsx`: Privacy Policy, Terms of Service, Cookie Policy, Refund Policy, Responsible AI
- Subtle styling (`text-xs text-muted-foreground/70`) below main nav links, above copyright

**Professional Email Footer:**
- New `buildEmailFooterHtml()` in `src/lib/proposal-email.ts` — shared across all outgoing emails
- Includes: "Reviewed and approved by Bas Rosario", company name/location, contact info, policy links (Privacy, Terms, Refund, AI), copyright
- Applied to proposal send, nudge follow-up, and intake link emails

**Hero Section Cleanup:**
- Removed CTA buttons from hero on desktop (redundant with nav "Start a Project" + "Portfolio")
- Added mobile-only CTA buttons (`md:hidden`) — "Start a Project" (cyan, neon-glow) + "View Our Work" (darkened bg-white/20)
- Darkened "View Our Work" button: `bg-white/5` → `bg-white/20`, hover `bg-white/35`
- Stats bar moved up: `mt-24/mt-28` → `mt-16/mt-20`

**Cascading Shine Animation:**
- Added `--shine-delay` CSS custom property to `btn-shine::after` in `globals.css`
- Supports staggered shine sweep across multiple buttons via inline `style` prop

**Subtle PCB Background on Inner Pages:**
- New `PageBackground` component — static SVG PCB traces at 25% opacity
- Radial vignette keeps center clean/dark, traces peek through at page edges
- Applied via `(public)/layout.tsx` — all public pages get it automatically
- No animations, no JS, server-renderable (zero performance impact)

## Session 34 Changes (2026-03-06)

**Admin BCC on All Client Emails:**
- Added `ADMIN_EMAIL` export to `src/lib/email.ts` (reads from `ADMIN_EMAIL` env var)
- Proposal send route (`src/app/api/proposals/[id]/send/route.ts`) now BCCs admin on every email
- Nudge route (`src/app/api/proposals/[id]/nudge/route.ts`) now BCCs admin on every email
- Confirmed working: nudge email received at `bas.rosario@gmail.com` via BCC
- `ADMIN_EMAIL=bas.rosario@gmail.com` already set in local and production `.env.local`

**Service Walkthrough — Scrollbar Fix:**
- Added `overflow-x-hidden` to step content container in `ServiceWalkthroughOverlay.tsx`
- Eliminates horizontal scrollbar flash during step slide animations

**Intake Form — Scroll to Top on Step Change:**
- `nextStep()` and `prevStep()` in `src/hooks/useIntakeForm.ts` now call `window.scrollTo({ top: 0, behavior: "smooth" })`
- Form always starts at the top when navigating between steps

**Housekeeping:**
- Installed `tsx` as dev dependency (was referenced in `db:seed` script but not installed)
- Pushed commits `5182191` (Session 33) and `733f875` (admin BCC) to remote

## Session 33 Changes (2026-03-06)

**Security Hardening — Proposal Response Flow:**
- Fixed GET handler in `src/app/api/proposals/respond/route.ts` to use `hmacHash(token)` before DB lookup (was comparing raw token against hashed DB value)
- Accept action now correctly advances pipeline to `proposal_accepted` stage (was using invalid `negotiation` enum)
- Decline action sets client `status: "lost"` while keeping pipeline stage unchanged (was using invalid `lost` pipeline stage)

**Proposal Detail — Accept/Decline Status:**
- Added `respondedAt` and `nudgedAt` to admin proposal detail query (`src/app/admin/proposals/[id]/page.tsx`)
- Added `respondedAt` and `nudgedAt` to API response (`src/app/api/proposals/[id]/route.ts`)
- Green "Client Accepted" and red "Client Declined" banners in `ProposalDetailView.tsx`
- `respondedAt` shown in timeline audit trail

**Gentle Nudge — Follow-Up Emails:**
- New API route `src/app/api/proposals/[id]/nudge/route.ts` — sends follow-up email for sent proposals
- 48-hour cooldown between nudges to prevent spamming clients
- Generates fresh response token on each nudge (invalidates old link, provides new one)
- Smart copy based on days since sent (≤3 days, ≤7 days, 7+ days)
- New `buildNudgeEmailHtml()` in `src/lib/proposal-email.ts`
- "Follow Up" card in proposal detail view (only visible when status is "sent")

**Public Site Polish:**
- Hero section spacing opened up — more breathing room between subtitle, CTAs, and stats bar
- Step indicator line in service walkthrough fixed — opaque circle backgrounds, animated gradient progress line, cyan glow on active step

**Pipeline Redesign:**
- Rewrote `PipelineBoard.tsx` from 12-column horizontal kanban to 4-phase tab layout (Inbound, Proposal, Active Work, Delivered)
- No horizontal scrollbar — phase tabs with count badges, responsive grid within active phase
- Auto-selects first phase that has clients

**Database Migration:**
- Generated `drizzle/0008_pale_felicia_hardy.sql` for `response_token`, `responded_at`, `nudged_at` columns + index + unique constraint
- Applied via direct SQL (drizzle-kit migrate had conflicts with older migration). Production VPS needs same migration applied
- **Note:** Drizzle migration journal may be out of sync — resolve before next `drizzle-kit migrate`

## Session 32 Changes (2026-03-06)

**Deployment + Backlog Audit:**
- Session 31 committed (`5dbfa4e` — 9 files, 1056 insertions, 130 deletions) and deployed to VPS
- Production database confirmed clean — no seed data, real submissions only
- Full backlog audit completed — 20 outstanding items cataloged across 7 categories
- Modular AI provider architecture confirmed as next major feature (swap models via config, not rewrites)

## Session 31 Changes (2026-03-06)

**Project Prioritization — Bias-Free by Design:**
- New `src/lib/prioritization.ts` — 6 weighted factors: Project Readiness (25%), Budget Alignment (20%), Scope Clarity (20%), Engagement Level (15%), Timeline Feasibility (10%), Risk Assessment (10%)
- Explicitly excludes: client name, email domain, industry, company size, budget amount, demographics
- 21 new tests including bias prevention tests (same score for different industries, company sizes, names, email domains)
- Admin dashboard "Top Priority" section — submissions ranked by priority score with color-coded badges
- Intake list view — default sort changed to priority, priority badges with tooltip factor breakdown

**Content-Aware Proposals:**
- Executive Summary leads with client's vision quote via `extractFirstVision()`
- "What We Understand" section pulls actual intake answers (challenge, vision, business context)
- "At a glance" format for client profile (industry, team size, timeline)
- `buildWhyThisService()` generates compelling service justifications from client's own words
- Per-service scope shows "What you told us isn't working" and "What success looks like to you"
- Timeline and Investment sections rewritten in Bas's conversational voice

**Confidentiality + Privacy in Every Proposal:**
- Terms section includes Confidentiality statement (trade secrets, no sharing without consent)
- Privacy Policy footer (GDPR, CCPA, international frameworks, `privacy@builtbybas.com`)

**RAI Policy v2 — Global Compliance:**
- Complete rewrite of `RAI-POLICY.md` (~330 lines)
- Covers: UK GDPR, EU GDPR, EU AI Act, UK ICO guidance, CCPA/CPRA, OECD AI Principles, UNESCO AI Ethics, Equality Act 2010, UK Children's Code, COPPA
- 11 sections: Scope, AI Use Cases, Human Review Gates, Data Protection, Transparency, Fairness/Bias Prevention, Security, Incident Response, Accountability, Children's Data, Contact
- AI risk classification: all use cases "limited risk" under EU AI Act
- Meaningful human oversight requirements per UK ICO
- Data subject rights table with 30-day response commitment
- Incident response protocol with ICO notification within 72 hours

**Test Results:** 202/202 passing (21 new prioritization tests)

## Session 30 Changes (2026-03-06)

**Proposal Generator — Scope-Aware Pricing:**
- Replaced flat midpoint pricing with `computeScopedPriceCents()` — positions price within (or above) service range based on:
  - Complexity score (higher complexity → higher in range)
  - Scope premium keywords per service (e.g., "3D configurator", "augmented reality", "ERP integration" for e-commerce)
  - Client budget signal (if budget exceeds service range, price adjusts upward)
  - Multi-service integration overhead (+5% per additional service)
  - Cap at 1.5x top of range to prevent runaway pricing
- Added `SCOPE_PREMIUM_KEYWORDS` covering all 9 services with domain-specific high-cost feature lists
- Nordic Nest E-Commerce example: was $16.5K (dead midpoint), now ~$29-33K (scope-aware for 3D configurator + AR + ERP)
- 7 new tests for `computeScopedPriceCents` — total tests: 181

**Intake List Filter UX:**
- Added cross-filter counting — each filter group shows how many results each option would produce given other active filters
- Filter buttons display counts in parentheses, disabled when count is 0
- "Clear all filters" button appears on empty filtered results
- Prevents confusing "0 of 19 submissions" scenario

**Admin Dashboard — Complexity Distribution Chart:**
- Replaced ring gauge visualization with stacked horizontal bar + 4-column legend grid
- Better visual alignment and readability

**DNS:**
- analytics.builtbybas.com A record added to Hostinger DNS (→ 72.62.200.30), propagating
- Once resolved: `sudo certbot --nginx -d analytics.builtbybas.com` then `sudo ufw delete allow 3003`

## Session 29 Changes (2026-03-06)

**Public Site (from prior context carryover):**
- Removed watermark numbers (01-04) from all public components
- Even card alignment — removed staggered Y offsets
- Fixed cyan bar artifact (blur-md + overflow-hidden) across all glass cards
- Service card banner redesign — icon + title in banner with sharp inset glow
- Equal-height Journey cards with fleshed-out descriptions

**Admin Dashboard:**
- Redesigned 4 chart panels with visual variety:
  - Complexity Distribution → Ring gauges (4 radial circles with percentage)
  - Service Demand → Grid of mini cards with large count numbers
  - Budget Ranges → Donut ring chart with legend sidebar
  - Industry Mix → Proportional colored pill tags
- Fixed budget range normalization — handles both short keys ("5k-15k") and display labels ("$5,000 - $10,000")
- Fixed industry label deduplication — groups by resolved label (e.g., "financial-services" and "Financial Services" merge)
- Added INDUSTRY_LABELS for: financial-services, legal, logistics, automotive, retail

**Pipeline:**
- Pipeline now shows unconverted intake submissions in the "Lead" column
- Intake cards show "Intake" badge, primary service, and link to `/admin/intake/[id]`
- Pipeline subtitle shows count of pending intakes

**Admin Sidebar:**
- Added notification badges (fetched from `/api/admin/notifications` every 60s)
- Badges show on Intake (new count), Proposals (draft count), Invoices (overdue count)

**Dark Mode Fixes:**
- Fixed native `<select>` dropdown rendering — added global CSS `color-scheme: dark` and dark `<option>` styling
- All admin select dropdowns now readable on dark background

**Intake Test Data:**
- 21+ complete intake submissions across all 9 service types
- Varied budget ranges: $1K-$5K through $30K+
- Multi-service combos for higher complexity scoring (dashboard+CRM, ecommerce+website, portal+dashboard+website, platform+AI)
- Diverse industries: healthcare, legal, real estate, financial services, fitness, food/hospitality, retail, automotive, professional services

**Known Issues / Next Session:**
- Intake list filter UX: when multiple filters combine (e.g., "Moderate" + "CRM Systems"), results show 0 because they AND together. Need filter counts on buttons showing how many would match, or auto-reset conflicting filters.
- Background intake submission agent may not have completed all 8 target submissions — verify count and submit remaining
- Need to commit all changes and push
- Project prioritization suggestions not yet added to dashboard
- Circuit board background patches (from earlier session, user hasn't re-raised)

---
