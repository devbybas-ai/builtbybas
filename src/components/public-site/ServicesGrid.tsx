"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInitialViewportCheck } from "@/hooks/useInitialViewportCheck";
import { ServiceCard } from "@/components/public-site/ServiceCard";
import { ServiceWalkthroughOverlay } from "@/components/public-site/ServiceWalkthroughOverlay";
import { services } from "@/data/services";
import type { Service } from "@/types/services";

export function ServicesGrid() {
  const shouldReduceMotion = useReducedMotion();
  const [activeService, setActiveService] = useState<Service | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: "0px 0px -40px 0px" });
  const mountVisible = useInitialViewportCheck(gridRef);

  const grid = (
    <>
      {services.map((service) => {
        const card = (
          <ServiceCard
            key={service.id}
            service={service}
            onClick={
              service.walkthrough
                ? () => setActiveService(service)
                : undefined
            }
          />
        );
        return card;
      })}
    </>
  );

  return (
    <>
      {shouldReduceMotion ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{grid}</div>
      ) : (
        <motion.div
          ref={gridRef}
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate={isInView || mountVisible ? "visible" : "hidden"}
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
