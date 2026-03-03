"use client";

import { motion } from "framer-motion";
import { demoPageVariants } from "@/lib/demo-motion";

interface DemoPageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function DemoPageWrapper({ children, className = "" }: DemoPageWrapperProps) {
  return (
    <motion.div
      variants={demoPageVariants}
      initial="hidden"
      animate="visible"
      className={`p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
