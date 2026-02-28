# IO Project Standards

> **Universal Standards for Every Project We Build**
> Version 2.0 | Created: 2026-02-27
> Derived from: OrcaChild, PraxisLibrary, The Colour Parlor, KAR
> Author: Bas Rosario

---


## How to Use This Document

Copy this file into any new project's `.claude/` directory. It is stack-agnostic — the standards apply whether you're building with Next.js, static HTML, Python, or anything else. Tech-specific implementation notes are marked with [TECH-SPECIFIC] — adapt to your stack.

---


## The Eight Pillars

Every decision across every Rosario project is governed by these eight pillars. They are non-negotiable.

| # | Pillar                                          | Core Question                                                    |
|---|--------------------------------------------------|------------------------------------------------------------------|
| 1 | **Security Minded**                              | Can this be exploited?                                           |
| 2 | **Structure**                                    | Can someone else pick this up tomorrow?                          |
| 3 | **Performance**                                  | Does this respect the user's time and device?                    |
| 4 | **Inclusive**                                    | Can everyone use this?                                           |
| 5 | **Non-Bias**                                     | Does this assume or exclude?                                     |
| 6 | **UX Minded**                                    | Does this feel intentional and clear?                            |
| 7 | **Universal Design (UD/UDL)**                    | Does this work for the widest range of people without adaptation?|
| 8 | **Robustness, Redundancy, Recovery, Strategy**   | What happens when something fails?                               |

---


## Pillar 1: Security Minded


### 1.1 Input Validation

| Rule                         | Requirement                                                                       | Enforcement                                      |
|------------------------------|-----------------------------------------------------------------------------------|--------------------------------------------------|
| **Validate at boundaries**   | Every API route, form handler, and server action validates input before processing | Zod schemas, manual checks, or equivalent        |
| **Whitelist, never blacklist**| Define what IS allowed, not what isn't                                            | Enum validation, field allowlists, type checks   |
| **Server-side always**       | Client-side validation is UX; server-side is security. Both required              | Never trust client-submitted data                |
| **Type coercion**            | Explicitly cast inputs (`String()`, `Number()`) — never assume type               | Prevent prototype pollution and type confusion   |

**Field Whitelisting Pattern (PATCH/PUT routes):**
```
1. Define ALLOWED_FIELDS constant
2. Loop through allowed fields only
3. Check if field exists in request body
4. Cast to expected type
5. Build update object from allowed fields only
6. NEVER pass raw request body to database .update()
```

**Validation Checklist for Every Form/Endpoint:**
- [ ] Required fields enforced
- [ ] String length limits (min and max)
- [ ] Enum values validated against allowed list
- [ ] Email format validated
- [ ] Phone format validated (if applicable)
- [ ] Number ranges validated
- [ ] File types restricted (if upload)
- [ ] File size limited (if upload)
- [ ] JSON structure validated (if nested objects)


### 1.2 Injection Prevention

| Attack Vector            | Prevention                                                                          | Test                                              |
|--------------------------|------------------------------------------------------------------------------------|---------------------------------------------------|
| **SQL Injection**        | Parameterized queries only. Never string-concatenate SQL                           | Automated test: scan for string concat in queries |
| **XSS**                 | Never `dangerouslySetInnerHTML` with user data. Use `textContent` or framework escaping | Automated test: scan for `dangerouslySetInnerHTML` |
| **Command Injection**    | Never pass user input to shell commands                                            | Code review                                       |
| **Mass Assignment**      | Field allowlists on all update routes                                              | Automated test: scan for `.update(body)`          |
| **Prototype Pollution**  | Validate object keys against allowlist                                             | Field allowlist                                   |

**Prohibited Code Patterns (Enforce via Tests):**
- `dangerouslySetInnerHTML` (exception: JSON-LD with `JSON.stringify` output only)
- `eval()` or `new Function()` with any input
- `document.write()`
- `innerHTML` with user-supplied data
- String concatenation in SQL queries
- `console.log` in production API routes (leaks internal state)


### 1.3 Authentication & Session Security

| Control              | Standard                                                        | Notes                                    |
|----------------------|-----------------------------------------------------------------|------------------------------------------|
| **Token storage**    | httpOnly cookies only                                           | Never localStorage, never sessionStorage |
| **Token flags**      | httpOnly, Secure (HTTPS), SameSite=Strict or Lax               | All three required in production         |
| **Session expiry**   | Maximum 7 days, configurable per project                        | Shorter for sensitive admin panels       |
| **Password hashing** | SHA-256 minimum, bcrypt/argon2 preferred                        | Never store plaintext                    |
| **Rate limiting**    | 5 login attempts per 15 minutes per IP                          | Clear on successful login                |
| **Auth check**       | Every admin API route calls `verifyApiRequest()` or equivalent  | No exceptions                            |
| **Page-level auth**  | Server-side session check on protected pages                    | Redirect to login if invalid             |


### 1.4 CSRF Protection

| Control | Standard |
|---------|----------|
| **Origin validation** | Validate `Origin` header on state-changing requests (POST, PATCH, PUT, DELETE) |
| **Same-origin check** | Compare origin against known host — reject mismatches |
| **Read-only exempt** | GET requests do not require origin check |


### 1.5 File Upload Security

| Control | Standard |
|---------|----------|
| **Allowed types** | Explicit allowlist (e.g., JPEG, PNG, WebP, GIF, AVIF) |
| **Max size** | 5 MB default (adjust per project) |
| **Filename** | Generate server-side: `{timestamp}-{random}.{ext}` — never use user filename |
| **Storage** | Remote storage (Supabase Storage, S3) — never local filesystem in production |
| **Validation** | Check MIME type server-side, not just file extension |


### 1.6 Security Headers

**Required on every project (configure in web server or framework):**

| Header                       | Value                                       | Purpose                       |
|------------------------------|---------------------------------------------|-------------------------------|
| `X-Frame-Options`           | `DENY`                                      | Prevent clickjacking          |
| `X-Content-Type-Options`    | `nosniff`                                   | Prevent MIME sniffing         |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`           | Limit referrer leakage        |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`  | Disable unused APIs           |
| `Content-Security-Policy`   | Project-specific (see below)                | Prevent XSS and injection     |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains`       | Force HTTPS (production only) |

**Content Security Policy (CSP) Tiers:**

| Tier               | When to Use                                     | Baseline                                                                                          |
|--------------------|--------------------------------------------------|---------------------------------------------------------------------------------------------------|
| **A+ (Strictest)** | Static sites, no external deps                   | `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'` |
| **A (Strict)**     | Dynamic sites with known external services        | `default-src 'self'` + explicit allowlists for each external service                              |
| **B (Standard)**   | Sites requiring inline styles (framework constraint) | Add `'unsafe-inline'` to `style-src` only — never to `script-src` in production                |

