# CRM Template — BuiltByBas Framework

> **Not a template. A starting point that gets customized for every client.**
> This captures everything we've learned building production CRMs — the architecture,
> patterns, flow, and decisions that work. Every CRM we build starts here, then gets
> shaped to fit the client's business.

---

## 1. Architecture

### Tech Stack (Locked)

| Layer          | Choice                  | Why It Works                                                    |
| -------------- | ----------------------- | --------------------------------------------------------------- |
| Framework      | Next.js (App Router)    | SSR + API routes + auth in one codebase                         |
| Language       | TypeScript (strict)     | Zero `any`, catches bugs at compile time                        |
| Database       | PostgreSQL              | ACID, JSONB flexibility, indexing, real transactions             |
| ORM            | Drizzle                 | Type-safe queries, migration system, lightweight                |
| Validation     | Zod                     | Runtime + compile-time type inference on every input             |
| Auth           | Custom (httpOnly + bcrypt) | Full control, RBAC, no third-party dependency                |
| Styling        | Tailwind CSS            | Utility-first, fast iteration, responsive by default            |
| Components     | shadcn/ui               | Accessible, composable, we own the code                         |
| Testing        | Vitest                  | Fast, TypeScript-native, compatible with our patterns           |

### Project Structure

```
src/
  app/
    api/                    # API routes (one folder per domain)
      clients/              # Client CRUD + convert + stage
      intake/               # Intake submission + status
      pipeline/             # Pipeline view data
      proposals/            # Proposal CRUD + generate + send
      projects/             # Project CRUD
      invoices/             # Invoice CRUD + line items
    admin/                  # Admin dashboard pages
      pipeline/             # Kanban board
      clients/              # Client list + detail
      intake/               # Intake list + analysis
      proposals/            # Proposal list + detail
      projects/             # Project list + detail
      invoices/             # Invoice list + detail
  components/
    admin/                  # Dashboard components
    shared/                 # Reusable glass cards, badges, etc.
  lib/
    schema.ts               # Drizzle schema (all tables)
    db.ts                   # Database connection
    encryption.ts           # AES-256 encrypt/decrypt
    sanitize.ts             # XSS prevention
    api-auth.ts             # requireAdmin() guard
    intake-scoring.ts       # Algorithmic scoring engine
    proposal-generator.ts   # Template-based proposal builder
  types/                    # TypeScript interfaces
  data/                     # Static data (services, questions)
  hooks/                    # React hooks
```

---

## 2. Database Schema

### Core Tables

Every CRM needs these tables. Customize columns per client, but this structure is proven.

#### users

```sql
id            UUID PRIMARY KEY DEFAULT gen_random_uuid()
email         VARCHAR(255) UNIQUE NOT NULL
passwordHash  TEXT NOT NULL
name          VARCHAR(255) NOT NULL
role          ENUM('owner', 'team', 'client') DEFAULT 'team'
createdAt     TIMESTAMP WITH TIME ZONE DEFAULT now()
updatedAt     TIMESTAMP WITH TIME ZONE DEFAULT now()
```

**Pattern**: Owner role = full access. Team = scoped access. Client = portal only.

#### clients

```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
name                  TEXT NOT NULL              -- ENCRYPTED
email                 TEXT NOT NULL              -- ENCRYPTED
phone                 TEXT                       -- ENCRYPTED
company               VARCHAR(255)
industry              VARCHAR(100)
website               VARCHAR(500)
pipelineStage         ENUM(...) DEFAULT 'lead'
stageChangedAt        TIMESTAMP WITH TIME ZONE DEFAULT now()
status                ENUM('active', 'archived', 'lost') DEFAULT 'active'
source                VARCHAR(50)               -- 'intake', 'manual', 'referral'
intakeSubmissionId    UUID REFERENCES intake_submissions(id)
assignedTo            UUID REFERENCES users(id)
createdAt             TIMESTAMP WITH TIME ZONE DEFAULT now()
updatedAt             TIMESTAMP WITH TIME ZONE DEFAULT now()
```

**Pattern**: PII fields encrypted at rest. Decrypt on read, encrypt on write. Never store plaintext PII.

#### pipeline_history

```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
clientId    UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE
fromStage   VARCHAR(50)   -- null for initial entry
toStage     VARCHAR(50) NOT NULL
changedBy   UUID REFERENCES users(id)
note        TEXT
createdAt   TIMESTAMP WITH TIME ZONE DEFAULT now()
```

