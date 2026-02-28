# Phase 1: Foundation — Implementation Plan

## Context

BuiltByBas has zero application code — only governance docs from 5 setup sessions. Phase 1 builds the entire technical foundation: Next.js project, design system, route structure, layouts, database, auth, testing, and CI/CD. This is the "pour the concrete" session — everything that follows (public site, CRM, portal) builds on what we lay down here.

**ORM Decision: Drizzle** — SQL-first, lightweight, TypeScript inference, closer to KAR patterns.

---

## Step 1: Initialize Next.js Project

**What:** Scaffold Next.js with App Router, TypeScript strict, pnpm, src/ directory.

**Commands:**
```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```

Note: Running in existing directory — will merge with governance files already present.

**Post-init adjustments:**
- Verify `tsconfig.json` has `"strict": true`
- Remove default boilerplate from `src/app/page.tsx` and `src/app/layout.tsx`
- Remove default `globals.css` content (replace with our design tokens)
- Update `next.config.ts` with security headers (from KAR pattern)
- Verify `postcss.config.mjs` has `@tailwindcss/postcss`

**Files created/modified:**
- `package.json` (new)
- `tsconfig.json` (new)
- `next.config.ts` (new)
- `postcss.config.mjs` (new)
- `src/app/layout.tsx` (new — will overwrite)
- `src/app/page.tsx` (new — will overwrite)
- `src/app/globals.css` (new — will overwrite)
- `pnpm-lock.yaml` (new)

**Verify:** `pnpm dev` starts without errors, `pnpm build` succeeds.

---

## Step 2: Install Core Dependencies

**What:** Add all Phase 1 dependencies in one batch.

**Production deps:**
```bash
pnpm add drizzle-orm pg framer-motion zod bcryptjs lucide-react class-variance-authority clsx tailwind-merge
```

**Dev deps:**
```bash
pnpm add -D drizzle-kit @types/pg @types/bcryptjs vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @playwright/test axe-core @axe-core/playwright
```

**shadcn/ui init:**
```bash
pnpm dlx shadcn@latest init
```
Config: New York style, RSC enabled, neutral base color, CSS variables, `@/components/ui` alias.

**shadcn components (initial batch):**
```bash
pnpm dlx shadcn@latest add button card input label toast sonner
```

**Files modified:** `package.json`, `pnpm-lock.yaml`, `components.json` (new)

**Verify:** `pnpm build` still succeeds after all installs.

---

## Step 3: Design System Foundation

**What:** Set up globals.css with design tokens, create base design system utilities.

### 3a. `src/app/globals.css`
- Tailwind v4 imports (`@import "tailwindcss"`)
- CSS custom properties for the design system:
  - `--background: #0A0A0F` (deep dark)
  - `--foreground: #FAFAFA` (white text)
  - `--primary: #00D4FF` (electric cyan)
  - `--primary-hover: #0EA5E9` (sky blue)
  - `--glass-bg: rgba(255,255,255,0.05)`
  - `--glass-border: rgba(255,255,255,0.1)`
  - `--glass-blur: 20px`
- shadcn/ui theme variables (dark mode by default)
- Base styles: `html { scroll-behavior: smooth }`, font smoothing
- Utility classes: `.glass-card`, `.neon-glow`, `.text-gradient`
- `@media (prefers-reduced-motion: reduce)` — disable animations

### 3b. `src/lib/utils.ts`
- `cn()` helper (clsx + tailwind-merge) — standard shadcn pattern

### 3c. `src/components/shared/GlassCard.tsx`
- Glassmorphism card component: `bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl`
- Accepts `children`, `className`, optional `hover` prop for glow effect
- Server component compatible

### 3d. `src/components/shared/SkipToContent.tsx`
- Accessibility skip link (WCAG requirement)
- Visually hidden until focused, jumps to `#main-content`

### 3e. `src/components/shared/ErrorBoundary.tsx`
- React error boundary with fallback UI
- Logs error info, shows user-friendly message
- "Try again" button to reset

**Files created:**
- `src/app/globals.css` (overwrite scaffolded version)
- `src/lib/utils.ts` (new)
- `src/components/shared/GlassCard.tsx` (new)
- `src/components/shared/SkipToContent.tsx` (new)
- `src/components/shared/ErrorBoundary.tsx` (new)

---

## Step 4: Route Groups & Placeholder Pages

**What:** Create the App Router route group structure with minimal placeholder pages.