**CSP Rules:**
- Start with `default-src 'none'` and add only what's needed
- Never use `'unsafe-eval'` in production
- Prefer nonce-based `script-src` over `'unsafe-inline'`
- Document every external domain added to CSP with a reason
- `object-src 'none'` always
- `base-uri 'self'` always
- `form-action 'self'` always


### 1.7 Secrets Management

| Rule | Standard |
|------|----------|
| **Never commit secrets** | `.env.local`, `.env`, credentials files always in `.gitignore` |
| **Server-only keys** | Database service keys, API secret keys never use `NEXT_PUBLIC_` or equivalent client prefix |
| **`.env.example`** | Every project has a `.env.example` with variable names (no values) |
| **Git history** | Audit git history for accidentally committed secrets before going public |
| **Key rotation** | Document how to rotate each secret |


### 1.8 Error Handling

| Rule | Standard |
|------|----------|
| **Never expose stack traces** | Generic error message to client, full error logged server-side |
| **Never expose database errors** | "Something went wrong" — not "relation 'users' does not exist" |
| **Never log PII** | No names, emails, phone numbers, ages in logs |
| **Error boundaries** | Every public-facing app has a root error boundary |
| **Graceful degradation** | If an external service fails, show fallback content — never crash |


### 1.9 Data Privacy

| Rule | Standard |
|------|----------|
| **Soft deletes** | Use `deleted_at` timestamp — never hard delete user data without explicit request |
| **Minimal collection** | Only collect data you actively use |
| **PII inventory** | Know exactly what PII your project stores and where |
| **Data export** | Users can request their data in a portable format |
| **COPPA compliance** | If minors may use your app: age-gating, parental consent, zero PII logging |
| **CCPA compliance** | If serving California: privacy policy, deletion capability, disclosure |


### 1.10 Dependency Security

| Rule | Standard |
|------|----------|
| **Audit before adding** | Check weekly downloads, maintenance status, known vulnerabilities |
| **`pnpm audit` / `npm audit`** | Run before every deployment — 0 critical vulnerabilities in production |
| **Pin major versions** | Prevent unexpected breaking changes |
| **Prefer fewer deps** | Every dependency is an attack surface |
| **Review transitive deps** | A package's dependencies are your dependencies |


### 1.11 Infrastructure Security

| Layer | Standard |
|-------|----------|
| **SSH** | Key-based auth (Ed25519), password auth disabled, non-standard port (e.g., 2222) |
| **Firewall** | Default deny inbound, allow only 80, 443, SSH port |
| **IPS** | Fail2ban or equivalent on SSH (5 retries, 1-hour ban) |
| **Root login** | Disabled — use a named user account |
| **SSL/TLS** | Let's Encrypt + auto-renewal, TLS 1.2+ only |
| **Process manager** | PM2 or equivalent with auto-restart on crash and boot |

---


## Pillar 2: Structure


### 2.1 Documentation Requirements

**Every project MUST have these files:**

| File             | Purpose                                                         | Update Frequency      |
|------------------|----------------------------------------------------------------|-----------------------|
| `CLAUDE.md`      | Project instructions, tech stack, standards, prohibited actions | When standards change |
| `HANDOFF.md`     | Current state — what's done, in-progress, blocked, next actions | Every session         |
| `AUDIT.md`       | Health dashboard with scores, issues tracker, tech debt register| When issues found/fixed|
| `.env.example`   | Environment variable template (names only, no values)           | When env vars change  |

**Optional but recommended:**

| File                  | Purpose                                    | When Needed                |
|-----------------------|--------------------------------------------|----------------------------|
| `COST.md`             | Project value assessment, market rates, ROI | Client projects            |
| `VPS-CHEATSHEET.md`   | Server commands quick reference             | Self-hosted projects       |
| `RAI-POLICY.md`       | Responsible AI use policy                   | Projects using AI          |
| `SecurityPosture.md`  | Detailed security audit and posture         | Security-critical projects |


### 2.2 Session Protocol

**Starting every session:**
1. Read `HANDOFF.md` for current state
2. Check `AUDIT.md` for open issues
3. Check memory files for accumulated knowledge
4. Understand before changing

**During every session:**
- Mark todos complete as work progresses
- Note new issues discovered
- Test before and after changes

**Ending every session:**
1. Update `HANDOFF.md` — what's done, in-progress, next, blockers
2. Update `AUDIT.md` if issues were fixed or found
3. Recommend next steps
4. Ensure all tests pass


### 2.3 Code Organization

| Rule | Standard |
|------|----------|
| **One component per file** | Named export matching filename |
| **No file >500 lines** | Split into focused modules |
| **No dead code** | Remove commented-out blocks, unused imports, legacy shims |
| **No file bloat** | Prefer editing existing files over creating new ones |
| **Clear directory structure** | Group by feature or domain, not by file type |
| **Archive pattern** | When docs grow past limits, archive completed sections with key facts retained inline |


### 2.4 TypeScript Standards

| Rule | Standard |
|------|----------|
| **Strict mode** | `"strict": true` in tsconfig.json — non-negotiable |
| **Never `any`** | Use `unknown` and narrow with type guards |
| **Never `as` assertions** | Unless type is verified at runtime |
| **Never `!` non-null** | Handle null/undefined explicitly |
| **Explicit return types** | On public functions and API handlers |
| **Import order** | React/Next → External packages → Internal components → Internal lib/types |


### 2.5 Naming Conventions

| Type             | Convention        | Example                                      |
|------------------|-------------------|----------------------------------------------|
| Components       | PascalCase        | `WeatherCard.tsx`, `StylistModal.tsx`        |
| Utilities        | camelCase         | `formatDate.ts`, `sanitize.ts`               |
| Constants        | UPPER_SNAKE_CASE  | `MAX_ATTEMPTS`, `ALLOWED_TYPES`              |
| Types/Interfaces | PascalCase        | `StylistRow`, `ContactFormData`              |
| CSS classes      | kebab-case or Tailwind | `nav-link`, `bg-brand-600`              |
| Files            | Match primary export   | Component → PascalCase, utility → camelCase |
| Directories      | kebab-case        | `api/admin/`, `components/shared/`           |


### 2.6 Git Standards

| Rule | Standard |
|------|----------|
| **Commit messages** | `<type>: <description>` (feat, fix, docs, style, refactor, test, build, chore) |
| **Co-author** | `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` on AI-assisted commits |
| **Never force-push** | To any shared branch |
| **Never commit secrets** | `.env`, credentials, API keys |
| **Test before push** | All tests pass, build succeeds |
| **Atomic commits** | One logical change per commit |


### 2.7 Code Notation

| Language | Section Markers |
|----------|----------------|
| HTML | `<!-- === SECTION === -->` ... `<!-- /SECTION -->` |
| CSS | `/* === SECTION === */` with component sub-markers |
| JavaScript/TypeScript | `// === SECTION ===` with JSDoc comments |