**Pattern**: Log EVERY stage transition. This is your audit trail. Never skip this.

#### client_notes

```sql
id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
clientId    UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE
authorId    UUID REFERENCES users(id)
type        ENUM('general', 'call', 'email', 'meeting', 'internal')
content     TEXT NOT NULL
createdAt   TIMESTAMP WITH TIME ZONE DEFAULT now()
```

**Pattern**: Notes are the CRM's memory. Every interaction gets logged. Types let you filter.

#### intake_submissions

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
formData        JSONB NOT NULL            -- Raw form answers
analysis        JSONB NOT NULL            -- Scoring results
complexityScore INTEGER DEFAULT 1
status          ENUM('new', 'reviewed', 'accepted', 'rejected', 'converted')
createdAt       TIMESTAMP WITH TIME ZONE DEFAULT now()
updatedAt       TIMESTAMP WITH TIME ZONE DEFAULT now()
```

**Pattern**: JSONB for form data and analysis results. Schema evolves without migrations. Analysis is computed on submission and stored for instant retrieval.

#### proposals

```sql
id                    UUID PRIMARY KEY DEFAULT gen_random_uuid()
clientId              UUID REFERENCES clients(id)
intakeSubmissionId    UUID REFERENCES intake_submissions(id)
title                 VARCHAR(500) NOT NULL
summary               TEXT
content               TEXT NOT NULL            -- Markdown
services              JSONB                    -- Array of ProposalService
estimatedBudgetCents  INTEGER DEFAULT 0
timeline              VARCHAR(100)
validUntil            TIMESTAMP WITH TIME ZONE
status                ENUM('draft', 'reviewed', 'sent', 'accepted', 'rejected')
generatedBy           UUID REFERENCES users(id)
reviewedBy            UUID REFERENCES users(id)
reviewedAt            TIMESTAMP WITH TIME ZONE
sentAt                TIMESTAMP WITH TIME ZONE
acceptedAt            TIMESTAMP WITH TIME ZONE
rejectionReason       TEXT
createdAt             TIMESTAMP WITH TIME ZONE DEFAULT now()
updatedAt             TIMESTAMP WITH TIME ZONE DEFAULT now()
```

**Pattern**: Store money in cents (integer). Never floating point for currency. Use `Intl.NumberFormat` for display.

#### projects

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
clientId        UUID NOT NULL REFERENCES clients(id)
name            VARCHAR(500) NOT NULL
description     TEXT
status          ENUM('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')
services        JSONB
budgetCents     INTEGER DEFAULT 0
startDate       TIMESTAMP WITH TIME ZONE
targetDate      TIMESTAMP WITH TIME ZONE
completedDate   TIMESTAMP WITH TIME ZONE
assignedTo      UUID REFERENCES users(id)
createdAt       TIMESTAMP WITH TIME ZONE DEFAULT now()
updatedAt       TIMESTAMP WITH TIME ZONE DEFAULT now()
```

#### invoices

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
clientId        UUID NOT NULL REFERENCES clients(id)
projectId       UUID REFERENCES projects(id)
invoiceNumber   VARCHAR(20) UNIQUE NOT NULL    -- INV-YYYY-NNNN
subtotalCents   INTEGER DEFAULT 0
taxRate         NUMERIC(5,4) DEFAULT 0
taxCents        INTEGER DEFAULT 0
totalCents      INTEGER DEFAULT 0
status          ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled')
issuedDate      TIMESTAMP WITH TIME ZONE
dueDate         TIMESTAMP WITH TIME ZONE
paidDate        TIMESTAMP WITH TIME ZONE
notes           TEXT
createdAt       TIMESTAMP WITH TIME ZONE DEFAULT now()
updatedAt       TIMESTAMP WITH TIME ZONE DEFAULT now()
```

#### invoice_items

```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
invoiceId       UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE
description     TEXT NOT NULL
quantity         NUMERIC(10,2) DEFAULT 1
unitPriceCents  INTEGER NOT NULL
totalCents      INTEGER NOT NULL
sortOrder       INTEGER DEFAULT 0
```

**Pattern**: Line items with sort order. Calculate totals server-side, never trust client math.

### Indexes (Critical for Performance)

```sql
-- Foreign keys (always index)
CREATE INDEX ON clients(assigned_to);
CREATE INDEX ON clients(intake_submission_id);
CREATE INDEX ON pipeline_history(client_id);
CREATE INDEX ON client_notes(client_id);
CREATE INDEX ON proposals(client_id);
CREATE INDEX ON projects(client_id);
CREATE INDEX ON invoices(client_id);
CREATE INDEX ON invoices(project_id);
CREATE INDEX ON invoice_items(invoice_id);

