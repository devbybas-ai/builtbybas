# Milestone Billing System -- Design Spec

> **Date:** 2026-03-14
> **Author:** Claude + Bas
> **Status:** Approved
> **Priority:** High -- core revenue infrastructure

---

## 1. Problem Statement

BuiltByBas uses a 50/25/25 billing model for all projects:

1. **50% deposit** (non-refundable) -- collected before work begins
2. **25% midpoint** (non-refundable) -- collected at the 50% completion client meeting
3. **25% final** -- collected after delivery of the product

Today, invoicing is entirely manual: create invoice, manually track milestones, no email sending, no automation, no scheduling. This needs to become an automated system that Bas can edit and manually trigger when needed.

---

## 2. Design Decisions

| Decision | Choice | Reasoning |
|---|---|---|
| Architecture | Hybrid (event + cron) | Deposit invoice instant on proposal accept; date-based milestones via daily cron |
| Milestone trigger | Cron generates drafts, Bas approves and sends | Control over when invoices go out; midpoint requires client meeting first |
| Deposit trigger | Immediate on proposal acceptance | Client is engaged, strike while the iron is hot |
| Payment collection | Manual first, Stripe framework built but dormant | Ship without Stripe dependency; add 3 env vars to activate later |
| Milestone dates | Auto-calculated from project dates, manually adjustable | Hybrid: scheduled by default, editable when projects run ahead/behind |
| Idempotency | proposalId unique constraint prevents duplicate project creation | If acceptance fires twice, second attempt is a no-op |
| Transaction safety | Project + milestones + invoice in single DB transaction | Email send is post-commit; partial DB state is impossible |
| Token security | HMAC hashed tokens (matches proposal pattern) | Raw token in URL, hashed token in DB |
| Rounding | Deposit gets the extra cent on odd amounts | 101 cents = 51 + 25 + 25 |

---

## 3. Data Model

### 3.1 New Table: `billing_milestones`

| Field | Type | Purpose |
|---|---|---|
| id | UUID PK | Primary key |
| projectId | UUID FK -> projects | Links to project |
| type | enum: deposit / midpoint / final | Milestone type |
| percentage | integer | 50, 25, or 25 |
| amountCents | integer | Calculated from project budget |
| scheduledDate | timestamp with tz | When this milestone is due |
| status | enum: pending / draft_created / sent / paid / cancelled | Milestone billing status |
| invoiceId | UUID FK -> invoices, nullable | Links to generated invoice |
| createdAt | timestamp with tz | Standard |
| updatedAt | timestamp with tz | Standard |

**Indexes:** projectId, status, scheduledDate

### 3.2 Modified Table: `projects`

| Field | Change |
|---|---|
| billingModel | ADD varchar(50), default "milestone_50_25_25" |
| proposalId | ADD UUID FK -> proposals, nullable, unique -- links auto-created project to its source proposal |

### 3.3 Modified Table: `invoices`

| Field | Change |
|---|---|
| token | ADD varchar(64), unique -- HMAC hash of raw token (same pattern as proposal responseToken) |
| reminderSentAt | ADD timestamp with tz, nullable -- tracks payment reminder sent |
| milestoneId | ADD UUID FK -> billing_milestones, nullable -- links to milestone |
| paymentMethod | ADD varchar(50), nullable -- zelle / check / bank_transfer / stripe / other |

**Token generation:** `randomBytes(32).toString("hex")` for client URL, `hmacHash(rawToken)` stored in DB. Column is 64 chars (hex-encoded SHA-256).

---

## 4. Proposal Acceptance Flow

When a client clicks "Accept Proposal" on their proposal link:

1. **Existing:** proposal status -> `accepted`, `acceptedAt` set
2. **New -- all within a single `db.transaction()`:**
   a. Check if a project already exists for this proposalId (idempotency guard). If yes, skip steps b-d.
   b. Auto-create project:
      - name = proposal title
      - clientId = proposal's client
      - proposalId = proposal's id (unique constraint prevents duplicates)
      - budgetCents = proposal's estimatedBudgetCents
      - services = proposal's services array
      - status = `planning`
      - startDate = now
      - targetDate = calculated from proposal timeline field
   c. Auto-create 3 billing milestones (50/25/25 split of budgetCents):
      - Deposit: scheduledDate = now, amountCents = ceil(budget * 0.50)
      - Midpoint: scheduledDate = halfway between start and target, amountCents = floor(budget * 0.25)
      - Final: scheduledDate = target date, amountCents = budget - deposit - midpoint
      - If budgetCents is null or 0: create milestones with amountCents = 0, skip invoice auto-generation
   d. Generate deposit invoice (50%):
      - Invoice status = `sent`
      - Token = generate and hash
      - Line items: each proposal service as a line item, quantities scaled to 50% of total
      - Due date = 7 days from now (configurable in settings)
3. **Post-commit (outside transaction):**
   - Send deposit invoice email to client (decrypt client name/email first)
   - Send admin notification (proposal accepted, deposit invoice sent)
   - If email send fails: log error, invoice still exists in DB as `sent`. Admin can resend manually.

### Deposit Line Item Strategy

Each proposal service becomes a line item with its full description. A single line "50% Project Deposit" modifier is applied to the total, so the client sees what they're paying for while the total reflects the deposit amount.

### Timeline Mapping

| Timeline value | Maps to |
|---|---|
| asap | 2 weeks from now |
| 2-4-weeks | 3 weeks from now |
| 5-6-weeks | 5.5 weeks from now |
| flexible | 8 weeks from now |

### Budget Edge Cases

| Scenario | Behavior |
|---|---|
| Budget is null | Create milestones with $0, skip auto-invoice generation |
| Budget is 0 | Create milestones with $0, skip auto-invoice generation |
| Budget is odd cents (e.g., 101) | Deposit gets extra cent: 51 + 25 + 25 = 101 |
| Proposal has no services | Create single line item "Project Deposit" with deposit amount |

---

## 5. Cron Worker

### Route: `POST /api/cron/billing`

Secured with `CRON_SECRET` env var via a `requireCronAuth()` helper (similar pattern to `requireAdmin()`). If `CRON_SECRET` is not set, endpoint always returns 401. `CRON_SECRET` is added to `src/lib/env.ts` Zod schema as required.

Runs daily at 8am EST via VPS crontab.

### Daily Sweep Operations:

**1. Midpoint milestone check:**
- Find: type = midpoint, status = pending, scheduledDate <= today
- Action: generate draft invoice (25%), update milestone status to draft_created
- Email admin: "Midpoint invoice drafted for [Project] -- review and send after client meeting"

**2. Final milestone check:**
- Find: type = final, status = pending, scheduledDate <= today
- Action: generate draft invoice (25%), update milestone status to draft_created
- Email admin: "Final invoice drafted for [Project] -- review and send after delivery"

**3. Overdue detection:**
- Find: invoices where status = sent, dueDate < today
- Action: update invoice status to overdue, update linked milestone status to overdue if applicable
- Email admin: "[Invoice #] is overdue for [Client]"

**4. Payment reminders:**
- Find: invoices where status = sent, dueDate is 3 days away, reminderSentAt is null
- Action: email client payment reminder (decrypt client email first), set reminderSentAt
- Only sends once per invoice

**5. Upcoming milestone alerts:**
- Find: milestones where scheduledDate is 5 days away, status = pending
- Action: email admin "Milestone approaching for [Project] in 5 days -- schedule client meeting"

### VPS Crontab

```bash
0 13 * * * source /var/www/builtbybas/.cron.env && curl -s -X POST https://builtbybas.com/api/cron/billing -H "Authorization: Bearer $CRON_SECRET"
```

Secret stored in `/var/www/builtbybas/.cron.env` (chmod 600), not inline in crontab.

### Manual Trigger

Admin dashboard "Run Billing Check" button calls the same endpoint with admin session auth (cron endpoint accepts either CRON_SECRET bearer token OR valid admin session).

---

## 6. Invoice Email System

### Email Template

