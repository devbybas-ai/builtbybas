import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients, users } from "@/lib/schema";
import { decrypt } from "@/lib/encryption";
import { ClientListView } from "@/components/admin/ClientListView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clients - BuiltByBas Admin",
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
    name: decrypt(row.name),
    email: decrypt(row.email),
    assignedUser: row.assignedTo
      ? { id: row.assignedTo, name: row.assignedUserName }
      : null,
  }));

  return <ClientListView clients={clientList} />;
}