### Directory structure:
```
src/app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page (public)
├── globals.css
├── (public)/
│   ├── services/page.tsx
│   ├── portfolio/page.tsx
│   ├── about/page.tsx
│   └── intake/page.tsx
├── (auth)/
│   ├── layout.tsx          # Centered auth layout
│   └── login/page.tsx
├── admin/
│   ├── layout.tsx          # Admin layout with sidebar
│   └── page.tsx            # Admin dashboard
└── portal/
    ├── layout.tsx          # Portal layout
    └── page.tsx            # Portal dashboard
```

Each placeholder page: simple server component with page title text. Just enough to verify routing works.

**Files created:** ~12 page/layout files

---

## Step 5: Base Layouts

**What:** Build the layout components that frame each application section.

### 5a. Root Layout (`src/app/layout.tsx`)
- `<html lang="en" className="dark">` (dark mode by default)
- Font loading via `next/font/google` (Inter for body, font-display: swap)
- `<SkipToContent />` as first child
- Metadata: default title template `%s - BuiltByBas`, description, OG defaults
- `<body>` with base dark background

### 5b. Public Header (`src/components/layout/PublicHeader.tsx`)
- Logo/wordmark left, nav links right
- Glass navbar: `backdrop-blur-xl bg-white/5 border-b border-white/10`
- Mobile hamburger menu (768px breakpoint)
- Nav: Home, Services, Portfolio, About, "Start a Project" CTA button
- Sticky on scroll

### 5c. Public Footer (`src/components/layout/PublicFooter.tsx`)
- Logo, tagline, copyright
- Quick links, contact info
- Social links (placeholder)
- `<footer>` semantic element

### 5d. Admin Layout (`src/app/admin/layout.tsx`)
- Sidebar + main content area
- Uses `AdminSidebar` component
- `<main id="main-content">` wrapper

### 5e. Admin Sidebar (`src/components/layout/AdminSidebar.tsx`)
- Glass sidebar: dark, fixed left
- Nav items: Dashboard, Clients, Pipeline, Projects, Proposals, Invoices, Analytics, Settings
- Lucide icons for each
- Active state highlighting
- Collapsible on mobile

### 5f. Auth Layout (`src/app/(auth)/layout.tsx`)
- Centered card on dark background
- Minimal — just logo + form area

### 5g. Portal Layout (`src/app/portal/layout.tsx`)
- Simpler sidebar (My Projects, Invoices, Messages)
- Client-branded header area

**Files created:**
- `src/components/layout/PublicHeader.tsx`
- `src/components/layout/PublicFooter.tsx`
- `src/components/layout/AdminSidebar.tsx`
- Updated layout files from Step 4

---

## Step 6: TypeScript Types Foundation

**What:** Create the core type definitions the app will use.

### 6a. `src/types/auth.ts`
- `UserRole = "owner" | "team" | "client"`
- `User` — id, email, name, role, createdAt
- `Session` — id, userId, expiresAt
- `SessionPayload` — for cookie data

### 6b. `src/types/api.ts`
- `ApiResponse<T>` — `{ success: true, data: T } | { success: false, error: string }`
- `PaginatedResponse<T>` — adds total, page, limit
- `ApiError` — status, message

**Files created:**
- `src/types/auth.ts`
- `src/types/api.ts`

---

## Step 7: Database Setup (Drizzle + PostgreSQL)

**What:** Configure Drizzle ORM, create initial schema (users table for auth), migration setup.

### 7a. `src/lib/db.ts`
- PostgreSQL connection via `pg` Pool
- Drizzle wrapper: `drizzle(pool)`
- Connection pooling (max 10 connections)
- Graceful shutdown handler
- Uses `DATABASE_URL` from env

### 7b. `src/lib/schema.ts`
- Drizzle schema definitions using `pgTable`:
  - `users` table: id (uuid), email (unique), passwordHash, name, role (enum: owner/team/client), createdAt, updatedAt
  - `sessions` table: id (uuid), userId (FK), expiresAt, createdAt
- Indexes: email unique, sessions userId

### 7c. `drizzle.config.ts`
- Drizzle Kit config for migrations
- Schema path, output directory, PostgreSQL connection

### 7d. Package.json scripts:
- `"db:generate": "drizzle-kit generate"`
- `"db:migrate": "drizzle-kit migrate"`
- `"db:studio": "drizzle-kit studio"`

**Files created:**
- `src/lib/db.ts`
- `src/lib/schema.ts`
- `drizzle.config.ts`
- Updated `package.json` scripts

