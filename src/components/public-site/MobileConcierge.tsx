"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HeroBackground } from "@/components/public-site/HeroBackground";
import { ConciergeScreen } from "@/components/public-site/ConciergeScreen";
import { ConciergeOption } from "@/components/public-site/ConciergeOption";
import { PayoffContent } from "@/components/public-site/PayoffContent";
import {
  conciergeContent,
  type ConciergeScreen as ScreenType,
  type CategoryId,
  type PriorityId,
} from "@/lib/concierge-content";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

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

  // Lock body scroll on homepage — prevents iOS Safari touch-scroll ambiguity
  useBodyScrollLock(true);

  // Reset to welcome when Home is clicked from the homepage
  useEffect(() => {
    function handleReset() {
      setScreen("welcome");
      setCategory(null);
      setPriority(null);
      setDirection(-1);
    }
    window.addEventListener("concierge-reset", handleReset);
    return () => window.removeEventListener("concierge-reset", handleReset);
  }, []);

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
      className="relative h-[100svh] touch-manipulation overflow-hidden"
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
              className="flex h-full w-full flex-col items-center"
            >
              {/* Top spacer — pushes content to optical center */}
              <div className="flex-[1.2]" />

              {/* Tier 1: Brand — the hero moment */}
              <div className="relative z-10 mx-auto w-full max-w-lg text-center md:max-w-3xl">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-sm md:text-base">
                  Welcome to
                </p>
                <h1 className="mt-2 text-6xl font-bold leading-[0.95] tracking-tight text-white sm:mt-3 sm:text-7xl md:text-8xl lg:text-9xl">
                  <span className="text-primary">Built</span>By<span className="text-primary">Bas</span>
                </h1>
              </div>

              {/* Tier 2: Value prop — quiet support text */}
              <div className="relative z-10 mx-auto mt-8 w-full max-w-sm text-center sm:mt-10 md:mt-12 md:max-w-xl">
                <p className="text-sm leading-relaxed text-white/75 sm:text-base md:text-lg">
                  {conciergeContent.welcome.subtitle}
                </p>
                <p className="mt-4 text-base font-medium leading-snug text-white/80 sm:text-lg md:mt-5 md:text-xl">
                  Let&apos;s Talk About Your Business Needs.
                </p>
                <p className="mt-1 text-base font-medium leading-snug text-primary sm:text-lg md:text-xl">
                  Then We&apos;ll Build a System Around Them.
                </p>
              </div>

              {/* Bottom spacer */}
              <div className="flex-[1.6]" />

              {/* Tier 3: CTA — anchored near bottom, distinct from content */}
              <div className="relative z-10 mb-8 text-center sm:mb-10 md:mb-12">
                <p className="animate-cta-glow text-lg font-bold tracking-wide sm:text-xl md:text-2xl">
                  <span className="text-white">Click Anywhere</span>{" "}
                  <span className="text-white/75">to</span>{" "}
                  <span className="text-white">Get Started</span>
                </p>
                <div className="animate-cta-glow mx-auto mt-2.5 h-px w-20 rounded-full bg-white/60 md:w-28" />
              </div>
            </button>
          </ConciergeScreen>
        )}

        {screen === "greeting" && (
          <ConciergeScreen screenKey="greeting" direction={direction}>
            {/* Spacer */}
            <div className="flex-1" />

            {/* Question */}
            <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-xl lg:max-w-2xl">
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
            <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-xl lg:max-w-2xl">
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
            <div className="relative z-10 mx-auto w-full max-w-sm text-center md:max-w-xl lg:max-w-2xl">
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
            <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-xl lg:max-w-3xl">
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

