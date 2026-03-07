"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollTeaser() {
  const shouldReduceMotion = useReducedMotion();

  const handleClick = () => {
    const next = document.getElementById("value-proposition");
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  if (shouldReduceMotion) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="flex flex-col items-center gap-1 text-white transition-colors hover:text-white/70"
        aria-label="Scroll to learn more"
      >
        <span className="text-xs font-medium uppercase tracking-widest">Learn More</span>
        <ChevronDown className="h-5 w-5" />
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.6 }}
      className="flex flex-col items-center gap-1 text-white transition-colors hover:text-white/70"
      aria-label="Scroll to learn more"
    >
      <span className="text-xs font-medium uppercase tracking-widest">Learn More</span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </motion.button>
  );
}
