import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { intakeSubmissions } from "./schema";
import type { IntakeAnalysis } from "@/types/intake-analysis";

export async function saveSubmission(
  analysis: IntakeAnalysis,
): Promise<void> {
  const primaryRec = analysis.serviceRecommendations.find(
    (r) => r.isPrimary,
  );

  await db.insert(intakeSubmissions).values({
    id: analysis.id,
    submittedAt: new Date(analysis.submittedAt),
    name: analysis.formData.name,
    email: analysis.formData.email.toLowerCase(),
    company: analysis.formData.company,
    complexityScore: analysis.complexityScore.overall,
    primaryService: primaryRec?.serviceTitle ?? null,
    formData: analysis.formData,
    analysis: analysis,
  });
}

export async function getSubmission(
  id: string,
): Promise<IntakeAnalysis | null> {
  if (!/^[a-f0-9-]+$/i.test(id)) return null;

  const [row] = await db
    .select({ analysis: intakeSubmissions.analysis })
    .from(intakeSubmissions)
    .where(eq(intakeSubmissions.id, id))
    .limit(1);

  if (!row) return null;

  return row.analysis as IntakeAnalysis;
}

export async function listSubmissions(): Promise<IntakeAnalysis[]> {
  const rows = await db
    .select({ analysis: intakeSubmissions.analysis })
    .from(intakeSubmissions)
    .orderBy(desc(intakeSubmissions.submittedAt));

  return rows.map((r) => r.analysis as IntakeAnalysis);
}
