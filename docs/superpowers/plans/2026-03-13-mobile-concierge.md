# Mobile Concierge Experience — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mobile homepage hero with a 3-screen concierge Q&A that tailors portfolio showcase and CTA based on visitor answers.

**Architecture:** Client-side state machine in React. Three `useState` hooks drive screen transitions via Framer Motion `AnimatePresence`. A static content map in `src/lib/` maps answer combinations to portfolio pieces. Mobile only (`md:hidden`), desktop hero unchanged.

**Tech Stack:** Next.js App Router, TypeScript (strict), Framer Motion, Tailwind CSS 4, existing glassmorphism design system.

**Spec:** `docs/superpowers/specs/2026-03-13-mobile-concierge-design.md`

---

## File Structure

### New Files

| File | Responsibility |
|---|---|
| `src/lib/concierge-content.ts` | Static content map — categories, follow-ups, portfolio matches. Pure data, no React. |
| `src/components/public-site/MobileConcierge.tsx` | State machine wrapper — manages screen state, selections, transitions. Orchestrates the 3-screen flow. |
| `src/components/public-site/ConciergeScreen.tsx` | Full-viewport screen container — `100svh` layout, Framer Motion enter/exit, renders `HeroBackground`. |
| `src/components/public-site/ConciergeOption.tsx` | Glassmorphism tap target card — receives label, icon, onSelect callback. Reusable across screens. |
| `src/components/public-site/__tests__/MobileConcierge.test.tsx` | Tests for the concierge flow — state transitions, content mapping, accessibility. |
| `src/lib/__tests__/concierge-content.test.ts` | Tests for the content map — every combination resolves to a portfolio piece. |

### Modified Files

| File | Change |
|---|---|
| `src/components/public-site/Hero.tsx` | Split into two sibling `<section>` elements: `md:hidden` (MobileConcierge) + `hidden md:flex` (existing desktop hero). |

---

## Chunk 1: Content Map and Types

### Task 1: Create concierge content data structure

**Files:**
- Create: `src/lib/concierge-content.ts`

- [ ] **Step 1: Define TypeScript types**

Create the file with strict types for the concierge content map:

```typescript
// src/lib/concierge-content.ts

export type ConciergeScreen = "greeting" | "followup" | "matching" | "payoff";

export type CategoryId = "website" | "webapp" | "platform" | "other";

export type ConciergeIconName = "Globe" | "LayoutDashboard" | "Layers" | "Sparkles" | "Check";

export type PriorityId = string; // varies per category

export interface ConciergeCategory {
  id: CategoryId;
  label: string;
  description: string;
  icon: ConciergeIconName;
}

export interface ConciergePriority {
  id: PriorityId;
  label: string;
}

export interface ConciergePayoff {
  projectSlug: string;
  tagline: string; // e.g., "We built this for a salon that wanted to stand out online"
  ctaLabel: string; // Intent-matched CTA, e.g., "Let's make your brand stand out"
}

export interface ConciergeContent {
  greeting: {
    headline: string;
    categories: ConciergeCategory[];
    skipLabel: string;
    skipHref: string;
  };
  followUps: Record<CategoryId, {
    headline: string;
    priorities: ConciergePriority[];
  }>;
  payoffs: Record<string, ConciergePayoff>; // key: "categoryId-priorityId"
  otherPayoff: {
    headline: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
  payoffSecondary: {
    label: string;
    href: string;
  };
  matchingText: string; // shown during labor illusion animation
}
```

- [ ] **Step 2: Populate the content map**

Add the content data below the types:

