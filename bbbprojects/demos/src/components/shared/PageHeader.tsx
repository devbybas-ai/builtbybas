"use client";

import { motion } from "framer-motion";
import { fadeUp, springs } from "@/lib/motion";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: "cyan" | "violet" | "emerald" | "amber" | "rose";
  action?: React.ReactNode;
}

const colorMap = {
  cyan: { icon: "text-cyan-400", bg: "rgba(0,212,255,0.1)", ring: "rgba(0,212,255,0.3)" },
  violet: { icon: "text-violet-400", bg: "rgba(139,92,246,0.1)", ring: "rgba(139,92,246,0.3)" },
  emerald: { icon: "text-emerald-400", bg: "rgba(16,185,129,0.1)", ring: "rgba(16,185,129,0.3)" },
  amber: { icon: "text-amber-400", bg: "rgba(245,158,11,0.1)", ring: "rgba(245,158,11,0.3)" },
  rose: { icon: "text-rose-400", bg: "rgba(244,63,94,0.1)", ring: "rgba(244,63,94,0.3)" },
};

export default function PageHeader({ title, subtitle, icon: Icon, color = "cyan", action }: PageHeaderProps) {
  const c = colorMap[color];
  return (
    <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: c.bg, boxShadow: `0 0 0 1px ${c.ring}` }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={springs.bouncy}
        >
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
