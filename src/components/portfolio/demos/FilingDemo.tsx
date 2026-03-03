"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Files,
  FolderOpen,
  HardDrive,
  Share2,
  Upload,
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
  Presentation,
  File,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { DemoSearchBar } from "@/components/portfolio/demos/shared/DemoSearchBar";
import { folders, files } from "@/data/demo-seed";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoFadeUp } from "@/lib/demo-motion";
import { demoFormatDate } from "@/lib/demo-utils";

// ---- Color config ----
const folderColorMap: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  cyan:    { bg: "rgba(0,212,255,0.08)",   border: "rgba(0,212,255,0.2)",   glow: "rgba(0,212,255,0.15)",   text: "text-cyan-400" },
  violet:  { bg: "rgba(139,92,246,0.08)",  border: "rgba(139,92,246,0.2)",  glow: "rgba(139,92,246,0.15)",  text: "text-violet-400" },
  emerald: { bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)",  glow: "rgba(16,185,129,0.15)",  text: "text-emerald-400" },
  amber:   { bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.2)",  glow: "rgba(245,158,11,0.15)",  text: "text-amber-400" },
  rose:    { bg: "rgba(244,63,94,0.08)",   border: "rgba(244,63,94,0.2)",   glow: "rgba(244,63,94,0.15)",   text: "text-rose-400" },
};

// ---- File type config ----
type FileType = "PDF" | "DOC" | "XLSX" | "IMG" | "PPT";

const fileTypeConfig: Record<FileType, { icon: React.ElementType; bg: string; text: string; label: string }> = {
  PDF:  { icon: FileText,        bg: "rgba(244,63,94,0.15)",   text: "text-rose-400",    label: "PDF" },
  DOC:  { icon: File,            bg: "rgba(59,130,246,0.15)",  text: "text-blue-400",    label: "DOC" },
  XLSX: { icon: FileSpreadsheet, bg: "rgba(16,185,129,0.15)",  text: "text-emerald-400", label: "XLSX" },
  IMG:  { icon: FileImage,       bg: "rgba(139,92,246,0.15)",  text: "text-violet-400",  label: "IMG" },
  PPT:  { icon: Presentation,    bg: "rgba(245,158,11,0.15)",  text: "text-amber-400",   label: "PPT" },
};

const FILE_FILTERS = ["All", "PDF", "DOC", "XLSX", "IMG", "PPT"] as const;
type FilterOption = (typeof FILE_FILTERS)[number];

