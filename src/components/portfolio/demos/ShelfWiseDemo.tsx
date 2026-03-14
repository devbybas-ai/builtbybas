"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Search, X, Users, AlertTriangle, CheckCircle,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoCardHover } from "@/lib/demo-motion";

/* ─── types ─── */
interface LibraryBook {
  id: string;
  title: string;
  author: string;
  genre: "fiction" | "non-fiction" | "self-help" | "children" | "mystery" | "history";
  status: "available" | "checked-out" | "on-hold";
  dueDate: string | null;
  patronId: string | null;
  holdQueue: string[];
}

interface Patron {
  id: string;
  name: string;
  cardNumber: string;
  checkedOut: string[];
  fines: number;
}

/* ─── seed data ─── */
const initialBooks: LibraryBook[] = [
  { id: "BK-001", title: "To Kill a Mockingbird", author: "Harper Lee", genre: "fiction", status: "available", dueDate: null, patronId: null, holdQueue: [] },
  { id: "BK-002", title: "Atomic Habits", author: "James Clear", genre: "self-help", status: "checked-out", dueDate: "2026-03-15", patronId: "MPL-0847", holdQueue: [] },
  { id: "BK-003", title: "Sapiens", author: "Yuval Harari", genre: "history", status: "checked-out", dueDate: "2026-02-23", patronId: "MPL-0302", holdQueue: [] },
  { id: "BK-004", title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "fiction", status: "checked-out", dueDate: "2026-02-20", patronId: "MPL-0302", holdQueue: [] },
  { id: "BK-005", title: "Where the Wild Things Are", author: "Maurice Sendak", genre: "children", status: "available", dueDate: null, patronId: null, holdQueue: [] },
  { id: "BK-006", title: "Becoming", author: "Michelle Obama", genre: "non-fiction", status: "available", dueDate: null, patronId: null, holdQueue: [] },
  { id: "BK-007", title: "Gone Girl", author: "Gillian Flynn", genre: "mystery", status: "on-hold", dueDate: null, patronId: null, holdQueue: ["MPL-0501"] },
  { id: "BK-008", title: "Diary of a Wimpy Kid", author: "Jeff Kinney", genre: "children", status: "checked-out", dueDate: "2026-03-01", patronId: "MPL-0612", holdQueue: [] },
  { id: "BK-009", title: "Educated", author: "Tara Westover", genre: "non-fiction", status: "available", dueDate: null, patronId: null, holdQueue: [] },
  { id: "BK-010", title: "The Hobbit", author: "J.R.R. Tolkien", genre: "fiction", status: "available", dueDate: null, patronId: null, holdQueue: [] },
];

const initialPatrons: Patron[] = [
  { id: "MPL-0847", name: "Martha Reeves", cardNumber: "MPL-0847", checkedOut: ["BK-002"], fines: 0 },
  { id: "MPL-0302", name: "Tom Barker", cardNumber: "MPL-0302", checkedOut: ["BK-003", "BK-004"], fines: 2.75 },
  { id: "MPL-0501", name: "Lily Zhang", cardNumber: "MPL-0501", checkedOut: [], fines: 0 },
  { id: "MPL-0612", name: "Sam Okonkwo", cardNumber: "MPL-0612", checkedOut: ["BK-008"], fines: 0.25 },
  { id: "MPL-0198", name: "Ruth Petersen", cardNumber: "MPL-0198", checkedOut: [], fines: 0 },
  { id: "MPL-0733", name: "Jake DiMaggio", cardNumber: "MPL-0733", checkedOut: [], fines: 0 },
];

const GENRES = ["all", "fiction", "non-fiction", "self-help", "children", "mystery", "history"] as const;
const GENRE_LABELS: Record<string, string> = { "all": "All", "fiction": "Fiction", "non-fiction": "Non-Fiction", "self-help": "Self-Help", "children": "Children", "mystery": "Mystery", "history": "History" };
const TODAY = "2026-03-03";

function daysOverdue(due: string): number {
  const d = new Date(due);
  const t = new Date(TODAY);
  const diff = Math.floor((t.getTime() - d.getTime()) / 86400000);
  return diff > 0 ? diff : 0;
}

