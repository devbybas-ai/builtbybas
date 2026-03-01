import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { PIPELINE_STAGES, type PipelineStage } from "@/types/client";
import { decrypt } from "@/lib/encryption";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  try {
    const allClients = await db
      .select({
        id: clients.id,
        name: clients.name,
        company: clients.company,
        pipelineStage: clients.pipelineStage,
        stageChangedAt: clients.stageChangedAt,
        email: clients.email,
      })
      .from(clients)
      .where(eq(clients.status, "active"));

    const now = Date.now();
    const grouped: Record<
      PipelineStage,
      {
        stage: (typeof PIPELINE_STAGES)[number];
        count: number;
        clients: {
          id: string;
          name: string;
          company: string;
          email: string;
          daysInStage: number;
        }[];
      }
    > = {} as never;

    for (const stage of PIPELINE_STAGES) {
      grouped[stage.value] = { stage, count: 0, clients: [] };
    }

    for (const c of allClients) {
      const daysInStage = Math.floor(
        (now - new Date(c.stageChangedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      const bucket = grouped[c.pipelineStage];
      if (bucket) {
        bucket.count++;
        bucket.clients.push({
          id: c.id,
          name: decrypt(c.name),
          company: c.company,
          email: decrypt(c.email),
          daysInStage,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: PIPELINE_STAGES.map((s) => grouped[s.value]),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve pipeline data" },
      { status: 500 }
    );
  }
}
