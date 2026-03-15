# Mobile Concierge Experience — Design Spec

> **Date:** 2026-03-13
> **Status:** Approved
> **Scope:** Mobile homepage only (desktop unchanged)

---

## Overview

Replace the mobile homepage hero with a full-screen, no-scroll concierge flow. Instead of presenting a traditional "website with information," the mobile landing page asks visitors two quick questions and delivers a tailored response. The experience feels like walking into a shop where someone greets you and asks how they can help.

**Core philosophy:** Good service listens before it speaks. The site is about the visitor, not about us.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Feel | Concierge welcome → adaptive conversation | Visitors feel important and heard |
| Trust priority order | Understood → Legit → Affordable → Easy | Build trust by listening first |
| Attention span | 2-3 swipes max, content must earn attention | Every pixel must justify its presence |
| First impression | A question, not a pitch | Flips the script — immediately about them |
| After first answer | Another question (deepen the conversation) | Good service doesn't rush to the sale |
| Payoff | Tailored portfolio piece + warm CTA | Proof and invitation side by side |
| Below the fold | Nothing — no scroll on mobile landing | Full commitment to the concierge concept |
| Escape hatch | "Just browsing? Browse our services →" | Links to /services, not a scroll anchor |
| Returning visitors | Fresh start every time | No tracking, no cookies, no "welcome back" |
| Architecture | Client-side state machine | Simplest approach, scales later if needed |

---

## Flow

### Screen 1 — The Greeting

- Full viewport height (`100svh`), no scroll
- PCB background (reused from current hero)
- Logo and nav at top (unchanged)
- Center: **"What are you building?"** — clean, confident headline
- Below: 3-4 glassmorphism tap target cards:
  - "A Website"
  - "A Web App or Dashboard"
  - "A Full Platform"
  - "Something Else"
- Bottom: subtle skip link — "Just browsing? Browse our services →" linking to `/services`

**"Something Else" shortcut:** Tapping this skips Screen 2 entirely. Screen 3 renders a variant layout — no portfolio piece. Instead: headline "We'd love to hear about it," a short warm line ("Every project is different — tell us about yours and we'll figure it out together"), and a single CTA button to `/intake`. The transition uses the same slide-left animation as a normal forward transition.

### Screen 2 — The Follow-Up

- Full viewport, smooth Framer Motion transition (slide left)
- **"What matters most to you?"** as headline
- 3 tap targets tailored to Screen 1 selection (see Content Mapping below)
- Back arrow top-left (below nav) to revise Screen 1 answer

### Transition: Matching Animation (Labor Illusion)

- After Screen 2 answer, a brief (~800ms) "matching" interstitial plays before Screen 3
- Subtle shimmer/pulse animation with text like "Finding your match..."
- Makes the tailored result feel earned, not random — increases perceived value
- Reduced motion: skip animation, transition directly to Screen 3

### Screen 3 — The Payoff

- Full viewport
- Tailored portfolio piece based on both answers:
  - Project screenshot/preview
  - "We built this for [client name]"
- Below: **intent-matched CTA** — dynamically generated based on their answers, not generic
  - e.g., Website + Design → "Let's make your brand stand out"
  - e.g., Platform + Growth → "Let's build something that scales with you"
  - Single button linking to `/intake?type={category}&priority={priority}` (progressive profiling)
- Secondary link: "Explore our services →" linking to `/services`
- Back arrow to revise Screen 2 answer

### Progressive Profiling

- The `/intake` link includes query params from the concierge answers: `?type={category}&priority={priority}`
- The intake form can pre-fill the project type field based on these params
- Reduces form friction — the visitor doesn't repeat information they already provided

---

## Content Mapping

### Screen 1 → Screen 2 Follow-Ups

| Screen 1 Selection | Screen 2: "What matters most?" |
|---|---|
| A Website | Design / Speed / Budget |
| A Web App or Dashboard | Real-time data / User experience / Scalability |
| A Full Platform | End-to-end control / Client-facing portal / Growth-ready |
| Something Else | (skips to intake) |

### Screen 2 → Screen 3 Portfolio Match

| Combination | Portfolio Piece | Intent-Matched CTA |
|---|---|---|
| Website + Design | The Colour Parlor | "Let's make your brand stand out" |
| Website + Speed | Orca Child in the Wild | "Let's build something fast and reliable" |
| Website + Budget | The Colour Parlor | "Let's get you online — done right" |
| Web App + Real-time | All Beauty Hair Studio | "Let's give you real-time visibility" |
| Web App + UX | All Beauty Hair Studio | "Let's build tools your team will love" |
| Web App + Scale | All Beauty Hair Studio | "Let's build something that grows with you" |
| Platform + Control | All Beauty Hair Studio | "Let's put you in control" |
| Platform + Portal | All Beauty Hair Studio | "Let's give your clients a window in" |
| Platform + Growth | Figaro Barbershop | "Let's build something that scales with you" |
| Something Else | (skips to intake) | "Tell Us About Your Project" |

