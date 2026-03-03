"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { conceptSubcategories } from "@/data/portfolio";

interface ConceptSubfilterProps {
  active: string;
  onChange: (subcategory: string) => void;
}

const allOptions = [
  { id: "all", label: "All" },
  ...conceptSubcategories,
];

export function ConceptSubfilter({ active, onChange }: ConceptSubfilterProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.nav
      aria-label="Filter concepts by subcategory"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-8 overflow-hidden"
    >
      <div className="flex w-full overflow-x-auto scrollbar-hide border border-white/5 rounded-lg p-1 bg-white/[0.02] gap-1">
        {allOptions.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onChange(sub.id)}
            className={cn(
              "relative flex-1 rounded-md px-3 py-2 text-xs font-medium tracking-wide transition-colors whitespace-nowrap",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active === sub.id
                ? "text-background"
                : "text-white/40 hover:text-white/70",
            )}
          >
            {active === sub.id && !shouldReduceMotion && (
              <motion.span
                layoutId="concept-subfilter-indicator"
                className="absolute inset-0 rounded-md bg-rose-500/80"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {active === sub.id && shouldReduceMotion && (
              <span className="absolute inset-0 rounded-md bg-rose-500/80" />
            )}
            <span className="relative z-10">{sub.label}</span>
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
