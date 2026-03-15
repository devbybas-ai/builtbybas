# BuiltByBas — Project Directory Structure

> Every file has a home. Every directory has a purpose.
> If a file doesn't fit the structure, the structure evolves — not the file.

---

## Root

```
builtbybas/
├── .claude/                    # Claude Code governance
│   ├── CLAUDE.md               # Project identity, 8 pillars, session protocol
│   └── SITE-HEALTH-PLAN.md     # Source of truth for all standards
│
├── .github/
│   └── workflows/
│       └── ci.yml              # CI pipeline (lint → type-check → test → build → audit)
│
├── docs/                       # Project documentation (non-code)
│   ├── HANDOFF.md              # Master context — updated every session
│   ├── DIRECTORY-STRUCTURE.md  # This file
│   ├── TESTING-PLAN.md         # Testing strategy and coverage targets
│   ├── SITEMAP.md              # Navigation structure and route map
│   └── archive/                # Archived HANDOFF sections (append-only)
│       └── completedscope.md   # Completed build phases
│
├── public/                     # Static assets served as-is
│   ├── fonts/                  # Self-hosted font files
│   ├── images/                 # Static images (logos, icons, OG images)
│   └── favicon.ico
│
├── src/                        # All application source code
│   ├── app/                    # Next.js App Router (pages + API routes)
│   ├── components/             # React components
│   ├── lib/                    # Shared utilities, config, core logic
│   ├── data/                   # Static fallback data + seed files
│   ├── styles/                 # Global styles and design tokens
│   └── types/                  # Shared TypeScript type definitions
│
├── tests/                      # Test files (mirrors src/ structure)
│   ├── unit/                   # Unit tests (Vitest)
│   ├── integration/            # Integration tests (Vitest)
│   ├── e2e/                    # End-to-end tests (Playwright)
│   └── security/               # Security test suite (Vitest)
│
├── AUDIT.md                    # Health dashboard, issues tracker, tech debt
├── RAI-POLICY.md               # Responsible AI governance
├── PROJECT-SETUP.md            # Founding setup protocol (permanent record)
├── SITE-HEALTH-PLAN.md         # Master standards (source copy)
├── .env.example                # Environment variable template
├── .gitignore                  # Git exclusions
├── .markdownlint.json          # Markdown lint suppression
├── next.config.ts              # Next.js configuration + security headers
├── tailwind.config.ts          # Tailwind CSS configuration + design tokens
├── tsconfig.json               # TypeScript strict mode configuration
├── package.json                # Dependencies and scripts
├── pnpm-lock.yaml              # Locked dependency tree
├── vitest.config.ts            # Vitest test configuration
├── playwright.config.ts        # Playwright E2E configuration
└── postcss.config.js           # PostCSS (required by Tailwind)
```

---

## src/app/ — Next.js App Router (Pages + API)

```
src/app/
├── layout.tsx                  # Root layout (html, body, fonts, providers)
├── page.tsx                    # Homepage — hero, services preview, CTA
├── globals.css                 # Global styles, CSS variables, Tailwind imports
│
├── (public)/                   # Route group — public website (no auth)
│   ├── services/
│   │   └── page.tsx            # Services showcase
│   ├── portfolio/
│   │   ├── page.tsx            # Portfolio grid (filterable)
│   │   └── [slug]/
│   │       └── page.tsx        # Individual case study
│   ├── about/
│   │   └── page.tsx            # About BuiltByBas
│   ├── intake/
│   │   └── page.tsx            # Full 10-section intake form
│   └── intake/confirmation/
│       └── page.tsx            # Post-submission confirmation
│
├── (auth)/                     # Route group — authentication pages
│   ├── login/
│   │   └── page.tsx            # Login page (admin + client)
│   └── layout.tsx              # Auth layout (centered, minimal)
│
├── admin/                      # Admin dashboard (protected — owner/team role)
│   ├── layout.tsx              # Admin layout (sidebar, header, content area)
│   ├── page.tsx                # Dashboard — KPIs, pipeline overview, tasks
│   ├── clients/
│   │   ├── page.tsx            # Client list (search, filter)
│   │   ├── new/
│   │   │   └── page.tsx        # New client form
│   │   └── [id]/
│   │       └── page.tsx        # Client detail (tabbed: intake, fit, projects, notes)
│   ├── pipeline/
│   │   └── page.tsx            # Kanban board — 12 stages
│   ├── projects/
│   │   ├── page.tsx            # All projects list
│   │   └── [id]/
│   │       └── page.tsx        # Project detail (deliverables, timeline, notes)
│   ├── proposals/
│   │   ├── page.tsx            # Proposals list
│   │   └── [id]/
│   │       └── page.tsx        # Proposal editor (AI-assisted)
│   ├── invoices/
│   │   ├── page.tsx            # Invoices list
│   │   └── [id]/
│   │       └── page.tsx        # Invoice detail / editor
│   ├── analytics/
│   │   └── page.tsx            # Revenue, conversion, satisfaction metrics
│   └── settings/
│       └── page.tsx            # Admin settings, profile, preferences
│
├── portal/                     # Client portal (protected — client role)
│   ├── layout.tsx              # Portal layout (simpler than admin)
│   ├── page.tsx                # Client dashboard — their projects overview
│   ├── projects/
│   │   └── [id]/
│   │       └── page.tsx        # Project status, deliverables, timeline
│   ├── invoices/
│   │   └── page.tsx            # Their invoices and payment status
│   └── messages/
│       └── page.tsx            # Communication thread with BuiltByBas
│
└── api/                        # API routes (server-side only)
    ├── auth/
    │   ├── login/route.ts      # POST — authenticate, set session cookie
    │   ├── logout/route.ts     # POST — clear session
    │   └── session/route.ts    # GET — validate current session
    ├── clients/
    │   ├── route.ts            # GET (list/search), POST (create)
    │   └── [id]/
    │       ├── route.ts        # GET, PUT, DELETE
    │       ├── notes/route.ts  # GET, POST, DELETE
    │       ├── fit-assessment/route.ts  # GET, PUT
    │       └── stage/route.ts  # PUT (advance stage)
    ├── projects/
    │   ├── route.ts            # GET (list), POST (create)
    │   └── [id]/
    │       ├── route.ts        # GET, PUT, DELETE
    │       ├── deliverables/route.ts   # GET, PUT
    │       ├── notes/route.ts  # GET, POST
    │       └── checklist/route.ts      # GET, POST
    ├── proposals/
    │   ├── route.ts            # GET (list), POST (create)
    │   └── [id]/
    │       ├── route.ts        # GET, PUT
    │       └── generate/route.ts       # POST — AI proposal generation
    ├── invoices/
    │   ├── route.ts            # GET (list), POST (create)
    │   └── [id]/
    │       └── route.ts        # GET, PUT
    ├── analytics/
    │   └── route.ts            # GET — revenue, funnel, metrics
    ├── intake/
    │   └── route.ts            # POST — public intake form submission
    └── portal/
        ├── projects/route.ts   # GET — client's own projects
        ├── invoices/route.ts   # GET — client's own invoices
        └── messages/route.ts   # GET, POST — client communication
```

