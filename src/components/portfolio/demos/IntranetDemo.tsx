"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Bell, Users, FolderOpen, Pin, ChevronRight,
  Mail, Phone, MapPin, Briefcase, Download, Megaphone,
  Book, Link2, AlertCircle, Info, Zap, Globe, Calendar,
  X, Check, Heart, Clock, HelpCircle, GitBranch, Video,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoSearchBar } from "@/components/portfolio/demos/shared/DemoSearchBar";
import { demoStaggerContainer, demoStaggerItem, demoFadeUp, demoSprings } from "@/lib/demo-motion";
import { demoGetRelativeTime, demoGetInitials } from "@/lib/demo-utils";
import {
  announcements, employees, companyDocs, intranetNotifications,
} from "@/data/demo-seed";

const categoryColors: Record<string, string> = {
  Company: "text-blue-400 bg-blue-400/10", HR: "text-violet-400 bg-violet-400/10",
  Operations: "text-amber-400 bg-amber-400/10", People: "text-emerald-400 bg-emerald-400/10",
  IT: "text-rose-400 bg-rose-400/10", Facilities: "text-slate-300 bg-slate-400/10",
};

const statusColors: Record<string, { dot: string; text: string; label: string }> = {
  online: { dot: "bg-emerald-400", text: "text-emerald-400", label: "Online" },
  away: { dot: "bg-amber-400", text: "text-amber-400", label: "Away" },
  busy: { dot: "bg-rose-400", text: "text-rose-400", label: "Busy" },
  offline: { dot: "bg-white/30", text: "text-white/40", label: "Offline" },
  "on-leave": { dot: "bg-amber-400", text: "text-amber-400", label: "On Leave" },
};

const quickLinks = [
  { label: "Benefits", icon: Heart, color: "text-rose-400 bg-rose-400/10" },
  { label: "Time Off", icon: Clock, color: "text-amber-400 bg-amber-400/10" },
  { label: "IT Help", icon: HelpCircle, color: "text-blue-400 bg-blue-400/10" },
  { label: "Calendar", icon: Calendar, color: "text-violet-400 bg-violet-400/10" },
  { label: "Org Chart", icon: GitBranch, color: "text-emerald-400 bg-emerald-400/10" },
  { label: "Learning", icon: Book, color: "text-blue-400 bg-blue-400/10" },
];

const schedule = [
  { time: "10:00 AM", event: "Sprint Planning — Innovation Lab", bar: "bg-blue-400/50", text: "text-blue-400" },
  { time: "11:00 AM", event: "1:1 Engineering Review", bar: "bg-violet-400/50", text: "text-violet-400" },
  { time: "2:00 PM", event: "Design Review — Greenhouse", bar: "bg-amber-400/50", text: "text-amber-400" },
];

