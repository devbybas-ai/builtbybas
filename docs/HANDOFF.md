# BuiltByBas — Handoff Document

> **Last Updated:** 2026-03-01 (Session 20)
> **Status:** LIVE AT builtbybas.com — Hero animation overhaul: center hub energize pulse on particle arrival, organic PCB chip activity with permanent right-angle traces, progress-bar data flow from hub to opposite-side chips. Hero subtitle updated. 163 tests, 50-route build.
> **Next Session:** Client portal, invoice PDF generation, SSH key fix for local dev machine

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
- **Owner seeded:** `scripts/seed-owner.ts` — Bas Rosario (devbybas@gmail.com, role: owner). Added `db:seed` script.
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
- **Colour Parlor Nginx fix:** Direct IP access (http://72.62.200.30/) was returning 404 because colourparlor Nginx config only matched domain names. Added `default_server` to listen directive and `_` wildcard to server_name.
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

### What's Next

**Phase 6 — Client Portal:**
1. Client-facing portal (project status, invoices, communication)
2. Invoice PDF generation
3. Email notifications for invoice/proposal status changes

**Portfolio Enhancements:**
4. Gallery screenshots for remaining projects (All Beauty, Praxis Library, Colour Parlor — currently single image)
5. Screenshots for KAR CRM once it's back up

**Improvements:**
6. Fix SSH key access from local dev machine to VPS (currently using HTTPS workaround)
7. Run `pm2 startup && pm2 save` on VPS for auto-restart on reboot

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
