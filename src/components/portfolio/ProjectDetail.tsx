"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, Pause, Play } from "lucide-react";
import { springs, fadeInUp } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";
import { GlassCard } from "@/components/shared/GlassCard";
import { getCategoryMeta } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "@/types/portfolio";
import { ProjectHealthStats } from "@/components/portfolio/ProjectHealthStats";

interface ProjectDetailProps {
  project: PortfolioProject;
  prevProject?: { slug: string; title: string };
  nextProject?: { slug: string; title: string };
}

const accentGradients: Record<string, string> = {
  teal: "from-teal-500/20 via-background to-teal-400/10",
  blue: "from-blue-500/20 via-background to-blue-400/10",
  pink: "from-pink-500/20 via-background to-pink-400/10",
  indigo: "from-indigo-500/20 via-background to-indigo-400/10",
  cyan: "from-cyan-500/20 via-background to-cyan-400/10",
  emerald: "from-emerald-500/20 via-background to-emerald-400/10",
  amber: "from-amber-500/20 via-background to-amber-400/10",
};

const statusBadge: Record<string, { label: string; className: string }> = {
  live: { label: "Live", className: "bg-emerald-500/20 text-emerald-400" },
  "in-progress": { label: "In Progress", className: "bg-amber-500/20 text-amber-400" },
  demo: { label: "Interactive Demo", className: "bg-violet-500/20 text-violet-400" },
};

const CYCLE_INTERVAL = 5000;

