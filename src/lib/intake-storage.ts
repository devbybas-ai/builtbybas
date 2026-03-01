import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { IntakeAnalysis } from "@/types/intake-analysis";

const DATA_DIR = join(process.cwd(), "data", "intake-submissions");

async function ensureDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function saveSubmission(analysis: IntakeAnalysis): Promise<void> {
  await ensureDir();
  const filePath = join(DATA_DIR, `${analysis.id}.json`);
  await writeFile(filePath, JSON.stringify(analysis, null, 2), "utf-8");
}

export async function getSubmission(
  id: string,
): Promise<IntakeAnalysis | null> {
  // Validate ID format to prevent path traversal
  if (!/^[a-f0-9-]+$/i.test(id)) return null;

  try {
    const filePath = join(DATA_DIR, `${id}.json`);
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as IntakeAnalysis;
  } catch {
    return null;
  }
}

export async function listSubmissions(): Promise<IntakeAnalysis[]> {
  await ensureDir();

  let files: string[];
  try {
    files = await readdir(DATA_DIR);
  } catch {
    return [];
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  const submissions: IntakeAnalysis[] = [];

  for (const file of jsonFiles) {
    try {
      const raw = await readFile(join(DATA_DIR, file), "utf-8");
      submissions.push(JSON.parse(raw) as IntakeAnalysis);
    } catch {
      // Skip corrupted files
    }
  }

  // Sort by submission date descending (newest first)
  submissions.sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );

  return submissions;
}
