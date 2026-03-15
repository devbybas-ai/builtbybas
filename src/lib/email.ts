import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "BuiltByBas <onboarding@resend.dev>";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002";

/**
 * Send a transactional email via Resend.
 * Throws if Resend is not configured or if the send fails.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!resend) {
    throw new Error("Email service not configured");
  }
  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    ...(ADMIN_EMAIL ? { bcc: ADMIN_EMAIL } : {}),
    subject,
    html,
  });
  if (error) {
    throw new Error(error.message);
  }
}
