import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { proposals, clients, pipelineHistory } from "@/lib/schema";
import { hmacHash } from "@/lib/encryption";
import { sanitizeString } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const respondSchema = z.object({
    token: z.string().regex(/^[a-f0-9]{64}$/),
    action: z.enum(["accept", "decline"]),
    reason: z.string().max(1000).optional(),
  });

  const parsed = respondSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const { token, action, reason } = parsed.data;

  const hashedToken = hmacHash(token);

  const [proposal] = await db
    .select({
      id: proposals.id,
      clientId: proposals.clientId,
      status: proposals.status,
      title: proposals.title,
    })
    .from(proposals)
    .where(eq(proposals.responseToken, hashedToken))
    .limit(1);

  if (!proposal) {
    return NextResponse.json(
      { success: false, error: "Proposal not found" },
      { status: 404 }
    );
  }

  if (proposal.status === "accepted" || proposal.status === "rejected") {
    return NextResponse.json(
      { success: false, error: "This proposal has already been responded to" },
      { status: 400 }
    );
  }

  if (proposal.status !== "sent") {
    return NextResponse.json(
      { success: false, error: "This proposal is not available for response" },
      { status: 400 }
    );
  }

  const now = new Date();
  const newStatus = action === "accept" ? "accepted" : "rejected";

  await db.transaction(async (tx) => {
    await tx
      .update(proposals)
      .set({
        status: newStatus,
        respondedAt: now,
        acceptedAt: action === "accept" ? now : undefined,
        rejectionReason: action === "decline" && reason ? sanitizeString(reason.slice(0, 1000)) : undefined,
        updatedAt: now,
      })
      .where(eq(proposals.id, proposal.id));

    // Advance pipeline stage
    if (proposal.clientId) {
      const [client] = await tx
        .select({ pipelineStage: clients.pipelineStage })
        .from(clients)
        .where(eq(clients.id, proposal.clientId))
        .limit(1);

      if (client) {
        if (action === "accept") {
          await tx
            .update(clients)
            .set({
              pipelineStage: "proposal_accepted",
              stageChangedAt: now,
              updatedAt: now,
            })
            .where(eq(clients.id, proposal.clientId));

          await tx.insert(pipelineHistory).values({
            clientId: proposal.clientId,
            fromStage: client.pipelineStage,
            toStage: "proposal_accepted",
            note: "Client accepted the proposal",
          });
        } else {
          await tx
            .update(clients)
            .set({
              status: "lost",
              updatedAt: now,
            })
            .where(eq(clients.id, proposal.clientId));

          await tx.insert(pipelineHistory).values({
            clientId: proposal.clientId,
            fromStage: client.pipelineStage,
            toStage: client.pipelineStage,
            note: `Client declined the proposal${reason ? `: ${sanitizeString(reason.slice(0, 500))}` : ""}`,
          });
        }
      }
    }
  });

  return NextResponse.json({ success: true, status: newStatus });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return NextResponse.json(
      { success: false, error: "Invalid token" },
      { status: 400 }
    );
  }

  const hashedToken = hmacHash(token);

  const [proposal] = await db
    .select({
      title: proposals.title,
      summary: proposals.summary,
      content: proposals.content,
      estimatedBudgetCents: proposals.estimatedBudgetCents,
      timeline: proposals.timeline,
      status: proposals.status,
      sentAt: proposals.sentAt,
      respondedAt: proposals.respondedAt,
      validUntil: proposals.validUntil,
      services: proposals.services,
    })
    .from(proposals)
    .where(eq(proposals.responseToken, hashedToken))
    .limit(1);

  if (!proposal) {
    return NextResponse.json(
      { success: false, error: "Proposal not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, proposal });
}
