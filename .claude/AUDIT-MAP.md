# BuiltByBas -- Code Audit Map

> **For:** Bas Rosario -- Evening Code Review (2026-03-14)
> **Files:** 28 API routes, 12 core lib files, 1 middleware
> **Read order:** Start at the top (CRITICAL), work down

---

## Risk Tiers at a Glance

```
CRITICAL (review first -- auth gaps, public data exposure)
  |
  |-- /api/admin/notifications ........... NO AUTH CHECK
  |-- /api/intake (GET) .................. PUBLIC list of all submissions
  |-- /api/intake/[id] (GET) ............. PUBLIC single submission
  |-- /api/proposals/respond (GET) ....... PUBLIC proposal via token (no expiry)
  |
HIGH (review second -- attack surface, unsanitized output)
  |
  |-- /api/auth/login .................... Rate limit resets on restart
  |-- /api/intake/send-link .............. No rate limit on email sends
  |-- src/lib/encryption.ts .............. Key management, no rotation
  |-- src/lib/proposal-generator.ts ...... Client words copied verbatim
  |
MEDIUM (review third -- logic gaps, validation)
  |
  |-- src/lib/auth.ts .................... Session lifecycle, cookie config
  |-- src/middleware.ts ................... Route protection gates
  |-- src/lib/sanitize.ts ................ XSS prevention coverage
  |-- src/lib/intake-validation.ts ....... Dynamic service answers
  |-- next.config.ts ..................... CSP, unsafe-inline
  |
FOUNDATION (review last -- DB, types, helpers)
  |
  |-- src/lib/db.ts ...................... Connection pool
  |-- src/lib/schema.ts .................. Table definitions
  |-- src/lib/api-auth.ts ................ Auth helper (requireAdmin)
  |-- All validation files ............... Zod schemas
```

---

## CRITICAL -- Review These First

### 1. `/api/admin/notifications` -- NO AUTH
**File:** `src/app/api/admin/notifications/route.ts`
**Problem:** GET endpoint returns dashboard counts (new intakes, draft proposals, overdue invoices) with NO authentication check. Anyone can hit this endpoint and learn business metrics.
**Look for:** Missing `requireAdmin()` call at the top of the GET handler.

### 2. `/api/intake` (GET) -- PUBLIC LIST
**File:** `src/app/api/intake/route.ts`
**Problem:** GET returns ALL intake submissions. No auth required. POST is intentionally public (form submissions), but GET should not be.
**Look for:** Whether GET handler calls `requireAdmin()`. It should.

### 3. `/api/intake/[id]` (GET) -- PUBLIC SINGLE
**File:** `src/app/api/intake/[id]/route.ts`
**Problem:** GET returns a single intake submission (with decrypted PII) to anyone who knows the ID. UUIDs are hard to guess but this should still be auth-gated.
**Look for:** Whether GET handler calls `requireAdmin()`.

### 4. `/api/proposals/respond` (GET) -- TOKEN-BASED, NO EXPIRY
**File:** `src/app/api/proposals/respond/route.ts`
**Problem:** Clients access proposals via a 64-char hex token. The GET handler returns full proposal content (title, summary, scope, budget). Token never expires.
**Look for:** Whether there's an expiry check on the token. Whether the proposal content is sanitized before storage.

---

## HIGH -- Attack Surface

### 5. Login Rate Limiting
**File:** `src/app/api/auth/login/route.ts`
**What it does:** 5 attempts per 15 min per IP. Stored in an in-memory `Map`.
**Problem:** Resets on every server restart / PM2 restart. Not distributed.
**Look for:** The `loginAttempts` Map. Consider whether this is acceptable for your traffic level.

### 6. Email Send -- No Rate Limit
**File:** `src/app/api/intake/send-link/route.ts`
**What it does:** Sends intake form link to a prospect's email.
**Problem:** No rate limiting. An attacker with admin access could spam external addresses.
**Look for:** Whether there's any throttle or cooldown.

### 7. Encryption Key Management
**File:** `src/lib/encryption.ts`
**What it does:** AES-256-GCM encryption for all PII (names, emails, phones).
**Strengths:** Random 12-byte IV per encryption, auth tag, versioned format (`enc:v1:{iv}:{ciphertext}:{tag}`).
**Problem:** No key rotation mechanism. If `ENCRYPTION_KEY` is compromised, all encrypted data is exposed. HMAC hashes are deterministic (no salt).
**Look for:** The `encrypt()`, `decrypt()`, and `hmacHash()` functions. Verify the key length validation.

### 8. Proposal Generator -- Verbatim Client Words
**File:** `src/lib/proposal-generator.ts`
**What it does:** Generates proposals from intake data. Extracts client's own words from form answers.
**Problem:** Client-submitted text is copied verbatim into proposals. If proposals are rendered as HTML, this is an XSS vector.
**Look for:** Whether extracted text goes through `sanitizeString()` before inclusion.

---

## MEDIUM -- Logic and Configuration

### 9. Session Lifecycle
**File:** `src/lib/auth.ts`
**What to check:**
- `createSession()` -- 7-day max age, httpOnly, secure (prod only), sameSite strict
- `getSession()` -- validates expiry, returns safe fields only
- `destroySession()` -- clears cookie AND deletes DB record
- Password hashing -- bcrypt 12 rounds
**Question:** Is 7 days too long for admin sessions?

