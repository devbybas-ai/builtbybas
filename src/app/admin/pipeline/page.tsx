import type { Metadata } from "next";
import { eq, desc, notInArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients, intakeSubmissions } from "@/lib/schema";
import { PIPELINE_STAGES } from "@/types/client";
import { decrypt, decryptAnalysisPii } from "@/lib/encryption";
import { PipelineBoard } from "@/components/admin/PipelineBoard";
import type { IntakeAnalysis } from "@/types/intake-analysis";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pipeline — BuiltByBas Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPipelinePage() {
  // Fetch clients and unconverted intakes in parallel
  const [allClients, unconvertedIntakes] = await Promise.all([
    db
      .select({
        id: clients.id,
        name: clients.name,
        company: clients.company,
        email: clients.email,
        pipelineStage: clients.pipelineStage,
        stageChangedAt: clients.stageChangedAt,
      })
      .from(clients)
      .where(eq(clients.status, "active")),
    db
      .select({
        id: intakeSubmissions.id,
        analysis: intakeSubmissions.analysis,
        status: intakeSubmissions.status,
        submittedAt: intakeSubmissions.submittedAt,
      })
      .from(intakeSubmissions)
      .where(notInArray(intakeSubmissions.status, ["converted", "rejected"]))
      .orderBy(desc(intakeSubmissions.submittedAt)),
  ]);

  const now = Date.now();

  // Build intake cards for the "intake_submitted" column
  const intakeCards = unconvertedIntakes.map((intake) => {
    const analysis = decryptAnalysisPii(intake.analysis as IntakeAnalysis);
    const primary = analysis.serviceRecommendations.find((r) => r.isPrimary);
    return {
      id: intake.id,
      name: analysis.formData.name,
      company: analysis.formData.company,
      email: analysis.formData.email,
      daysInStage: Math.floor(
        (now - new Date(intake.submittedAt).getTime()) / (1000 * 60 * 60 * 24)
      ),
      isIntake: true as const,
      intakeStatus: intake.status as string,
      primaryService: primary?.serviceTitle ?? undefined,
    };
  });

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

    // Inject unconverted intakes into the "lead" column
    const cards =
      stage.value === "lead"
        ? [...intakeCards, ...stageClients]
        : stageClients;

    return {
      stage,
      count: cards.length,
      clients: cards,
    };
  });

  const totalActive = allClients.length;
  const totalIntakes = intakeCards.length;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
        <p className="mt-1 text-muted-foreground">
          {totalActive} active client{totalActive !== 1 ? "s" : ""}
          {totalIntakes > 0 && (
            <> &middot; {totalIntakes} pending intake{totalIntakes !== 1 ? "s" : ""}</>
          )}
        </p>
      </div>
      <PipelineBoard columns={columns} />
    </>
  );
}
