"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Users, BarChart3, AlertTriangle, Mail,
  Check, X, Clock, ChevronUp, ChevronDown, Plus, Sparkles,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoCardHover } from "@/lib/demo-motion";

/* ─── types ─── */
interface BehaviorEntry {
  note: string;
  type: "positive" | "concern";
  date: string;
}

interface Student {
  id: string;
  name: string;
  attendance: "present" | "absent" | "tardy";
  grades: { subject: string; score: number }[];
  average: number;
  behaviorLog: BehaviorEntry[];
  parentEmail: string;
  lastParentContact: string;
  group: "high" | "medium" | "support" | null;
}

type SortCol = "name" | "Math" | "Reading" | "Science" | "average";
type TabId = "attendance" | "gradebook" | "behavior" | "groups";

/* ─── seed data ─── */
const TODAY = "2026-03-03";

const initialStudents: Student[] = [
  { id: "STU-01", name: "Aiden Mitchell", attendance: "present", grades: [{ subject: "Math", score: 92 }, { subject: "Reading", score: 78 }, { subject: "Science", score: 85 }], average: 85.0, behaviorLog: [{ note: "Helped classmate with project", type: "positive", date: "2026-03-03" }], parentEmail: "aiden.parent@email.com", lastParentContact: "2026-02-25", group: null },
  { id: "STU-02", name: "Bella Rodriguez", attendance: "present", grades: [{ subject: "Math", score: 88 }, { subject: "Reading", score: 91 }, { subject: "Science", score: 90 }], average: 89.7, behaviorLog: [], parentEmail: "bella.parent@email.com", lastParentContact: "2026-03-01", group: null },
  { id: "STU-03", name: "Carlos Diaz", attendance: "absent", grades: [{ subject: "Math", score: 65 }, { subject: "Reading", score: 72 }, { subject: "Science", score: 68 }], average: 68.3, behaviorLog: [{ note: "Incomplete homework 3x this week", type: "concern", date: "2026-03-02" }], parentEmail: "carlos.parent@email.com", lastParentContact: "2026-02-10", group: null },
  { id: "STU-04", name: "Destiny Williams", attendance: "present", grades: [{ subject: "Math", score: 78 }, { subject: "Reading", score: 82 }, { subject: "Science", score: 75 }], average: 78.3, behaviorLog: [{ note: "Late to class", type: "concern", date: "2026-03-03" }], parentEmail: "destiny.parent@email.com", lastParentContact: "2026-02-20", group: null },
  { id: "STU-05", name: "Elena Flores", attendance: "tardy", grades: [{ subject: "Math", score: 85 }, { subject: "Reading", score: 80 }, { subject: "Science", score: 82 }], average: 82.3, behaviorLog: [], parentEmail: "elena.parent@email.com", lastParentContact: "2026-02-28", group: null },
  { id: "STU-06", name: "Frank Garcia", attendance: "present", grades: [{ subject: "Math", score: 95 }, { subject: "Reading", score: 88 }, { subject: "Science", score: 92 }], average: 91.7, behaviorLog: [{ note: "Led group discussion well", type: "positive", date: "2026-03-01" }], parentEmail: "frank.parent@email.com", lastParentContact: "2026-03-02", group: null },
  { id: "STU-07", name: "Grace Kim", attendance: "present", grades: [{ subject: "Math", score: 82 }, { subject: "Reading", score: 86 }, { subject: "Science", score: 79 }], average: 82.3, behaviorLog: [], parentEmail: "grace.parent@email.com", lastParentContact: "2026-02-15", group: null },
  { id: "STU-08", name: "Henry Patel", attendance: "present", grades: [{ subject: "Math", score: 90 }, { subject: "Reading", score: 76 }, { subject: "Science", score: 88 }], average: 84.7, behaviorLog: [], parentEmail: "henry.parent@email.com", lastParentContact: "2026-03-01", group: null },
  { id: "STU-09", name: "Isla Thompson", attendance: "present", grades: [{ subject: "Math", score: 73 }, { subject: "Reading", score: 69 }, { subject: "Science", score: 71 }], average: 71.0, behaviorLog: [{ note: "Struggling with multiplication tables", type: "concern", date: "2026-02-28" }], parentEmail: "isla.parent@email.com", lastParentContact: "2026-02-12", group: null },
  { id: "STU-10", name: "Marcus Turner", attendance: "present", grades: [{ subject: "Math", score: 70 }, { subject: "Reading", score: 74 }, { subject: "Science", score: 76 }], average: 73.3, behaviorLog: [{ note: "Talked out of turn 3x", type: "concern", date: "2026-03-03" }, { note: "Shared supplies with classmate", type: "positive", date: "2026-03-02" }], parentEmail: "marcus.parent@email.com", lastParentContact: "2026-02-08", group: null },
  { id: "STU-11", name: "Nora O'Brien", attendance: "present", grades: [{ subject: "Math", score: 88 }, { subject: "Reading", score: 93 }, { subject: "Science", score: 86 }], average: 89.0, behaviorLog: [{ note: "Excellent book report presentation", type: "positive", date: "2026-03-01" }], parentEmail: "nora.parent@email.com", lastParentContact: "2026-03-01", group: null },
  { id: "STU-12", name: "Oscar Reyes", attendance: "present", grades: [{ subject: "Math", score: 77 }, { subject: "Reading", score: 81 }, { subject: "Science", score: 74 }], average: 77.3, behaviorLog: [], parentEmail: "oscar.parent@email.com", lastParentContact: "2026-02-14", group: null },
];

