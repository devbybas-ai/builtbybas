import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { proposals, clients } from "@/lib/schema";
import { requireAdmin } from "@/lib/api-auth";
import { decrypt, hmacHash } from "@/lib/encryption";
import { resend, EMAIL_FROM, ADMIN_EMAIL } from "@/lib/email";
import { buildNudgeEmailHtml } from "@/lib/proposal-email";

const NUDGE_COOLDOWN_HOURS = 48;

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  if (!/^[a-f0-9-]+$/i.test(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid proposal ID" },
      { status: 400 }
    );
  }

  const [proposal] = await db
    .select({
      id: proposals.id,
      title: proposals.title,
      status: proposals.status,
      sentAt: proposals.sentAt,
      nudgedAt: proposals.nudgedAt,
      clientId: proposals.clientId,
      clientName: clients.name,
      clientEmail: clients.email,
    })
    .from(proposals)
    .leftJoin(clients, eq(proposals.clientId, clients.id))
    .where(eq(proposals.id, id))
    .limit(1);

  if (!proposal) {
    return NextResponse.json(
      { success: false, error: "Proposal not found" },
      { status: 404 }
    );
  }

  if (proposal.status !== "sent") {
    return NextResponse.json(
      { success: false, error: "Can only nudge proposals with status 'sent'" },
      { status: 400 }
    );
  }

  // Cooldown check — prevent spamming the client
  if (proposal.nudgedAt) {
    const hoursSinceNudge =
      (Date.now() - new Date(proposal.nudgedAt).getTime()) / (1000 * 60 * 60);
    if (hoursSinceNudge < NUDGE_COOLDOWN_HOURS) {
      const hoursLeft = Math.ceil(NUDGE_COOLDOWN_HOURS - hoursSinceNudge);
      return NextResponse.json(
        {
          success: false,
          error: `Please wait ${hoursLeft} more hour${hoursLeft !== 1 ? "s" : ""} before sending another follow-up.`,
        },
        { status: 429 }
      );
    }
  }

  if (!resend) {
    return NextResponse.json(
      {
        success: false,
        error: "Email service not configured. Set RESEND_API_KEY in .env.local.",
      },
      { status: 503 }
    );
  }

  if (!proposal.clientEmail) {
    return NextResponse.json(
      { success: false, error: "Client email not found" },
      { status: 400 }
    );
  }

  const recipientEmail = decrypt(proposal.clientEmail);
  const clientName = proposal.clientName
    ? decrypt(proposal.clientName)
    : "there";

  // Generate a fresh response token (invalidates the old one)
  const rawToken = randomBytes(32).toString("hex");
  const hashedToken = hmacHash(rawToken);
  const siteUrl = process.env.SITE_URL ?? "https://builtbybas.com";
  const responseUrl = `${siteUrl}/proposal/${rawToken}`;

  const daysSinceSent = proposal.sentAt
    ? Math.floor(
        (Date.now() - new Date(proposal.sentAt).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  const html = buildNudgeEmailHtml({
    title: proposal.title,
    clientName,
    responseUrl,
    daysSinceSent,
  });

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: recipientEmail,
      ...(ADMIN_EMAIL ? { bcc: ADMIN_EMAIL } : {}),
      subject: `Following up: ${proposal.title}`,
      html,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to send follow-up email" },
        { status: 500 }
      );
    }

    // Update token and nudge timestamp
    await db
      .update(proposals)
      .set({
        responseToken: hashedToken,
        nudgedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(proposals.id, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to send follow-up" },
      { status: 500 }
    );
  }
}
