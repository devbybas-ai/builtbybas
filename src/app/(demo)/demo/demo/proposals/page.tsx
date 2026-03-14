"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";
import { demoProposals, type DemoProposal } from "@/data/demo-data";

const statusOptions = ["draft", "sent", "accepted", "declined"] as const;
const statusLabels: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
};
const statusColors: Record<string, string> = {
  draft: "bg-white/10 text-white/60",
  sent: "bg-amber-500/20 text-amber-400",
  accepted: "bg-emerald-500/20 text-emerald-400",
  declined: "bg-red-500/20 text-red-400",
};

function getStatusBadge(status: string) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", statusColors[status] ?? "bg-white/10 text-white/60")}>
      {statusLabels[status] ?? status}
    </span>
  );
}

export default function DemoProposalsPage() {
  const [proposals, setProposals] = useState<DemoProposal[]>(() => [...demoProposals]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function updateStatus(id: string, newStatus: DemoProposal["status"]) {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          status: newStatus,
          sentAt: newStatus !== "draft" && !p.sentAt ? new Date().toISOString() : p.sentAt,
        };
      }),
    );
  }

  const filtered = filterStatus === "all"
    ? proposals
    : proposals.filter((p) => p.status === filterStatus);

  const totalValue = proposals.reduce((sum, p) => sum + parseFloat(p.amount.replace(/[$,]/g, "")), 0);
  const acceptedValue = proposals
    .filter((p) => p.status === "accepted")
    .reduce((sum, p) => sum + parseFloat(p.amount.replace(/[$,]/g, "")), 0);
  const conversionRate = proposals.length > 0
    ? Math.round((proposals.filter((p) => p.status === "accepted").length / proposals.length) * 100)
    : 0;

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Proposals</h1>
        <p className="mt-1 text-muted-foreground">
          {proposals.length} proposals created. Click to expand and update status.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <GlassCard>
          <p className="text-sm text-muted-foreground">Total Proposals</p>
          <p className="mt-1 text-2xl font-bold">{proposals.length}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="mt-1 text-2xl font-bold text-primary">${totalValue.toLocaleString()}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Won Value</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">${acceptedValue.toLocaleString()}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Conversion</p>
          <p className="mt-1 text-2xl font-bold text-amber-400">{conversionRate}%</p>
        </GlassCard>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterStatus("all")}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
            filterStatus === "all"
              ? "bg-primary/20 text-primary"
              : "bg-white/5 text-muted-foreground hover:bg-white/10",
          )}
        >
          All ({proposals.length})
        </button>
        {statusOptions.map((s) => {
          const count = proposals.filter((p) => p.status === s).length;
          if (count === 0) return null;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filterStatus === s
                  ? "bg-primary/20 text-primary"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10",
              )}
            >
              {statusLabels[s]} ({count})
            </button>
          );
        })}
      </div>

      {/* Proposal list */}
      <div className="mt-6 space-y-2">
        {filtered.map((proposal) => (
          <div key={proposal.id} className="rounded-lg border border-white/5 bg-white/[0.02] transition-colors hover:border-primary/20">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === proposal.id ? null : proposal.id)}
              className="w-full px-4 py-3 text-left"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{proposal.title}</p>
                    {getStatusBadge(proposal.status)}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {proposal.clientName} &middot; {proposal.company}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <p className="text-sm font-bold tabular-nums">{proposal.amount}</p>
                  <p className="text-xs text-muted-foreground">
                    {proposal.sentAt
                      ? new Date(proposal.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "Not sent"}
                  </p>
                </div>
              </div>
            </button>

            {expandedId === proposal.id && (
              <div className="border-t border-white/5 px-4 pb-4 pt-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Client</h4>
                    <p className="mt-1 text-sm">{proposal.clientName}</p>
                    <p className="text-xs text-muted-foreground">{proposal.company}</p>

                    <h4 className="mt-3 text-xs font-semibold text-muted-foreground">Created</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(proposal.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Update Status</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {statusOptions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateStatus(proposal.id, s)}
                          className={cn(
                            "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                            proposal.status === s
                              ? "bg-primary/20 text-primary"
                              : "bg-white/5 text-muted-foreground hover:bg-white/10",
                          )}
                        >
                          {statusLabels[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No proposals match this filter.
          </p>
        )}
      </div>
    </>
  );
}
