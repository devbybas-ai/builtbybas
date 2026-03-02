import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients } from "@/lib/schema";
import { PIPELINE_STAGES, type PipelineStage } from "@/types/client";
import { decrypt } from "@/lib/encryption";
import { PipelineBoard } from "@/components/admin/PipelineBoard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pipeline — BuiltByBas Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPipelinePage() {
  const allClients = await db
    .select({
      id: clients.id,
      name: clients.name,
      company: clients.company,
      email: clients.email,
      pipelineStage: clients.pipelineStage,
      stageChangedAt: clients.stageChangedAt,
    })
    .from(clients)
    .where(eq(clients.status, "active"));

  const now = Date.now();
  const columns = PIPELINE_STAGES.map((stage) => {
    const stageClients = allClients
      .filter((c) => c.pipelineStage === stage.value)
      .map((c) => ({
        id: c.id,
        name: decrypt(c.name),
        company: c.company,
        email: decrypt(c.email),
        daysInStage: Math.floor(
          (now - new Date(c.stageChangedAt).getTime()) / (1000 * 60 * 60 * 24)
        ),
      }));

    return {
      stage,
      count: stageClients.length,
      clients: stageClients,
    };
  });

  const totalActive = allClients.length;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
        <p className="mt-1 text-muted-foreground">
          {totalActive} active client{totalActive !== 1 ? "s" : ""} across 12
          stages.
        </p>
      </div>
      <PipelineBoard columns={columns} />
    </>
  );
}
