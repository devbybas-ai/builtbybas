import type { Variants } from "framer-motion";

// ============================================================
// Spring Physics Presets
// ============================================================

export const springs = {
  snappy: { type: "spring", stiffness: 400, damping: 30 } as const,
  smooth: { type: "spring", stiffness: 100, damping: 20 } as const,
  gentle: { type: "spring", stiffness: 80, damping: 15 } as const,
  bouncy: { type: "spring", stiffness: 300, damping: 15 } as const,
} as const;

// ============================================================
// Duration Presets
// ============================================================

export const durations = {
  fast: 0.2,
  normal: 0.5,
  slow: 0.8,
  cinematic: 1.2,
} as const;

// ============================================================
// Reusable Animation Variants
// ============================================================

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

// ============================================================
// Stagger Container Factory
// ============================================================

export function staggerContainer(
  staggerDelay = 0.1,
  delayChildren = 0
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };
}

// ============================================================
// Viewport Detection Defaults
// ============================================================

export const viewportOnce = { once: true, margin: "0px 0px -100px 0px" } as const;
