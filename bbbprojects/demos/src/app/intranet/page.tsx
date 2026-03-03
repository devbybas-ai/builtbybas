"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Bell, Users, FolderOpen, Search, Pin,
  ChevronRight, Mail, Phone, MapPin, Briefcase, ExternalLink,
  Megaphone, Book, Link2, AlertCircle, Info, Zap, Globe,
  TrendingUp, Calendar, X,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import SearchBar from "@/components/shared/SearchBar";
import { staggerContainer, staggerItem, fadeUp, scalePop, springs } from "@/lib/motion";
import { getRelativeTime, getInitials } from "@/lib/utils";
import {
  announcements, employees, companyDocs,
} from "@/data/seed";

const categoryColors: Record<string, string> = {
  Company: "text-cyan-400 bg-cyan-400/10",
  HR: "text-violet-400 bg-violet-400/10",
  Operations: "text-amber-400 bg-amber-400/10",
  People: "text-emerald-400 bg-emerald-400/10",
  IT: "text-rose-400 bg-rose-400/10",
  Facilities: "text-slate-300 bg-slate-400/10",
};

const quickLinks = [
  { label: "Benefits Portal", icon: Heart, url: "#", color: "rose" },
  { label: "Time & Attendance", icon: Clock2, url: "#", color: "amber" },
  { label: "IT Help Desk", icon: HelpCircle, url: "/help-desk", color: "cyan" },
  { label: "Company Calendar", icon: Calendar, url: "#", color: "violet" },
  { label: "Org Chart", icon: GitFork, url: "#", color: "emerald" },
  { label: "Training Portal", icon: Book, url: "#", color: "cyan" },
];

