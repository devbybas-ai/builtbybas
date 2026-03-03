"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  DollarSign,
  X,
  ChevronRight,
} from "lucide-react";
import { DemoPageWrapper } from "@/components/portfolio/demos/shared/DemoPageWrapper";
import { DemoPageHeader } from "@/components/portfolio/demos/shared/DemoPageHeader";
import { DemoStatCard } from "@/components/portfolio/demos/shared/DemoStatCard";
import { DemoGlassButton } from "@/components/portfolio/demos/shared/DemoGlassButton";
import { demoStaggerContainer, demoStaggerItem, demoSprings, demoFadeUp } from "@/lib/demo-motion";
import { cn } from "@/lib/utils";
import { demoFormatCurrency, demoFormatDate } from "@/lib/demo-utils";
import { orders } from "@/data/demo-seed";

const ALL_STAGES = [
  "ordered",
  "confirmed",
  "processing",
  "shipped",
  "out-for-delivery",
  "delivered",
] as const;

type Stage = (typeof ALL_STAGES)[number];

const STAGE_LABELS: Record<Stage, string> = {
  ordered: "Ordered",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
};

const STATUS_STAGE_INDEX: Record<string, number> = {
  ordered: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  "out-for-delivery": 4,
  delivered: 5,
};

function PipelineTracker({ status }: { status: string }) {
  const currentIndex = STATUS_STAGE_INDEX[status] ?? 0;
  const isDelivered = status === "delivered";

  return (
    <div className="mt-4">
      {/* Stage dots + lines */}
      <div className="flex items-center">
        {ALL_STAGES.map((stage, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex && !isDelivered;
          const isLast = idx === ALL_STAGES.length - 1;

          return (
            <div key={stage} className="flex items-center flex-1 last:flex-none">
              {/* Dot */}
              <div className="relative flex-shrink-0">
                {isCurrent ? (
                  <motion.div
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-3 h-3 rounded-full bg-amber-400"
                    style={{
                      boxShadow: "0 0 8px rgba(245,158,11,0.7)",
                    }}
                  />
                ) : (
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      isDelivered && isCompleted
                        ? "bg-emerald-400"
                        : isCompleted
                        ? "bg-amber-400"
                        : "bg-white/10 border border-white/20"
                    )}
                  />
                )}
                {/* Delivered checkmark overlay */}
                {isDelivered && isCompleted && (
                  <span className="absolute -top-0.5 -left-0.5 text-[8px] text-emerald-950 font-black w-3 h-3 flex items-center justify-center">
                    ✓
                  </span>
                )}
              </div>

              {/* Connecting line (not after last dot) */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-1",
                    isDelivered
                      ? "bg-emerald-400/70"
                      : idx < currentIndex
                      ? "bg-amber-400/60"
                      : "bg-white/10 border-dashed"
                  )}
                  style={
                    !isDelivered && idx >= currentIndex
                      ? {
                          background: "none",
                          borderTop: "1px dashed rgba(255,255,255,0.15)",
                          height: "1px",
                        }
                      : undefined
                  }
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Stage labels */}
      <div className="flex mt-1.5">
        {ALL_STAGES.map((stage, idx) => {
          const isCurrent = idx === STATUS_STAGE_INDEX[status];
          const isCompleted = idx <= STATUS_STAGE_INDEX[status];
          const isLast = idx === ALL_STAGES.length - 1;
          return (
            <div
              key={stage}
              className={cn("flex-1 text-center", isLast && "flex-none")}
              style={isLast ? { minWidth: 0 } : undefined}
            >
              <span
                className={cn(
                  "text-[9px] font-medium leading-tight block",
                  isCurrent && !isCompleted === false && status === "delivered"
                    ? "text-emerald-400"
                    : isCurrent
                    ? "text-amber-400"
                    : isCompleted
                    ? status === "delivered"
                      ? "text-emerald-400/70"
                      : "text-amber-400/60"
                    : "text-white/20"
                )}
              >
                {STAGE_LABELS[stage]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current stage callout */}
      {!isDelivered && (
        <div className="mt-2">
          <span className="text-xs text-amber-400 font-medium">
            Current: {STAGE_LABELS[status as Stage] ?? status}
          </span>
        </div>
      )}
      {isDelivered && (
        <div className="mt-2 flex items-center gap-1.5">
          <CheckCircle size={12} className="text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">Delivered</span>
        </div>
      )}
    </div>
  );
}

type Order = (typeof orders)[0];
type StatusFilter = "All" | "Active" | "Delivered";
const STATUS_TABS: StatusFilter[] = ["All", "Active", "Delivered"];

export function OrderTrackingDemo() {
  const [orderList, setOrderList] = useState<Order[]>([...orders]);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [flashId, setFlashId] = useState<string | null>(null);

  const activeCount = orderList.filter(
    (o) => o.status !== "delivered"
  ).length;
  const outForDeliveryCount = orderList.filter(
    (o) => o.status === "out-for-delivery"
  ).length;
  const deliveredCount = orderList.filter((o) => o.status === "delivered").length;
  const totalValue = orderList.reduce((s, o) => s + o.value, 0);

  const outForDeliveryOrder = orderList.find((o) => o.status === "out-for-delivery");

  const handleAdvanceStage = (id: string) => {
    setOrderList((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const currentIdx = STATUS_STAGE_INDEX[o.status] ?? 0;
        if (currentIdx >= ALL_STAGES.length - 1) return o;
        const nextStage = ALL_STAGES[currentIdx + 1];
        return { ...o, status: nextStage };
      })
    );
    setFlashId(id);
    setTimeout(() => setFlashId(null), 1500);
  };

  const filteredOrders = orderList.filter((o) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Active") return o.status !== "delivered";
    return o.status === "delivered";
  });

  return (
    <DemoPageWrapper>
      <DemoPageHeader
        title="Order Tracking"
        subtitle="Live pipeline view — from order placed to delivery"
        icon={Package}
        color="amber"
      />

      {/* Stats */}
      <motion.div
        variants={demoStaggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <DemoStatCard label="Active Orders" value={activeCount} icon={Package} color="amber" />
        <DemoStatCard
          label="Out for Delivery"
          value={outForDeliveryCount}
          icon={Truck}
          color="cyan"
          trend={{ value: "arriving today", up: true }}
        />
        <DemoStatCard label="Delivered" value={deliveredCount} icon={CheckCircle} color="emerald" />
        <DemoStatCard
          label="Total Value"
          value={demoFormatCurrency(totalValue).replace("$", "$")}
          icon={DollarSign}
          color="violet"
        />
      </motion.div>

      {/* Out-for-delivery alert banner */}
      <AnimatePresence>
        {outForDeliveryOrder && !alertDismissed && (
          <motion.div
            key="delivery-alert"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={demoSprings.smooth}
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(0,212,255,0.06)",
              border: "1px solid rgba(0,212,255,0.25)",
            }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-sm text-cyan-300 font-medium">
                  Order {outForDeliveryOrder.id} is out for delivery today
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={demoSprings.snappy}
                onClick={() => setAlertDismissed(true)}
                className="text-cyan-400/60 hover:text-cyan-400 transition-colors"
              >
                <X size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status filter */}
      <motion.div variants={demoFadeUp} initial="hidden" animate="visible" className="mb-5">
        <div className="demo-glass rounded-xl p-1 flex gap-1 max-w-sm">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className="relative flex-1 text-[10px] font-bold uppercase tracking-wide py-1.5 rounded-lg transition-colors"
              style={{ color: statusFilter === tab ? "#f59e0b" : "rgba(255,255,255,0.3)" }}
            >
              {statusFilter === tab && (
                <motion.div
                  layoutId="order-status-tab"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}
                  transition={demoSprings.snappy}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Orders list */}
      <motion.div
        variants={demoStaggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredOrders.length === 0 ? (
          <motion.div variants={demoStaggerItem} className="demo-glass rounded-xl p-10 text-center">
            <p className="text-white/30 text-sm">No orders match this filter.</p>
          </motion.div>
        ) : filteredOrders.map((order) => {
          const isDelivered = order.status === "delivered";
          const isOutForDelivery = order.status === "out-for-delivery";

          return (
            <motion.div
              key={order.id}
              variants={demoStaggerItem}
              whileHover={{ scale: 1.01, y: -2 }}
              transition={demoSprings.snappy}
              className={cn("demo-glass rounded-xl p-5", flashId === order.id && "ring-1 ring-amber-400/50 transition-all duration-700")}
              style={
                isOutForDelivery
                  ? { borderLeft: "3px solid rgba(0,212,255,0.5)" }
                  : isDelivered
                  ? { borderLeft: "3px solid rgba(16,185,129,0.4)" }
                  : { borderLeft: "3px solid rgba(245,158,11,0.4)" }
              }
            >
              {/* Order header */}
              <div className="flex items-start justify-between gap-4 mb-1">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-bold text-white text-base tracking-tight">
                      {order.id}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-semibold border",
                        isDelivered
                          ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                          : isOutForDelivery
                          ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/20"
                          : order.status === "shipped"
                          ? "bg-amber-400/10 text-amber-400 border-amber-400/20"
                          : "bg-white/8 text-white/50 border-white/10"
                      )}
                    >
                      {order.status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mt-1 truncate">{order.product}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-white">
                    {demoFormatCurrency(order.value)}
                  </p>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 text-xs text-white/40 mb-1 flex-wrap">
                <span>
                  <span className="text-white/25">Vendor:</span>{" "}
                  <span className="text-white/60">{order.vendor}</span>
                </span>
                <span>
                  <span className="text-white/25">Ordered:</span>{" "}
                  {demoFormatDate(order.ordered)}
                </span>
                <span>
                  <span className="text-white/25">Est. delivery:</span>{" "}
                  {demoFormatDate(order.estimated)}
                </span>
              </div>

              {/* Tracking number */}
              {order.tracking !== "DIGITAL-DELIVERY" && (
                <p className="font-mono text-[10px] text-white/25 mb-0 mt-0.5 tracking-wider">
                  {order.tracking}
                </p>
              )}

              {/* Pipeline tracker */}
              <PipelineTracker status={order.status} />

              {/* Next stage action */}
              {!isDelivered && (
                <div className="mt-3 flex justify-end">
                  <DemoGlassButton
                    variant={isOutForDelivery ? "primary" : "secondary"}
                    size="sm"
                    icon={isOutForDelivery ? CheckCircle : ChevronRight}
                    onClick={() => handleAdvanceStage(order.id)}
                  >
                    {isOutForDelivery ? "Mark Delivered" : "Next Stage"}
                  </DemoGlassButton>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </DemoPageWrapper>
  );
}
