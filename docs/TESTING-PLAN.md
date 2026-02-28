# BuiltByBas — Testing Plan

> Tests are not optional. They are not "later." They are part of the build.
> Every feature ships with tests. Every bug fix ships with a regression test.
> Source of truth: SITE-HEALTH-PLAN.md (Testing Standards section)

---

## Testing Stack

| Tool                | Purpose                     | Runs In        |
| ------------------- | --------------------------- | -------------- |
| Vitest              | Unit + integration tests    | CI + local     |
| Playwright          | E2E + accessibility tests   | CI + local     |
| axe-core            | WCAG accessibility scanning | Via Playwright |
| Custom Vitest suite | Security pattern scanning   | CI + local     |

---

## Coverage Targets

| Category          | Target | What's Included                                                   |
| ----------------- | ------ | ----------------------------------------------------------------- |
| Utility functions | 90%    | `src/lib/` — validation, sanitization, scoring, invoicing, export |
| API routes        | 80%    | `src/app/api/` — every endpoint handler                           |
| Components        | 70%    | `src/components/` — interactive components, forms, data display   |
| Overall           | 70%    | All source code combined                                          |

---

## Test Types

### 1. Unit Tests (Vitest)

**What:** Individual functions and modules tested in isolation.
**When:** Written WITH the code, not after.
**Location:** `tests/unit/` — mirrors `src/` structure.

| Area                 | What Gets Tested                                                      | Priority                   |
| -------------------- | --------------------------------------------------------------------- | -------------------------- |
| Validation schemas   | Every Zod schema validates correct input and rejects bad input        | HIGH — first tests written |
| Sanitization         | HTML escaping, type coercion, string trimming, bounds checking        | HIGH                       |
| Scoring engine       | Fit assessment: service fit, readiness, engagement, archetypes, flags | HIGH                       |
| Invoice calculations | Line item totals, tax, discounts, due date logic                      | HIGH                       |
| Auth utilities       | Token creation, verification, expiry, role checking                   | HIGH                       |
| Pipeline logic       | Stage transitions, timestamp stamping, checklist completion           | MEDIUM                     |
| Export functions     | JSON/CSV generation, data formatting                                  | MEDIUM                     |
| Constants            | Service types, deliverable types, stage definitions                   | LOW (smoke tests)          |

**Example test file structure:**
```
tests/unit/
├── lib/
│   ├── validation.test.ts      # Zod schema tests
│   ├── sanitize.test.ts        # Input sanitization
│   ├── scoring.test.ts         # Fit assessment engine
│   ├── invoicing.test.ts       # Invoice calculations
│   ├── auth.test.ts            # Session/token utilities
│   ├── stages.test.ts          # Pipeline logic
│   └── export.test.ts          # Data export
├── data/
│   └── constants.test.ts       # Smoke tests on static data
└── ai/
    ├── proposals.test.ts       # Prompt template population
    └── estimates.test.ts       # Estimation logic
```

---

### 2. Integration Tests (Vitest)

**What:** API route handlers tested with real database queries.
**When:** Written when the API route is built.
**Location:** `tests/integration/`

| Area          | What Gets Tested                                                      | Priority |
| ------------- | --------------------------------------------------------------------- | -------- |
| Client API    | CRUD, search, pagination, soft delete, validation errors              | HIGH     |
| Project API   | Create, update, link to client, status transitions                    | HIGH     |
| Auth API      | Login, logout, session validation, rate limiting, invalid credentials | HIGH     |
| Proposal API  | Create, update, AI generation trigger, version tracking               | MEDIUM   |
| Invoice API   | Create, update, status transitions, payment recording                 | MEDIUM   |
| Pipeline API  | Stage transitions, checklist toggling, timestamp auto-stamping        | MEDIUM   |
| Portal API    | Scoped data access (client only sees own data), row-level security    | HIGH     |
| Intake API    | Public form submission, client creation, pipeline auto-assignment     | HIGH     |
| Analytics API | Revenue calculations, funnel metrics, date range filtering            | LOW      |

**Each integration test verifies:**
1. Success case (correct input → correct response)
2. Validation error case (bad input → 400 with specific error)
3. Auth enforcement (no session → 401, wrong role → 403)
4. Field whitelisting (extra fields in body → ignored, not passed to DB)
5. Error handling (database error → 500 with generic message, no stack trace)

**Example test file structure:**
```
tests/integration/
├── api/
│   ├── clients.test.ts         # Client CRUD + search
│   ├── projects.test.ts        # Project CRUD + status
│   ├── auth.test.ts            # Login, logout, sessions
│   ├── proposals.test.ts       # Proposal CRUD + AI generation
│   ├── invoices.test.ts        # Invoice CRUD + status
│   ├── pipeline.test.ts        # Stage transitions + checklists
│   ├── intake.test.ts          # Public intake submission
│   ├── portal.test.ts          # Client portal scoped access
│   └── analytics.test.ts       # Metrics endpoints
└── db/
    └── migrations.test.ts      # Schema creation and migration
```

---

### 3. E2E Tests (Playwright)

**What:** Full user flows tested through the browser.
**When:** Written when the user flow is complete.
**Location:** `tests/e2e/`

