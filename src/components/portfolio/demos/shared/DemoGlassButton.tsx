"use client";

import { motion } from "framer-motion";
import { demoSprings } from "@/lib/demo-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoGlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}

const variants = {
  primary: "bg-cyan-400/15 hover:bg-cyan-400/25 text-cyan-400 border-cyan-400/30",
  secondary: "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10",
  danger: "bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border-rose-500/30",
  ghost: "bg-transparent hover:bg-white/5 text-white/50 hover:text-white border-transparent",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
};

export function DemoGlassButton({
  children, onClick, icon: Icon, variant = "secondary", size = "md", disabled, className,
}: DemoGlassButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={demoSprings.snappy}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center font-medium rounded-lg border transition-colors",
        variants[variant],
        sizes[size],
        disabled && "opacity-40 cursor-not-allowed",
        className,
      )}
    >
      {Icon && <Icon size={size === "sm" ? 12 : 14} />}
      {children}
    </motion.button>
  );
}
