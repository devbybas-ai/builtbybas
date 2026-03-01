"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { springs, fadeInUp } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FadeIn } from "@/components/motion/FadeIn";
import { GlassCard } from "@/components/shared/GlassCard";
import { getCategoryMeta } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "@/types/portfolio";

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

export function ProjectDetail({
  project,
  prevProject,
  nextProject,
}: ProjectDetailProps) {
  const shouldReduceMotion = useReducedMotion();
  const catMeta = getCategoryMeta(project.category);
  const gradient = accentGradients[project.colorAccent] ?? accentGradients.cyan;
  const badge = statusBadge[project.status];

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
        <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 sm:p-12", gradient)}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_60%)]" />
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {catMeta && (
                <span className={cn("rounded-full px-3 py-1 text-xs font-medium", catMeta.color)}>
                  {catMeta.label}
                </span>
              )}
              <span className={cn("rounded-full px-3 py-1 text-xs font-medium", badge.className)}>
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
              className="btn-shine mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-cyan-hover"
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

      {/* Technologies */}
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
