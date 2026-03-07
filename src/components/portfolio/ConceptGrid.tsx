"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ConceptSubfilter } from "@/components/portfolio/ConceptSubfilter";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { getProjectsByCategory } from "@/data/portfolio";

export function ConceptGrid() {
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const shouldReduceMotion = useReducedMotion();

  const allConcepts = getProjectsByCategory("concept");
  const filtered =
    activeSubcategory !== "all"
      ? allConcepts.filter((p) => p.subcategory === activeSubcategory)
      : allConcepts;

  return (
    <div>
      <ConceptSubfilter active={activeSubcategory} onChange={setActiveSubcategory} />

      {shouldReduceMotion ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubcategory}
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