const notices = [
  { Icon: Info, text: "Benefits enrollment closes March 20th", color: "text-amber-400" },
  { Icon: Zap, text: "Enable 2FA by March 12th — IT Security", color: "text-rose-400" },
  { Icon: Globe, text: "Office closed March 17th", color: "text-blue-400" },
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
    setReactionBumps((prev) => ({
      ...prev, [annId]: { ...prev[annId], [emoji]: (prev[annId]?.[emoji] ?? 0) + 1 },
    }));
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
      {/* Branded Meridian header */}
      <motion.div variants={demoFadeUp} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center" style={{ boxShadow: "0 0 0 1px rgba(59,130,246,0.3)" }}>
            <Building2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Meridian</h1>
              <span className="text-[10px] text-blue-400/60 font-semibold uppercase tracking-widest">Intranet</span>
            </div>
            <p className="text-xs text-white/40">Good morning, Sarah — Tue, Mar 11</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center text-xs font-bold text-blue-400">SK</div>
          <div className="relative">
            <motion.button onClick={() => setShowNotifs(!showNotifs)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
              <Bell className="w-5 h-5 text-white/50 hover:text-white" />
              {activeNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-400 rounded-full text-[8px] flex items-center justify-center text-black font-bold">{activeNotifs.length}</span>
              )}
            </motion.button>
            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={demoSprings.snappy}
                  className="absolute right-0 top-8 w-72 demo-glass rounded-xl p-3 z-50 space-y-2"
                  style={{ border: "1px solid rgba(59,130,246,0.2)" }}
                >
                  <div className="text-xs font-semibold text-white/70 mb-1">Notifications</div>
                  {activeNotifs.length === 0 ? (
                    <p className="text-xs text-white/30 text-center py-2">All caught up!</p>
                  ) : activeNotifs.map((n) => (
                    <div key={n.id} className="flex items-start gap-2 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white/60">{n.text}</p>
                        <p className="text-white/25 text-[10px]">{n.time}</p>
                      </div>
                      <button onClick={() => setDismissedNotifs((prev) => new Set(prev).add(n.id))} className="text-white/20 hover:text-white/60 flex-shrink-0">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <DemoStatCard label="Team Members" value={employees.length} icon={Users} color="blue" />
        <DemoStatCard label="Announcements" value={announcements.length} icon={Megaphone} color="violet" trend={{ value: `${acknowledged.size} read`, up: true }} />
        <DemoStatCard label="Documents" value={companyDocs.length} icon={FolderOpen} color="emerald" />
        <DemoStatCard label="Departments" value={new Set(employees.map((e) => e.dept)).size} icon={Briefcase} color="amber" />
      </motion.div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">

          {/* Tabs */}
          <motion.div variants={demoFadeUp} className="flex items-center gap-1 demo-glass rounded-xl p-1">
            {([
              { key: "announcements" as TabKey, label: "Announcements", icon: Megaphone, count: announcements.length },
              { key: "directory" as TabKey, label: "Directory", icon: Users, count: employees.length },
              { key: "docs" as TabKey, label: "Documents", icon: Book, count: filteredDocs.length },
            ]).map((tab) => {
              const active = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${active ? "text-blue-400" : "text-white/40 hover:text-white/70"}`}>
                  {active && <motion.div layoutId="meridian-tab" className="absolute inset-0 bg-blue-400/10 rounded-lg" transition={demoSprings.snappy} />}
                  <Icon size={13} className="relative" />
                  <span className="relative">{tab.label}</span>
                  <span className={`relative text-[9px] px-1.5 py-0.5 rounded-full ${active ? "bg-blue-400/20 text-blue-400" : "bg-white/5 text-white/30"}`}>{tab.count}</span>
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
                        className="demo-glass rounded-xl p-4 cursor-pointer"
                        style={ann.pinned ? { borderLeft: "2px solid rgba(59,130,246,0.5)" } : undefined}
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
                              <h3 className="text-sm font-semibold text-white leading-tight">{ann.title}</h3>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className={`demo-badge text-[9px] ${categoryColors[ann.category] || "text-white/50 bg-white/10"}`}>{ann.category}</span>
                                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={demoSprings.snappy}>
                                  <ChevronRight size={12} className="text-white/30" />
                                </motion.div>
                              </div>
                            </div>
                            <p className={`text-xs text-white/50 mb-2 ${isExpanded ? "" : "line-clamp-2"}`}>{ann.body}</p>

                            {/* Reactions + Acknowledge */}
                            {isExpanded && (
                              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-2 flex-wrap">
                                {ann.reactions.map((r) => (
                                  <button
                                    key={r.emoji}
                                    onClick={(e) => { e.stopPropagation(); handleReaction(ann.id, r.emoji); }}
                                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                                  >
                                    <span>{r.emoji}</span>
                                    <span className="text-white/50 text-[10px] tabular-nums">{getReactionCount(ann.id, r.emoji, r.count)}</span>
                                  </button>
                                ))}
                                <button
                                  onClick={(e) => { e.stopPropagation(); setAcknowledged((prev) => { const s = new Set(prev); if (isAcked) s.delete(ann.id); else s.add(ann.id); return s; }); }}
                                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-colors ml-auto ${isAcked ? "bg-blue-400/15 text-blue-400 border-blue-400/30" : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"}`}
                                >
                                  <Check size={10} />
                                  <span className="text-[10px]">{isAcked ? "Acknowledged" : "Acknowledge"}</span>
                                </button>
                              </motion.div>
                            )}

                            {/* Author footer */}
                            <div className="flex items-center gap-2 text-[10px] text-white/30">
                              <div className="w-4 h-4 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-400 font-bold text-[8px]">{demoGetInitials(ann.author)}</div>
                              <button onClick={(e) => handleAuthorClick(ann.author, e)} className="hover:text-blue-400 hover:underline transition-colors">{ann.author}</button>
                              <span className="text-white/15">·</span>
                              <span>{ann.role}</span>
                              <span className="text-white/15">·</span>
                              <span>{demoGetRelativeTime(new Date(ann.date))}</span>
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
                  <div className="flex-1"><DemoSearchBar value={search} onChange={setSearch} placeholder="Search people..." /></div>
                  <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="demo-glass rounded-lg px-3 py-2 text-xs text-white/70 outline-none" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                    {depts.map((d) => <option key={d} value={d} style={{ background: "#0A0A0F" }}>{d}</option>)}
                  </select>
                </div>
                <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-2">
                  {filteredEmployees.length === 0 ? (
                    <div className="demo-glass rounded-xl p-8 text-center"><p className="text-white/30 text-sm">No employees match your search.</p></div>
                  ) : filteredEmployees.map((emp) => {
                    const sc = statusColors[emp.status] ?? statusColors.offline;
                    return (
                      <motion.div key={emp.id} variants={demoStaggerItem} whileHover={{ scale: 1.01, x: 2 }} onClick={() => setSelectedEmployee(emp)} className="demo-glass rounded-xl p-3 cursor-pointer flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>
                            {demoGetInitials(emp.name)}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0A0A0F] ${sc.dot}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{emp.name}</span>
                            {emp.status === "on-leave" && <span className="demo-badge text-[9px] text-amber-400 bg-amber-400/10">On Leave</span>}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <Briefcase size={10} />
                            <span className="truncate">{emp.title}</span>
                            <span className="text-white/15">·</span>
                            <span className="text-white/30">{emp.dept}</span>
                          </div>
                        </div>
                        <ChevronRight size={12} className="text-white/20 flex-shrink-0" />
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
                    <button key={cat} onClick={() => setDocFilter(cat)} className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-colors ${docFilter === cat ? "bg-blue-400/15 text-blue-400 border-blue-400/30" : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
                <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-2">
                  {filteredDocs.length === 0 ? (
                    <div className="demo-glass rounded-xl p-8 text-center"><p className="text-white/30 text-sm">No documents in this category.</p></div>
                  ) : filteredDocs.map((doc) => {
                    const typeColors: Record<string, string> = { PDF: "text-rose-400 bg-rose-400/10", DOC: "text-blue-400 bg-blue-400/10", XLSX: "text-emerald-400 bg-emerald-400/10" };
                    const isDownloaded = downloadedDoc === doc.id;
                    return (
                      <motion.div key={doc.id} variants={demoStaggerItem} whileHover={{ scale: 1.01, x: 2 }} className={`demo-glass rounded-xl p-3 flex items-center gap-3 group cursor-pointer ${isDownloaded ? "ring-1 ring-emerald-400/40" : ""}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${typeColors[doc.type] || "text-white/50 bg-white/10"}`}>{doc.type}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">{doc.name}</div>
                          <div className="flex items-center gap-2 text-[10px] text-white/30 mt-0.5">
                            <span>{doc.category}</span><span className="text-white/15">·</span><span>{doc.size}</span><span className="text-white/15">·</span><span>{doc.author}</span>
                          </div>
                        </div>
                        {isDownloaded ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400"><Check size={16} /></motion.div>
                        ) : (
                          <motion.button onClick={(e) => { e.stopPropagation(); handleDownload(doc.id); }} className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-blue-400 transition-all" whileHover={{ scale: 1.2 }}>
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
          <motion.div variants={demoFadeUp} className="demo-glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-white">Today&apos;s Schedule</span>
            </div>
            <div className="space-y-2 text-xs">
              {schedule.map((item, i) => {
                const joined = joinedMeetings.has(i);
                return (
                  <motion.div
                    key={i} className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...demoSprings.smooth, delay: 0.5 + i * 0.1 }}
                    style={joined ? { borderLeft: "2px solid rgba(59,130,246,0.5)", paddingLeft: 6 } : undefined}
                  >
                    <div className={`w-1 h-8 rounded-full ${joined ? "bg-blue-400/50" : item.bar}`} />
                    <div className="flex-1">
                      <div className={`font-medium text-[10px] ${joined ? "text-blue-400" : item.text}`}>{item.time}</div>
                      <div className="text-white/60 truncate">{item.event}</div>
                    </div>
                    <button
                      onClick={() => setJoinedMeetings((prev) => { const s = new Set(prev); if (joined) s.delete(i); else s.add(i); return s; })}
                      className={`flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full transition-colors ${joined ? "bg-blue-400/15 text-blue-400" : "bg-white/5 text-white/30 hover:text-white/50"}`}
                    >
                      {joined ? <><Check size={8} /> Joined</> : <><Video size={8} /> Join</>}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={demoFadeUp} className="demo-glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-white">Quick Links</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {quickLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...demoSprings.bouncy, delay: 0.3 + i * 0.07 }}
                    whileHover={{ scale: 1.05, y: -1 }}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-lg cursor-pointer ${link.color}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] font-medium text-center leading-tight">{link.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Notices */}
          <motion.div variants={demoFadeUp} className="demo-glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-white">Notices</span>
            </div>
            <div className="space-y-2">
              {notices.map((notice, i) => (
                <motion.div
                  key={i} className="flex items-start gap-2 text-xs"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...demoSprings.smooth, delay: 0.4 + i * 0.1 }}
                >
                  <notice.Icon className={`w-3 h-3 ${notice.color} flex-shrink-0 mt-0.5`} />
                  <span className="text-white/50">{notice.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
                transition={demoSprings.smooth} className="demo-glass rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <motion.div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                        {demoGetInitials(selectedEmployee.name)}
                      </motion.div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#0A0A0F] ${sc.dot}`} />
                    </div>
                    <div>
                      <h2 className="font-bold text-white">{selectedEmployee.name}</h2>
                      <p className="text-xs text-white/50">{selectedEmployee.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="demo-badge text-[9px] text-blue-400 bg-blue-400/10">{selectedEmployee.dept}</span>
                        <span className={`demo-badge text-[9px] ${sc.text} bg-white/5`}>{sc.label}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedEmployee(null)} className="text-white/30 hover:text-white">
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
                        <span className="text-white/60">{item.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="flex gap-2 mt-5">
                  <motion.button onClick={() => setSelectedEmployee(null)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1 flex items-center justify-center gap-2 bg-blue-400/15 hover:bg-blue-400/25 text-blue-400 border border-blue-400/30 rounded-lg py-2 text-sm font-medium transition-colors">
                    <Mail size={14} /> Email
                  </motion.button>
                  <motion.button onClick={() => setSelectedEmployee(null)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-lg py-2 text-sm font-medium transition-colors">
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
