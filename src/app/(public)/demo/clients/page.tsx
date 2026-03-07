"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";
import { demoClients, type DemoClient } from "@/data/demo-data";

const stageOptions = ["Active", "Discovery", "Proposal", "Completed"];

function getStageBadge(stage: string) {
  const colors: Record<string, string> = {
    Active: "bg-emerald-500/20 text-emerald-400",
    Discovery: "bg-violet-500/20 text-violet-400",
    Proposal: "bg-amber-500/20 text-amber-400",
    Completed: "bg-blue-500/20 text-blue-400",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", colors[stage] ?? "bg-white/10 text-white/60")}>
      {stage}
    </span>
  );
}

export default function DemoClientsPage() {
  const [clients, setClients] = useState<DemoClient[]>(() => [...demoClients]);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [sortField, setSortField] = useState<"name" | "revenue" | "activity">("activity");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function updateStage(id: string, newStage: string) {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage: newStage } : c)),
    );
  }

  const filtered = clients
    .filter((c) => {
      if (filterStage !== "all" && c.stage !== filterStage) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortField === "name") return a.name.localeCompare(b.name);
      if (sortField === "revenue") {
        const aVal = parseFloat(a.totalRevenue.replace(/[$,]/g, ""));
        const bVal = parseFloat(b.totalRevenue.replace(/[$,]/g, ""));
        return bVal - aVal;
      }
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    });

  const totalRevenue = clients.reduce(
    (sum, c) => sum + parseFloat(c.totalRevenue.replace(/[$,]/g, "")),
    0,
  );

  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="mt-1 text-muted-foreground">
            {clients.length} clients in your CRM. Search, filter, and manage stages.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <GlassCard>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="mt-1 text-2xl font-bold">{clients.length}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            {clients.filter((c) => c.stage === "Active").length}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">In Pipeline</p>
          <p className="mt-1 text-2xl font-bold text-amber-400">
            {clients.filter((c) => c.stage === "Discovery" || c.stage === "Proposal").length}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
        </GlassCard>
      </div>

      {/* Search + Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setFilterStage("all")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              filterStage === "all"
                ? "bg-primary/20 text-primary"
                : "bg-white/5 text-muted-foreground hover:bg-white/10",
            )}
          >
            All ({clients.length})
          </button>
          {stageOptions.map((s) => {
            const count = clients.filter((c) => c.stage === s).length;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStage(s)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  filterStage === s
                    ? "bg-primary/20 text-primary"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10",
                )}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex gap-1.5">
          {(["activity", "name", "revenue"] as const).map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => setSortField(field)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                sortField === field
                  ? "bg-primary/20 text-primary"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10",
              )}
            >
              {field === "activity" ? "Recent" : field === "name" ? "Name" : "Revenue"}
            </button>
          ))}
        </div>
      </div>

      {/* Client list */}
      <div className="mt-6 space-y-2">
        {filtered.map((client) => (
          <div key={client.id} className="rounded-lg border border-white/5 bg-white/[0.02] transition-colors hover:border-primary/20">
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}
              className="w-full px-4 py-3 text-left"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{client.name}</p>
                    {getStageBadge(client.stage)}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {client.company} &middot; {client.industry}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-xs text-muted-foreground">Projects</p>
                    <p className="text-sm font-semibold tabular-nums">{client.totalProjects}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-sm font-semibold tabular-nums">{client.totalRevenue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Active</p>
                    <p className="text-xs tabular-nums text-muted-foreground">
                      {new Date(client.lastActivity).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            </button>

            {expandedId === client.id && (
              <div className="border-t border-white/5 px-4 pb-4 pt-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Contact</h4>
                    <p className="mt-1 text-sm">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.email}</p>
                    <p className="text-xs text-muted-foreground">{client.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground">Update Stage</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {stageOptions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateStage(client.id, s)}
                          className={cn(
                            "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                            client.stage === s
                              ? "bg-primary/20 text-primary"
                              : "bg-white/5 text-muted-foreground hover:bg-white/10",
                          )}
                        >
                          {s}
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
            No clients match your search.
          </p>
        )}
      </div>
    </>
  );
}
