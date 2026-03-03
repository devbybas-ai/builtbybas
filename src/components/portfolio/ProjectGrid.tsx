"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectFilter, type FilterCategory } from "@/components/portfolio/ProjectFilter";
import { ConceptSubfilter } from "@/components/portfolio/ConceptSubfilter";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { getProjectsByCategory } from "@/data/portfolio";

export function ProjectGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setActiveSubcategory("all");
  }, [activeFilter]);

  const allProjects = getProjectsByCategory(activeFilter === "all" ? "all" : activeFilter);
  const filteredProjects =
    activeFilter === "concept" && activeSubcategory !== "all"
      ? allProjects.filter((p) => p.subcategory === activeSubcategory)
      : allProjects;

  const gridKey = `${activeFilter}-${activeSubcategory}`;

  return (
    <div>
      <ProjectFilter active={activeFilter} onChange={setActiveFilter} />

      <AnimatePresence>
        {activeFilter === "concept" && (
          <ConceptSubfilter active={activeSubcategory} onChange={setActiveSubcategory} />
        )}
      </AnimatePresence>

      {shouldReduceMotion ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={gridKey}
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
