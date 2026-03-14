"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ServiceCard } from "@/components/public-site/ServiceCard";
import { ServiceWalkthroughOverlay } from "@/components/public-site/ServiceWalkthroughOverlay";
import { services } from "@/data/services";
import type { Service } from "@/types/services";

export function ServicesGrid() {
  const shouldReduceMotion = useReducedMotion();
  const [activeService, setActiveService] = useState<Service | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: "0px 0px -40px 0px" });
  const [mountVisible, setMountVisible] = useState(false);

  // iOS Safari fix: IntersectionObserver may not fire for elements
  // already in viewport on mount (same pattern as FadeIn)
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setMountVisible(true);
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const grid = (
    <>
      {services.map((service, index) => {
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
