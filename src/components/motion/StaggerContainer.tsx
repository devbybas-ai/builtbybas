"use client";

import { motion } from "framer-motion";
import { staggerContainer, viewportOnce } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  delayChildren = 0,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      variants={staggerContainer(staggerDelay, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
