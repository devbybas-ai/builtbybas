# BuiltByBas — Handoff Document

> **Last Updated:** 2026-02-28
> **Status:** Intake Analysis Engine COMPLETE — algorithmic scoring, admin dashboard, API endpoints
> **Next Session:** PostgreSQL setup, CRM core (clients, pipeline), deployment prep

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
- **Deploy TODO:** SSH keys, disable root password, malware scanner, Nginx, PM2, Let's Encrypt SSL

---

## Part 3: Build Status

| Phase | Name                                   | Status      | Sessions |
| ----- | -------------------------------------- | ----------- | -------- |
| 0     | Project Setup & Governance             | COMPLETE    | Setup    |
| 1     | Foundation (Next.js, DB, auth, layout) | COMPLETE    | 1        |
| 2     | Public Website                         | COMPLETE    | 2-5      |
| 2.5   | Intake Analysis Engine                 | COMPLETE    | 6        |
| 3     | CRM Core (clients, pipeline, scoring)  | NOT STARTED | 7-11     |
| 4     | Projects + Financials                  | NOT STARTED | 12-17    |
| 5     | AI Suite + Analytics                   | NOT STARTED | 18-21    |
| 6     | Hardening + Deployment                 | NOT STARTED | 22-25    |

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

### What's Next

1. Set up local PostgreSQL — create database, run Drizzle migrations, test auth endpoints end-to-end
2. CRM core: clients module, pipeline (12-stage kanban)
3. Run E2E tests with Playwright (requires dev server)
4. Replace aspirational portfolio data with real projects as they're completed
5. Migrate intake submissions from JSON files to PostgreSQL (Phase 3)
6. Add real images to portfolio projects
7. Deliver comprehensive breakdown of every deliverable with state of product at delivery (per Bas's requirement)

### Notes

- Active project root is `c:\builtbybas\` — old `c:\iostudio\` copies are stale, do not edit those
- `scripts/format-tables.mjs` can be re-run anytime with `node scripts/format-tables.mjs` to realign tables
- SSH remote: `git@github.com-devbybas:devbybas-ai/builtbybas.git` (multi-account SSH alias)
- Git identity configured per-repo (not global) — name "Bas Rosario", email `devbybas@gmail.com`
- Next.js 16 deprecated `middleware.ts` in favor of `proxy` — current middleware works but emits a warning. Migrate when stable.
- PostgreSQL not yet running locally — auth API routes will fail until `DATABASE_URL` is configured in `.env.local`. Create DB before Phase 2 testing.
- Need to `git push` to sync remote (local is 1 commit ahead)

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