---


## Pillar 3: Performance


### 3.1 Core Web Vitals Targets

| Metric                          | Target  | What It Measures                |
|---------------------------------|---------|---------------------------------|
| LCP (Largest Contentful Paint)  | < 2.5s  | How fast the main content loads |
| FCP (First Contentful Paint)    | < 1.8s  | How fast anything appears       |
| CLS (Cumulative Layout Shift)   | < 0.1   | How much the page jumps around  |
| INP (Interaction to Next Paint) | < 200ms | How fast interactions respond   |
| Lighthouse Performance          | 90+     | Overall performance score       |
| Lighthouse Accessibility        | 100     | Accessibility compliance        |
| Lighthouse SEO                  | 90+     | Search engine optimization      |


### 3.2 Image Optimization

| Rule | Standard |
|------|----------|
| **Framework image component** | Always use `<Image>` (Next.js) or equivalent — never raw `<img>` |
| **Responsive `sizes`** | Every image has a `sizes` attribute matching its rendered size |
| **Priority loading** | Hero/above-fold images use `priority` or `loading="eager"` |
| **Format** | WebP preferred for uploads |
| **Dimensions** | Maximum 2400px wide |
| **Alt text** | Descriptive for informational, empty (`alt=""`) for decorative |


### 3.3 Font Optimization

| Rule | Standard |
|------|----------|
| **Loading** | Via `next/font` or self-hosted — never external CDN links |
| **Families** | Maximum 2 per project |
| **Subsetting** | Latin only (unless i18n requires more) |
| **Layout shift** | Zero — use `display: swap` or equivalent |


### 3.4 Data Fetching

| Rule | Standard |
|------|----------|
| **Server-first** | Fetch on server when possible — avoid client-side fetch for initial data |
| **Specific columns** | Always `.select("col1, col2")` — never `SELECT *` |
| **Pagination** | Paginate queries returning potentially large result sets |
| **Caching** | ISR (86400s default) + on-demand revalidation for public pages |
| **Static fallbacks** | Site works even if database is down — use fallback data files |
| **Lazy loading** | Defer heavy components below the fold |


### 3.5 Bundle Optimization

| Rule | Standard |
|------|----------|
| **No bloat** | Don't add packages without clear justification |
| **Tree shaking** | Named imports, never `import *` |
| **Dynamic imports** | Heavy components (maps, charts) loaded with `dynamic()` or `lazy()` |
| **Bundle analysis** | Monitor size — alert on PRs that increase bundle by >10KB |

---


## Pillar 4: Inclusive


### 4.1 Accessibility (WCAG 2.1 AA)

**Every project must meet these requirements:**

| Requirement                    | Standard                                                                                            | Test               |
|--------------------------------|-----------------------------------------------------------------------------------------------------|--------------------|
| **Skip-to-content link**       | First focusable element on every page                                                               | Manual + E2E       |
| **All images have alt text**   | Descriptive for informational, `alt=""` for decorative                                              | Automated scan     |
| **Color contrast 4.5:1**       | All text meets minimum contrast ratio                                                               | Lighthouse + axe   |
| **Keyboard accessible**        | All interactive elements reachable via Tab, activatable via Enter/Space                             | Manual + E2E       |
| **Visible focus indicators**   | Never `outline: none` without replacement                                                           | Visual review      |
| **Semantic HTML**              | `<button>` for actions, `<a>` for navigation, proper landmarks (`nav`, `main`, `header`, `footer`) | Automated scan     |
| **Touch targets 44x44px**      | All buttons and links meet minimum size on mobile                                                   | Manual review      |
| **`prefers-reduced-motion`**   | Disable/reduce animations when user prefers                                                         | CSS media query    |
| **Heading hierarchy**          | No skipped levels (h1 → h2 → h3)                                                                   | Automated scan     |
| **Form labels**                | Every input has a `<label>` linked via `htmlFor`/`id` or wrapping                                   | Automated scan     |
| **Error messages**             | Linked to inputs via `aria-describedby`, announced to screen readers                                | Manual + axe       |
| **`lang` attribute**           | Set on `<html>` element                                                                             | Automated scan     |
| **200% zoom**                  | No horizontal scrolling required at 200% text size                                                  | Manual review      |
| **ARIA attributes**            | Tab navigation uses `role="tablist"`, `role="tab"`, `aria-selected`                                 | Manual review      |


### 4.2 LGBTQA+ Inclusive Language

| Rule | Standard |
|------|----------|
| **Gender-neutral by default** | Use "they/them" when gender unknown |
| **No binary assumptions** | No Male/Female checkboxes. Use "Parent/Guardian" not "Mom/Dad" |
| **Safe space** | Tone never alienates, mocks, or others anyone |
| **Inclusive examples** | Represent diverse identities and family structures |


### 4.3 Ability-Inclusive Language

| Avoid | Use Instead |
|-------|-------------|
| "tide pool walks" | "tide pool explorations" |
| "walking trails" | "trails" |
| "walk you through" | "guide you through" |
| "Conservation takes physical effort" | "Volunteers bring energy and dedication" |
| Any language assuming physical capability | Neutral language that includes all abilities |


### 4.4 Neurodivergent-Friendly Design

| Rule | Standard |
|------|----------|
| **Scannability** | Use headers, bullets, tables — no walls of text |
| **Clear hierarchy** | Most important information first |
| **Capacity-aware** | Designed for real life, not ideal conditions |
| **No time pressure** | Avoid countdown timers, auto-dismissing notifications |
| **Clear error messages** | What went wrong + how to fix it |
| **Progressive disclosure** | Show what's needed now, reveal complexity as needed |


### 4.5 AI Inclusive

| Rule | Standard |
|------|----------|
| **Transparent** | Users know when AI is involved |
| **AI as amplifier** | Extends human capability, doesn't replace judgment |
| **Human review** | AI output reviewed before reaching users |
| **No manipulation** | AI informs and empowers, never pressures |

---


## Pillar 5: Non-Bias

| Rule | Standard |
|------|----------|
| **Diverse examples** | Names, identities reflect real-world diversity |
| **No demographic assumptions** | Don't assume race, ethnicity, ability, orientation |
| **Inclusive language** | Avoid idioms that exclude non-native English speakers |
| **Challenge AI bias** | Review AI-generated content for stereotypes before use |
| **No "default" user** | Design for the full range of people who will visit |
| **Verify AI output** | Never deliver AI-generated content without human review |
| **No AI as authority** | AI provides analysis, humans make decisions |

---


## Pillar 6: UX Minded


### 6.1 Feedback & Recovery