-- Status fields (for filtering)
CREATE INDEX ON clients(pipeline_stage);
CREATE INDEX ON clients(status);
CREATE INDEX ON intake_submissions(status);
CREATE INDEX ON proposals(status);
CREATE INDEX ON projects(status);
CREATE INDEX ON invoices(status);

-- Search & sort
CREATE INDEX ON clients(created_at);
CREATE INDEX ON intake_submissions(created_at);
CREATE INDEX ON clients(email);
```

---

## 3. Pipeline Design

### The 12-Stage Pipeline

This pipeline has been tested in production. Every stage has a purpose.

```
 1. Lead                  → First contact, no intake yet
 2. Intake Submitted      → Form completed, waiting for review
 3. Analysis Complete     → Scoring done, recommendations ready
 4. Fit Assessment        → Human review of analysis + fit decision
 5. Proposal Draft        → Proposal generated/in progress
 6. Proposal Sent         → Client reviewing proposal
 7. Proposal Accepted     → Client said yes
 8. Contract Signed       → Legal complete, ready to start
 9. Project Planning      → Scope, timeline, milestones finalized
10. In Progress           → Active development/delivery
11. Delivered             → Work handed off, in review
12. Completed             → Everything done, final payment
```

### Stage Transition Rules

- **Forward only by default** — never skip stages without explicit override
- **Every transition logged** — pipelineHistory entry with who, when, notes
- **Auto-advance triggers**:
  - Intake submitted → automatically moves to `intake_submitted`
  - Proposal generated → advances to `proposal_draft`
  - Proposal sent → advances to `proposal_sent`
- **Manual triggers** — Admin clicks "Advance" button for everything else
- **stageChangedAt** — updated on every transition for "days in stage" calculations

### Stage Colors (UI)

```
Stages 1-3:   Blue (sky-500)     — Early/qualification
Stages 4-6:   Cyan (cyan-500)    — Active engagement
Stages 7-9:   Emerald (emerald-500) — Committed/building
Stages 10-12: Amber (amber-500)  — Delivery/completion
```

### Kanban Board

- One column per stage
- Card shows: client name, company, days in stage
- Click card → full client detail
- Color-coded top border per stage group

---

## 4. Core Flow: Intake to Invoice

This is the proven path. Every CRM we build follows this flow, customized for the client's business.

### Step 1: Intake Form (Public)

**What it does**: Collects structured information from prospects.

**Structure** (multi-step form):
1. Service Selection — what do they need?
2. Contact Info — name, email, phone, company
3. Business Profile — industry, size, website, years in business
4. Service-Specific Questions — deep questions per selected service
5. Timeline & Budget — when and how much
6. Design & Brand — preferences, assets, inspiration
7. Final Details — notes, referral source, preferred contact

**Patterns**:
- Multi-step with progress bar and step validation
- Service-specific questions inserted dynamically based on selection
- Query param support (`?service=X`) for direct entry from marketing
- Zod validation on every step + full form on submission
- `<Suspense>` boundary required for `useSearchParams()`

### Step 2: Analysis (Automatic)

**What it does**: Scores the submission across multiple dimensions.

**5-Dimension Client Profile** (0-100 each):
- Business Maturity — established? brand assets? team size?
- Project Readiness — detailed answers? budget defined? timeline set?
- Engagement Level — thorough responses? extras provided?
- Scope Clarity — focused? measurable outcomes? specific terms?
- Budget Alignment — budget vs. service minimums

**Service Recommendations**:
- Score every service in catalog against the submission
- Direct selection: +40, keywords: +5/match (max 25), budget fit: +20, industry: +5
- Labels: Strong Fit (75+), Good Fit (50-74), Partial Fit (25-49)

**Complexity Score** (1-10):
- Multi-service, answer volume, AI needs, integrations, timeline pressure

**RAI Screening**:
- Pattern-match for ethical red flags (surveillance, deception, discrimination, etc.)
- Flags require manual review before proceeding

**Key pattern**: All scoring is algorithmic. No LLM calls. Deterministic, auditable, instant. Stored as JSONB for immediate retrieval.

### Step 3: Review & Decision (Admin)

**What Bas (or the client's admin) sees**:
- "What They Asked For & Why" — per-service summary of business, problem, vision
- Client profile scores with signal explanations
- Service recommendations with fit scores
- Complexity gauge
- Flags (warnings, opportunities, RAI concerns)
- Paths forward (1-3 delivery approaches)

**Actions available**:
- Accept — mark as good fit, enable proposal
- Reject — mark as not a fit, with optional reason
- Convert to Client — creates client record in pipeline
- Generate Proposal — one-click algorithmic proposal
- Delete — remove submission entirely

### Step 4: Proposal Generation (Automatic)

**What it does**: Builds a professional proposal from analysis data.

**Sections generated**:
1. Executive Summary — complexity, service count, investment, timeline
2. Understanding Your Needs — industry, size, budget, timeline, readiness
3. Scope of Work — per-service: client's words + deliverables + fit score
4. Timeline — phased by service with duration estimates
5. Investment — itemized table with per-service pricing + total
6. What's Included — consolidated feature list + standard inclusions
7. What's Not Included — boundary-setting exclusions
8. Future Opportunities — high-fit services not selected (upsell)
9. Next Steps — clear action path for the client
10. Terms — validity, payment, revisions, ownership

**Key patterns**:
- Only include services the client SELECTED (not all recommendations)
- Timeline calculated from selected services only (not the broader path)
- Scope uses client's own words from service answers
- Money in cents, display with `Intl.NumberFormat`
- Content stored as Markdown, rendered to HTML with custom converter
- Human review required before sending (RAI gate)

### Step 5: Client Management (Ongoing)

**Client detail page shows**:
- Contact info (decrypted)
- Business info (industry, company, website)
- Current pipeline stage with advance button
- Full pipeline history (every transition)
- Notes (categorized: call, email, meeting, general, internal)
- Linked intake submission and proposals

**Notes system**:
- 5 types: general, call, email, meeting, internal
- Author-attributed, timestamped
- Reverse-chronological display
- This is the CRM's memory — log everything

### Step 6: Project Tracking

**Project record includes**:
- Name, description, status
- Linked client + optional proposal
- Budget, services array (JSONB)
- Start date, target date, completed date
- Assigned team member

**Status flow**: planning → in_progress → on_hold → completed → cancelled

### Step 7: Invoicing

**Invoice generation**:
- Auto-numbered: INV-YYYY-NNNN (sequential within year)
- Line items with qty, unit price, calculated totals
- Tax rate + tax calculation
- Status: draft → sent → paid / overdue → cancelled
- Dates: issued, due, paid

**Key pattern**: Calculate subtotal, tax, and total server-side. Store as cents. Never trust client-side math.

---

## 5. Security Patterns

These are non-negotiable. Every CRM we build follows these.

### PII Encryption

```typescript
// On write
const encrypted = encrypt(sanitizeString(rawValue));

