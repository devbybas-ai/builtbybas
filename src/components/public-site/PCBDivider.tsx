"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function PCBDivider() {
  const shouldReduceMotion = useReducedMotion();

  const svg = (
    <svg
      viewBox="0 0 300 20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className="mx-auto w-full max-w-xs"
      aria-hidden="true"
    >
      {!shouldReduceMotion && (
        <style>{`
          @keyframes pcb-divider-pulse {
            0%, 100% { stroke-opacity: 0.08; }
            50% { stroke-opacity: 0.2; }
          }
          @keyframes pcb-divider-node {
            0%, 100% { fill-opacity: 0.15; }
            50% { fill-opacity: 0.4; }
          }
          @keyframes pcb-divider-trace {
            0% { stroke-dashoffset: 160; }
            50% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -160; }
          }
          .pcb-div-line { animation: pcb-divider-pulse 4s ease-in-out infinite; }
          .pcb-div-node { animation: pcb-divider-node 4s ease-in-out infinite; }
          .pcb-div-trace {
            stroke-dasharray: 20 140;
            animation: pcb-divider-trace 6s ease-in-out infinite;
          }
        `}</style>
      )}

      {/* Base trace line */}
      <line
        x1="20" y1="10" x2="280" y2="10"
        stroke="rgba(0, 212, 255, 0.08)"
        strokeWidth="0.8"
        className={shouldReduceMotion ? "" : "pcb-div-line"}
      />

      {/* Animated glow trace */}
      {!shouldReduceMotion && (
        <line
          x1="20" y1="10" x2="280" y2="10"
          stroke="rgba(0, 212, 255, 0.25)"
          strokeWidth="1"
          strokeLinecap="round"
          className="pcb-div-trace"
        />
      )}

      {/* Center junction node — green accent */}
      <circle
        cx="150" cy="10" r="3"
        fill="rgba(74, 222, 128, 0.15)"
        className={shouldReduceMotion ? "" : "pcb-div-node"}
      />
      <circle
        cx="150" cy="10" r="1.2"
        fill="rgba(74, 222, 128, 0.4)"
      />

      {/* Small side nodes */}
      <circle cx="60" cy="10" r="1.5" fill="rgba(0, 212, 255, 0.1)" />
      <circle cx="240" cy="10" r="1.5" fill="rgba(0, 212, 255, 0.1)" />

      {/* Short perpendicular ticks */}
      <line x1="60" y1="6" x2="60" y2="14" stroke="rgba(0, 212, 255, 0.06)" strokeWidth="0.5" />
      <line x1="240" y1="6" x2="240" y2="14" stroke="rgba(0, 212, 255, 0.06)" strokeWidth="0.5" />
      <line x1="100" y1="7" x2="100" y2="13" stroke="rgba(0, 212, 255, 0.05)" strokeWidth="0.5" />
      <line x1="200" y1="7" x2="200" y2="13" stroke="rgba(0, 212, 255, 0.05)" strokeWidth="0.5" />
    </svg>
  );

  if (shouldReduceMotion) {
    return (
      <div className="my-4 hidden md:block" aria-hidden="true">
        {svg}
      </div>
    );
  }

  return (
    <motion.div
      className="my-4 hidden md:block"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 0.5 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {svg}
    </motion.div>
  );
}