Professional branded email (same architecture as existing proposal-email.ts):
- BuiltByBas header
- Invoice number, issue date, due date
- Client name and project name
- Line items table (description, quantity, unit price, total)
- Subtotal, tax, total
- Payment instructions (manual methods -- configurable text from settings)
- "Pay Online" button (visible only when `isStripeEnabled()` returns true)
- "View Invoice" link to client-facing page (`/invoice/[rawToken]`)
- Policy links footer

No `dangerouslySetInnerHTML` -- invoice content is structured data (line items, amounts), rendered as typed JSX components.

### Client-Facing Invoice Page: `/invoice/[token]`

Standalone page (no auth required), accessed via unique token:
- Token is hashed and looked up in DB (same pattern as proposal response)
- Full invoice display (read-only, structured JSX -- no dangerouslySetInnerHTML)
- Payment status indicator (unpaid / paid / overdue)
- "Pay Online" button (Stripe, when active)
- Manual payment instructions (when Stripe inactive)
- Policy links footer with animated overlay (same pattern as proposal page)
- noindex, nofollow

### Email Triggers

| Event | Recipient | Content |
|---|---|---|
| Deposit invoice created | Client | Invoice with payment instructions |
| Midpoint/final invoice sent (manual) | Client | Invoice with payment instructions |
| 3 days before due date | Client | Payment reminder |
| Invoice overdue | Admin | Overdue alert |
| Invoice marked paid | Admin | Payment confirmation |
| Milestone approaching (5 days) | Admin | Schedule client meeting reminder |
| Proposal accepted | Admin | Acceptance + deposit sent notification |

### Email Failure Handling

If an email fails to send, the invoice/milestone DB state is still valid (email is post-commit). Admin receives a notification of the failure. Invoices track email status implicitly: if `status = sent` but no email was delivered, admin can use the "Resend" button.

---

## 7. Stripe Framework (Dormant)

Built but inactive until env vars are added. No code changes needed to activate.

### Components

**`src/lib/stripe.ts`** -- Stripe client utility
- Initializes Stripe SDK only if `STRIPE_SECRET_KEY` is present
- Exports `isStripeEnabled()` boolean check
- Creates Checkout Sessions for invoice payment

**`POST /api/invoices/[id]/pay`** -- Payment route
- Requires no auth (client-facing, token-validated)
- Stripe enabled: creates Checkout Session, redirects to Stripe
- Stripe disabled: returns "online payment not available"
- Success URL: `/invoice/[token]?paid=true`
- Cancel URL: `/invoice/[token]`

**`POST /api/stripe/webhook`** -- Webhook handler
- Skips requireAdmin() and CSRF/origin validation (receives requests from Stripe servers)
- Uses only Stripe webhook signature for authentication
- Listens for `checkout.session.completed`
- Auto-marks invoice as paid, sets paidDate
- Updates billing milestone status to paid
- Sends admin payment confirmation email

### Activation

Add 3 env vars -- no code changes:
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Note: publishable key uses `NEXT_PUBLIC_` prefix per Next.js convention (needed on client side).

---

## 8. Admin UI Changes

### Project Detail -- Billing Section
- Visual timeline of 3 milestones (deposit / midpoint / final)
- Each shows: percentage, amount, scheduled date, status, linked invoice
- Edit button to adjust scheduled date (recalculates only for `pending` milestones)
- "Generate Invoice Now" button on pending milestones (override the schedule)
- "Send Invoice" button on draft invoices (after client meeting)
- When project targetDate changes, offer to recalculate pending milestone dates

### Invoice List Page
- Filter by milestone type (deposit / midpoint / final / manual)
- Overdue invoices highlighted at top

### Invoice Detail Page
- "Send to Client" button (emails the invoice)
- "Resend" button for already-sent invoices
- "Mark as Paid" button with payment method selector (zelle / check / bank_transfer / stripe / other)
- Link back to billing milestone and project

### Dashboard -- Billing Widget
- Outstanding invoices total
- Overdue invoices count (with alert styling)
- Next upcoming milestone across all projects
- "Run Billing Check" button (manual cron trigger)

