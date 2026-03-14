"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Target, Clock, AlertTriangle, CheckCircle,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoCardHover } from "@/lib/demo-motion";

/* ─── types ─── */
interface Assignment {
  id: string; courseId: string; name: string;
  type: "homework" | "quiz" | "test" | "project";
  dueDate: string; score: number | null; maxScore: number;
  submitted: boolean; topic: string;
}

interface Course {
  id: string; name: string; teacher: string;
  currentGrade: number; credits: number; isAP: boolean;
  assignments: Assignment[];
}

interface StudySession {
  id: string; courseId: string; date: string; minutes: number; topic: string;
}

/* ─── constants ─── */
const TODAY = "2026-03-03";
const TARGET_GPA = 3.60;
const TYPE_COLORS: Record<string, string> = {
  homework: "bg-indigo-500/20 text-indigo-300", quiz: "bg-amber-500/20 text-amber-300",
  test: "bg-rose-500/20 text-rose-300", project: "bg-emerald-500/20 text-emerald-300",
};

function gradeColor(g: number): string {
  if (g >= 85) return "text-emerald-400";
  if (g >= 75) return "text-amber-400";
  return "text-red-400";
}

function gradePoints(grade: number, isAP: boolean): number {
  let gp = 0;
  if (grade >= 90) gp = 4.0;
  else if (grade >= 80) gp = 3.0;
  else if (grade >= 70) gp = 2.0;
  else if (grade >= 60) gp = 1.0;
  return isAP ? gp + 1.0 : gp;
}

type Tab = "overview" | "assignments" | "studylog" | "whatif";
type AssignFilter = "all" | "upcoming" | "graded" | "overdue";

/* ─── seed data ─── */
const initialCourses: Course[] = [
  { id: "CRS-01", name: "AP US History", teacher: "Mr. Daniels", currentGrade: 91, credits: 1.0, isAP: true, assignments: [] },
  { id: "CRS-02", name: "Algebra II", teacher: "Ms. Nguyen", currentGrade: 78, credits: 1.0, isAP: false, assignments: [] },
  { id: "CRS-03", name: "English 11", teacher: "Mrs. Parker", currentGrade: 85, credits: 1.0, isAP: false, assignments: [] },
  { id: "CRS-04", name: "Chemistry", teacher: "Dr. Okafor", currentGrade: 82, credits: 1.0, isAP: false, assignments: [] },
  { id: "CRS-05", name: "Spanish III", teacher: "Sra. Martinez", currentGrade: 88, credits: 1.0, isAP: false, assignments: [] },
  { id: "CRS-06", name: "PE", teacher: "Coach Adams", currentGrade: 95, credits: 0.5, isAP: false, assignments: [] },
];