| Flow                     | What Gets Tested                                              | Priority |
| ------------------------ | ------------------------------------------------------------- | -------- |
| Public intake submission | Fill form → submit → confirmation page → client created in DB | HIGH     |
| Admin login              | Navigate to admin → login → see dashboard                     | HIGH     |
| Client lifecycle         | Create client → advance through pipeline stages → complete    | HIGH     |
| Proposal flow            | Select client → generate proposal → review → send             | MEDIUM   |
| Invoice flow             | Create invoice → add line items → send → mark paid            | MEDIUM   |
| Client portal            | Client logs in → sees projects → downloads deliverable        | MEDIUM   |
| Navigation               | Every link in admin sidebar works, every tab loads            | LOW      |
| Responsive               | Critical flows work on mobile viewport (375px)                | MEDIUM   |

**Example test file structure:**
```
tests/e2e/
├── intake.spec.ts              # Public intake form submission
├── auth.spec.ts                # Login/logout flows
├── client-lifecycle.spec.ts    # Full client pipeline journey
├── proposal.spec.ts            # Proposal creation and management
├── invoice.spec.ts             # Invoice creation and tracking
├── portal.spec.ts              # Client portal flows
├── navigation.spec.ts          # All routes load, links work
└── responsive.spec.ts          # Mobile viewport tests
```

---

### 4. Accessibility Tests (axe-core + Playwright)

**What:** Every page scanned for WCAG 2.1 AA violations.
**When:** Added to every E2E test as an after-step.
**Location:** Embedded in E2E tests.

**What gets checked:**
- Color contrast (4.5:1 minimum)
- Alt text on all images
- Form labels linked to inputs
- Keyboard navigability (Tab, Enter, Space)
- Heading hierarchy (no skipped levels)
- ARIA attributes on interactive elements
- Skip-to-content link present
- Touch targets (44x44px minimum)
- Focus indicators visible

**Pattern:**
```typescript
// At the end of every E2E test
const results = await new AxeBuilder({ page }).analyze();
expect(results.violations).toEqual([]);
```

---

### 5. Security Tests (Custom Vitest Suite)

**What:** Automated scans for prohibited patterns and security violations.
**When:** Run in CI on every push. Written once, covers entire codebase.
**Location:** `tests/security/`

| Test Suite          | What It Checks                                                                        |
| ------------------- | ------------------------------------------------------------------------------------- |
| Prohibited patterns | No `dangerouslySetInnerHTML`, no `eval()`, no `: any`, no `console.log` in API routes |
| Auth enforcement    | Every admin API route calls `verifyApiRequest()` or equivalent                        |
| Field whitelisting  | No PATCH/PUT route passes raw body to database update                                 |
| Secret exposure     | No `process.env.` in client components (except `NEXT_PUBLIC_`)                        |
| Input validation    | Every API route has Zod validation before processing                                  |
| CSRF protection     | Origin header validated on state-changing requests                                    |
| SQL safety          | No string concatenation in queries (parameterized only)                               |
| Rate limiting       | Login endpoint has rate limiting configured                                           |

**Example test file structure:**
```
tests/security/
├── prohibited-patterns.test.ts  # Scan source for banned code patterns
├── auth-enforcement.test.ts     # Verify auth on every protected route
├── field-whitelisting.test.ts   # Verify no raw body passed to DB
├── secret-exposure.test.ts      # No secrets in client components
└── input-validation.test.ts     # Zod on every API endpoint
```

---

## When Tests Get Written

| Build Phase               | Tests Added                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| Phase 1: Foundation       | Auth unit tests, validation unit tests, sanitization unit tests, migration integration test   |
| Phase 2: Public Website   | Intake E2E test, accessibility tests on every public page                                     |
| Phase 3: CRM Core         | Client API integration tests, pipeline integration tests, scoring unit tests, admin E2E tests |
| Phase 4: Projects + Money | Project API tests, proposal tests, invoice calculation unit tests, portal integration tests   |
| Phase 5: AI + Analytics   | AI prompt template tests, analytics endpoint tests                                            |
| Phase 6: Hardening        | Security test suite (full), responsive E2E, remaining coverage gaps                           |

---

## CI Pipeline Integration

```
pnpm lint              # ESLint — 0 errors
pnpm tsc --noEmit      # TypeScript — 0 errors
pnpm test              # Vitest (unit + integration + security) — all passing
pnpm build             # Next.js build — 0 errors
pnpm audit             # Dependency audit — 0 critical vulnerabilities
```

Playwright E2E runs separately (heavier, needs browser):
```
pnpm test:e2e          # Playwright — all passing
```

---

## Test Naming Convention

```
describe('[Module/Component name]', () => {
  it('should [expected behavior] when [condition]', () => {
    // Arrange → Act → Assert
  });

  it('should reject [bad input] with [expected error]', () => {
    // Negative test case
  });
});
```

---

## Rules

1. **No feature ships without tests** — PR without tests is incomplete
2. **Bug fix = regression test** — every bug fixed gets a test that would have caught it
3. **Tests run before commit** — `pnpm test` passes before every push
4. **Tests run in CI** — automated, no human step required
5. **Failing test = blocked deploy** — CI gate prevents shipping broken code
6. **Test what matters** — business logic, security boundaries, user flows. Not implementation details.
7. **No mocking database in integration tests** — use a real test database
8. **Accessibility is not optional** — axe-core runs on every page, every E2E test
