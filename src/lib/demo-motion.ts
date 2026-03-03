import type { Variants } from "framer-motion";

// Spring presets for demo components
export const demoSprings = {
  snappy: { type: "spring" as const, stiffness: 500, damping: 35 },
  smooth: { type: "spring" as const, stiffness: 300, damping: 30 },
  gentle: { type: "spring" as const, stiffness: 150, damping: 25 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 20 },
};

// Page transition
export const demoPageVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...demoSprings.smooth, staggerChildren: 0.06 },
  },
};

// Fade up (single item)
export const demoFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: demoSprings.smooth },
};

// Stagger container
export const demoStaggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

// Stagger item
export const demoStaggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 35, duration: 0.25 } },
};

// Scale pop
export const demoScalePop: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: demoSprings.bouncy },
};

// Slide from left
export const demoSlideLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: demoSprings.smooth },
};

// Slide from right
export const demoSlideRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: demoSprings.smooth },
};

// Card hover spring
export const demoCardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -2, transition: demoSprings.snappy },
};

// Stat counter
export const demoStatVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...demoSprings.bouncy, delay: 0.2 },
  },
};