const allAssignments: Assignment[] = [
  { id: "A-01", courseId: "CRS-02", name: "Chapter 8 Problem Set", type: "homework", dueDate: "2026-03-05", score: null, maxScore: 100, submitted: false, topic: "Polynomials" },
  { id: "A-02", courseId: "CRS-01", name: "Civil War Essay", type: "project", dueDate: "2026-03-07", score: null, maxScore: 100, submitted: false, topic: "Civil War" },
  { id: "A-03", courseId: "CRS-04", name: "Lab Report: Acids & Bases", type: "homework", dueDate: "2026-03-04", score: null, maxScore: 50, submitted: false, topic: "Acids & Bases" },
  { id: "A-04", courseId: "CRS-03", name: "Vocabulary Quiz Ch. 12", type: "quiz", dueDate: "2026-03-06", score: null, maxScore: 25, submitted: false, topic: "Vocabulary" },
  { id: "A-05", courseId: "CRS-05", name: "Preterite vs Imperfect", type: "homework", dueDate: "2026-03-05", score: null, maxScore: 30, submitted: false, topic: "Verb Tenses" },
  { id: "A-06", courseId: "CRS-02", name: "Chapter 7 Test", type: "test", dueDate: "2026-02-28", score: 72, maxScore: 100, submitted: true, topic: "Linear Functions" },
  { id: "A-07", courseId: "CRS-01", name: "DBQ: Reconstruction", type: "project", dueDate: "2026-02-25", score: 94, maxScore: 100, submitted: true, topic: "Reconstruction" },
  { id: "A-08", courseId: "CRS-04", name: "Periodic Table Quiz", type: "quiz", dueDate: "2026-02-27", score: 18, maxScore: 25, submitted: true, topic: "Elements" },
  { id: "A-09", courseId: "CRS-03", name: "Great Gatsby Analysis", type: "project", dueDate: "2026-02-24", score: 88, maxScore: 100, submitted: true, topic: "Literary Analysis" },
  { id: "A-10", courseId: "CRS-05", name: "Listening Comprehension", type: "quiz", dueDate: "2026-02-26", score: 22, maxScore: 25, submitted: true, topic: "Listening" },
  { id: "A-11", courseId: "CRS-02", name: "Chapter 6 Homework", type: "homework", dueDate: "2026-02-20", score: 85, maxScore: 100, submitted: true, topic: "Quadratics" },
  { id: "A-12", courseId: "CRS-01", name: "Primary Source Analysis", type: "homework", dueDate: "2026-02-22", score: 90, maxScore: 100, submitted: true, topic: "Antebellum" },
  { id: "A-13", courseId: "CRS-06", name: "Fitness Test", type: "test", dueDate: "2026-02-28", score: 48, maxScore: 50, submitted: true, topic: "Physical Fitness" },
  { id: "A-14", courseId: "CRS-04", name: "Element Research Poster", type: "project", dueDate: "2026-03-01", score: null, maxScore: 100, submitted: false, topic: "Elements" },
  { id: "A-15", courseId: "CRS-03", name: "Journal Entry #8", type: "homework", dueDate: "2026-03-02", score: null, maxScore: 20, submitted: false, topic: "Creative Writing" },
];

const initialStudySessions: StudySession[] = [
  { id: "SS-01", courseId: "CRS-02", date: "Feb 25", minutes: 45, topic: "Quadratics practice" },
  { id: "SS-02", courseId: "CRS-01", date: "Feb 26", minutes: 60, topic: "Civil War readings" },
  { id: "SS-03", courseId: "CRS-04", date: "Feb 27", minutes: 30, topic: "Periodic table review" },
  { id: "SS-04", courseId: "CRS-02", date: "Feb 28", minutes: 40, topic: "Chapter 7 test prep" },
  { id: "SS-05", courseId: "CRS-05", date: "Mar 1", minutes: 35, topic: "Verb conjugations" },
  { id: "SS-06", courseId: "CRS-01", date: "Mar 1", minutes: 55, topic: "Reconstruction essay draft" },
  { id: "SS-07", courseId: "CRS-03", date: "Mar 2", minutes: 50, topic: "Gatsby essay revision" },
  { id: "SS-08", courseId: "CRS-02", date: "Mar 2", minutes: 45, topic: "Polynomials introduction" },
  { id: "SS-09", courseId: "CRS-04", date: "Mar 3", minutes: 25, topic: "Acids & bases lab prep" },
  { id: "SS-10", courseId: "CRS-01", date: "Mar 3", minutes: 60, topic: "Civil War essay outline" },
];

