"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, X, ExternalLink } from "lucide-react";
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

              {/* CTA hint — pulse to draw attention */}
              <p className="relative z-10 animate-pulse pb-4 text-lg font-semibold text-white md:pb-8 md:text-xl">
                <span className="md:hidden">Tap to get started</span>
                <span className="hidden md:inline">Click to get started</span>
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

/** Build carousel list: matched project first, then other live/in-progress projects */
function getCarouselProjects(matchedSlug: string | undefined) {
  const isShowable = (p: (typeof projects)[number]) =>
    (p.status === "live" || p.status === "in-progress") && p.image;

  const matched = matchedSlug
    ? projects.find((p) => p.slug === matchedSlug && isShowable(p))
    : null;
  const others = projects.filter(
    (p) => isShowable(p) && p.slug !== matchedSlug,
  );
  return matched ? [matched, ...others] : others;
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
  const [detailProject, setDetailProject] = useState<typeof projects[number] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const payoff =
    category && priority ? getPayoff(category, priority) : null;
  const carouselItems = getCarouselProjects(payoff?.projectSlug);

  // Duplicate items for seamless desktop loop (hidden on mobile)
  const displayItems = [...carouselItems, ...carouselItems];

  // Desktop auto-scroll: 2.22s delay, 3.33s per card, pause on hover
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || carouselItems.length <= 1) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    let currentIdx = 0;
    const count = carouselItems.length;
    let paused = false;
    let startTimer: ReturnType<typeof setTimeout> | null = null;
    let advanceTimer: ReturnType<typeof setTimeout> | null = null;

    function getCardLeft(i: number) {
      const card = el!.children[i] as HTMLElement | undefined;
      if (!card) return 0;
      return card.offsetLeft - el!.offsetWidth * 0.1;
    }

    function scheduleAdvance() {
      advanceTimer = setTimeout(() => {
        if (paused) {
          scheduleAdvance();
          return;
        }
        currentIdx++;

        if (currentIdx >= count) {
          // Smooth scroll to the first duplicate card
          el!.scrollTo({ left: getCardLeft(currentIdx), behavior: "smooth" });
          // After transition completes, jump back to real first card
          setTimeout(() => {
            currentIdx = 0;
            // Temporarily disable snap so jump is instant
            el!.style.scrollSnapType = "none";
            el!.scrollTo({ left: getCardLeft(0), behavior: "auto" });
            requestAnimationFrame(() => {
              el!.style.scrollSnapType = "";
            });
          }, 500);
        } else {
          el!.scrollTo({ left: getCardLeft(currentIdx), behavior: "smooth" });
        }

        scheduleAdvance();
      }, 3330);
    }

    startTimer = setTimeout(scheduleAdvance, 2220);

    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    return () => {
      if (startTimer) clearTimeout(startTimer);
      if (advanceTimer) clearTimeout(advanceTimer);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, [carouselItems.length]);

  // Detail overlay
  if (detailProject) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl">
        <div className="flex h-[80svh] w-[90vw] flex-col rounded-2xl border border-white/[0.08] bg-white/[0.04] md:w-[80vw] lg:w-[70vw]">
          {/* Header with close */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
            <h3 className="text-lg font-bold text-white">{detailProject.title}</h3>
            <button
              onClick={() => setDetailProject(null)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-white"
              aria-label="Close project details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content — hidden scrollbar */}
          <div className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:p-8">
            {detailProject.image && (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                <Image
                  src={detailProject.image}
                  alt={detailProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 80vw"
                  priority
                />
              </div>
            )}

            <p className="mt-4 text-sm text-primary md:text-base">{detailProject.subtitle}</p>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base md:leading-relaxed">
              {detailProject.description}
            </p>

            {detailProject.capabilities.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Capabilities
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {detailProject.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="rounded-md bg-white/[0.06] px-2.5 py-1 text-xs text-white/80"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {detailProject.url && (
              <a
                href={detailProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-white"
              >
                Visit live site
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      {/* Carousel with edge fade mask */}
      {carouselItems.length > 0 && (
        <div
          className="mb-6"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[10%] md:snap-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {displayItems.map((proj, i) => (
              <button
                key={`${proj.slug}-${i}`}
                onClick={() => setDetailProject(proj)}
                className={`w-[80%] flex-shrink-0 snap-center overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] text-left backdrop-blur-sm transition-colors hover:border-white/[0.12] ${i >= carouselItems.length ? "hidden md:block" : ""}`}
                aria-label={`View details for ${proj.title}`}
              >
                {proj.image && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80vw, 400px"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3
                    ref={i < carouselItems.length && proj.slug === payoff?.projectSlug ? focusRef as React.Ref<HTMLHeadingElement> : undefined}
                    tabIndex={i < carouselItems.length && proj.slug === payoff?.projectSlug ? -1 : undefined}
                    className="text-lg font-bold text-white outline-none"
                  >
                    {proj.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {proj.subtitle}
                  </p>
                  <p className="mt-2 text-xs text-primary">
                    Tap to see project details
                  </p>
                </div>
              </button>
            ))}
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
