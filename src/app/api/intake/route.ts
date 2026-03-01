import { NextResponse, type NextRequest } from "next/server";
import { fullIntakeSchema } from "@/lib/intake-validation";
import { analyzeIntake } from "@/lib/intake-scoring";
import { listSubmissions, saveSubmission } from "@/lib/intake-storage";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = fullIntakeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed" },
      { status: 400 },
    );
  }

  const analysis = analyzeIntake(parsed.data);

  try {
    await saveSubmission(analysis);
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to save submission" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: { id: analysis.id },
  });
}

export async function GET() {
  try {
    const submissions = await listSubmissions();
    return NextResponse.json({ success: true, data: submissions });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve submissions" },
      { status: 500 },
    );
  }
}
