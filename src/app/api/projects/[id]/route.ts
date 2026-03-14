import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects, clients } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { updateProjectSchema } from "@/lib/project-validation";
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
      { success: false, error: "Invalid project ID" },
      { status: 400 }
    );
  }

  try {
    const [project] = await db
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
        clientEmail: clients.email,
      })
      .from(projects)
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .where(eq(projects.id, id))
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        clientName: project.clientName ? decrypt(project.clientName) : null,
        clientEmail: project.clientEmail ? decrypt(project.clientEmail) : null,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve project" },
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
      { success: false, error: "Invalid project ID" },
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

  const parsed = updateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const updates: Partial<typeof projects.$inferInsert> = { updatedAt: new Date() };
  const data = parsed.data;

  if (data.name !== undefined) updates.name = sanitizeString(data.name);
  if (data.description !== undefined)
    updates.description = data.description
      ? sanitizeString(data.description)
      : null;
  if (data.status !== undefined) {
    updates.status = data.status;
    if (data.status === "completed") updates.completedDate = new Date();
  }
  if (data.startDate !== undefined)
    updates.startDate = data.startDate ? new Date(data.startDate) : null;
  if (data.targetDate !== undefined)
    updates.targetDate = data.targetDate ? new Date(data.targetDate) : null;
  if (data.completedDate !== undefined)
    updates.completedDate = data.completedDate
      ? new Date(data.completedDate)
      : null;
  if (data.budgetCents !== undefined) updates.budgetCents = data.budgetCents;
  if (data.services !== undefined) updates.services = data.services;
  if (data.assignedTo !== undefined) updates.assignedTo = data.assignedTo;

  try {
    const [updated] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}
