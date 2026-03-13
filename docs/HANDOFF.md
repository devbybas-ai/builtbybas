# BuiltByBas — Handoff Document

> **Last Updated:** 2026-03-13 (Session 45)
> **Status:** PCB Card Connections IMPLEMENTED — card-anchored fragments with connector traces live across 5 pages. PCBDivider removed. Visual tuning complete. Ready to commit, push, and deploy.
> **Next Session Priority:** Commit all pending changes (Sessions 42-45). Push + deploy to VPS. Then: hero subtitle text change ("web apps"), hero background trace normalization, stats bar design upgrade.

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

## Table of Contents

- [Part 1: Project Concept](#part-1-project-concept)
- [Part 2: Decisions Made](#part-2-decisions-made)
- [Part 3: Build Status](#part-3-build-status)
- [Part 4: Context](#part-4-context)

---

## Part 1: Project Concept

### What Is BuiltByBas?

A full-stack development and marketing company that builds custom software, websites, and growth strategies for businesses ready to grow. Every project is precision-engineered — no templates, no bloated teams, no disappearing act. Bas + Claude (#OneTeam) deliver elite-quality work through unified engineering and marketing under one roof.

### Who Is It For?

Businesses across all sectors:
- **Local service businesses** — plumbers, contractors, cleaners, salons
- **Growing service companies** — agencies, consultants, coaches
- **Startups / new businesses** — need everything from brand to tools
- **Professional practices** — law, accounting, medical

### The Problem

Businesses get burned by agencies that:
1. **Overcharge and underdeliver** — $20k+ quotes, months of delays
2. **Give them cookie-cutter templates** — every site looks the same
3. **Disappear after launch** — no support, no relationship
4. **Don't understand their business** — big agencies don't listen

### The Solution

BuiltByBas does it differently:
- **Custom, not templated** — every project built for THEIR business
- **Fast, not bloated** — AI-augmented delivery in weeks, not months
- **Transparent, not opaque** — client portal shows progress, deliverables, invoices
- **Ongoing, not abandoned** — maintenance retainers, feature add-ons, real support

### The Feel

When someone lands on builtbybas.com: **"This guy is elite."**
Dark, premium, cutting-edge. The site itself IS the portfolio piece. Every interaction demonstrates what BuiltByBas delivers. 2026 design language with full Framer Motion animations.

### Revenue Model

1. **Project fees** — $2,500 to $50,000+ per project
2. **Monthly retainers** — $200-$1,000/month per client (maintenance, hosting, support)
3. **Hosting markup** — managed VPS for clients
4. **Phase 2 / add-on work** — client portal, AI features, new capabilities

### Services

| Service                  | Description                                  | Range              |
| ------------------------ | -------------------------------------------- | ------------------ |
| Marketing websites       | Custom responsive, SEO-optimized, accessible | $2,500 - $8,000    |
| Website redesigns        | Modern rebuild, performance-optimized        | $3,000 - $10,000   |
| Landing pages            | High-conversion single-page sites            | $1,000 - $3,000    |
| Business dashboards      | Admin panels, internal tools                 | $5,000 - $20,000   |
| Client portals           | Customer-facing status and communication     | $4,000 - $15,000   |
| E-commerce               | Custom storefronts                           | $8,000 - $25,000   |
| CRM systems              | Lead tracking, pipeline, client management   | $8,000 - $25,000   |
| Full operations platform | Website + CRM + portal + invoicing + AI      | $15,000 - $50,000+ |
| AI-powered tools         | Custom AI assistants, automation             | $10,000 - $40,000  |

### Success Metrics

- **3 months (May 2026):** Site live on VPS, CRM operational, 3+ clients in pipeline, 1+ proposal sent
- **1 year (Feb 2027):** 10+ completed projects, active portal users, $5k+/month recurring, real case studies

---

## Part 2: Decisions Made

### Technology Stack (LOCKED)

| Layer           | Choice                                       | Locked |
| --------------- | -------------------------------------------- | ------ |
| Framework       | Next.js (App Router)                         | Yes    |
| Language        | TypeScript (strict)                          | Yes    |
| Database        | PostgreSQL                                   | Yes    |
| Styling         | Tailwind CSS 4                               | Yes    |
| Components      | shadcn/ui                                    | Yes    |
| Animation       | Framer Motion                                | Yes    |
| Validation      | Zod                                          | Yes    |
| Auth            | Custom (httpOnly cookies, bcrypt, RBAC)      | Yes    |
| Testing         | Vitest + Playwright + axe-core               | Yes    |
| Package Manager | pnpm                                         | Yes    |
| Hosting         | Hostinger VPS (PM2 + Nginx)                  | Yes    |
| AI Provider     | Anthropic (Claude)                           | Yes    |
| Design          | Dark glassmorphism + electric cyan (#00D4FF) | Yes    |

### Architecture Decisions

- 3 applications in 1 Next.js monorepo (public, admin, portal)
- 3 user roles: owner, team, client (RBAC)
- 12-stage client pipeline (Lead → Completed)
- 10-section intake form as primary CTA
- Full AI suite with human-in-the-loop gates
- Full in-app invoicing
- Custom quotes only (no fixed packages)
- SEO optimized for both traditional search AND AI algorithms (JSON-LD, semantic HTML)
- **ORM: Drizzle** — SQL-first, TypeScript inference, lighter than Prisma (decided Phase 1)

### DevOps Decisions

- Private GitHub repo: devbybas-ai/builtbybas
- Trunk-based branching (main + feature branches)
- GitHub Actions CI: lint → type-check → test → build → audit
- No Docker — PM2 + Nginx on VPS
- Environments: local → staging → production

### Infrastructure

- **VPS:** Hostinger srv1418044.hstgr.cloud (72.62.200.30)
- **OS:** Ubuntu 24.04 LTS
- **Specs:** 2 CPU, 8 GB RAM, 100 GB disk
- **Domain:** builtbybas.com (purchased)
- **Deploy:** LIVE — Node 22, pnpm 10, PM2, Nginx, PostgreSQL 16, Let's Encrypt SSL (expires 2026-05-30), GitHub deploy key configured

---

## Part 3: Build Status

| Phase | Name                                   | Status   | Sessions |
| ----- | -------------------------------------- | -------- | -------- |
| 0     | Project Setup & Governance             | COMPLETE | Setup    |
| 1     | Foundation (Next.js, DB, auth, layout) | COMPLETE | 1        |
| 2     | Public Website                         | COMPLETE | 2-5      |
| 2.5   | Intake Analysis Engine                 | COMPLETE | 6        |
| 2.6   | Live Portfolio + Hero Shine            | COMPLETE | 7        |
| 3     | CRM Core (clients, pipeline, scoring)  | COMPLETE | 7-13     |
| 4     | Projects + Financials                  | COMPLETE | 15       |
| 5     | Algorithmic Proposals + Revision UX    | COMPLETE | 17       |
| 6     | Hardening + Deployment                 | PARTIAL  | 14       |

### What Was Done (Setup Sessions 1-5)

**Session Setup-1 (Table Formatting):**

- Fixed table formatting across all 9 governance docs — columns now align in source view
- Created `scripts/format-tables.mjs` — reusable Node.js table formatter for all docs
- Updated `.markdownlint.json` — enabled default rules with specific suppressions

**Session Setup-2 (Governance Commit + Standards):**

- First commit: `chore: initialize project governance structure` — 18 files, 7,212 insertions
- Added Section 6 (SEO Foundation) to PROJECT-SETUP.md — universal standard for all projects
- Added Document Format Enforcement rules to CLAUDE.md Section 8 (8 rules)
- Finalized all SEO decisions in HANDOFF.md — title pattern, OG, JSON-LD, CWV, fonts, images
- Scored SEO Foundation dimension 13 at 10/10 — overall audit 10/10 (A+)
- Second commit: `docs: add SEO foundation standard and document format enforcement`

**Session Setup-3 (Git + GitHub):**

- Configured git identity: Bas Rosario / `devbybas@gmail.com`
- Generated SSH key (`~/.ssh/github_devbybas`) for devbybas-ai GitHub account
- Added `github.com-devbybas` host alias to SSH config (multi-account pattern)
- Resolved divergent history (rebased local onto GitHub's auto-generated Initial commit)
- Pushed all commits to GitHub — all 18 governance files now live on remote

**Git state:** 5 commits on main, local ahead of remote by 2 at `ccd5791`

**Session Build-1 (Phase 1 Foundation):**

- Scaffolded Next.js 16 with App Router, TypeScript strict, pnpm, Tailwind CSS 4
- Installed 14 production deps + 17 dev deps (Drizzle, Framer Motion, Zod, bcryptjs, shadcn/ui, Vitest, Playwright, axe-core)
- Built dark glassmorphism design system: globals.css with BuiltByBas tokens (#0A0A0F bg, #00D4FF cyan, glass utilities, neon glow, text gradient, reduced-motion support)
- Created 5 shadcn/ui components (button, card, input, label, sonner) + 3 shared components (GlassCard, SkipToContent, ErrorBoundary)
- Set up route groups: (public) with 4 pages, (auth) with login, admin with sidebar layout, portal with sidebar layout
- Built 4 layout components: PublicHeader (glass navbar, mobile menu), PublicFooter, AdminSidebar (8 nav items with icons), PortalSidebar (3 nav items)
- Configured Drizzle ORM with PostgreSQL: users table (uuid, email, passwordHash, name, role enum, timestamps) + sessions table (uuid, userId FK, expiresAt)
- Built custom auth system: bcrypt (cost 12), httpOnly cookie sessions (7-day), rate limiting (5/15min/IP), RBAC middleware
- Created 3 API routes: POST /api/auth/login (Zod validation + rate limiting), POST /api/auth/logout, GET /api/auth/session
- Added 6 security headers to next.config.ts (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection)
- Set up Vitest (21 tests passing across 3 suites: utils, sanitize, validation) + Playwright config + axe-core integration
- Created SEO foundation: robots.ts (disallow admin/portal/api), sitemap.ts (5 public pages), metadata template with OG defaults
- TypeScript types: auth.ts (User, Session, SafeUser, UserRole), api.ts (ApiResponse, PaginatedResponse, ApiError)
- Utility modules: sanitize.ts (escapeHtml, sanitizeString, sanitizeObject), validation.ts (loginSchema with Zod), utils.ts (cn helper)
- Commit: `9139dcc` — 57 files, 12,524 insertions

**Verification — all passing:**
- `pnpm lint` — 0 errors
- `pnpm tsc --noEmit` — 0 type errors
- `pnpm test` — 21/21 tests passing
- `pnpm build` — 14 routes compiled (8 static, 3 dynamic API, robots.txt, sitemap.xml)

**Session Phase2-1 (Public Website — Elite Frontend):**

- Built animation infrastructure: `src/lib/motion.ts` (spring presets, variants, viewport config), `useReducedMotion` hook, `useScrollProgress` hook, 6 motion components (FadeIn, StaggerContainer, AnimatedText, CountUp, ParallaxSection, MotionProvider)
- Created service data layer: `src/types/services.ts` (Service interface, ServiceIcon type), `src/data/services.ts` (9 services with pricing, features, categories)
- Built homepage: HeroBackground (dense SVG circuit board with IC chips, bus lines, via holes, animated data particles — inspired by PCB/AI chip aesthetic), Hero (AnimatedText headline, dual CTAs with hover/tap physics), StatsBar (4 aspirational stats with CountUp animation), ValueProposition (3 glass cards with hover lift + cyan glow), CTASection (reusable CTA block)
- Built services page: ServiceIcon (Lucide icon mapper with glow), ServiceCard (glassmorphism card with 3D mouse-tracked tilt, price badge, feature checklist), ServicesGrid (responsive 1/2/3 col stagger grid)
- Built about page: AboutStory (two-column narrative — frustrated developer + builder's passion + AI pioneer), AboutValues (4 value cards), AboutOneTeam (Bas + Claude partnership visual), AboutTimeline (vertical timeline with 4 milestones)
- Added page transitions: MotionProvider wraps all pages with fade-in keyed on pathname
- CSS additions: orb-pulse keyframe, trace-pulse animations, hero-grid utility
- Every motion component respects `prefers-reduced-motion` via `useReducedMotion` hook
- All 3 public pages (home, services, about) transformed from bare placeholders to cinematic, conversion-focused experiences
- 23 new files created, 5 files modified
- Commit: pending (session not yet committed)

**Verification — all passing:**
- `pnpm lint` — 0 errors
- `pnpm tsc --noEmit` — 0 type errors
- `pnpm test` — 21/21 tests passing
- `pnpm build` — 14 routes compiled

**Session Phase2-2 (Portfolio, Intake Form, SEO, E2E Tests + Copy Overhaul):**

- **Copy overhaul:** Removed all budget/cheap positioning language. Established full-stack dev + marketing identity. Updated AboutStory, AboutOneTeam, AboutTimeline, layout.tsx meta description, HANDOFF.md
- **FadeIn fix:** Changed viewport margin from `-100px` (all sides) to `0px 0px -100px 0px` — above-the-fold content now triggers immediately, below-fold still has scroll trigger
- **Portfolio data layer:** `src/types/portfolio.ts` (PortfolioProject interface), `src/data/portfolio.ts` (5 aspirational case studies with full detail — Meridian Plumbing, Atlas Consulting, Bloom Botanicals, Nexus Law AI, Summit Fitness)
- **Portfolio grid:** PortfolioFilter (animated `layoutId` tab indicator), PortfolioCard (3D perspective entrance, category badges, tech pills), PortfolioGrid (`AnimatePresence` for filter transitions)
- **Case study pages:** Dynamic `[slug]` route with `generateStaticParams` (5 static pages), CaseStudyLayout (hero, challenge, solution, results with CountUp, tech stack stagger, features grid, testimonial blockquote, prev/next navigation)
- **10-step intake form:** IntakeFormData type (20+ fields), 10 Zod step schemas + combined schema, `useIntakeForm` hook (localStorage persistence, step validation, navigation), IntakeProgress (animated progress bar + step dots), IntakeStep (10 step configs with RadioGroup, CheckboxGroup, TextArea components), IntakeForm (AnimatePresence step transitions), confirmation page with animated checkmark
- **JSON-LD structured data:** `src/lib/json-ld.ts` (Organization, WebSite, Service, Breadcrumb, FAQ schema helpers), `src/components/shared/JsonLd.tsx` (reusable component — justified `dangerouslySetInnerHTML` exception for web standard, hardcoded data only). Applied to layout (Organization), homepage (WebSite), services page (Service + FAQ + Breadcrumb)
- **OG image:** `src/app/opengraph-image.tsx` using `next/og` ImageResponse — dark bg, cyan accents, "Full-Stack Development & Marketing" tagline
- **E2E tests:** 3 Playwright test files — public-pages.spec.ts (8 tests: page loads, navigation, filters, case study, reduced motion), accessibility.spec.ts (axe-core AA on all 5 pages, skip-to-content, form labels, focus indicators), intake-form.spec.ts (5 tests: step navigation, validation errors, localStorage persistence, mobile viewport, full 10-step flow)
- ~20 new files, ~13 modified files
- Commit: pending

**Verification — all passing:**

- `pnpm lint` — 0 errors
- `pnpm tsc --noEmit` — 0 type errors
- `pnpm test` — 21/21 unit tests passing
- `pnpm build` — 22 routes compiled (5 new SSG portfolio pages, intake, confirmation, OG image)

**Session Phase2.5 (Intake Analysis Engine):**

- **Scoring engine:** `src/lib/intake-scoring.ts` — pure algorithmic analysis of intake form submissions. 5 client profile dimensions (business maturity, project readiness, engagement level, scope clarity, budget alignment), each scored 0-100 with transparent signals. Service recommendations with fit scores (0-100) based on direct match, feature alignment, budget fit, and context signals. Complexity scoring (1-10) with labeled factors. 1-3 paths forward generated based on complexity level. Flags system (warning/opportunity/info) for budget mismatches, timeline concerns, and upsell opportunities. Summary generator for quick-glance overview.
- **Type system:** `src/types/intake-analysis.ts` — IntakeAnalysis, ClientProfile, ScoredDimension, ServiceRecommendation, ComplexityScore, PathForward, AnalysisFlag, AnalysisSummary
- **Storage layer:** `src/lib/intake-storage.ts` — JSON file storage in `data/intake-submissions/` (gitignored). Path traversal protection via UUID format validation. Auto-creates directory on first write.
- **API routes:** POST `/api/intake` (validate with Zod, analyze, store, return ID), GET `/api/intake` (list all submissions), GET `/api/intake/[id]` (single submission detail)
- **Form connection:** Modified `src/hooks/useIntakeForm.ts` — `submitForm()` now POSTs to `/api/intake`, stores client name in sessionStorage for confirmation page, handles network/server errors gracefully
- **Admin sidebar:** Added "Intake" nav item with ClipboardList icon after Pipeline
- **Admin list page:** `/admin/intake` — server-rendered, lists all submissions with complexity badges, primary service, summary headline, estimated investment
- **Admin detail page:** `/admin/intake/[id]` — full analysis dashboard with 8 sections: header + complexity gauge, summary card, flags, client profile (5 score bars with signals), service recommendations (ranked cards with fit scores), complexity breakdown (factor list), paths forward (2-3 option cards with phases), collapsible raw submission data
- **Components:** ScoreBar (horizontal 0-100 bar with color + ARIA), ComplexityGauge (10-segment bar with color gradient + ARIA meter), IntakeListCard (glass card with complexity badge), IntakeAnalysisDashboard (full analysis layout)
- **Agent performance tracking:** Created `docs/AGENT-PERFORMANCE.md` — tracks SME agent activations, success rates, leaderboard. 4 agents activated this session, all 100% success rate.
- **Ethics:** Scoring uses objective project criteria only per RAI Policy. Every submission gets equal analysis depth. No automated decisions or client contact. All results for Bas's advisory review only.
- **Governance:** Updated DOCUMENT-INDEX.md, CLAUDE.md Quick Reference, `scripts/format-tables.mjs` for new AGENT-PERFORMANCE.md doc
- 13 new files, 6 modified files
- Commit: pending

**Verification — all passing:**

- `pnpm lint` — 0 errors
- `pnpm tsc --noEmit` — 0 type errors
- `pnpm test` — 55/55 tests (34 new scoring engine tests + 21 existing)
- `pnpm build` — 26 routes compiled (4 new: admin/intake, admin/intake/[id], api/intake, api/intake/[id])

**Session Phase2.6 (Live Portfolio + Hero Shine):**

- **Hero shine animations:** CSS `@keyframes btn-shine` on "Start a Project" button — recurring light sweep every ~8s using pseudo-element with diagonal gradient. `@keyframes text-shimmer` on "Your Business" text — animated background-position on gradient for flowing highlight effect offset by 3s from button. Both respect `prefers-reduced-motion`.
- **Portfolio overhaul:** Replaced 5 fictional client projects with 6 REAL shipped projects (The Colour Parlor, Orca Child in the Wild, All Beauty Hair Studio, Praxis Library, BuiltByBas, KAR CRM) and 2 interactive demo slots (Motion Gallery, Kinetic Typography).
- **New type system:** `PortfolioProject` with `status` (live/in-progress/demo), `capabilities`, `colorAccent`, `isDemo` flag. `PortfolioCategoryMeta` for filter metadata. 4 categories: Websites, Platforms, Software, Animation.
- **New component architecture:** `ProjectCard` (themed gradient preview, status badges, category badges, capability pills, "Visit Site" links), `ProjectGrid` (filterable with AnimatePresence), `ProjectFilter` (animated pill tabs), `ProjectDetail` (real project showcase with "What We Built" section, capabilities, tech stack, "Visit Live Site" CTA), `DemoDetail` (interactive demo layout with fullscreen toggle), `DemoFrame` (browser chrome wrapper), `DemoRenderer` (dynamic imports for demo components).
- **Motion Gallery demo:** 8 interactive animation specimens — spring physics drag ball, stagger reveal, morphing shapes, 3D tilt card, loading patterns (4 variants), gesture swipe cards, scale entrance, hover glow buttons. Each specimen in glass card with replay control.
- **Kinetic Typography demo:** 7 text animation techniques — word-by-word reveal with blur, character cascade, typewriter with cursor blink, gradient sweep, split flip (rotateX), wave motion, blur-in. Each in specimen row with replay.
- **"All business" positioning:** Removed all "small business" language across entire codebase (23 instances), repositioned for businesses of all sizes.
- **Agent Performance Tracking:** Created `docs/AGENT-PERFORMANCE.md` with leaderboard and performance log.
- All descriptions are 100% ORIGINAL — no content copied from client sites.
- Deleted 4 old components (PortfolioGrid, PortfolioCard, PortfolioFilter, CaseStudyLayout), created 15 new files.
- Commits: `8d4aeb5` (hero shine), `425df40` (portfolio overhaul), `3e18ee2` (animation demos), `cfc813c` (docs update)
- **Hero copy finalized:** Headline "Custom Solutions for" + shimmer "Your Business". Subtitle split to two rows: "Agency-quality websites, dashboards, and tools." / "Built fast, built right, built for your business."

**Verification — all passing:**

- `pnpm tsc --noEmit` — 0 type errors
- `pnpm test` — 55/55 tests
- `pnpm build` — 26 routes compiled (8 SSG portfolio pages: the-colour-parlor, orca-child-in-the-wild, all-beauty-hair-studio, praxis-library, builtbybas, kar-crm, motion-gallery, kinetic-typography)

**Session Phase3 (CRM Core + Button Glow):**

- **PostgreSQL setup:** Installed PostgreSQL 17 locally, created `builtbybas` database, configured `.env.local` with `DATABASE_URL`, `AUTH_SECRET`, and site URL. Updated `drizzle.config.ts` to auto-load `.env.local` via dotenv.
- **Initial migration:** Generated and applied Drizzle migration for users + sessions tables.
- **CRM schema (3 tables + 4 enums):** Extended `schema.ts` with `clients` (15 columns, 4 indexes), `pipeline_history` (7 columns, 2 indexes), `client_notes` (7 columns, 2 indexes). Enums: `pipelineStageEnum` (12 stages), `clientStatusEnum`, `clientNoteTypeEnum`. Full Drizzle relations for all tables.
- **Types + validation:** `src/types/client.ts` (PipelineStage, ClientStatus, PIPELINE_STAGES constant, getStageMeta/getNextStage helpers). `src/lib/client-validation.ts` (5 Zod schemas: createClient, updateClient, updatePipelineStage, createNote, convertIntake).
- **API auth helper:** `src/lib/api-auth.ts` — `requireAdmin()` reusable guard (checks session + RBAC role).
- **6 API routes:** `/api/clients` (GET list + POST create), `/api/clients/[id]` (GET detail + PATCH update), `/api/clients/[id]/stage` (PATCH advance), `/api/clients/[id]/notes` (GET + POST), `/api/clients/convert` (POST intake-to-client), `/api/pipeline` (GET grouped by stage).
- **4 admin components:** `StageBadge` (colored pill by stage order), `ClientListCard` (glass card with hover), `ClientDetailDashboard` (full client view with notes form, stage advancement, pipeline history timeline), `PipelineBoard` (12-column horizontal scrollable board).
- **4 admin pages:** `/admin/clients` (list with Add Client button), `/admin/clients/new` (form), `/admin/clients/[id]` (detail), `/admin/pipeline` (board view).
- **Dashboard wired to real data:** `/admin/page.tsx` queries DB for active client count, pipeline count, recent clients (5), recent activity (5).
- **Owner seeded:** `scripts/seed-owner.ts` — Bas Rosario (`devbybas@gmail.com`, role: owner). Added `db:seed` script.
- **Secrets tracking:** Created `secrets.md` (gitignored) — logs all local dev credentials.
- **Hero background boost:** Bumped circuit board SVG opacity values ~2-3x in `HeroBackground.tsx` — IC chips, bus lines, traces, via holes now clearly visible.
- **Button glow enhancement:** Enhanced `neon-glow` with pulsing animation (`neon-pulse` keyframes — breathing cyan glow). Boosted `btn-shine` streak to 50% white peak. Applied `btn-shine neon-glow` to all "Start a Project" buttons (hero, CTA section, header).
- **36 new tests:** `client-validation.test.ts` — all 5 schemas + PIPELINE_STAGES + helpers.
- 30+ new files, 10+ modified files
- Commits: pending

**Verification — all passing:**

- `pnpm tsc --noEmit` — 0 type errors
- `pnpm test` — 91/91 tests (36 new + 55 existing)
- `pnpm build` — 32 routes compiled (6 new CRM routes: admin/clients, admin/clients/[id], admin/pipeline, api/clients, api/clients/[id], api/pipeline + subroutes)

**Session 12 (Phase 3 continued — Intake Overhaul + CRM Polish):**

- **E2E CRM test suite:** Created `tests/e2e/admin-crm.spec.ts` — serial test suite: auth, client CRUD, validation, notes, pipeline advancement, pipeline board, intake conversion, cleanup. Uses `page.evaluate()` for cookie-based login.
- **Intake migrated to PostgreSQL:** Added `intakeSubmissions` table to `schema.ts` (jsonb columns for formData/analysis, denormalized name/email/company/complexityScore/primaryService). Rewrote `intake-storage.ts` from filesystem to Drizzle. Generated + applied migration `0002_intake-submissions.sql`.
- **Portfolio image infrastructure:** Added `image?: string` to `PortfolioProject`, updated `ProjectCard.tsx` + `ProjectDetail.tsx` with `<Image>` / gradient fallback. Created `scripts/capture-screenshots.ts`. Added `"scripts/**"` to tsconfig.json exclude.
- **Intake form overhauled (major):** User requested thorough service-specific intake. Created `src/data/intake-questions.ts` with 9 service modules (marketing-website, website-redesign, landing-page, business-dashboard, client-portal, ecommerce, crm-system, full-platform, ai-tools), each with 7-10 targeted questions. Rewrote `src/types/intake.ts` with new `IntakeFormData` (selectedServices, serviceAnswers keyed by serviceId, yearsInBusiness, brandColors, competitorSites, inspirationSites, preferredContact). Added `StepConfig`, `StepType`, `buildSteps()` for dynamic step generation. Rewrote `src/lib/intake-validation.ts` with per-step schemas + `buildServiceSchema()`. Rewrote `src/hooks/useIntakeForm.ts` with dynamic steps via `buildSteps()`, `updateServiceAnswer()`. Rewrote `src/components/public-site/IntakeStep.tsx` with 7 step renderers and dynamic `ServiceQuestionField` for each question type. Updated `IntakeProgress.tsx` and `IntakeForm.tsx` for new props.
- **Login form built:** Created `src/components/auth/LoginForm.tsx` (client component, calls `/api/auth/login`, redirects to `/admin`). Updated login page to use it.
- **Scoring engine rewritten:** Complete rewrite of `src/lib/intake-scoring.ts` for new IntakeFormData shape. Key changes: `INTAKE_TO_SERVICE_ID` mapping (intake form IDs → service data IDs), `SERVICE_KEYWORDS` map for recommendation scoring, new `INDUSTRY_SERVICE_MAP` with kebab-case keys, `INDUSTRY_LABELS` for display, `extractServiceText()` and `countServiceAnswers()` helpers for text-based scoring from serviceAnswers, `parseBudgetRange()` updated for new shorthand values (1k-5k, 5k-15k, etc.), all 6 scoring functions updated for new fields. Updated all 34 tests in `intake-scoring.test.ts`.
- **Pipeline board wrapping:** Changed `PipelineBoard.tsx` from `flex overflow-x-auto` to `grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]` — columns now wrap to next row instead of horizontal scroll.
- **Zod v4 type fix:** Fixed `PropertyKey[]` vs `(string | number)[]` mismatch in `useIntakeForm.ts` line 116.
- **Login credentials:** Owner seeded as `devbybas@gmail.com` / `BuiltByBas2026!`

**Verification — all passing:**
- `pnpm test` — 91/91 tests
- `pnpm build` — 32+ routes, 0 type errors

**Session 13 (Dashboard Analytics + Intake Enhancement + Email):**

- **20 mock intake submissions:** Created `scripts/seed-intakes.ts` — 20 diverse, realistic businesses across all industries (home services, healthcare, legal, tech, food, fitness, construction, education, nonprofit, real estate, finance). Full service-specific answers for each. Complexity distribution: 7 Simple, 7 Moderate, 3 Complex, 2 Enterprise. Spread over 30 days for realistic date distribution.
- **Dashboard analytics engine:** Created `src/lib/dashboard-analytics.ts` — server-side analytics computation: total submissions, active clients, estimated pipeline value, avg complexity, complexity distribution, service demand breakdown, budget range distribution, industry mix, submission trend (week-over-week), recent submissions feed. All computed from real DB data.
- **Admin dashboard overhaul:** Rewrote `/admin/page.tsx` — 4 stat cards (submissions with trend, active clients, pipeline value, avg complexity with gradient bar), complexity distribution (stacked horizontal bar + legend), service demand (horizontal bar chart), budget ranges (horizontal bar chart), industry mix (horizontal bar chart), recent submissions feed, pipeline activity. All glassmorphism, all CSS-powered (no chart library).
- **Intake list page enhanced:** Created `IntakeListView.tsx` (client component) — search by name/company/email, complexity filter pills (All/Simple/Moderate/Complex/Enterprise), service dropdown filter, sort by date/complexity/name (toggle direction), summary stats bar (total, avg complexity, counts), results count, enhanced card design with service count and budget display.
- **Send intake link email:** Installed Resend SDK. Created `src/lib/email.ts` (client config). Created `/api/intake/send-link` (POST, auth-guarded, Zod-validated). BuiltByBas-branded HTML email template (dark theme, cyan CTA button, glassmorphism card). Admin `SendIntakeLinkButton.tsx` component — popover form with email, name, optional custom message, send status feedback. Added to dashboard header.
- **Env updates:** Updated `.env.example` with `RESEND_API_KEY` and `EMAIL_FROM` (replaced SMTP placeholders).

**Verification — all passing:**
- `pnpm test` — 91/91 tests
- `pnpm build` — 33 routes (new: /api/intake/send-link), 0 type errors

**Session 14 (Deployment — builtbybas.com LIVE):**

- **Resend domain verified:** Added DKIM (TXT), SPF (MX + TXT), DMARC records to Hostinger DNS. All verified green. API key configured in production env.
- **DNS pointed:** A record `@` → `72.62.200.30` for builtbybas.com. CNAME `www` → `builtbybas.com` (pre-existing).
- **VPS provisioned for BuiltByBas:** Node 22, pnpm 10.30.3, PM2 6.0.14, PostgreSQL 16 installed. GitHub deploy key (ed25519) added. Repo cloned to `/var/www/builtbybas`.
- **Database created:** PostgreSQL user `builtbybas` with generated password. Database `builtbybas` owned by user. Drizzle schema pushed.
- **Production env configured:** `.env.production` + `.env.local` on VPS with DATABASE_URL, AUTH_SECRET, RESEND_API_KEY, SITE_URL.
- **Build + PM2:** `pnpm build` — 33 routes compiled (30 static, dynamic API/admin). PM2 running `npx next start -p 3002` alongside colourparlor (port 3001) and ocinw (port 3000).
- **Nginx configured:** Server block for `builtbybas.com` + `www.builtbybas.com` proxying to `127.0.0.1:3002`. Fixed catch-all `server_name _` on ocinw and colourparlor configs that were intercepting builtbybas traffic.
- **SSL live:** Let's Encrypt certificate via certbot. Auto-renewal configured. Expires 2026-05-30.
- **stdout fix:** VPS terminal had stdout redirected to /dev/null. Fixed with `exec 1>/dev/tty`.
- **PM2 bin fix:** `ecosystem.config.cjs` pointed to `node_modules/.bin/next` (shell script, not JS). Fixed by using `npx next start -p 3002` string command.

**Verification:**
- `https://builtbybas.com` — LIVE with SSL green lock
- `https://www.builtbybas.com` — redirects correctly
- PM2 status: builtbybas online, colourparlor online
- All 3 sites (builtbybas, colourparlor, ocinw) coexist on VPS

**Session 15 (Phase 4 — Projects, Invoicing, Financial Analytics + PII Encryption + Branding):**

- **PII encryption (AES-256-GCM):** Created `src/lib/encryption.ts` — `encrypt()`, `decrypt()`, `isEncrypted()`, `hmacHash()`, `encryptAnalysisPii()`, `decryptAnalysisPii()`. Wired into all PII touchpoints: `intake-storage.ts`, `dashboard-analytics.ts`, 5 API routes (clients CRUD, convert, pipeline). Encrypted 20 existing intake submissions via `scripts/encrypt-existing-pii.ts`. New env var `ENCRYPTION_KEY`. Backwards-compatible — plaintext values pass through `decrypt()` unchanged.
- **Database migration:** Expanded PII columns from varchar(255) to varchar(500) for encrypted data (migration `0003_pii-encryption-columns.sql`).
- **Veteran-backed branding:** Added across 6 locations — About page hero, About Story narrative, About Story descriptors (new "Veteran-Backed" bullet), footer tagline, JSON-LD organization schema, site-wide metadata.
- **Partnership portfolio items:** Added Marketing Reset (marketing strategy company) and Small Business Web Co ($500 web solutions) as in-progress platform projects in `portfolio.ts`.
- **Phase 4 — Projects table:** New `projects` table (13 columns, 3 indexes, FK to clients + users) with `project_status` enum (planning/in_progress/on_hold/completed/cancelled). Types, validation (Zod), 2 API routes (GET/POST `/api/projects`, GET/PATCH `/api/projects/[id]`). 3 admin pages (list, new, detail). `ProjectForm` and `ProjectDetailView` components with status management.
- **Phase 4 — Invoicing system:** New `invoices` table (15 columns, 4 indexes) + `invoice_items` table (7 columns, 1 index) with `invoice_status` enum (draft/sent/paid/overdue/cancelled). Auto-generated invoice numbers (`INV-2026-0001`). Tax rate support. 2 API routes (GET/POST `/api/invoices`, GET/PATCH `/api/invoices/[id]`). 3 admin pages (list, new, detail). `InvoiceForm` (dynamic line items with add/remove) and `InvoiceDetailView` (table with subtotal/tax/total, status management).
- **Phase 4 — Financial Analytics:** `/admin/analytics` page with 4 revenue cards (total/outstanding/overdue/draft), monthly revenue bar chart (6 months), project status breakdown, invoice/project/client summary, recent payments feed. All CSS-powered (no chart library).
- **Schema:** 9 tables total (users, sessions, clients, pipeline_history, client_notes, intake_submissions, projects, invoices, invoice_items). Full Drizzle relations. Migration `0004_phase4-projects-invoices.sql`.
- **Tests:** 21 encryption tests, 8 project validation tests, 11 invoice validation tests (40 new, 131 total).
- 30+ new files, 15+ modified files.

**Verification — all passing:**
- `pnpm test` — 131/131 tests (8 suites)
- `pnpm build` — 43 routes (10 new: projects list/new/detail, invoices list/new/detail, analytics, api/projects, api/projects/[id], api/invoices, api/invoices/[id])
- Zero type errors

**Session 17 (Phase 5 — Algorithmic Proposals + Mobile Perf + Revision Workflows):**

- **Mobile animation performance fix:** HeroBackground SVG was running 13 SMIL animations + 2 blur filters on mobile — main thread paint every frame. Added CSS `<style>` inside SVG with `@media (max-width: 768px), (prefers-reduced-motion: reduce)` to hide animated groups and strip blur filters on mobile. Removed `filter: blur(4px)` per-word animation from AnimatedText (kept GPU-compositable opacity+y only). Noise texture hidden on mobile (`hidden md:block`). Orb-pulse desktop-only (`motion-safe:md:animate-[...]`).
- **Colour Parlor Nginx fix:** Direct IP access (`http://72.62.200.30/`) was returning 404 because colourparlor Nginx config only matched domain names. Added `default_server` to listen directive and `_` wildcard to server_name.
- **Phase 5 — Proposal types + validation:** `src/types/proposal.ts` (ProposalStatus, ProposalService, PROPOSAL_STATUSES, getProposalStatusMeta). `src/lib/proposal-validation.ts` (4 Zod schemas: generate, create, update, send). 20 validation tests.
- **Phase 5 — Generator engine:** `src/lib/proposal-generator.ts` — pure algorithmic template builder. Takes IntakeAnalysis + service catalog, produces structured Markdown proposal: executive summary, understanding needs, scope of work (per recommended service), timeline (from pathForward phases), investment (itemized + total), inclusions/exclusions, next steps, terms. Zero AI API calls — instant, deterministic. 12 tests.
- **Phase 5 — Supporting utilities:** `src/lib/markdown-to-html.ts` (zero-dep MD→HTML for display/email). `src/lib/proposal-email.ts` (branded dark theme email template with inline CSS).
- **Phase 5 — API routes (4):** `POST /api/proposals/generate` (intake → algorithm → draft), `GET/POST /api/proposals` (list + manual create), `GET/PATCH /api/proposals/[id]` (detail + update with pipeline advancement), `POST /api/proposals/[id]/send` (email delivery via Resend, requires "reviewed" status).
- **Phase 5 — Database:** `proposals` table (19 columns) with `proposal_status` enum (draft/reviewed/sent/accepted/rejected). JSONB services column. Relations to clients + intake_submissions. Migration `0005_military_black_widow.sql`.
- **Phase 5 — Admin UI (6 files):** Proposals list page (status badges, budget, client info). Proposal detail page (server component with client join + PII decryption). New proposal page (manual creation with client dropdown). `ProposalDetailView` (stats cards, services table, rendered markdown, review gate, send form). `ProposalForm` (manual creation). `GenerateProposalButton` (for intake detail page).
- **Phase 5 — Intake integration:** Modified `/admin/intake/[id]/page.tsx` — queries clients table by intakeSubmissionId to find linked client, shows "Generate Proposal" button if client exists.
- **Revision workflow — ProposalDetailView:** "Edit Proposal" button (visible for draft/reviewed). Inline editing: title (header input), summary (textarea), content (monospace markdown textarea), timeline, valid until. If a reviewed proposal is edited, status resets to draft (re-review required — RAI compliance). Save/Cancel with error handling.
- **Revision workflow — InvoiceDetailView:** "Edit Invoice" button (visible for draft/sent). Inline editing: all line items (description, qty, unit price), add/remove rows, due date, tax rate (%), notes. Live subtotal/tax/total preview during editing. Save/Cancel with error handling.
- **VPS git remote fix:** SSH key auth failed on VPS. Switched to HTTPS remote URL.
- 17 new files, 3+ modified files.
- Commits: `3f93d41` (mobile perf fix), `ff06f26` (Phase 5 foundation). Phase 5 UI + revision workflows not yet committed.

**Verification — all passing:**
- `pnpm test` — 163/163 tests (32 new proposal tests + 131 existing)
- `pnpm build` — 50 routes (7 new: proposals list/new/detail, api/proposals, api/proposals/[id], api/proposals/generate, api/proposals/[id]/send)
- Zero type errors

**Session 18 (Portfolio Galleries + Animation Demos + About Update):**

- **Raw Submission Data cleanup:** Rewrote raw data display in `IntakeAnalysisDashboard.tsx`. Created `formatKey()` helper (camelCase/kebab → readable labels) and `RawField` recursive component (arrays → tag chips, nested objects → indented sections, booleans → Yes/No, null → "—"). Replaced raw JSON dump with structured, scannable display.
- **Portfolio image galleries:** Added `gallery?: string[]` to `PortfolioProject` type. Created `ProjectCardGallery.tsx` — large main image with crossfade transitions (`AnimatePresence`), thumbnail strip below, auto-cycle every 5s via `setInterval`, pause on hover (`onMouseEnter`/`onMouseLeave`), progress bar indicators, click-to-swap thumbnails with `e.preventDefault()` to prevent card link navigation. Updated `ProjectCard.tsx` (combines `[image, ...gallery]`, uses gallery when >1 image). Updated `ProjectDetail.tsx` hero with same gallery cycling behavior.
- **Image pipeline:** Converted PNG screenshots to WebP via `npx sharp-cli` (quality 80). 4.7MB → 244KB. Organized into subfolders: `public/portfolio/builtbybas/` (5 images), `colourparlor/` (1), `orcachild/` (10), `praxislibrary/` (1). Gallery arrays wired for Orca Child (9 gallery images) and BuiltByBas (4 gallery images).
- **4 new animation demo pages (26 specimens):**
  - `MicroInteractions.tsx` — 8 specimens: toggle switch, success checkmark, like button, notification bell, progress ring, expandable card, ripple button, magnetic hover
  - `LayoutAnimations.tsx` — 6 specimens: shared layout tabs, drag reorder list, grid↔list toggle, accordion, animated counter, 3D flip card
  - `SVGAnimations.tsx` — 7 specimens: logo draw (BB), icon morph (star/heart/hexagon/circle), draw checkmark, wavy line, circular loaders, handwriting, animated bars
  - `ScrollAnimations.tsx` — 5 specimens: parallax layers, scroll progress, reveal on scroll, number counter, sticky navigation
  - All registered in `DemoRenderer.tsx` via `next/dynamic` imports. All 4 added to `portfolio.ts` data. Total: 41 specimens across 6 demo pages.
- **About page update:** Changed heading from "#OneTeam" to "Human Oversight" in `AboutOneTeam.tsx`. Added "Human code review" and "Human oversight" as top two items in Bas's role list.
- **Deployed to production:** Commit `92269cc`, pushed to GitHub, deployed to VPS.
- 7 new files, 8+ modified files.

**Verification — all passing:**
- `pnpm test` — 163/163 tests
- `pnpm build` — 50 routes (14 portfolio SSG paths including 4 new demos)
- Zero type errors

**Session 19 (Portfolio Detail Upgrade — Health Stats, Business Narratives, Galleries):**

- **Project Health Stats component:** Created `ProjectHealthStats.tsx` — animated SVG circular progress rings (4 dimensions: Security, Accessibility, Performance, Stability), overall score bar with letter grade (A+ through C), CountUp numbers, staggered entrance animation. Each ring shows score/100 with X/10 checks count. Colors: cyan (security), violet (accessibility), emerald (performance), amber (stability). Respects `prefers-reduced-motion`.
- **40-point checklist accordion:** Added expandable accordion below health rings showing all 40 individual checks with pass/fail indicators (green checkmark / red X). Each dimension section shows color dot, label, "X/10 passed" count, chevron toggle. Smooth height animation via Framer Motion `AnimatePresence`. Footer: "Based on 40-point verifiable checklist".
- **Health scoring data:** Added `health` and `healthChecklist` fields to `PortfolioProject` type. Real scores for 5 projects based on transparent 10-check rubric per dimension: BuiltByBas (100/100/100/100), Orca Child (90/100/90/80), Praxis Library (90/100/90/80), Colour Parlor (80/90/90/70), All Beauty (70/80/80/60).
- **Business narrative sections:** Added 4 new optional fields to `PortfolioProject`: `scope` (bullet list), `challenge` (business problem), `approach` (how we solved it), `techChoices` (tech + rationale). Full narratives written for all 6 real projects. ProjectDetail renders: The Challenge, Our Approach, Project Scope, Why We Chose This Stack (replaces plain tech pills when techChoices exists).
- **Colour Parlor real story:** Updated with actual business context — dual-location salon in Wildomar and Menifee, California. Freelancer dependency problem. Split-site landing page solution. Custom admin backend for real-time stylist management between locations.
- **19 new gallery images:** 8 Colour Parlor images (including admin panel screenshots), 11 Praxis Library images (all major features). PNG→WebP conversion via sharp-cli.
- **ScrollAnimations fix:** `CounterBox` component had `start()` called directly in render body, causing infinite re-render loop. Replaced with proper `useEffect`.
- Commits: `21b18f4` (health stats + narratives + galleries), `acf9c76` (ScrollAnimations fix). Pushed and deployed.

**Verification — all passing:**
- `pnpm test` — 163/163 tests
- `pnpm build` — 50 routes, 0 type errors
- Production deployed and verified

**Session 20 (Hero Animation Overhaul — Data Flow, Chip Activity, Center Pulse):**

- **Hero subtitle update:** Changed to "Agency-quality software, websites, dashboards, and tools." — added "software" to the tagline.
- **Center hub energize pulse:** When SMIL particles (p1/p2/p3) arrive at center hub (500,300), both hub circles flash white and scale up briefly (outer r=5→7, inner r=2.5→3.5). Pure SMIL `animate` on fill + r attributes, triggered by `p1.end`/`p2.end`/`p3.end`.
- **Permanent PCB data traces:** 12 right-angle routed traces from center hub to chips (6 SMD + 6 IC) — always visible on the board at dim opacity (0.06). Routed with horizontal/vertical segments only, no cross-tracing. Traces are part of the board layout, not dynamically created.
- **Progress-bar trace fill:** When a particle arrives, a random trace on the **opposite side** fills like a progress bar from center outward (2s ease-in-out). p1 (from left) → right-side chips, p2 (from top) → bottom chips, p3 (from right) → left-side chips.
- **Chip activation:** Once trace reaches the chip, chip lights up instantly, holds for 3.33s, then slowly powers down. Only one trace active at a time — `busy` guard prevents overlapping animations.
- **Timing:** Particle arrives → hub pulses → trace fires immediately → 2s fill → 3.33s chip glow → trace fades → 2.22s pause → next particle launches. Total gap between particles: 7.55s.
- **Client component conversion:** `HeroBackground.tsx` converted to `"use client"` with `useEffect`/`useRef` for JS-driven Web Animations API chip pulses. SMIL `endEvent` listener on particles triggers the outward trace flow.
- **Organic chip activity removed:** Earlier random-interval chip blinking replaced with deterministic particle-driven flow. Chips only light up through the single data-in → process → data-out animation.
- Commits: `fdbff4b` through `402255d` (12 incremental commits). All pushed to GitHub.

**Verification — all passing:**
- `pnpm build` — 50 routes, 0 type errors
- Production ready for deploy

**Session 21 (Portfolio Grades + Brand Wordmark):**

- **Real Lighthouse grades imported:** Updated `portfolio.ts` health scores for 3 projects with verified Lighthouse audit results:
  - The Colour Parlor: 100/100/100/100 — desktop + mobile (both perfect). All healthChecklist items set to true.
  - Orca Child in the Wild: 100/96/96/100 — Best Practices + SEO perfect, Performance 96 mobile/100 desktop, Accessibility 96 both.
  - Praxis Library: 100/98/97/100 — Best Practices + SEO perfect, Accessibility 98 both, Performance 97 mobile/100 desktop.
- **BuiltByBas grades confirmed:** 100/100/100/100 — already correct, verified by user.
- **KAR CRM images added:** 9 screenshots added to `public/portfolio/CRM/` — not yet wired to portfolio.ts (no `image`/`gallery` fields yet).
- **BuiltByBas wordmark:** `Built` (cyan) `By` (white) `Bas` (cyan) with static neon text-shadow glow (`neon-text` CSS class). Applied to PublicHeader and PublicFooter. No pulse animation on the wordmark.
- **BrandIcon SVG component:** Created `src/components/brand/BrandIcon.tsx` — stacked isometric PCB layers with cyan glow, white "B". Saved for future use but not currently applied.
- **Logo asset:** `public/logo/builtbybaslogo.png` — transparent background logo committed as brand asset.
- **CSS additions:** `neon-text` class (static text-shadow glow) and `neon-text-pulse` keyframe added to `globals.css`.
- Commits: `d754561` (grades + CRM images), `1e275cd` (wordmark + brand assets). Pushed to GitHub.
- **Build:** 163/163 tests, 40-route build clean.

**Leftover untracked files (not committed — needs decision):**
- `public/portfolio/colourparlor/colourparloreditstylist.webp.png` — double extension, not wired to gallery
- `public/portfolio/colourparlor/colourparloreditstylistb.webp.png` — same
- `public/portfolio/colourparlor/lighthousescore.png` / `lighthousescoremobile.png` — Lighthouse audit refs
- `public/portfolio/colourparlor/treemap.png` / `inline.png` — JS bundle audit artifacts
- `public/portfolio/colourparlor/portfolio - Shortcut.lnk` — Windows shortcut, delete this

**Session 23 (BBB Projects — 16 Demo Systems Strategy):**

- **New strategic direction confirmed:** Build 16 real business systems and platforms as interactive demos in `bbbprojects/demos/` directory inside the monorepo. These will serve as portfolio proof-of-work, lead-generation tools, and real deployable products for clients.
- **16 systems confirmed (no HR systems):**
  - **Office/Internal:** Intranet, Document Filing System, Meeting Room/Resource Booking, Internal Help Desk
  - **Operations:** Inventory System, Asset Tracker, Maintenance Request System, Purchase Order System, Inspection/Audit Checklist
  - **Client-Facing:** Client Portal, Booking/Appointment System, Estimate/Proposal Portal, Support Ticket Portal
  - **Specialty:** Vendor/Supplier Directory, Order Tracking Dashboard, Loyalty Program Tracker
- **All 16 added to portfolio.ts** as `systems` or `platforms` category entries, `status: "demo"`, `isDemo: true`, `featured: false`. Ready to display on portfolio page.
- **Build plan:** Each system gets its own fresh chat. Intranet is first (highest value, most comprehensive). Directory: `bbbprojects/demos/intranet/`.
- **No code written yet** — strategy confirmed, entries staged. Fresh chat will scaffold the Intranet.

**Session 22 (All Beauty Hair Studio Portfolio + Category System Overhaul):**

- **All Beauty Hair Studio — fully wired:** 9 screenshots added (`public/portfolio/allbeautyhairstudio/`). `image` + `gallery` fields set in `portfolio.ts`. Status: `live`, `featured: true`, health: 100/100/100/100.
- **Portfolio entry rewritten — before/after narrative:** Subtitle: "From Wix template to full business operating system". Challenge section = "What she had" (Wix, notebook, zero backend). Approach section = "What she got" (personal brand site, 7-step intake, full CRM). Description leads with "Karli had a Wix template. Now she has a business operating system."
- **True scope documented:** Personal brand platform, 7-step new client intake (About You → Your Hair → Personality → History → Goals → Photos → Review), inclusive pronouns field, admin CRM dashboard (Total Clients, Revenue, Testimonials, Sessions), kanban pipeline (Inquiry → Consultation Scheduled → Consultation Complete → Active Client → Follow-Up), 10-stage client journey tracker, AI fit scoring (Service Fit / Readiness / Engagement), Accept/Decline workflow, multi-business admin (Hair Studio + Marketing Reset), Prompt Library.
- **Category renamed:** `software` → `systems` ("CRM, ops platforms, and business operating systems"). Updated `PortfolioCategory` type, `categoryMeta`, KAR CRM category. All Beauty moved to `platforms`.
- **ProjectCard redesigned:** Full-width category banner across top of card (readable on any image background, including light/white screenshots). Status badge (`Live` / `In Progress` / `Interactive Demo`) inline right inside the banner. Removed floating absolute-positioned badge.
- **ProjectFilter redesigned:** Full-width glassmorphism tab bar (`border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm`). Tabs fill full width (`flex-1`), uppercase bold labels, spring-animated active indicator. Inactive tabs `text-white/50` (readable, not invisible).
- **Category color bump:** All colors from `/20 text-*-400` → `/30 text-*-300` for better readability.
- **colourparlor images committed:** `lighthousescore.png`, `lighthousescoremobile.png`, `treemap.png`, `inline.png`, `colourparloreditstylist.webp.png`, `colourparloreditstylistb.webp.png` — all committed.
- **Commit:** `e9f28dd` — pushed to GitHub. Bas deploying manually from Hostinger terminal (SSH key not configured on local dev machine).
- **Build:** 163/163 tests, 40-route build clean, tsc clean.

**Session 24 (BBB Demo Platform — All 16 Systems Built):**

- **Demo platform created:** `bbbprojects/demos/` — standalone Next.js 15 app (port 3010) added to pnpm workspace.
- **Shared foundation:** `globals.css` (design tokens, glass utilities, glow classes), `src/lib/motion.ts` (spring presets + variants), `src/lib/utils.ts`, 5 shared components: `Sidebar`, `PageWrapper`, `PageHeader`, `StatCard`, `GlassButton`, `SearchBar`.
- **Sidebar:** All 16 systems listed with icons, color-coded by category (cyan=Office, violet=Ops, emerald=Client, amber=Specialty), animated `layoutId` active indicator, spring hover effects.
- **Home dashboard:** Full categorized grid of all 16 systems with hover glow, spring animations, CTA footer.
- **Seed data:** Comprehensive `src/data/seed.ts` — realistic data for all 16 systems (employees, announcements, rooms, bookings, tickets, inventory, assets, maintenance, purchase orders, inspections, clients, appointments, proposals, support tickets, vendors, orders, loyalty members/rewards).
- **16 systems built:**
  - **Intranet** — announcements (pinned + categorized), employee directory (search/filter/modal), doc library, quick links grid, today's schedule, notices sidebar, employee profile modal with email/call actions.
  - **Document Filing** — folder grid (8 depts), file list with type filter (PDF/DOC/XLSX/IMG/PPT), tag chips, upload button.
  - **Meeting Rooms** — room grid with in-use/available badges, amenities, booking modal with capacity validation.
  - **Help Desk** — priority/status filter, ticket cards with assignee and category, hover action buttons, new ticket modal.
  - **Inventory** — stock status (in/low/out), category filter, reorder alerts banner, reorder button on low items.
  - **Asset Tracker** — grid/list view toggle (AnimatePresence), status/category, serial numbers, assignment tracking.
  - **Maintenance** — priority filter tabs, 4-step status tracker per request, critical escalation, new request modal.
  - **Purchase Orders** — expandable line item detail, approval workflow, approve/reject actions, status filter.
  - **Inspections** — templates grid, score bar component (animated on mount), passed/failed detail, run inspection button.
  - **Client Portal** — animated progress bars, milestone countdown, budget vs. billed, expandable message thread.
  - **Booking** — 7-day week strip, service catalog, time slot picker, form submit with success animation.
  - **Proposals** — pipeline sidebar with value per stage, expandable services table, status-aware action buttons.
  - **Support Tickets** — SLA tracking, dual filter (status + priority), hover action buttons, ticket creation modal.
  - **Vendor Directory** — preferred vendor highlighting, star ratings, category filter, add vendor modal.
  - **Order Tracking** — 6-stage animated pipeline tracker per order, delivery alert banner, tracking numbers.
  - **Loyalty Program** — tier system (Bronze→Platinum), points progress bars, rewards catalog, transaction history.
- **All 16 added to portfolio.ts** — with full descriptions, capabilities, tech choices. Category: systems or platforms. `status: "demo"`, `isDemo: true`.
- **Main builtbybas:** `bbbprojects/**` excluded from tsconfig.json. 163/163 tests, 56-route build (40 original + 16 new demo portfolio SSG paths). tsc clean.
- **Demo platform build:** 17 routes (home + 16 systems). tsc clean. ESLint config set to warn on unused vars (demo code pattern).
- **pnpm workspace:** Added `"bbbprojects/demos"` to `pnpm-workspace.yaml` packages list.
- **Not yet committed** — commit and push before next session.

**Session 25 (Portfolio Demo Overhaul — Color Shift + 3 New Industry Demos):**

- **Plan created:** Molecular-granularity plan for 12 new industry-specific demos across 4 new subcategories (Service, Storefront, Education, UD/UDL). Full buyer personas, pain points, palettes, wireframes, data models, interaction specs per demo. Plan file: `C:\Users\basro\.claude\plans\crystalline-gathering-meadow.md`.
- **Phase 0A — Filter rename:** "ALL" tab → "LIVE" in `ProjectFilter.tsx`. Internal value stays `"all"`, only display label changed.
- **Phase 0B — Capability fix:** Changed "AI Fit Scoring" → "AI Summarizations" on All Beauty Hair Studio in `portfolio.ts`.
- **Phase 1 — Color shift:** Shifted shared demo components from electric cyan to warmer sky blue. `DemoGlassButton.tsx`: `cyan-400` → `sky-500/sky-400`. `DemoSearchBar.tsx`: `cyan-400` → `sky-500`. `DemoPageHeader.tsx`: added `blue` color option to type and colorMap.
- **Phase 2 — Subcategories:** Added `service`, `storefront`, `education`, `udl` to `conceptSubcategories` in `portfolio.ts`.
- **Demo 1: ShopBoardDemo.tsx** — Ironside Motors auto repair work order board. Kanban with 5 status columns, 4-bay grid, labor timers, parts tracking, search, new work order modal. Amber/steel palette. 348 lines.
- **Demo 2: LedgerDeskDemo.tsx** — Clearview Bookkeeping client ledger. 3-tab layout (Roster, Ledger, Deadlines). 6 clients, 8 journal entries (balanced debits/credits), 5 deadlines with urgency. Navy/blue palette. 275 lines.
- **Demo 3: TicketFlowDemo.tsx** — Rosie's Corner Diner kitchen display. 4-tab layout (Tickets, Table Map, 86 Board, Sales). Live 1-second timers, 8 tickets, 12-table grid, 86'd items. Red/yellow diner palette. 304 lines.
- **TypeScript fixes:** Fixed `demoCardHover.whileHover` → `.hover` across all 3 demos. Fixed `color="orange"` → `"amber"` for DemoStatCard. Fixed onClick type mismatch in LedgerDeskDemo.
- **Verification:** 163/163 tests pass. tsc clean. Build clean (56 routes).

**Session 26 (Portfolio Demo Overhaul — 9 Remaining Demos + Wiring):**

- **Demo 4: ShelfWiseDemo.tsx** — Maplewood Community Library. Catalog, Patrons, Overdue tabs. 10 books, 6 patrons. Checkout with patron selector, return, hold, search/filter by genre, fine payment. Mahogany/amber palette.
- **Demo 5: SweetCounterDemo.tsx** — Sugar & Spark Candy Co POS. Quick Sale (grid+cart), Catalog (table+filters), Gift Boxes ($5 fee), Customers tabs. 12 products, 4 customers. 9.75% tax, low-stock pulse. Candy pink/rose palette.
- **Demo 6: CornerKeepDemo.tsx** — Hernandez Family Market. Register, Inventory (margin calc), Customer Tabs, Deliveries tabs. 15 items, 4 customer tabs, 3 deliveries. Expiry checking. Terracotta/orange palette.
- **Demo 7: DispatchProDemo.tsx** — Summit Plumbing & Heating. 4-column dispatch kanban, Tech Status, Address History tabs. 8 service calls, 4 technicians. Emergency pulsing. Pipe blue palette.
- **Demo 8: PawScheduleDemo.tsx** — Wagging Tails Pet Spa. Today's Schedule (by groomer), Pet Profiles (expandable), Boarding (12-kennel grid), Vaccinations tabs. 8 pets, 6 appointments, 5 boarding. Soft lavender/violet palette.
- **Demo 9: FilingDeskDemo.tsx** — Bridgewater Tax Services. Pipeline (6-stage), Document Tracker (progress bars), Deadline (countdown to April 15), Calculator (fee ranges) tabs. 10 clients, YoY comparisons. IRS navy palette.
- **Demo 10: ClassPulseDemo.tsx** — Mrs. Torres's 4th Grade. Attendance, Gradebook, Behavior, Groups tabs. 12 students. Inline grade editing, behavior log, auto-grouping by performance. Teal palette.
- **Demo 11: StudyPathDemo.tsx** — Student Progress Dashboard. Overview (GPA), Assignments (filter by status), Study Log (bar chart), What-If (GPA sliders) tabs. 6 courses, 15 assignments. AP weighting. Indigo palette.
- **Demo 12: AccessLensDemo.tsx** — Universal Design for Learning Toolkit. Learner Profiles, Accommodation Map, UDL Strategies, Compliance tabs. 8 learners, 4 teachers, 12 strategies. Strategy suggestions, documentation toggle. Teal palette.
- **DemoRenderer wiring:** Added all 12 new slugs to `DemoRenderer.tsx` with dynamic imports (bbb-shopboard through bbb-accesslens).
- **Portfolio entries:** Added all 12 concept entries to `portfolio.ts` with full descriptions, capabilities, colorAccents.
- **Type fix:** Fixed `onClick` type mismatch in `AccessLensDemo.tsx` — wrapped `DemoGlassButton` in stopPropagation div.
- **LIVE tab filter:** Updated `getProjectsByCategory("all")` to require `p.status === "live"` — removes in-progress projects (Marketing Reset, Small Business Web Co) from the showcase tab.
- **KAR CRM status:** Changed from `"live"` to `"in-progress"` — not publicly deployed yet (local IP only), should not appear in LIVE tab.
- **Verification:** 163/163 tests pass. tsc clean. Build clean (68 routes, 42 portfolio paths).

**Session 27 (Service Walkthrough + Intake Overhaul Phase 1+2 + RAI Screening):**

- **Service Walkthrough Overlays:** Built full-page walkthrough modal for all 9 services — 5-phase process (Discovery, Design, Build, Launch, Support) with deliverables, duration, progress bar, keyboard nav. Components: `ServiceWalkthroughOverlay.tsx`, `WalkthroughProgress.tsx`. Hooks: `useFocusTrap.ts`, `useBodyScrollLock.ts`. Service cards now clickable with `onClick` handler.
- **Walkthrough data:** Added `walkthrough` property to all 9 services in `services.ts` (~530 lines of content). Types: `WalkthroughStep`, `ServiceWalkthrough` in `types/services.ts`.
- **Intake Backend Workflow (Phase 1):**
  - Added `intakeStatusEnum` (`new`/`reviewed`/`accepted`/`rejected`/`converted`) + `status` column to `intakeSubmissions` schema
  - Created `PATCH /api/intake/[id]/status` route (auth-guarded)
  - Built `IntakeActionBar.tsx` (~210 lines) — context-sensitive buttons based on status (accept, reject, convert to client, generate proposal)
  - Wired into intake detail page, replacing `GenerateProposalButton`
  - Updated `IntakeListView.tsx` with status badges (color-coded) + status filter bar
  - Updated `intake-storage.ts` return types to `IntakeSubmissionRow { analysis, status }`
  - Fixed type errors in convert route and proposals generate route
- **Service-Specific Intake Entry (Phase 2):**
  - Created `service-id-map.ts` — bidirectional mapping between 9 service data IDs and intake IDs
  - Rewrote all 9 service intake question modules — deeper questions (8-12 each) structured around: Your Business, The Problem, The Vision, Project Specifics
  - Updated `buildSteps()` with `skipServiceSelection` parameter
  - Updated `useIntakeForm` to accept `preselectedService` option
  - `IntakeForm.tsx` now reads `?service=` query param via `useSearchParams()`
  - Added `<Suspense>` boundary to intake page
  - Walkthrough CTA now links to `/intake?service=<id>` (auto-selects service, skips service selection step)
- **RAI Red-Flag Screening:**
  - Added `"rai-concern"` flag type to `AnalysisFlag`
  - Built `screenForRaiConcerns()` — scans all intake text for 8 categories: surveillance, deception, discrimination, data harvesting, dark patterns, exploitation of vulnerable populations, illegal content, circumventing laws
  - RAI flags render in bright red with ring highlight in admin dashboard
  - 6 new tests: catches unethical asks, passes legitimate business requests
- **VPS PM2 auto-restart:** Bas ran `pm2 startup && pm2 save` — both builtbybas and colourparlor now auto-restart on VPS reboot.
- **Memory correction:** Bas is NOT a veteran. BuiltByBas is veteran-backed and funded.
- **Verification:** 169/169 tests pass (+6 RAI tests). tsc clean. Build clean.
- **IMPORTANT:** Drizzle migration for `intake_status` enum + `status` column has NOT been generated/pushed yet. Must run before deploying Phase 1 backend changes.

**Session 28 (Client Management + VPS Infrastructure + Umami Analytics):**

- **Client Delete:** Added `DELETE /api/clients/[id]` with cascading delete (notes + pipeline history first, then client). Auth-guarded, ID-validated.
- **Client Detail Delete UI:** Delete button + confirmation dialog on `ClientDetailDashboard.tsx` — glassmorphism modal, names client being deleted, redirects to `/admin/clients` on success.
- **Client List Overhaul:** New `ClientListView.tsx` (~187 lines) — real-time search (name, company, email, industry), industry filter pills auto-generated from data, count display with "X shown" when filtered. Rewrote `page.tsx` to use this component.
- **Proposal Delete:** Added `DELETE /api/proposals/[id]` route + delete button with confirmation dialog on `ProposalDetailView.tsx`.
- **Umami Analytics (Self-Hosted):**
  - Installed Umami at `/var/www/umami` on VPS — PostgreSQL DB (`umami` user/db), built successfully
  - Running on PM2 (port 3003, `pm2 save` for reboot persistence)
  - All 3 sites added to Umami dashboard: builtbybas.com, thecolourparlor.com, orcachildinthewild.com
  - Tracking script added to `src/app/layout.tsx` for builtbybas (website ID: `1ff108d4-6963-4543-a838-a0d62a6ae979`)
  - Colour Parlor tracking ID: `ea7cf092-6712-4033-a985-bd954f2e2727` (needs adding to its layout)
  - OCINW tracking ID: `0b3a9071-3e85-42e2-8454-46e3f27f35a2` (needs adding to its layout)
  - Nginx server block created for `analytics.builtbybas.com` → proxy to port 3003
  - DNS A record added (`analytics` → `72.62.200.30`) — propagating
  - **Pending:** SSL via certbot once DNS propagates, then close port 3003 + remove Hostinger firewall rule
- **Nginx Log Separation:** Each site now has isolated access + error logs:
  - `/var/log/nginx/builtbybas.access.log` + `builtbybas.error.log`
  - `/var/log/nginx/colourparlor.access.log` + `colourparlor.error.log`
  - `/var/log/nginx/ocinw.access.log` + `ocinw.error.log`
- **Traffic Analysis:** Analyzed raw Nginx logs — identified real visitors (iPhone via Google to colourparlor), bots (Googlebot, ClaudeBot, ChatGPT-User, CensysInspect), WordPress scanning noise (404s).
- **Intake Analysis + Proposal Fixes:** Improved intake scoring, proposal generator, and validation.
- **Verification:** 174/174 tests pass (+5 from prior session). tsc clean.

---

### What's Next — Full Backlog (Session 32 Audit)

| #   | Category       | Item                                                              | Priority | Status       | Source        |
| --- | -------------- | ----------------------------------------------------------------- | -------- | ------------ | ------------- |
| 1   | Infrastructure | SSL for `analytics.builtbybas.com` (certbot after DNS propagates) | High     | Blocked      | Session 28/30 |
| 2   | Infrastructure | Close port 3003 after SSL is live                                 | High     | Blocked (#1) | Session 28    |
| 3   | Infrastructure | Drizzle migration for `intake_status` enum on VPS                 | High     | Not started  | Session 27    |
| 4   | Infrastructure | Fix SSH key from local dev machine to VPS                         | Medium   | Not started  | Session 14    |
| 5   | Infrastructure | Change Umami DB password (exposed in session)                     | High     | Not started  | Session 28    |
| 6   | Infrastructure | Add Umami tracking to colourparlor + ocinw layouts                | Low      | Not started  | Session 28    |
| 7   | AI/Integration | Modular AI provider architecture (Claude API, swappable models)   | High     | Not started  | Session 32    |
| 8   | AI/Integration | Auto-generate follow-up questions after intake scan               | Medium   | Not started  | Handoff plan  |
| 9   | AI/Integration | SME best practice analysis per service                            | Medium   | Not started  | Handoff plan  |
| 10  | AI/Integration | Feed follow-ups + SME into proposal generator                     | Medium   | Depends #8,9 | Handoff plan  |
| 11  | Client Portal  | Client proposal accept/decline (link from email, updates admin)   | High     | Not started  | Session 32    |
| 12  | Client Portal  | Client-facing portal (project status, invoices, comms)            | Medium   | Not started  | Phase 6 plan  |
| 13  | Client Portal  | Invoice PDF generation                                            | Medium   | Not started  | Phase 6 plan  |
| 14  | Client Portal  | Email notifications for invoice/proposal status changes           | Medium   | Not started  | Phase 6 plan  |
| 15  | Portfolio      | Take screenshots of all 28 demos, wire portfolio images           | Low      | Not started  | Session 24    |
| 16  | Portfolio      | Deploy BBB demo platform (demos.builtbybas.com, port 3010)        | Low      | Not started  | Session 24    |
| 17  | Portfolio      | KAR CRM — deploy to VPS, add to portfolio                         | Low      | Not started  | Session 21    |
| 18  | Forms/UX       | Intake form quality improvements                                  | Medium   | Not started  | Session 29    |
| 19  | Cleanup        | Delete `portfolio - Shortcut.lnk` from colourparlor folder        | Low      | Not started  | Session 21    |
| 20  | Cleanup        | Clean up "quicktest" submission from local DB                     | Low      | Not started  | Session 29    |
| 21  | Tech Debt      | Next.js 16 middleware to proxy migration                          | Low      | Deferred     | ISS-1         |

**Priority Order:**
1. **#3, #5** — VPS migration + Umami security (quick wins, high impact)
2. **#11** — Client proposal accept/decline flow (closes the sales loop)
3. **#1, #2** — SSL for analytics (whenever DNS propagates)
4. **#18** — Intake form quality
5. **#12-14** — Client portal + invoicing (Phase 6)
6. **#15-17** — Portfolio screenshots + demo deployment
7. **#7-10** — Modular AI provider architecture + AI follow-ups + SME analysis (last)

### Notes

- Active project root is `c:\builtbybas\` — old `c:\iostudio\` copies are stale, do not edit those
- `scripts/format-tables.mjs` can be re-run anytime with `node scripts/format-tables.mjs` to realign tables
- **Local remote:** `git@github.com-devbybas:devbybas-ai/builtbybas.git` (multi-account SSH alias)
- **VPS remote:** HTTPS (`https://github.com/devbybas-ai/builtbybas.git`) — SSH key auth broken on VPS, switched Session 17
- Git identity configured per-repo (not global) — name "Bas Rosario", email `devbybas@gmail.com`
- Next.js 16 deprecated `middleware.ts` in favor of `proxy` — current middleware works but emits a warning. Migrate when stable.
- PostgreSQL now running locally with `builtbybas` database. Auth and CRM routes functional.
- Login: `devbybas@gmail.com` / `BuiltByBas2026!`
- `npx tsx scripts/seed-intakes.ts` — re-run to seed 20 mock intakes (idempotent if table is empty)
- Resend API key configured in production. Domain verified (DKIM, SPF, DMARC all green).
- **VPS deployment:** SSH port 2222 (not 22). Deploy key at `~/.ssh/github_deploy`. App at `/var/www/builtbybas`. PM2 process name: `builtbybas`. Nginx config: `/etc/nginx/sites-available/builtbybas`.
- **Redeploy command:** `cd /var/www/builtbybas && git pull && pnpm install --frozen-lockfile && pnpm build && pm2 restart builtbybas`
- **VPS sites:** builtbybas (port 3002), colourparlor (port 3001), ocinw (port 3000)
- **Production DB password:** stored in `/var/www/builtbybas/.env.local` on VPS (not in repo)
- **ENCRYPTION_KEY:** Generate with `openssl rand -base64 32` — must be added to production `.env.local` before deploying Phase 4. Run `npx tsx scripts/encrypt-existing-pii.ts` after adding key to encrypt existing plaintext PII.
- **Invoice numbers:** Auto-generated as `INV-{year}-{seq}` (e.g., INV-2026-0001). Sequential, not resettable.

---

## Part 4: Context

### Business Context

- Bas is a software developer launching BuiltByBas as his own company
- This project IS the business — the site, CRM, and portal are what runs BuiltByBas day to day
- The website is also the primary sales tool — it must convert visitors to intake form submissions
- Quality standards are non-negotiable — 8 pillars, A+ target across all dimensions
- The KAR project (c:\kar\) is the reference backend — similar CRM patterns but BuiltByBas is significantly more advanced

### Design Direction

- **Aesthetic:** Elite, premium, cutting-edge 2026
- **Colors:** Deep dark backgrounds (#0A0A0F), electric cyan accents (#00D4FF / #0EA5E9), white text
- **Effects:** Glassmorphism (bg-white/5 backdrop-blur-xl border-white/10), neon glow, subtle grain
- **Animation:** Full Framer Motion — page transitions, scroll reveals, spring physics, parallax, stagger animations, 3D transforms. Every interaction feels premium.
- **Typography:** Modern sans-serif, clean hierarchy
- **Goal:** When someone lands on builtbybas.com they should think "This guy is elite" and have their wallet out before they reach the intake form

### SEO Strategy

**Dual approach:** Traditional search (Google) AND AI search (ChatGPT, Perplexity, Claude). Designed to rank AND be comprehended.

**Title pattern:** `{Page Title} - BuiltByBas`

- Home: `Custom Software & Web Development - BuiltByBas`
- Services: `Web Development Services - BuiltByBas`
- Portfolio: `Our Work - BuiltByBas`

**Meta descriptions:** Unique per page, 120-160 chars, primary keyword in first 60 chars, action-oriented CTA language.

**OG image approach:** Static branded image for v1 (single 1200x630 image with logo + tagline). Dynamic OG images deferred to v2 (per-portfolio-item, per-service).

**Structured data schemas (JSON-LD):**

| Schema           | Where            | Purpose                                    |
| ---------------- | ---------------- | ------------------------------------------ |
| `Organization`   | Root layout      | Business name, logo, contact, social links |
| `WebSite`        | Home page        | Site name, URL                             |
| `Service`        | Services page    | Each service offering with description     |
| `FAQ`            | Services / About | Common questions for rich results          |
| `BreadcrumbList` | All pages        | Navigation path in search results          |

**Technical SEO:**

- `robots.txt`: Allow all public pages. Disallow `/admin/`, `/portal/`, `/api/`. Sitemap reference.
- `sitemap.xml`: Dynamic via Next.js `sitemap.ts` — all public pages, excludes auth/admin/portal/api routes.
- Favicon: Custom BuiltByBas icon (`.ico` + `.svg`)

**Core Web Vitals targets:** LCP < 2.5s, INP < 200ms, CLS < 0.1

**Font loading:** `next/font` with `font-display: swap`, preloaded. No external font CDN requests.

**Image optimization:** Next.js `<Image>` component for all images. WebP/AVIF automatic format negotiation. Responsive `sizes` attribute. Priority loading for above-fold hero images.

**Analytics:** Deferred to v1 launch decision — options: Google Analytics 4, Plausible (privacy-first), or Umami (self-hosted). Script loaded with `defer`, never render-blocking.

### Principles (from Bas)

- "7 P's — Proper Prior Planning Prevents Piss Poor Performance"
- "Projects should be kept in good standing — not as an afterthought"
- "I want to wow people"
- "The website should send me clients with wallets out"
- "This site should use the full capabilities of animation and web applications"
- "I want real value. I need to monetize this."