export function ProjectDetail({
  project,
  prevProject,
  nextProject,
}: ProjectDetailProps) {
  const shouldReduceMotion = useReducedMotion();
  const catMeta = getCategoryMeta(project.category);
  const gradient = accentGradients[project.colorAccent] ?? accentGradients.cyan;
  const badge = statusBadge[project.status];

  const galleryImages = project.image
    ? [project.image, ...(project.gallery ?? [])]
    : [];
  const hasGallery = galleryImages.length > 1;

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (shouldReduceMotion || galleryImages.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    }, CYCLE_INTERVAL);
  }, [clearTimer, shouldReduceMotion, galleryImages.length]);

  useEffect(() => {
    if (!paused) startTimer();
    return clearTimer;
  }, [paused, startTimer, clearTimer]);

  const handleThumbClick = (index: number) => {
    setActiveIndex(index);
    startTimer();
  };

  const Wrapper = shouldReduceMotion ? "div" : motion.div;
  const wrapperProps = shouldReduceMotion
    ? {}
    : { variants: fadeInUp, initial: "hidden", animate: "visible", transition: springs.smooth };

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Portfolio
      </Link>

      {/* Hero */}
      <Wrapper {...wrapperProps}>
        {galleryImages.length > 0 && (
          <div
            className="overflow-hidden rounded-2xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setPaused(false);
              }
            }}
          >
            {/* Main Image */}
            <div className="relative aspect-[21/9] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={galleryImages[activeIndex]}
                    alt={`${project.title} screenshot ${activeIndex + 1}`}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1024px"
                    priority={activeIndex === 0}
                    quality={90}
                    className="object-cover object-top"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />

              {/* Pause/Play toggle */}
              {!shouldReduceMotion && hasGallery && (
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                  aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                >
                  {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </button>
              )}

              {/* Progress indicators */}
              {!shouldReduceMotion && hasGallery && (
                <div className="absolute bottom-0 left-0 right-0 z-10 flex gap-1 px-2 pb-2">
                  {galleryImages.map((_, i) => (
                    <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{
                          width: i === activeIndex ? "100%" : i < activeIndex ? "100%" : "0%",
                        }}
                        transition={
                          i === activeIndex && !paused
                            ? { duration: CYCLE_INTERVAL / 1000, ease: "linear" }
                            : { duration: 0.2 }
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {hasGallery && (
              <div className="flex gap-1.5 bg-black/30 p-1.5 backdrop-blur-sm">
                {galleryImages.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => handleThumbClick(i)}
                    className={cn(
                      "relative h-14 flex-1 overflow-hidden rounded transition-all sm:h-16",
                      i === activeIndex
                        ? "ring-2 ring-primary ring-offset-1 ring-offset-black/50"
                        : "opacity-50 hover:opacity-80",
                    )}
                    aria-label={`View screenshot ${i + 1}`}
                  >
                    <Image src={src} alt="" fill sizes="200px" quality={85} className="object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 sm:p-12", galleryImages.length > 0 ? "" : gradient)}>
          {galleryImages.length === 0 && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_60%)]" />
          )}
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {catMeta && (
                <span className={cn("rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm", catMeta.color)}>
                  {catMeta.label}
                </span>
              )}
              <span className={cn("rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm", badge.className)}>
                {badge.label}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {project.title}
            </h1>
            <p className="text-lg text-muted-foreground">{project.subtitle}</p>
          </div>
        </div>
      </Wrapper>

      {/* What We Built */}
      <FadeIn>
        <GlassCard as="section">
          <h2 className="text-lg font-semibold">What We Built</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{project.description}</p>
          {project.url && project.status === "live" && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine neon-glow mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-cyan-hover"
            >
              Visit Live Site
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {project.status === "in-progress" && (
            <p className="mt-4 text-sm text-amber-400">
              This project is currently in development. Check back soon for the live site.
            </p>
          )}
        </GlassCard>
      </FadeIn>

      {/* The Challenge */}
      {project.challenge && (
        <FadeIn>
          <GlassCard as="section">
            <h2 className="text-lg font-semibold">The Challenge</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {project.challenge}
            </p>
          </GlassCard>
        </FadeIn>
      )}

      {/* Our Approach */}
      {project.approach && (
        <FadeIn>
          <GlassCard as="section">
            <h2 className="text-lg font-semibold">Our Approach</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {project.approach}
            </p>
          </GlassCard>
        </FadeIn>
      )}

      {/* Project Scope */}
      {project.scope && project.scope.length > 0 && (
        <FadeIn>
          <GlassCard as="section">
            <h2 className="text-lg font-semibold">Project Scope</h2>
            <ul className="mt-4 space-y-3">
              {project.scope.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </FadeIn>
      )}

      {/* Project Health */}
      {project.health && (
        <ProjectHealthStats health={project.health} checklist={project.healthChecklist} />
      )}

      {/* Capabilities */}
      <FadeIn>
        <GlassCard as="section">
          <h2 className="text-lg font-semibold">Capabilities Demonstrated</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.capabilities.map((cap) => (
              <span
                key={cap}
                className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary"
              >
                {cap}
              </span>
            ))}
          </div>
        </GlassCard>
      </FadeIn>

      {/* Technology Choices */}
      {project.techChoices && project.techChoices.length > 0 ? (
        <FadeIn>
          <GlassCard as="section">
            <h2 className="text-lg font-semibold">Why We Chose This Stack</h2>
            <div className="mt-4 space-y-4">
              {project.techChoices.map((choice) => (
                <div key={choice.tech} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-sm font-semibold text-primary">{choice.tech}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {choice.reason}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </FadeIn>
      ) : (
        <FadeIn>
          <GlassCard as="section">
            <h2 className="text-lg font-semibold">Technology Stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-white/5 px-3 py-1 text-sm text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </GlassCard>
        </FadeIn>
      )}

      {/* Navigation */}
      <nav
        aria-label="Project navigation"
        className="flex items-center justify-between border-t border-white/5 pt-8"
      >
        {prevProject ? (
          <Link
            href={`/portfolio/${prevProject.slug}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">{prevProject.title}</span>
            <span className="sm:hidden">Previous</span>
          </Link>
        ) : (
          <div />
        )}

        <Link
          href="/portfolio"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          All Projects
        </Link>

        {nextProject ? (
          <Link
            href={`/portfolio/${nextProject.slug}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="hidden sm:inline">{nextProject.title}</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
