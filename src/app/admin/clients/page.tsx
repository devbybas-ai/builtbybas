import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients, users } from "@/lib/schema";
import { ClientListCard } from "@/components/admin/ClientListCard";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clients — BuiltByBas Admin",
  robots: { index: false, follow: false },
};

export default async function AdminClientsPage() {
  const rows = await db
    .select({
      id: clients.id,
      name: clients.name,
      email: clients.email,
      company: clients.company,
      industry: clients.industry,
      pipelineStage: clients.pipelineStage,
      stageChangedAt: clients.stageChangedAt,
      assignedTo: clients.assignedTo,
      assignedUserName: users.name,
    })
    .from(clients)
    .leftJoin(users, eq(clients.assignedTo, users.id))
    .where(eq(clients.status, "active"))
    .orderBy(desc(clients.updatedAt));

  const clientList = rows.map((row) => ({
    ...row,
    assignedUser: row.assignedTo
      ? { id: row.assignedTo, name: row.assignedUserName }
      : null,
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your client relationships and pipeline.
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

      {clientList.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No clients yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a client or convert an intake submission to get started.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {clientList.map((client) => (
            <ClientListCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </>
  );
}