// On read
const decrypted = decrypt(encryptedValue);
```

- AES-256 encryption for name, email, phone
- `ENCRYPTION_KEY` in env (never committed)
- Company, industry, website NOT encrypted (needed for queries/display)

### Authentication

- httpOnly cookies (not localStorage)
- bcrypt password hashing (cost factor 12)
- `requireAdmin()` guard on every API route
- Session table with auto-cleanup on user delete
- Rate limiting on login: 5 attempts / 15 min / IP

### Input Validation

```typescript
// Every API endpoint
const parsed = schema.safeParse(body);
if (!parsed.success) return error(400);

// Every string input
const clean = sanitizeString(rawInput);
```

- Zod schema on every POST/PATCH
- `sanitizeString()` strips HTML/XSS
- Field whitelisting on PATCH (only accept known fields)
- No raw body passed to database

### API Route Pattern

```typescript
export async function POST(request: NextRequest) {
  // 1. Auth check
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  // 2. Parse body
  let body: unknown;
  try { body = await request.json(); }
  catch { return error(400, "Invalid request body"); }

  // 3. Validate
  const parsed = schema.safeParse(body);
  if (!parsed.success) return error(400, "Validation failed");

  // 4. Business logic
  try {
    const result = await doWork(parsed.data);
    return NextResponse.json({ success: true, data: result });
  } catch {
    return error(500, "Operation failed");
  }
}
```

---

## 6. Customization Points

Every client's CRM is different. Here's what we customize vs. what stays the same.

### Always the Same (Framework)

- Database schema structure (tables, relationships)
- Auth system (httpOnly + bcrypt + RBAC)
- PII encryption pattern
- Input validation pattern
- Pipeline history audit trail
- API route pattern (auth → parse → validate → execute)
- Money in cents
- JSONB for flexible fields

### Customized Per Client

| What                     | How We Customize                                                       |
| ------------------------ | ---------------------------------------------------------------------- |
| Pipeline stages          | Add/remove/rename stages for their workflow                            |
| Intake questions         | Service-specific questions for their industry                          |
| Scoring weights          | Adjust dimension scoring to match what matters for their business      |
| Service catalog          | Their services, pricing, features                                      |
| Proposal templates       | Sections, tone, terms adjusted for their brand                         |
| Client fields            | Add industry-specific fields (e.g., license number, fleet size)        |
| Note types               | Add types (e.g., "site visit", "demo", "follow-up")                   |
| Invoice terms            | Payment schedules, tax rates, currency                                 |
| UI theme                 | Colors, logo, branding to match client's brand                         |
| Role permissions         | What each role can see/do (owner vs. manager vs. rep)                  |
| Integrations             | Email, calendar, accounting, phone system connections                  |
| Reports/analytics        | KPIs, charts, exports specific to their metrics                        |

### Adding a Custom Feature

Follow this pattern:
1. Add type definitions in `src/types/`
2. Add schema table/columns in `src/lib/schema.ts`
3. Run `drizzle-kit generate` + `drizzle-kit push`
4. Create API route with auth → validate → execute pattern
5. Create or update admin component
6. Write tests
7. Verify: `tsc --noEmit` + `pnpm test` + `pnpm build`

---

## 7. Scoring Engine Design

The scoring engine is one of our competitive advantages. It's algorithmic (no LLM), instant, and auditable.

### How It Works

```
Intake submission arrives
  ↓
