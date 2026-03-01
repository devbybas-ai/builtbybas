"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "software", label: "Software" },
  { id: "ai", label: "AI" },
] as const;

export type FilterCategory = (typeof categories)[number]["id"];

interface PortfolioFilterProps {
  active: FilterCategory;
  onChange: (category: FilterCategory) => void;
}

export function PortfolioFilter({ active, onChange }: PortfolioFilterProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <nav aria-label="Filter projects by category" className="mb-10">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={cn(
              "relative rounded-full px-5 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active === cat.id
                ? "text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active === cat.id && !shouldReduceMotion && (
              <motion.span
                layoutId="portfolio-filter-indicator"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {active === cat.id && shouldReduceMotion && (
              <span className="absolute inset-0 rounded-full bg-primary" />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