```typescript
export const conciergeContent: ConciergeContent = {
  greeting: {
    headline: "What are you building?",
    categories: [
      { id: "website", label: "A Website", description: "Marketing site, portfolio, or landing page", icon: "Globe" },
      { id: "webapp", label: "A Web App or Dashboard", description: "Internal tools, admin panels, or data dashboards", icon: "LayoutDashboard" },
      { id: "platform", label: "A Full Platform", description: "End-to-end system with portals, CRM, or multi-user access", icon: "Layers" },
      { id: "other", label: "Something Else", description: "Tell us about your idea", icon: "Sparkles" },
    ],
    skipLabel: "Just browsing? Browse our services →",
    skipHref: "/services",
  },
  followUps: {
    website: {
      headline: "What matters most to you?",
      priorities: [
        { id: "design", label: "It needs to look incredible" },
        { id: "speed", label: "It needs to be fast and reliable" },
        { id: "budget", label: "I need it done right, on budget" },
      ],
    },
    webapp: {
      headline: "What matters most to you?",
      priorities: [
        { id: "realtime", label: "Real-time data and visibility" },
        { id: "ux", label: "An experience my team will actually use" },
        { id: "scale", label: "It needs to grow with us" },
      ],
    },
    platform: {
      headline: "What matters most to you?",
      priorities: [
        { id: "control", label: "End-to-end control over everything" },
        { id: "portal", label: "A portal my clients will love" },
        { id: "growth", label: "Built to scale as we grow" },
      ],
    },
    other: {
      headline: "",
      priorities: [],
    },
  },
  payoffs: {
    "website-design": { projectSlug: "the-colour-parlor", tagline: "We built this for a salon that wanted to stand out online", ctaLabel: "Let's make your brand stand out" },
    "website-speed": { projectSlug: "orca-child-in-the-wild", tagline: "We built this for a conservation nonprofit that needed to reach everyone", ctaLabel: "Let's build something fast and reliable" },
    "website-budget": { projectSlug: "the-colour-parlor", tagline: "We built this for a small business that needed maximum impact", ctaLabel: "Let's get you online — done right" },
    "webapp-realtime": { projectSlug: "all-beauty-hair-studio", tagline: "We built this for a studio that needed real-time visibility into their business", ctaLabel: "Let's give you real-time visibility" },
    "webapp-ux": { projectSlug: "all-beauty-hair-studio", tagline: "We built this for a team that needed tools they'd actually enjoy using", ctaLabel: "Let's build tools your team will love" },
    "webapp-scale": { projectSlug: "all-beauty-hair-studio", tagline: "We built this to grow with the business — from one location to many", ctaLabel: "Let's build something that grows with you" },
    "platform-control": { projectSlug: "all-beauty-hair-studio", tagline: "We built this for a business that wanted to own every part of their operation", ctaLabel: "Let's put you in control" },
    "platform-portal": { projectSlug: "all-beauty-hair-studio", tagline: "We built this so their clients could see everything in one place", ctaLabel: "Let's give your clients a window in" },
    "platform-growth": { projectSlug: "figaro-barbershop", tagline: "We're building this for a barbershop that's ready to grow", ctaLabel: "Let's build something that scales with you" },
  },
  otherPayoff: {
    headline: "We'd love to hear about it",
    body: "Every project is different — tell us about yours and we'll figure it out together.",
    ctaLabel: "Tell Us About Your Project",
    ctaHref: "/intake?type=other",
  },
  payoffSecondary: {
    label: "Explore our services →",
    href: "/services",
  },
  matchingText: "Finding your match...",
};

/** Lookup helper — returns the payoff for a category+priority combo */
export function getPayoff(category: CategoryId, priority: PriorityId): ConciergePayoff | null {
  return conciergeContent.payoffs[`${category}-${priority}`] ?? null;
}

/** Build intake URL with progressive profiling params */
export function getIntakeHref(category: CategoryId, priority: PriorityId): string {
  return `/intake?type=${encodeURIComponent(category)}&priority=${encodeURIComponent(priority)}`;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/concierge-content.ts
git commit -m "feat: add concierge content map with types and data"
```

---

### Task 2: Test the content map

**Files:**
- Create: `src/lib/__tests__/concierge-content.test.ts`

- [ ] **Step 1: Write tests for content map completeness**

