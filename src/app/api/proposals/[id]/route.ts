import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { proposals, clients, pipelineHistory } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { updateProposalSchema } from "@/lib/proposal-validation";
import { sanitizeString } from "@/lib/sanitize";
import { decrypt } from "@/lib/encryption";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (!/^[a-f0-9-]+$/i.test(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid proposal ID" },
      { status: 400 }
    );
  }

  try {
    const [proposal] = await db
      .select({
        id: proposals.id,
        clientId: proposals.clientId,
        intakeSubmissionId: proposals.intakeSubmissionId,
        title: proposals.title,
        summary: proposals.summary,
        content: proposals.content,
        services: proposals.services,
        estimatedBudgetCents: proposals.estimatedBudgetCents,
        timeline: proposals.timeline,
        validUntil: proposals.validUntil,
        status: proposals.status,
        generatedBy: proposals.generatedBy,
        reviewedBy: proposals.reviewedBy,
        reviewedAt: proposals.reviewedAt,
        sentAt: proposals.sentAt,
        acceptedAt: proposals.acceptedAt,
        rejectionReason: proposals.rejectionReason,
        createdAt: proposals.createdAt,
        updatedAt: proposals.updatedAt,
        clientName: clients.name,
        clientCompany: clients.company,
        clientEmail: clients.email,
      })
      .from(proposals)
      .leftJoin(clients, eq(proposals.clientId, clients.id))
      .where(eq(proposals.id, id))
      .limit(1);

    if (!proposal) {
      return NextResponse.json(
        { success: false, error: "Proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...proposal,
        clientName: proposal.clientName ? decrypt(proposal.clientName) : null,
        clientEmail: proposal.clientEmail
          ? decrypt(proposal.clientEmail)
          : null,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve proposal" },
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
      { success: false, error: "Invalid proposal ID" },
      { status: 400 }
    );
  }

  try {
    const [deleted] = await db
      .delete(proposals)
      .where(eq(proposals.id, id))
      .returning({ id: proposals.id });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete proposal" },
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
      { success: false, error: "Invalid proposal ID" },
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

  const parsed = updateProposalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (data.title !== undefined) updates.title = sanitizeString(data.title);
  if (data.summary !== undefined)
    updates.summary = sanitizeString(data.summary);
  if (data.content !== undefined) updates.content = data.content;
  if (data.services !== undefined) updates.services = data.services;
  if (data.estimatedBudgetCents !== undefined)
    updates.estimatedBudgetCents = data.estimatedBudgetCents;
  if (data.timeline !== undefined)
    updates.timeline = data.timeline ? sanitizeString(data.timeline) : null;
  if (data.validUntil !== undefined)
    updates.validUntil = data.validUntil ? new Date(data.validUntil) : null;
  if (data.rejectionReason !== undefined)
    updates.rejectionReason = data.rejectionReason
      ? sanitizeString(data.rejectionReason)
      : null;

  // Status transitions with auto-set timestamps
  if (data.status !== undefined) {
    updates.status = data.status;
    if (data.status === "reviewed") {
      updates.reviewedBy = auth.user.id;
      updates.reviewedAt = new Date();
    }
    if (data.status === "sent") {
      updates.sentAt = new Date();
    }
    if (data.status === "accepted") {
      updates.acceptedAt = new Date();
    }
  }

  try {
    const [updated] = await db
      .update(proposals)
      .set(updates)
      .where(eq(proposals.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Proposal not found" },
        { status: 404 }
      );
    }

    // Pipeline stage advancement on status changes
    if (data.status === "accepted" && updated.clientId) {
      const [client] = await db
        .select({ pipelineStage: clients.pipelineStage })
        .from(clients)
        .where(eq(clients.id, updated.clientId))
        .limit(1);

      if (
        client &&
        ["proposal_draft", "proposal_sent"].includes(client.pipelineStage)
      ) {
        await db
          .update(clients)
          .set({
            pipelineStage: "proposal_accepted",
            stageChangedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(clients.id, updated.clientId));

        await db.insert(pipelineHistory).values({
          clientId: updated.clientId,
          fromStage: client.pipelineStage,
          toStage: "proposal_accepted",
          changedBy: auth.user.id,
          note: "Proposal accepted by client",
        });
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update proposal" },
      { status: 500 }
    );
  }
}