| Rule | Standard |
|------|----------|
| **Every action gets feedback** | Loading state, success state, error state |
| **Errors are recoverable** | Clear instructions, never dead ends |
| **Delete requires confirmation** | Two-step: "Delete?" → "Confirm" + "Deleting..." while in-flight |
| **Optimistic updates** | Show change immediately, rollback on failure |
| **Dismissible errors** | Error banners have close buttons |


### 6.2 Mobile First

| Rule | Standard |
|------|----------|
| **Design for mobile first** | Enhance for larger screens |
| **Touch-friendly** | 44x44px minimum touch targets |
| **Safe areas** | Respect `env(safe-area-inset-*)` for notched devices |
| **Viewport** | Use `h-dvh` for dynamic viewport on iOS |
| **iOS compatibility** | Test scroll events, touch events, momentum scrolling |


### 6.3 Consistency

| Rule | Standard |
|------|----------|
| **Same action, same behavior** | Buttons, links, forms work identically everywhere |
| **Consistent terminology** | Pick one word and use it everywhere (e.g., "Delete" not sometimes "Remove") |
| **Consistent spacing** | Follow a spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px) |
| **Consistent transitions** | Same duration and easing across similar interactions |

---


## Pillar 7: Universal Design (UD/UDL)

> Universal Design means designing products that work for the widest range of people from the start — not retrofitting accommodations as an afterthought. Universal Design for Learning (UDL) extends this to how users learn and interact with content.


### 7.1 The Seven Principles of Universal Design

Every project must be evaluated against these principles:

| # | Principle                                | Core Question                                                                   | Application                                                                  |
|---|------------------------------------------|---------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| 1 | **Equitable Use**                        | Does the design serve users with diverse abilities equally?                     | Same features for all users, avoid segregating or stigmatizing               |
| 2 | **Flexibility in Use**                   | Does the design accommodate a wide range of preferences and abilities?          | Multiple input methods (keyboard, mouse, touch, voice), adjustable settings  |
| 3 | **Simple and Intuitive**                 | Is the design easy to understand regardless of experience or knowledge?         | Clear labels, consistent navigation, no jargon                               |
| 4 | **Perceptible Information**              | Does the design communicate necessary information effectively to all users?     | Multiple modalities (visual + text), sufficient contrast, alt text, captions |
| 5 | **Tolerance for Error**                  | Does the design minimize hazards and unintended consequences?                   | Undo/redo, confirmation on destructive actions, forgiving input parsing      |
| 6 | **Low Physical Effort**                  | Can the design be used efficiently with minimum fatigue?                        | Minimal scrolling for key actions, large touch targets, keyboard shortcuts   |
| 7 | **Size and Space for Approach and Use**  | Is appropriate size and space provided regardless of body, posture, or mobility?| Responsive layouts, touch targets 44x44px+, no precision-dependent UI        |


### 7.2 UDL — Multiple Means of Engagement

| Rule | Standard | Example |
|------|----------|---------|
| **Multiple entry points** | Users can reach the same goal through different paths | Navigation + search + direct links |
| **Choice in interaction** | No single interaction pattern is the only way | Click or keyboard or tap or swipe |
| **Minimized distractions** | Content hierarchy is clear, secondary elements don't compete | Clean layouts, progressive disclosure |
| **Self-regulation support** | Users can control pace and experience | No auto-advancing content, pause-able animations, adjustable text size |


### 7.3 UDL — Multiple Means of Representation

| Rule | Standard | Example |
|------|----------|---------|
| **Text alternatives** | All non-text content has a text equivalent | Alt text, transcripts, captions |
| **Clarify vocabulary** | Domain-specific terms are defined or avoided | Tooltips, plain language, glossary links |
| **Highlight patterns** | Key information is visually distinct and structurally marked | Headings, bold, color + icon (never color alone) |
| **Multi-modal presentation** | Information conveyed through 2+ channels | Icon + label, color + text, visual + audio |


### 7.4 UDL — Multiple Means of Action and Expression

| Rule | Standard | Example |
|------|----------|---------|
| **Multiple input methods** | Support keyboard, mouse, touch, and assistive tech | All actions reachable via Tab + Enter |
| **Assistive technology compatible** | Works with screen readers, switch access, voice control | Proper ARIA, semantic HTML, focus management |
| **Graduated complexity** | Start simple, allow power users to access advanced features | Basic view → expanded view, progressive forms |
| **Flexible response options** | Don't require a specific input format when alternatives work | Accept phone as (951)555-1234 or 9515551234 |


### 7.5 UD/UDL Checklist (Every Project)

| # | Check | Status |
|---|-------|--------|
| 1 | Can a keyboard-only user complete every task? | |
| 2 | Can a screen reader user navigate and understand all content? | |
| 3 | Does the design work at 200% zoom without horizontal scrolling? | |
| 4 | Are there multiple ways to find content (nav, search, links)? | |
| 5 | Is information conveyed through multiple channels (not color alone)? | |
| 6 | Can users control animations, auto-play, and time-based content? | |
| 7 | Are error messages clear, specific, and recovery-oriented? | |
| 8 | Do forms accept flexible input formats? | |
| 9 | Is reading level appropriate for the audience? | |
| 10 | Are touch targets 44x44px minimum with adequate spacing? | |
| 11 | Does the layout adapt gracefully from 320px to 2560px? | |
| 12 | Can users complete core tasks without creating an account (where applicable)? | |

---


## Pillar 8: Robustness, Redundancy, Recovery, Strategy (R3S)

> Systems fail. Networks drop. Services go down. Dependencies break. R3S ensures every project is built to survive failure — not just avoid it.


### 8.1 Robustness — Build to Withstand

| Rule                          | Standard                                                          | Implementation                                                               |
|-------------------------------|-------------------------------------------------------------------|------------------------------------------------------------------------------|
| **Defensive coding**          | Every external call assumes failure                               | Try/catch on all network requests, database queries, and file operations     |
| **Input resilience**          | Handle malformed, missing, and unexpected input gracefully        | Validate, provide defaults, never crash on bad data                          |
| **Browser compatibility**     | Works in all modern browsers (last 2 major versions)              | Test in Chrome, Firefox, Safari, Edge                                        |
| **Progressive enhancement**   | Core functionality works without JavaScript where possible        | SSR/SSG first, hydrate for interactivity                                     |
| **Graceful degradation**      | When a feature fails, surrounding features continue working       | Isolate failure domains — one broken API doesn't crash the page              |
| **Error boundaries**          | Component-level error containment                                 | React Error Boundaries, try/catch in server components                       |


### 8.2 Redundancy — No Single Point of Failure

