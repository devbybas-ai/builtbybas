import { buildEmailFooterHtml } from "./proposal-email";

// ============================================================
// Helpers
// ============================================================

function escapeForEmail(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatCentsForEmail(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDateForEmail(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// ============================================================
// Function 1: Invoice email (client-facing)
// ============================================================

interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
}

interface InvoiceEmailData {
  invoiceNumber: string;
  clientName: string;
  projectName: string;
  milestoneType: string;
  amountCents: number;
  dueDate: Date;
  lineItems: InvoiceLineItem[];
  invoiceUrl: string;
  paymentInstructions?: string;
}

export function buildInvoiceEmailHtml(data: InvoiceEmailData): string {
  const {
    invoiceNumber,
    clientName,
    projectName,
    milestoneType,
    amountCents,
    dueDate,
    lineItems,
    invoiceUrl,
    paymentInstructions,
  } = data;

  const issueDate = formatDateForEmail(new Date());
  const dueDateDisplay = formatDateForEmail(dueDate);
  const totalDisplay = formatCentsForEmail(amountCents);

  const lineItemRows = lineItems
    .map(
      (item) => `
<tr>
  <td style="color:#e0e0e0;font-size:14px;padding:10px 8px;border-bottom:1px solid rgba(255,255,255,0.06);">${escapeForEmail(item.description)}</td>
  <td style="color:#a0a0a0;font-size:14px;padding:10px 8px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">${item.quantity}</td>
  <td style="color:#a0a0a0;font-size:14px;padding:10px 8px;text-align:right;border-bottom:1px solid rgba(255,255,255,0.06);">${formatCentsForEmail(item.unitPriceCents)}</td>
  <td style="color:#ffffff;font-size:14px;font-weight:600;padding:10px 8px;text-align:right;border-bottom:1px solid rgba(255,255,255,0.06);">${formatCentsForEmail(item.totalCents)}</td>
</tr>`,
    )
    .join("");

  const paymentSection = paymentInstructions
    ? escapeForEmail(paymentInstructions)
    : "Please contact us for payment details.";

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
  <p style="color:#e0e0e0;font-size:16px;line-height:1.6;margin:0;">
    Here is your ${escapeForEmail(milestoneType)} invoice for ${escapeForEmail(projectName)}.
  </p>
</td></tr>

<!-- Invoice Details Card -->
<tr><td style="padding:0 0 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;">
<tr><td style="padding:24px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding:0 24px 0 0;">
      <span style="color:#a0a0a0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Invoice Number</span><br/>
      <span style="color:#ffffff;font-size:16px;font-weight:600;">${escapeForEmail(invoiceNumber)}</span>
    </td>
    <td style="padding:0 24px 0 0;">
      <span style="color:#a0a0a0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Issue Date</span><br/>
      <span style="color:#ffffff;font-size:16px;font-weight:600;">${issueDate}</span>
    </td>
    <td style="padding:0;">
      <span style="color:#a0a0a0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Due Date</span><br/>
      <span style="color:#00D4FF;font-size:16px;font-weight:600;">${dueDateDisplay}</span>
    </td>
  </tr>
  </table>
</td></tr>
</table>
</td></tr>

<!-- Line Items Table -->
<tr><td style="padding:0 0 8px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
<tr><td style="padding:24px 24px 0;">
  <!-- Table Header -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <th style="color:#a0a0a0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;text-align:left;padding:0 8px 10px 8px;border-bottom:1px solid rgba(255,255,255,0.12);">Description</th>
    <th style="color:#a0a0a0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;text-align:center;padding:0 8px 10px;border-bottom:1px solid rgba(255,255,255,0.12);">Qty</th>
    <th style="color:#a0a0a0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;text-align:right;padding:0 8px 10px;border-bottom:1px solid rgba(255,255,255,0.12);">Unit Price</th>
    <th style="color:#a0a0a0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;text-align:right;padding:0 8px 10px;border-bottom:1px solid rgba(255,255,255,0.12);">Total</th>
  </tr>
  ${lineItemRows}
  </table>
</td></tr>
<!-- Total Row -->
<tr><td style="padding:0 24px 24px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding:16px 8px 0;"></td>
    <td style="padding:16px 8px 0;"></td>
    <td style="padding:16px 8px 0;text-align:right;">
      <span style="color:#a0a0a0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Total Due</span>
    </td>
    <td style="padding:16px 8px 0;text-align:right;">
      <span style="color:#00D4FF;font-size:20px;font-weight:700;">${totalDisplay}</span>
    </td>
  </tr>
  </table>
</td></tr>
</table>
</td></tr>

<!-- Payment Instructions -->
<tr><td style="padding:16px 0 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;">
<tr><td style="padding:20px 24px;">
  <p style="color:#a0a0a0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Payment Instructions</p>
  <p style="color:#e0e0e0;font-size:14px;line-height:1.6;margin:0;">${paymentSection}</p>
</td></tr>
</table>
</td></tr>

<!-- CTA -->
<tr><td style="padding:0 0 32px;text-align:center;">
  <a href="${invoiceUrl}" style="display:inline-block;padding:14px 36px;background-color:#00D4FF;color:#0A0A0F;font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;">View Invoice</a>
</td></tr>

${buildEmailFooterHtml()}

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ============================================================
// Function 2: Payment reminder (client-facing)
// ============================================================

interface PaymentReminderData {
  invoiceNumber: string;
  clientName: string;
  projectName: string;
  amountCents: number;
  dueDate: Date;
  daysUntilDue: number;
  invoiceUrl: string;
}

export function buildPaymentReminderHtml(data: PaymentReminderData): string {
  const {
    invoiceNumber,
    clientName,
    projectName,
    amountCents,
    dueDate,
    daysUntilDue,
    invoiceUrl,
  } = data;

  const dueDateDisplay = formatDateForEmail(dueDate);
  const amountDisplay = formatCentsForEmail(amountCents);

  const dayWord = daysUntilDue === 1 ? "day" : "days";

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
  <p style="color:#ffffff;font-size:18px;font-weight:600;margin:0 0 12px;">Hi ${escapeForEmail(clientName)},</p>
  <p style="color:#e0e0e0;font-size:16px;line-height:1.6;margin:0;">
    This is a friendly reminder that invoice <strong style="color:#ffffff;">${escapeForEmail(invoiceNumber)}</strong> for
    <strong style="color:#ffffff;">${escapeForEmail(projectName)}</strong> is due in
    <strong style="color:#ffffff;">${daysUntilDue} ${dayWord}</strong> (${dueDateDisplay}).
  </p>
</td></tr>

<!-- Amount Display -->
<tr><td style="padding:0 0 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;">
<tr><td style="padding:28px 24px;text-align:center;">
  <p style="color:#a0a0a0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Amount Due</p>
  <p style="color:#00D4FF;font-size:36px;font-weight:700;margin:0;">${amountDisplay}</p>
  <p style="color:#a0a0a0;font-size:13px;margin:8px 0 0;">Due ${dueDateDisplay}</p>
</td></tr>
</table>
</td></tr>

<!-- CTA -->
<tr><td style="padding:0 0 24px;text-align:center;">
  <a href="${invoiceUrl}" style="display:inline-block;padding:14px 36px;background-color:#00D4FF;color:#0A0A0F;font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;">View Invoice</a>
</td></tr>

<!-- Disregard note -->
<tr><td style="padding:0 0 32px;">
  <p style="color:#a0a0a0;font-size:14px;line-height:1.6;margin:0;text-align:center;">
    If you've already sent payment, please disregard this message.
  </p>
</td></tr>

${buildEmailFooterHtml()}

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ============================================================
// Function 3: Milestone alert (admin-facing)
// ============================================================

interface MilestoneAlertData {
  alertType: "upcoming" | "overdue" | "draft_created";
  projectName: string;
  clientName: string;
  milestoneType: string;
  amountCents: number;
  date: Date;
  daysAway?: number;
  invoiceNumber?: string;
}

export function buildMilestoneAlertHtml(data: MilestoneAlertData): string {
  const {
    alertType,
    projectName,
    clientName,
    milestoneType,
    amountCents,
    date,
    daysAway,
    invoiceNumber,
  } = data;

  const dateDisplay = formatDateForEmail(date);
  const amountDisplay = formatCentsForEmail(amountCents);

  let subjectLine: string;
  let actionSuggestion: string;

  if (alertType === "upcoming") {
    subjectLine = `Milestone approaching for ${escapeForEmail(projectName)}`;
    actionSuggestion = "Schedule a client meeting to review progress.";
  } else if (alertType === "overdue") {
    const invNum = invoiceNumber ? escapeForEmail(invoiceNumber) : "Invoice";
    subjectLine = `${invNum} is overdue for ${escapeForEmail(clientName)}`;
    actionSuggestion = `Follow up with ${escapeForEmail(clientName)} regarding payment.`;
  } else {
    subjectLine = `Invoice draft created for ${escapeForEmail(projectName)}`;
    actionSuggestion = "Review the draft invoice and send when ready.";
  }

  const alertAccentColor =
    alertType === "overdue"
      ? "#FF6B6B"
      : alertType === "upcoming"
        ? "#FFA500"
        : "#00D4FF";

  const daysAwayRow =
    daysAway !== undefined
      ? `
<tr>
  <td style="color:#a0a0a0;font-size:14px;padding:8px 0;">Days Away</td>
  <td style="color:#ffffff;font-size:14px;font-weight:600;padding:8px 0 8px 16px;">${daysAway} ${daysAway === 1 ? "day" : "days"}</td>
</tr>`
      : "";

  const invoiceNumberRow =
    invoiceNumber
      ? `
<tr>
  <td style="color:#a0a0a0;font-size:14px;padding:8px 0;">Invoice Number</td>
  <td style="color:#ffffff;font-size:14px;font-weight:600;padding:8px 0 8px 16px;">${escapeForEmail(invoiceNumber)}</td>
</tr>`
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
  <p style="color:#a0a0a0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;margin:4px 0 0;">Admin Alert</p>
</td></tr>

<!-- Subject Line -->
<tr><td style="padding:0 0 24px;">
  <h2 style="color:${alertAccentColor};font-size:20px;font-weight:700;margin:0 0 8px;">${subjectLine}</h2>
</td></tr>

<!-- Details Card -->
<tr><td style="padding:0 0 24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;">
<tr><td style="padding:24px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="color:#a0a0a0;font-size:14px;padding:8px 0;">Project</td>
    <td style="color:#ffffff;font-size:14px;font-weight:600;padding:8px 0 8px 16px;">${escapeForEmail(projectName)}</td>
  </tr>
  <tr>
    <td style="color:#a0a0a0;font-size:14px;padding:8px 0;">Client</td>
    <td style="color:#ffffff;font-size:14px;font-weight:600;padding:8px 0 8px 16px;">${escapeForEmail(clientName)}</td>
  </tr>
  <tr>
    <td style="color:#a0a0a0;font-size:14px;padding:8px 0;">Milestone</td>
    <td style="color:#ffffff;font-size:14px;font-weight:600;padding:8px 0 8px 16px;">${escapeForEmail(milestoneType)}</td>
  </tr>
  <tr>
    <td style="color:#a0a0a0;font-size:14px;padding:8px 0;">Amount</td>
    <td style="color:${alertAccentColor};font-size:16px;font-weight:700;padding:8px 0 8px 16px;">${amountDisplay}</td>
  </tr>
  <tr>
    <td style="color:#a0a0a0;font-size:14px;padding:8px 0;">Date</td>
    <td style="color:#ffffff;font-size:14px;font-weight:600;padding:8px 0 8px 16px;">${dateDisplay}</td>
  </tr>
  ${daysAwayRow}
  ${invoiceNumberRow}
  </table>
</td></tr>
</table>
</td></tr>

<!-- Suggested Action -->
<tr><td style="padding:0 0 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
<tr><td style="padding:20px 24px;">
  <p style="color:#a0a0a0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">Suggested Action</p>
  <p style="color:#e0e0e0;font-size:15px;line-height:1.6;margin:0;">${actionSuggestion}</p>
</td></tr>
</table>
</td></tr>

${buildEmailFooterHtml()}

</table>
</td></tr>
</table>
</body>
</html>`;
}
