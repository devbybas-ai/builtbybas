"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, FolderOpen, CalendarDays, HeadphonesIcon,
  Package, Tag, Wrench, ShoppingCart, ClipboardCheck,
  Users, Calendar, FileText, Ticket, Truck, MapPin,
  Star, Home, ChevronRight, Zap,
} from "lucide-react";
import { springs } from "@/lib/motion";

const systems = [
  { href: "/intranet", label: "Intranet", icon: Building2, color: "cyan", tag: "Office" },
  { href: "/filing", label: "Document Filing", icon: FolderOpen, color: "cyan", tag: "Office" },
  { href: "/meeting-rooms", label: "Meeting Rooms", icon: CalendarDays, color: "cyan", tag: "Office" },
  { href: "/help-desk", label: "Help Desk", icon: HeadphonesIcon, color: "cyan", tag: "Office" },
  { href: "/inventory", label: "Inventory", icon: Package, color: "violet", tag: "Ops" },
  { href: "/assets", label: "Asset Tracker", icon: Tag, color: "violet", tag: "Ops" },
  { href: "/maintenance", label: "Maintenance", icon: Wrench, color: "violet", tag: "Ops" },
  { href: "/purchase-orders", label: "Purchase Orders", icon: ShoppingCart, color: "violet", tag: "Ops" },
  { href: "/inspections", label: "Inspections", icon: ClipboardCheck, color: "violet", tag: "Ops" },
  { href: "/client-portal", label: "Client Portal", icon: Users, color: "emerald", tag: "Client" },
  { href: "/booking", label: "Booking", icon: Calendar, color: "emerald", tag: "Client" },
  { href: "/proposals", label: "Proposals", icon: FileText, color: "emerald", tag: "Client" },
  { href: "/support", label: "Support Tickets", icon: Ticket, color: "emerald", tag: "Client" },
  { href: "/vendors", label: "Vendor Directory", icon: Truck, color: "amber", tag: "Specialty" },
  { href: "/order-tracking", label: "Order Tracking", icon: MapPin, color: "amber", tag: "Specialty" },
  { href: "/loyalty", label: "Loyalty Program", icon: Star, color: "amber", tag: "Specialty" },
];

const colorMap: Record<string, { text: string; bg: string; dot: string }> = {
  cyan: { text: "text-cyan-400", bg: "rgba(0,212,255,0.1)", dot: "bg-cyan-400" },
  violet: { text: "text-violet-400", bg: "rgba(139,92,246,0.1)", dot: "bg-violet-400" },
  emerald: { text: "text-emerald-400", bg: "rgba(16,185,129,0.1)", dot: "bg-emerald-400" },
  amber: { text: "text-amber-400", bg: "rgba(245,158,11,0.1)", dot: "bg-amber-400" },
};

export default function Sidebar() {
  const pathname = usePathname();

  const groupedSystems = systems.reduce<Record<string, typeof systems>>((acc, sys) => {
    if (!acc[sys.tag]) acc[sys.tag] = [];
    acc[sys.tag].push(sys);
    return acc;
  }, {});

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 flex flex-col glass border-r border-white/8 z-40">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-4 py-4 border-b border-white/8">
        <div className="w-7 h-7 rounded-lg bg-cyan-400/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-xs font-bold text-white leading-tight">
            <span className="text-cyan-400">Built</span>By<span className="text-cyan-400">Bas</span>
          </div>
          <div className="text-[9px] text-white/40 uppercase tracking-widest">Demo Platform</div>
        </div>
      </Link>

      {/* Home */}
      <Link href="/" className="mx-2 mt-2 mb-1">
        <motion.div
          whileHover={{ x: 3 }}
          transition={springs.snappy}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === "/"
              ? "bg-cyan-400/10 text-cyan-400"
              : "text-white/50 hover:text-white hover:bg-white/5"
          }`}
        >
          <Home className="w-4 h-4 flex-shrink-0" />
          <span>All Systems</span>
        </motion.div>
      </Link>

      {/* System groups */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-3">
        {Object.entries(groupedSystems).map(([tag, items]) => {
          const colors = colorMap[items[0].color];
          return (
            <div key={tag}>
              <div className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 ${colors.text} flex items-center gap-1.5`}>
                <div className={`w-1 h-1 rounded-full ${colors.dot}`} />
                {tag}
              </div>
              {items.map((sys) => {
                const active = pathname.startsWith(sys.href);
                const Icon = sys.icon;
                return (
                  <Link key={sys.href} href={sys.href}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      transition={springs.snappy}
                      className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                        active
                          ? `${colors.text} font-medium`
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                      style={active ? { background: colors.bg } : undefined}
                    >
                      {active && (
                        <motion.div
                          layoutId="sidebar-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-current"
                          transition={springs.snappy}
                        />
                      )}
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{sys.label}</span>
                      {active && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/8 px-4 py-3">
        <div className="text-[9px] text-white/20 text-center">
          Interactive demo by BuiltByBas
        </div>
      </div>
    </aside>
  );
}