| Layer                         | Standard                                          | Implementation                                                    |
|-------------------------------|---------------------------------------------------|-------------------------------------------------------------------|
| **Data redundancy**           | Critical data exists in 2+ locations              | Database + static fallback files in `src/data/`                   |
| **Service redundancy**        | If primary service fails, fallback exists          | Supabase down → static data renders. CDN down → self-hosted fonts |
| **Authentication fallback**   | If DB auth fails, fallback mechanism exists         | `ADMIN_MASTER_PASSWORD` env var as override                       |
| **Content fallback**          | Every dynamic section has a static fallback         | Stylists, services, gallery all have `src/data/` fallback arrays  |
| **DNS resilience**            | A records + monitoring                              | Multiple A records where possible, uptime monitoring              |
| **Backup strategy**           | Regular automated backups                           | Supabase auto-backups, git repository as code backup              |

**Fallback Priority Chain (for every data source):**
```
1. Primary: Live database query (Supabase, API)
2. Cache: ISR/cached response (if available)
3. Static: Fallback data files in src/data/
4. Graceful empty: "Content coming soon" — never a crash
```


### 8.3 Recovery — Bounce Back Fast

| Scenario                    | Recovery Plan                                                     | Max Downtime                          |
|-----------------------------|-------------------------------------------------------------------|---------------------------------------|
| **App crash**               | PM2 auto-restart                                                  | < 5 seconds                           |
| **Bad deploy**              | `git revert` + redeploy                                           | < 5 minutes                           |
| **Database unavailable**    | Static fallback data serves public pages                          | 0 (public pages never go blank)       |
| **SSL certificate expiry**  | Auto-renewal via certbot cron                                     | 0 (auto-renews 30 days before expiry) |
| **Disk full**               | PM2 log rotation, weekly log flush                                | < 10 minutes                          |
| **DDoS / traffic spike**    | Nginx rate limiting, Cloudflare (if configured)                   | Variable                              |
| **Corrupted data**          | Soft deletes (never hard delete), Supabase point-in-time restore  | < 30 minutes                          |
| **Configuration drift**     | `.env.example` documents all required vars, deploy checklist      | < 15 minutes                          |

**Recovery Runbook Template:**
```
1. DETECT — How do you know something is wrong?
   - PM2 status shows "errored"
   - Uptime monitor alerts
   - User reports

2. DIAGNOSE — What broke?
   - pm2 logs [process] --lines 50
   - Check nginx error log: /var/log/nginx/error.log
   - Check application logs

3. CONTAIN — Stop the bleeding
   - If bad deploy: git revert HEAD && pnpm build && pm2 restart
   - If database issue: static fallbacks already serving
   - If DDoS: enable Cloudflare Under Attack mode

4. FIX — Resolve the root cause
   - Identify the actual bug/issue
   - Fix locally, test, commit, deploy

5. VERIFY — Confirm recovery
   - Check all public pages load
   - Check admin panel functions
   - Verify PM2 status: "online"
   - Run quality gates
```


### 8.4 Strategy — Plan for What's Next

| Rule                         | Standard                                                             | Review Cycle         |
|------------------------------|----------------------------------------------------------------------|----------------------|
| **Uptime monitoring**        | Every production site has external uptime checks                     | Configure on launch  |
| **Incident log**             | Document every outage: what happened, root cause, fix, prevention    | After every incident |
| **Dependency lifecycle**     | Track EOL dates for major dependencies (Node.js, Next.js, etc.)     | Quarterly            |
| **Capacity planning**        | Monitor disk usage, memory, connection counts                        | Monthly              |
| **Exit strategy**            | Know how to migrate away from every service                          | Document on adoption |
| **Disaster recovery plan**   | Written plan for total server loss                                   | Annual review        |
| **Cost sustainability**      | Infrastructure costs reviewed and justified                          | Quarterly            |
| **Knowledge continuity**     | HANDOFF.md, CLAUDE.md, AUDIT.md keep any developer productive       | Every session        |

**Strategic Health Questions (ask quarterly):**
1. If the primary database went down right now, would public pages still render?
2. If the VPS was destroyed, how long to rebuild from scratch?
3. Are all dependencies actively maintained? Any approaching EOL?
4. Is infrastructure cost sustainable for the next 12 months?
5. Could a new developer get productive in < 1 hour with the docs?
6. Are backups tested? When was the last restore test?


### 8.5 R3S Checklist (Every Project)

| # | Check | Status |
|---|-------|--------|
| 1 | Every external API call has error handling and a fallback | |
| 2 | Static fallback data exists for all dynamic content sections | |
| 3 | PM2 (or equivalent) auto-restarts on crash and boot | |
| 4 | A bad deploy can be reverted in < 5 minutes | |
| 5 | SSL certificates auto-renew | |
| 6 | Database has automated backups | |
| 7 | Log rotation prevents disk from filling | |
| 8 | `.env.example` documents all required environment variables | |
| 9 | Recovery runbook exists and is current | |
| 10 | External uptime monitoring is configured | |
| 11 | Incident log is maintained | |
| 12 | Dependency EOL dates are tracked | |

---


## Quality Gates


### Pre-Deployment Checklist

**Every project must pass ALL gates before shipping:**

| #  | Gate                    | Command                            | Required                                      |
|----|-------------------------|------------------------------------|-----------------------------------------------|
| 1  | **Type Check**          | `pnpm tsc --noEmit` or equivalent  | 0 errors                                      |
| 2  | **Lint**                | `pnpm lint` or equivalent          | 0 errors                                      |
| 3  | **Tests**               | `pnpm test`                        | All passing                                   |
| 4  | **Build**               | `pnpm build`                       | 0 errors                                      |
| 5  | **Dependency Audit**    | `pnpm audit`                       | 0 critical vulnerabilities                    |
| 6  | **Security Headers**    | Check via securityheaders.com      | A or higher                                   |
| 7  | **Lighthouse**          | Run on all public pages            | Performance 90+, Accessibility 100, SEO 90+   |


### Security Scan Commands

```bash
# Scan for prohibited patterns
grep -rn "dangerouslySetInnerHTML" src/ --include="*.tsx"
grep -rn ": any\b" src/ --include="*.ts" --include="*.tsx"
grep -rn "eval\s*(" src/ --include="*.ts" --include="*.tsx"
grep -rn "console\.log" src/app/api/ --include="*.ts"
grep -rn "process\.env\." src/app/ --include="*.tsx"  # check no secrets in client components
grep -rn "\.update(body)" src/ --include="*.ts"  # check for mass assignment
```

---


## Health Dashboard Template

Copy this template into your project's `AUDIT.md`:

```markdown
# Project Health — [Project Name]

| Dimension | Score | Grade | Notes |
|-----------|-------|-------|-------|
| Quality Gates | /5 | | |
| Code Quality | /10 | | |
| Security | /10 | | |
| Accessibility | /10 | | |
| Performance | /10 | | |
| Universal Design (UD/UDL) | /10 | | |
| Robustness & Redundancy | /10 | | |
| Recovery & Strategy | /10 | | |
| Test Coverage | /10 | | |
| Tech Debt | /10 | | |
| Dependencies | /10 | | |
| Documentation | /10 | | |
| File Organization | /10 | | |
| **Overall** | **/10** | | |

Grading: A+ = 10, A = 9, B+ = 8, B = 7, C = 6, D = 5, F = <5
```


