import { NextResponse, type NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients, users, pipelineHistory } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { createClientSchema } from "@/lib/client-validation";
import { sanitizeString } from "@/lib/sanitize";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { searchParams } = request.nextUrl;
  const statusFilter = searchParams.get("status");

  try {
    const query = db
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
      .orderBy(desc(clients.updatedAt));

    const rows =
      statusFilter && ["active", "archived", "lost"].includes(statusFilter)
        ? await query.where(
            eq(clients.status, statusFilter as "active" | "archived" | "lost")
          )
        : await query;

    const data = rows.map((row) => ({
      ...row,
      assignedUser: row.assignedTo
        ? { id: row.assignedTo, name: row.assignedUserName }
        : null,
      assignedUserName: undefined,
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve clients" },
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

  const parsed = createClientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const stage = data.pipelineStage ?? "lead";

  try {
    const [client] = await db
      .insert(clients)
      .values({
        name: sanitizeString(data.name),
        email: data.email.toLowerCase(),
        phone: data.phone ? sanitizeString(data.phone) : null,
        company: sanitizeString(data.company),
        industry: data.industry ? sanitizeString(data.industry) : null,
        website: data.website || null,
        pipelineStage: stage,
        source: data.source ? sanitizeString(data.source) : null,
        intakeSubmissionId: data.intakeSubmissionId ?? null,
        assignedTo: auth.user.id,
      })
      .returning();

    await db.insert(pipelineHistory).values({
      clientId: client.id,
      fromStage: null,
      toStage: stage,
      changedBy: auth.user.id,
      note: "Client created",
    });

    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create client" },
      { status: 500 }
    );
  }
}
