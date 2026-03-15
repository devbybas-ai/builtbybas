import { NextResponse, type NextRequest } from "next/server";
import { isStripeEnabled } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  if (!isStripeEnabled()) {
    return NextResponse.json(
      { success: false, error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  // When Stripe is enabled:
  // 1. Read raw body for signature verification
  // 2. Verify webhook signature with STRIPE_WEBHOOK_SECRET
  // 3. Handle event: checkout.session.completed
  //    - Look up invoice by metadata.invoiceId
  //    - Mark invoice as paid, set paidDate
  //    - Mark linked milestone as paid
  //    - Send confirmation email
  // 4. Return 200

  // Note: This endpoint skips CSRF/admin auth.
  // Authentication is via Stripe webhook signature only.

  await request.text(); // consume body
  return NextResponse.json(
    { success: false, error: "Stripe webhook handler pending implementation" },
    { status: 501 }
  );
}
