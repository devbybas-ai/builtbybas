import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients, users, clientNotes, pipelineHistory } from "@/lib/schema";
import { ClientDetailDashboard } from "@/components/admin/ClientDetailDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client Detail — BuiltByBas Admin",
  robots: { index: false, follow: false },
};

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!/^[a-f0-9-]+$/i.test(id)) {
    notFound();
  }

  const [client] = await db
    .select({
      id: clients.id,
      name: clients.name,
      email: clients.email,
      phone: clients.phone,
      company: clients.company,
      industry: clients.industry,
      website: clients.website,
      pipelineStage: clients.pipelineStage,
      stageChangedAt: clients.stageChangedAt,
      intakeSubmissionId: clients.intakeSubmissionId,
      source: clients.source,
      status: clients.status,
      assignedTo: clients.assignedTo,
      createdAt: clients.createdAt,
      updatedAt: clients.updatedAt,
      assignedUserName: users.name,
    })
    .from(clients)
    .leftJoin(users, eq(clients.assignedTo, users.id))
    .where(eq(clients.id, id))
    .limit(1);

  if (!client) {
    notFound();
  }

  const notes = await db
    .select({
      id: clientNotes.id,
      type: clientNotes.type,
      content: clientNotes.content,
      createdAt: clientNotes.createdAt,
      authorId: clientNotes.authorId,
      authorName: users.name,
    })
    .from(clientNotes)
    .leftJoin(users, eq(clientNotes.authorId, users.id))
    .where(eq(clientNotes.clientId, id))
    .orderBy(desc(clientNotes.createdAt))
    .limit(20);

  const history = await db
    .select({
      id: pipelineHistory.id,
      fromStage: pipelineHistory.fromStage,
      toStage: pipelineHistory.toStage,
      note: pipelineHistory.note,
      createdAt: pipelineHistory.createdAt,
      changedBy: pipelineHistory.changedBy,
      changedByName: users.name,
    })
    .from(pipelineHistory)
    .leftJoin(users, eq(pipelineHistory.changedBy, users.id))
    .where(eq(pipelineHistory.clientId, id))
    .orderBy(desc(pipelineHistory.createdAt));

  return (
    <>
      <Link
        href="/admin/clients"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        &larr; Back to clients
      </Link>

      <ClientDetailDashboard
        client={{
          ...client,
          assignedUser: client.assignedTo
            ? { id: client.assignedTo, name: client.assignedUserName }
            : null,
        }}
        notes={notes.map((n) => ({
          ...n,
          author: { id: n.authorId, name: n.authorName },
        }))}
        pipelineHistory={history.map((h) => ({
          ...h,
          changedByUser: h.changedBy
            ? { id: h.changedBy, name: h.changedByName }
            : null,
        }))}
      />
    </>
  );
}