/* ─── component ─── */
export function ShelfWiseDemo() {
  const [books, setBooks] = useState<LibraryBook[]>(initialBooks);
  const [patrons, setPatrons] = useState<Patron[]>(initialPatrons);
  const [activeTab, setActiveTab] = useState<"catalog" | "patrons" | "overdue">("catalog");
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [toast, setToast] = useState<string | null>(null);
  const [checkoutBookId, setCheckoutBookId] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const returnBook = useCallback((bookId: string) => {
    setBooks(prev => prev.map(b => {
      if (b.id !== bookId) return b;
      if (b.holdQueue.length > 0) {
        return { ...b, status: "on-hold" as const, dueDate: null, patronId: null };
      }
      return { ...b, status: "available" as const, dueDate: null, patronId: null };
    }));
    setPatrons(prev => prev.map(p => ({ ...p, checkedOut: p.checkedOut.filter(id => id !== bookId) })));
    showToast("Book returned");
  }, [showToast]);

  const checkoutBook = useCallback((bookId: string, patronId: string) => {
    const dueDate = "2026-03-17";
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: "checked-out" as const, dueDate, patronId, holdQueue: b.holdQueue.filter(p => p !== patronId) } : b));
    setPatrons(prev => prev.map(p => p.id === patronId ? { ...p, checkedOut: [...p.checkedOut, bookId] } : p));
    setCheckoutBookId(null);
    showToast("Book checked out");
  }, [showToast]);

  const placeHold = useCallback((bookId: string, patronId: string) => {
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, holdQueue: [...b.holdQueue, patronId] } : b));
    showToast("Hold placed");
  }, [showToast]);

  const payFine = useCallback((patronId: string) => {
    setPatrons(prev => prev.map(p => p.id === patronId ? { ...p, fines: 0 } : p));
    showToast("Fine paid");
  }, [showToast]);

  /* derived */
  const checkedOutCount = books.filter(b => b.status === "checked-out").length;
  const overdueBooks = books.filter(b => b.status === "checked-out" && b.dueDate && daysOverdue(b.dueDate) > 0);
  const holdsWaiting = books.reduce((s, b) => s + b.holdQueue.length, 0);

  const filteredBooks = books.filter(b => {
    const matchesSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter === "all" || b.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const TABS = [
    { id: "catalog" as const, label: "Catalog" },
    { id: "patrons" as const, label: "Patrons" },
    { id: "overdue" as const, label: "Overdue" },
  ];

  const STATUS_COLORS: Record<string, string> = {
    available: "bg-emerald-500/20 text-emerald-400",
    "checked-out": "bg-amber-500/20 text-amber-400",
    "on-hold": "bg-violet-500/20 text-violet-400",
  };

  return (
    <DemoPageWrapper>
      <DemoPageHeader title="Maplewood Library" subtitle="Community Library System" icon={BookOpen} color="amber" />

      {/* Stats */}
      <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <DemoStatCard label="Total Items" value="8,247" icon={BookOpen} color="amber" />
        <DemoStatCard label="Checked Out" value={checkedOutCount} icon={Users} color="amber" />
        <DemoStatCard label="Overdue" value={overdueBooks.length} icon={AlertTriangle} color="rose" />
        <DemoStatCard label="Holds Waiting" value={holdsWaiting} icon={CheckCircle} color="violet" />
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1 mb-6">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${activeTab === tab.id ? "bg-amber-700/30 text-amber-300" : "text-white/40 hover:text-white/60"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Catalog Tab ── */}
        {activeTab === "catalog" && (
          <motion.div key="catalog" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth}>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by title or author..."
                className="w-full demo-glass rounded-lg pl-8 pr-8 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-sky-500/30 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }} />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><X size={12} /></button>}
            </div>

            {/* Genre filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {GENRES.map(g => (
                <button key={g} onClick={() => setGenreFilter(g)}
                  className={`px-3 py-1 text-[10px] font-medium rounded-full transition-colors ${genreFilter === g ? "bg-amber-700/30 text-amber-300 border border-amber-700/40" : "bg-white/5 text-white/40 border border-white/5 hover:text-white/60"}`}>
                  {GENRE_LABELS[g]}
                </button>
              ))}
            </div>

            {/* Book list */}
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-2">
              {filteredBooks.map(book => (
                <motion.div key={book.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                  className="demo-glass rounded-lg p-3 flex items-start justify-between gap-3" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white truncate">{book.title}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${STATUS_COLORS[book.status]}`}>
                        {book.status === "checked-out" ? "OUT" : book.status === "on-hold" ? "HOLD" : "Available"}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/40">{book.author}</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30">{GENRE_LABELS[book.genre]}</span>
                    {book.dueDate && <span className={`text-[10px] ml-2 ${daysOverdue(book.dueDate) > 0 ? "text-red-400" : "text-white/30"}`}>Due: {book.dueDate}</span>}
                    {book.holdQueue.length > 0 && <span className="text-[10px] ml-2 text-violet-400">{book.holdQueue.length} hold(s)</span>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {book.status === "available" && (
                      <>
                        <DemoGlassButton size="sm" variant="primary" onClick={() => setCheckoutBookId(book.id)}>Check Out</DemoGlassButton>
                        <DemoGlassButton size="sm" variant="ghost" onClick={() => placeHold(book.id, "MPL-0501")}>Hold</DemoGlassButton>
                      </>
                    )}
                    {book.status === "checked-out" && (
                      <DemoGlassButton size="sm" variant="secondary" onClick={() => returnBook(book.id)}>Return</DemoGlassButton>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Checkout patron selector */}
            <AnimatePresence>
              {checkoutBookId && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setCheckoutBookId(null)}>
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    transition={demoSprings.smooth} className="demo-glass rounded-2xl p-6 w-full max-w-sm space-y-3"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }} onClick={e => e.stopPropagation()}>
                    <h3 className="text-lg font-bold text-white">Select Patron</h3>
                    <div className="space-y-2">
                      {patrons.map(p => (
                        <button key={p.id} onClick={() => checkoutBook(checkoutBookId, p.id)}
                          className="w-full demo-glass rounded-lg p-3 text-left hover:bg-white/10 transition-colors" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                          <p className="text-sm text-white">{p.name}</p>
                          <p className="text-[10px] text-white/40">#{p.cardNumber} · {p.checkedOut.length} out</p>
                        </button>
                      ))}
                    </div>
                    <DemoGlassButton variant="ghost" onClick={() => setCheckoutBookId(null)}>Cancel</DemoGlassButton>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Patrons Tab ── */}
        {activeTab === "patrons" && (
          <motion.div key="patrons" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth}>
            <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-3">
              {patrons.map(patron => (
                <motion.div key={patron.id} variants={demoStaggerItem} whileHover={demoCardHover.hover}
                  className="demo-glass rounded-lg p-4 space-y-2" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{patron.name}</p>
                      <p className="text-[10px] text-white/40">#{patron.cardNumber}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-white/50">{patron.checkedOut.length} out</span>
                      {patron.fines > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-red-400">${patron.fines.toFixed(2)}</span>
                          <DemoGlassButton size="sm" variant="danger" onClick={() => payFine(patron.id)}>Pay</DemoGlassButton>
                        </div>
                      )}
                    </div>
                  </div>
                  {patron.checkedOut.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-white/5">
                      {patron.checkedOut.map(bookId => {
                        const book = books.find(b => b.id === bookId);
                        if (!book) return null;
                        return (
                          <div key={bookId} className="flex items-center justify-between text-[11px]">
                            <span className="text-white/60">{book.title}</span>
                            <span className={book.dueDate && daysOverdue(book.dueDate) > 0 ? "text-red-400" : "text-white/30"}>
                              {book.dueDate ? `Due ${book.dueDate}` : ""}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ── Overdue Tab ── */}
        {activeTab === "overdue" && (
          <motion.div key="overdue" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={demoSprings.smooth}>
            {overdueBooks.length === 0 ? (
              <div className="demo-glass rounded-lg p-8 text-center" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-white/60">No overdue items</p>
              </div>
            ) : (
              <motion.div variants={demoStaggerContainer} initial="hidden" animate="visible" className="space-y-2">
                {overdueBooks.map(book => {
                  const days = daysOverdue(book.dueDate!);
                  const fine = (days * 0.25);
                  const patron = patrons.find(p => p.id === book.patronId);
                  return (
                    <motion.div key={book.id} variants={demoStaggerItem}
                      className="demo-glass rounded-lg p-3 flex items-center justify-between border border-red-500/20" style={{}}>
                      <div>
                        <p className="text-sm font-bold text-white">{book.title}</p>
                        <p className="text-[10px] text-white/40">{patron?.name || "Unknown"} · Due {book.dueDate}</p>
                        <p className="text-[11px] text-red-400">{days} days overdue · ${fine.toFixed(2)} fine</p>
                      </div>
                      <DemoGlassButton size="sm" variant="secondary" onClick={() => returnBook(book.id)}>Return</DemoGlassButton>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-amber-700/90 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </DemoPageWrapper>
  );
}
