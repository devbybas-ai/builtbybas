import { NextResponse, type NextRequest } from "next/server";
import { fullIntakeSchema } from "@/lib/intake-validation";
import { analyzeIntake } from "@/lib/intake-scoring";
import { listSubmissions, saveSubmission } from "@/lib/intake-storage";
import { requireAdmin } from "@/lib/api-auth";
import { RateLimiter } from "@/lib/rate-limit";

// Rate limiting: 10 submissions per IP per hour
const intakeLimiter = new RateLimiter({
  maxAttempts: 10,
  windowMs: 60 * 60 * 1000,
});

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!intakeLimiter.check(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many submissions. Please try again later." },
      { status: 429 },
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
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

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