---

## src/components/ — React Components

```
src/components/
├── ui/                         # shadcn/ui base components (generated)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── badge.tsx
│   ├── dropdown-menu.tsx
│   ├── select.tsx
│   ├── textarea.tsx
│   ├── toast.tsx
│   └── ...                     # Other shadcn/ui primitives as needed
│
├── shared/                     # Shared custom components (used across app)
│   ├── GlassCard.tsx           # Glassmorphism card (core design element)
│   ├── NeonButton.tsx          # Branded button with glow effect
│   ├── StatusBadge.tsx         # Pipeline stage / status indicator
│   ├── LoadingSpinner.tsx      # Loading state
│   ├── ErrorBoundary.tsx       # React error boundary
│   ├── EmptyState.tsx          # "No data" display
│   ├── ConfirmDialog.tsx       # Two-step delete/destructive confirmation
│   ├── SearchInput.tsx         # Search with debounce
│   ├── Pagination.tsx          # Paginated list controls
│   └── SkipToContent.tsx       # Accessibility — skip link (WCAG)
│
├── layout/                     # Layout components
│   ├── AdminSidebar.tsx        # Admin dashboard sidebar navigation
│   ├── AdminHeader.tsx         # Admin top bar (user, search, notifications)
│   ├── PortalSidebar.tsx       # Client portal sidebar
│   ├── PublicHeader.tsx        # Public website header/nav
│   ├── PublicFooter.tsx        # Public website footer
│   └── ThemeProvider.tsx       # Dark mode / theme context
│
├── forms/                      # Form components
│   ├── IntakeForm.tsx          # 10-section multi-step intake form
│   ├── IntakeFormStep.tsx      # Individual step wrapper
│   ├── ClientForm.tsx          # Admin client creation/edit
│   ├── ProjectForm.tsx         # Project creation/edit
│   ├── ProposalEditor.tsx      # Proposal content editor
│   ├── InvoiceEditor.tsx       # Invoice line items editor
│   ├── LoginForm.tsx           # Authentication form
│   └── NoteForm.tsx            # Quick note creation
│
├── dashboard/                  # Admin dashboard widgets
│   ├── KPICard.tsx             # Single metric card with sparkline
│   ├── PipelineOverview.tsx    # Pipeline stage counts
│   ├── RevenueChart.tsx        # Revenue visualization
│   ├── UpcomingTasks.tsx       # Deadlines and follow-ups
│   ├── RecentActivity.tsx      # Activity feed
│   └── ConversionFunnel.tsx    # Lead-to-client funnel
│
├── pipeline/                   # Pipeline-specific components
│   ├── KanbanBoard.tsx         # Drag-and-drop kanban
│   ├── KanbanColumn.tsx        # Single stage column
│   ├── KanbanCard.tsx          # Client card in pipeline
│   └── StageChecklist.tsx      # Per-stage task checklist
│
├── clients/                    # Client-specific components
│   ├── ClientList.tsx          # Searchable client table
│   ├── ClientDetail.tsx        # Tabbed client view
│   ├── IntakeSummary.tsx       # Intake data display
│   ├── FitAssessment.tsx       # Scoring display + accept/decline
│   ├── ClientNotes.tsx         # Notes timeline
│   └── ClientProjects.tsx      # Projects for this client
│
├── projects/                   # Project-specific components
│   ├── ProjectList.tsx         # Project table
│   ├── ProjectDetail.tsx       # Tabbed project view
│   ├── DeliverableTracker.tsx  # Deliverable status cards
│   ├── ProjectTimeline.tsx     # Milestone timeline
│   └── ProjectNotes.tsx        # Project notes
│
├── portal/                     # Client portal components
│   ├── PortalDashboard.tsx     # Client's project overview
│   ├── PortalProjectView.tsx   # Read-only project status
│   ├── PortalInvoices.tsx      # Invoice list and status
│   └── PortalMessages.tsx      # Message thread
│
└── public-site/                # Public website sections
    ├── Hero.tsx                # Animated hero with glassmorphism
    ├── ServiceCard.tsx         # Service showcase card
    ├── PortfolioGrid.tsx       # Filterable portfolio display
    ├── PortfolioItem.tsx       # Individual portfolio card
    ├── CaseStudy.tsx           # Full case study layout
    ├── AboutSection.tsx        # About BuiltByBas content
    ├── CTASection.tsx          # Call-to-action block
    └── TestimonialCard.tsx     # Client testimonial display
```

