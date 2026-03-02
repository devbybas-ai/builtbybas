import { NextResponse, type NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { proposals, clients } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { createProposalSchema } from "@/lib/proposal-validation";
import { sanitizeString } from "@/lib/sanitize";
import { decrypt } from "@/lib/encryption";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { searchParams } = request.nextUrl;
  const statusFilter = searchParams.get("status");

  try {
    const query = db
      .select({
        id: proposals.id,
        clientId: proposals.clientId,
        intakeSubmissionId: proposals.intakeSubmissionId,
        title: proposals.title,
        summary: proposals.summary,
        status: proposals.status,
        estimatedBudgetCents: proposals.estimatedBudgetCents,
        timeline: proposals.timeline,
        validUntil: proposals.validUntil,
        sentAt: proposals.sentAt,
        acceptedAt: proposals.acceptedAt,
        createdAt: proposals.createdAt,
        clientName: clients.name,
        clientCompany: clients.company,
      })
      .from(proposals)
      .leftJoin(clients, eq(proposals.clientId, clients.id))
      .orderBy(desc(proposals.createdAt));

    const validStatuses = ["draft", "reviewed", "sent", "accepted", "rejected"] as const;
    const rows =
      statusFilter && validStatuses.includes(statusFilter as typeof validStatuses[number])
        ? await query.where(
            eq(proposals.status, statusFilter as typeof validStatuses[number])
          )
        : await query;

    const data = rows.map((row) => ({
      ...row,
      clientName: row.clientName ? decrypt(row.clientName) : null,
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve proposals" },
      { status: 500 }
    );
  }
}

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

  const parsed = createProposalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const validUntil = data.validUntil ? new Date(data.validUntil) : null;

    const [proposal] = await db
      .insert(proposals)
      .values({
        clientId: data.clientId,
        intakeSubmissionId: data.intakeSubmissionId ?? null,
        title: sanitizeString(data.title),
        summary: sanitizeString(data.summary),
        content: data.content,
        services: data.services ?? [],
        estimatedBudgetCents: data.estimatedBudgetCents ?? null,
        timeline: data.timeline ? sanitizeString(data.timeline) : null,
        validUntil,
        status: "draft",
        generatedBy: auth.user.id,
      })
      .returning();

    return NextResponse.json({ success: true, data: proposal }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}
