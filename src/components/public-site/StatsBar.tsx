"use client";

import { motion } from "framer-motion";
import { springs, viewportRepeat } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const stats = [
  { value: "100%", label: "Custom Built", accent: "from-cyan-400 to-blue-500" },
  { value: "24hr", label: "Response Time", accent: "from-violet-400 to-purple-500" },
  { value: "Zero", label: "Templates Used", accent: "from-emerald-400 to-teal-500" },
  { value: "AI", label: "Augmented Delivery", accent: "from-amber-400 to-orange-500" },
];

export function StatsBar() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 px-4 sm:grid-cols-4">
      {stats.map((stat, index) => {
        const card = (
          <div className="group relative text-center">
            <div className="glass-card relative px-4 py-5 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_0_25px_-5px] hover:shadow-primary/10">

              <div className="text-2xl font-bold text-primary transition-transform duration-300 group-hover:scale-110 sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          </div>
        );

        if (shouldReduceMotion) return <div key={stat.label}>{card}</div>;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportRepeat}
            transition={{ ...springs.smooth, duration: 0.5, delay: 0.7 + index * 0.1 }}
          >
            {card}
          </motion.div>
        );
      })}
    </div>
  );
}
