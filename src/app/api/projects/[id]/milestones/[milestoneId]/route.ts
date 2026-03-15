import { NextResponse, type NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { billingMilestones } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { updateMilestoneSchema } from "@/lib/billing-validation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id, milestoneId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = updateMilestoneSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  try {
    // Verify milestone belongs to project and is in updatable state
    const [milestone] = await db
      .select({ id: billingMilestones.id, status: billingMilestones.status })
      .from(billingMilestones)
      .where(
        and(
          eq(billingMilestones.id, milestoneId),
          eq(billingMilestones.projectId, id)
        )
      )
      .limit(1);

    if (!milestone) {
      return NextResponse.json(
        { success: false, error: "Milestone not found" },
        { status: 404 }
      );
    }

    // Only allow updates to pending milestones
    if (milestone.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Only pending milestones can be updated" },
        { status: 400 }
      );
    }

    // Build update object (field whitelist)
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (parsed.data.scheduledDate) {
      updateData.scheduledDate = new Date(parsed.data.scheduledDate);
    }
    if (parsed.data.status) {
      updateData.status = parsed.data.status;
    }

    const [updated] = await db
      .update(billingMilestones)
      .set(updateData)
      .where(eq(billingMilestones.id, milestoneId))
      .returning();

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update milestone" },
      { status: 500 }
    );
  }
}
