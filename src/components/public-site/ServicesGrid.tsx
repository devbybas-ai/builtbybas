"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { staggerContainer, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ServiceCard } from "@/components/public-site/ServiceCard";
import { ServiceWalkthroughOverlay } from "@/components/public-site/ServiceWalkthroughOverlay";
import { services } from "@/data/services";
import type { Service } from "@/types/services";

export function ServicesGrid() {
  const shouldReduceMotion = useReducedMotion();
  const [activeService, setActiveService] = useState<Service | null>(null);

  const grid = (
    <>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onClick={
            service.walkthrough
              ? () => setActiveService(service)
              : undefined
          }
        />
      ))}
    </>
  );

  return (
    <>
      {shouldReduceMotion ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{grid}</div>
      ) : (
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {grid}
        </motion.div>
      )}

      <AnimatePresence>
        {activeService?.walkthrough && (
          <ServiceWalkthroughOverlay
            key={activeService.id}
            service={activeService}
            onClose={() => setActiveService(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
