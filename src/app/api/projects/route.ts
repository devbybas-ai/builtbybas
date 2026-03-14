import { NextResponse, type NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects, clients } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { createProjectSchema } from "@/lib/project-validation";
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
        id: projects.id,
        clientId: projects.clientId,
        name: projects.name,
        description: projects.description,
        status: projects.status,
        startDate: projects.startDate,
        targetDate: projects.targetDate,
        completedDate: projects.completedDate,
        budgetCents: projects.budgetCents,
        services: projects.services,
        assignedTo: projects.assignedTo,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        clientName: clients.name,
        clientCompany: clients.company,
      })
      .from(projects)
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .orderBy(desc(projects.updatedAt));

    const rows =
      statusFilter &&
      ["planning", "in_progress", "on_hold", "completed", "cancelled"].includes(
        statusFilter
      )
        ? await query.where(
            eq(
              projects.status,
              statusFilter as
                | "planning"
                | "in_progress"
                | "on_hold"
                | "completed"
                | "cancelled"
            )
          )
        : await query;

    const data = rows.map((row) => ({
      ...row,
      clientName: row.clientName ? decrypt(row.clientName) : null,
    }));

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve projects" },
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

  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const [project] = await db
      .insert(projects)
      .values({
        clientId: data.clientId,
        name: sanitizeString(data.name),
        description: data.description ? sanitizeString(data.description) : null,
        status: data.status ?? "planning",
        startDate: data.startDate ? new Date(data.startDate) : null,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        budgetCents: data.budgetCents ?? null,
        services: data.services ?? [],
        assignedTo: auth.user.id,
      })
      .returning();

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
