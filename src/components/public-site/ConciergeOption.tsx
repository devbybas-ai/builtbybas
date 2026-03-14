"use client";

import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Globe,
  LayoutDashboard,
  Layers,
  Sparkles,
  Check,
  RefreshCw,
  FileText,
  BarChart3,
  Users,
  Target,
  ShoppingCart,
  HelpCircle,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Globe,
  LayoutDashboard,
  Layers,
  Sparkles,
  Check,
  RefreshCw,
  FileText,
  BarChart3,
  Users,
  Target,
  ShoppingCart,
  HelpCircle,
  Clock,
};

interface ConciergeOptionProps {
  label: string;
  description?: string;
  icon: string;
  index: number;
  onSelect: () => void;
}

export const ConciergeOption = forwardRef<
  HTMLButtonElement,
  ConciergeOptionProps
>(function ConciergeOption({ label, description, icon, index, onSelect }, ref) {
  const shouldReduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(false);
  const IconComponent = iconMap[icon];

  function handleClick() {
    setSelected(true);
    // Brief green glow before transitioning
    setTimeout(onSelect, 150);
  }

  const card = (
    <button
      ref={ref}
      onClick={handleClick}
      data-concierge-option
      aria-label={`Select: ${label}`}
      className={`group flex min-h-[48px] w-full items-center gap-4 rounded-xl border px-5 py-4 text-left backdrop-blur-sm transition-all duration-300 active:scale-[0.98] ${
        selected
          ? "border-green-400/30 bg-green-400/10 shadow-[0_0_20px_-5px] shadow-green-400/20"
          : "border-white/[0.06] bg-white/[0.03] hover:border-green-400/20 hover:bg-white/[0.06]"
      }`}
    >
      {IconComponent && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
          <IconComponent className="h-5 w-5 text-green-400" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-base font-semibold text-white">{label}</div>
        {description && (
          <div className="mt-0.5 text-sm text-muted-foreground">
            {description}
          </div>
        )}
      </div>
    </button>
  );

  if (shouldReduceMotion) return card;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springs.smooth, delay: 0.15 + index * 0.08 }}
    >
      {card}
    </motion.div>
  );
});
