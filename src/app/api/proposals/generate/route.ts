import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { proposals, clients, pipelineHistory } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { generateProposalSchema } from "@/lib/proposal-validation";
import { getSubmission } from "@/lib/intake-storage";
import { generateProposal } from "@/lib/proposal-generator";
import { services } from "@/data/services";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = generateProposalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const { intakeSubmissionId, clientId } = parsed.data;

  const analysis = await getSubmission(intakeSubmissionId);
  if (!analysis) {
    return NextResponse.json(
      { success: false, error: "Intake submission not found" },
      { status: 404 }
    );
  }

  // Resolve client — use provided ID or find from intake
  let resolvedClientId = clientId;
  if (!resolvedClientId) {
    const [client] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(eq(clients.intakeSubmissionId, intakeSubmissionId))
      .limit(1);
    resolvedClientId = client?.id;
  }

  if (!resolvedClientId) {
    return NextResponse.json(
      {
        success: false,
        error:
          "No client linked to this intake. Convert the intake to a client first or provide clientId.",
      },
      { status: 400 }
    );
  }

  try {
    const generated = generateProposal(analysis, services);

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    const [proposal] = await db
      .insert(proposals)
      .values({
        clientId: resolvedClientId,
        intakeSubmissionId,
        title: generated.title,
        summary: generated.summary,
        content: generated.content,
        services: generated.services,
        estimatedBudgetCents: generated.estimatedBudgetCents,
        timeline: generated.timeline,
        validUntil,
        status: "draft",
        generatedBy: auth.user.id,
      })
      .returning();

    // Advance pipeline stage to proposal_draft if appropriate
    const [client] = await db
      .select({ pipelineStage: clients.pipelineStage })
      .from(clients)
      .where(eq(clients.id, resolvedClientId))
      .limit(1);

    if (
      client &&
      ["analysis_complete", "fit_assessment"].includes(client.pipelineStage)
    ) {
      await db
        .update(clients)
        .set({
          pipelineStage: "proposal_draft",
          stageChangedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(clients.id, resolvedClientId));

      await db.insert(pipelineHistory).values({
        clientId: resolvedClientId,
        fromStage: client.pipelineStage,
        toStage: "proposal_draft",
        changedBy: auth.user.id,
        note: "Proposal generated from intake analysis",
      });
    }

    return NextResponse.json({ success: true, data: proposal }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to generate proposal" },
      { status: 500 }
    );
  }
}
