"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  PortfolioFilter,
  type FilterCategory,
} from "@/components/public-site/PortfolioFilter";
import { PortfolioCard } from "@/components/public-site/PortfolioCard";
import { getProjectsByCategory } from "@/data/portfolio";

export function PortfolioGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const shouldReduceMotion = useReducedMotion();
  const filteredProjects = getProjectsByCategory(activeFilter);

  return (
    <div>
      <PortfolioFilter active={activeFilter} onChange={setActiveFilter} />

      {shouldReduceMotion ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <PortfolioCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            viewport={viewportOnce}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.map((project) => (
              <PortfolioCard key={project.id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
