import { NextResponse, type NextRequest } from "next/server";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { billingMilestones } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;

  try {
    const milestones = await db
      .select()
      .from(billingMilestones)
      .where(eq(billingMilestones.projectId, id))
      .orderBy(asc(billingMilestones.percentage));

    return NextResponse.json({ success: true, data: milestones });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve milestones" },
      { status: 500 }
    );
  }
}
