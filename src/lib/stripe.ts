export function isStripeEnabled(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

// Stripe client initialization deferred until env vars are configured.
// To activate: add STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
// and STRIPE_WEBHOOK_SECRET to .env.local, then run `pnpm add stripe`.