---

## src/lib/ — Shared Utilities and Core Logic

```
src/lib/
├── db.ts                       # PostgreSQL connection (singleton)
├── schema.ts                   # CREATE TABLE SQL / migration definitions
├── migrate.ts                  # Database migration runner
├── auth.ts                     # Session management (create, verify, destroy)
├── middleware.ts                # Auth middleware (role-based route protection)
├── validation.ts               # Zod schemas for all API inputs
├── sanitize.ts                 # Input sanitization (HTML escape, type coercion)
├── scoring.ts                  # Lead scoring / fit assessment engine
├── stages.ts                   # Pipeline stages, colors, checklists
├── ai/
│   ├── proposals.ts            # AI proposal generation prompts + logic
│   ├── estimates.ts            # AI project estimation
│   ├── content.ts              # AI content generation for marketing clients
│   ├── insights.ts             # AI client insights analysis
│   └── followups.ts            # AI follow-up suggestions
├── invoicing.ts                # Invoice generation, numbering, calculations
├── export.ts                   # Data export (JSON, CSV, PDF)
└── constants.ts                # App-wide constants (service types, deliverable types)
```

---

## src/data/ — Static Fallback Data

```
src/data/
├── services.ts                 # Service type definitions and descriptions
├── deliverable-templates.ts    # Per-service-type deliverable templates
├── intake-questions.ts         # 10-section intake form question definitions
├── pipeline-stages.ts          # Stage definitions with colors and checklists
├── portfolio-fallback.ts       # Static portfolio items (if DB is down)
└── scoring-rules.ts            # Fit assessment weights, thresholds, archetypes
```

---

## src/styles/ — Global Styles and Design Tokens

```
src/styles/
├── globals.css                 # CSS variables, Tailwind imports, base styles
├── glass.css                   # Glassmorphism utility classes
└── animations.css              # Shared animations (glow, fade, slide)
```

---

## src/types/ — Shared TypeScript Types

```
src/types/
├── client.ts                   # Client, IntakeResponse types
├── project.ts                  # Project, Deliverable, Milestone types
├── proposal.ts                 # Proposal, ProposalVersion types
├── invoice.ts                  # Invoice, LineItem types
├── pipeline.ts                 # Stage, StageTransition types
├── auth.ts                     # User, Session, Role types
├── api.ts                      # API response wrappers, error types
└── portfolio.ts                # PortfolioItem, CaseStudy types
```

---

## Naming Conventions (from Site Health Plan 2.5)

| Type             | Convention                     | Example                            |
| ---------------- | ------------------------------ | ---------------------------------- |
| Components       | PascalCase                     | `GlassCard.tsx`, `KanbanBoard.tsx` |
| Utilities        | camelCase                      | `sanitize.ts`, `scoring.ts`        |
| Constants        | UPPER_SNAKE_CASE               | `MAX_ATTEMPTS`, `ALLOWED_TYPES`    |
| Types/Interfaces | PascalCase                     | `ClientRow`, `ProposalData`        |
| Directories      | kebab-case                     | `public-site/`, `fit-assessment/`  |
| CSS              | Tailwind classes or kebab-case | `bg-brand-600`, `glass-card`       |
| API routes       | kebab-case URLs                | `/api/clients/[id]/fit-assessment` |

---

## Rules

1. **One component per file** — named export matching filename
2. **No file > 500 lines** — split into focused modules
3. **No dead code** — remove unused imports, commented blocks, legacy shims
4. **Group by feature** — components/clients/, not components/buttons/
5. **Shared goes in shared/** — if 2+ features use it, it's shared
6. **Types co-locate when private** — shared types go in src/types/
7. **Tests mirror source** — `src/lib/scoring.ts` → `tests/unit/lib/scoring.test.ts`
