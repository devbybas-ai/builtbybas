import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects, clients } from "@/lib/schema";
import { decrypt } from "@/lib/encryption";
import { GlassCard } from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";
import { getProjectStatusMeta } from "@/types/project";
import { formatCents } from "@/types/invoice";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects — BuiltByBas Admin",
  robots: { index: false, follow: false },
};

export default async function ProjectsPage() {
  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      status: projects.status,
      budgetCents: projects.budgetCents,
      startDate: projects.startDate,
      targetDate: projects.targetDate,
      createdAt: projects.createdAt,
      clientName: clients.name,
      clientCompany: clients.company,
    })
    .from(projects)
    .leftJoin(clients, eq(projects.clientId, clients.id))
    .orderBy(desc(projects.updatedAt));

  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-muted-foreground">
            Active and past project work.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          + New Project
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {rows.map((p) => {
          const statusMeta = getProjectStatusMeta(p.status);
          return (
            <Link key={p.id} href={`/admin/projects/${p.id}`}>
              <GlassCard className="flex items-center justify-between transition-colors hover:border-primary/30">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="truncate font-medium">{p.name}</p>
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        statusMeta.color
                      )}
                    >
                      {statusMeta.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.clientCompany}
                    {p.clientName ? ` — ${decrypt(p.clientName)}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {p.budgetCents ? (
                    <p className="text-sm font-medium">
                      {formatCents(p.budgetCents)}
                    </p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </GlassCard>
            </Link>
          );
        })}
        {rows.length === 0 && (
          <GlassCard className="py-12 text-center">
            <p className="text-muted-foreground">
              No projects yet. Create one to start tracking work.
            </p>
          </GlassCard>
        )}
      </div>
    </>
  );
}
