"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerContainer } from "@/components/motion/StaggerContainer";
import { CountUp } from "@/components/motion/CountUp";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motion } from "framer-motion";
import { springs } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "@/types/portfolio";

const categoryColors: Record<string, string> = {
  web: "bg-primary/20 text-primary",
  software: "bg-violet-500/20 text-violet-400",
  ai: "bg-emerald-500/20 text-emerald-400",
};

const categoryLabels: Record<string, string> = {
  web: "Web Development",
  software: "Custom Software",
  ai: "AI Solutions",
};

interface CaseStudyLayoutProps {
  project: PortfolioProject;
  prevProject?: { slug: string; title: string };
  nextProject?: { slug: string; title: string };
}

function parseNumericResult(result: string): {
  prefix: string;
  number: number;
  suffix: string;
} | null {
  const match = result.match(/^([\d,.]+)(%?\+?)/);
  if (!match) return null;
  const num = parseFloat(match[1].replace(/,/g, ""));
  if (isNaN(num)) return null;
  const suffix = result.slice(match[0].length).trim();
  return { prefix: "", number: num, suffix: `${match[2]} ${suffix}` };
}

export function CaseStudyLayout({
  project,
  prevProject,
  nextProject,
}: CaseStudyLayoutProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Link
              href="/portfolio"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Portfolio
            </Link>

            <span
              className={cn(
                "inline-block rounded-full px-3 py-1 text-xs font-medium",
                categoryColors[project.category]
              )}
            >
              {categoryLabels[project.category]}
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {project.title}
            </h1>

            <p className="mt-2 text-lg text-muted-foreground">
              {project.client}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Challenge */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-bold">
              The <span className="text-gradient">Challenge</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {project.challenge}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-bold">
              The <span className="text-gradient">Solution</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {project.solution}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Results */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-10">
            <h2 className="text-2xl font-bold">
              The <span className="text-gradient">Results</span>
            </h2>
          </FadeIn>

          <StaggerContainer
            className="grid gap-4 sm:grid-cols-2"
            staggerDelay={0.15}
          >
            {project.results.map((result) => {
              const parsed = parseNumericResult(result);
              return (
                <FadeIn key={result}>
                  <div className="glass-card p-6">
                    {parsed ? (
                      <>
                        <div className="text-3xl font-bold text-primary">
                          <CountUp target={parsed.number} />
                          {parsed.suffix.startsWith("%")
                            ? parsed.suffix
                            : ` ${parsed.suffix}`}
                        </div>
                      </>
                    ) : (
                      <p className="text-lg font-medium">{result}</p>
                    )}
                  </div>
                </FadeIn>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-6">
            <h2 className="text-2xl font-bold">
              Tech <span className="text-gradient">Stack</span>
            </h2>
          </FadeIn>

          <StaggerContainer className="flex flex-wrap gap-2" staggerDelay={0.05}>
            {project.technologies.map((tech) => (
              <FadeIn key={tech}>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium">
                  {tech}
                </span>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-6">
            <h2 className="text-2xl font-bold">
              Key <span className="text-gradient">Features</span>
            </h2>
          </FadeIn>

          <StaggerContainer
            className="grid gap-3 sm:grid-cols-2"
            staggerDelay={0.08}
          >
            {project.features.map((feature) => (
              <FadeIn key={feature}>
                <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-4">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm">{feature}</span>
                </div>
              </FadeIn>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonial */}
      {project.testimonial && (
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <blockquote className="glass-card p-8 sm:p-10">
                <p className="text-lg italic leading-relaxed text-foreground/90">
                  &ldquo;{project.testimonial.text}&rdquo;
                </p>
                <footer className="mt-6">
                  <p className="font-semibold">
                    {project.testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {project.testimonial.role}
                  </p>
                </footer>
              </blockquote>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="border-t border-white/5 py-12">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {prevProject ? (
            <Link
              href={`/portfolio/${prevProject.slug}`}
              className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {shouldReduceMotion ? (
                <ArrowLeft className="h-4 w-4" />
              ) : (
                <motion.span
                  whileHover={{ x: -4 }}
                  transition={springs.snappy}
                >
                  <ArrowLeft className="h-4 w-4" />
                </motion.span>
              )}
              <span className="hidden sm:inline">Previous</span>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/portfolio"
            className="text-sm font-medium text-primary transition-colors hover:text-cyan-hover"
          >
            All Projects
          </Link>

          {nextProject ? (
            <Link
              href={`/portfolio/${nextProject.slug}`}
              className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="hidden sm:inline">Next</span>
              {shouldReduceMotion ? (
                <ArrowRight className="h-4 w-4" />
              ) : (
                <motion.span
                  whileHover={{ x: 4 }}
                  transition={springs.snappy}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              )}
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </div>
  );
}
