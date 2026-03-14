"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HeroBackground } from "@/components/public-site/HeroBackground";
import { ConciergeScreen } from "@/components/public-site/ConciergeScreen";
import { ConciergeOption } from "@/components/public-site/ConciergeOption";
import {
  conciergeContent,
  buildIntakeUrl,
  serviceDisplayLabels,
  priorityDisplayLabels,
  timelineDisplayLabels,
  type ConciergeScreen as ScreenType,
  type CategoryId,
  type PriorityId,
  type QualifierId,
  type TimelineId,
} from "@/lib/concierge-content";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function MobileConcierge() {
  const [screen, setScreen] = useState<ScreenType>("welcome");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [service, setService] = useState<QualifierId | null>(null);
  const [priority, setPriority] = useState<PriorityId | null>(null);
  const [timeline, setTimeline] = useState<TimelineId | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const announcementRef = useRef<HTMLDivElement>(null);
  const focusTargetRef = useRef<HTMLElement | null>(null);

  function handleWelcomeTap() {
    setDirection(1);
    setScreen("category");
  }

  // Headline map for screen reader announcements
  const headlineMap: Record<string, string> = {
    welcome: conciergeContent.welcome.headline,
    category: conciergeContent.greeting.headline,
    qualifier:
      category && category !== "other"
        ? conciergeContent.qualifiers[category].headline
        : "",
    "qualifier-expanded":
      category && category !== "other"
        ? conciergeContent.qualifiers[category].headline
        : "",
    priority: "What matters most?",
    timeline: "When do you need this?",
    confirmation: conciergeContent.confirmation.headline,
  };
  const currentHeadline = headlineMap[screen] ?? "";

  // Lock body scroll on homepage -- prevents iOS Safari touch-scroll ambiguity
  useBodyScrollLock(true);

  // Reset to welcome when Home is clicked from the homepage
  useEffect(() => {
    function handleReset() {
      setScreen("welcome");
      setCategory(null);
      setService(null);
      setPriority(null);
      setTimeline(null);
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
    requestAnimationFrame(() => {
      if (focusTargetRef.current) {
        focusTargetRef.current.focus();
      }
    });
  }, [screen, currentHeadline]);

  // --- Navigation handlers ---

  function handleCategorySelect(catId: CategoryId) {
    setCategory(catId);
    setDirection(1);
    if (catId === "other") {
      setScreen("priority");
    } else {
      setScreen("qualifier");
    }
  }

  function handleQualifierSelect(qualId: QualifierId) {
    setService(qualId);
    setDirection(1);
    setScreen("priority");
  }

  function handleSomethingElse() {
    setDirection(1);
    setScreen("qualifier-expanded");
  }

  function handleStillNotSure() {
    setService(null);
    setDirection(1);
    setScreen("priority");
  }

  function handlePrioritySelect(priId: PriorityId) {
    setPriority(priId);
    setDirection(1);
    setScreen("timeline");
  }

  function handleTimelineSelect(tlId: TimelineId) {
    setTimeline(tlId);
    setDirection(1);
    setScreen("confirmation");
  }

  function handleBack() {
    setDirection(-1);
    if (screen === "confirmation") {
      setTimeline(null);
      setScreen("timeline");
    } else if (screen === "timeline") {
      setPriority(null);
      setScreen("priority");
    } else if (screen === "priority") {
      if (category === "other") {
        setCategory(null);
        setScreen("category");
      } else {
        setScreen(service ? "qualifier" : "qualifier-expanded");
      }
    } else if (screen === "qualifier-expanded") {
      setService(null);
      setScreen("qualifier");
    } else if (screen === "qualifier") {
      setCategory(null);
      setService(null);
      setScreen("category");
    } else {
      setScreen("category");
    }
  }

  // Ref callback for the first focusable element on each screen
  const setFocusTarget = useCallback((el: HTMLElement | null) => {
    focusTargetRef.current = el;
  }, []);

  return (
    <section
      className="relative h-[100svh] touch-manipulation overflow-hidden"
      aria-label="Welcome -- tell us what you're building"
    >
      <HeroBackground />

      {/* Screen reader announcements */}
      <div ref={announcementRef} aria-live="polite" className="sr-only" />

      {/* No-JS fallback: simplified static layout */}
      <noscript>
        <div className="flex h-[100svh] flex-col items-center justify-center px-5 text-center">
          <h1 className="text-[1.875rem] font-bold leading-tight tracking-tight text-white">
            What are we building?
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            We build websites, web apps, and full platforms -- custom, not
            templated.
          </p>
          <a
            href="/services"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground"
          >
            Browse our services
          </a>
        </div>
      </noscript>

      <AnimatePresence mode="wait" custom={direction}>
        {/* === WELCOME === */}
        {screen === "welcome" && (
          <ConciergeScreen screenKey="welcome" direction={direction}>
            <button
              onClick={handleWelcomeTap}
              aria-label="Continue to get started"
              className="flex h-full w-full flex-col items-center"
            >
              {/* Top spacer -- pushes content to optical center */}
              <div className="flex-[1.2]" />

              {/* Tier 1: Brand -- the hero moment */}
              <div className="relative z-10 mx-auto w-full max-w-lg text-center md:max-w-3xl">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-sm md:text-base">
                  Welcome to
                </p>
                <h1 className="mt-2 text-6xl font-bold leading-[0.95] tracking-tight text-white sm:mt-3 sm:text-7xl md:text-8xl lg:text-9xl">
                  <span className="text-primary">Built</span>By
                  <span className="text-primary">Bas</span>
                </h1>
              </div>

              {/* Tier 2: Value prop -- quiet support text */}
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

              {/* Tier 3: CTA -- anchored near bottom, distinct from content */}
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

        {/* === CATEGORY (was "greeting") === */}
        {screen === "category" && (
          <ConciergeScreen screenKey="category" direction={direction}>
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

        {/* === QUALIFIER === */}
        {screen === "qualifier" && category && category !== "other" && (
          <ConciergeScreen screenKey="qualifier" direction={direction}>
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
            <div className="flex-1" />
            <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-xl lg:max-w-2xl">
              <h2 className="text-center text-[1.875rem] font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                {conciergeContent.qualifiers[category].headline}
              </h2>
              <div className="mt-8 flex flex-col gap-3 md:mt-10 md:gap-4">
                {conciergeContent.qualifiers[category].options.map(
                  (opt, index) => (
                    <ConciergeOption
                      key={opt.id}
                      ref={index === 0 ? setFocusTarget : undefined}
                      label={opt.label}
                      description={opt.description}
                      icon={opt.icon}
                      index={index}
                      onSelect={() => handleQualifierSelect(opt.id)}
                    />
                  ),
                )}
                {conciergeContent.qualifiers[category].hasSomethingElse && (
                  <ConciergeOption
                    label="Something else"
                    icon="HelpCircle"
                    index={
                      conciergeContent.qualifiers[category].options.length
                    }
                    onSelect={handleSomethingElse}
                  />
                )}
              </div>
            </div>
            <div className="flex-1" />
          </ConciergeScreen>
        )}

        {/* === QUALIFIER EXPANDED === */}
        {screen === "qualifier-expanded" &&
          category &&
          category !== "other" && (
            <ConciergeScreen
              screenKey="qualifier-expanded"
              direction={direction}
            >
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
              <div className="flex-1" />
              <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-xl lg:max-w-2xl">
                <h2 className="text-center text-[1.875rem] font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                  {conciergeContent.qualifiers[category].headline}
                </h2>
                <div className="mt-8 flex flex-col gap-3 md:mt-10 md:gap-4">
                  {conciergeContent.qualifiers[category].options.map(
                    (opt, index) => (
                      <ConciergeOption
                        key={opt.id}
                        ref={index === 0 ? setFocusTarget : undefined}
                        label={opt.label}
                        description={opt.description}
                        icon={opt.icon}
                        index={index}
                        onSelect={() => handleQualifierSelect(opt.id)}
                      />
                    ),
                  )}
                  <ConciergeOption
                    label="Still not sure?"
                    description="We'll help you figure it out"
                    icon="HelpCircle"
                    index={
                      conciergeContent.qualifiers[category].options.length
                    }
                    onSelect={handleStillNotSure}
                  />
                </div>
              </div>
              <div className="flex-1" />
            </ConciergeScreen>
          )}

        {/* === PRIORITY === */}
        {screen === "priority" && (
          <ConciergeScreen screenKey="priority" direction={direction}>
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
            <div className="flex-1" />
            <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-xl lg:max-w-2xl">
              <h2 className="text-center text-[1.875rem] font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                What matters most?
              </h2>
              <div className="mt-8 flex flex-col gap-3 md:mt-10 md:gap-4">
                {(category === "other" || !category
                  ? conciergeContent.otherPriorities
                  : conciergeContent.followUps[category].priorities
                ).map((pri, index) => (
                  <ConciergeOption
                    key={pri.id}
                    ref={index === 0 ? setFocusTarget : undefined}
                    label={pri.label}
                    icon={pri.icon ?? "Check"}
                    index={index}
                    onSelect={() => handlePrioritySelect(pri.id)}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1" />
          </ConciergeScreen>
        )}

        {/* === TIMELINE === */}
        {screen === "timeline" && (
          <ConciergeScreen screenKey="timeline" direction={direction}>
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
            <div className="flex-1" />
            <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-xl lg:max-w-2xl">
              <h2 className="text-center text-[1.875rem] font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                When do you need this?
              </h2>
              <div className="mt-8 flex flex-col gap-3 md:mt-10 md:gap-4">
                {conciergeContent.timelines.map((tl, index) => (
                  <ConciergeOption
                    key={tl.id}
                    ref={index === 0 ? setFocusTarget : undefined}
                    label={tl.label}
                    icon="Clock"
                    index={index}
                    onSelect={() => handleTimelineSelect(tl.id)}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1" />
          </ConciergeScreen>
        )}

        {/* === CONFIRMATION === */}
        {screen === "confirmation" && (
          <ConciergeScreen screenKey="confirmation" direction={direction}>
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
            <div className="flex-1" />
            <ConfirmationContent
              category={category}
              service={service}
              priority={priority}
              timeline={timeline}
              focusRef={setFocusTarget}
            />
            <div className="flex-1" />
          </ConciergeScreen>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Confirmation screen with 4.44s auto-transition to intake form */
function ConfirmationContent({
  category,
  service,
  priority,
  timeline,
  focusRef,
}: {
  category: CategoryId | null;
  service: QualifierId | null;
  priority: PriorityId | null;
  timeline: TimelineId | null;
  focusRef: (el: HTMLElement | null) => void;
}) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  // Auto-navigate after 4.44 seconds
  useEffect(() => {
    const url = buildIntakeUrl(service, priority, timeline, category);
    const timer = setTimeout(() => {
      router.push(url);
    }, 4440);
    return () => clearTimeout(timer);
  }, [service, priority, timeline, category, router]);

  // Tap anywhere to skip countdown
  function handleSkip() {
    const url = buildIntakeUrl(service, priority, timeline, category);
    router.push(url);
  }

  const isOther = category === "other" || !service;
  const serviceName = service ? serviceDisplayLabels[service] : "";
  const priorityName = priority
    ? (priorityDisplayLabels[priority] ?? priority)
    : "";
  const timelineName = timeline ? timelineDisplayLabels[timeline] : "";

  return (
    <button
      onClick={handleSkip}
      ref={focusRef as React.Ref<HTMLButtonElement>}
      tabIndex={-1}
      className="relative z-10 mx-auto w-full max-w-sm text-center outline-none md:max-w-xl lg:max-w-2xl"
      aria-label="Skip to intake form"
    >
      <h2 className="text-[1.875rem] font-bold leading-tight tracking-tight text-white md:text-4xl">
        {conciergeContent.confirmation.headline}
      </h2>
      <div className="mt-6 space-y-2 text-base leading-relaxed text-white/70 md:text-lg">
        {isOther ? (
          <>
            <p>You&apos;ve got something unique in mind.</p>
            <p>
              <span className="text-white">{priorityName}</span> matters most.
            </p>
            <p>
              And you&apos;re{" "}
              <span className="text-white">{timelineName}</span>.
            </p>
          </>
        ) : (
          <>
            <p>
              You&apos;re looking for{" "}
              <span className="text-white">{serviceName}</span>.
            </p>
            <p>
              <span className="text-white">{priorityName}</span> matters most.
            </p>
            <p>
              And you need it{" "}
              <span className="text-white">{timelineName}</span>.
            </p>
          </>
        )}
      </div>
      <p className="mt-8 text-sm text-white/40 md:text-base">
        {isOther
          ? "Let's find the right fit together."
          : "We've got the right form ready for you."}
      </p>
      {/* Progress bar */}
      <div className="mx-auto mt-6 h-1 w-32 overflow-hidden rounded-full bg-white/10 md:w-48">
        <div
          className={
            shouldReduceMotion
              ? "h-full w-full bg-primary/60"
              : "h-full animate-confirmation-fill bg-primary/60"
          }
          role="progressbar"
          aria-label="Redirecting to your form"
        />
      </div>
    </button>
  );
}
