import type { Metadata } from "next";
import { eq, sql, desc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { invoices, projects, clients } from "@/lib/schema";
import { GlassCard } from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";
import { formatCents } from "@/types/invoice";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics — BuiltByBas Admin",
  robots: { index: false, follow: false },
};

function getBarColor(index: number): string {
  const colors = [
    "bg-primary",
    "bg-cyan-400",
    "bg-blue-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-rose-500",
  ];
  return colors[index % colors.length];
}

export default async function AnalyticsPage() {
  const [
    allInvoices,
    projectsByStatus,
    [clientCount],
    recentPaid,
  ] = await Promise.all([
    db
      .select({
        status: invoices.status,
        totalCents: invoices.totalCents,
        paidDate: invoices.paidDate,
        issuedDate: invoices.issuedDate,
      })
      .from(invoices),
    db
      .select({
        status: projects.status,
        count: sql<number>`count(*)::int`,
      })
      .from(projects)
      .groupBy(projects.status),
    db.select({ value: count() }).from(clients).where(eq(clients.status, "active")),
    db
      .select({
        invoiceNumber: invoices.invoiceNumber,
        totalCents: invoices.totalCents,
        paidDate: invoices.paidDate,
        clientCompany: clients.company,
      })
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .where(eq(invoices.status, "paid"))
      .orderBy(desc(invoices.paidDate))
      .limit(5),
  ]);

  // Revenue metrics
  const totalRevenue = allInvoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.totalCents, 0);

  const totalOutstanding = allInvoices
    .filter((i) => i.status === "sent")
    .reduce((sum, i) => sum + i.totalCents, 0);

  const totalOverdue = allInvoices
    .filter(
      (i) => i.status === "sent" && new Date(i.issuedDate) < new Date(Date.now() - 30 * 86400000)
    )
    .reduce((sum, i) => sum + i.totalCents, 0);

  const totalDraft = allInvoices
    .filter((i) => i.status === "draft")
    .reduce((sum, i) => sum + i.totalCents, 0);

  const invoiceCount = allInvoices.length;
  const paidCount = allInvoices.filter((i) => i.status === "paid").length;

  // Project breakdown
  const projectStatusMap: Record<string, number> = {};
  const projectLabels: Record<string, string> = {
    planning: "Planning",
    in_progress: "In Progress",
    on_hold: "On Hold",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  for (const row of projectsByStatus) {
    projectStatusMap[row.status] = row.count;
  }
  const totalProjects = Object.values(projectStatusMap).reduce(
    (a, b) => a + b,
    0
  );

  // Monthly revenue (last 6 months)
  const monthlyRevenue: { month: string; cents: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthKey = d.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    const cents = allInvoices
      .filter(
        (inv) =>
          inv.status === "paid" &&
          inv.paidDate &&
          new Date(inv.paidDate) >= monthStart &&
          new Date(inv.paidDate) <= monthEnd
      )
      .reduce((sum, inv) => sum + inv.totalCents, 0);

    monthlyRevenue.push({ month: monthKey, cents });
  }
  const maxMonthly = Math.max(...monthlyRevenue.map((m) => m.cents), 1);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Financial Analytics
        </h1>
        <p className="mt-1 text-muted-foreground">
          Revenue, invoices, and project performance.
        </p>
      </div>

      {/* Revenue Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <p className="text-xs text-muted-foreground">Total Revenue</p>
          <p className="mt-1 text-3xl font-bold text-emerald-400">
            {formatCents(totalRevenue)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {paidCount} paid invoice{paidCount !== 1 ? "s" : ""}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Outstanding</p>
          <p className="mt-1 text-3xl font-bold text-blue-400">
            {formatCents(totalOutstanding)}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Overdue</p>
          <p className={cn("mt-1 text-3xl font-bold", totalOverdue > 0 ? "text-red-400" : "text-muted-foreground")}>
            {formatCents(totalOverdue)}
          </p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Draft</p>
          <p className="mt-1 text-3xl font-bold text-gray-400">
            {formatCents(totalDraft)}
          </p>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Monthly Revenue Chart */}
        <GlassCard>
          <h2 className="text-sm font-semibold">Monthly Revenue</h2>
          <div className="mt-4 flex items-end gap-2" style={{ height: 180 }}>
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-foreground">
                  {m.cents > 0 ? formatCents(m.cents) : ""}
                </span>
                <div
                  className="w-full rounded-t bg-primary transition-all"
                  style={{
                    height: `${Math.max((m.cents / maxMonthly) * 140, 4)}px`,
                  }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {m.month}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Project Status */}
        <GlassCard>
          <h2 className="text-sm font-semibold">Project Status</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(projectLabels).map(([status, label], i) => {
              const c = projectStatusMap[status] ?? 0;
              const pct = totalProjects > 0 ? Math.round((c / totalProjects) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">
                      {c}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={cn("h-full rounded-full transition-all", getBarColor(i))}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Summary Row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <GlassCard>
          <p className="text-xs text-muted-foreground">Total Invoices</p>
          <p className="mt-1 text-2xl font-bold">{invoiceCount}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Total Projects</p>
          <p className="mt-1 text-2xl font-bold">{totalProjects}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-muted-foreground">Active Clients</p>
          <p className="mt-1 text-2xl font-bold">{clientCount.value}</p>
        </GlassCard>
      </div>

      {/* Recent Payments */}
      {recentPaid.length > 0 && (
        <GlassCard className="mt-6">
          <h2 className="text-sm font-semibold">Recent Payments</h2>
          <div className="mt-4 space-y-2">
            {recentPaid.map((p) => (
              <div
                key={p.invoiceNumber}
                className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0"
              >
                <div>
                  <p className="text-sm font-mono">{p.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.clientCompany}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-400">
                    {formatCents(p.totalCents)}
                  </p>
                  {p.paidDate && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.paidDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </>
  );
}
