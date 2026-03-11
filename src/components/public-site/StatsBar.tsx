"use client";

import { motion } from "framer-motion";
import { springs, viewportRepeat } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const stats = [
  { value: "100%", label: "Custom Built" },
  { value: "24hr", label: "Response Time" },
  { value: "Zero", label: "Templates Used" },
  { value: "Direct", label: "Dev Access" },
];

export function StatsBar() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mx-auto w-full max-w-4xl px-5 sm:px-4">
      {/* Mobile: 2x2 grid — compact, clean, no overflow */}
      <div className="grid grid-cols-2 gap-2.5 sm:hidden">
        {stats.map((stat, index) => {
          const card = (
            <div className="flex flex-col items-center rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 backdrop-blur-sm">
              <span className="text-lg font-bold text-primary">{stat.value}</span>
              <span className="mt-0.5 text-[0.7rem] text-muted-foreground">
                {stat.label}
              </span>
            </div>
          );

          if (shouldReduceMotion) return <div key={stat.label}>{card}</div>;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportRepeat}
              transition={{ ...springs.smooth, delay: 0.4 + index * 0.06 }}
            >
              {card}
            </motion.div>
          );
        })}
      </div>

      {/* Tablet+: 4-column grid */}
      <div className="hidden gap-4 sm:grid sm:grid-cols-4">
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
              transition={{ ...springs.smooth, delay: 0.4 + index * 0.06 }}
            >
              {card}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
