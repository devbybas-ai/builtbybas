"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Zap,
  X,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import GlassButton from "@/components/shared/GlassButton";
import SearchBar from "@/components/shared/SearchBar";
import { staggerContainer, staggerItem, springs, fadeUp } from "@/lib/motion";
import { cn, formatCurrency } from "@/lib/utils";
import { inventoryItems } from "@/data/seed";

const CATEGORIES = ["All", "Electronics", "Furniture", "Cables", "Accessories", "Office Supplies"];

const statusConfig = {
  "in-stock": {
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20",
    label: "In Stock",
    border: null,
    pulse: false,
  },
  "low-stock": {
    dot: "bg-amber-400",
    badge: "bg-amber-400/15 text-amber-400 border-amber-400/20",
    label: "Low Stock",
    border: "2px solid rgba(245,158,11,0.4)",
    pulse: true,
  },
  "out-of-stock": {
    dot: "bg-rose-400",
    badge: "bg-rose-400/15 text-rose-400 border-rose-400/20",
    label: "Out of Stock",
    border: "2px solid rgba(244,63,94,0.4)",
    pulse: true,
  },
};

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [alertDismissed, setAlertDismissed] = useState(false);

  const outOfStockCount = inventoryItems.filter((i) => i.status === "out-of-stock").length;
  const lowStockCount = inventoryItems.filter((i) => i.status === "low-stock").length;
  const inStockCount = inventoryItems.filter((i) => i.status === "in-stock").length;

  const filtered = inventoryItems.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <PageWrapper>
      <PageHeader
        title="Inventory System"
        subtitle="Stock levels, SKUs, and reorder management"
        icon={Package}
        color="violet"
      />

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <StatCard label="Total SKUs" value={10} icon={Package} color="violet" />
        <StatCard label="In Stock" value={inStockCount} icon={CheckCircle} color="emerald" />
        <StatCard
          label="Low Stock"
          value={lowStockCount}
          icon={AlertTriangle}
          color="amber"
          trend={{ value: "needs reorder", up: false }}
        />
        <StatCard label="Out of Stock" value={outOfStockCount} icon={XCircle} color="rose" />
      </motion.div>

      {/* Reorder Alert Banner */}
      <AnimatePresence>
        {outOfStockCount > 0 && !alertDismissed && (
          <motion.div
            key="alert-banner"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={springs.smooth}
            className="glass rounded-xl overflow-hidden"
            style={{
              borderLeft: "3px solid rgba(244,63,94,0.7)",
              background: "rgba(244,63,94,0.06)",
              border: "1px solid rgba(244,63,94,0.2)",
            }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span className="text-sm text-rose-300 font-medium">
                  {outOfStockCount} item{outOfStockCount > 1 ? "s" : ""} out of stock — immediate reorder needed
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={springs.snappy}
                onClick={() => setAlertDismissed(true)}
                className="text-rose-400/60 hover:text-rose-400 transition-colors"
              >
                <X size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + Filter */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name or SKU..."
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={springs.snappy}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                activeCategory === cat
                  ? "bg-violet-400/20 text-violet-300 border-violet-400/40"
                  : "bg-white/5 text-white/40 border-white/10 hover:text-white/70 hover:bg-white/8"
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Header Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-12 gap-3 px-4 mb-2">
        <span className="col-span-1" />
        <span className="col-span-3 text-xs text-white/30 font-medium uppercase tracking-wide">Item</span>
        <span className="col-span-2 text-xs text-white/30 font-medium uppercase tracking-wide">Category</span>
        <span className="col-span-2 text-xs text-white/30 font-medium uppercase tracking-wide">Location</span>
        <span className="col-span-1 text-xs text-white/30 font-medium uppercase tracking-wide text-center">Qty</span>
        <span className="col-span-2 text-xs text-white/30 font-medium uppercase tracking-wide text-right">Unit Cost</span>
        <span className="col-span-1" />
      </motion.div>

      {/* Inventory Rows */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => {
            const cfg = statusConfig[item.status as keyof typeof statusConfig];
            const qtyColor =
              item.qty === 0
                ? "bg-rose-400/15 text-rose-400 border-rose-400/20"
                : item.qty <= item.minQty
                ? "bg-amber-400/15 text-amber-400 border-amber-400/20"
                : "bg-emerald-400/15 text-emerald-400 border-emerald-400/20";

            return (
              <motion.div
                key={item.id}
                variants={staggerItem}
                layout
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ scale: 1.01, y: -1 }}
                transition={springs.snappy}
                className="glass rounded-xl p-4 grid grid-cols-12 gap-3 items-center"
                style={cfg.border ? { borderLeft: cfg.border } : undefined}
              >
                {/* Status dot */}
                <div className="col-span-1 flex items-center justify-center">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full block",
                      cfg.dot,
                      cfg.pulse && "animate-pulse"
                    )}
                  />
                </div>

                {/* Name + SKU */}
                <div className="col-span-3 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <p className="text-xs text-white/30 font-mono mt-0.5">{item.sku}</p>
                </div>

                {/* Category chip */}
                <div className="col-span-2">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-white/8 text-white/50 border border-white/10">
                    {item.category}
                  </span>
                </div>

                {/* Location */}
                <div className="col-span-2">
                  <span className="text-xs text-white/50">{item.location}</span>
                </div>

                {/* Qty badge */}
                <div className="col-span-1 flex justify-center">
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 rounded-full text-xs font-semibold border",
                      qtyColor
                    )}
                  >
                    {item.qty}
                  </span>
                </div>

                {/* Unit cost */}
                <div className="col-span-2 text-right">
                  <span className="text-sm text-white/70 font-medium">
                    {formatCurrency(item.unitCost)}
                  </span>
                </div>

                {/* Reorder button */}
                <div className="col-span-1 flex justify-end">
                  {(item.status === "low-stock" || item.status === "out-of-stock") && (
                    <GlassButton variant="primary" size="sm" icon={Zap}>
                      Reorder
                    </GlassButton>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-white/30 text-sm"
          >
            No items match your search.
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
}
