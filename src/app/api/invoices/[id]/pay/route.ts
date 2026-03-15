import { NextResponse, type NextRequest } from "next/server";
import { isStripeEnabled } from "@/lib/stripe";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params; // consume params to avoid Next.js warning

  if (!isStripeEnabled()) {
    return NextResponse.json(
      { success: false, error: "Online payments are not yet available. Please contact us for payment details." },
      { status: 503 }
    );
  }

  // When Stripe is enabled:
  // 1. Fetch invoice by id
  // 2. Create Stripe Checkout Session with line items
  // 3. Return { url: session.url } for client redirect
  return NextResponse.json(
    { success: false, error: "Stripe integration pending implementation" },
    { status: 501 }
  );
}
