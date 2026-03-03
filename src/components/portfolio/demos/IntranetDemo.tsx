"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Bell, Users, FolderOpen, Pin, ChevronRight,
  Mail, Phone, MapPin, Briefcase, Download, Megaphone,
  Book, Link2, AlertCircle, Info, Zap, Globe, Calendar,
  X, Check, Heart, Clock, HelpCircle, GitBranch, Video, Search,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { demoStaggerContainer, demoStaggerItem, demoFadeUp, demoSprings } from "@/lib/demo-motion";
import { demoGetRelativeTime, demoGetInitials } from "@/lib/demo-utils";
import { announcements, employees, companyDocs, intranetNotifications } from "@/data/demo-seed";

// Meridian card style — slate, not glassmorphism
const mc = "bg-slate-800/50 border border-slate-700/40 rounded-lg";

const categoryColors: Record<string, string> = {
  Company: "text-blue-300 bg-blue-400/15", HR: "text-violet-300 bg-violet-400/15",
  Operations: "text-amber-300 bg-amber-400/15", People: "text-emerald-300 bg-emerald-400/15",
  IT: "text-rose-300 bg-rose-400/15", Facilities: "text-slate-300 bg-slate-400/15",
};

const statusColors: Record<string, { dot: string; text: string; label: string }> = {
  online: { dot: "bg-emerald-400", text: "text-emerald-400", label: "Online" },
  away: { dot: "bg-amber-400", text: "text-amber-400", label: "Away" },
  busy: { dot: "bg-rose-400", text: "text-rose-400", label: "Busy" },
  offline: { dot: "bg-slate-500", text: "text-slate-400", label: "Offline" },
  "on-leave": { dot: "bg-amber-400", text: "text-amber-400", label: "On Leave" },
};

const quickLinks = [
  { label: "Benefits", icon: Heart, color: "text-rose-300 bg-rose-500/10 hover:bg-rose-500/20" },
  { label: "Time Off", icon: Clock, color: "text-amber-300 bg-amber-500/10 hover:bg-amber-500/20" },
  { label: "IT Help", icon: HelpCircle, color: "text-blue-300 bg-blue-500/10 hover:bg-blue-500/20" },
  { label: "Calendar", icon: Calendar, color: "text-violet-300 bg-violet-500/10 hover:bg-violet-500/20" },
  { label: "Org Chart", icon: GitBranch, color: "text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20" },
  { label: "Learning", icon: Book, color: "text-sky-300 bg-sky-500/10 hover:bg-sky-500/20" },
];

const schedule = [
  { time: "10:00 AM", event: "Sprint Planning — Innovation Lab", bar: "bg-blue-400", text: "text-blue-300" },
  { time: "11:00 AM", event: "1:1 Engineering Review", bar: "bg-violet-400", text: "text-violet-300" },
  { time: "2:00 PM", event: "Design Review — Greenhouse", bar: "bg-amber-400", text: "text-amber-300" },
];

const notices = [
  { Icon: Info, text: "Benefits enrollment closes March 20th", color: "text-amber-300" },
  { Icon: Zap, text: "Enable 2FA by March 12th — IT Security", color: "text-rose-300" },
  { Icon: Globe, text: "Office closed March 17th", color: "text-blue-300" },
];

type TabKey = "announcements" | "directory" | "docs";

