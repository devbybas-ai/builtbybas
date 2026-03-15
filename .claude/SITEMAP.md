# BuiltByBas — Site Map & Navigation

> Every route. Every page. Every user journey. Mapped before code.

---

## Three Applications, One Domain

```
builtbybas.com/                 → Public website (no auth)
builtbybas.com/admin/           → Admin dashboard (owner/team auth)
builtbybas.com/portal/          → Client portal (client auth)
builtbybas.com/login            → Shared login (routes to admin or portal by role)
```

---

## Public Website — builtbybas.com

No authentication required. SEO-optimized. The storefront.

```
/                               Homepage
├── Hero — animated, glassmorphism, electric cyan glow
├── Services preview — 3 cards (software, web, marketing)
├── Portfolio highlights — 3 featured case studies
├── Social proof — testimonial carousel
├── CTA — "Tell us about your project" → /intake
└── Footer — links, contact, social

/services                       Services Showcase
├── Software Development — custom apps, APIs, automation
├── Web Development — websites, redesigns, e-commerce
├── Marketing — digital strategy, content, SEO, branding
└── CTA → /intake

/portfolio                      Portfolio Grid
├── Filterable by service type (software / web / marketing / all)
├── Cards: thumbnail, title, service type, tech stack badges
└── Click → /portfolio/[slug]

/portfolio/[slug]               Case Study Detail
├── Challenge — what the client needed
├── Solution — what we built and how
├── Results — outcomes, metrics, impact
├── Tech stack used
├── Testimonial (if available)
└── CTA → /intake

/about                          About BuiltByBas
├── The story — who Bas is, why BuiltByBas exists
├── Mission and values
├── The #OneTeam approach (human + AI partnership)
├── What makes us different
└── CTA → /intake

/intake                         Client Intake Form
├── 10-section multi-step form with progress bar
│   ├── 1. Business Overview
│   ├── 2. Current Digital Presence
│   ├── 3. Service Interest
│   ├── 4. Project Scope
│   ├── 5. Goals & Pain Points
│   ├── 6. Technical Requirements
│   ├── 7. Brand & Design
│   ├── 8. Content & Marketing
│   ├── 9. Decision Making
│   └── 10. How They Found Us
├── Review step — see all answers before submitting
└── Submit → /intake/confirmation

/intake/confirmation            Confirmation Page
├── Thank you message
├── What happens next (timeline expectations)
├── Contact info for questions
└── Link back to homepage
```

---

## Admin Dashboard — builtbybas.com/admin

Protected. Requires login with owner or team role.

### Navigation (Sidebar)

```
┌─────────────────────────────┐
│  BuiltByBas                 │
│  ─────────────────────────  │
│                             │
│  📊 Dashboard         /admin│
│  👥 Clients    /admin/clients│
│  📋 Pipeline  /admin/pipeline│
│  📁 Projects  /admin/projects│
│  📄 Proposals /admin/proposals│
│  💰 Invoices  /admin/invoices│
│  📈 Analytics /admin/analytics│
│                             │
│  ─────────────────────────  │
│  ⚙️  Settings /admin/settings│
│  🚪 Logout                  │
└─────────────────────────────┘
```

### Page Map

```
/admin                          Dashboard
├── KPI cards: total clients, active projects, monthly revenue, conversion rate
├── Pipeline overview — clients per stage (mini bar chart)
├── Upcoming deadlines — next 7 days
├── Overdue follow-ups — needs attention
├── Recent activity feed — last 10 actions
└── Quick actions: + New Client, + New Project

/admin/clients                  Client List
├── Search bar (name, business, email)
├── Filters: status, stage, service type, date range
├── Table: name, business, stage, service type, created date
├── Click row → /admin/clients/[id]
└── + New Client → /admin/clients/new

/admin/clients/new              New Client Form
├── Quick-add mode (name, email, service interest)
└── Full intake mode (all 10 sections)

/admin/clients/[id]             Client Detail
├── Header: name, business, stage badge, contact info
├── Tabs:
│   ├── Intake Summary — all 10 sections displayed
│   ├── Fit Assessment — scores, archetype, flags, accept/decline
│   ├── Projects — linked projects for this client
│   ├── Notes — timeline of all notes (filterable by type)
│   └── Activity — full history of actions on this client
├── Actions: advance stage, add note, create project, edit, archive
└── Sidebar: quick stats (total projects, revenue, last contact)

/admin/pipeline                 Pipeline (Kanban)
├── 12 columns (one per stage)
├── Client cards: name, business, service type, days in stage
├── Drag-and-drop between stages (auto-timestamps)
├── Filters: service type, date range
└── Click card → /admin/clients/[id]

/admin/projects                 All Projects
├── Table: project name, client, type, status, budget, deadline
├── Filters: service type, status, client, date range
├── Click row → /admin/projects/[id]
└── + New Project

/admin/projects/[id]            Project Detail
├── Header: project name, client link, type badge, status
├── Tabs:
│   ├── Overview — scope, timeline, budget, milestones
│   ├── Deliverables — tracker with status workflow per item
│   ├── Notes — project-specific annotations
│   ├── Checklist — stage-specific task list
│   └── Timeline — milestone visualization
├── Actions: update status, add deliverable, add note, link proposal
└── Budget widget: quoted vs actual

/admin/proposals                Proposal List
├── Table: client, project, version, status, sent date
├── Filters: status (draft/sent/accepted/declined)
├── Click row → /admin/proposals/[id]
└── + New Proposal

/admin/proposals/[id]           Proposal Editor
├── Client info sidebar
├── Section editor:
│   ├── Executive summary (AI-generated, editable)
│   ├── Scope of work (AI-generated, editable)
│   ├── Timeline and milestones
│   ├── Pricing and payment terms
│   └── Terms and conditions
├── AI actions: Generate draft, Regenerate section, Refine
├── Human review gate: "I have reviewed this proposal"
├── Actions: save draft, send to client, export PDF
└── Version history

/admin/invoices                 Invoice List
├── Table: invoice #, client, amount, status, due date
├── Filters: status (draft/sent/paid/overdue), date range
├── Click row → /admin/invoices/[id]
└── + New Invoice

/admin/invoices/[id]            Invoice Detail/Editor
├── Invoice header: number, date, due date, client info
├── Line items editor (add/remove/edit)
├── AI action: generate descriptions from deliverables
├── Totals: subtotal, tax, total
├── Actions: save draft, send, mark paid, export PDF
└── Payment history

/admin/analytics                Analytics Dashboard
├── Revenue: monthly chart, by service type, by client
├── Conversion funnel: lead → intake → proposal → contract → delivery
├── Project metrics: avg value, avg duration, on-time rate
├── Client metrics: total, active, retention rate
└── Date range selector

/admin/settings                 Settings
├── Profile (name, email, password change)
├── Notification preferences
├── Invoice defaults (payment terms, tax rate, company info)
└── Team management (future — add/manage team members)
```

