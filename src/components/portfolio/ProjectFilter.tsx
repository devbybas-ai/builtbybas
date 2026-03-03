"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { categoryMeta } from "@/data/portfolio";
import type { PortfolioCategory } from "@/types/portfolio";

export type FilterCategory = PortfolioCategory | "all";

interface ProjectFilterProps {
  active: FilterCategory;
  onChange: (category: FilterCategory) => void;
}

const allCategories = [
  { id: "all" as const, label: "Live" },
  ...categoryMeta.map((c) => ({ id: c.id, label: c.label })),
];

export function ProjectFilter({ active, onChange }: ProjectFilterProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <nav aria-label="Filter projects by category" className="mb-12">
      <div className="flex w-full overflow-x-auto scrollbar-hide border border-white/10 rounded-xl p-1 bg-white/5 backdrop-blur-sm gap-1">
        {allCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={cn(
              "relative flex-1 rounded-lg px-4 py-3 text-sm font-semibold tracking-wide uppercase transition-colors whitespace-nowrap",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active === cat.id
                ? "text-background"
                : "text-white/50 hover:text-white/80",
            )}
          >
            {active === cat.id && !shouldReduceMotion && (
              <motion.span
                layoutId="portfolio-filter-indicator"
                className="absolute inset-0 rounded-lg bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {active === cat.id && shouldReduceMotion && (
              <span className="absolute inset-0 rounded-lg bg-primary" />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
