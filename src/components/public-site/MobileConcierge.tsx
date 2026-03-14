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
  const [screen, setScreen] = useState<ScreenType>("welcome");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [priority, setPriority] = useState<PriorityId | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const announcementRef = useRef<HTMLDivElement>(null);
  const focusTargetRef = useRef<HTMLElement | null>(null);

  function handleWelcomeTap() {
    setDirection(1);
    setScreen("greeting");
  }

  // Announce screen changes for screen readers
  const currentHeadline =
    screen === "welcome"
      ? conciergeContent.welcome.headline
      : screen === "greeting"
        ? conciergeContent.greeting.headline
        : screen === "followup" && category
          ? conciergeContent.followUps[category].headline
          : screen === "matching"
            ? conciergeContent.matchingText
            : category === "other"
              ? conciergeContent.otherPayoff.headline
              : "Here\u2019s what we can do for you";

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
    } else if (screen === "followup" || (screen === "payoff" && category === "other")) {
      setCategory(null);
      setPriority(null);
      setScreen("greeting");
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
    <section
      className="relative overflow-hidden"
      aria-label="Welcome \u2014 tell us what you\u2019re building"
    >
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
            We build websites, web apps, and full platforms — custom, not
            templated.
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
        {screen === "welcome" && (
          <ConciergeScreen screenKey="welcome" direction={direction}>
            <button
              onClick={handleWelcomeTap}
              aria-label="Continue to get started"
              className="flex h-full w-full flex-col items-center text-left"
            >
              <div className="flex-1" />

              {/* Welcome intro */}
              <div className="relative z-10 mx-auto w-full max-w-sm text-center md:max-w-2xl">
                <h1 className="text-[1.875rem] font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-6xl lg:text-7xl">
                  Welcome to<br />
                  <span className="text-primary">Built</span>By<span className="text-primary">Bas</span>
                </h1>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground md:mt-6 md:text-xl">
                  {conciergeContent.welcome.subtitle}
                </p>
              </div>

              <div className="flex-1" />

              {/* Subtle hint */}
              <p className="relative z-10 pb-4 text-sm text-muted-foreground/60 md:pb-8">
                <span className="md:hidden">Tap to continue</span>
                <span className="hidden md:inline">Click to continue</span>
              </p>
            </button>
          </ConciergeScreen>
        )}

        {screen === "greeting" && (
          <ConciergeScreen screenKey="greeting" direction={direction}>
            {/* Spacer */}
            <div className="flex-1" />

            {/* Question */}
            <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-lg">
              <h1 className="text-center text-[1.875rem] font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                {conciergeContent.greeting.headline}
              </h1>

              <div className="mt-8 flex flex-col gap-3 md:mt-10 md:gap-4">
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
            <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-lg">
              <h2 className="text-center text-[1.875rem] font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                {conciergeContent.followUps[category].headline}
              </h2>

              <div className="mt-8 flex flex-col gap-3 md:mt-10 md:gap-4">
                {conciergeContent.followUps[category].priorities.map(
                  (pri, index) => (
                    <ConciergeOption
                      key={pri.id}
                      ref={index === 0 ? setFocusTarget : undefined}
                      label={pri.label}
                      icon="Check"
                      index={index}
                      onSelect={() => handlePrioritySelect(pri.id)}
                    />
                  ),
                )}
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />
          </ConciergeScreen>
        )}

        {screen === "matching" && (
          <ConciergeScreen screenKey="matching" direction={direction}>
            <div className="flex-1" />
            <div className="relative z-10 mx-auto w-full max-w-sm text-center md:max-w-lg">
              <div className="inline-block animate-pulse">
                <div className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_12px] shadow-green-400/40 md:h-3 md:w-3" />
              </div>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">
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
            <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-lg">
              {category === "other" ? (
                /* "Something Else" variant — no portfolio piece */
                <div className="text-center">
                  <h2
                    ref={setFocusTarget as React.Ref<HTMLHeadingElement>}
                    tabIndex={-1}
                    className="text-[1.875rem] font-bold leading-tight tracking-tight text-white outline-none md:text-4xl"
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
  const payoff =
    category && priority ? getPayoff(category, priority) : null;
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
                sizes="(max-width: 768px) 100vw, 512px"
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
              <p className="mt-1 text-sm text-muted-foreground">
                {payoff.tagline}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Intent-matched CTA with progressive profiling */}
      <Link
        href={
          category && priority ? getIntakeHref(category, priority) : "/intake"
        }
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