---

## Client Portal — builtbybas.com/portal

Protected. Requires login with client role. Scoped to their own data only.

### Navigation (Sidebar)

```
┌─────────────────────────────┐
│  BuiltByBas Portal          │
│  ─────────────────────────  │
│                             │
│  🏠 My Projects      /portal│
│  💰 Invoices  /portal/invoices│
│  💬 Messages  /portal/messages│
│                             │
│  ─────────────────────────  │
│  🚪 Logout                  │
└─────────────────────────────┘
```

### Page Map

```
/portal                         Client Dashboard
├── Welcome header: client name, business name
├── Active projects: status cards with progress indicators
├── Recent updates: last 5 changes to their projects
└── Unread messages indicator

/portal/projects/[id]           Project Status
├── Project name and type
├── Current stage indicator (visual progress bar)
├── Deliverables: status of each item, download when complete
├── Timeline: milestones with dates
└── Read-only — clients view, not edit

/portal/invoices                Invoice List
├── Table: invoice #, amount, status, due date
├── Status badges: paid (green), sent (blue), overdue (red)
└── Click row for detail view (read-only)

/portal/messages                Messages
├── Threaded conversation with BuiltByBas
├── Send new message
├── Read/unread indicators
└── Newest first
```

---

## Authentication — builtbybas.com/login

```
/login                          Login Page
├── Email + password form
├── Rate limited (5 attempts / 15 min / IP)
├── On success:
│   ├── owner/team role → redirect to /admin
│   └── client role → redirect to /portal
├── On failure:
│   └── Generic error "Invalid email or password"
└── Forgot password (future enhancement)
```

---

## Route Protection Summary

| Route Pattern       | Auth Required | Allowed Roles | Middleware                                            |
| ------------------- | ------------- | ------------- | ----------------------------------------------------- |
| `/`                 | No            | Public        | None                                                  |
| `/services`         | No            | Public        | None                                                  |
| `/portfolio/**`     | No            | Public        | None                                                  |
| `/about`            | No            | Public        | None                                                  |
| `/intake/**`        | No            | Public        | None                                                  |
| `/login`            | No            | Public        | Redirect if already logged in                         |
| `/admin/**`         | Yes           | owner, team   | `verifyApiRequest()` + role check                     |
| `/portal/**`        | Yes           | client        | `verifyApiRequest()` + role check + row-level scoping |
| `/api/intake`       | No            | Public        | Zod validation only                                   |
| `/api/auth/**`      | No            | Public        | Rate limiting on login                                |
| `/api/clients/**`   | Yes           | owner, team   | Auth + Zod + field whitelisting                       |
| `/api/projects/**`  | Yes           | owner, team   | Auth + Zod + field whitelisting                       |
| `/api/proposals/**` | Yes           | owner, team   | Auth + Zod                                            |
| `/api/invoices/**`  | Yes           | owner, team   | Auth + Zod                                            |
| `/api/analytics/**` | Yes           | owner, team   | Auth                                                  |
| `/api/portal/**`    | Yes           | client        | Auth + row-level scoping                              |

---

## SEO Pages (Public Website Only)

| Page                | Title Pattern                                    | Description                                          |
| ------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| `/`                 | BuiltByBas — Software, Web & Marketing Solutions | Custom digital solutions for your business           |
| `/services`         | Services — BuiltByBas                            | Software development, web development, and marketing |
| `/portfolio`        | Portfolio — BuiltByBas                           | See what we've built                                 |
| `/portfolio/[slug]` | [Project Name] — BuiltByBas                      | Case study detail                                    |
| `/about`            | About — BuiltByBas                               | The story behind BuiltByBas                          |
| `/intake`           | Get Started — BuiltByBas                         | Tell us about your project                           |

Each page has: meta title, meta description, OG image, OG title, OG description, JSON-LD structured data.
