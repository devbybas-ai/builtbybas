import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients, pipelineHistory } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { updatePipelineStageSchema } from "@/lib/client-validation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (!/^[a-f0-9-]+$/i.test(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid client ID" },
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

  const parsed = updatePipelineStageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 }
    );
  }

  const { stage, note } = parsed.data;

  try {
    const [current] = await db
      .select({ id: clients.id, pipelineStage: clients.pipelineStage })
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    if (!current) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    const now = new Date();

    const [updated] = await db.transaction(async (tx) => {
      const [u] = await tx
        .update(clients)
        .set({
          pipelineStage: stage,
          stageChangedAt: now,
          updatedAt: now,
        })
        .where(eq(clients.id, id))
        .returning();

      await tx.insert(pipelineHistory).values({
        clientId: id,
        fromStage: current.pipelineStage,
        toStage: stage,
        changedBy: auth.user.id,
        note: note ?? null,
      });

      return [u];
    });

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update pipeline stage" },
      { status: 500 }
    );
  }
}
