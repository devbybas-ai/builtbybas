"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { getCategoryMeta } from "@/data/portfolio";
import type { PortfolioProject } from "@/types/portfolio";

interface ProjectCardProps {
  project: PortfolioProject;
}

const accentGradients: Record<string, string> = {
  teal: "from-teal-500/15 via-background to-teal-400/10",
  blue: "from-blue-500/15 via-background to-blue-400/10",
  pink: "from-pink-500/15 via-background to-pink-400/10",
  indigo: "from-indigo-500/15 via-background to-indigo-400/10",
  cyan: "from-cyan-500/15 via-background to-cyan-400/10",
  emerald: "from-emerald-500/15 via-background to-emerald-400/10",
  amber: "from-amber-500/15 via-background to-amber-400/10",
};

const statusBadge: Record<string, { label: string; className: string }> = {
  live: { label: "Live", className: "bg-emerald-500/20 text-emerald-400" },
  "in-progress": { label: "In Progress", className: "bg-amber-500/20 text-amber-400" },
  demo: { label: "Interactive Demo", className: "bg-violet-500/20 text-violet-400" },
};

export function ProjectCard({ project }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const catMeta = getCategoryMeta(project.category);
  const gradient = accentGradients[project.colorAccent] ?? accentGradients.cyan;
  const badge = statusBadge[project.status];
  const maxCaps = 3;
  const visibleCaps = project.capabilities.slice(0, maxCaps);
  const overflowCount = project.capabilities.length - maxCaps;

  const content = (
    <>
      {/* Preview Area */}
      <div className={cn("relative aspect-video overflow-hidden rounded-t-xl bg-gradient-to-br", gradient)}>
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_60%)]" />
        )}
        <span
          className={cn(
            "absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm",
            badge.className,
          )}
        >
          {badge.label}
        </span>
        {catMeta && (
          <span
            className={cn(
              "absolute right-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm",
              catMeta.color,
            )}
          >
            {catMeta.label}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{project.subtitle}</p>

        {/* Capability pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleCaps.map((cap) => (
            <span
              key={cap}
              className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              {cap}
            </span>
          ))}
          {overflowCount > 0 && (
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground">
              +{overflowCount} more
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-4 flex items-center gap-4">
          <Link
            href={`/portfolio/${project.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-cyan-hover"
          >
            {project.isDemo ? "Try Demo" : "View Project"}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          {project.url && project.status === "live" && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Visit Site
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
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
