"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/shared/GlassCard";
import { StageBadge } from "./StageBadge";
import { cn } from "@/lib/utils";
import { Search, Plus } from "lucide-react";
import type { PipelineStage } from "@/types/client";

interface ClientListItem {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string | null;
  pipelineStage: PipelineStage;
  stageChangedAt: Date;
  assignedUser: { id: string; name: string | null } | null;
}

interface ClientListViewProps {
  clients: ClientListItem[];
}

export function ClientListView({ clients }: ClientListViewProps) {
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);

  // Extract unique industries from the client list
  const industries = useMemo(() => {
    const set = new Set<string>();
    for (const c of clients) {
      if (c.industry) set.add(c.industry);
    }
    return Array.from(set).sort();
  }, [clients]);

  // Filter clients by search + industry
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return clients.filter((c) => {
      if (industryFilter && c.industry !== industryFilter) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.industry && c.industry.toLowerCase().includes(q))
      );
    });
  }, [clients, search, industryFilter]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="mt-1 text-muted-foreground">
            {clients.length} {clients.length === 1 ? "client" : "clients"}
            {filtered.length !== clients.length &&
              ` — ${filtered.length} shown`}
          </p>
        </div>
        <Link
          href="/admin/clients/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-cyan-hover"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </Link>
      </div>

      {/* Search + Industry Filter */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, email, or industry..."
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
        </div>

        {industries.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIndustryFilter(null)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                !industryFilter
                  ? "bg-primary/20 text-primary"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              )}
            >
              All
            </button>
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() =>
                  setIndustryFilter(industryFilter === ind ? null : ind)
                }
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  industryFilter === ind
                    ? "bg-primary/20 text-primary"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                )}
              >
                {ind}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Client List */}
      {filtered.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            {clients.length === 0
              ? "No clients yet"
              : "No clients match your search"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {clients.length === 0
              ? "Add a client or convert an intake submission to get started."
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((client) => {
            const daysInStage = Math.floor(
              (Date.now() - new Date(client.stageChangedAt).getTime()) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <Link key={client.id} href={`/admin/clients/${client.id}`}>
                <GlassCard
                  hover
                  className="cursor-pointer transition-all hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="truncate text-base font-semibold">
                          {client.name}
                        </h3>
                        <StageBadge stage={client.pipelineStage} />
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {client.company}
                        {client.industry ? ` — ${client.industry}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {daysInStage}d in stage
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{client.email}</span>
                    {client.assignedUser?.name && (
                      <span>
                        Assigned:{" "}
                        <strong className="text-foreground">
                          {client.assignedUser.name}
                        </strong>
                      </span>
                    )}
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
