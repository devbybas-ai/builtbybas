"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useInView, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface CountUpProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function CountUp({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const springValue = useSpring(0, { duration: duration * 1000 });
  const rounded = useTransform(springValue, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  const handleChange = useCallback((latest: number) => {
    setDisplayValue(latest);
  }, []);

  useEffect(() => {
    if (isInView && !shouldReduceMotion) {
      springValue.set(target);
    }
  }, [isInView, target, springValue, shouldReduceMotion]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", handleChange);
    return unsubscribe;
  }, [rounded, handleChange]);

  const value = shouldReduceMotion && isInView ? target : displayValue;

  return (
    <span ref={ref} className={cn(className)}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
