"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectFilter, type FilterCategory } from "@/components/portfolio/ProjectFilter";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { getProjectsByCategory } from "@/data/portfolio";

export function ProjectGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const shouldReduceMotion = useReducedMotion();
  const filteredProjects = getProjectsByCategory(activeFilter === "all" ? "all" : activeFilter);

  return (
    <div>
      <ProjectFilter active={activeFilter} onChange={setActiveFilter} />

      {shouldReduceMotion ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
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
