"use client";

import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className={`p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
