import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod/v4";
import { requireAdmin } from "@/lib/api-auth";
import { updateIntakeStatus } from "@/lib/intake-storage";

const updateStatusSchema = z.object({
  status: z.enum(["new", "reviewed", "accepted", "rejected", "converted"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;

  if (!/^[a-f0-9-]+$/i.test(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid submission ID" },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = updateStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid status value" },
      { status: 400 },
    );
  }

  try {
    const updated = await updateIntakeStatus(id, parsed.data.status);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: { status: parsed.data.status } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update status" },
      { status: 500 },
    );
  }
}
