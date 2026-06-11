import { BRAND } from "@/lib/branding/tokens";
import { sendEmail, sendEmailToNotifyList } from "@/lib/email/client";
import { emailShell, escapeHtml, fieldRow } from "@/lib/email/templates/shell";
import type { PartnerFormPayload } from "@/lib/forms/marketing-schemas";

export async function sendPartnerFormEmails(payload: PartnerFormPayload) {
  const { name, email, organization, partnershipType, message } = payload;

  const applicantHtml = emailShell({
    eyebrow: `${BRAND.name} — Partnerships`,
    title: "Partnership inquiry received",
    accent: BRAND.colors.orange,
    bodyHtml: `
      <p style="margin:0 0 16px;line-height:1.7;color:rgba(16,16,20,0.72);">
        Hello ${escapeHtml(name)}, thank you for reaching out to partner with The Global Call.
        Our alliances team will review your inquiry and coordinate the next conversation.
      </p>
      <div style="margin:18px 0;padding:16px;border-radius:14px;background:rgba(255,70,13,0.1);border:1px solid rgba(0,0,0,0.08);">
        ${fieldRow("Organization", organization)}
        ${fieldRow("Partnership type", partnershipType)}
      </div>
      <p style="margin:0;line-height:1.7;color:rgba(16,16,20,0.64);white-space:pre-wrap;">${escapeHtml(
        message,
      )}</p>
    `,
  });

  await sendEmail({
    to: email,
    subject: "Partnership inquiry received — The Global Call",
    html: applicantHtml,
    text: [
      `Hello ${name},`,
      "",
      "Thank you for your partnership inquiry with The Global Call.",
      "",
      `Organization: ${organization}`,
      `Partnership type: ${partnershipType}`,
      "",
      message,
    ].join("\n"),
  });

  const internalHtml = emailShell({
    eyebrow: "Internal notification",
    title: "New partnership inquiry",
    accent: BRAND.colors.orange,
    bodyHtml: `
      <div style="margin:0;padding:16px;border-radius:14px;background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.08);">
        ${fieldRow("Name", name)}
        ${fieldRow("Email", email)}
        ${fieldRow("Organization", organization)}
        ${fieldRow("Partnership type", partnershipType)}
        <p style="margin:12px 0 0;line-height:1.7;white-space:pre-wrap;"><strong>Message:</strong><br />${escapeHtml(
          message,
        )}</p>
      </div>
    `,
  });

  await sendEmailToNotifyList({
    subject: `[The Global Call] Partnership inquiry — ${organization}`,
    html: internalHtml,
    text: [
      "New partnership inquiry",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Organization: ${organization}`,
      `Partnership type: ${partnershipType}`,
      "",
      message,
    ].join("\n"),
    replyTo: email,
  });
}