```typescript
// src/lib/__tests__/concierge-content.test.ts
import { describe, it, expect } from "vitest";
import { conciergeContent, getPayoff } from "../concierge-content";
import { projects } from "@/data/portfolio";
import type { CategoryId } from "../concierge-content";

describe("concierge-content", () => {
  it("every category has follow-up priorities", () => {
    const categoryIds = conciergeContent.greeting.categories.map((c) => c.id);
    for (const id of categoryIds) {
      if (id === "other") continue; // "other" skips to intake
      const followUp = conciergeContent.followUps[id];
      expect(followUp, `Missing follow-up for category: ${id}`).toBeDefined();
      expect(followUp.priorities.length).toBeGreaterThan(0);
    }
  });

  it("every category+priority combo has a payoff", () => {
    const categoryIds = conciergeContent.greeting.categories
      .map((c) => c.id)
      .filter((id): id is Exclude<CategoryId, "other"> => id !== "other");

    for (const catId of categoryIds) {
      const priorities = conciergeContent.followUps[catId].priorities;
      for (const priority of priorities) {
        const payoff = getPayoff(catId, priority.id);
        expect(payoff, `Missing payoff for ${catId}-${priority.id}`).not.toBeNull();
      }
    }
  });

  it("every payoff references a real portfolio project slug", () => {
    const slugs = projects.map((p) => p.slug);
    for (const [key, payoff] of Object.entries(conciergeContent.payoffs)) {
      expect(slugs, `Payoff "${key}" references unknown slug: ${payoff.projectSlug}`).toContain(payoff.projectSlug);
    }
  });

  it("every payoff has an intent-matched ctaLabel", () => {
    for (const [key, payoff] of Object.entries(conciergeContent.payoffs)) {
      expect(payoff.ctaLabel, `Missing ctaLabel for ${key}`).toBeTruthy();
      expect(payoff.ctaLabel.length).toBeGreaterThan(5);
    }
  });

  it("getPayoff returns null for unknown combos", () => {
    expect(getPayoff("website" as CategoryId, "nonexistent")).toBeNull();
  });

  it("greeting has 4 categories", () => {
    expect(conciergeContent.greeting.categories).toHaveLength(4);
  });

  it("other category has empty follow-ups", () => {
    expect(conciergeContent.followUps.other.priorities).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `pnpm vitest run src/lib/__tests__/concierge-content.test.ts`

Expected: All 7 tests PASS. If any fail, fix the content map data (likely a slug mismatch — check `src/data/portfolio.ts` for exact slug values).

- [ ] **Step 3: Commit**

```bash
git add src/lib/__tests__/concierge-content.test.ts
git commit -m "test: add concierge content map tests"
```

---

## Chunk 2: UI Components

### Task 3: Create ConciergeOption component

**Files:**
- Create: `src/components/public-site/ConciergeOption.tsx`

- [ ] **Step 1: Create the glassmorphism tap target card**

```typescript
// src/components/public-site/ConciergeOption.tsx
"use client";

import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Globe, LayoutDashboard, Layers, Sparkles, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = { Globe, LayoutDashboard, Layers, Sparkles, Check };

interface ConciergeOptionProps {
  label: string;
  description?: string;
  icon: string;
  index: number;
  onSelect: () => void;
}

