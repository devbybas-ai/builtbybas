"use client";

import { motion } from "framer-motion";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ConciergeScreenProps {
  screenKey: string;
  direction: 1 | -1; // 1 = forward (slide left), -1 = back (slide right)
  children: React.ReactNode;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "30%" : "-30%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-30%" : "30%",
    opacity: 0,
  }),
};

export function ConciergeScreen({
  screenKey,
  direction,
  children,
}: ConciergeScreenProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div key={screenKey} className="flex h-[100svh] flex-col px-5 pb-8 pt-20">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      key={screenKey}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={springs.smooth}
      className="flex h-[100svh] flex-col px-5 pb-8 pt-20"
    >
      {children}
    </motion.div>
  );
}