export function FilingDemo() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  const filteredFiles = files.filter((f) => {
    const matchesType = activeFilter === "All" || f.type === activeFilter;
    const matchesFolder = !selectedFolder || f.folder === selectedFolder;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.folder.toLowerCase().includes(q) ||
      f.uploadedBy.toLowerCase().includes(q) ||
      f.tags.some((t) => t.includes(q));
    return matchesType && matchesFolder && matchesSearch;
  });

  function handleUpload() {
    setShowUploadSuccess(true);
    setTimeout(() => setShowUploadSuccess(false), 2000);
  }

  return (
    <DemoPageWrapper>
      {/* Header */}
      <DemoPageHeader
        title="Document Filing"
        subtitle="Organize, find, and share files across all departments"
        icon={FolderOpen}
        color="cyan"
        action={
          <DemoGlassButton variant="primary" icon={Upload} onClick={handleUpload}>
            Upload File
          </DemoGlassButton>
        }
      />

      {/* Stats */}
      <motion.div
        variants={demoStaggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
      >
        <DemoStatCard label="Total Files"       value={520} icon={Files}      color="cyan" />
        <DemoStatCard label="Folders"           value={8}   icon={FolderOpen} color="violet" />
        <DemoStatCard label="Storage Used"      value="12.4 GB" icon={HardDrive} color="emerald" />
        <DemoStatCard label="Shared This Month" value={34}  icon={Share2}     color="amber" />
      </motion.div>

      {/* Search + Upload row */}
      <motion.div variants={demoFadeUp} className="flex items-center gap-3 mb-5">
        <div className="flex-1">
          <DemoSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search files, folders, or tags…"
          />
        </div>
        <DemoGlassButton variant="secondary" icon={Upload} size="md" onClick={handleUpload}>
          Upload File
        </DemoGlassButton>
      </motion.div>

      {/* Upload success toast */}
      <AnimatePresence>
        {showUploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={demoSprings.snappy}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 demo-glass rounded-xl px-4 py-2.5 flex items-center gap-2 border border-emerald-400/30"
          >
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">File uploaded successfully</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* LEFT: Folder grid */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selectedFolder ? (
              <motion.div
                key="folder-files"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={demoSprings.smooth}
              >
                <div className="flex items-center gap-2 mb-3">
                  <motion.button
                    onClick={() => setSelectedFolder(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-medium transition-colors"
                  >
                    <ArrowLeft size={12} />
                    Back to folders
                  </motion.button>
                  <span className="text-xs text-white/30 uppercase tracking-widest font-semibold">{selectedFolder}</span>
                </div>
                <motion.div variants={demoStaggerContainer} initial={false} animate="visible" className="space-y-2">
                  {filteredFiles.length === 0 ? (
                    <motion.div variants={demoStaggerItem} className="demo-glass rounded-xl p-6 text-center">
                      <p className="text-white/30 text-sm">No files in this folder match your filter.</p>
                    </motion.div>
                  ) : (
                    filteredFiles.map((file) => {
                      const ft = fileTypeConfig[file.type as FileType] ?? fileTypeConfig.PDF;
                      const FtIcon = ft.icon;
                      return (
                        <motion.div
                          key={file.id}
                          variants={demoStaggerItem}
                          whileHover={{ scale: 1.01, y: -1 }}
                          transition={demoSprings.snappy}
                          className="group demo-glass rounded-xl p-3 cursor-pointer relative overflow-hidden"
                        >
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${ft.text}`}
                              style={{ background: ft.bg }}
                            >
                              <FtIcon size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-medium text-white truncate">{file.name}</span>
                                <span
                                  className={`flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ft.text}`}
                                  style={{ background: ft.bg }}
                                >
                                  {file.type}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-white/40 mb-1.5">
                                <span>{file.size}</span>
                                <span className="text-white/20">·</span>
                                <span>{demoFormatDate(file.uploaded)}</span>
                                <span className="text-white/20">·</span>
                                <span>{file.uploadedBy}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {file.tags.map((tag) => (
                                  <span key={tag} className="text-[10px] text-white/40 bg-white/5 rounded-full px-2 py-0.5">{tag}</span>
                                ))}
                              </div>
                            </div>
                            <motion.button
                              initial={{ opacity: 0, x: 6 }}
                              whileHover={{ scale: 1.1 }}
                              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10"
                              transition={demoSprings.snappy}
                              title="Download"
                            >
                              <Download size={13} />
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="folder-grid"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={demoSprings.smooth}
              >
                <motion.p variants={demoFadeUp} className="text-xs text-white/30 uppercase tracking-widest mb-3 font-semibold">
                  Folders
                </motion.p>
                <motion.div
                  variants={demoStaggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  {folders.map((folder) => {
                    const c = folderColorMap[folder.color] ?? folderColorMap.cyan;
                    return (
                      <motion.div
                        key={folder.id}
                        variants={demoStaggerItem}
                        whileHover={{ scale: 1.02, y: -2, boxShadow: `0 0 20px ${c.glow}` }}
                        transition={demoSprings.snappy}
                        className="demo-glass rounded-xl p-3 cursor-pointer group"
                        style={{ borderColor: c.border }}
                        onClick={() => setSelectedFolder(folder.name)}
                      >
                        {/* Hover background tint */}
                        <div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                          style={{ background: `radial-gradient(circle at 50% 0%, ${c.glow} 0%, transparent 70%)` }}
                        />
                        <div className="relative">
                          <FolderOpen className={`w-6 h-6 mb-2 ${c.text}`} />
                          <p className="text-xs font-semibold text-white leading-snug mb-1.5 line-clamp-2">
                            {folder.name}
                          </p>
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${c.text}`}
                              style={{ background: c.bg }}
                            >
                              {folder.fileCount} files
                            </span>
                          </div>
                          <p className="text-[10px] text-white/30 mt-1.5">
                            {demoFormatDate(folder.updated)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Recent files list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <motion.p variants={demoFadeUp} className="text-xs text-white/30 uppercase tracking-widest font-semibold">
              {selectedFolder ? "Filtered Files" : "Recent Files"}
            </motion.p>
            <span className="text-[10px] text-white/20">{filteredFiles.length} files</span>
          </div>

          {/* File type filter tabs */}
          <motion.div variants={demoFadeUp} className="flex items-center gap-1 mb-4 demo-glass rounded-xl p-1">
            {FILE_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className="relative flex-1 text-[10px] font-bold uppercase tracking-wide py-1.5 rounded-lg transition-colors"
                style={{ color: activeFilter === filter ? "#00D4FF" : "rgba(255,255,255,0.3)" }}
              >
                {activeFilter === filter && (
                  <motion.div
                    layoutId="filter-tab"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.2)" }}
                    transition={demoSprings.snappy}
                  />
                )}
                <span className="relative z-10">{filter}</span>
              </button>
            ))}
          </motion.div>

          {/* File rows */}
          <motion.div
              variants={demoStaggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {filteredFiles.length === 0 ? (
                <motion.div variants={demoStaggerItem} className="demo-glass rounded-xl p-6 text-center">
                  <p className="text-white/30 text-sm">No files match your filter.</p>
                </motion.div>
              ) : (
                filteredFiles.map((file) => {
                  const ft = fileTypeConfig[file.type as FileType] ?? fileTypeConfig.PDF;
                  const FtIcon = ft.icon;
                  return (
                    <motion.div
                      key={file.id}
                      variants={demoStaggerItem}
                      whileHover={{ scale: 1.01, y: -1 }}
                      transition={demoSprings.snappy}
                      className="group demo-glass rounded-xl p-3 cursor-pointer relative overflow-hidden"
                    >
                      <div className="flex items-start gap-2.5">
                        {/* File type pill */}
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${ft.text}`}
                          style={{ background: ft.bg }}
                        >
                          <FtIcon size={14} />
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Top row: name + type badge */}
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-white truncate">{file.name}</span>
                            <span
                              className={`flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${ft.text}`}
                              style={{ background: ft.bg }}
                            >
                              {file.type}
                            </span>
                          </div>

                          {/* Second row: folder + size + date */}
                          <div className="flex items-center gap-2 text-[10px] text-white/40 mb-1.5">
                            <span>{file.folder}</span>
                            <span className="text-white/20">·</span>
                            <span>{file.size}</span>
                            <span className="text-white/20">·</span>
                            <span>{demoFormatDate(file.uploaded)}</span>
                            <span className="text-white/20">·</span>
                            <span>{file.uploadedBy}</span>
                          </div>

                          {/* Tag chips */}
                          <div className="flex flex-wrap gap-1">
                            {file.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] text-white/40 bg-white/5 rounded-full px-2 py-0.5"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Download button — visible on hover */}
                        <motion.button
                          initial={{ opacity: 0, x: 6 }}
                          whileHover={{ scale: 1.1 }}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10"
                          transition={demoSprings.snappy}
                          title="Download"
                        >
                          <Download size={13} />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
        </div>
      </div>
    </DemoPageWrapper>
  );
}
