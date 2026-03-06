import { markdownToHtml } from "@/lib/markdown-to-html";

interface ProposalEmailData {
  title: string;
  summary: string;
  content: string;
  estimatedBudgetCents: number | null;
  timeline: string | null;
  clientName: string;
  clientCompany: string;
  customMessage?: string;
  responseUrl?: string;
}

export function buildProposalEmailHtml(data: ProposalEmailData): string {
  const {
    title,
    summary,
    content,
    estimatedBudgetCents,
    timeline,
    clientName,
    customMessage,
    responseUrl,
  } = data;

  const budgetDisplay = estimatedBudgetCents
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(estimatedBudgetCents / 100)
    : null;

  const proposalHtml = markdownToHtml(content);

  const greeting = customMessage
    ? `<p style="color:#e0e0e0;font-size:16px;line-height:1.6;margin:0 0 16px;">${escapeForEmail(customMessage)}</p>`
    : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background-color:#0A0A0F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0F;">
<tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">

<!-- Header -->
<tr><td style="padding:0 0 24px;">
  <h1 style="color:#00D4FF;font-size:24px;font-weight:700;margin:0;">BuiltByBas</h1>
</td></tr>

<!-- Greeting -->
<tr><td style="padding:0 0 24px;">
  <p style="color:#ffffff;font-size:18px;font-weight:600;margin:0 0 8px;">Hi ${escapeForEmail(clientName)},</p>
  ${greeting}
  <p style="color:#e0e0e0;font-size:16px;line-height:1.6;margin:0;">
    We've prepared a proposal for your project. Here's a summary:
  </p>
</td></tr>

<!-- Summary Card -->
<tr><td style="padding:0 0 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;">
<tr><td style="padding:24px;">
  <h2 style="color:#ffffff;font-size:20px;font-weight:600;margin:0 0 12px;">${escapeForEmail(title)}</h2>
  <p style="color:#a0a0a0;font-size:14px;line-height:1.5;margin:0 0 16px;">${escapeForEmail(summary)}</p>
  <table role="presentation" cellpadding="0" cellspacing="0">
  <tr>
    ${budgetDisplay ? `<td style="padding:0 24px 0 0;"><span style="color:#a0a0a0;font-size:12px;text-transform:uppercase;">Investment</span><br/><span style="color:#00D4FF;font-size:18px;font-weight:600;">${budgetDisplay}</span></td>` : ""}
    ${timeline ? `<td style="padding:0;"><span style="color:#a0a0a0;font-size:12px;text-transform:uppercase;">Timeline</span><br/><span style="color:#00D4FF;font-size:18px;font-weight:600;">${escapeForEmail(timeline)}</span></td>` : ""}
  </tr>
  </table>
</td></tr>
</table>
</td></tr>

<!-- Full Proposal Content -->
<tr><td style="padding:0 0 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
<tr><td style="padding:24px;color:#e0e0e0;font-size:14px;line-height:1.7;">
<style>
  h2 { color: #ffffff; font-size: 18px; font-weight: 600; margin: 24px 0 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; }
  h3 { color: #00D4FF; font-size: 16px; font-weight: 600; margin: 20px 0 8px; }
  h4 { color: #ffffff; font-size: 14px; font-weight: 600; margin: 16px 0 8px; }
  p { color: #e0e0e0; margin: 0 0 12px; }
  ul, ol { color: #e0e0e0; margin: 0 0 12px; padding-left: 24px; }
  li { margin: 0 0 6px; }
  strong { color: #ffffff; }
  em { color: #a0a0a0; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th { color: #a0a0a0; font-size: 12px; text-transform: uppercase; text-align: left; padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  td { color: #e0e0e0; padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0; }
</style>
${proposalHtml}
</td></tr>
</table>
</td></tr>

${responseUrl ? `<!-- Accept / Decline -->
<tr><td style="padding:0 0 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;">
<tr><td style="padding:24px;text-align:center;">
  <p style="color:#ffffff;font-size:16px;font-weight:600;margin:0 0 8px;">Ready to move forward?</p>
  <p style="color:#a0a0a0;font-size:14px;margin:0 0 20px;">Click below to accept or decline this proposal.</p>
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
  <tr>
    <td style="padding:0 8px 0 0;">
      <a href="${responseUrl}" style="display:inline-block;padding:12px 32px;background-color:#00D4FF;color:#0A0A0F;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;">Accept Proposal</a>
    </td>
    <td style="padding:0 0 0 8px;">
      <a href="${responseUrl}" style="display:inline-block;padding:12px 32px;background-color:transparent;color:#a0a0a0;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;border:1px solid rgba(255,255,255,0.2);">View &amp; Respond</a>
    </td>
  </tr>
  </table>
</td></tr>
</table>
</td></tr>` : ""}

${buildEmailFooterHtml()}

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ============================================================
// Nudge / Follow-up email
// ============================================================

interface NudgeEmailData {
  title: string;
  clientName: string;
  responseUrl: string;
  daysSinceSent: number;
}

export function buildNudgeEmailHtml(data: NudgeEmailData): string {
  const { title, clientName, responseUrl, daysSinceSent } = data;

  const timeContext =
    daysSinceSent <= 3
      ? "I wanted to make sure this didn't get lost in your inbox."
      : daysSinceSent <= 7
        ? "It's been a few days since we sent over our proposal, and I wanted to follow up."
        : "We sent over a proposal a little while ago, and I wanted to check in.";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background-color:#0A0A0F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0F;">
<tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">

<!-- Header -->
<tr><td style="padding:0 0 24px;">
  <h1 style="color:#00D4FF;font-size:24px;font-weight:700;margin:0;">BuiltByBas</h1>
</td></tr>

<!-- Body -->
<tr><td style="padding:0 0 24px;">
  <p style="color:#ffffff;font-size:18px;font-weight:600;margin:0 0 16px;">Hi ${escapeForEmail(clientName)},</p>
  <p style="color:#e0e0e0;font-size:16px;line-height:1.7;margin:0 0 16px;">
    ${timeContext}
  </p>
  <p style="color:#e0e0e0;font-size:16px;line-height:1.7;margin:0 0 16px;">
    Your proposal for <strong style="color:#ffffff;">${escapeForEmail(title)}</strong> is still open and ready for your review. No rush at all &mdash; just wanted to make sure you have everything you need to make a decision.
  </p>
  <p style="color:#e0e0e0;font-size:16px;line-height:1.7;margin:0 0 24px;">
    If you have any questions, or if anything in the proposal needs adjusting, I'm happy to chat.
  </p>
</td></tr>

<!-- CTA -->
<tr><td style="padding:0 0 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;">
<tr><td style="padding:24px;text-align:center;">
  <a href="${responseUrl}" style="display:inline-block;padding:14px 36px;background-color:#00D4FF;color:#0A0A0F;font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;">Review Proposal</a>
</td></tr>
</table>
</td></tr>

<!-- Sign-off -->
<tr><td style="padding:0 0 24px;">
  <p style="color:#e0e0e0;font-size:16px;line-height:1.7;margin:0;">
    Looking forward to hearing from you,<br/>
    <strong style="color:#ffffff;">Bas Rosario</strong>
  </p>
</td></tr>

${buildEmailFooterHtml()}

</table>
</td></tr>
</table>
</body>
</html>`;
}

function escapeForEmail(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ============================================================
// Professional email footer — used across all outgoing emails
// ============================================================

export function buildEmailFooterHtml(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://builtbybas.com";

  return `<!-- Professional Footer -->
<tr><td style="padding:32px 0 0;border-top:1px solid rgba(255,255,255,0.1);">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr><td>
    <p style="color:#a0a0a0;font-size:12px;line-height:1.5;margin:0 0 4px;">
      <em>Reviewed and approved by Bas Rosario</em>
    </p>
    <p style="color:#ffffff;font-size:13px;font-weight:600;margin:0 0 2px;">
      BuiltByBas
    </p>
    <p style="color:#a0a0a0;font-size:12px;line-height:1.5;margin:0 0 16px;">
      Custom Software &amp; Web Development<br/>
      California, United States<br/>
      <a href="${siteUrl}" style="color:#00D4FF;text-decoration:none;">builtbybas.com</a>
      &nbsp;&middot;&nbsp;
      <a href="mailto:bas@builtbybas.com" style="color:#00D4FF;text-decoration:none;">bas@builtbybas.com</a>
    </p>
  </td></tr>
  <tr><td style="padding:12px 0 0;border-top:1px solid rgba(255,255,255,0.06);">
    <p style="color:#555555;font-size:10px;line-height:1.6;margin:0;">
      <a href="${siteUrl}/privacy" style="color:#666666;text-decoration:none;">Privacy Policy</a>
      &nbsp;&middot;&nbsp;
      <a href="${siteUrl}/terms" style="color:#666666;text-decoration:none;">Terms of Service</a>
      &nbsp;&middot;&nbsp;
      <a href="${siteUrl}/refund" style="color:#666666;text-decoration:none;">Refund Policy</a>
      &nbsp;&middot;&nbsp;
      <a href="${siteUrl}/ai-policy" style="color:#666666;text-decoration:none;">Responsible AI</a>
    </p>
    <p style="color:#444444;font-size:10px;margin:8px 0 0;">
      &copy; ${new Date().getFullYear()} BuiltByBas. All rights reserved.
    </p>
  </td></tr>
  </table>
</td></tr>`;
}