export const ConciergeOption = forwardRef<HTMLButtonElement, ConciergeOptionProps>(
  function ConciergeOption({ label, description, icon, index, onSelect }, ref) {
    const shouldReduceMotion = useReducedMotion();
    const [selected, setSelected] = useState(false);
    const IconComponent = iconMap[icon];

    function handleClick() {
      setSelected(true);
      // Brief green glow before transitioning
      setTimeout(onSelect, 150);
    }

    const card = (
      <button
        ref={ref}
        onClick={handleClick}
        aria-label={`Select: ${label}`}
        className={`group flex min-h-[48px] w-full items-center gap-4 rounded-xl border px-5 py-4 text-left backdrop-blur-sm transition-all duration-300 active:scale-[0.98] ${
          selected
            ? "border-green-400/30 bg-green-400/10 shadow-[0_0_20px_-5px] shadow-green-400/20"
            : "border-white/[0.06] bg-white/[0.03] hover:border-green-400/20 hover:bg-white/[0.06]"
        }`}
      >
        {IconComponent && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
            <IconComponent className="h-5 w-5 text-green-400" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-base font-semibold text-white">{label}</div>
          {description && (
            <div className="mt-0.5 text-sm text-muted-foreground">{description}</div>
          )}
        </div>
      </button>
    );

    if (shouldReduceMotion) return card;

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.smooth, delay: 0.15 + index * 0.08 }}
      >
        {card}
      </motion.div>
    );
  }
);
```

- [ ] **Step 2: Commit**

```bash
git add src/components/public-site/ConciergeOption.tsx
git commit -m "feat: add ConciergeOption glassmorphism tap target card"
```

---

### Task 4: Create ConciergeScreen container

**Files:**
- Create: `src/components/public-site/ConciergeScreen.tsx`

- [ ] **Step 1: Create the full-viewport screen container**

This component handles `100svh` layout, the PCB background, and Framer Motion enter/exit:

```typescript
// src/components/public-site/ConciergeScreen.tsx
"use client";

import { motion } from "framer-motion";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ConciergeScreenProps {
  screenKey: string;
  direction: 1 | -1; // 1 = forward (slide left), -1 = back (slide right)
  children: React.ReactNode;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "30%" : "-30%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-30%" : "30%",
    opacity: 0,
  }),
};

