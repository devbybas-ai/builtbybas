"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import {
  conciergeContent,
  getPayoff,
  getIntakeHref,
  type CategoryId,
  type PriorityId,
} from "@/lib/concierge-content";
import { projects } from "@/data/portfolio";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

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

/** Extracted payoff content to keep MobileConcierge lean */
export function PayoffContent({
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
  const detailOverlayRef = useRef<HTMLDivElement>(null);
  const isDetailOpen = detailProject !== null;

  useFocusTrap(detailOverlayRef, isDetailOpen);
  useBodyScrollLock(isDetailOpen);

  // Close detail overlay on Escape key
  useEffect(() => {
    if (!isDetailOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDetailProject(null);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDetailOpen]);

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
      <div
        ref={detailOverlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-label={`${detailProject.title} project details`}
      >
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

          {/* Content -- hidden scrollbar */}
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
                className={`w-[90%] flex-shrink-0 snap-center overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.05] text-left backdrop-blur-sm transition-colors hover:border-white/[0.12] ${i >= carouselItems.length ? "hidden md:block" : ""}`}
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