/* ─── helpers ─── */
function isOverdue(lastContact: string): boolean {
  const diff = new Date(TODAY).getTime() - new Date(lastContact).getTime();
  return diff > 14 * 24 * 60 * 60 * 1000;
}

function recalcAverage(grades: { subject: string; score: number }[]): number {
  const sum = grades.reduce((s, g) => s + g.score, 0);
  return Math.round((sum / grades.length) * 10) / 10;
}

function getGrade(student: Student, subject: string): number {
  return student.grades.find((g) => g.subject === subject)?.score ?? 0;
}

const ATT_CYCLE: Record<string, "present" | "absent" | "tardy"> = {
  present: "absent",
  absent: "tardy",
  tardy: "present",
};

const ATT_STYLE: Record<string, { bg: string; icon: typeof Check; color: string }> = {
  present: { bg: "bg-emerald-500/20", icon: Check, color: "text-emerald-400" },
  absent: { bg: "bg-red-500/20", icon: X, color: "text-red-400" },
  tardy: { bg: "bg-amber-500/20", icon: Clock, color: "text-amber-400" },
};

/* ─── component ─── */
export function ClassPulseDemo() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [activeTab, setActiveTab] = useState<TabId>("attendance");
  const [sortCol, setSortCol] = useState<SortCol>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [editingGrade, setEditingGrade] = useState<{ id: string; subject: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteStudent, setNoteStudent] = useState(students[0].id);
  const [noteText, setNoteText] = useState("");
  const [noteType, setNoteType] = useState<"positive" | "concern">("positive");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  /* ─── actions ─── */
  const toggleAttendance = useCallback((id: string) => {
    setStudents((prev) => prev.map((s) =>
      s.id === id ? { ...s, attendance: ATT_CYCLE[s.attendance] } : s
    ));
  }, []);

  const handleSort = useCallback((col: SortCol) => {
    if (sortCol === col) { setSortAsc((p) => !p); }
    else { setSortCol(col); setSortAsc(true); }
  }, [sortCol]);

  const startEditGrade = useCallback((id: string, subject: string, current: number) => {
    setEditingGrade({ id, subject });
    setEditValue(String(current));
  }, []);

  const commitGrade = useCallback(() => {
    if (!editingGrade) return;
    const score = Math.min(100, Math.max(0, parseInt(editValue, 10) || 0));
    setStudents((prev) => prev.map((s) => {
      if (s.id !== editingGrade.id) return s;
      const newGrades = s.grades.map((g) =>
        g.subject === editingGrade.subject ? { ...g, score } : g
      );
      return { ...s, grades: newGrades, average: recalcAverage(newGrades) };
    }));
    setEditingGrade(null);
    showToast("Grade updated");
  }, [editingGrade, editValue, showToast]);

  const addNote = useCallback(() => {
    if (!noteText.trim()) return;
    const entry: BehaviorEntry = { note: noteText.trim(), type: noteType, date: TODAY };
    setStudents((prev) => prev.map((s) =>
      s.id === noteStudent ? { ...s, behaviorLog: [entry, ...s.behaviorLog] } : s
    ));
    setNoteText("");
    setShowNoteForm(false);
    showToast("Behavior note added");
  }, [noteStudent, noteText, noteType, showToast]);

  const suggestGroups = useCallback(() => {
    setStudents((prev) => prev.map((s) => ({
      ...s,
      group: s.average > 85 ? "high" : s.average >= 75 ? "medium" : "support",
    })));
    showToast("Groups assigned");
  }, [showToast]);

  /* ─── derived stats ─── */
  const presentCount = students.filter((s) => s.attendance === "present").length;
  const classAvg = Math.round(students.reduce((s, st) => s + st.average, 0) / students.length * 10) / 10;
  const behaviorFlags = students.reduce((c, s) =>
    c + s.behaviorLog.filter((b) => b.type === "concern").length, 0
  );
  const parentDue = students.filter((s) => isOverdue(s.lastParentContact)).length;

  /* sorted students for gradebook */
  const sortedStudents = [...students].sort((a, b) => {
    let cmp = 0;
    if (sortCol === "name") cmp = a.name.localeCompare(b.name);
    else if (sortCol === "average") cmp = a.average - b.average;
    else cmp = getGrade(a, sortCol) - getGrade(b, sortCol);
    return sortAsc ? cmp : -cmp;
  });

  /* all behavior entries flattened and sorted */
  const allBehavior = students.flatMap((s) =>
    s.behaviorLog.map((b) => ({ ...b, studentName: s.name, studentId: s.id }))
  ).sort((a, b) => b.date.localeCompare(a.date));

  /* groups */
  const groupDefs = [
    { key: "high" as const, label: "Group A \u2014 High", border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-400" },
    { key: "medium" as const, label: "Group B \u2014 Medium", border: "border-amber-500/30", badge: "bg-amber-500/20 text-amber-300" },
    { key: "support" as const, label: "Group C \u2014 Support", border: "border-red-500/30", badge: "bg-red-500/20 text-red-400" },
  ];

  const tabs = [
    { id: "attendance" as const, label: "Attendance" },
    { id: "gradebook" as const, label: "Gradebook" },
    { id: "behavior" as const, label: "Behavior" },
    { id: "groups" as const, label: "Groups" },
  ];

  const SortIcon = ({ col }: { col: SortCol }) => {
    if (sortCol !== col) return null;
    return sortAsc ? <ChevronUp size={10} className="inline ml-0.5" /> : <ChevronDown size={10} className="inline ml-0.5" />;
  };

  return (
    <DemoPageWrapper>
      <DemoPageHeader title="Mrs. Torres&apos;s 4th Grade" subtitle="Classroom Dashboard" icon={GraduationCap} color="cyan" />

      <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <DemoStatCard label="Present Today" value={`${presentCount}/${students.length}`} icon={Users} color="cyan" />
        <DemoStatCard label="Class Average" value={`${classAvg}%`} icon={BarChart3} color="emerald" />
        <DemoStatCard label="Behavior Flags" value={behaviorFlags} icon={AlertTriangle} color="amber" />
        <DemoStatCard label="Parent Updates Due" value={parentDue} icon={Mail} color="rose" />
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === tab.id ? "bg-teal-600/30 text-teal-300" : "text-white/40 hover:text-white/60"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ATTENDANCE */}
        {activeTab === "attendance" && (
          <motion.div key="attendance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {students.map((s) => {
                const att = ATT_STYLE[s.attendance];
                const Icon = att.icon;
                return (
                  <motion.button key={s.id} variants={demoStaggerItem} whileHover={demoCardHover.hover} whileTap={{ scale: 0.97 }}
                    onClick={() => toggleAttendance(s.id)}
                    className="demo-glass rounded-lg p-4 text-left" style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-white truncate mr-2">{s.name}</p>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${att.bg}`}>
                        <Icon size={12} className={att.color} />
                      </div>
                    </div>
                    <span className={`text-[10px] capitalize ${att.color}`}>{s.attendance}</span>
                    {isOverdue(s.lastParentContact) && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400">Parent overdue</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* GRADEBOOK */}
        {activeTab === "gradebook" && (
          <motion.div key="gradebook" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="demo-glass rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5">
                      {(["name", "Math", "Reading", "Science", "average"] as SortCol[]).map((col) => (
                        <th key={col} onClick={() => handleSort(col)}
                          className={`p-3 font-medium cursor-pointer hover:text-white/80 transition-colors ${col === "name" ? "text-left text-white/40" : "text-right text-white/40"}`}>
                          {col === "name" ? "Student" : col === "average" ? "Average" : col}
                          <SortIcon col={col} />
                        </th>
                      ))}
                      <th className="p-3 text-right text-white/40 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.map((s) => (
                      <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                        <td className="p-3 text-white/70 font-medium">{s.name}</td>
                        {["Math", "Reading", "Science"].map((subj) => {
                          const score = getGrade(s, subj);
                          const isEditing = editingGrade?.id === s.id && editingGrade.subject === subj;
                          return (
                            <td key={subj} className="p-3 text-right">
                              {isEditing ? (
                                <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={commitGrade} onKeyDown={(e) => e.key === "Enter" && commitGrade()}
                                  className="w-14 bg-white/10 border border-teal-500/30 rounded px-1.5 py-0.5 text-right text-white text-xs" autoFocus />
                              ) : (
                                <button onClick={() => startEditGrade(s.id, subj, score)}
                                  className={`hover:underline ${score < 75 ? "text-red-400" : "text-white/60"}`}>
                                  {score}
                                </button>
                              )}
                            </td>
                          );
                        })}
                        <td className="p-3 text-right font-bold text-teal-400">{s.average}</td>
                        <td className="p-3 text-right">
                          {s.average < 75 ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Below Avg</span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">On Track</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* BEHAVIOR */}
        {activeTab === "behavior" && (
          <motion.div key="behavior" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/40">Behavior Log</p>
              <DemoGlassButton size="sm" icon={Plus} variant="primary" onClick={() => setShowNoteForm((p) => !p)}>
                {showNoteForm ? "Cancel" : "+ Note"}
              </DemoGlassButton>
            </div>

            <AnimatePresence>
              {showNoteForm && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={demoSprings.smooth}
                  className="demo-glass rounded-lg p-4 space-y-3 overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <select value={noteStudent} onChange={(e) => setNoteStudent(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70">
                    {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <input type="text" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Behavior note..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 placeholder-white/30" />
                  <div className="flex items-center gap-2">
                    <button onClick={() => setNoteType("positive")}
                      className={`text-[10px] px-3 py-1 rounded-full border transition-colors ${noteType === "positive" ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-white/5 border-white/10 text-white/40"}`}>
                      Positive
                    </button>
                    <button onClick={() => setNoteType("concern")}
                      className={`text-[10px] px-3 py-1 rounded-full border transition-colors ${noteType === "concern" ? "bg-orange-500/20 border-orange-500/30 text-orange-400" : "bg-white/5 border-white/10 text-white/40"}`}>
                      Concern
                    </button>
                    <DemoGlassButton size="sm" variant="primary" onClick={addNote} className="ml-auto">Save</DemoGlassButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {allBehavior.map((entry, i) => (
              <motion.div key={`${entry.studentId}-${entry.date}-${i}`} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                className="demo-glass rounded-lg p-4 flex items-center justify-between" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${entry.type === "positive" ? "bg-emerald-400" : "bg-orange-400"}`} />
                  <div>
                    <p className="text-sm font-medium text-white">{entry.studentName}</p>
                    <p className="text-[10px] text-white/50">{entry.note}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${entry.type === "positive" ? "bg-emerald-500/20 text-emerald-400" : "bg-orange-500/20 text-orange-400"}`}>
                    {entry.type}
                  </span>
                  <span className="text-[10px] text-white/30">{entry.date}</span>
                </div>
              </motion.div>
            ))}

            {allBehavior.length === 0 && (
              <p className="text-xs text-white/30 text-center py-8">No behavior entries recorded</p>
            )}
          </motion.div>
        )}

        {/* GROUPS */}
        {activeTab === "groups" && (
          <motion.div key="groups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/40">Student Grouping</p>
              <DemoGlassButton size="sm" icon={Sparkles} variant="primary" onClick={suggestGroups}>Suggest Groups</DemoGlassButton>
            </div>

            {students.some((s) => s.group !== null) ? (
              <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid gap-4">
                {groupDefs.map((g) => {
                  const members = students.filter((s) => s.group === g.key);
                  if (members.length === 0) return null;
                  return (
                    <motion.div key={g.key} variants={demoStaggerItem} layout
                      className={`demo-glass rounded-lg p-4 border ${g.border}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${g.badge}`}>{g.label}</span>
                        <span className="text-[10px] text-white/30">{members.length} students</span>
                      </div>
                      <div className="space-y-1.5">
                        {members.map((s) => (
                          <motion.div key={s.id} layout transition={demoSprings.smooth}
                            className="flex items-center justify-between text-xs">
                            <span className="text-white/70">{s.name}</span>
                            <span className="text-white/40">{s.average}%</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="demo-glass rounded-lg p-8 text-center" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <Sparkles size={24} className="text-teal-400/40 mx-auto mb-3" />
                <p className="text-xs text-white/40">Click &quot;Suggest Groups&quot; to auto-sort students based on performance</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-teal-600/90 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