### Issue Severity Classification

| Severity     | Definition                                         | SLA                    |
|--------------|----------------------------------------------------|------------------------|
| **CRITICAL** | Security vulnerability, data loss, app crash       | Fix immediately        |
| **HIGH**     | Broken functionality, significant UX/security gap  | Fix before launch      |
| **MEDIUM**   | Standards violation, moderate UX or security issue  | Fix before next session|
| **LOW**      | Minor polish, code cleanliness                     | Fix when convenient    |

---


## Testing Standards


### Coverage Targets

| Category | Target |
|----------|--------|
| Utility functions | 90% |
| API routes / Server actions | 80% |
| Components | 70% |
| Overall | 70% |


### Required Test Types

| Type               | Tool                  | What It Tests                                             |
|--------------------|-----------------------|-----------------------------------------------------------|
| **Unit**           | Vitest                | Business logic, validation, utilities, scoring            |
| **Integration**    | Vitest                | API route handlers, database queries                      |
| **E2E**            | Playwright            | User flows, navigation, form submission                   |
| **Accessibility**  | axe-core + Playwright | WCAG violations on every page                             |
| **Security**       | Custom Vitest suite   | Prohibited patterns, auth enforcement, field whitelisting |


### Security Test Suite (Required for Every Project)

```
Test Suite: Prohibited Patterns
  - No `dangerouslySetInnerHTML` (except approved JSON-LD)
  - No `: any` type annotations
  - No `eval()` calls
  - No service role keys in client components
  - No console.log in API routes

Test Suite: Auth Enforcement
  - Every admin API route calls verifyApiRequest() or equivalent
  - Login route has rate limiting
  - Origin header validated on state-changing requests

Test Suite: Field Whitelisting
  - No PATCH route passes raw body to .update()
  - All PATCH routes use explicit field allowlists
```

---


## Deployment Standards


### VPS Checklist

| #   | Item                                           | Status |
|-----|------------------------------------------------|--------|
| 1   | SSH key-based auth (Ed25519)                   |        |
| 2   | SSH password auth disabled                     |        |
| 3   | SSH on non-standard port                       |        |
| 4   | Root login disabled                            |        |
| 5   | Firewall: default deny, allow 80/443/SSH only  |        |
| 6   | Fail2ban on SSH                                |        |
| 7   | SSL/TLS via Let's Encrypt + auto-renewal       |        |
| 8   | Nginx version hidden                           |        |
| 9   | HTTP → HTTPS redirect                          |        |
| 10  | HSTS header (1 year + includeSubDomains)       |        |
| 11  | PM2 with auto-restart on crash + boot          |        |
| 12  | Security headers verified (A+ target)          |        |
| 13  | All quality gates pass                         |        |


### Deploy Command Template

```bash
cd /var/www/[project] && git pull origin master && pnpm install --frozen-lockfile && pnpm build && pm2 restart [process-name]
```


### Maintenance Schedule

| Frequency | Task |
|-----------|------|
| **Weekly** | PM2 status + logs, disk usage, fail2ban review, SSL cert check |
| **Monthly** | `pnpm audit`, UFW/firewall logs, Nginx error logs, PM2 log flush |
| **Quarterly** | Full security audit, SSL Labs test, Lighthouse audit, dependency updates, RLS review |

---


## Responsible AI (RAI) Standards

| Rule | Standard |
|------|----------|
| **Human review required** | No AI output reaches end users without human review |
| **Transparency** | Users informed when AI assists analysis or content |
| **No automated decisions** | AI suggests, humans decide |
| **Bias awareness** | Review AI output for stereotypes, assumptions, and exclusions |
| **Data minimization** | Only include relevant data in AI prompts |
| **Local data** | Prefer keeping PII out of AI prompts entirely |
| **Output validation** | Checklist before publishing AI-generated content |
| **Continuous improvement** | Inaccurate outputs inform prompt refinement |

---


## Citation & Sourcing Standards

**For content-heavy projects (educational sites, knowledge bases):**


### 4-Tier Authority Model

| Tier | Type                        | Examples                                       | Acceptance                                 |
|------|-----------------------------|------------------------------------------------|--------------------------------------------|
| 1    | Institutional Authority     | NIST, FDA, universities, government agencies   | Auto-accepted if topic-specific and dated  |
| 2    | Research & Standards        | arXiv, IEEE, Nature, peer-reviewed journals    | Accepted with identifiable authors         |
| 3    | Primary Company Sources     | Company X on its own product only              | Only for that company's own products       |
| 4    | Research-Grade Editorial    | Pew Research, university surveys               | Accepted for survey/statistical data only  |


### Sourcing Rules

- Primary source only — never secondary reporting
- Topic-specific — generic info not acceptable
- Freshness cutoff — rolling 2-year window
- Human verification required — every external link verified manually
- Required attributes — `href`, `target="_blank"`, `rel="noopener noreferrer"`

---


## Compliance Matrix

| Standard          | When Required                               | Key Requirements                                                   | Pillar |
|-------------------|---------------------------------------------|--------------------------------------------------------------------|--------|
| **WCAG 2.1 AA**   | Every project                               | See Pillar 4 accessibility checklist                               | 4, 7   |
| **COPPA**         | Projects serving minors (<13)               | Age-gating, parental consent, minimal collection, no PII logging   | 1, 5   |
| **CCPA**          | Projects serving California residents       | Privacy policy, data deletion, data export, disclosure             | 1, 5   |
| **OWASP Top 10**  | Every project with user input               | Input validation, auth, injection prevention, error handling       | 1      |
| **ADA**           | Every public-facing project                 | WCAG compliance (see above) — legal requirement in California      | 4, 7   |
| **UD Principles** | Every project                               | 7 principles evaluation (see Pillar 7)                             | 7      |
| **UDL Framework** | Content-heavy / educational projects        | Multiple means of engagement, representation, action               | 7      |
| **SLA/Uptime**    | Every production project                    | Defined recovery targets, monitored uptime, fallback chain         | 8      |

---


## Code Quality Enforcement

> Every line of code must be intentional. No lazy shortcuts, no sloppy patterns, no dead weight, no hidden risks. This section defines what "clean code" means across all projects and how to enforce it.


### Industry Best Practices (Non-Negotiable)

