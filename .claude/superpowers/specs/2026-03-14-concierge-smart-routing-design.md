# Concierge Smart Routing Redesign

> **Date:** 2026-03-14
> **Status:** Approved (brainstorming complete)
> **Author:** Bas Rosario + Claude (#OneTeam)

---

## 1. Problem Statement

The current homepage concierge captures only 2 data points (category + priority) across 5 screens, with 3 screens capturing no data at all. The payoff screen is a portfolio showcase — flash, not substance. Clients then land in the intake form and re-answer questions the concierge should have already captured.

Every tap should capture a vital piece of qualifying information. The concierge should be the intelligent front door to the intake system — routing clients to exactly the right form with data already pre-filled.

---

## 2. Design Principles

- **Every tap captures data.** No throwaway screens, no filler.
- **No double-asking.** Data captured in the concierge pre-fills the intake form. Steps already answered are skipped.
- **Safety and security over speed and flash.** Substance over showcase. Trust over theatrics.
- **Smart routing.** The system knows which form to send the client to based on their answers.
- **Escape hatches everywhere.** "Something else" options prevent dead ends. Back button always available.

---

## 3. Flow Architecture

```text
WELCOME (click anywhere)
  |
  v
CATEGORY -- "What are we building?"
  |-- A Website
  |-- A Web App or Dashboard
  |-- A Full Platform
  |-- Something Else
  |
  v
QUALIFIER -- (skipped for "Something Else")
  |
  |  Website:           "Is this a..."
  |    |-- A brand new site          -> marketing-website
  |    |-- A redesign                -> website-redesign
  |    +-- A single landing page     -> landing-page
  |
  |  Web App/Dashboard: "What kind of tool?"
  |    |-- A dashboard for my data   -> business-dashboard
  |    |-- A portal for my clients   -> client-portal
  |    |-- Track leads and sales     -> crm-system
  |    |-- A tool powered by AI      -> ai-tools
  |    +-- Something else            -> expanded list (see Section 7)
  |
  |  Full Platform:     "What does it need to do?"
  |    |-- Run my business ops       -> full-platform
  |    |-- Sell products online      -> ecommerce
  |    +-- Something else            -> expanded list (see Section 7)
  |
  v
PRIORITY -- "What matters most in this project?"
  |  (category-specific options, see Section 5)
  |
  v
TIMELINE -- "When do you need this?"
  |-- ASAP -- I needed this yesterday
  |-- 2-4 weeks
  |-- 5-6 weeks
  +-- Flexible -- quality over speed
  |
  v
CONFIRMATION -- "Here's what we heard" (4.44s auto-transition)
  |  Displays: service name + priority + timeline in natural language
  |  Back button available to correct selections
  |  Tap anywhere to skip countdown and navigate immediately
  |
  v
AUTO-ROUTE to /intake?service={id}&priority={id}&timeline={id}
```

**Data captured per path:**

| Path | Data Points | Notes |
| --- | --- | --- |
| Website / WebApp / Platform | 4 (category, service, priority, timeline) | Qualifier narrows to exact service |
| Something Else | 3 (category, priority, timeline) | No qualifier; full service selection in intake form |

---

## 4. Screen-by-Screen Specification

### Screen 1: Welcome

- Existing welcome screen (brand moment, tagline, CTA)
- "Click Anywhere to Get Started" in bright white with white glow animation
- Click/tap anywhere advances to Category screen
- No data captured

### Screen 2: Category

- Headline: "What are we building?"
- 4 options (same ConciergeOption card pattern):
  - A Website (Globe icon)
  - A Web App or Dashboard (LayoutDashboard icon)
  - A Full Platform (Layers icon)
  - Something Else (Sparkles icon)
- Selection advances to Qualifier (or Priority for "Something Else")
- Data captured: category ID

### Screen 3: Qualifier

- **Skipped entirely for "Something Else"** (goes straight to Priority)
- Headline varies by category (see Section 3 for exact wording)
- Options map directly to intake service module IDs
- "Something else" sub-option available for WebApp and Platform categories (see Section 7)
- Selection advances to Priority
- Data captured: exact service ID

### Screen 4: Priority

- Headline: "What matters most in this project?"
- 3 options per category (see Section 5)
- Selection advances to Timeline
- Data captured: priority ID

### Screen 5: Timeline

- Headline: "When do you need this?"
- 4 options:
  - ASAP -- I needed this yesterday
  - 2-4 weeks
  - 5-6 weeks
  - Flexible -- quality over speed
- Selection advances to Confirmation
- Data captured: timeline ID

### Screen 6: Confirmation

- Headline: "Here's what we heard."
- Dynamic summary in natural language:

  ```text
  You're looking for a [new marketing website].
  [Design] matters most.
  And you need it [ASAP].

  We've got the right form ready for you.
  ```
- Subtle progress bar fills over 4.44 seconds
- After 4.44s, auto-navigates to `/intake?service={id}&priority={id}&timeline={id}`
- Back button visible throughout — returns to Timeline screen, all previously captured data preserved
- Tap anywhere during countdown to navigate immediately (power users)
- Reduced motion: no fill bar animation, still displays for 4.44s

**"Something Else" confirmation variant:**

```text
You've got something unique in mind.
[Quality] matters most.
And you're [flexible on timing].

Let's find the right fit together.
```

---

## 5. Priority Options by Category

### Website

| ID | Label | Focus |
| --- | --- | --- |
| design | It needs to look incredible | Design |
| speed | It needs to be fast and reliable | Performance |
| budget | I need it done right, on budget | Value |

### Web App / Dashboard

| ID | Label | Focus |
| --- | --- | --- |
| realtime | Real-time data and visibility | Data |
| ux | An experience my team will actually use | UX |
| scale | It needs to grow with us | Scale |

### Full Platform

| ID | Label | Focus |
| --- | --- | --- |
| control | End-to-end control over everything | Control |
| portal | A portal my clients will love | Client-facing |
| growth | Built to scale as we grow | Growth |

### Something Else (generic)

| ID | Label | Focus |
| --- | --- | --- |
| quality | Quality -- built right, no shortcuts | Quality |
| speed | Speed -- I need this fast | Speed |
| budget | Budget -- I need it done smart | Budget |

---

## 6. Data Model and ID Reference

### New ConciergeScreen Type

The existing screen type `"welcome" | "greeting" | "followup" | "matching" | "payoff"` is replaced with:

```typescript
"welcome" | "category" | "qualifier" | "qualifier-expanded" | "priority" | "timeline" | "confirmation"
```

Renamed for clarity: "greeting" becomes "category", "followup" becomes "priority". "matching" and "payoff" are removed.

### Service ID Reference Table

All concierge service IDs use the **intake namespace** (matching `useIntakeForm` expectations).

| Qualifier Option | Query Param Value | Intake Module ID |
| --- | --- | --- |
| A brand new site | marketing-website | marketing-website |
| A redesign | website-redesign | website-redesign |
| A single landing page | landing-page | landing-page |
| A dashboard for my data | business-dashboard | business-dashboard |
| A portal for my clients | client-portal | client-portal |
| Track leads and sales | crm-system | crm-system |
| A tool powered by AI | ai-tools | ai-tools |
| Run my business ops | full-platform | full-platform |
| Sell products online | ecommerce | ecommerce |

### Timeline ID Mapping

The concierge introduces new timeline values that replace the intake form's existing options. The intake form's `TimelineBudgetStep` and `timelineBudgetSchema` must be updated to use these new values.

| Concierge Option | Query Param Value | Replaces (old intake value) |
| --- | --- | --- |
| ASAP -- I needed this yesterday | asap | asap (same) |
| 2-4 weeks | 2-4-weeks | 1-3-months (replaced) |
| 5-6 weeks | 5-6-weeks | 3-6-months (replaced) |
| Flexible -- quality over speed | flexible | flexible (same) |

**Migration note:** The intake form's timeline radio options must be updated to match these new values. Any existing submissions with old timeline values (`1-3-months`, `3-6-months`) remain valid in the database but new submissions will use the new IDs.

### IntakeFormData Changes

Add `conciergePriority` field to `IntakeFormData`:

```typescript
// Add to IntakeFormData interface
conciergePriority: string;  // e.g. "design", "realtime", "quality"

// Add to INITIAL_FORM_DATA
conciergePriority: "",
```

Update `fullIntakeSchema` in `intake-validation.ts`:

```typescript
// Add as optional (not required — direct /intake visitors won't have it)
conciergePriority: z.string().optional().default(""),
```

The `timeline` field already exists in `IntakeFormData` — concierge pre-fills it via query param, no new field needed.

### State Management on Reset

The `concierge-reset` event handler must clear all state: category, service, priority, timeline. No stale data should persist when the user clicks Home to restart.

### Invalid Query Params

If `/intake` receives invalid or unrecognized query params (e.g., `?service=bogus`), the form silently ignores them and shows the full default experience (all steps, no pre-fills).

### localStorage Draft vs Concierge Pre-fill

Concierge query params always take precedence over saved drafts for the fields they control (selectedServices, timeline, conciergePriority). Other draft fields (name, email, business profile, etc.) are preserved.

---

## 7. Intake Form Changes

### Steps That Get Skipped

- **Service Selection step** -- concierge already identified the exact service. Form opens on Contact Info. Selected service shown as a locked badge above the progress bar (persistent across all steps). Small "change" link navigates to `/` which triggers the concierge welcome flow. Clicking "change" clears the concierge query params from form state.
- **Timeline question in Timeline & Budget step** -- timeline already captured. Step only asks about budget (investment range). Shorter step, less friction.

### Steps That Stay the Same

- Contact Info (name, email, phone, company)
- Business Profile (industry, size, years, current website)
- Service-Specific Questions (8-12 deep questions per service module)
- Design & Brand (preferences, assets, colors)
- Final Details (notes, referral source, contact method)

### Something Else Path Exception

- Service Selection step is NOT skipped -- client sees all 9 service modules
- Timeline IS still skipped (already captured)
- Priority data passed as a signal to the scoring engine

### Net Result

- Standard concierge path: ~8 steps reduced to ~6 steps
- Direct `/intake` visits (no concierge): unchanged, full form

### Data Handoff Mechanism

- **Query parameters** (Approach A)
- URL format: `/intake?service=marketing-website&priority=design&timeline=asap`
- Intake form reads params via `useSearchParams()`
- Transparent, bookmarkable, debuggable, survives new tabs
- Concierge data stored alongside form data in the submission for scoring engine

---

## 8. "Something Else" Qualifier Screens

When a client picks the "Something else" sub-option under Web App/Dashboard or Full Platform, they see an expanded list of all services in that category with descriptions.

### Web App / Dashboard Expanded List

- Business Dashboard -- see your business data at a glance
- Client Portal -- give your clients their own login
- CRM System -- track leads, pipeline, and sales
- AI-Powered Tools -- automate tasks with AI
- *Still not sure?* -- routes to "Something Else" path (generic priorities, full intake form)

### Full Platform Expanded List

- Full Operations Platform -- run your entire business from one system
- E-Commerce -- sell products or services online
- *Still not sure?* -- routes to "Something Else" path (generic priorities, full intake form)

After selecting from the expanded list, the client continues to the priority screen for that category, then timeline, then confirmation -- same as everyone else.

**"Still not sure?" behavior:** Keeps the original category (e.g., "webapp") but sets service ID to null. The intake form shows the full service selection step. The scoring engine still knows they were interested in web apps/dashboards via the category param.

---

## 9. Animation and Transitions

- All screen transitions use existing ConciergeScreen slide pattern (direction-aware, spring physics)
- ConciergeOption cards keep existing stagger entrance, selection glow, press scale
- Confirmation screen: fade-in for text, subtle progress bar fill (4.44s linear)
- Tap-to-skip on confirmation: immediate navigation, no animation delay
- All animations respect `prefers-reduced-motion`
- Body scroll lock remains on homepage (iOS Safari fix)

---

## 10. Accessibility

- Screen reader announcements via aria-live region on every screen change
- Focus management: first interactive element focused on each new screen
- All options are keyboard navigable (Enter/Space to select)
- Back button on every screen after Welcome
- Confirmation screen: progress bar has aria role and label
- "Still not sure?" links are properly labeled for screen readers
- No-JS fallback: static layout with direct links to `/intake` and `/services`

---

## 11. Files to Modify

| File | Change |
| --- | --- |
| `src/lib/concierge-content.ts` | Add qualifier data, timeline options, confirmation copy, service ID mappings |
| `src/components/public-site/MobileConcierge.tsx` | Add qualifier + timeline screens, confirmation screen, auto-route logic, remove payoff/matching screens |
| `src/components/public-site/ConciergeScreen.tsx` | No changes expected |
| `src/components/public-site/ConciergeOption.tsx` | No changes expected |
| `src/hooks/useIntakeForm.ts` | Read service/priority/timeline from query params, skip pre-filled steps, concierge params override draft |
| `src/components/public-site/IntakeForm.tsx` | Show locked service badge, conditionally skip steps |
| `src/components/public-site/IntakeStep.tsx` | Handle timeline-only Budget step variant, update timeline radio options to new values |
| `src/types/intake.ts` | Add conciergePriority field to IntakeFormData and INITIAL_FORM_DATA |
| `src/lib/intake-validation.ts` | Add conciergePriority to fullIntakeSchema (optional), update timelineBudgetSchema with new timeline values |
| `src/app/globals.css` | Confirmation progress bar animation (4.44s) |

---

## 12. What Gets Removed

- **Payoff screen** -- portfolio showcase replaced by confirmation screen
- **Matching screen** -- "Finding your match" animation no longer needed
- **Portfolio carousel in concierge** -- the `PayoffContent` component and carousel logic
- **`getPayoff()` function** -- payoff mappings no longer used
- **`getIntakeHref()` function** -- replaced by new routing logic with service/priority/timeline params

---

## 13. What Does NOT Change

- Welcome screen (brand moment, layout, animations)
- Category screen question and 4 options (same categories)
- Priority screen question and options per category (same priorities)
- HeroBackground (PCB board, data packets, chip animations)
- PublicHeader (desktop nav, mobile nav)
- Intake form validation, scoring engine, analysis, admin interface
- All other pages (services, portfolio, about, etc.)