Exact copy and mappings will be refined during implementation. The principle: every combination has a destination.

---

## Interaction Design

### Transitions

- Framer Motion `AnimatePresence` with `mode="wait"`
- Forward: current screen fades/slides out left, next slides in from right
- Back: reverse direction (slides right)
- Spring physics matching existing site animations
- Total transition duration: ~300ms

### Tap Targets

- Glassmorphism cards: `bg-white/[0.03]`, `border-white/[0.06]`, `backdrop-blur`
- Minimum 48px height (accessibility)
- Subtle scale on tap: `whileTap={{ scale: 0.98 }}`
- Green-400 border glow on selection before transitioning

### Skip Link

- Bottom of Screen 1
- Subtle styling, does not compete with main question
- Standard `<a>` link to `/services`

### Back Navigation

- Small back arrow below nav on Screens 2 and 3
- Reverses transition animation direction
- Not URL-based — browser back leaves the page entirely (intentional)

---

## Component Architecture

### New Components

| Component | Location | Purpose |
|---|---|---|
| `MobileConcierge.tsx` | `src/components/public-site/` | State machine wrapper — manages screen state, selections, transitions |
| `ConciergeScreen.tsx` | `src/components/public-site/` | Full-viewport screen container — `100svh` layout, animation enter/exit |
| `ConciergeOption.tsx` | `src/components/public-site/` | Glassmorphism tap target card — label, icon, onSelect callback |
| `concierge-content.ts` | `src/lib/` | Static content map — Screen 1 options, Screen 2 follow-ups, Screen 3 matches |

### Modified Components

| Component | Change |
|---|---|
| `Hero.tsx` | Restructure into two sibling `<section>` elements: one `md:hidden` containing `<MobileConcierge />`, one `hidden md:flex` containing the existing desktop hero (headline, subtitle, CTAs, StatsBar, ScrollTeaser). The current single `<section>` with shared content must be split — this is a moderate refactor, not a one-line change. Desktop content and behavior remain identical. |

### Unchanged Components

- `HeroBackground.tsx` — reused inside `ConciergeScreen` as-is
- `StatsBar.tsx` — desktop only, not rendered in mobile concierge
- `ScrollTeaser.tsx` — desktop only, not rendered in mobile concierge
- `/services` page — already exists, no changes needed

### State Management

```
useState: screen ('greeting' | 'followup' | 'matching' | 'payoff')
useState: category (string | null)
useState: priority (string | null)
```

Simple `useState` — no context, no reducer, no external state library. State resets on every page load (fresh start by design).

---

## Accessibility

- All tap targets are `<button>` elements with descriptive `aria-label`
- Screen transitions announced via `aria-live="polite"` region
- Back button: `aria-label="Go back to previous question"`
- Skip link is keyboard-focusable and visible on focus
- Focus management per screen: Screen 1 → first option card, Screen 2 → first option card, Screen 3 → the heading ("We built this for...") or the primary CTA button
- `aria-live` region announces the screen headline text on each transition (e.g., "What are you building?", "What matters most to you?")
- Reduced motion: transitions become instant fades (no slides) via existing `useReducedMotion` hook
- Minimum contrast ratios maintained (4.5:1 per WCAG 2.1 AA)
- Touch targets minimum 48px

### SSR / No-JavaScript Fallback

Screen 1 renders statically with a simplified layout: the "What are you building?" headline and a single CTA linking to `/services` ("Browse our services →"). The individual category cards are not rendered without JS — showing four identical links to the same page would be confusing. The simplified fallback is clean and functional.

---

## Edge Cases

| Scenario | Behavior |
|---|---|
| Fast double-tap | `AnimatePresence mode="wait"` — transition completes before accepting input |
| iOS Safari toolbar | `100svh` handles dynamic viewport height (already used in current hero) |
| Browser back button | Leaves the page entirely (client-side state, not URL routing) |
| Screen resize past md | Concierge hidden, desktop hero shown (CSS breakpoint, no JS needed) |
| "Something Else" selected | Skips Screen 2, shows warm message + intake CTA |

---

## Not In Scope

- No analytics tracking of concierge choices
- No A/B testing infrastructure
- No desktop version of the concierge
- No cookie or localStorage persistence
- No `/services` page redesign
- No new pages created

---

## Technical Constraints

- Mobile only: entire flow wrapped in `md:hidden`
- Desktop breakpoint: `md` (768px) — matches existing mobile/desktop split in Hero.tsx
- Client-side state machine — all logic in React, no backend changes
- Static content map — scales to current portfolio size (5-6 projects), upgrade to server-driven when portfolio exceeds ~20 projects
