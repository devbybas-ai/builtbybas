"use client";

import { motion } from "framer-motion";
import { staggerItem } from "@/lib/motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: "cyan" | "violet" | "emerald" | "amber" | "rose";
  trend?: { value: string; up: boolean };
  suffix?: string;
}

const colorMap = {
  cyan: { icon: "text-cyan-400", bg: "rgba(0,212,255,0.08)", border: "rgba(0,212,255,0.2)", glow: "glow-cyan" },
  violet: { icon: "text-violet-400", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)", glow: "glow-violet" },
  emerald: { icon: "text-emerald-400", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", glow: "glow-emerald" },
  amber: { icon: "text-amber-400", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", glow: "glow-amber" },
  rose: { icon: "text-rose-400", bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.2)", glow: "glow-rose" },
};

export default function StatCard({ label, value, icon: Icon, color = "cyan", trend, suffix }: StatCardProps) {
  const c = colorMap[color];
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass rounded-xl p-4 cursor-default"
      style={{ borderColor: c.border }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: c.bg }}
        >
          <Icon className={`w-4.5 h-4.5 ${c.icon}`} size={18} />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
              trend.up
                ? "text-emerald-400 bg-emerald-400/10"
                : "text-rose-400 bg-rose-400/10"
            }`}
          >
            {trend.up ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold text-white mb-0.5`}>
        {value}
        {suffix && <span className="text-sm text-white/40 ml-1">{suffix}</span>}
      </div>
      <div className="text-xs text-white/40">{label}</div>
    </motion.div>
  );
}