export function ConciergeScreen({ screenKey, direction, children }: ConciergeScreenProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div key={screenKey} className="flex h-[100svh] flex-col px-5 pb-8 pt-20">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      key={screenKey}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={springs.smooth}
      className="flex h-[100svh] flex-col px-5 pb-8 pt-20"
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/public-site/ConciergeScreen.tsx
git commit -m "feat: add ConciergeScreen full-viewport container with transitions"
```

---

### Task 5: Create MobileConcierge state machine

**Files:**
- Create: `src/components/public-site/MobileConcierge.tsx`

- [ ] **Step 1: Create the state machine orchestrator**

This is the main component. It manages screen state, renders the appropriate screen inside `AnimatePresence`, and handles the concierge flow:

```typescript
// src/components/public-site/MobileConcierge.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { HeroBackground } from "@/components/public-site/HeroBackground";
import { ConciergeScreen } from "@/components/public-site/ConciergeScreen";
import { ConciergeOption } from "@/components/public-site/ConciergeOption";
import {
  conciergeContent,
  getPayoff,
  getIntakeHref,
  type ConciergeScreen as ScreenType,
  type CategoryId,
  type PriorityId,
} from "@/lib/concierge-content";
import { projects } from "@/data/portfolio";

export function MobileConcierge() {
  const [screen, setScreen] = useState<ScreenType>("greeting");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [priority, setPriority] = useState<PriorityId | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const announcementRef = useRef<HTMLDivElement>(null);
  const focusTargetRef = useRef<HTMLElement>(null);

  // Announce screen changes for screen readers
  const currentHeadline =
    screen === "greeting"
      ? conciergeContent.greeting.headline
      : screen === "followup" && category
        ? conciergeContent.followUps[category].headline
        : screen === "matching"
          ? conciergeContent.matchingText
          : category === "other"
            ? conciergeContent.otherPayoff.headline
            : "Here's what we can do for you";

  // Announce headline and move focus on screen change
  useEffect(() => {
    if (announcementRef.current) {
      announcementRef.current.textContent = currentHeadline;
    }
    // Move focus to first interactive element on the new screen
    requestAnimationFrame(() => {
      if (focusTargetRef.current) {
        focusTargetRef.current.focus();
      }
    });
  }, [screen, currentHeadline]);

  function handleCategorySelect(catId: CategoryId) {
    setCategory(catId);
    setDirection(1);
    if (catId === "other") {
      setScreen("payoff");
    } else {
      setScreen("followup");
    }
  }

  function handlePrioritySelect(priId: PriorityId) {
    setPriority(priId);
    setDirection(1);
    setScreen("matching");
    // Labor illusion: brief matching animation before showing payoff
    setTimeout(() => {
      setScreen("payoff");
    }, 800);
  }

  function handleBack() {
    setDirection(-1);
    if (screen === "payoff" && category !== "other") {
      setPriority(null);
      setScreen("followup");
    } else {
      setCategory(null);
      setPriority(null);
      setScreen("greeting");
    }
  }

  // Ref callback for the first focusable element on each screen
  const setFocusTarget = useCallback((el: HTMLElement | null) => {
    focusTargetRef.current = el;
  }, []);

  return (
    <section className="relative overflow-hidden md:hidden" aria-label="Welcome — tell us what you're building">
      <HeroBackground />

      {/* Screen reader announcements */}
      <div ref={announcementRef} aria-live="polite" className="sr-only" />

      {/* No-JS fallback: simplified static layout */}
      <noscript>
        <div className="flex h-[100svh] flex-col items-center justify-center px-5 text-center">
          <h1 className="text-[1.875rem] font-bold leading-tight tracking-tight text-white">
            What are you building?
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            We build websites, web apps, and full platforms — custom, not templated.
          </p>
          <a
            href="/services"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground"
          >
            Browse our services →
          </a>
        </div>
      </noscript>

      <AnimatePresence mode="wait" custom={direction}>
        {screen === "greeting" && (
          <ConciergeScreen screenKey="greeting" direction={direction}>
            {/* Spacer */}
            <div className="flex-1" />

            {/* Question */}
            <div className="relative z-10 mx-auto w-full max-w-sm">
              <h1 className="text-center text-[1.875rem] font-bold leading-tight tracking-tight text-white">
                {conciergeContent.greeting.headline}
              </h1>

              <div className="mt-8 flex flex-col gap-3">
                {conciergeContent.greeting.categories.map((cat, index) => (
                  <ConciergeOption
                    key={cat.id}
                    ref={index === 0 ? setFocusTarget : undefined}
                    label={cat.label}
                    description={cat.description}
                    icon={cat.icon}
                    index={index}
                    onSelect={() => handleCategorySelect(cat.id)}
                  />
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Skip link */}
            <div className="relative z-10 pb-4 text-center">
              <Link
                href={conciergeContent.greeting.skipHref}
                className="text-sm text-muted-foreground transition-colors hover:text-white"
              >
                {conciergeContent.greeting.skipLabel}
              </Link>
            </div>
          </ConciergeScreen>
        )}

        {screen === "followup" && category && category !== "other" && (
          <ConciergeScreen screenKey="followup" direction={direction}>
            {/* Back button */}
            <div className="relative z-10">
              <button
                onClick={handleBack}
                aria-label="Go back to previous question"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Follow-up question */}
            <div className="relative z-10 mx-auto w-full max-w-sm">
              <h2 className="text-center text-[1.875rem] font-bold leading-tight tracking-tight text-white">
                {conciergeContent.followUps[category].headline}
              </h2>

              <div className="mt-8 flex flex-col gap-3">
                {conciergeContent.followUps[category].priorities.map((pri, index) => (
                  <ConciergeOption
                    key={pri.id}
                    ref={index === 0 ? setFocusTarget : undefined}
                    label={pri.label}
                    icon="Check"
                    index={index}
                    onSelect={() => handlePrioritySelect(pri.id)}
                  />
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />
          </ConciergeScreen>
        )}

        {screen === "matching" && (
          <ConciergeScreen screenKey="matching" direction={direction}>
            <div className="flex-1" />
            <div className="relative z-10 mx-auto w-full max-w-sm text-center">
              <div className="inline-block animate-pulse">
                <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_12px] shadow-green-400/40" />
              </div>
              <p className="mt-4 text-base text-muted-foreground">
                {conciergeContent.matchingText}
              </p>
            </div>
            <div className="flex-1" />
          </ConciergeScreen>
        )}

        {screen === "payoff" && (
          <ConciergeScreen screenKey="payoff" direction={direction}>
            {/* Back button */}
            <div className="relative z-10">
              <button
                onClick={handleBack}
                aria-label="Go back to previous question"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Payoff content */}
            <div className="relative z-10 mx-auto w-full max-w-sm">
              {category === "other" ? (
                /* "Something Else" variant — no portfolio piece */
                <div className="text-center">
                  <h2
                    ref={setFocusTarget as React.Ref<HTMLHeadingElement>}
                    tabIndex={-1}
                    className="text-[1.875rem] font-bold leading-tight tracking-tight text-white outline-none"
                  >
                    {conciergeContent.otherPayoff.headline}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {conciergeContent.otherPayoff.body}
                  </p>
                  <div className="mt-8">
                    <Link
                      href={conciergeContent.otherPayoff.ctaHref}
                      className="btn-shine neon-glow inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground transition-all hover:bg-cyan-hover"
                    >
                      {conciergeContent.otherPayoff.ctaLabel}
                    </Link>
                  </div>
                </div>
              ) : (
                /* Standard payoff — portfolio piece + CTA */
                <PayoffContent
                  category={category}
                  priority={priority}
                  focusRef={setFocusTarget}
                />
              )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />
          </ConciergeScreen>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Extracted payoff content to avoid IIFE in JSX */
function PayoffContent({
  category,
  priority,
  focusRef,
}: {
  category: CategoryId | null;
  priority: PriorityId | null;
  focusRef: (el: HTMLElement | null) => void;
}) {
  const payoff = category && priority ? getPayoff(category, priority) : null;
  const project = payoff
    ? projects.find((p) => p.slug === payoff.projectSlug)
    : null;

  return (
    <div className="text-center">
      {/* Portfolio showcase */}
      {project && (
        <div className="mb-6 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          {project.image && (
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
          )}
          <div className="p-4">
            <h3
              ref={focusRef as React.Ref<HTMLHeadingElement>}
              tabIndex={-1}
              className="text-lg font-bold text-white outline-none"
            >
              {project.title}
            </h3>
            {payoff && (
              <p className="mt-1 text-sm text-muted-foreground">{payoff.tagline}</p>
            )}
          </div>
        </div>
      )}

      {/* Intent-matched CTA with progressive profiling */}
      <Link
        href={category && priority ? getIntakeHref(category, priority) : "/intake"}
        className="btn-shine neon-glow inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground transition-all hover:bg-cyan-hover"
      >
        {payoff?.ctaLabel ?? "Tell us about yours"}
      </Link>

      {/* Secondary link */}
      <div className="mt-4">
        <Link
          href={conciergeContent.payoffSecondary.href}
          className="text-sm text-muted-foreground transition-colors hover:text-white"
        >
          {conciergeContent.payoffSecondary.label}
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/public-site/MobileConcierge.tsx
git commit -m "feat: add MobileConcierge state machine with 3-screen flow"
```

---

### Task 6: Integrate MobileConcierge into Hero.tsx

**Files:**
- Modify: `src/components/public-site/Hero.tsx`

- [ ] **Step 1: Read the current Hero.tsx**

Read `src/components/public-site/Hero.tsx` to confirm current structure before editing.

- [ ] **Step 2: Restructure Hero into mobile + desktop sections**

The current Hero is a single `<section>` with `h-[100svh]`. Split it:

1. Add import for `MobileConcierge`:
```typescript
import { MobileConcierge } from "@/components/public-site/MobileConcierge";
```

2. Replace the outer `<section>` with a fragment `<>` containing two sections:

```tsx
export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Mobile: Concierge flow */}
      <MobileConcierge />

      {/* Desktop: Original hero */}
      <section className="relative hidden h-[100svh] flex-col items-center justify-between overflow-hidden px-5 pb-4 pt-16 sm:px-6 sm:pb-6 md:flex md:pt-20">
        <HeroBackground />
        {/* ... rest of existing desktop hero content unchanged ... */}
      </section>
    </>
  );
}
```

Key changes to the desktop `<section>`:
- Add `hidden` and `md:flex` (was `flex`)
- Remove any mobile-only blocks (the `md:hidden` CTA buttons) since mobile now uses MobileConcierge
- Keep all desktop content exactly as-is

- [ ] **Step 3: Verify desktop hero is visually unchanged**

Run: `pnpm dev`

Open `http://localhost:3000` at desktop width (>768px). The hero should look identical to before. Resize to mobile (<768px) — should show the concierge flow.

- [ ] **Step 4: Commit**

```bash
git add src/components/public-site/Hero.tsx
git commit -m "feat: integrate MobileConcierge into Hero — desktop unchanged"
```

---

## Chunk 3: Tests and Polish

### Task 7: Write component tests

**Files:**
- Create: `src/components/public-site/__tests__/MobileConcierge.test.tsx`

- [ ] **Step 1: Write integration tests for the concierge flow**

```typescript
// @vitest-environment happy-dom
import type React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

// Mock HeroBackground (heavy SVG)
vi.mock("../HeroBackground", () => ({
  HeroBackground: () => <div data-testid="hero-bg" />,
}));

// Mock useReducedMotion
vi.mock("@/hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

import { MobileConcierge } from "../MobileConcierge";

describe("MobileConcierge", () => {
  it("renders the greeting screen with all 4 categories", () => {
    render(<MobileConcierge />);
    expect(screen.getByText("What are you building?")).toBeInTheDocument();
    expect(screen.getByLabelText("Select: A Website")).toBeInTheDocument();
    expect(screen.getByLabelText("Select: A Web App or Dashboard")).toBeInTheDocument();
    expect(screen.getByLabelText("Select: A Full Platform")).toBeInTheDocument();
    expect(screen.getByLabelText("Select: Something Else")).toBeInTheDocument();
  });

  it("renders the skip link to services", () => {
    render(<MobileConcierge />);
    const skipLink = screen.getByText(/browse our services/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink.closest("a")).toHaveAttribute("href", "/services");
  });

  // Note: ConciergeOption has a 150ms selection glow delay before calling onSelect.
  // Tests use vi.useFakeTimers() + act() to advance past the delay.

  it("shows follow-up screen when a category is selected", () => {
    vi.useFakeTimers();
    render(<MobileConcierge />);
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => { vi.advanceTimersByTime(200); });
    expect(screen.getByText("What matters most to you?")).toBeInTheDocument();
    expect(screen.getByLabelText("Select: It needs to look incredible")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("shows matching screen then payoff when priority is selected", () => {
    vi.useFakeTimers();
    render(<MobileConcierge />);
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => { vi.advanceTimersByTime(200); }); // past option glow delay
    fireEvent.click(screen.getByLabelText("Select: It needs to look incredible"));
    act(() => { vi.advanceTimersByTime(200); }); // past option glow delay
    // Should show matching screen with labor illusion
    expect(screen.getByText("Finding your match...")).toBeInTheDocument();
    // Advance past 800ms matching animation
    act(() => { vi.advanceTimersByTime(800); });
    // Now should show payoff with intent-matched CTA
    expect(screen.getByText("Let's make your brand stand out")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("'Something Else' skips to payoff with intake CTA", () => {
    vi.useFakeTimers();
    render(<MobileConcierge />);
    fireEvent.click(screen.getByLabelText("Select: Something Else"));
    act(() => { vi.advanceTimersByTime(200); });
    expect(screen.getByText("We'd love to hear about it")).toBeInTheDocument();
    const ctaLink = screen.getByText("Tell Us About Your Project");
    expect(ctaLink.closest("a")).toHaveAttribute("href", "/intake?type=other");
    vi.useRealTimers();
  });

  it("payoff CTA includes progressive profiling params", () => {
    vi.useFakeTimers();
    render(<MobileConcierge />);
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => { vi.advanceTimersByTime(200); });
    fireEvent.click(screen.getByLabelText("Select: It needs to look incredible"));
    act(() => { vi.advanceTimersByTime(1000); }); // past glow + matching
    const ctaLink = screen.getByText("Let's make your brand stand out");
    expect(ctaLink.closest("a")).toHaveAttribute("href", "/intake?type=website&priority=design");
    vi.useRealTimers();
  });

  it("back button returns to previous screen", () => {
    vi.useFakeTimers();
    render(<MobileConcierge />);
    fireEvent.click(screen.getByLabelText("Select: A Website"));
    act(() => { vi.advanceTimersByTime(200); });
    expect(screen.getByText("What matters most to you?")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Go back to previous question"));
    expect(screen.getByText("What are you building?")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("has aria-live region for screen reader announcements", () => {
    render(<MobileConcierge />);
    const liveRegion = document.querySelector("[aria-live='polite']");
    expect(liveRegion).toBeInTheDocument();
  });

  it("has proper section aria-label", () => {
    render(<MobileConcierge />);
    const section = document.querySelector("section[aria-label]");
    expect(section).toHaveAttribute("aria-label", "Welcome — tell us what you're building");
  });
});
```

- [ ] **Step 2: Run all tests**

Run: `pnpm vitest run src/components/public-site/__tests__/MobileConcierge.test.tsx src/lib/__tests__/concierge-content.test.ts`

Expected: All tests PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/public-site/__tests__/MobileConcierge.test.tsx
git commit -m "test: add MobileConcierge integration tests"
```

---

### Task 8: Run full test suite and build

- [ ] **Step 1: Run full test suite**

Run: `pnpm test --run`

Expected: All tests pass. If any existing tests fail, investigate — the Hero.tsx refactor may affect tests that render `Hero` directly.

- [ ] **Step 2: Run TypeScript check**

Run: `pnpm tsc --noEmit`

Expected: Clean, no errors.

- [ ] **Step 3: Run build**

Run: `pnpm build`

Expected: Build succeeds. Check for any warnings about bundle size.

- [ ] **Step 4: Manual verification**

Run: `pnpm dev`

Test on mobile viewport (<768px):
1. Screen 1 shows "What are you building?" with 4 options
2. Tap "A Website" → Screen 2 with 3 priorities
3. Tap "It needs to look incredible" → Screen 3 with Colour Parlor showcase
4. Back button works on all screens
5. "Something Else" → goes straight to warm intake CTA
6. "Just browsing?" link goes to /services
7. Transitions animate smoothly (spring physics)
8. Reduced motion: verify transitions become instant fades

Test on desktop viewport (>768px):
1. Existing hero displays unchanged
2. No concierge elements visible

- [ ] **Step 5: Commit any fixes**

If any fixes were needed, stage the specific files that changed:
```bash
git add <specific-files-that-were-fixed>
git commit -m "fix: address test/build issues from concierge integration"
```

---

### Task 9: Final commit and summary

- [ ] **Step 1: Verify git status is clean**

Run: `git status`

All changes should be committed across the previous tasks.

- [ ] **Step 2: Update HANDOFF.md**

Add to the current session section in `docs/HANDOFF.md`:
- Mobile concierge experience implemented
- 3-screen guided flow: greeting → follow-up → payoff
- Client-side state machine, mobile only
- Desktop hero unchanged
- All tests passing, build clean

- [ ] **Step 3: Commit handoff update**

```bash
git add docs/HANDOFF.md
git commit -m "docs: update handoff with mobile concierge implementation"
```
