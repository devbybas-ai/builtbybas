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

<!-- Footer -->
<tr><td style="padding:24px 0 0;border-top:1px solid rgba(255,255,255,0.1);">
  <p style="color:#a0a0a0;font-size:12px;line-height:1.5;margin:0 0 8px;">
    <em>Reviewed and approved by Bas Rosario</em>
  </p>
  <p style="color:#666666;font-size:11px;margin:0;">
    BuiltByBas &mdash; Custom Software &amp; Web Development<br/>
    <a href="https://builtbybas.com" style="color:#00D4FF;text-decoration:none;">builtbybas.com</a>
  </p>
</td></tr>

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
