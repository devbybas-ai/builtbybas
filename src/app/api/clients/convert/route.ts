import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { clients, pipelineHistory } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { convertIntakeSchema } from "@/lib/client-validation";
import { getSubmission } from "@/lib/intake-storage";
import { sanitizeString } from "@/lib/sanitize";
import { encrypt, decrypt } from "@/lib/encryption";

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

  const parsed = convertIntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const { intakeSubmissionId } = parsed.data;

  try {
    const submission = await getSubmission(intakeSubmissionId);
    if (!submission) {
      return NextResponse.json(
        { success: false, error: "Intake submission not found" },
        { status: 404 }
      );
    }

    const { formData } = submission;

    const [client] = await db
      .insert(clients)
      .values({
        name: encrypt(sanitizeString(formData.name)),
        email: encrypt(formData.email.toLowerCase()),
        phone: formData.phone ? encrypt(sanitizeString(formData.phone)) : null,
        company: sanitizeString(formData.company),
        industry: formData.industry ? sanitizeString(formData.industry) : null,
        website: formData.website || null,
        pipelineStage: "intake_submitted",
        source: "intake",
        intakeSubmissionId,
        assignedTo: auth.user.id,
      })
      .returning();

    await db.insert(pipelineHistory).values({
      clientId: client.id,
      fromStage: null,
      toStage: "intake_submitted",
      changedBy: auth.user.id,
      note: `Converted from intake submission ${intakeSubmissionId}`,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...client,
        name: decrypt(client.name),
        email: decrypt(client.email),
        phone: client.phone ? decrypt(client.phone) : null,
      },
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to convert intake to client" },
      { status: 500 }
    );
  }
}
