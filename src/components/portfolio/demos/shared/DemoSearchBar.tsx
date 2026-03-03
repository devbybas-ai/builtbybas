"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { demoSprings } from "@/lib/demo-motion";

interface DemoSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DemoSearchBar({ value, onChange, placeholder = "Search..." }: DemoSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full demo-glass rounded-lg pl-8 pr-8 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-sky-500/30 transition-colors"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={demoSprings.snappy}
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
        >
          <X size={12} />
        </motion.button>
      )}
    </div>
  );
}