**Verify:** `pnpm db:generate` creates migration files.

---

## Step 8: Authentication System

**What:** Custom auth with httpOnly cookies, bcrypt, RBAC middleware.

### 8a. `src/lib/auth.ts`
- `hashPassword(plain)` — bcrypt hash (cost 12)
- `verifyPassword(plain, hash)` — bcrypt compare
- `createSession(userId)` — create session row, set httpOnly cookie
- `getSession()` — read cookie, validate against DB, return user
- `destroySession()` — delete session row, clear cookie
- Cookie config: httpOnly, secure (prod), sameSite strict, path /, maxAge 7 days

### 8b. `src/middleware.ts` (Next.js middleware)
- Route protection matrix:
  - `/admin/*` → requires owner or team role
  - `/portal/*` → requires client role
  - `/api/admin/*` → requires owner or team role
  - `/api/portal/*` → requires client role
  - `/login` → redirect to dashboard if already authenticated
  - Everything else → public
- Reads session cookie, validates, checks role
- Returns 401/403 for API routes, redirects for page routes

### 8c. `src/lib/validation.ts` (initial schemas)
- `loginSchema` — email (string, email format), password (string, min 8)
- Exported for use in API routes

### 8d. `src/app/api/auth/login/route.ts`
- POST: validate with Zod, find user by email, verify password, create session
- Rate limiting: in-memory map (5 attempts / 15 min / IP)
- Generic error: "Invalid email or password"

### 8e. `src/app/api/auth/logout/route.ts`
- POST: destroy session, clear cookie

### 8f. `src/app/api/auth/session/route.ts`
- GET: return current user (or 401)

### 8g. `src/app/(auth)/login/page.tsx`
- Login form with email + password fields
- Client component (needs form state)
- Error display, loading state
- Redirects to `/admin` or `/portal` based on role

### 8h. `src/lib/sanitize.ts`
- `escapeHtml()` — escape `<>&"'` characters
- `sanitizeString()` — trim, escape
- Pattern from KAR's sanitize.ts

**Files created:**
- `src/lib/auth.ts`
- `src/middleware.ts`
- `src/lib/validation.ts`
- `src/lib/sanitize.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/session/route.ts`
- `src/app/(auth)/login/page.tsx` (updated from placeholder)

---

## Step 9: Security Headers

**What:** Add comprehensive security headers to `next.config.ts`.

