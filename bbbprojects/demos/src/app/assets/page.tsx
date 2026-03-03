"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  CheckCircle,
  Package,
  Wrench,
  LayoutGrid,
  List,
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  Camera,
  Printer,
  Phone,
  HardDrive,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import GlassButton from "@/components/shared/GlassButton";
import SearchBar from "@/components/shared/SearchBar";
import { staggerContainer, staggerItem, springs } from "@/lib/motion";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { assets } from "@/data/seed";

const CATEGORIES = ["All", "Laptop", "Mobile", "Tablet", "Equipment", "Printer", "Phone"];

const statusConfig = {
  active: {
    badge: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20",
    label: "Active",
  },
  available: {
    badge: "bg-cyan-400/15 text-cyan-400 border-cyan-400/20",
    label: "Available",
  },
  maintenance: {
    badge: "bg-amber-400/15 text-amber-400 border-amber-400/20",
    label: "In Maintenance",
  },
};

function getCategoryIcon(category: string) {
  const map: Record<string, React.ElementType> = {
    Laptop: Laptop,
    Mobile: Smartphone,
    Tablet: Tablet,
    Equipment: Camera,
    Printer: Printer,
    Phone: Phone,
    Monitor: Monitor,
  };
  return map[category] ?? HardDrive;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  const totalAssets = assets.length;
  const activeCount = assets.filter((a) => a.status === "active").length;
  const availableCount = assets.filter((a) => a.status === "available").length;
  const maintenanceCount = assets.filter((a) => a.status === "maintenance").length;

  const filtered = assets.filter((asset) => {
    const matchSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.serial.toLowerCase().includes(search.toLowerCase()) ||
      (asset.assignedTo ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || asset.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <PageWrapper>
      <PageHeader
        title="Asset Tracker"
        subtitle="Company assets, assignments, and lifecycle management"
        icon={Tag}
        color="violet"
      />

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <StatCard label="Total Assets" value={totalAssets} icon={Tag} color="violet" />
        <StatCard label="Active" value={activeCount} icon={CheckCircle} color="emerald" />
        <StatCard label="Available" value={availableCount} icon={Package} color="cyan" />
        <StatCard label="In Maintenance" value={maintenanceCount} icon={Wrench} color="amber" />
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.smooth, delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, serial, or assignee..."
          />
        </div>
        <div className="flex items-center gap-2">
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
          <div
            className="flex items-center glass rounded-lg border border-white/10 overflow-hidden ml-2"
          >
            {(["grid", "list"] as const).map((v) => (
              <motion.button
                key={v}
                onClick={() => setView(v)}
                whileTap={{ scale: 0.95 }}
                transition={springs.snappy}
                className={cn(
                  "px-3 py-2 transition-all",
                  view === v
                    ? "bg-violet-400/20 text-violet-300"
                    : "text-white/30 hover:text-white/60"
                )}
              >
                {v === "grid" ? <LayoutGrid size={14} /> : <List size={14} />}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Asset Grid / List */}
      <AnimatePresence mode="wait">
        {view === "grid" ? (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springs.smooth}
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((asset) => {
                const IconComp = getCategoryIcon(asset.category);
                const cfg = statusConfig[asset.status as keyof typeof statusConfig];
                return (
                  <motion.div
                    key={asset.id}
                    variants={staggerItem}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={springs.snappy}
                    className="glass rounded-xl p-5 flex flex-col gap-3"
                  >
                    {/* Icon + status */}
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-violet-400/10 flex items-center justify-center">
                        <IconComp className="w-5 h-5 text-violet-400" />
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border font-medium",
                          cfg.badge
                        )}
                      >
                        {cfg.label}
                      </span>
                    </div>

                    {/* Name + serial */}
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">{asset.name}</p>
                      <p className="text-xs text-white/30 font-mono mt-1">{asset.serial}</p>
                    </div>

                    {/* Value */}
                    <div className="text-lg font-bold text-white/90">
                      {formatCurrency(asset.value)}
                    </div>

                    {/* Assigned to */}
                    <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                      {asset.assignedTo ? (
                        <>
                          <div className="w-6 h-6 rounded-full bg-violet-400/20 flex items-center justify-center text-violet-300 text-xs font-bold flex-shrink-0">
                            {getInitials(asset.assignedTo)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-white/70 font-medium truncate">
                              {asset.assignedTo}
                            </p>
                            {asset.dept && (
                              <p className="text-xs text-white/30 truncate">{asset.dept}</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/10">
                          Unassigned
                        </span>
                      )}
                    </div>

                    {/* Purchase date + dept chip */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/25">
                        Purchased {formatDate(asset.purchaseDate)}
                      </span>
                      {asset.dept && asset.dept !== "All" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                          {asset.dept}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springs.smooth}
          >
            {/* List header */}
            <div className="grid grid-cols-12 gap-3 px-4 mb-2">
              <span className="col-span-1" />
              <span className="col-span-3 text-xs text-white/30 font-medium uppercase tracking-wide">Asset</span>
              <span className="col-span-2 text-xs text-white/30 font-medium uppercase tracking-wide">Serial</span>
              <span className="col-span-2 text-xs text-white/30 font-medium uppercase tracking-wide">Assigned To</span>
              <span className="col-span-1 text-xs text-white/30 font-medium uppercase tracking-wide">Dept</span>
              <span className="col-span-2 text-xs text-white/30 font-medium uppercase tracking-wide text-right">Value</span>
              <span className="col-span-1 text-xs text-white/30 font-medium uppercase tracking-wide text-right">Status</span>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {filtered.map((asset) => {
                const IconComp = getCategoryIcon(asset.category);
                const cfg = statusConfig[asset.status as keyof typeof statusConfig];
                return (
                  <motion.div
                    key={asset.id}
                    variants={staggerItem}
                    whileHover={{ scale: 1.01, y: -1 }}
                    transition={springs.snappy}
                    className="glass rounded-xl p-4 grid grid-cols-12 gap-3 items-center"
                  >
                    <div className="col-span-1 flex justify-center">
                      <div className="w-8 h-8 rounded-lg bg-violet-400/10 flex items-center justify-center">
                        <IconComp className="w-4 h-4 text-violet-400" />
                      </div>
                    </div>
                    <div className="col-span-3 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{asset.name}</p>
                      <p className="text-xs text-white/30 mt-0.5 truncate">{asset.location}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-white/40 font-mono">{asset.serial}</span>
                    </div>
                    <div className="col-span-2">
                      {asset.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-violet-400/20 flex items-center justify-center text-violet-300 text-xs font-bold flex-shrink-0">
                            {getInitials(asset.assignedTo)}
                          </div>
                          <span className="text-xs text-white/60 truncate">{asset.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-white/25">Unassigned</span>
                      )}
                    </div>
                    <div className="col-span-1">
                      <span className="text-xs text-white/40 truncate">{asset.dept ?? "—"}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm font-semibold text-white/80">
                        {formatCurrency(asset.value)}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border font-medium",
                          cfg.badge
                        )}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-white/30 text-sm"
        >
          No assets match your search.
        </motion.div>
      )}
    </PageWrapper>
  );
}
