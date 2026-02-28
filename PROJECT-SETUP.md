# Project Setup Protocol

> **Rosario Project Standard | Version 1.0**
> Read ONCE — at the very start of a new project, before any code is written.
> Creates the governance structure that every session depends on.
> Source of truth for all standards: `SITE-HEALTH-PLAN.md`
>
> Author: Bas Rosario
> Applies to: Every Rosario project (#OneTeam)

---

## How This Works

1. Bas drops this file into a new project directory
2. Bas tells Claude: "Set up this project" and provides the project name and initial concept
3. Claude reads this file and begins the **Project Discovery** (Section 0) — a structured conversation where Claude and Bas collaborate on concept, stack, and scope decisions
4. Once all discovery decisions are locked: Claude satisfies prerequisites (Section 1)
5. Claude creates all governance files (Sections 2-3)
6. Claude sets up DevOps infrastructure (Section 4)
7. Claude runs the Pre-Build Readiness Audit (Section 7)
8. If ALL gates pass: **"We are ready to start."**
9. If ANY gate fails: Claude fixes it and re-audits until clean

The phrase "We are ready to start" is the official green light. No code before that.

---

## Section 0: Project Discovery

Before prerequisites, before files, before anything — Claude and Bas figure out WHAT they are building and HOW. This is not a one-way handoff. Claude brings expertise, presents options with trade-offs, and makes recommendations. Bas makes the final call on every decision. Nothing is assumed.

### 0.1 Concept Discovery

Claude asks Bas to describe the project in plain language, then structures the answers into a **Project Brief**. Claude should ask clarifying questions — not just accept the first description.

**Questions Claude asks (adapt to context, skip what's already answered):**

| #   | Question                                                                 | Why It Matters                                                    |
| --- | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| 1   | What is this project? Describe it like you're explaining it to a friend. | Gets the core concept without technical jargon                    |
| 2   | Who is it for? Who are the end users?                                    | Defines audience — affects UX, accessibility, performance targets |
| 3   | What problem does it solve? What pain exists without it?                 | Validates the "why" — keeps scope focused on value                |
| 4   | What does success look like in 3 months? In 1 year?                      | Sets measurable goals — prevents scope creep                      |
| 5   | What are the must-have features for v1? What can wait?                   | Forces prioritization — MVP vs future                             |
| 6   | Are there existing products or competitors to reference?                 | Establishes benchmarks and differentiation                        |
| 7   | Does this project use AI? If so, for what specifically?                  | Triggers RAI-POLICY.md requirement and AI stack decisions         |
| 8   | Who is on the team? Just Bas + Claude, or others?                        | Affects auth, collaboration features, deployment workflow         |

**Output:** A written **Project Brief** summarizing: concept, audience, problem, success metrics, v1 scope, and team. This becomes the foundation for HANDOFF.md Part 1.

---

### 0.2 Stack Selection

Claude does NOT just ask "what stack do you want?" Claude presents the best options for THIS project based on the concept, audience, and scope — with trade-offs — and recommends one. Bas decides.

**For each stack layer, Claude presents:**

```
Layer: [e.g., Framework]
─────────────────────────────
Option A: [Name]
  Strengths: ...
  Weaknesses: ...
  Best when: ...

Option B: [Name]
  Strengths: ...
  Weaknesses: ...
  Best when: ...

Option C: [Name] (if applicable)
  Strengths: ...
  Weaknesses: ...
  Best when: ...

Recommendation: [Option X] — because [specific reason tied to THIS project]
```

**Stack layers to decide (in order):**

| #   | Layer                    | What's Being Decided               | Common Options                                                           |
| --- | ------------------------ | ---------------------------------- | ------------------------------------------------------------------------ |
| 1   | **Framework**            | Core application framework         | Next.js, Remix, Nuxt, SvelteKit, Astro, Rails, Django, Laravel           |
| 2   | **Language**             | Programming language + type safety | TypeScript (strict), TypeScript (loose), JavaScript, Python, Ruby, Go    |
| 3   | **Database**             | Data storage and querying          | PostgreSQL, MySQL, SQLite, MongoDB, Supabase, PlanetScale, Turso         |
| 4   | **ORM / Query Layer**    | How code talks to the database     | Drizzle, Prisma, Kysely, raw SQL, Knex, TypeORM                          |
| 5   | **Styling**              | UI styling approach                | Tailwind CSS, CSS Modules, Styled Components, Vanilla CSS, Sass          |
| 6   | **Component Library**    | Pre-built UI components            | shadcn/ui, Radix, Headless UI, MUI, Chakra, Mantine, none (custom)       |
| 7   | **Validation**           | Input/data validation              | Zod, Yup, Valibot, ArkType, joi                                          |
| 8   | **Authentication**       | User auth and sessions             | Custom (cookies + bcrypt), NextAuth/Auth.js, Clerk, Lucia, Supabase Auth |
| 9   | **Testing**              | Test runner and tools              | Vitest, Jest, Playwright, Cypress, Testing Library                       |
| 10  | **Package Manager**      | Dependency management              | pnpm, npm, yarn, bun                                                     |
| 11  | **Hosting / Deployment** | Where it runs                      | VPS (PM2 + Nginx), Vercel, Netlify, Railway, Fly.io, AWS, Docker         |
| 12  | **AI Provider**          | AI/LLM integration (if applicable) | Anthropic (Claude), OpenAI, local models, none                           |

**Rules for stack selection:**
- Claude presents 2-3 real options per layer — not every option that exists, just the ones that make sense for THIS project
- Every recommendation includes a "because" tied to the project concept, not generic praise
- Bas can override any recommendation — Claude documents the choice AND the justification
- If Bas has a strong preference already ("I want Next.js"), Claude confirms it's a good fit and moves on — no forced debates
- Stack decisions are LOCKED after this step. Changing later requires a documented decision in HANDOFF.md

**Output:** A **Stack Decision Table** with every layer, the chosen option, and the justification. This becomes CLAUDE.md Section 5 and HANDOFF.md Part 2.

---

### 0.3 Scope Definition

With concept and stack locked, Claude and Bas define the major features and applications.

**Claude walks through:**

| #   | Question                                                  | Purpose                                                    |
| --- | --------------------------------------------------------- | ---------------------------------------------------------- |
| 1   | How many distinct applications/interfaces does this need? | Monolith vs multi-app (e.g., public site + admin + portal) |
| 2   | For each application: what are the major pages/sections?  | Feeds SITEMAP.md and DIRECTORY-STRUCTURE.md                |
| 3   | What user roles exist? What can each role do?             | Defines auth architecture and route protection             |
| 4   | What are the core data entities?                          | Feeds database schema planning                             |
| 5   | What external integrations are needed?                    | Payment, email, AI APIs, file storage, etc.                |
| 6   | What is the deployment strategy?                          | VPS, serverless, containers — affects CI/CD and DevOps     |
| 7   | What is the design direction?                             | Dark/light, aesthetic, brand colors, existing brand assets |

**Output:** A **Scope Summary** with: applications list, major features per app, user roles, core entities, integrations, deployment strategy, design direction. This feeds into every governance file created later.

---

### 0.4 Discovery Gate

All three outputs must be confirmed by Bas before moving to prerequisites:

```
Project Discovery Summary:
  1. Project Brief:     [CONFIRMED / NEEDS REVISION]
  2. Stack Decisions:   [CONFIRMED / NEEDS REVISION]
  3. Scope Summary:     [CONFIRMED / NEEDS REVISION]

Result: [ALL CONFIRMED → proceed to prerequisites / REVISIONS NEEDED → address them]
```

Claude presents the full summary. Bas reviews. Once all three show CONFIRMED, discovery is complete and the decisions are locked.

---

## Section 1: Prerequisites

Before ANY governance files are created, these prerequisites must be satisfied. Each one has a verification check. Claude runs the check, reports PASS or FAIL, and resolves failures before moving on.

### 1.1 Version Control — Git + GitHub

**What:** A private GitHub repository initialized with git.
**Why:** Every line of code, every decision, every change is tracked. No exceptions.

**How to satisfy:**
```
git init
gh repo create [project-name] --private --source=. --remote=origin
```

**Verification:**
- `git status` returns a valid working tree
- `gh repo view` shows the correct private repository
- Remote `origin` is configured

---

### 1.2 Runtime — Node.js

**What:** Node.js installed at a current LTS or stable version.
**Why:** The runtime for Next.js and all build tooling.

**How to satisfy:**
```
node --version
```

**Verification:**
- `node --version` returns v18+ (LTS) or v20+ (current)
- If missing or outdated: install from nodejs.org or via nvm

---

### 1.3 Package Manager — pnpm

**What:** pnpm installed globally.
**Why:** Faster, stricter, disk-efficient. Standard across all Rosario projects.

**How to satisfy:**
```
pnpm --version
```

**Verification:**
- `pnpm --version` returns a valid version (v8+)
- If missing: `npm install -g pnpm`

---

### 1.4 Database Decision

**What:** The database technology is decided and documented.
**Why:** Schema design, connection configuration, and migration strategy depend on this choice. Changing later is expensive.

**How to satisfy:**
- Bas confirms the database choice (PostgreSQL, SQLite, Supabase, etc.)
- Connection does NOT need to be live at setup — just the decision documented

**Verification:**
- Database choice recorded in HANDOFF.md tech stack section
- Connection string placeholder in .env.example

---

### 1.5 Hosting & Domain Decision

**What:** Where the application will be deployed, and domain status.
**Why:** Affects security headers, SSL setup, environment configuration, and deployment scripts.

**How to satisfy:**
- Bas confirms hosting provider (DigitalOcean, Hetzner, Vercel, etc.)
- Domain: purchased, planned, or TBD — all valid, just documented

**Verification:**
- Hosting decision recorded in HANDOFF.md
- Domain status noted (purchased / planned / TBD)

---

### 1.6 CI/CD Plan

**What:** The continuous integration pipeline is planned (not necessarily implemented yet).
**Why:** Quality gates must be automated. Manual-only enforcement fails — KAR proved this.

**Standard Pipeline (GitHub Actions):**
```
lint → type-check → test → build → dependency-audit
```

**How to satisfy:**
- Pipeline stages confirmed with Bas
- `.github/workflows/` directory created at setup
- Workflow file created during governance file setup (Section 3)

**Verification:**
- Pipeline stages documented in CLAUDE.md
- `.github/workflows/ci.yml` exists (even if project has no code to run it on yet)

---

### 1.7 Branching Strategy

**What:** How branches are managed in git.
**Why:** Prevents merge chaos, defines the path from code to production.

**Rosario Standard: Trunk-Based Development**
- `main` is the production branch — always deployable
- Short-lived feature branches for work in progress
- Merge fast, no long-running branches
- Never force-push to main

**How to satisfy:**
- Strategy documented in CLAUDE.md git standards section
- `main` branch exists and is set as default

**Verification:**
- `git branch` shows `main` as current branch
- Strategy documented in CLAUDE.md

---

### 1.8 Environment Plan

**What:** The named environments the project will use.
**Why:** Prevents "works on my machine" problems. Ensures configuration is intentional.

**Standard Environments:**

| Environment | Purpose                | Config File       |
| ----------- | ---------------------- | ----------------- |
| Local Dev   | Developer machine      | `.env.local`      |
| Staging     | Pre-production testing | `.env.staging`    |
| Production  | Live system            | `.env.production` |

**How to satisfy:**
- Environment names and purposes documented in CLAUDE.md
- `.env.example` contains all variable names needed across environments

**Verification:**
- Environments listed in CLAUDE.md or HANDOFF.md
- `.env.example` exists with environment-appropriate variables

---

### 1.9 Containerization Decision

**What:** Whether the project uses Docker or deploys directly.
**Why:** Affects the entire deployment workflow. Decide once, document it, move on.

**How to satisfy:**
- Bas confirms: Docker or direct deployment (PM2 + Nginx)
- Decision documented with justification

**Verification:**
- Decision recorded in HANDOFF.md tech decisions section
- If Docker: Dockerfile planned. If not: PM2 + Nginx deployment documented.

---

### 1.10 DevSecOps Plan

**What:** How security is integrated into the development process.
**Why:** Security is not an afterthought. It is baked into every build, every commit, every deploy.

**Standard DevSecOps Practices:**
- `pnpm audit` runs in CI pipeline — zero critical vulnerabilities
- Security scan commands from Site Health Plan run before every deploy
- Dependency versions pinned, monitored for CVEs
- `.gitignore` covers all sensitive patterns from day one
- `.env.example` has no real values — ever

**How to satisfy:**
- Security scanning is included in CI pipeline stages
- `.gitignore` is comprehensive for the tech stack
- Dependency audit step exists in pipeline

**Verification:**
- CI workflow includes audit step
- `.gitignore` covers all required patterns (Section 3.7)
- No secrets in any tracked file

---

### Prerequisites Gate

**ALL 10 prerequisites must show PASS before proceeding to file creation.**

Claude presents the results:
```
Prerequisites Check:
  1. Git + GitHub:        [PASS/FAIL]
  2. Node.js:             [PASS/FAIL]
  3. pnpm:                [PASS/FAIL]
  4. Database Decision:   [PASS/FAIL]
  5. Hosting Decision:    [PASS/FAIL]
  6. CI/CD Plan:          [PASS/FAIL]
  7. Branching Strategy:  [PASS/FAIL]
  8. Environment Plan:    [PASS/FAIL]
  9. Containerization:    [PASS/FAIL]
  10. DevSecOps Plan:     [PASS/FAIL]

Result: [ALL PASS / X FAILURES — fixing before proceeding]
```

---

## Section 2: File Manifest

Every file that must exist before the first line of application code.

| #   | File                     | Location             | Purpose                                                           | Created By             |
| --- | ------------------------ | -------------------- | ----------------------------------------------------------------- | ---------------------- |
| 1   | `SITE-HEALTH-PLAN.md`    | `.claude/`           | Source of truth — 8 pillars, quality gates, scoring               | Copied from source     |
| 2   | `CLAUDE.md`              | `.claude/`           | Project identity, 8 pillars, session protocol, prohibited actions | Claude (generated)     |
| 3   | `HANDOFF.md`             | `docs/`              | Business concept, tech decisions, build status                    | Claude + Bas           |
| 4   | `AUDIT.md`               | project root         | Pre-Build health dashboard, issues tracker, tech debt register    | Claude (generated)     |
| 5   | `archive/`               | `docs/archive/`      | Empty — ready for completed scope archival                        | Claude (directory)     |
| 6   | `.env.example`           | project root         | Environment variable template (names only, no values)             | Claude (generated)     |
| 7   | `.gitignore`             | project root         | Exclusion rules for the tech stack                                | Claude (generated)     |
| 8   | `RAI-POLICY.md`          | project root         | Responsible AI governance (conditional — AI projects only)        | Claude (if applicable) |
| 9   | `ci.yml`                 | `.github/workflows/` | CI pipeline definition                                            | Claude (generated)     |
| 10  | `DIRECTORY-STRUCTURE.md` | `docs/`              | Complete file/folder tree with naming conventions and rules       | Claude (generated)     |
| 11  | `TESTING-PLAN.md`        | `docs/`              | Testing strategy, coverage targets, test types, CI integration    | Claude (generated)     |
| 12  | `SITEMAP.md`             | `docs/`              | Route map, page hierarchy, auth requirements, SEO pages           | Claude (generated)     |
| 13  | `DOCUMENT-INDEX.md`      | `docs/`              | Master navigation — "I need X → read this file" lookup            | Claude (generated)     |
| 14  | `AGENT-PERSONAS.md`      | `docs/`              | SME agent library — auto-activating specialist personas           | Claude (generated)     |

---

## Section 3: File Specifications

### 3.1 SITE-HEALTH-PLAN.md

**Location:** `.claude/SITE-HEALTH-PLAN.md`
**What:** The Rosario Project Standards document — 8 pillars, quality gates, testing standards, deployment standards, code quality enforcement, meta-audit, health dashboard template.
**Why:** This is the ABSOLUTE SOURCE OF TRUTH for every standard in every Rosario project. When any other document contradicts this one, this one wins.
**Action:** Copy from `C:/builtbybas/SITE-HEALTH-PLAN.md` into the project's `.claude/` directory. Do not modify the copy.
**Updated:** Only when the source document is updated.
**Verification:** File exists in `.claude/`, content matches source.

---

### 3.2 CLAUDE.md

**Location:** `.claude/CLAUDE.md`
**What:** Project-specific instructions read automatically at the start of every Claude Code session.
**Why:** Ensures every session begins with full context. Prevents drift. Defines what Claude can and cannot do.
**Action:** Generate from template, adapted to this project's stack and requirements.

**Required Sections (all 10 must be present):**

1. **Header** — Project name, version, 8 pillars reference
2. **Required Reading** — Table: HANDOFF.md first, then AUDIT.md, then CLAUDE.md
3. **Session Protocol**
   - Start: Read HANDOFF.md → check AUDIT.md → run tests (if code exists) → confirm understanding
   - During: Mark progress, note issues, test before and after changes
   - End: Update HANDOFF.md → update AUDIT.md → run tests → recommend next steps
4. **Project Identity** — Table: project name, type, owner, audience, region, repo URL
5. **Technology Stack** — Table: framework, language, database, styling, validation, testing, package manager, auth, hosting (all locked)
6. **The Eight Pillars** — For each pillar: universal rules (from Site Health Plan) + tech-specific rules (for this project's stack)
7. **Team Dynamic** — Who does what: Bas (technical lead), Claude (builder), project-specific collaborators
8. **Prohibited Actions** — Full list from Site Health Plan "Prohibited Actions" section plus any project-specific additions. Must include 4 categories: Code, Security, Process, Documentation Format (table alignment, lint compliance, heading hierarchy, new-doc checklist)
9. **DevOps Standards** — Git conventions, branching strategy, CI/CD pipeline, environments, deployment process
10. **Quick Reference** — Table mapping every governance file to its purpose and location

**Updated:** When standards change or tech stack decisions are modified.
**Verification:** File has all 10 sections, session protocol present, 8 pillars referenced, prohibited actions complete.

---

### 3.3 HANDOFF.md

**Location:** `docs/HANDOFF.md`
**What:** The master context document. Everything a fresh Claude instance needs to understand the project and continue where the last session ended.
**Why:** Prevents context loss between sessions. Without this, every session starts from scratch.
**Action:** Generate initial version from whatever Bas has communicated about the project.

**Initial Structure (Pre-Build):**

- **Header** — Project name, last updated, status: "Pre-Build — Setup Complete"
- **Table of Contents**
- **Part 1: Project Concept** — Business concept, target audience, key requirements
- **Part 2: Decisions Made** — Tech stack (locked), architecture decisions, open questions
- **Part 3: Build Status** — Phase tracking table (Phase 0: Setup = COMPLETE), next steps
- **Part 4: Context** — Business context, constraints, principles Bas has shared

**Growth Rules:**
- Updated every session — this is the most frequently updated file
- When it exceeds ~750 lines: move completed sections to `docs/archive/completedscope.md`
- Always keep summary stubs and key facts inline when archiving (anti-drift guardrails)
- The archive is append-only — never modify archived sections

**Updated:** Every session.
**Verification:** File exists, has table of contents, has project concept, status line present.

---

### 3.4 AUDIT.md

**Location:** Project root
**What:** Project health dashboard, issues tracker, and tech debt register.
**Why:** In KAR, the audit happened after 7 build phases and found a CRITICAL SQL injection. Projects now start audited. The initial audit scores PROJECT SETUP QUALITY — not code (there is no code yet).
**Action:** Generate with Pre-Build Readiness scoring.

**Structure:**

**Section 1: Health Dashboard — Pre-Build Readiness Baseline**

| Dimension               | Score   | Grade | Notes                                                    |
| ----------------------- | ------- | ----- | -------------------------------------------------------- |
| Prerequisites Satisfied | /10     |       | All 10 prerequisites verified                            |
| Governance Files        | /10     |       | All required files exist and are complete                |
| Standards Integration   | /10     |       | Site Health Plan copied, CLAUDE.md references 8 pillars  |
| Session Protocol        | /10     |       | Start/during/end protocol defined                        |
| Project Definition      | /10     |       | Business concept, tech stack, decisions documented       |
| Security Posture        | /10     |       | .gitignore, .env.example, no secrets, prohibited actions |
| Archive Readiness       | /10     |       | docs/archive/ exists, archival rules defined             |
| Git & VCS Config        | /10     |       | Repo initialized, branching strategy documented          |
| CI/CD Pipeline          | /10     |       | GitHub Actions workflow exists, stages defined           |
| DevOps Readiness        | /10     |       | Environments, deployment strategy, DevSecOps documented  |
| RAI Compliance          | /10     |       | RAI-POLICY.md present (if AI project), or N/A            |
| Handoff Quality         | /10     |       | HANDOFF.md has concept, decisions, status, TOC           |
| SEO Foundation          | /10     |       | Title pattern, OG, structured data, technical SEO, CWV   |
| **Overall Readiness**   | **/10** |       |                                                          |

Grading: A+ = 10, A = 9, B+ = 8, B = 7, C = 6, D = 5, F = <5

**Section 2: Quality Gates — Pre-Build**

| Gate                                            | Status | Notes |
| ----------------------------------------------- | ------ | ----- |
| SITE-HEALTH-PLAN.md in .claude/                 |        |       |
| CLAUDE.md complete (all 10 sections)            |        |       |
| HANDOFF.md initialized with concept + decisions |        |       |
| AUDIT.md initialized (this file)                |        |       |
| .gitignore configured for stack                 |        |       |
| .env.example present, no real values            |        |       |
| docs/archive/ directory exists                  |        |       |
| RAI-POLICY.md present (if applicable)           |        |       |
| .github/workflows/ci.yml exists                 |        |       |
| DIRECTORY-STRUCTURE.md — complete file tree     |        |       |
| TESTING-PLAN.md — test strategy and coverage    |        |       |
| SITEMAP.md — all routes and navigation          |        |       |
| DOCUMENT-INDEX.md — master doc navigation       |        |       |
| AGENT-PERSONAS.md — SME agent library           |        |       |
| Git repo initialized, remote configured         |        |       |
| No secrets in any tracked file                  |        |       |
| Session protocol documented in CLAUDE.md        |        |       |

**Section 3: Issues Tracker**

| ID  | Severity | Category | Issue                            | Found | Status | Resolution |
| --- | -------- | -------- | -------------------------------- | ----- | ------ | ---------- |
| —   | —        | —        | No issues — project starts clean | Setup | —      | —          |

**Section 4: Tech Debt Register**

| ID  | Class | Description                         | Owner | Target Date | Status |
| --- | ----- | ----------------------------------- | ----- | ----------- | ------ |
| —   | —     | No tech debt — project starts clean | —     | —           | —      |

Tech Debt Classes (from Site Health Plan):
- TD-1: Known shortcut, plan to fix within 2 sessions
- TD-2: Deprecated pattern, fix within 1 month
- TD-3: Architecture limitation, plan migration within 1 quarter
- TD-4: Legacy code with no tests, write tests before modifying

**Section 5: Audit History**

| Date    | Session | Type                | Score | Auditor      | Notes               |
| ------- | ------- | ------------------- | ----- | ------------ | ------------------- |
| [today] | Setup   | Pre-Build Readiness | /10   | Claude + Bas | Initial setup audit |

**Transition Note:** After the first build session, Section 1 transitions from Pre-Build dimensions to the standard 14-dimension Health Dashboard from the Site Health Plan. Pre-Build scores are preserved in the Audit History.

**Updated:** When issues are found or fixed.
**Verification:** All 5 sections present, dashboard populated, trackers structured.

---

### 3.5 docs/archive/

**Location:** `docs/archive/`
**What:** Empty directory, ready for archived HANDOFF.md sections.
**Why:** KAR created the archive retroactively. Setting it up from day one means no scrambling later.
**Action:** Create directory with a `.gitkeep` file.

**Archive Rules (enforced in CLAUDE.md):**
- Move completed sections from HANDOFF.md when it exceeds ~750 lines
- Always keep summary stubs inline with key facts (anti-drift guardrails)
- Pointer to source of truth in the archived file
- Archive is append-only — never modify archived content

**Verification:** Directory exists.

---

### 3.6 .env.example

**Location:** Project root
**What:** Template listing every environment variable the project needs — names and descriptions only, NEVER real values.
**Why:** Site Health Plan Section 1.7 requires this on every project. Prevents configuration drift and makes onboarding simple.
**Action:** Generate based on tech stack.

**Minimum Content:**
```
# [Project Name] Environment Variables
# Copy to .env.local and fill in values
# NEVER commit .env.local — it is in .gitignore

# === DATABASE ===
DATABASE_URL=           # PostgreSQL connection string

# === APPLICATION ===
NEXT_PUBLIC_SITE_URL=   # Public URL of the application
NODE_ENV=               # development | production

# === AUTH ===
AUTH_SECRET=            # Session signing secret (generate with: openssl rand -base64 32)

# [Add variables as services are added]
```

**Updated:** Every time a new env var is added.
**Verification:** File exists, contains zero real secret values.

---

### 3.7 .gitignore

**Location:** Project root
**What:** Git exclusion rules configured for the tech stack from day one.
**Why:** Prevents accidental commits of secrets, build artifacts, database files with PII.

**Required Exclusions (all projects):**
```
# Dependencies
node_modules/

# Environment (NEVER commit)
.env
.env.local
.env.production
.env.staging
.env*.local

# Build
.next/
out/
dist/
build/

# Database
*.sqlite
*.db
src/data/

# Testing
coverage/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
*.log
npm-debug.log*

# Turbo
.turbo/

# Misc
*.tsbuildinfo
```

Add stack-specific exclusions as needed.

**Updated:** When new exclusion patterns are needed.
**Verification:** File exists, covers all required patterns, `git status` would not expose secrets.

---

### 3.8 RAI-POLICY.md (Conditional)

**Location:** Project root
**Condition:** Only if the project uses AI features. If no AI: skip, mark N/A in audit.
**What:** Responsible AI governance for the project.
**Why:** Site Health Plan RAI Standards section requires documented governance for AI-using projects.

**Required Sections:**
1. **AI Use Cases** — What AI does in this project (list each feature)
2. **Human Review Gates** — Where human review is required before AI output reaches users
3. **Data Handling** — What data is sent to AI, what is never sent
4. **Transparency** — How users are informed about AI involvement
5. **Bias Prevention** — How AI output is reviewed for bias
6. **Incident Response** — What happens when AI produces harmful or incorrect output

**Updated:** When AI scope changes.
**Verification:** All 6 sections present, every AI feature has a human review gate.

---

### 3.9 .github/workflows/ci.yml

**Location:** `.github/workflows/ci.yml`
**What:** GitHub Actions CI pipeline definition.
**Why:** Quality gates must be automated. Manual-only enforcement fails.

**Standard Pipeline:**
```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm tsc --noEmit
      - run: pnpm test
      - run: pnpm build
      - run: pnpm audit --audit-level=critical
```

**Note:** This file is created at setup even if there is no code to run it on yet. It is ready for the first build session.

**Updated:** When pipeline stages change.
**Verification:** File exists, contains all required stages (lint, type-check, test, build, audit).

---

### 3.10 DIRECTORY-STRUCTURE.md

**Location:** `docs/DIRECTORY-STRUCTURE.md`
**What:** Complete file and folder tree for the entire project — root, src/, components/, lib/, data/, styles/, types/, tests/.
**Why:** Every file has a home. Every directory has a purpose. Prevents file sprawl and naming inconsistency across the project.
**Action:** Generate from project requirements. Covers all planned directories, component groups, utility modules, test structure.

**Required Sections:**
1. **Root** — Top-level files and directories with purpose annotations
2. **src/app/** — Next.js App Router structure (pages, route groups, API routes)
3. **src/components/** — Component tree grouped by feature (ui/, shared/, layout/, forms/, dashboard/, etc.)
4. **src/lib/** — Shared utilities, core logic, AI modules
5. **src/data/** — Static fallback data and seed files
6. **src/styles/** — Global styles and design tokens
7. **src/types/** — Shared TypeScript type definitions
8. **Naming Conventions** — Table: PascalCase components, camelCase utils, UPPER_SNAKE constants, kebab-case directories
9. **Rules** — One component per file, no file >500 lines, group by feature, tests mirror source

**Updated:** When new features require new directories or the structure evolves.
**Verification:** All planned directories listed, naming conventions documented, rules present.

---

### 3.11 TESTING-PLAN.md

**Location:** `docs/TESTING-PLAN.md`
**What:** Complete testing strategy — tools, coverage targets, test types, file structure, CI integration, naming conventions, rules.
**Why:** "We'll add tests later" means tests never get added. The testing plan is defined before any code so every feature ships with tests from day one.
**Action:** Generate from Site Health Plan testing standards, adapted to this project's stack and requirements.

**Required Sections:**
1. **Testing Stack** — Table: tool, purpose, runs in (Vitest, Playwright, axe-core, custom security suite)
2. **Coverage Targets** — Table: category, target %, what's included
3. **Test Types** — 5 types detailed:
   - Unit Tests (Vitest) — what gets tested, priority table, example file structure
   - Integration Tests (Vitest) — API route testing, verification checklist, example file structure
   - E2E Tests (Playwright) — user flows, priority table, example file structure
   - Accessibility Tests (axe-core + Playwright) — WCAG checks, axe-core pattern
   - Security Tests (Custom Vitest) — prohibited patterns, auth enforcement, field whitelisting
4. **When Tests Get Written** — Phase-by-phase table aligned with build plan
5. **CI Pipeline Integration** — Commands for local and CI execution
6. **Test Naming Convention** — describe/it pattern with arrange/act/assert
7. **Rules** — No feature ships without tests, bug fix = regression test, tests run before commit

**Updated:** When new test types are added or coverage targets change.
**Verification:** All 5 test types detailed, coverage targets defined, CI commands present, rules documented.

---

### 3.12 SITEMAP.md

**Location:** `docs/SITEMAP.md`
**What:** Every route, every page, every user journey — mapped before code. Three applications (public, admin, portal) plus authentication.
**Why:** Building pages without a route map leads to inconsistent navigation, missing pages, and broken user flows. The sitemap is the blueprint for the App Router structure.
**Action:** Generate from project requirements. Every route includes what content appears on that page.

**Required Sections:**
1. **Three Applications Overview** — URL patterns for public, admin, portal, login
2. **Public Website** — Route tree with page content descriptions (hero, services, portfolio, about, intake, confirmation)
3. **Admin Dashboard** — Sidebar navigation diagram + full page map (dashboard, clients, pipeline, projects, proposals, invoices, analytics, settings)
4. **Client Portal** — Sidebar navigation diagram + page map (dashboard, projects, invoices, messages)
5. **Authentication** — Login page with role-based routing logic
6. **Route Protection Summary** — Table: route pattern, auth required, allowed roles, middleware
7. **SEO Pages** — Table: page, title pattern, description (public pages only)

**Updated:** When new routes are added or navigation structure changes.
**Verification:** Every planned route listed, auth requirements documented, SEO metadata planned.

---

### 3.13 DOCUMENT-INDEX.md

**Location:** `docs/DOCUMENT-INDEX.md`
**What:** Master navigation document — "I need to know about X, read this file" lookup table. Session protocol quick reference. Document relationships diagram.
**Why:** AI and humans need fast navigation. As the project grows, finding the right document should never require guessing or scanning multiple files.
**Action:** Generate from all governance and docs files. Include session protocol reference.

**Required Sections:**
1. **Quick Lookup** — "I need to..." → "Read this file" table covering all common needs
2. **Session Protocol** — What to read at start, during, and end of every session
3. **Document Relationships** — How documents connect (which references which)
4. **Document Ownership** — Who updates each file and when
5. **Adding New Documents** — Process for adding to the index when new docs are created

**Updated:** Every time a new document is added to the project.
**Verification:** Every governance and docs file is listed, session protocol present, relationships mapped.

---

### 3.14 AGENT-PERSONAS.md

**Location:** `docs/AGENT-PERSONAS.md`
**What:** Universal SME (Subject Matter Expert) agent library — specialist personas that auto-activate based on task type. Each agent is designed to be the best of the best at one domain.
**Why:** Instead of general-purpose work, Claude activates a specialist persona when the task matches specific triggers. This produces higher quality, more focused output across security, performance, accessibility, testing, DevOps, and more.
**Action:** Generate the complete agent library organized by category. Each agent has domain, triggers, persona, instructions, quality criteria, and anti-patterns.

**Required Sections:**
1. **How This Works** — Auto-activation flow: task → match triggers → load persona → execute → validate
2. **Activation Rules** — Priority, scope, deactivation, multiple agent handling
3. **Agent Categories** — Organized by domain (Security, Performance, Accessibility, Code Quality, Testing, Database, API Design, DevOps, UX/Design, SEO, AI/ML, Business/CRM, Documentation, Content, Client Communication)
4. **Agent Definitions** — Each agent includes: Domain, Triggers, Persona, Instructions, Quality Criteria, Anti-Patterns
5. **Extending the Library** — How to add new agents using the established template

**Minimum agents:** 50+ across 15 categories.
**Updated:** When new specialist domains are needed or agent instructions need refinement.
**Verification:** All categories populated, every agent has all 6 fields, activation rules documented.

---

## Section 4: DevOps & Engineering Standards

These standards apply to every Rosario project and are enforced through the governance files above.

### 4.1 Version Control

| Standard                               | Rule                                                                    |
| -------------------------------------- | ----------------------------------------------------------------------- |
| Every project has a GitHub repository  | Private by default, public only by explicit decision                    |
| Every change is committed with context | `<type>: <description>` format (feat, fix, docs, refactor, test, chore) |
| AI-assisted commits include co-author  | `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`               |
| Never force-push to main               | No exceptions                                                           |
| Never commit secrets                   | .env, credentials, API keys — always in .gitignore                      |
| Test before push                       | All tests pass, build succeeds                                          |
| Atomic commits                         | One logical change per commit                                           |

### 4.2 CI/CD Pipeline

| Stage      | Tool       | What It Checks             | Required Result |
| ---------- | ---------- | -------------------------- | --------------- |
| Lint       | ESLint     | Code style and patterns    | 0 errors        |
| Type Check | TypeScript | Type safety                | 0 errors        |
| Test       | Vitest     | Unit + integration tests   | All passing     |
| Build      | Next.js    | Compilation                | 0 errors        |
| Audit      | pnpm audit | Dependency vulnerabilities | 0 critical      |

Pipeline runs on every push to main and every pull request.

### 4.3 Branching Strategy — Trunk-Based

| Branch      | Purpose               | Rules                                                   |
| ----------- | --------------------- | ------------------------------------------------------- |
| `main`      | Production-ready code | Always deployable, never force-pushed                   |
| `feature/*` | Work in progress      | Short-lived (hours to days, not weeks), merge into main |
| `fix/*`     | Bug fixes             | Same as feature, named for clarity                      |

No `develop` branch. No long-running branches. Merge fast.

### 4.4 Environments

| Environment | Config            | Purpose                | Access         |
| ----------- | ----------------- | ---------------------- | -------------- |
| Local Dev   | `.env.local`      | Developer machine      | Developer only |
| Staging     | `.env.staging`    | Pre-production testing | Team           |
| Production  | `.env.production` | Live system            | Public         |

Rules:
- Never use production credentials in local dev
- Staging mirrors production config with test data
- Environment-specific variables documented in `.env.example`

### 4.5 Deployment (VPS — PM2 + Nginx)

Standard deployment flow:
```
git pull origin main → pnpm install --frozen-lockfile → pnpm build → pm2 restart
```

Full VPS checklist is in the Site Health Plan Section "Deployment Standards."

### 4.6 Code Review

Every change is reviewed against the 8 pillars before commit:
1. Security Minded — Can this be exploited?
2. Structure — Can someone else pick this up tomorrow?
3. Performance — Does this respect the user's time and device?
4. Inclusive — Can everyone use this?
5. Non-Bias — Does this assume or exclude?
6. UX Minded — Does this feel intentional and clear?
7. Universal Design — Does this work for the widest range of people?
8. R3S — What happens when something fails?

### 4.7 DevSecOps

| Practice                | When                | How                                                      |
| ----------------------- | ------------------- | -------------------------------------------------------- |
| Dependency audit        | Every CI run        | `pnpm audit --audit-level=critical`                      |
| Security scan           | Before every deploy | Scan commands from Site Health Plan                      |
| Secret detection        | Every commit        | `.gitignore` coverage, no `NEXT_PUBLIC_` on secret keys  |
| Prohibited pattern scan | Before every deploy | grep for eval, dangerouslySetInnerHTML, any, console.log |
| Dependency monitoring   | Monthly             | Check for new CVEs, EOL dates, abandoned packages        |

### 4.8 Testing

| Type          | Tool                  | When Required                                                        |
| ------------- | --------------------- | -------------------------------------------------------------------- |
| Unit          | Vitest                | From first build session — utilities, validation, scoring            |
| Integration   | Vitest                | From first API route — route handlers, database queries              |
| E2E           | Playwright            | From first user flow — navigation, forms, critical paths             |
| Accessibility | axe-core + Playwright | From first page — WCAG violations on every page                      |
| Security      | Custom Vitest suite   | From first API route — prohibited patterns, auth, field whitelisting |

Coverage targets (from Site Health Plan):
- Utility functions: 90%
- API routes: 80%
- Components: 70%
- Overall: 70%

---

## Section 5: Execution Protocol

Claude executes these steps IN ORDER. Do not skip steps. Do not proceed past a step until its verification passes.

### Step 0: Project Discovery
- Run through Section 0: Concept Discovery (0.1), Stack Selection (0.2), Scope Definition (0.3)
- Claude presents options with trade-offs and recommendations for each stack layer
- Bas makes the final call on every decision
- Present the Discovery Gate — all three outputs confirmed before proceeding
- Discovery outputs become the foundation for every file created after this step

### Step 1: Satisfy Prerequisites
- Run through all 10 prerequisites from Section 1
- Present the Prerequisites Gate check
- Resolve any FAIL items before continuing

### Step 2: Create Directory Structure
- Create `.claude/` directory
- Create `docs/` directory
- Create `docs/archive/` directory (with `.gitkeep`)
- Create `.github/workflows/` directory

### Step 3: Copy Site Health Plan
- Copy `SITE-HEALTH-PLAN.md` to `.claude/SITE-HEALTH-PLAN.md`
- Verify content matches source

### Step 4: Generate CLAUDE.md
- Create `.claude/CLAUDE.md` with all 10 required sections (see Section 3.2)
- Uses Project Brief, Stack Decision Table, and Scope Summary from Discovery (Step 0)

### Step 5: Initialize HANDOFF.md
- Create `docs/HANDOFF.md` with initial structure (see Section 3.3)
- Uses Project Brief and Scope Summary from Discovery (Step 0)

### Step 6: Create .env.example
- Create `.env.example` based on tech stack (see Section 3.6)
- Verify no real secret values present

### Step 7: Create RAI-POLICY.md (if applicable)
- If project uses AI: create `RAI-POLICY.md` with all 6 sections (see Section 3.8)
- If no AI: skip, document as N/A in audit

### Step 8: Set Up CI/CD
- Create `.github/workflows/ci.yml` (see Section 3.9)
- Verify all pipeline stages present

### Step 9: Create .gitignore
- Create `.gitignore` with full coverage for the tech stack (see Section 3.7)
- Verify no secrets would be exposed

### Step 10: Generate Project Documentation
- Create `docs/DIRECTORY-STRUCTURE.md` — complete file/folder tree (see Section 3.10)
- Create `docs/TESTING-PLAN.md` — testing strategy and coverage (see Section 3.11)
- Create `docs/SITEMAP.md` — all routes, pages, and navigation (see Section 3.12)
- Create `docs/DOCUMENT-INDEX.md` — master navigation index (see Section 3.13)
- Create `docs/AGENT-PERSONAS.md` — SME agent library (see Section 3.14)
- All 5 docs generated from project requirements and Site Health Plan standards
- **Plan SEO foundation (see Section 6)** — document title patterns, OG approach, structured data schemas, and technical SEO decisions in HANDOFF.md. Web projects only.

### Step 11: Initialize AUDIT.md
- Create `AUDIT.md` with Pre-Build Readiness template (see Section 3.4)
- This step is LAST because it audits everything created in Steps 1-10

### Step 12: Run Pre-Build Readiness Audit
- Score all 13 dimensions (see Section 7)
- Populate AUDIT.md Section 1 with actual scores
- Present the Readiness Gate to Bas

---

## Section 6: SEO Foundation

Before the first page is built, SEO infrastructure must be planned. Retrofitting SEO is expensive and error-prone — title patterns, structured data, and technical SEO are architectural decisions that affect routing, metadata, and component structure. Plan once at setup, enforce during build.

### 6.1 Meta Tags Strategy

Every public page needs a title and description. Define patterns during setup, not per-page as an afterthought.

**Required for every public page:**

| Tag                | Pattern                                         | Example                                          |
| ------------------ | ----------------------------------------------- | ------------------------------------------------ |
| `<title>`          | `{Page Title} - {Brand}`                        | `Web Development Services - BuiltByBas`          |
| `meta description` | 120-160 chars, primary keyword, unique per page | `Custom web development for small businesses...` |
| `canonical`        | Self-referencing absolute URL                   | `https://builtbybas.com/services`                |
| `viewport`         | `width=device-width, initial-scale=1`           | Standard responsive                              |

**Implementation:** Use the framework's metadata API (e.g., Next.js `generateMetadata` or `metadata` export) — never raw `<meta>` tags in `<head>`.

### 6.2 Open Graph & Social Media

Every public page must render correctly when shared on social platforms.

**Required tags:**

| Tag              | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| `og:title`       | Social share title (can differ from `<title>`) |
| `og:description` | Social share description                       |
| `og:image`       | Share image (1200x630px minimum)               |
| `og:url`         | Canonical URL                                  |
| `og:type`        | `website` (home) or `article` (content pages)  |
| `og:site_name`   | Brand name                                     |
| `twitter:card`   | `summary_large_image`                          |

**Decision at setup:** Does the project need dynamic OG images (generated per page) or static OG images? Document in HANDOFF.md.

### 6.3 Structured Data (JSON-LD)

Search engines use structured data to understand content and display rich results.

**Minimum for any business site:**

| Schema Type      | Where                         | Purpose                                    |
| ---------------- | ----------------------------- | ------------------------------------------ |
| `Organization`   | Layout (all pages)            | Business name, logo, contact, social links |
| `WebSite`        | Home page                     | Site name, search action (if applicable)   |
| `BreadcrumbList` | All pages with breadcrumbs    | Navigation path for search results         |
| `LocalBusiness`  | About/Contact (if applicable) | Address, hours, phone                      |

**Additional schemas based on project type:** `Service`, `Product`, `FAQ`, `Article`, `Person`, `SoftwareApplication`.

**Implementation:** JSON-LD `<script>` tags in page components, validated against schema.org.

### 6.4 Technical SEO

These files and configurations must exist before launch.

| Asset           | Location         | Purpose                                  | Generation              |
| --------------- | ---------------- | ---------------------------------------- | ----------------------- |
| `sitemap.xml`   | `/sitemap.xml`   | All crawlable URLs for search engines    | Dynamic (framework API) |
| `robots.txt`    | `/robots.txt`    | Crawl directives — allow/disallow paths  | Static or dynamic       |
| `favicon`       | `/favicon.ico`   | Brand icon in browser tabs and bookmarks | Static                  |
| `manifest.json` | `/manifest.json` | PWA metadata (optional)                  | Static                  |

**robots.txt rules:**
- Allow: all public pages
- Disallow: admin routes, portal routes, API routes, any authenticated paths
- Sitemap: absolute URL to sitemap.xml

**Sitemap rules:**
- Include all public pages with `lastmod`, `changefreq`, and `priority`
- Exclude authenticated routes, API routes, and utility pages
- Regenerate on content changes

### 6.5 Core Web Vitals Targets

Google uses Core Web Vitals as ranking signals. Define targets during setup, measure during development.

| Metric  | Target  | What It Measures                                          |
| ------- | ------- | --------------------------------------------------------- |
| **LCP** | < 2.5s  | Loading — how fast main content appears                   |
| **INP** | < 200ms | Interactivity — how fast the page responds to user input  |
| **CLS** | < 0.1   | Visual stability — how much the layout shifts during load |

**Architectural decisions that affect CWV:**
- Font loading strategy (preload, `font-display: swap`)
- Image optimization (framework image component, WebP/AVIF, responsive sizes)
- Above-the-fold content rendering (server-side, no client-side fetch for initial view)
- Third-party script loading (defer/async, no render-blocking)

### 6.6 SEO Setup Checklist

During project setup, Claude documents these decisions in HANDOFF.md:

- [ ] Title pattern defined (e.g., `{Page} | {Brand}`)
- [ ] Meta description strategy (unique per page, keyword-focused)
- [ ] OG image approach decided (static vs. dynamic)
- [ ] Structured data schemas identified (Organization + project-specific)
- [ ] robots.txt rules planned (allow/disallow paths)
- [ ] sitemap.xml generation strategy (static vs. dynamic)
- [ ] Core Web Vitals targets confirmed
- [ ] Font loading strategy decided
- [ ] Image optimization approach confirmed
- [ ] Analytics/tracking planned (if applicable)

**Verification:** SEO decisions documented in HANDOFF.md, technical SEO files planned, CWV targets set.

---

## Section 7: Pre-Build Readiness Audit

After all files are created, Claude scores the project setup. This is recorded in AUDIT.md Section 1.

### Scoring Rubrics

**1. Prerequisites Satisfied (/10)**
- 10: All 10 prerequisites PASS
- 8: 8-9 prerequisites PASS, remaining are non-blocking
- 6: 7 prerequisites PASS
- <6: More than 3 failures

**2. Governance Files (/10)**
- 10: All 14 files/directories exist, properly located, properly structured
- 8: All files exist, minor structural gaps in 1-2 documents
- 6: 1-2 files missing or significantly incomplete
- <6: 3+ files missing

**3. Standards Integration (/10)**
- 10: Site Health Plan copied, CLAUDE.md references all 8 pillars with universal + tech-specific rules
- 8: Copied, pillars referenced but some tech-specific rules missing
- 6: Copied but pillar coverage incomplete
- <6: Not copied or pillar framework missing

**4. Session Protocol (/10)**
- 10: Complete start/during/end protocol in CLAUDE.md, required reading table defined
- 8: Protocol present but missing one phase
- 6: Present but vague
- <6: Not defined

**5. Project Definition (/10)**
- 10: Business concept clear, tech stack locked, decisions documented, gaps identified
- 8: Concept and stack documented, some decisions pending
- 6: Basic concept present but major gaps
- <6: Concept unclear or undocumented

**6. Security Posture (/10)**
- 10: .gitignore comprehensive, .env.example present with no real values, prohibited actions documented, no secrets in any tracked file
- 8: Minor gaps in .gitignore
- 6: .gitignore present but incomplete, or .env.example missing
- <6: Secrets could be committed

**7. Archive Readiness (/10)**
- 10: docs/archive/ exists, archival rules in CLAUDE.md, ~750 line threshold stated
- 8: Directory exists, rules partially documented
- 6: Directory exists but no rules
- <6: Not created

**8. Git & VCS Configuration (/10)**
- 10: Repo initialized, remote configured, branching strategy documented, commit conventions defined
- 8: Repo and remote configured, conventions partially documented
- 6: Repo initialized but missing remote or conventions
- <6: No repo

**9. CI/CD Pipeline (/10)**
- 10: Workflow file exists with all 5 stages (lint, type-check, test, build, audit)
- 8: Workflow exists with 4 stages
- 6: Workflow exists but missing key stages
- <6: No workflow file

**10. DevOps Readiness (/10)**
- 10: Environments defined, deployment strategy documented, DevSecOps practices in CI, testing plan documented
- 8: Most DevOps concerns addressed, 1-2 gaps
- 6: Partial coverage
- <6: DevOps not addressed

**11. RAI Compliance (/10 or N/A)**
- 10: RAI-POLICY.md present with all 6 sections, every AI feature has a human review gate
- 8: Present but 1-2 sections thin
- 6: Present but significant gaps
- <6: Missing for an AI project
- N/A: Project does not use AI (excluded from average)

**12. Handoff Quality (/10)**
- 10: Business concept clear, TOC present, status line accurate, decisions and gaps documented
- 8: All sections present but thin in places
- 6: Basic structure but missing key context
- <6: Absent or empty

**13. SEO Foundation (/10 or N/A)**
- 10: Title pattern defined, OG approach decided, structured data schemas identified, technical SEO (robots.txt, sitemap.xml) planned, CWV targets set, all documented in HANDOFF.md
- 8: Most SEO decisions documented, 1-2 areas deferred
- 6: Basic meta strategy defined but technical SEO or structured data missing
- <6: No SEO planning done for a web project
- N/A: Project is not a public-facing web application (excluded from average)

---

### Readiness Gate

**PASS:** Overall >= 9/10 AND no dimension below 7/10
Claude says: **"We are ready to start."**

**CONDITIONAL PASS:** Overall >= 8/10 AND no dimension below 6/10
Claude says: "Setup is complete with noted gaps: [lists gaps]. Confirm we should proceed, or I'll address the gaps first."

**FAIL:** Overall < 8/10 OR any dimension below 6/10
Claude says: "Setup is not complete. [Lists failures]. I'll fix these before we proceed."

---

## Section 8: Post-Setup Transition

Once the Readiness Gate passes:

**1. AUDIT.md Transitions**
The Pre-Build Readiness dashboard stays in the Audit History. After the FIRST build session, Claude creates the standard 14-dimension Health Dashboard from the Site Health Plan as Section 1, moving Pre-Build to history.

**2. HANDOFF.md Becomes Primary**
Every session starts by reading it. The setup protocol is done; the session protocol takes over.

**3. PROJECT-SETUP.md Stays Permanently**
It is a founding document — a record of how the project was initialized. Not read every session, but available for reference.

**4. First Commit**
After "We are ready to start," the first commit is:
```
chore: initialize project governance structure

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

This commits all governance files as the project's founding commit.

**5. Session Protocol Activates**
From the first build session forward:
- Start: Read HANDOFF.md → check AUDIT.md → run tests → confirm understanding
- During: Mark progress, note issues, test before and after
- End: Update HANDOFF.md → update AUDIT.md → run tests → recommend next steps

---

## Section 9: Quick-Start Checklist

For experienced use — once you have run this protocol a few times:

- [ ] Drop PROJECT-SETUP.md into new project directory
- [ ] Tell Claude: "Set up this project" + provide project name and initial concept
- [ ] Project Discovery: Claude presents stack options with trade-offs, Bas decides — Project Brief + Stack Table + Scope Summary confirmed
- [ ] Prerequisites: git, GitHub repo, Node, pnpm, DB decision, hosting, CI/CD, branching, environments, containerization, DevSecOps
- [ ] Claude creates: .gitignore, .claude/, docs/, docs/archive/, .github/workflows/
- [ ] Claude copies: SITE-HEALTH-PLAN.md to .claude/
- [ ] Claude generates: CLAUDE.md (10 sections), HANDOFF.md, .env.example, ci.yml
- [ ] Claude generates: RAI-POLICY.md (if AI project)
- [ ] Claude generates: DIRECTORY-STRUCTURE.md, TESTING-PLAN.md, SITEMAP.md, DOCUMENT-INDEX.md, AGENT-PERSONAS.md
- [ ] Claude plans: SEO foundation — title pattern, OG approach, structured data, technical SEO (Section 6, web projects only)
- [ ] Claude generates: AUDIT.md with Pre-Build Readiness scoring
- [ ] Claude runs: Pre-Build Readiness Audit (13 dimensions)
- [ ] Score >= 9/10, no dimension below 7 = **"We are ready to start."**
- [ ] First commit: `chore: initialize project governance structure`

---

## Section 10: Why This Protocol Exists

| Project       | What Happened                                                                                                               | What This Prevents                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| KAR           | Audit created after 7 build phases. Found CRITICAL SQL injection in `createClient()` and `updateClient()`. 11 issues total. | Audit created AT SETUP. Security posture scored before first line of code.     |
| KAR           | Archive pattern created retroactively. HANDOFF.md grew unwieldy.                                                            | `docs/archive/` created at setup. Rules documented from day one.               |
| KAR           | No authentication at all — single-user local app with no auth check on any route.                                           | Auth decision documented in prerequisites. Architecture planned before code.   |
| KAR           | SQLite chosen for what eventually needed multi-user access.                                                                 | Database decision is a prerequisite, documented with justification.            |
| Cross-project | 6 pillars evolved to 8 pillars. Some projects still referenced old count.                                                   | CLAUDE.md generated from current Site Health Plan, not from memory.            |
| Cross-project | Session protocol inconsistently followed.                                                                                   | Protocol embedded in CLAUDE.md Section 3, read automatically every session.    |
| Cross-project | No CI/CD — quality gates were manual and sometimes skipped.                                                                 | GitHub Actions pipeline created at setup, runs on every push.                  |
| General       | "We'll add tests later" means tests never get added.                                                                        | Testing infrastructure set up at setup. Coverage targets defined from day one. |

**The 7 P's: Proper Prior Planning Prevents Piss Poor Performance.**

This protocol is the planning. Everything after this is performance.

---

*This document is a Rosario Project Standard. Update it when patterns are confirmed across multiple projects. Delete anything that proves wrong.*
