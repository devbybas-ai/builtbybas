"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { springs, fadeInUp } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";
import { getCategoryMeta } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "@/types/portfolio";

interface DemoDetailProps {
  project: PortfolioProject;
  prevProject?: { slug: string; title: string };
  nextProject?: { slug: string; title: string };
  children: React.ReactNode;
}

export function DemoDetail({
  project,
  prevProject,
  nextProject,
  children,
}: DemoDetailProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const catMeta = getCategoryMeta(project.category);

  const Wrapper = shouldReduceMotion ? "div" : motion.div;
  const wrapperProps = shouldReduceMotion
    ? {}
    : { variants: fadeInUp, initial: "hidden", animate: "visible", transition: springs.smooth };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-background">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-background/80 px-4 py-3 backdrop-blur-lg">
          <h2 className="text-sm font-semibold">{project.title}</h2>
          <button
            onClick={() => setIsFullscreen(false)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            type="button"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            Exit Fullscreen
          </button>
        </div>
        <div className="p-4 sm:p-8">{children}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Portfolio
        </Link>
        <button
          onClick={() => setIsFullscreen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          type="button"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Fullscreen
        </button>
      </div>

      {/* Info Strip */}
      <Wrapper {...wrapperProps}>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {catMeta && (
              <span className={cn("rounded-full px-3 py-1 text-xs font-medium", catMeta.color)}>
                {catMeta.label}
              </span>
            )}
            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-400">
              Interactive Demo
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {project.title}
          </h1>
          <p className="text-muted-foreground">{project.subtitle}</p>
          <div className="flex flex-wrap gap-2">
            {project.capabilities.map((cap) => (
              <span
                key={cap}
                className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs text-primary"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </Wrapper>

      {/* Demo Area */}
      <FadeIn>
        <div className="min-h-[70vh] rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </FadeIn>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>

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
