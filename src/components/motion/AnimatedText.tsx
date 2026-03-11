"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  staggerDelay?: number;
  children?: React.ReactNode;
}

export function AnimatedText({
  text,
  className,
  as: Tag = "p",
  delay = 0,
  staggerDelay = 0.05,
  children,
}: AnimatedTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const [mountVisible, setMountVisible] = useState(false);

  useEffect(() => {
    // iOS Safari fix: IntersectionObserver may not fire for elements
    // already in viewport during Next.js client-side navigation
    const frame = requestAnimationFrame(() => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setMountVisible(true);
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (shouldReduceMotion) {
    return (
      <Tag className={className}>
        {text}
        {children}
      </Tag>
    );
  }

  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: springs.smooth,
    },
  };

  return (
    <Tag className={cn(className)}>
      <motion.span
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView || mountVisible ? "visible" : "hidden"}
        className="inline"
        aria-label={text}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={wordVariants}
            className="inline-block"
            aria-hidden="true"
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </motion.span>
      {children}
    </Tag>
  );
}
