# BuiltByBas — Handoff Document

> **Last Updated:** 2026-02-28
> **Status:** Pre-Build — Setup Complete, Document Formatting Done
> **Next Session:** First commit, add SEO standard to PROJECT-SETUP.md, then Phase 1 — Foundation

---

## Table of Contents

- [Part 1: Project Concept](#part-1-project-concept)
- [Part 2: Decisions Made](#part-2-decisions-made)
- [Part 3: Build Status](#part-3-build-status)
- [Part 4: Context](#part-4-context)

---

## Part 1: Project Concept

### What Is BuiltByBas?

An elite one-man digital agency that builds custom software, websites, and marketing solutions for small businesses. Every project is handcrafted — no templates, no bloated teams, no disappearing act. Bas + Claude (#OneTeam) deliver agency-quality work at freelancer speed.

### Who Is It For?

Small businesses across all sectors:
- **Local service businesses** — plumbers, contractors, cleaners, salons
- **Growing service companies** — agencies, consultants, coaches
- **Startups / new businesses** — need everything from brand to tools
- **Professional practices** — law, accounting, medical

### The Problem

Small businesses get burned by agencies that:
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
| 1     | Foundation (Next.js, DB, auth, layout) | NOT STARTED | 1-3      |
| 2     | Public Website                         | NOT STARTED | 4-7      |
| 3     | CRM Core (clients, pipeline, scoring)  | NOT STARTED | 8-13     |
| 4     | Projects + Financials                  | NOT STARTED | 14-19    |
| 5     | AI Suite + Analytics                   | NOT STARTED | 20-23    |
| 6     | Hardening + Deployment                 | NOT STARTED | 24-27    |

### What Was Done This Session

- Fixed table formatting across all 9 governance docs — columns now align in source view
- Created `scripts/format-tables.mjs` — reusable Node.js table formatter for all docs
- Updated `.markdownlint.json` — enabled default rules with specific suppressions (was disabling everything)
- Document format enforcement initiated (tables aligned, lint rules active)

### Next Steps

1. **First commit** — `chore: initialize project governance structure` (all governance files ready)
2. **Add SEO standard to PROJECT-SETUP.md** — organic SEO per project, dual strategy (traditional + AI algorithms)
3. **Add document format enforcement rules to CLAUDE.md** — table alignment, formatting standards
4. Initialize Next.js project with TypeScript strict mode
5. Set up PostgreSQL connection and schema
6. Implement base layout (admin sidebar, public header/footer)
7. Build authentication (login, sessions, RBAC middleware)
8. Create the design system (glassmorphism tokens, cyan accents, Framer Motion base)

### Notes

- Active project root is `c:\builtbybas\` — old `c:\iostudio\` copies are stale, do not edit those
- `scripts/format-tables.mjs` can be re-run anytime with `node scripts/format-tables.mjs` to realign tables

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

- Home: `Custom Software & Web Development for Small Business - BuiltByBas`
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
