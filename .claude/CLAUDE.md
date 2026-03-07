# BuiltByBas — Project Instructions

> **Version 1.0 | Rosario Project Standard**
> Read automatically at the start of every Claude Code session.
> Source of truth for all standards: `.claude/SITE-HEALTH-PLAN.md`
> The Eight Pillars govern every decision.

---

## 1. Header

**Project:** BuiltByBas
**Version:** 1.0
**Standard:** Rosario Project Standard — 8 Pillars
**Source of Truth:** `.claude/SITE-HEALTH-PLAN.md`
**Author:** Bas Rosario
**Builder:** Claude (#OneTeam)

---

## 2. Required Reading

Read these files at the start of every session, in this order:

| #   | File       | Location            | Why                                                         |
| --- | ---------- | ------------------- | ----------------------------------------------------------- |
| 1   | HANDOFF.md | `docs/HANDOFF.md`   | Master context — where we left off, what's next             |
| 2   | AUDIT.md   | `AUDIT.md`          | Health dashboard — current scores, open issues, tech debt   |
| 3   | CLAUDE.md  | `.claude/CLAUDE.md` | This file — project identity, standards, prohibited actions |

If code exists: run `pnpm test` and `pnpm build` to confirm baseline before making changes.

---

## 3. Session Protocol

### Start of Session
1. Read `docs/HANDOFF.md` — understand current state
2. Check `AUDIT.md` — note any open issues or failing dimensions
3. Run tests (if code exists): `pnpm test` then `pnpm build`
4. Confirm understanding: "I've read the handoff. Here's what I understand: [summary]. Here's what I plan to do: [plan]."

### During Session
- Mark progress in the task at hand
- Note any issues discovered — add to AUDIT.md issues tracker immediately
- Test before and after every change: `pnpm test`
- Follow the 8 pillars on every line of code
- Activate SME agent personas from `docs/AGENT-PERSONAS.md` when task matches triggers

### End of Session
1. Update `docs/HANDOFF.md` — what was done, what's next, any blockers
2. Update `AUDIT.md` — new issues found, issues resolved, score changes
3. Run full test suite: `pnpm test` then `pnpm build`
4. Recommend next steps: "Next session should focus on: [specific tasks]"

---

## 4. Project Identity

| Field        | Value                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------- |
| **Project**  | BuiltByBas                                                                                         |
| **Type**     | Full-stack web platform (public site + admin CRM + client portal)                                  |
| **Owner**    | Bas Rosario                                                                                        |
| **Company**  | BuiltByBas                                                                                         |
| **Domain**   | builtbybas.com                                                                                     |
| **Audience** | Businesses of all sizes — service companies, startups, professional practices, growing enterprises |
| **Region**   | United States (primary), global (accessible)                                                       |
| **Repo**     | <https://github.com/devbybas-ai/builtbybas> (private)                                              |
| **VPS**      | Hostinger — 72.62.200.30 (Ubuntu 24.04, KVM 2)                                                     |

---

## 5. Technology Stack

Every choice is LOCKED. Changing requires a documented decision in HANDOFF.md with justification.

| Layer                 | Choice                             | Justification                                                                                       |
| --------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Framework**         | Next.js (App Router)               | SSR + SSG + API routes in one framework. Best for SEO public site + authenticated dashboard.        |
| **Language**          | TypeScript (strict mode)           | Zero `any`, no implicit typing. Catches bugs at compile time.                                       |
| **Database**          | PostgreSQL                         | Multi-user from day one. ACID transactions, RBAC-ready, production-grade.                           |
| **Styling**           | Tailwind CSS 4                     | Utility-first, design token support, fast iteration.                                                |
| **Component Library** | shadcn/ui                          | Accessible, composable, owns the code. Not a dependency — copies into project.                      |
| **Animation**         | Framer Motion                      | Spring physics, scroll-driven animations, page transitions, gesture support. Premium feel.          |
| **Validation**        | Zod                                | Runtime + static type inference. Every API endpoint validated.                                      |
| **Authentication**    | Custom (httpOnly cookies + bcrypt) | Full control. RBAC: owner, team, client roles. No third-party auth dependency.                      |
| **Testing**           | Vitest + Playwright + axe-core     | Unit/integration (Vitest), E2E (Playwright), accessibility (axe-core).                              |
| **Package Manager**   | pnpm                               | Strict, fast, disk-efficient. Standard across all Rosario projects.                                 |
| **Hosting**           | VPS — Hostinger (PM2 + Nginx)      | Full server control. No vendor lock-in. Direct deployment.                                          |
| **AI Provider**       | Anthropic (Claude)                 | Proposal drafting, estimates, content, follow-ups, insights. RAI-governed.                          |
| **Design System**     | Custom glassmorphism               | Dark mode (#0A0A0F), glassmorphism (bg-white/5 backdrop-blur-xl), electric cyan (#00D4FF / #0EA5E9) |

---

## 6. The Eight Pillars

Every line of code, every component, every API route is measured against these 8 pillars from the Site Health Plan.

### Pillar 1: Security Minded
**Universal:** No eval(), no dangerouslySetInnerHTML, no string concatenation in queries, no secrets in client code.
**This project:** Custom auth with httpOnly cookies, bcrypt password hashing, RBAC enforcement on every admin/portal route, rate limiting on login (5 attempts / 15 min / IP), CSRF protection via origin header validation, field whitelisting on all PATCH/PUT endpoints. No raw body passed to database.

### Pillar 2: Structure
**Universal:** No file >500 lines, one component per file, named exports match filenames, group by feature not type.
**This project:** App Router route groups for public/auth/admin/portal. Components grouped by domain (clients/, pipeline/, portal/). Types in src/types/. Utilities in src/lib/. Tests mirror src/ structure.

### Pillar 3: Performance
**Universal:** No render-blocking resources, images optimized, bundle size monitored, lazy load below-fold content.
**This project:** Next.js Image component for all images, dynamic imports for heavy components (KanbanBoard, charts), server components by default (client components only when needed for interactivity), Framer Motion lazy-loaded on public pages, PostgreSQL queries indexed on foreign keys and search fields.

### Pillar 4: Inclusive
**Universal:** WCAG 2.1 AA compliance, semantic HTML, keyboard navigable, screen reader compatible.
**This project:** axe-core on every E2E test, skip-to-content link, form labels on every input, 4.5:1 contrast minimum (especially important with dark theme + cyan accents), focus indicators visible, touch targets 44x44px minimum, heading hierarchy enforced.

### Pillar 5: Non-Bias
**Universal:** No assumptions about users based on name, location, gender, age, ability, or economic status. Default-deny on language: use only plain, direct words with no disputed or harmful origins. If an idiom, metaphor, or colloquialism could trace back to violence, oppression, or discrimination, replace it with clear language. Do not maintain a blocklist; instead, treat all figurative language as suspect and prefer literal alternatives.
**This project:** Intake form uses neutral language, no required fields for optional demographics, scoring engine based on objective project fit criteria (not client characteristics), AI-generated proposals reviewed for bias before sending.

### Pillar 6: UX Minded
**Universal:** Every interaction is intentional. Loading states, error states, empty states, success feedback.
**This project:** Multi-step intake form with progress bar and save-state, pipeline kanban with drag-and-drop, glassmorphism cards with hover states, toast notifications for actions, confirm dialogs for destructive actions, skeleton loaders on data-fetching pages, Framer Motion transitions between pages.

### Pillar 7: Universal Design
**Universal:** Works across devices, browsers, connection speeds, and abilities.
**This project:** Mobile-first responsive (375px base), tested at 768px (tablet) and 1440px (desktop), public site works without JavaScript (SSR), admin dashboard works on tablet viewport, reduced motion media query respected for all Framer Motion animations.

### Pillar 8: R3S (Robustness, Redundancy, Recovery, Strategy)
**Universal:** What happens when something fails? Graceful degradation, error boundaries, retry logic.
**Risk:** Downtime, data loss, cascading failures — every unhandled failure erodes user trust.
**Mitigation:** PM2 auto-restart, error boundaries on every route, static fallback data when the database is down.
**This project:** React error boundaries on every route, API routes return generic error messages (no stack traces), database connection pooling, PM2 process management with auto-restart, static fallback data for portfolio if database is down, session expiry handling in auth middleware.

---

## 7. Team Dynamic

| Role               | Who         | Responsibilities                                                                      |
| ------------------ | ----------- | ------------------------------------------------------------------------------------- |
| **Technical Lead** | Bas Rosario | Vision, decisions, business context, client relationships, final approval             |
| **Builder**        | Claude      | Architecture, code, testing, documentation, SME agent activation, quality enforcement |
| **Standard**       | #OneTeam    | Every decision is collaborative. Claude recommends, Bas decides.                      |

---

## 8. Prohibited Actions

From the Site Health Plan — these are NEVER allowed:

**Code:**
- No `eval()` or `Function()` constructor
- No `dangerouslySetInnerHTML`
- No `: any` type annotations
- No `console.log` in production code or API routes
- No string concatenation in SQL queries
- No `innerHTML` assignment
- No `document.write()`
- No disabled ESLint rules without documented justification
- No `@ts-ignore` without documented justification

**Security:**
- No secrets in client-side code (only `NEXT_PUBLIC_` prefixed env vars in browser)
- No real values in `.env.example`
- No force-push to `main`
- No committing `.env`, `.env.local`, or any credentials file
- No raw request body passed directly to database operations
- No skipping auth checks on protected routes

**Process:**
- No shipping without tests
- No skipping the session protocol
- No modifying archived content in `docs/archive/`
- No changing locked tech stack decisions without documented justification in HANDOFF.md
- No deploying without `pnpm test` and `pnpm build` passing

**Documentation Format:**

- All markdown tables must have aligned columns in source — run `node scripts/format-tables.mjs` before committing doc changes
- Every governance doc with tables must be listed in `scripts/format-tables.mjs` FILES array
- Tables must have a header row, separator row (`---`), and at least one data row
- Heading hierarchy must be sequential — no skipping levels (H2 → H3 → H4, never H2 → H4)
- Major sections in governance docs separated by `---` horizontal rules
- No raw HTML in markdown files — use standard markdown syntax
- Markdown lint must pass per `.markdownlint.json` configuration
- When adding a new governance doc: add it to `scripts/format-tables.mjs`, DOCUMENT-INDEX.md, and CLAUDE.md Quick Reference

---

## 9. DevOps Standards

### Git Conventions
- Commit format: `<type>: <description>` (feat, fix, docs, refactor, test, chore)
- AI co-author line: `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
- Atomic commits — one logical change per commit
- Never force-push to main
- Test before push — all tests pass, build succeeds

### Branching — Trunk-Based
- `main` — production-ready, always deployable
- `feature/*` — short-lived work branches (hours to days)
- `fix/*` — bug fix branches
- Merge fast. No long-running branches.

### CI/CD Pipeline (GitHub Actions)

```text
lint → type-check → test → build → dependency-audit
```

Runs on every push to main and every pull request.

### Environments
| Environment | Config            | Purpose                      |
| ----------- | ----------------- | ---------------------------- |
| Local Dev   | `.env.local`      | Developer machine            |
| Staging     | `.env.staging`    | Pre-production testing       |
| Production  | `.env.production` | Live system (builtbybas.com) |

### Deployment

```bash
git pull origin main → pnpm install --frozen-lockfile → pnpm build → pm2 restart
```

---

## 10. Quick Reference

| File                   | Location             | Purpose                                         | Updated                 |
| ---------------------- | -------------------- | ----------------------------------------------- | ----------------------- |
| SITE-HEALTH-PLAN.md    | `.claude/`           | Source of truth — 8 pillars, all standards      | When source changes     |
| CLAUDE.md              | `.claude/`           | This file — project instructions                | When standards change   |
| HANDOFF.md             | `docs/`              | Master context — status, decisions, next steps  | Every session           |
| AUDIT.md               | root                 | Health dashboard, issues, tech debt             | When issues found/fixed |
| RAI-POLICY.md          | root                 | AI governance — human review gates              | When AI scope changes   |
| DIRECTORY-STRUCTURE.md | `docs/`              | File/folder tree and conventions                | When structure evolves  |
| TESTING-PLAN.md        | `docs/`              | Test strategy and coverage targets              | When test types change  |
| SITEMAP.md             | `docs/`              | Routes, pages, navigation                       | When routes change      |
| DOCUMENT-INDEX.md      | `docs/`              | Master doc navigation                           | When docs added         |
| AGENT-PERSONAS.md      | `docs/`              | SME agent library (59 agents)                   | When agents added       |
| AGENT-PERFORMANCE.md   | `docs/`              | Agent performance log and leaderboard           | When agents activated   |
| PROJECT-SETUP.md       | root                 | Founding document — how project was initialized | Reference only          |
| .env.example           | root                 | Environment variable template                   | When vars added         |
| .gitignore             | root                 | Git exclusion rules                             | When patterns needed    |
| ci.yml                 | `.github/workflows/` | CI pipeline definition                          | When stages change      |