Score across 5 client dimensions (0-100 each)
  ↓
Score every service for fit (0-100 each)
  ↓
Calculate complexity (1-10)
  ↓
Generate delivery paths (1-3 options)
  ↓
Screen for RAI concerns
  ↓
Generate flags (warnings, opportunities, info)
  ↓
Build summary
  ↓
Store as JSONB on intake record
```

### Scoring Philosophy

- **Points-based**: Each signal adds points. Total clamped to 0-100.
- **Transparent**: Every signal logged with its point value.
- **Tunable**: Adjust weights without changing code structure.
- **No bias**: Score based on project fit, not client characteristics.
- **Auditable**: Admin sees exactly why each score was given.

### Adapting for Client

When building a CRM for a client, adapt the scoring engine:
1. Define THEIR service catalog (what they sell)
2. Define keyword lists per service
3. Set industry alignment mappings
4. Define complexity factors relevant to their work
5. Set budget thresholds
6. Keep the 5-dimension client profile (universally useful)

---

## 8. Lessons Learned

### What Works

- **JSONB for flexibility** — form data and analysis stored as JSON. Schema evolves without breaking.
- **Cents for money** — integer math is exact. `$5,250.00` = `525000` cents. No floating point issues.
- **Pipeline history as audit trail** — every transition logged. Invaluable for understanding deal flow.
- **Algorithmic scoring over AI** — instant, deterministic, auditable. No API costs, no hallucinations.
- **Encryption at rest** — PII encrypted in database. Decrypt only when displaying.
- **Multi-step intake** — better completion rates than a single long form. Progress bar reduces drop-off.
- **Service-specific questions** — deep, meaningful questions per service. "Tell us about your business" beats "What features do you need?"
- **Notes with types** — categorizing notes (call, email, meeting) makes the CRM's memory searchable.
- **Status enums** — clear state machines prevent invalid transitions.
- **Index everything you filter on** — foreign keys, status fields, dates. Query performance matters.

### What Doesn't Work

- **Scoring ALL services in proposals** — only include what the client selected. Extras go in "Future Opportunities."
- **Generic proposal content** — use the client's own words. They told you their business, their problem, their vision. Reflect it back.
- **Pre-built path timelines for proposals** — calculate timeline from selected services only, not from paths that include all recommendations.
- **`@tailwindcss/typography` for proposal display** — custom CSS targeting `.proposal-content` is more reliable.
- **Over-complicated intake forms** — 3 sections per service: business, problem, vision. Plus a few specific questions. That's enough.
- **Skipping RAI screening** — ethical red flags caught early save everyone time and reputation.

### Performance Tips

- Always `select()` specific fields, never `select(*)` equivalent
- Index foreign keys and status columns
- Use `ON DELETE CASCADE` for child records
- JSONB queries are fast with GIN indexes if needed
- Encrypt/decrypt is CPU-bound — cache decrypted values in request scope, don't decrypt per-render

---

## 9. Build Checklist

When starting a new CRM project, follow this order:

### Phase 1: Foundation (Week 1-2)

- [ ] Set up Next.js project with TypeScript strict mode
- [ ] Configure PostgreSQL + Drizzle ORM
- [ ] Define schema tables (users, clients, pipeline_history, client_notes)
- [ ] Implement auth system (httpOnly cookies + bcrypt + RBAC)
- [ ] Implement PII encryption
- [ ] Create `requireAdmin()` middleware
- [ ] Build admin layout with sidebar navigation
- [ ] Build pipeline kanban board (basic)

### Phase 2: Intake (Week 2-3)

- [ ] Define client's service catalog
- [ ] Build intake form (multi-step)
- [ ] Write service-specific questions
- [ ] Implement scoring engine (client profile + service fit + complexity)
- [ ] Build intake analysis dashboard
- [ ] Create intake → client conversion flow
- [ ] Add status tracking (new → reviewed → accepted/rejected → converted)

### Phase 3: Proposals (Week 3-4)

- [ ] Build proposal generator (template-based)
- [ ] Create proposal detail view with edit capability
- [ ] Implement proposal status flow (draft → reviewed → sent → accepted)
- [ ] Add proposal sending (email integration)
- [ ] Wire proposal generation to pipeline advancement

### Phase 4: Delivery (Week 4-5)

- [ ] Build project management (CRUD + status tracking)
- [ ] Build invoice system (auto-numbering, line items, tax)
- [ ] Wire pipeline advancement on project milestones
- [ ] Add client notes system
- [ ] Build dashboard analytics (pipeline counts, revenue, conversion)

### Phase 5: Polish (Week 5-6)

- [ ] Admin settings page
- [ ] Notification preferences
- [ ] Search and filtering across all views
- [ ] Export capabilities (CSV, PDF)
- [ ] Mobile responsive admin views
- [ ] Full test suite
- [ ] Deploy and verify

---

## 10. File Reference

| Purpose                | File                                    |
| ---------------------- | --------------------------------------- |
| Database schema        | `src/lib/schema.ts`                     |
| DB connection          | `src/lib/db.ts`                         |
| Encryption             | `src/lib/encryption.ts`                 |
| Input sanitization     | `src/lib/sanitize.ts`                   |
| Auth guard             | `src/lib/api-auth.ts`                   |
| Scoring engine         | `src/lib/intake-scoring.ts`             |
| Proposal generator     | `src/lib/proposal-generator.ts`         |
| Markdown to HTML       | `src/lib/markdown-to-html.ts`           |
| Client types           | `src/types/client.ts`                   |
| Intake types           | `src/types/intake.ts`                   |
| Analysis types         | `src/types/intake-analysis.ts`          |
| Proposal types         | `src/types/proposal.ts`                 |
| Project types          | `src/types/project.ts`                  |
| Invoice types          | `src/types/invoice.ts`                  |
| Service catalog        | `src/data/services.ts`                  |
| Intake questions       | `src/data/intake-questions.ts`          |
| Intake validation      | `src/lib/intake-validation.ts`          |
| Client validation      | `src/lib/client-validation.ts`          |
| Proposal validation    | `src/lib/proposal-validation.ts`        |
| Invoice validation     | `src/lib/invoice-validation.ts`         |
| Pipeline board         | `src/components/admin/PipelineBoard.tsx` |
| Client detail          | `src/components/admin/ClientDetailDashboard.tsx` |
| Intake analysis        | `src/components/admin/IntakeAnalysisDashboard.tsx` |
| Proposal detail        | `src/components/admin/ProposalDetailView.tsx` |

---

*This framework is battle-tested. Every pattern here has been proven in production at builtbybas.com.
When in doubt, refer back to this document and the source files it references.*

*Last updated: 2026-03-03*