| Category                    | Standard                                                                        | Enforcement                                |
|-----------------------------|---------------------------------------------------------------------------------|--------------------------------------------|
| **DRY (Don't Repeat Yourself)** | No duplicated logic across files — extract shared utilities                | Code review + grep for duplicate patterns  |
| **SOLID Principles**        | Single responsibility per function/component, open for extension               | Code review, max function length 50 lines  |
| **KISS (Keep It Simple)**   | Simplest solution that works — no premature abstraction or over-engineering    | Code review                                |
| **YAGNI (You Ain't Gonna Need It)** | Don't build for hypothetical future requirements                       | Code review — reject speculative code      |
| **Separation of Concerns**  | UI, business logic, data access, and config are in separate layers             | File organization audit                    |
| **Single Source of Truth**   | Every piece of data has ONE authoritative location                             | Grep for duplicate type definitions        |
| **Fail Fast**               | Validate early, throw early, surface errors at the boundary                    | Code review                                |
| **Least Surprise**          | Code does what its name says — no hidden side effects                          | Naming review + code review                |
| **Clean Boundaries**        | External services wrapped in adapters — never coupled directly                 | Architecture review                        |
| **Immutability by Default**  | Prefer `const`, avoid mutation, use spread/map over push/splice               | Lint rules + code review                   |


### Code Smell Detection — Automated Scans

Run these scans on every project. Zero tolerance for results in production code.

**Lazy Code Patterns:**
```bash
# Unused variables and imports
pnpm tsc --noEmit --noUnusedLocals --noUnusedParameters

# Empty catch blocks (swallowed errors)
grep -rn "catch\s*{" src/ --include="*.ts" --include="*.tsx"
grep -rn "catch\s*(\w*)\s*{}" src/ --include="*.ts" --include="*.tsx"

# TODO/FIXME/HACK left in production code
grep -rn "TODO\|FIXME\|HACK\|XXX\|TEMP\|TEMPORARY" src/ --include="*.ts" --include="*.tsx"

# Console statements left in production
grep -rn "console\.\(log\|warn\|error\|debug\|info\)" src/ --include="*.ts" --include="*.tsx"

# Commented-out code blocks (dead code)
grep -rn "^\s*//.*function\|^\s*//.*const\|^\s*//.*return\|^\s*//.*import" src/ --include="*.ts" --include="*.tsx"

# Magic numbers (unexplained numeric literals)
grep -rn "[^0-9]\([2-9][0-9]\{2,\}\|[1-9][0-9]\{3,\}\)[^0-9px%em]" src/ --include="*.ts" --include="*.tsx"
```

**Bad Code Patterns:**
```bash
# Deeply nested callbacks/conditions (>3 levels)
grep -rn "if.*{" src/ --include="*.ts" --include="*.tsx" | awk '{n=gsub(/{/,"{"); if(n>3) print}'

# Functions longer than 50 lines
awk '/^(export )?(async )?(function|const)/{start=NR} /^}/{if(NR-start>50) print FILENAME":"start"-"NR}' src/**/*.ts src/**/*.tsx

# Any type usage
grep -rn ": any\b\|as any\b\|<any>" src/ --include="*.ts" --include="*.tsx"

# Non-null assertions
grep -rn "\w!\." src/ --include="*.ts" --include="*.tsx"

# Type assertions without runtime check
grep -rn "as [A-Z]\w*[^>]" src/ --include="*.ts" --include="*.tsx"

# Synchronous file operations in server code
grep -rn "readFileSync\|writeFileSync\|existsSync" src/ --include="*.ts"

# Unbounded queries (missing LIMIT)
grep -rn "\.select(" src/ --include="*.ts" | grep -v "\.limit\|\.range\|\.single\|\.maybeSingle"
```

**Untidy Code Patterns:**
```bash
# Inconsistent spacing (tabs mixed with spaces)
grep -rPn "\t" src/ --include="*.ts" --include="*.tsx"

# Trailing whitespace
grep -rn "\s$" src/ --include="*.ts" --include="*.tsx"

# Multiple consecutive blank lines (>2)
awk '/^$/{blank++; if(blank>2) print FILENAME":"NR} /[^ ]/{blank=0}' src/**/*.ts src/**/*.tsx

# Files exceeding 500 lines
find src/ -name "*.ts" -o -name "*.tsx" | xargs wc -l | awk '$1>500 && !/total/ {print}'

# Inconsistent naming (camelCase mixed with snake_case in same file)
grep -rn "_[a-z]" src/ --include="*.ts" --include="*.tsx" | grep -v "import\|require\|//\|__\|env\.\|data-\|aria-"
```

**Malicious / Suspicious Code Patterns:**
```bash
# Eval and dynamic code execution
grep -rn "eval\s*(\|new Function\s*(\|setTimeout\s*(['\"]" src/ --include="*.ts" --include="*.tsx"

# Obfuscated code (base64 encoded strings)
grep -rn "atob\|btoa\|Buffer\.from.*base64" src/ --include="*.ts" --include="*.tsx"

# External data exfiltration attempts
grep -rn "fetch\s*(\s*['\"]http" src/ --include="*.ts" --include="*.tsx" | grep -v "localhost\|supabase"

# Backdoor patterns (hidden admin access)
grep -rn "backdoor\|bypass\|override.*auth\|skip.*auth\|master.*key" src/ --include="*.ts" --include="*.tsx"

# Injected script tags
grep -rn "<script\|document\.write\|\.innerHTML\s*=" src/ --include="*.ts" --include="*.tsx"

# Unauthorized environment variable access
grep -rn "process\.env\." src/app/ --include="*.tsx" | grep -v "NEXT_PUBLIC_"

# Crypto mining or unauthorized network calls
grep -rn "WebSocket\|crypto\.subtle\|crypto\.getRandomValues" src/ --include="*.ts" --include="*.tsx"

# Data sent to unknown endpoints
grep -rn "XMLHttpRequest\|navigator\.sendBeacon" src/ --include="*.ts" --include="*.tsx"
```


### Code Review Checklist (Every PR / Session)

| #   | Check                                                                  | Category    |
|-----|------------------------------------------------------------------------|-------------|
| 1   | Does every function do ONE thing?                                      | Clean Code  |
| 2   | Are variable names descriptive and unambiguous?                        | Readability |
| 3   | Are there any magic numbers or hardcoded strings that should be constants? | Readability |
| 4   | Is error handling complete? No swallowed exceptions?                   | Robustness  |
| 5   | Are all edge cases handled (null, empty, undefined)?                   | Robustness  |
| 6   | Does the code follow existing patterns in the codebase?               | Consistency |
| 7   | Are there any unnecessary dependencies or imports?                     | Performance |
| 8   | Is there any duplicated logic that should be extracted?                | DRY         |
| 9   | Could this code be simpler without losing functionality?               | KISS        |
| 10  | Are types strict and specific (no `any`, no loose unions)?             | Type Safety |
| 11  | Is the code self-documenting (clear names > comments)?                 | Readability |
| 12  | Are all API responses validated before use?                            | Security    |
| 13  | Are user inputs sanitized at system boundaries?                        | Security    |
| 14  | Does the code handle network failures gracefully?                      | R3S         |
| 15  | Is there a static fallback if the dynamic data source fails?           | R3S         |
| 16  | Are all strings user-facing? If so, are they inclusive?                | Inclusive   |


### Technical Debt Classification

| Class   | Description                                              | Action                       | Max Lifespan   |
|---------|----------------------------------------------------------|------------------------------|----------------|
| **TD-1**| Shortcuts taken knowingly with a plan to fix             | Track in AUDIT.md            | 2 sessions     |
| **TD-2**| Deprecated patterns that still work but need migration   | Schedule in next sprint      | 1 month        |
| **TD-3**| Architecture limitations that constrain growth            | Plan migration path          | 1 quarter      |
| **TD-4**| Legacy code inherited with no tests                      | Write tests before modifying | Before next deploy |

**Rules:**
- Never accumulate more than 5 TD-1 items — if you hit 5, clear before creating more
- Every TD item must have an owner and a target resolution date
- TD items are reviewed every session in the `AUDIT.md` health check

---


## Meta-Audit — The Audit That Audits the Auditor

> Standards are worthless if they aren't enforced, reviewed, and challenged. This section ensures the standards themselves stay sharp, current, and honest.


### Self-Assessment Schedule

| Frequency    | Audit Type                                       | Who Reviews         | Output                              |
|--------------|--------------------------------------------------|---------------------|--------------------------------------|
| **Every session** | Quick compliance check against this document | AI + Developer      | Issues logged in AUDIT.md            |
| **Weekly**   | Security scan (all automated patterns above)     | Developer           | 0 findings or tracked as TD-1        |
| **Monthly**  | Full pillar review (all 8 pillars scored)        | Developer           | Updated scorecard in AUDIT.md        |
| **Quarterly**| Standards document review — is anything outdated?| Developer           | Updated IO Project Standards         |
| **Annually** | External audit or peer review                    | External reviewer   | Written report + action items        |


### Standards Validation Questions

Ask these every quarter. If the answer to any is "no," the standard is failing.

**Effectiveness:**
1. Has this standard prevented at least one real issue in the last 90 days?
2. Can a new developer understand and follow this standard without asking questions?
3. Is this standard automated or automatable? If not, is manual enforcement realistic?

**Currency:**
4. Are all referenced technologies still current and maintained?
5. Do the security patterns reflect current OWASP guidance (not 2+ years old)?
6. Are the Lighthouse targets still industry-standard, or should they be higher?

**Completeness:**
7. Has any new vulnerability type emerged that these standards don't cover?
8. Has any new accessibility standard been published that should be incorporated?
9. Are there code patterns in production that no standard currently catches?

**Enforcement:**
10. Are all automated scans actually running before each deploy?
11. Were any standards violated in the last 90 days? If so, why wasn't it caught?
12. Is the AUDIT.md being updated every session as required?


### Audit Integrity Checks

| Check                                         | Method                                                           | Frequency     |
|-----------------------------------------------|------------------------------------------------------------------|---------------|
| **AUDIT.md freshness**                        | Verify last-modified date < 7 days                               | Every session |
| **HANDOFF.md freshness**                      | Verify last-modified date < 7 days                               | Every session |
| **Scorecard accuracy**                        | Re-run all quality gates, compare to claimed scores              | Monthly       |
| **False negatives**                           | Manually inject known bad patterns, verify scans catch them      | Quarterly     |
| **Prohibited patterns zero-check**            | Run all scan commands — must return 0 results                    | Every deploy  |
| **Dependency freshness**                      | Compare locked versions to latest stable releases                | Monthly       |
| **Documentation-code sync**                   | Verify types/routes in docs match actual codebase                | Monthly       |
| **Recovery drill**                            | Simulate failure scenario, verify recovery within SLA            | Quarterly     |


### Continuous Improvement Log

Track what was changed, why, and what triggered the change.

```markdown
## Standards Change Log

| Date       | Section Changed          | What Changed                   | Why                                              |
|------------|--------------------------|--------------------------------|--------------------------------------------------|
| YYYY-MM-DD | [Section]                | [Brief description]            | [What triggered this: incident, audit, new info] |
```

**Rules:**
- Every change to this document must be logged
- Changes must reference what triggered them (incident, audit finding, new industry guidance)
- Reverted changes must also be logged with rationale
- Review the change log quarterly for patterns (are the same sections changing repeatedly?)


### Grading the Standards Themselves

Score this document quarterly:

| Dimension                 | Question                                                           | Score /10 |
|---------------------------|--------------------------------------------------------------------|-----------|
| **Coverage**              | Does every code pattern have a standard?                           |           |
| **Enforceability**        | Can every standard be checked automatically or in < 2 minutes?     |           |
| **Clarity**               | Can a junior developer understand every rule without guidance?      |           |
| **Currency**              | Are all references, tools, and patterns current?                    |           |
| **Adoptability**          | Can this document be dropped into a new project and work?           |           |
| **Completeness**          | Are all 8 pillars + security + quality + deployment covered?        |           |
| **Maintenance burden**    | Is this document under 1000 lines and well-organized?               |           |
| **Effectiveness**         | Did following this document prevent real issues?                    |           |
| **Overall**               |                                                                     | **/10**   |

**Target: 9+/10.** If below 8, schedule immediate review and updates.

---


## Prohibited Actions (Every Project)

- **Never `git push --force`** to any shared branch
- **Never commit `.env`** or any file containing secrets
- **Never use `dangerouslySetInnerHTML`** with user-supplied data
- **Never use `any` type** in TypeScript
- **Never pass raw request body** to database `.update()`
- **Never store tokens in localStorage** — httpOnly cookies only
- **Never expose service/secret keys** to the client
- **Never skip auth checks** on admin/protected routes
- **Never delete user data** without explicit confirmation UI
- **Never log PII** (names, emails, phone numbers, ages)
- **Never ship without passing quality gates**
- **Never use `eval()`** or `new Function()` with any input
- **Never skip hooks** (`--no-verify`) or bypass signing

---


## Project Scorecard (Track Across All Projects)

| Project        | Security | Quality | A11y | Performance | UD/UDL | R3S | Tests | Docs | Overall |
|----------------|----------|---------|------|-------------|--------|-----|-------|------|---------|
| OrcaChild      | A        | A       | A    | A           | A-     | B+  | A     | A    | **A**   |
| PraxisLibrary  | A+       | A       | A    | A+          | A      | A   | N/A*  | A+   | **A+**  |
| Colour Parlor  | A        | A-      | A-   | A           | B+     | A-  | B     | A    | **A-**  |
| KAR            | C        | A       | C    | B+          | C      | D   | D     | B+   | **B-**  |

*PraxisLibrary uses systematic audit instead of automated tests

---

*This document is a living standard. Update it when patterns are confirmed across multiple projects. Delete anything that proves wrong. Keep it under 1000 lines.*
