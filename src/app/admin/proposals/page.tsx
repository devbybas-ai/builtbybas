import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { proposals, clients } from "@/lib/schema";
import { decrypt } from "@/lib/encryption";
import { GlassCard } from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";
import { getProposalStatusMeta } from "@/types/proposal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proposals - BuiltByBas Admin",
  robots: { index: false, follow: false },
};

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function ProposalsPage() {
  const rows = await db
    .select({
      id: proposals.id,
      title: proposals.title,
      status: proposals.status,
      estimatedBudgetCents: proposals.estimatedBudgetCents,
      timeline: proposals.timeline,
      validUntil: proposals.validUntil,
      createdAt: proposals.createdAt,
      clientName: clients.name,
      clientCompany: clients.company,
    })
    .from(proposals)
    .leftJoin(clients, eq(proposals.clientId, clients.id))
    .orderBy(desc(proposals.createdAt));

  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proposals</h1>
          <p className="mt-1 text-muted-foreground">
            Generate, review, and send proposals.
          </p>
        </div>
        <Link
          href="/admin/proposals/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          + New Proposal
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {rows.map((p) => {
          const statusMeta = getProposalStatusMeta(p.status);
          const isExpired =
            p.status === "sent" &&
            p.validUntil &&
            new Date(p.validUntil) < new Date();
          return (
            <Link key={p.id} href={`/admin/proposals/${p.id}`}>
              <GlassCard className="flex items-center justify-between transition-colors hover:border-primary/30">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium">{p.title}</p>
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        isExpired
                          ? "bg-red-500/20 text-red-400"
                          : statusMeta.color
                      )}
                    >
                      {isExpired ? "Expired" : statusMeta.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.clientCompany}
                    {p.clientName ? ` — ${decrypt(p.clientName)}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">
                    {p.estimatedBudgetCents
                      ? formatCents(p.estimatedBudgetCents)
                      : "—"}
                  </p>
                  {p.timeline && (
                    <p className="text-xs text-muted-foreground">
                      {p.timeline}
                    </p>
                  )}
                </div>
              </GlassCard>
            </Link>
          );
        })}
        {rows.length === 0 && (
          <GlassCard className="py-12 text-center">
            <p className="text-muted-foreground">
              No proposals yet. Generate one from an intake or create
              manually.
            </p>
          </GlassCard>
        )}
      </div>
    </>
  );
}
