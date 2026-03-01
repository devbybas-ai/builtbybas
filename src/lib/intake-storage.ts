import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { intakeSubmissions } from "./schema";
import { encrypt, encryptAnalysisPii, decryptAnalysisPii } from "./encryption";
import type { IntakeAnalysis } from "@/types/intake-analysis";

export async function saveSubmission(
  analysis: IntakeAnalysis,
): Promise<void> {
  const primaryRec = analysis.serviceRecommendations.find(
    (r) => r.isPrimary,
  );

  const encryptedAnalysis = encryptAnalysisPii(analysis);

  await db.insert(intakeSubmissions).values({
    id: analysis.id,
    submittedAt: new Date(analysis.submittedAt),
    name: encrypt(analysis.formData.name),
    email: encrypt(analysis.formData.email.toLowerCase()),
    company: analysis.formData.company,
    complexityScore: analysis.complexityScore.overall,
    primaryService: primaryRec?.serviceTitle ?? null,
    formData: encryptedAnalysis.formData,
    analysis: encryptedAnalysis,
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

  return decryptAnalysisPii(row.analysis as IntakeAnalysis);
}

export async function listSubmissions(): Promise<IntakeAnalysis[]> {
  const rows = await db
    .select({ analysis: intakeSubmissions.analysis })
    .from(intakeSubmissions)
    .orderBy(desc(intakeSubmissions.submittedAt));

  return rows.map((r) => decryptAnalysisPii(r.analysis as IntakeAnalysis));
}
