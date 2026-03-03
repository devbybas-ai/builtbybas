import type { Variants } from "framer-motion";

// Spring presets
export const springs = {
  snappy: { type: "spring" as const, stiffness: 500, damping: 35 },
  smooth: { type: "spring" as const, stiffness: 300, damping: 30 },
  gentle: { type: "spring" as const, stiffness: 150, damping: 25 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 20 },
};

// Page transition
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...springs.smooth, staggerChildren: 0.06 },
  },
};

// Fade up (single item)
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: springs.smooth },
};

// Stagger container
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

// Stagger item
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: springs.snappy },
};

// Scale pop
export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: springs.bouncy },
};

// Slide from left
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: springs.smooth },
};

// Slide from right
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: springs.smooth },
};

// Card hover spring
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -2, transition: springs.snappy },
};

// Stat counter
export const statVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...springs.bouncy, delay: 0.2 },
  },
};
