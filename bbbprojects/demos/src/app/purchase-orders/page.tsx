"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Package,
  XCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  User,
  Building2,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import GlassButton from "@/components/shared/GlassButton";
import { staggerContainer, staggerItem, springs, fadeUp } from "@/lib/motion";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { purchaseOrders } from "@/data/seed";

type POStatus = "pending" | "approved" | "received" | "rejected";

const STATUS_TABS: (POStatus | "All")[] = ["All", "pending", "approved", "received", "rejected"];

const statusConfig: Record<POStatus, { badge: string; label: string }> = {
  pending: {
    badge: "bg-amber-400/15 text-amber-400 border-amber-400/25",
    label: "Pending",
  },
  approved: {
    badge: "bg-emerald-400/15 text-emerald-400 border-emerald-400/25",
    label: "Approved",
  },
  received: {
    badge: "bg-cyan-400/15 text-cyan-400 border-cyan-400/25",
    label: "Received",
  },
  rejected: {
    badge: "bg-rose-400/15 text-rose-400 border-rose-400/25",
    label: "Rejected",
  },
};

export default function PurchaseOrdersPage() {
  const [activeStatus, setActiveStatus] = useState<POStatus | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pendingCount = purchaseOrders.filter((p) => p.status === "pending").length;
  const approvedCount = purchaseOrders.filter((p) => p.status === "approved").length;
  const receivedCount = purchaseOrders.filter((p) => p.status === "received").length;
  const rejectedCount = purchaseOrders.filter((p) => p.status === "rejected").length;

  const pendingTotal = purchaseOrders
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.total, 0);

  const filtered = purchaseOrders.filter(
    (po) => activeStatus === "All" || po.status === activeStatus
  );

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Purchase Orders"
        subtitle="Procurement requests, approvals, and vendor management"
        icon={ShoppingCart}
        color="violet"
        action={
          <GlassButton variant="primary" icon={Plus}>
            New PO
          </GlassButton>
        }
      />

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <StatCard
          label="Pending Approval"
          value={pendingCount}
          icon={Clock}
          color="amber"
          trend={{ value: formatCurrency(pendingTotal), up: false }}
        />
        <StatCard label="Approved" value={approvedCount} icon={CheckCircle} color="emerald" />
        <StatCard label="Received" value={receivedCount} icon={Package} color="cyan" />
        <StatCard label="Rejected" value={rejectedCount} icon={XCircle} color="rose" />
      </motion.div>

      {/* Status filter tabs */}
      <motion.div variants={fadeUp} className="flex items-center gap-2 mb-6 flex-wrap">
        {STATUS_TABS.map((s) => {
          const active = activeStatus === s;
          const count =
            s === "All"
              ? purchaseOrders.length
              : purchaseOrders.filter((p) => p.status === s).length;
          return (
            <motion.button
              key={s}
              onClick={() => setActiveStatus(s)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={springs.snappy}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize",
                active
                  ? "bg-violet-400/20 text-violet-300 border-violet-400/40"
                  : "bg-white/5 text-white/40 border-white/10 hover:text-white/70 hover:bg-white/8"
              )}
            >
              {s}
              <span
                className={cn(
                  "text-xs px-1.5 rounded-full font-bold",
                  active ? "bg-violet-400/30 text-violet-200" : "bg-white/10 text-white/30"
                )}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* PO Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {filtered.map((po) => {
          const cfg = statusConfig[po.status as POStatus];
          const isExpanded = expandedId === po.id;
          const isPending = po.status === "pending";
          const isRejected = po.status === "rejected";

          return (
            <motion.div
              key={po.id}
              variants={staggerItem}
              layout
              className="glass rounded-xl overflow-hidden"
            >
              {/* Main PO row */}
              <motion.div
                whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: PO info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono font-bold text-violet-300">{po.id}</span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border font-medium",
                          cfg.badge
                        )}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-lg font-bold text-white leading-tight",
                        isRejected && "line-through text-white/40"
                      )}
                    >
                      {po.vendor}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap text-xs text-white/35">
                      <span className="flex items-center gap-1">
                        <User size={11} /> {po.requestedBy}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Building2 size={11} /> {po.dept}
                      </span>
                      <span>·</span>
                      <span>{formatDate(po.date)}</span>
                    </div>
                  </div>

                  {/* Right: total + actions */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(po.total)}
                      </div>
                      <div className="text-xs text-white/30 mt-0.5">
                        {po.items.length} line item{po.items.length !== 1 ? "s" : ""}
                      </div>
                    </div>

                    {/* Approved by */}
                    <div className="text-right">
                      {po.approvedBy ? (
                        <span className="text-xs text-emerald-400/80">
                          Approved by {po.approvedBy}
                        </span>
                      ) : (
                        <span className="text-xs text-amber-400/80">Awaiting approval</span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {isPending ? (
                        <>
                          <GlassButton
                            variant="secondary"
                            size="sm"
                            className="border-emerald-400/30 text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20"
                          >
                            <CheckCircle size={12} className="mr-1" />
                            Approve
                          </GlassButton>
                          <GlassButton variant="danger" size="sm">
                            <XCircle size={12} className="mr-1" />
                            Reject
                          </GlassButton>
                        </>
                      ) : (
                        <GlassButton variant="secondary" size="sm">
                          View Details
                        </GlassButton>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={springs.snappy}
                        onClick={() => toggleExpand(po.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors border border-white/10"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Expandable line items */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="items"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={springs.smooth}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      className="px-5 pb-5 pt-0"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <p className="text-xs text-white/30 font-medium uppercase tracking-wide mb-3 pt-4">
                        Line Items
                      </p>
                      <div className="space-y-1.5">
                        {/* Header */}
                        <div className="grid grid-cols-12 gap-3 px-3 mb-1">
                          <span className="col-span-6 text-xs text-white/20 font-medium">Description</span>
                          <span className="col-span-2 text-xs text-white/20 font-medium text-center">Qty</span>
                          <span className="col-span-2 text-xs text-white/20 font-medium text-right">Unit</span>
                          <span className="col-span-2 text-xs text-white/20 font-medium text-right">Total</span>
                        </div>
                        {po.items.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ ...springs.snappy, delay: idx * 0.04 }}
                            className="grid grid-cols-12 gap-3 px-3 py-2 rounded-lg bg-white/3 hover:bg-white/5 transition-colors"
                          >
                            <span className="col-span-6 text-sm text-white/70">{item.desc}</span>
                            <span className="col-span-2 text-sm text-white/50 text-center">{item.qty}</span>
                            <span className="col-span-2 text-sm text-white/50 text-right">
                              {formatCurrency(item.unit)}
                            </span>
                            <span className="col-span-2 text-sm text-white font-medium text-right">
                              {formatCurrency(item.qty * item.unit)}
                            </span>
                          </motion.div>
                        ))}
                        {/* Total row */}
                        <div className="grid grid-cols-12 gap-3 px-3 py-2 border-t border-white/5 mt-2">
                          <span className="col-span-10 text-sm font-semibold text-white/60 text-right">
                            Order Total
                          </span>
                          <span className="col-span-2 text-sm font-bold text-white text-right">
                            {formatCurrency(po.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-white/30 text-sm"
        >
          No purchase orders match the selected filter.
        </motion.div>
      )}
    </PageWrapper>
  );
}
