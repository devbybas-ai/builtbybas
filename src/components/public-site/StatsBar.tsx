"use client";

import { motion } from "framer-motion";
import { fadeInUp, springs, staggerContainer, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const stats = [
  { value: "100%", label: "Custom Built" },
  { value: "24hr", label: "Response Time" },
  { value: "Zero", label: "Templates Used" },
  { value: "AI", label: "Augmented Delivery" },
];

export function StatsBar() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl font-bold text-primary sm:text-3xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer(0.1, 0.7)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mx-auto grid max-w-4xl grid-cols-2 gap-6 px-4 sm:grid-cols-4"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={fadeInUp}
          transition={springs.smooth}
          className="text-center"
        >
          <div className="text-2xl font-bold text-primary sm:text-3xl">
            {stat.value}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
