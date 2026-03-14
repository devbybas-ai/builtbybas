import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { intakeSubmissions, intakeStatusEnum } from "./schema";
import { encrypt, encryptAnalysisPii, decryptAnalysisPii } from "./encryption";
import type { IntakeAnalysis } from "@/types/intake-analysis";

/** Derived from the schema enum -- single source of truth */
export type IntakeStatus = (typeof intakeStatusEnum.enumValues)[number];

export interface IntakeSubmissionRow {
  analysis: IntakeAnalysis;
  status: IntakeStatus;
}

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
): Promise<IntakeSubmissionRow | null> {
  if (!/^[a-f0-9-]+$/i.test(id)) return null;

  const [row] = await db
    .select({
      analysis: intakeSubmissions.analysis,
      status: intakeSubmissions.status,
    })
    .from(intakeSubmissions)
    .where(eq(intakeSubmissions.id, id))
    .limit(1);

  if (!row) return null;

  return {
    analysis: decryptAnalysisPii(row.analysis as IntakeAnalysis),
    status: row.status,
  };
}

export async function listSubmissions(): Promise<IntakeSubmissionRow[]> {
  const rows = await db
    .select({
      analysis: intakeSubmissions.analysis,
      status: intakeSubmissions.status,
    })
    .from(intakeSubmissions)
    .orderBy(desc(intakeSubmissions.submittedAt));

  return rows.map((r) => ({
    analysis: decryptAnalysisPii(r.analysis as IntakeAnalysis),
    status: r.status,
  }));
}

export async function updateIntakeStatus(
  id: string,
  status: IntakeStatus,
): Promise<boolean> {
  if (!/^[a-f0-9-]+$/i.test(id)) return false;

  const result = await db
    .update(intakeSubmissions)
    .set({ status })
    .where(eq(intakeSubmissions.id, id));

  return (result.rowCount ?? 0) > 0;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  if (!/^[a-f0-9-]+$/i.test(id)) return false;

  const result = await db
    .delete(intakeSubmissions)
    .where(eq(intakeSubmissions.id, id));

  return (result.rowCount ?? 0) > 0;
}
