"use client";

import { motion } from "framer-motion";
import { staggerContainer, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ServiceCard } from "@/components/public-site/ServiceCard";
import { services } from "@/data/services";

export function ServicesGrid() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </motion.div>
  );
}
