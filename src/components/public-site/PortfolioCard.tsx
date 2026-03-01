"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "@/types/portfolio";

interface PortfolioCardProps {
  project: PortfolioProject;
}

const categoryColors: Record<string, string> = {
  web: "bg-primary/20 text-primary",
  software: "bg-violet-500/20 text-violet-400",
  ai: "bg-emerald-500/20 text-emerald-400",
};

const categoryLabels: Record<string, string> = {
  web: "Web",
  software: "Software",
  ai: "AI",
};

export function PortfolioCard({ project }: PortfolioCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const maxTech = 3;
  const visibleTech = project.technologies.slice(0, maxTech);
  const overflowCount = project.technologies.length - maxTech;

  const content = (
    <>
      {/* Thumbnail / Gradient Placeholder */}
      <div className="relative aspect-video overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/10 via-background to-violet-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,212,255,0.15),transparent_60%)]" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="rounded bg-background/80 px-2 py-0.5 backdrop-blur-sm">
            {project.client}
          </span>
        </div>
        <span
          className={cn(
            "absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium",
            categoryColors[project.category]
          )}
        >
          {categoryLabels[project.category]}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-tight">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">
          {project.description}
        </p>

        {/* Tech pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleTech.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {overflowCount > 0 && (
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground">
              +{overflowCount} more
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/portfolio/${project.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-cyan-hover"
        >
          View Case Study
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </>
  );

  if (shouldReduceMotion) {
    return (
      <div className="glass-card-hover flex h-full flex-col overflow-hidden">
        {content}
      </div>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, rotateY: -5, scale: 0.95 },
        visible: { opacity: 1, rotateY: 0, scale: 1 },
      }}
      transition={springs.smooth}
      whileHover={{
        y: -8,
        borderColor: "rgba(0, 212, 255, 0.3)",
        boxShadow: "0 0 30px rgba(0, 212, 255, 0.1)",
      }}
      style={{ transformPerspective: 800 }}
      className="glass-card flex h-full flex-col overflow-hidden"
    >
      {content}
    </motion.div>
  );
}
