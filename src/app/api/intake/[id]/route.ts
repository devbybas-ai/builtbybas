import { NextResponse, type NextRequest } from "next/server";
import { getSubmission } from "@/lib/intake-storage";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!/^[a-f0-9-]+$/i.test(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid submission ID" },
      { status: 400 },
    );
  }

  try {
    const row = await getSubmission(id);

    if (!row) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...row.analysis, status: row.status },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve submission" },
      { status: 500 },
    );
  }
}