### Settings -- Billing Configuration
- Default deposit due date (days after sending, default: 7)
- Default payment reminder (days before due, default: 3)
- Manual payment instructions text (shown on invoice page when Stripe is off)
- Stripe status indicator (connected / not configured)

---

## 9. Milestone Date Recalculation

When a project's `targetDate` is changed in the admin:
- Only `pending` milestones are affected (draft_created, sent, and paid milestones keep their dates)
- Midpoint milestone: recalculated to halfway between startDate and new targetDate
- Final milestone: recalculated to new targetDate
- Admin sees a confirmation: "Update pending milestone dates to match new target?"

This keeps the system accurate when projects run ahead or behind schedule while preserving the history of milestones that have already been actioned.

---

## 10. Project Cancellation

When a project is cancelled:
- All `pending` and `draft_created` milestones are set to `cancelled`
- `sent` milestones remain (outstanding invoices stay active -- admin decides whether to cancel them)
- `paid` milestones are untouched (money already collected)
- Related draft invoices are set to `cancelled`

---

## 11. New Files

| File | Purpose |
|---|---|
| src/lib/stripe.ts | Stripe client, isStripeEnabled(), Checkout Session creation |
| src/lib/invoice-email.ts | Invoice email HTML builder |
| src/lib/billing.ts | Milestone generation, cron sweep logic, timeline mapping, rounding |
| src/lib/cron-auth.ts | requireCronAuth() helper for cron endpoint |
| src/app/api/cron/billing/route.ts | Daily cron sweep endpoint |
| src/app/api/invoices/[id]/send/route.ts | Send invoice email to client |
| src/app/api/invoices/[id]/pay/route.ts | Stripe Checkout Session (dormant) |
| src/app/api/stripe/webhook/route.ts | Stripe webhook handler (dormant, skips CSRF) |
| src/app/api/projects/[id]/milestones/route.ts | List milestones for project |
| src/app/api/projects/[id]/milestones/[milestoneId]/route.ts | Update milestone date |
| src/app/(standalone)/invoice/[token]/page.tsx | Client-facing invoice page |
| src/components/admin/BillingTimeline.tsx | Visual milestone tracker |
| src/components/billing/InvoiceView.tsx | Client-facing invoice display |

## 12. Modified Files

| File | Change |
|---|---|
| src/lib/schema.ts | Add billing_milestones table, project proposalId + billingModel fields, invoice token/reminderSentAt/milestoneId/paymentMethod fields |
| src/lib/env.ts | Add CRON_SECRET to Zod env schema (required) |
| src/app/api/proposals/respond/route.ts | On accept: auto-create project, milestones, deposit invoice (in transaction) |
| src/components/admin/InvoiceDetailView.tsx | Add send/resend/mark-paid buttons with payment method |
| src/app/admin/invoices/page.tsx | Add milestone type filter, overdue highlighting |
| src/app/admin/projects/[id]/page.tsx | Add billing section with BillingTimeline |
| src/app/admin/page.tsx | Add billing widget to dashboard |
| .env.example | Add CRON_SECRET, STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET |

---

## 13. Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| CRON_SECRET | Yes | Secures the billing cron endpoint |
| STRIPE_SECRET_KEY | No | Stripe API key (dormant until added) |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | No | Stripe public key for client-side (dormant until added) |
| STRIPE_WEBHOOK_SECRET | No | Stripe webhook validation (dormant until added) |

---

## 14. Testing Strategy

- Unit tests for milestone generation (50/25/25 split, date calculations, rounding edge cases)
- Unit tests for cron sweep logic (each of the 5 operations)
- Unit tests for invoice email builder
- Unit tests for timeline mapping
- Unit tests for budget edge cases ($0, null, odd cents)
- API route tests for cron endpoint (auth with CRON_SECRET, auth with admin session, rejection without auth)
- API route tests for invoice send/pay routes
- API route tests for milestone CRUD
- Integration test: proposal accept -> project + milestones + deposit invoice created (idempotency)
- Stripe webhook signature validation test
- Milestone date recalculation test (project targetDate change)
- Project cancellation -> milestone cancellation test