### 10. Middleware Route Protection
**File:** `src/middleware.ts`
**What to check:**
- Which routes are protected: `/admin/*`, `/portal/*`, `/api/admin/*`, `/api/portal/*`
- Which routes are public: `/`, `/services`, `/portfolio`, `/about`, `/intake`, `/login`
- Session cookie validation: reads `builtbybas_session`, checks existence
**Question:** Does middleware validate the session in the DB, or just check cookie existence? (Answer: just cookie existence -- DB validation happens in `getSession()` called by each route)

### 11. Sanitization Coverage
**File:** `src/lib/sanitize.ts`
**What to check:**
- `escapeHtml()` -- covers &, <, >, ", '
- `sanitizeObject()` -- whitelists keys, sanitizes string values
**Question:** Is `sanitizeObject()` called on every API POST/PATCH handler? Check the client, proposal, and project routes.

### 12. Intake Validation -- Dynamic Keys
**File:** `src/lib/intake-validation.ts`
**What to check:**
- `fullIntakeSchema` -- service answers use `z.record()` (allows arbitrary keys)
**Question:** Could an attacker submit unexpected keys in `serviceAnswers`? Are they ever used in SQL or rendered in HTML?

### 13. Security Headers
**File:** `next.config.ts`
**What to check:**
- CSP uses `'unsafe-inline'` for scripts and styles (necessary for Next.js but weakens CSP)
- No HSTS header (SSL handled by Nginx, but worth confirming Nginx sets HSTS)
- `frame-ancestors 'none'` (good -- prevents clickjacking)
- Permissions-Policy disables camera, microphone, geolocation

---

## FOUNDATION -- DB, Types, Helpers

### 14. Database Connection
**File:** `src/lib/db.ts`
**Quick check:** Pool config (max 10, idle 30s, connect 5s). Drizzle ORM (parameterized queries, no raw SQL).

### 15. Schema
**File:** `src/lib/schema.ts`
**Quick check:** Table definitions, enum constraints, indexes. PII fields stored encrypted.

### 16. Auth Helper
**File:** `src/lib/api-auth.ts`
**Quick check:** `requireAdmin()` checks session exists + role is owner/team. Returns 401/403.

### 17. Validation Files
| File | What It Validates |
|------|-------------------|
| `src/lib/validation.ts` | Login (email + password) |
| `src/lib/client-validation.ts` | Client CRUD, notes, pipeline stage |
| `src/lib/intake-validation.ts` | Multi-step intake form |
| `src/lib/proposal-validation.ts` | Proposal CRUD |
| `src/lib/project-validation.ts` | Project CRUD |
| `src/lib/invoice-validation.ts` | Invoice CRUD |

---

## All 28 API Routes -- Quick Reference

| Route | Methods | Auth | Risk |
|-------|---------|------|------|
| `/api/auth/login` | POST | Public | HIGH -- rate limit |
| `/api/auth/logout` | POST | Session | Low |
| `/api/auth/session` | GET | Session | Low |
| `/api/clients` | GET, POST | Admin | Low |
| `/api/clients/[id]` | GET, PATCH, DELETE | Admin | Med -- hard delete |
| `/api/clients/[id]/notes` | GET, POST | Admin | Low |
| `/api/clients/[id]/stage` | PATCH | Admin | Med -- no transition validation |
| `/api/clients/convert` | POST | Admin | Low |
| `/api/intake` | GET, POST | **PUBLIC** | **CRITICAL** -- GET leaks data |
| `/api/intake/[id]` | GET, DELETE | **GET: PUBLIC** | **CRITICAL** -- GET leaks PII |
| `/api/intake/[id]/status` | PATCH | Admin | Low |
| `/api/intake/send-link` | POST | Admin | HIGH -- no rate limit |
| `/api/pipeline` | GET | Admin | Low |
| `/api/projects` | GET, POST | Admin | Low |
| `/api/projects/[id]` | GET, PATCH | Admin | Low |
| `/api/proposals` | GET, POST | Admin | Med -- content sanitization |
| `/api/proposals/[id]` | GET, PATCH, DELETE | Admin | Med -- hard delete |
| `/api/proposals/[id]/send` | POST | Admin | Med -- token generation |
| `/api/proposals/[id]/nudge` | POST | Admin | Low -- 48h cooldown |
| `/api/proposals/generate` | POST | Admin | Low |
| `/api/proposals/respond` | GET, POST | **Token (PUBLIC)** | **CRITICAL** -- no expiry |
| `/api/invoices` | GET, POST | Admin | Med -- sequential IDs |
| `/api/invoices/[id]` | GET, PATCH | Admin | Low |
| `/api/settings/profile` | PATCH | Admin | Low |
| `/api/settings/password` | PATCH | Admin | Med -- no history check |
| `/api/settings/business` | GET, PATCH | Admin | Med -- website XSS |
| `/api/settings/notifications` | GET, PATCH | Admin | Low |
| `/api/admin/notifications` | GET | **NONE** | **CRITICAL** -- no auth |

---

## Strengths (Things Done Right)

- AES-256-GCM encryption for all PII
- bcrypt 12 rounds for passwords
- Zod validation on every API input
- HTML escaping via sanitize.ts
- Drizzle ORM (no raw SQL, no injection)
- httpOnly + secure + sameSite=strict cookies
- UUID-based IDs (no sequential exposure)
- Security headers in next.config.ts
- Middleware route protection
- Generic login error messages (no user enumeration)

---

## Your Review Checklist

- [ ] Read the 4 CRITICAL files first
- [ ] Verify auth on every GET handler
- [ ] Check sanitization on every POST/PATCH handler
- [ ] Review encryption.ts key handling
- [ ] Check next.config.ts headers
- [ ] Review middleware route list
- [ ] Spot-check 2-3 validation schemas
