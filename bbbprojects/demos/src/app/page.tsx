"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2, FolderOpen, CalendarDays, HeadphonesIcon,
  Package, Tag, Wrench, ShoppingCart, ClipboardCheck,
  Users, Calendar, FileText, Ticket, Truck, MapPin,
  Star, ArrowRight, Zap,
} from "lucide-react";
import { staggerContainer, staggerItem, springs, fadeUp } from "@/lib/motion";

const categories = [
  {
    name: "Office & Internal",
    color: "cyan",
    systems: [
      { href: "/intranet", label: "Intranet", icon: Building2, desc: "Company hub, announcements, directory & docs" },
      { href: "/filing", label: "Document Filing", icon: FolderOpen, desc: "Organized file management with search & tags" },
      { href: "/meeting-rooms", label: "Meeting Rooms", icon: CalendarDays, desc: "Resource booking with calendar view" },
      { href: "/help-desk", label: "Help Desk", icon: HeadphonesIcon, desc: "Internal support tickets & knowledge base" },
    ],
  },
  {
    name: "Operations",
    color: "violet",
    systems: [
      { href: "/inventory", label: "Inventory System", icon: Package, desc: "Stock management with low-stock alerts" },
      { href: "/assets", label: "Asset Tracker", icon: Tag, desc: "Track company assets & assignments" },
      { href: "/maintenance", label: "Maintenance", icon: Wrench, desc: "Work order management & scheduling" },
      { href: "/purchase-orders", label: "Purchase Orders", icon: ShoppingCart, desc: "PO creation, approval & vendor management" },
      { href: "/inspections", label: "Inspections", icon: ClipboardCheck, desc: "Audit checklists & compliance tracking" },
    ],
  },
  {
    name: "Client-Facing",
    color: "emerald",
    systems: [
      { href: "/client-portal", label: "Client Portal", icon: Users, desc: "Project status, invoices & communication" },
      { href: "/booking", label: "Booking System", icon: Calendar, desc: "Appointment scheduling with availability" },
      { href: "/proposals", label: "Proposal Portal", icon: FileText, desc: "Estimates, proposals & digital acceptance" },
      { href: "/support", label: "Support Tickets", icon: Ticket, desc: "Customer support with SLA tracking" },
    ],
  },
  {
    name: "Specialty",
    color: "amber",
    systems: [
      { href: "/vendors", label: "Vendor Directory", icon: Truck, desc: "Supplier profiles, contacts & ratings" },
      { href: "/order-tracking", label: "Order Tracking", icon: MapPin, desc: "Real-time order status & shipment pipeline" },
      { href: "/loyalty", label: "Loyalty Program", icon: Star, desc: "Points, rewards & redemption tracking" },
    ],
  },
];

const colorMap = {
  cyan: {
    text: "text-cyan-400", bg: "rgba(0,212,255,0.08)", border: "rgba(0,212,255,0.15)",
    hover: "rgba(0,212,255,0.12)", dot: "bg-cyan-400", arrow: "text-cyan-400", tag: "Office",
  },
  violet: {
    text: "text-violet-400", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.15)",
    hover: "rgba(139,92,246,0.12)", dot: "bg-violet-400", arrow: "text-violet-400", tag: "Ops",
  },
  emerald: {
    text: "text-emerald-400", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.15)",
    hover: "rgba(16,185,129,0.12)", dot: "bg-emerald-400", arrow: "text-emerald-400", tag: "Client",
  },
  amber: {
    text: "text-amber-400", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.15)",
    hover: "rgba(245,158,11,0.12)", dot: "bg-amber-400", arrow: "text-amber-400", tag: "Specialty",
  },
};

export default function HomePage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.smooth}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap className="w-5 h-5 text-cyan-400" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              <span className="text-cyan-400">Built</span>By
              <span className="text-cyan-400">Bas</span>{" "}
              <span className="text-white/60 font-normal">Demo Platform</span>
            </h1>
            <p className="text-sm text-white/40">16 interactive business systems — all deployable for real clients</p>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.smooth, delay: 0.2 }}
          className="flex items-center gap-6 mt-4 glass rounded-xl px-5 py-3"
        >
          {[
            { label: "Systems", value: "16" },
            { label: "Categories", value: "4" },
            { label: "Status", value: "Live Demos" },
            { label: "Built by", value: "#OneTeam" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springs.smooth, delay: 0.3 + i * 0.08 }}
              className="flex items-center gap-2"
            >
              {i > 0 && <div className="w-px h-4 bg-white/10" />}
              <span className="text-white font-semibold text-sm">{stat.value}</span>
              <span className="text-white/30 text-xs">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* System categories */}
      <div className="space-y-8">
        {categories.map((cat, catIdx) => {
          const c = colorMap[cat.color as keyof typeof colorMap];
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springs.smooth, delay: 0.1 + catIdx * 0.1 }}
            >
              <div className={`flex items-center gap-2 mb-3 ${c.text}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse-glow`} />
                <span className="text-xs font-bold uppercase tracking-widest">{cat.name}</span>
                <div className="flex-1 h-px bg-white/5 ml-2" />
                <span className="text-[10px] text-white/20">{cat.systems.length} systems</span>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {cat.systems.map((sys) => {
                  const Icon = sys.icon;
                  return (
                    <motion.div key={sys.href} variants={staggerItem}>
                      <Link href={sys.href}>
                        <motion.div
                          className="group glass rounded-xl p-4 cursor-pointer transition-colors relative overflow-hidden"
                          style={{ borderColor: c.border }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.99 }}
                          transition={springs.snappy}
                        >
                          {/* Hover glow */}
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                            style={{ background: `radial-gradient(circle at 50% 0%, ${c.bg.replace("0.08", "0.15")} 0%, transparent 70%)` }}
                          />

                          <div className="relative flex items-start gap-3">
                            <motion.div
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: c.bg }}
                              whileHover={{ rotate: 10 }}
                              transition={springs.bouncy}
                            >
                              <Icon className={`w-4.5 h-4.5 ${c.text}`} size={18} />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-white">{sys.label}</span>
                                <motion.div
                                  className={`opacity-0 group-hover:opacity-100 transition-opacity ${c.arrow}`}
                                  whileHover={{ x: 2 }}
                                >
                                  <ArrowRight size={14} />
                                </motion.div>
                              </div>
                              <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{sys.desc}</p>
                            </div>
                          </div>

                          {/* Bottom shimmer on hover */}
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: `linear-gradient(90deg, transparent, ${c.text.replace("text-", "").replace("-400", "")}, transparent)` }}
                          />
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 text-center"
      >
        <p className="text-xs text-white/20">
          Want one of these for your business?{" "}
          <a href="https://builtbybas.com/intake" className="text-cyan-400 hover:underline">
            Start a project →
          </a>
        </p>
      </motion.div>
    </div>
  );
}