/* ─── component ─── */
export function StudyPathDemo() {
  const [assignments, setAssignments] = useState<Assignment[]>(allAssignments);
  const [sessions] = useState<StudySession[]>(initialStudySessions);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [assignFilter, setAssignFilter] = useState<AssignFilter>("all");
  const [whatIfGrades, setWhatIfGrades] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    initialCourses.forEach(c => { m[c.id] = c.currentGrade; });
    return m;
  });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); }, []);

  const markSubmitted = useCallback((id: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, submitted: true } : a));
    showToast("Marked as submitted");
  }, [showToast]);

  /* GPA calculation */
  function calcGPA(grades: Record<string, number>): number {
    let totalPoints = 0;
    let totalCredits = 0;
    initialCourses.forEach(c => {
      totalPoints += gradePoints(grades[c.id] ?? c.currentGrade, c.isAP) * c.credits;
      totalCredits += c.credits;
    });
    return totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
  }

  const currentGPA = calcGPA(Object.fromEntries(initialCourses.map(c => [c.id, c.currentGrade])));
  const whatIfGPA = calcGPA(whatIfGrades);
  const totalStudyMinutes = sessions.reduce((s, ss) => s + ss.minutes, 0);

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date(TODAY);
  const upcomingAssignments = assignments.filter(a => !a.submitted && !isOverdue(a.dueDate));
  const gradedAssignments = assignments.filter(a => a.score !== null);
  const overdueAssignments = assignments.filter(a => !a.submitted && a.score === null && isOverdue(a.dueDate));

  const filteredAssignments = assignFilter === "all" ? assignments :
    assignFilter === "upcoming" ? upcomingAssignments :
    assignFilter === "graded" ? gradedAssignments : overdueAssignments;

  /* per-course study minutes */
  const studyByCourse: Record<string, number> = {};
  sessions.forEach(s => { studyByCourse[s.courseId] = (studyByCourse[s.courseId] || 0) + s.minutes; });

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" }, { id: "assignments", label: "Assignments" },
    { id: "studylog", label: "Study Log" }, { id: "whatif", label: "What-If" },
  ];

  return (
    <DemoPageWrapper>
      <DemoPageHeader title="StudyPath" subtitle="Student Progress Dashboard" icon={BookOpen} color="violet" />

      <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <DemoStatCard label="Current GPA" value={currentGPA.toFixed(2)} icon={Target} color="violet" />
        <DemoStatCard label="Target GPA" value={TARGET_GPA.toFixed(2)} icon={Target} color="emerald" />
        <DemoStatCard label="Upcoming Due" value={upcomingAssignments.length} icon={AlertTriangle} color="amber" />
        <DemoStatCard label="Study Hours" value={`${(totalStudyMinutes / 60).toFixed(1)}`} icon={Clock} color="violet" />
      </motion.div>

      <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${activeTab === tab.id ? "bg-indigo-600/30 text-indigo-300" : "text-white/40 hover:text-white/60"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="space-y-4">
            {/* GPA bar */}
            <div className="demo-glass rounded-lg p-4" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-white/50">GPA Progress</span>
                <span className="text-white/60">{currentGPA.toFixed(2)} / {TARGET_GPA.toFixed(2)}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 relative">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((currentGPA / 4.0) * 100, 100)}%` }} transition={{ duration: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                <div className="absolute top-0 h-full border-r-2 border-emerald-400" style={{ left: `${(TARGET_GPA / 4.0) * 100}%` }} />
              </div>
            </div>

            {/* Course cards */}
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {initialCourses.map(course => (
                <motion.div key={course.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                  className="demo-glass rounded-lg p-3" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-white">{course.name}</p>
                    {course.isAP && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">AP</span>}
                  </div>
                  <p className="text-[10px] text-white/40">{course.teacher}</p>
                  <p className={`text-2xl font-bold mt-1 ${gradeColor(course.currentGrade)}`}>{course.currentGrade}%</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Upcoming (next 3) */}
            <div>
              <p className="text-xs font-semibold text-white/50 mb-2">Upcoming Assignments</p>
              {upcomingAssignments.slice(0, 3).map(a => {
                const course = initialCourses.find(c => c.id === a.courseId);
                return (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                    <div><span className="text-white/70">{a.name}</span><span className="text-white/30 ml-2">{course?.name}</span></div>
                    <span className="text-amber-400">Due {a.dueDate}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === "assignments" && (
          <motion.div key="assignments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="space-y-4">
            <div className="flex gap-2">
              {(["all", "upcoming", "graded", "overdue"] as AssignFilter[]).map(f => (
                <button key={f} onClick={() => setAssignFilter(f)} className={`px-3 py-1 text-[10px] font-medium rounded-full border transition-colors capitalize ${assignFilter === f ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/30" : "text-white/40 border-white/10"}`}>
                  {f} ({f === "all" ? assignments.length : f === "upcoming" ? upcomingAssignments.length : f === "graded" ? gradedAssignments.length : overdueAssignments.length})
                </button>
              ))}
            </div>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-2">
              {filteredAssignments.map(a => {
                const course = initialCourses.find(c => c.id === a.courseId);
                const overdue = !a.submitted && a.score === null && isOverdue(a.dueDate);
                return (
                  <motion.div key={a.id} variants={demoStaggerItem}
                    className={`demo-glass rounded-lg p-3 flex items-center justify-between ${overdue ? "border border-red-500/20" : ""}`}
                    style={{ border: !overdue ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white">{a.name}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${TYPE_COLORS[a.type]}`}>{a.type.toUpperCase()}</span>
                        {overdue && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">OVERDUE</span>}
                      </div>
                      <p className="text-[10px] text-white/40">{course?.name} · Due {a.dueDate} · {a.topic}</p>
                      {a.score !== null && <p className={`text-[10px] ${gradeColor(Math.round((a.score / a.maxScore) * 100))}`}>{a.score}/{a.maxScore} ({Math.round((a.score / a.maxScore) * 100)}%)</p>}
                    </div>
                    {!a.submitted && a.score === null && (
                      <DemoGlassButton size="sm" variant="primary" icon={CheckCircle} onClick={() => markSubmitted(a.id)}>Submit</DemoGlassButton>
                    )}
                    {a.submitted && a.score === null && <span className="text-[10px] text-white/30">Submitted</span>}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {activeTab === "studylog" && (
          <motion.div key="studylog" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="space-y-4">
            <div className="demo-glass rounded-lg p-4" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs font-semibold text-white/50 mb-3">Study by Course</p>
              {initialCourses.filter(c => studyByCourse[c.id]).map(course => {
                const mins = studyByCourse[course.id] || 0;
                const maxMins = Math.max(...Object.values(studyByCourse));
                return (
                  <div key={course.id} className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] text-white/50 w-24 truncate">{course.name}</span>
                    <div className="flex-1 bg-white/5 rounded-full h-2">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(mins / maxMins) * 100}%` }}
                        className="h-full rounded-full bg-indigo-500" />
                    </div>
                    <span className="text-[10px] text-white/40 w-12 text-right">{mins}m</span>
                  </div>
                );
              })}
            </div>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-2">
              {sessions.map(s => {
                const course = initialCourses.find(c => c.id === s.courseId);
                return (
                  <motion.div key={s.id} variants={demoStaggerItem}
                    className="demo-glass rounded-lg p-3 flex items-center justify-between" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div><p className="text-xs text-white">{s.topic}</p><p className="text-[10px] text-white/40">{course?.name} · {s.date}</p></div>
                    <span className="text-xs text-indigo-400">{s.minutes} min</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}

        {activeTab === "whatif" && (
          <motion.div key="whatif" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth} className="space-y-4">
            <div className="demo-glass rounded-lg p-4 text-center" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs text-white/40 mb-1">Projected GPA</p>
              <p className={`text-4xl font-bold ${whatIfGPA >= TARGET_GPA ? "text-emerald-400" : "text-amber-400"}`}>{whatIfGPA.toFixed(2)}</p>
              <p className="text-[10px] text-white/30 mt-1">Target: {TARGET_GPA.toFixed(2)} {whatIfGPA >= TARGET_GPA ? "— On track!" : "— Keep pushing!"}</p>
            </div>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-3">
              {initialCourses.map(course => (
                <motion.div key={course.id} variants={demoStaggerItem} className="demo-glass rounded-lg p-4" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div><p className="text-xs font-bold text-white">{course.name}</p><p className="text-[10px] text-white/40">{course.teacher}</p></div>
                    <span className={`text-lg font-bold ${gradeColor(whatIfGrades[course.id] ?? course.currentGrade)}`}>{whatIfGrades[course.id] ?? course.currentGrade}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={whatIfGrades[course.id] ?? course.currentGrade}
                    onChange={e => setWhatIfGrades(prev => ({ ...prev, [course.id]: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                  <div className="flex justify-between text-[9px] text-white/30 mt-1"><span>0%</span><span>100%</span></div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-indigo-600/90 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">{toast}</motion.div>
        )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