Headers (applied to all routes):
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy` — restrictive default, allow self + inline styles (Tailwind)

**Files modified:** `next.config.ts`

---

## Step 10: Testing Infrastructure

**What:** Configure Vitest and Playwright with project-specific settings.

### 10a. `vitest.config.ts`
- Plugin: `@vitejs/plugin-react`
- Environment: node default, jsdom for .tsx tests
- Path alias: `@/ → ./src/`
- Setup file: `src/test-setup.ts`
- Include: `src/**/*.test.{ts,tsx}`
- Coverage: v8 provider, include src/lib/** and src/app/api/**, exclude src/components/ui/**

### 10b. `src/test-setup.ts`
- Import `@testing-library/jest-dom` matchers

### 10c. `playwright.config.ts`
- Test dir: `tests/e2e/`
- Chromium only
- Base URL: localhost:3000
- Web server: `pnpm dev`
- Trace on first retry, screenshot on failure

### 10d. Package.json scripts:
- `"test": "vitest run"`
- `"test:watch": "vitest"`
- `"test:coverage": "vitest run --coverage"`
- `"test:e2e": "playwright test"`

### 10e. First tests:
- `src/lib/utils.test.ts` — test `cn()` helper
- `src/lib/sanitize.test.ts` — test escapeHtml, sanitizeString
- `src/lib/validation.test.ts` — test loginSchema

**Files created:**
- `vitest.config.ts`
- `src/test-setup.ts`
- `playwright.config.ts`
- `src/lib/utils.test.ts`
- `src/lib/sanitize.test.ts`
- `src/lib/validation.test.ts`

**Verify:** `pnpm test` runs and all tests pass.

---

## Step 11: SEO Foundation

**What:** Set up robots.txt, sitemap, and base metadata.

### 11a. `src/app/robots.ts`
- Allow all public routes
- Disallow: `/admin/`, `/portal/`, `/api/`
- Sitemap reference

### 11b. `src/app/sitemap.ts`
- Static entries: home, services, portfolio, about, intake
- Dynamic entries will be added later (portfolio items)

### 11c. Root layout metadata (already in Step 5a):
- Title template: `%s - BuiltByBas`
- Default description
- OG defaults (image, type, site name)
- Twitter card: summary_large_image

### 11d. `src/app/(public)/layout.tsx`
- JSON-LD Organization schema in `<script type="application/ld+json">`
- Uses `JSON.stringify()` (safe, no dangerouslySetInnerHTML needed for Next.js metadata API)

**Files created:**
- `src/app/robots.ts`
- `src/app/sitemap.ts`

---

## Step 12: CI/CD & Linting Updates

**What:** Ensure CI pipeline works with real commands. Update ESLint config.

### 12a. ESLint config
- Verify Next.js ESLint config is present
- Add rule: no `console.log` in `src/app/api/` (warn)
- Add rule: no explicit `any`

### 12b. `.github/workflows/ci.yml` — already correct (no changes needed)
The existing CI file already has the right commands: pnpm lint, tsc --noEmit, pnpm test, pnpm build, pnpm audit.

### 12c. Package.json script verification:
- `lint`, `build`, `dev`, `start` — from Next.js init
- `test`, `test:watch`, `test:coverage` — Vitest
- `test:e2e` — Playwright
- `db:generate`, `db:migrate`, `db:studio` — Drizzle

**Verify:** `pnpm lint && pnpm tsc --noEmit && pnpm test && pnpm build` — all pass.

---

## Step 13: Seed Script (Optional, if time allows)

**What:** Create a seed script to insert the owner user (Bas) for testing auth.

### 13a. `scripts/seed.ts`
- Creates owner user with hashed password
- Uses Drizzle to insert into users table
- Run via: `pnpm tsx scripts/seed.ts`

**Files created:** `scripts/seed.ts`

---

## File Summary

**New files (~35):**
- Config: `next.config.ts`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `postcss.config.mjs`, `drizzle.config.ts`, `components.json`, `package.json`
- App: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/robots.ts`, `src/app/sitemap.ts`
- Route groups: `src/app/(public)/services/page.tsx`, `portfolio/page.tsx`, `about/page.tsx`, `intake/page.tsx`
- Auth routes: `src/app/(auth)/layout.tsx`, `login/page.tsx`
- Admin: `src/app/admin/layout.tsx`, `admin/page.tsx`
- Portal: `src/app/portal/layout.tsx`, `portal/page.tsx`
- API: `src/app/api/auth/login/route.ts`, `logout/route.ts`, `session/route.ts`
- Components: `GlassCard.tsx`, `SkipToContent.tsx`, `ErrorBoundary.tsx`, `PublicHeader.tsx`, `PublicFooter.tsx`, `AdminSidebar.tsx`
- Lib: `db.ts`, `schema.ts`, `auth.ts`, `validation.ts`, `sanitize.ts`, `utils.ts`
- Types: `auth.ts`, `api.ts`
- Tests: `utils.test.ts`, `sanitize.test.ts`, `validation.test.ts`
- Middleware: `src/middleware.ts`
- Setup: `src/test-setup.ts`

**Modified files:**
- `.github/workflows/ci.yml` (minimal if any)
- `package.json` (scripts + deps)

---

## Verification

After all steps complete:

1. **Dev server:** `pnpm dev` — starts without errors, home page renders with dark theme
2. **Build:** `pnpm build` — compiles with zero errors
3. **Type check:** `pnpm tsc --noEmit` — zero type errors
4. **Lint:** `pnpm lint` — zero errors
5. **Tests:** `pnpm test` — all unit tests pass (utils, sanitize, validation)
6. **Routes:** Navigate to `/`, `/services`, `/about`, `/login`, `/admin`, `/portal` — all render
7. **Design:** Dark background visible, glassmorphism card renders, cyan accents present
8. **Accessibility:** Skip-to-content link visible on focus, semantic HTML in layouts
9. **SEO:** `/robots.txt` and `/sitemap.xml` accessible

---

## What This Session Delivers

A fully scaffolded, buildable, testable Next.js application with:
- Dark glassmorphism design system
- Route structure for all 3 apps (public, admin, portal)
- Base layouts with navigation
- Database connection ready (Drizzle + PostgreSQL)
- Authentication system (login, sessions, RBAC)
- Testing infrastructure (Vitest + Playwright)
- SEO foundation (robots, sitemap, metadata)
- Security headers
- All passing: lint, types, tests, build

**Phase 2 (Public Website) can start immediately after this.**
