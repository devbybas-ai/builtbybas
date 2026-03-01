import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod/v4";
import { requireAdmin } from "@/lib/api-auth";
import { resend, EMAIL_FROM, SITE_URL } from "@/lib/email";

const sendLinkSchema = z.object({
  email: z.email(),
  name: z.string().min(1).max(255).optional(),
  message: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  if (!resend) {
    return NextResponse.json(
      { success: false, error: "Email service not configured. Set RESEND_API_KEY in .env.local." },
      { status: 503 },
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

  const parsed = sendLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid email address" },
      { status: 400 },
    );
  }

  const { email, name, message } = parsed.data;
  const intakeUrl = `${SITE_URL}/intake`;
  const greeting = name ? `Hi ${name},` : "Hi,";
  const customMessage = message
    ? `<p style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:16px 0;">${message.replace(/\n/g, "<br/>")}</p>`
    : "";

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Start Your Project with BuiltByBas",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background-color:#0A0A0F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0F;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <!-- Header -->
        <tr><td style="padding-bottom:32px;">
          <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">Built<span style="color:#00D4FF;">By</span>Bas</h1>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:32px;">
          <p style="color:#ffffff;font-size:16px;line-height:1.5;margin:0 0 8px;">${greeting}</p>
          <p style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:0 0 16px;">
            Thank you for your interest in working with BuiltByBas. We build custom websites, dashboards, and tools — precision-engineered for your business.
          </p>
          ${customMessage}
          <p style="color:#a1a1aa;font-size:15px;line-height:1.6;margin:0 0 24px;">
            To get started, fill out our project intake form. It takes about 5 minutes and helps us understand exactly what your business needs.
          </p>

          <!-- CTA Button -->
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr><td style="background:#00D4FF;border-radius:8px;">
              <a href="${intakeUrl}" target="_blank" style="display:inline-block;padding:14px 32px;color:#0A0A0F;font-size:15px;font-weight:600;text-decoration:none;">
                Start Your Project &rarr;
              </a>
            </td></tr>
          </table>

          <p style="color:#71717a;font-size:13px;line-height:1.5;margin:24px 0 0;text-align:center;">
            Or copy this link: <a href="${intakeUrl}" style="color:#00D4FF;text-decoration:underline;">${intakeUrl}</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:24px;text-align:center;">
          <p style="color:#52525b;font-size:12px;margin:0;">
            BuiltByBas &middot; Custom Software &amp; Web Development
          </p>
          <p style="color:#3f3f46;font-size:11px;margin:8px 0 0;">
            This email was sent because someone at BuiltByBas thought you might be interested in working together.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
      `.trim(),
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Email service error" },
      { status: 500 },
    );
  }
}
