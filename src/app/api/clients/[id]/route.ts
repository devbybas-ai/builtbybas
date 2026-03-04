import { NextResponse, type NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  clients,
  users,
  clientNotes,
  pipelineHistory,
} from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { updateClientSchema } from "@/lib/client-validation";
import { sanitizeString } from "@/lib/sanitize";
import { encrypt, decrypt } from "@/lib/encryption";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (!/^[a-f0-9-]+$/i.test(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid client ID" },
      { status: 400 }
    );
  }

  try {
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
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    const notes = await db
      .select({
        id: clientNotes.id,
        clientId: clientNotes.clientId,
        authorId: clientNotes.authorId,
        type: clientNotes.type,
        content: clientNotes.content,
        createdAt: clientNotes.createdAt,
        updatedAt: clientNotes.updatedAt,
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
        clientId: pipelineHistory.clientId,
        fromStage: pipelineHistory.fromStage,
        toStage: pipelineHistory.toStage,
        changedBy: pipelineHistory.changedBy,
        note: pipelineHistory.note,
        createdAt: pipelineHistory.createdAt,
        changedByName: users.name,
      })
      .from(pipelineHistory)
      .leftJoin(users, eq(pipelineHistory.changedBy, users.id))
      .where(eq(pipelineHistory.clientId, id))
      .orderBy(desc(pipelineHistory.createdAt));

    return NextResponse.json({
      success: true,
      data: {
        ...client,
        name: decrypt(client.name),
        email: decrypt(client.email),
        phone: client.phone ? decrypt(client.phone) : null,
        assignedUser: client.assignedTo
          ? { id: client.assignedTo, name: client.assignedUserName }
          : null,
        notes: notes.map((n) => ({
          ...n,
          author: { id: n.authorId, name: n.authorName },
          authorName: undefined,
        })),
        pipelineHistory: history.map((h) => ({
          ...h,
          changedByUser: h.changedBy
            ? { id: h.changedBy, name: h.changedByName }
            : null,
          changedByName: undefined,
        })),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve client" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (!/^[a-f0-9-]+$/i.test(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid client ID" },
      { status: 400 }
    );
  }

  try {
    // Delete related records first (notes, pipeline history)
    await db
      .delete(clientNotes)
      .where(eq(clientNotes.clientId, id));
    await db
      .delete(pipelineHistory)
      .where(eq(pipelineHistory.clientId, id));

    const [deleted] = await db
      .delete(clients)
      .where(eq(clients.id, id))
      .returning({ id: clients.id });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete client" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (!/^[a-f0-9-]+$/i.test(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid client ID" },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = updateClientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  const data = parsed.data;

  if (data.name !== undefined) updates.name = encrypt(sanitizeString(data.name));
  if (data.email !== undefined) updates.email = encrypt(data.email.toLowerCase());
  if (data.phone !== undefined)
    updates.phone = data.phone ? encrypt(sanitizeString(data.phone)) : null;
  if (data.company !== undefined)
    updates.company = sanitizeString(data.company);
  if (data.industry !== undefined)
    updates.industry = data.industry ? sanitizeString(data.industry) : null;
  if (data.website !== undefined) updates.website = data.website || null;
  if (data.status !== undefined) updates.status = data.status;
  if (data.assignedTo !== undefined) updates.assignedTo = data.assignedTo;

  try {
    const [updated] = await db
      .update(clients)
      .set(updates)
      .where(eq(clients.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        name: decrypt(updated.name),
        email: decrypt(updated.email),
        phone: updated.phone ? decrypt(updated.phone) : null,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update client" },
      { status: 500 }
    );
  }
}