// Inline icon components for quick links
function Heart({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>; }
function Clock2({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>; }
function HelpCircle({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function GitFork({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 21V9M18 9a9 9 0 0 1-9 9"/></svg>; }

const depts = ["All", "Engineering", "Product", "Design", "Sales", "Marketing", "HR", "IT", "Finance", "Operations", "Executive"];

export default function IntranetPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"announcements" | "directory" | "docs">("announcements");
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[0] | null>(null);

  const filteredEmployees = employees.filter((e) => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || e.dept === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <PageWrapper>
      <PageHeader
        title="Company Intranet"
        subtitle="Your company hub — news, people, documents, and resources"
        icon={Building2}
        color="cyan"
        action={
          <div className="flex items-center gap-2">
            <motion.div
              className="relative cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={springs.snappy}
            >
              <Bell className="w-5 h-5 text-white/50 hover:text-white" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full text-[8px] flex items-center justify-center text-black font-bold">3</span>
            </motion.div>
          </div>
        }
      />

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
      >
        <StatCard label="Team Members" value="12" icon={Users} color="cyan" />
        <StatCard label="Announcements" value="6" icon={Megaphone} color="violet" trend={{ value: "2 pinned", up: true }} />
        <StatCard label="Documents" value="447" icon={FolderOpen} color="emerald" />
        <StatCard label="Departments" value="10" icon={Briefcase} color="amber" />
      </motion.div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Main tabbed content */}
        <div className="lg:col-span-2 space-y-4">

          {/* Tabs */}
          <motion.div variants={fadeUp} className="flex items-center gap-1 glass rounded-xl p-1">
            {([
              { key: "announcements", label: "Announcements", icon: Megaphone, count: announcements.length },
              { key: "directory", label: "Directory", icon: Users, count: employees.length },
              { key: "docs", label: "Documents", icon: Book, count: companyDocs.length },
            ] as const).map((tab) => {
              const active = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    active ? "text-cyan-400" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="intranet-tab"
                      className="absolute inset-0 bg-cyan-400/10 rounded-lg"
                      transition={springs.snappy}
                    />
                  )}
                  <Icon size={13} className="relative" />
                  <span className="relative">{tab.label}</span>
                  <span className={`relative text-[9px] px-1.5 py-0.5 rounded-full ${active ? "bg-cyan-400/20 text-cyan-400" : "bg-white/5 text-white/30"}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">

            {/* ANNOUNCEMENTS */}
            {activeTab === "announcements" && (
              <motion.div
                key="announcements"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={springs.smooth}
              >
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
                  {announcements.map((ann) => (
                    <motion.div
                      key={ann.id}
                      variants={staggerItem}
                      whileHover={{ scale: 1.005, x: 2 }}
                      transition={springs.snappy}
                      className="glass rounded-xl p-4 cursor-default"
                      style={ann.pinned ? { borderLeft: "2px solid rgba(0,212,255,0.5)" } : undefined}
                    >
                      <div className="flex items-start gap-3">
                        {ann.pinned && (
                          <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <Pin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          </motion.div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-white leading-tight">{ann.title}</h3>
                            <span className={`badge text-[9px] flex-shrink-0 ${categoryColors[ann.category] || "text-white/50 bg-white/10"}`}>
                              {ann.category}
                            </span>
                          </div>
                          <p className="text-xs text-white/50 line-clamp-2 mb-2">{ann.body}</p>
                          <div className="flex items-center gap-2 text-[10px] text-white/30">
                            <div className="w-4 h-4 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold text-[8px]">
                              {getInitials(ann.author)}
                            </div>
                            <span>{ann.author}</span>
                            <span className="text-white/15">·</span>
                            <span>{ann.role}</span>
                            <span className="text-white/15">·</span>
                            <span>{getRelativeTime(new Date(ann.date))}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* DIRECTORY */}
            {activeTab === "directory" && (
              <motion.div
                key="directory"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={springs.smooth}
                className="space-y-3"
              >
                {/* Search + filter */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search by name or title..." />
                  </div>
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="glass rounded-lg px-3 py-2 text-xs text-white/70 outline-none"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {depts.map((d) => (
                      <option key={d} value={d} style={{ background: "#0A0A0F" }}>{d}</option>
                    ))}
                  </select>
                </div>

                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
                  {filteredEmployees.map((emp) => (
                    <motion.div
                      key={emp.id}
                      variants={staggerItem}
                      whileHover={{ scale: 1.01, x: 2 }}
                      transition={springs.snappy}
                      onClick={() => setSelectedEmployee(emp)}
                      className="glass rounded-xl p-3 cursor-pointer flex items-center gap-3"
                    >
                      <motion.div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: "rgba(0,212,255,0.15)", color: "#00D4FF" }}
                        whileHover={{ scale: 1.15 }}
                        transition={springs.bouncy}
                      >
                        {getInitials(emp.name)}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">{emp.name}</span>
                          {emp.status === "on-leave" && (
                            <span className="badge text-[9px] text-amber-400 bg-amber-400/10">On Leave</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <Briefcase size={10} />
                          <span className="truncate">{emp.title}</span>
                          <span className="text-white/15">·</span>
                          <span className="text-white/30">{emp.dept}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-white/20 flex-shrink-0">
                        <MapPin size={11} />
                        <span className="text-[10px] text-white/30 hidden md:block max-w-24 truncate">{emp.location}</span>
                        <ChevronRight size={12} />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* DOCUMENTS */}
            {activeTab === "docs" && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={springs.smooth}
              >
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
                  {companyDocs.map((doc) => {
                    const typeColors: Record<string, string> = {
                      PDF: "text-rose-400 bg-rose-400/10",
                      DOC: "text-cyan-400 bg-cyan-400/10",
                      XLSX: "text-emerald-400 bg-emerald-400/10",
                    };
                    return (
                      <motion.div
                        key={doc.id}
                        variants={staggerItem}
                        whileHover={{ scale: 1.01, x: 2 }}
                        transition={springs.snappy}
                        className="glass rounded-xl p-3 flex items-center gap-3 cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${typeColors[doc.type] || "text-white/50 bg-white/10"}`}>
                          {doc.type}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">{doc.name}</div>
                          <div className="flex items-center gap-2 text-[10px] text-white/30 mt-0.5">
                            <span>{doc.category}</span>
                            <span className="text-white/15">·</span>
                            <span>{doc.size}</span>
                            <span className="text-white/15">·</span>
                            <span>Updated {doc.updated}</span>
                          </div>
                        </div>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-cyan-400"
                          whileHover={{ scale: 1.2 }}
                        >
                          <ExternalLink size={14} />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">

          {/* Today at a glance */}
          <motion.div variants={fadeUp} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Today</span>
              <span className="text-xs text-white/30 ml-auto">Tue, Mar 11</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { time: "10:00 AM", event: "Sprint Planning — Innovation Lab", color: "cyan" },
                { time: "11:00 AM", event: "1:1 Engineering Review", color: "violet" },
                { time: "2:00 PM", event: "Design Review — Greenhouse", color: "amber" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...springs.smooth, delay: 0.5 + i * 0.1 }}
                >
                  <div className={`w-1 h-8 rounded-full bg-${item.color}-400/50`} />
                  <div>
                    <div className={`text-${item.color}-400 font-medium text-[10px]`}>{item.time}</div>
                    <div className="text-white/60 truncate">{item.event}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeUp} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-white">Quick Links</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, i) => {
                const Icon = link.icon;
                const colorMap: Record<string, string> = {
                  rose: "text-rose-400 bg-rose-400/10",
                  amber: "text-amber-400 bg-amber-400/10",
                  cyan: "text-cyan-400 bg-cyan-400/10",
                  violet: "text-violet-400 bg-violet-400/10",
                  emerald: "text-emerald-400 bg-emerald-400/10",
                };
                return (
                  <motion.a
                    key={link.label}
                    href={link.url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...springs.bouncy, delay: 0.3 + i * 0.07 }}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg ${colorMap[link.color]} cursor-pointer`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-medium text-center leading-tight">{link.label}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Pinned Notices */}
          <motion.div variants={fadeUp} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-white">Notices</span>
            </div>
            <div className="space-y-2">
              {[
                { icon: Info, text: "Benefits enrollment closes March 20th", color: "amber" },
                { icon: Zap, text: "Enable 2FA by March 12th — IT Security", color: "rose" },
                { icon: Globe, text: "Office closed March 17th", color: "cyan" },
              ].map((notice, i) => {
                const Icon = notice.icon;
                return (
                  <motion.div
                    key={i}
                    className="flex items-start gap-2 text-xs"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springs.smooth, delay: 0.4 + i * 0.1 }}
                  >
                    <Icon className={`w-3 h-3 text-${notice.color}-400 flex-shrink-0 mt-0.5`} />
                    <span className="text-white/50">{notice.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Employee detail modal */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEmployee(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={springs.smooth}
              className="glass rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
                    style={{ background: "rgba(0,212,255,0.15)", color: "#00D4FF" }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {getInitials(selectedEmployee.name)}
                  </motion.div>
                  <div>
                    <h2 className="font-bold text-white">{selectedEmployee.name}</h2>
                    <p className="text-xs text-white/50">{selectedEmployee.title}</p>
                    <span className="badge text-[9px] text-cyan-400 bg-cyan-400/10 mt-1">{selectedEmployee.dept}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={springs.snappy}
                  onClick={() => setSelectedEmployee(null)}
                  className="text-white/30 hover:text-white"
                >
                  <X size={18} />
                </motion.button>
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: Mail, label: selectedEmployee.email },
                  { icon: Phone, label: selectedEmployee.phone },
                  { icon: MapPin, label: selectedEmployee.location },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...springs.smooth, delay: i * 0.08 }}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      <Icon className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="text-white/60">{item.label}</span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex gap-2 mt-5">
                <motion.a
                  href={`mailto:${selectedEmployee.email}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-400/15 hover:bg-cyan-400/25 text-cyan-400 border border-cyan-400/30 rounded-lg py-2 text-sm font-medium transition-colors"
                >
                  <Mail size={14} />
                  Email
                </motion.a>
                <motion.a
                  href={`tel:${selectedEmployee.phone}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-lg py-2 text-sm font-medium transition-colors"
                >
                  <Phone size={14} />
                  Call
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