export function IntranetDemo() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<TabKey>("announcements");
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[0] | null>(null);
  const [expandedAnn, setExpandedAnn] = useState<string | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [dismissedNotifs, setDismissedNotifs] = useState<Set<string>>(new Set());
  const [reactionBumps, setReactionBumps] = useState<Record<string, Record<string, number>>>({});
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());
  const [docFilter, setDocFilter] = useState("All");
  const [downloadedDoc, setDownloadedDoc] = useState<string | null>(null);
  const [joinedMeetings, setJoinedMeetings] = useState<Set<number>>(new Set());

  const depts = ["All", ...Array.from(new Set(employees.map((e) => e.dept)))];
  const filteredEmployees = employees.filter((e) => {
    const ms = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase());
    return ms && (deptFilter === "All" || e.dept === deptFilter);
  });
  const docCategories = ["All", ...Array.from(new Set(companyDocs.map((d) => d.category)))];
  const filteredDocs = docFilter === "All" ? companyDocs : companyDocs.filter((d) => d.category === docFilter);
  const activeNotifs = intranetNotifications.filter((n) => !dismissedNotifs.has(n.id));

  function getReactionCount(annId: string, emoji: string, base: number) {
    return (reactionBumps[annId]?.[emoji] ?? 0) + base;
  }
  function handleReaction(annId: string, emoji: string) {
    setReactionBumps((prev) => ({ ...prev, [annId]: { ...prev[annId], [emoji]: (prev[annId]?.[emoji] ?? 0) + 1 } }));
  }
  function handleDownload(docId: string) {
    setDownloadedDoc(docId);
    setTimeout(() => setDownloadedDoc(null), 1500);
  }
  function handleAuthorClick(authorName: string, e: React.MouseEvent) {
    e.stopPropagation();
    const emp = employees.find((p) => p.name === authorName);
    if (emp) { setActiveTab("directory"); setSelectedEmployee(emp); }
  }

  return (
    <DemoPageWrapper>
      {/* Meridian branded shell */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-700/30 overflow-hidden shadow-2xl shadow-blue-950/20">

        {/* ── Blue gradient header bar ── */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                <Building2 className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-wide">MERIDIAN</div>
                <div className="text-[10px] text-blue-100/60">Company Intranet</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-blue-100/70 hidden sm:block">Good morning, Sarah</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">SK</div>
              <div className="relative">
                <motion.button onClick={() => setShowNotifs(!showNotifs)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
                  <Bell className="w-4.5 h-4.5 text-white/80 hover:text-white" />
                  {activeNotifs.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-400 rounded-full text-[8px] flex items-center justify-center text-white font-bold">{activeNotifs.length}</span>
                  )}
                </motion.button>
                <AnimatePresence>
                  {showNotifs && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={demoSprings.snappy} className={`absolute right-0 top-8 w-72 ${mc} p-3 z-50 space-y-2 bg-slate-800 border-slate-600/50`}
                    >
                      <div className="text-xs font-semibold text-slate-300 mb-1">Notifications</div>
                      {activeNotifs.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-2">All caught up!</p>
                      ) : activeNotifs.map((n) => (
                        <div key={n.id} className="flex items-start gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-300">{n.text}</p>
                            <p className="text-slate-500 text-[10px]">{n.time}</p>
                          </div>
                          <button onClick={() => setDismissedNotifs((prev) => new Set(prev).add(n.id))} className="text-slate-500 hover:text-slate-300 flex-shrink-0"><X size={12} /></button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content area ── */}
        <div className="p-5 space-y-5">

          {/* Stats row — custom Meridian style, no shared DemoStatCard */}
          <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Users, label: "Team Members", value: employees.length, accent: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: Megaphone, label: "Announcements", value: announcements.length, accent: "text-violet-400", bg: "bg-violet-500/10", extra: `${acknowledged.size} read` },
              { icon: FolderOpen, label: "Documents", value: companyDocs.length, accent: "text-emerald-400", bg: "bg-emerald-500/10" },
              { icon: Briefcase, label: "Departments", value: new Set(employees.map((e) => e.dept)).size, accent: "text-amber-400", bg: "bg-amber-500/10" },
            ].map((s) => (
              <motion.div key={s.label} variants={demoStaggerItem} className={`${mc} p-4`}>
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                  <s.icon className={`w-4 h-4 ${s.accent}`} />
                </div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">{s.label}</span>
                  {s.extra && <span className="text-[10px] text-emerald-400/80 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">↑ {s.extra}</span>}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-4">

              {/* Tab bar — slate segmented control */}
              <motion.div variants={demoFadeUp} className="flex items-center gap-1 bg-slate-800/40 border border-slate-700/30 rounded-lg p-1">
                {([
                  { key: "announcements" as TabKey, label: "Announcements", icon: Megaphone, count: announcements.length },
                  { key: "directory" as TabKey, label: "Directory", icon: Users, count: employees.length },
                  { key: "docs" as TabKey, label: "Documents", icon: Book, count: filteredDocs.length },
                ]).map((tab) => {
                  const active = activeTab === tab.key;
                  const Icon = tab.icon;
                  return (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-colors ${active ? "text-blue-300" : "text-slate-500 hover:text-slate-300"}`}>
                      {active && <motion.div layoutId="meridian-tab" className="absolute inset-0 bg-blue-500/15 border border-blue-400/20 rounded-md" transition={demoSprings.snappy} />}
                      <Icon size={13} className="relative" />
                      <span className="relative">{tab.label}</span>
                      <span className={`relative text-[9px] px-1.5 py-0.5 rounded-full ${active ? "bg-blue-400/20 text-blue-300" : "bg-slate-700/50 text-slate-500"}`}>{tab.count}</span>
                    </button>
                  );
                })}
              </motion.div>

              <AnimatePresence mode="popLayout">
                {/* ANNOUNCEMENTS */}
                {activeTab === "announcements" && (
                  <motion.div key="announcements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={demoSprings.smooth}>
                    <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-3">
                      {announcements.map((ann) => {
                        const isExpanded = expandedAnn === ann.id;
                        const isAcked = acknowledged.has(ann.id);
                        return (
                          <motion.div
                            key={ann.id} variants={demoStaggerItem} whileHover={{ scale: 1.005, x: 2 }}
                            className={`${mc} p-4 cursor-pointer`}
                            style={ann.pinned ? { borderLeft: "3px solid rgba(59,130,246,0.6)" } : undefined}
                            onClick={() => setExpandedAnn(isExpanded ? null : ann.id)}
                          >
                            <div className="flex items-start gap-3">
                              {ann.pinned && (
                                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                                  <Pin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                                </motion.div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h3 className="text-sm font-semibold text-slate-100 leading-tight">{ann.title}</h3>
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${categoryColors[ann.category] || "text-slate-400 bg-slate-600/30"}`}>{ann.category}</span>
                                    <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={demoSprings.snappy}>
                                      <ChevronRight size={12} className="text-slate-500" />
                                    </motion.div>
                                  </div>
                                </div>
                                <p className={`text-xs text-slate-400 mb-2 ${isExpanded ? "" : "line-clamp-2"}`}>{ann.body}</p>

                                {isExpanded && (
                                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-2 flex-wrap">
                                    {ann.reactions.map((r) => (
                                      <button key={r.emoji} onClick={(e) => { e.stopPropagation(); handleReaction(ann.id, r.emoji); }} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-700/50 hover:bg-slate-700 transition-colors">
                                        <span>{r.emoji}</span>
                                        <span className="text-slate-400 text-[10px] tabular-nums">{getReactionCount(ann.id, r.emoji, r.count)}</span>
                                      </button>
                                    ))}
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setAcknowledged((prev) => { const s = new Set(prev); if (isAcked) s.delete(ann.id); else s.add(ann.id); return s; }); }}
                                      className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-colors ml-auto ${isAcked ? "bg-blue-500/20 text-blue-300 border-blue-400/30" : "bg-slate-700/40 text-slate-400 border-slate-600/40 hover:border-slate-500"}`}
                                    >
                                      <Check size={10} /><span className="text-[10px]">{isAcked ? "Acknowledged" : "Acknowledge"}</span>
                                    </button>
                                  </motion.div>
                                )}

                                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                  <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-[8px]">{demoGetInitials(ann.author)}</div>
                                  <button onClick={(e) => handleAuthorClick(ann.author, e)} className="hover:text-blue-300 hover:underline transition-colors">{ann.author}</button>
                                  <span className="text-slate-600">·</span><span>{ann.role}</span>
                                  <span className="text-slate-600">·</span><span>{demoGetRelativeTime(new Date(ann.date))}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                )}

                {/* DIRECTORY */}
                {activeTab === "directory" && (
                  <motion.div key="directory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={demoSprings.smooth} className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search people..."
                          className="w-full bg-slate-800/60 border border-slate-700/40 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-blue-500/50" style={{ colorScheme: "dark" }} />
                      </div>
                      <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="bg-slate-800/60 border border-slate-700/40 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-blue-500/50" style={{ colorScheme: "dark" }}>
                        {depts.map((d) => <option key={d} value={d} style={{ background: "#1e293b" }}>{d}</option>)}
                      </select>
                    </div>
                    <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-2">
                      {filteredEmployees.length === 0 ? (
                        <div className={`${mc} p-8 text-center`}><p className="text-slate-500 text-sm">No employees match your search.</p></div>
                      ) : filteredEmployees.map((emp) => {
                        const sc = statusColors[emp.status] ?? statusColors.offline;
                        return (
                          <motion.div key={emp.id} variants={demoStaggerItem} whileHover={{ scale: 1.01, x: 2 }} onClick={() => setSelectedEmployee(emp)} className={`${mc} p-3 cursor-pointer flex items-center gap-3`}>
                            <div className="relative">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-blue-500/15 text-blue-300">{demoGetInitials(emp.name)}</div>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${sc.dot}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-100">{emp.name}</span>
                                {emp.status === "on-leave" && <span className="text-[9px] px-2 py-0.5 rounded-full text-amber-300 bg-amber-400/15 font-medium">On Leave</span>}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Briefcase size={10} /><span className="truncate">{emp.title}</span><span className="text-slate-600">·</span><span>{emp.dept}</span>
                              </div>
                            </div>
                            <ChevronRight size={12} className="text-slate-600 flex-shrink-0" />
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                )}

                {/* DOCUMENTS */}
                {activeTab === "docs" && (
                  <motion.div key="docs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={demoSprings.smooth} className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {docCategories.map((cat) => (
                        <button key={cat} onClick={() => setDocFilter(cat)} className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-colors ${docFilter === cat ? "bg-blue-500/20 text-blue-300 border-blue-400/30" : "bg-slate-800/50 text-slate-500 border-slate-700/40 hover:border-slate-600"}`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                    <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-2">
                      {filteredDocs.length === 0 ? (
                        <div className={`${mc} p-8 text-center`}><p className="text-slate-500 text-sm">No documents in this category.</p></div>
                      ) : filteredDocs.map((doc) => {
                        const typeColors: Record<string, string> = { PDF: "text-rose-300 bg-rose-500/15", DOC: "text-blue-300 bg-blue-500/15", XLSX: "text-emerald-300 bg-emerald-500/15" };
                        const isDownloaded = downloadedDoc === doc.id;
                        return (
                          <motion.div key={doc.id} variants={demoStaggerItem} whileHover={{ scale: 1.01, x: 2 }} className={`${mc} p-3 flex items-center gap-3 group cursor-pointer ${isDownloaded ? "ring-1 ring-emerald-400/40" : ""}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${typeColors[doc.type] || "text-slate-400 bg-slate-700/50"}`}>{doc.type}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-200 truncate">{doc.name}</div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                <span>{doc.category}</span><span className="text-slate-600">·</span><span>{doc.size}</span><span className="text-slate-600">·</span><span>{doc.author}</span>
                              </div>
                            </div>
                            {isDownloaded ? (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400"><Check size={16} /></motion.div>
                            ) : (
                              <motion.button onClick={(e) => { e.stopPropagation(); handleDownload(doc.id); }} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-blue-300 transition-all" whileHover={{ scale: 1.2 }}>
                                <Download size={14} />
                              </motion.button>
                            )}
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
              {/* Today's Schedule */}
              <motion.div variants={demoFadeUp} className={`${mc} p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-slate-200">Today&apos;s Schedule</span>
                  <span className="text-[10px] text-slate-500 ml-auto">Tue, Mar 11</span>
                </div>
                <div className="space-y-2 text-xs">
                  {schedule.map((item, i) => {
                    const joined = joinedMeetings.has(i);
                    return (
                      <motion.div key={i} className="flex items-center gap-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...demoSprings.smooth, delay: 0.5 + i * 0.1 }}
                        style={joined ? { borderLeft: "2px solid rgba(59,130,246,0.6)", paddingLeft: 6 } : undefined}
                      >
                        <div className={`w-1 h-8 rounded-full ${joined ? "bg-blue-400" : item.bar} opacity-60`} />
                        <div className="flex-1">
                          <div className={`font-medium text-[10px] ${joined ? "text-blue-300" : item.text}`}>{item.time}</div>
                          <div className="text-slate-400 truncate">{item.event}</div>
                        </div>
                        <button
                          onClick={() => setJoinedMeetings((prev) => { const s = new Set(prev); if (joined) s.delete(i); else s.add(i); return s; })}
                          className={`flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full transition-colors ${joined ? "bg-blue-500/20 text-blue-300" : "bg-slate-700/40 text-slate-500 hover:text-slate-300"}`}
                        >
                          {joined ? <><Check size={8} /> Joined</> : <><Video size={8} /> Join</>}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div variants={demoFadeUp} className={`${mc} p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <Link2 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-slate-200">Quick Links</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {quickLinks.map((link, i) => {
                    const Icon = link.icon;
                    return (
                      <motion.div key={link.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...demoSprings.bouncy, delay: 0.3 + i * 0.07 }}
                        whileHover={{ scale: 1.05, y: -1 }} className={`flex flex-col items-center gap-1 p-2.5 rounded-lg cursor-pointer transition-colors ${link.color}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[9px] font-medium text-center leading-tight">{link.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Notices */}
              <motion.div variants={demoFadeUp} className={`${mc} p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-200">Notices</span>
                </div>
                <div className="space-y-2">
                  {notices.map((notice, i) => (
                    <motion.div key={i} className="flex items-start gap-2 text-xs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...demoSprings.smooth, delay: 0.4 + i * 0.1 }}>
                      <notice.Icon className={`w-3 h-3 ${notice.color} flex-shrink-0 mt-0.5`} />
                      <span className="text-slate-400">{notice.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee detail modal */}
      <AnimatePresence>
        {selectedEmployee && (() => {
          const sc = statusColors[selectedEmployee.status] ?? statusColors.offline;
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedEmployee(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={demoSprings.smooth} className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <motion.div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold bg-blue-500/20 text-blue-300" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                        {demoGetInitials(selectedEmployee.name)}
                      </motion.div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-slate-800 ${sc.dot}`} />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-100">{selectedEmployee.name}</h2>
                      <p className="text-xs text-slate-400">{selectedEmployee.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] px-2 py-0.5 rounded-full text-blue-300 bg-blue-500/15 font-medium">{selectedEmployee.dept}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full ${sc.text} bg-slate-700/50 font-medium`}>{sc.label}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedEmployee(null)} className="text-slate-500 hover:text-slate-200">
                    <X size={18} />
                  </motion.button>
                </div>
                <div className="space-y-2.5">
                  {[
                    { icon: Mail, label: selectedEmployee.email },
                    { icon: Phone, label: selectedEmployee.phone },
                    { icon: MapPin, label: selectedEmployee.location },
                  ].map((item, i) => {
                    const ItemIcon = item.icon;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...demoSprings.smooth, delay: i * 0.08 }} className="flex items-center gap-2.5 text-sm">
                        <ItemIcon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span className="text-slate-300">{item.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="flex gap-2 mt-5">
                  <motion.button onClick={() => setSelectedEmployee(null)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30 rounded-lg py-2 text-sm font-medium transition-colors">
                    <Mail size={14} /> Email
                  </motion.button>
                  <motion.button onClick={() => setSelectedEmployee(null)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1 flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-slate-100 border border-slate-600/40 rounded-lg py-2 text-sm font-medium transition-colors">
                    <Phone size={14} /> Call
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
