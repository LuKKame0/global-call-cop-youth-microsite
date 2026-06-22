import { BRAND } from "@/lib/branding/tokens";
import { sendEmail, sendEmailToNotifyList } from "@/lib/email/client";
import { emailShell, escapeHtml, fieldRow } from "@/lib/email/templates/shell";
import type { ApplyFormPayload } from "@/lib/forms/marketing-schemas";

export async function sendApplyFormEmails(payload: ApplyFormPayload) {
  const { name, email, organization, role, country, intent } = payload;

  const applicantHtml = emailShell({
    eyebrow: BRAND.name,
    title: "Application received",
    accent: BRAND.colors.blue,
    bodyHtml: `
      <p style="margin:0 0 16px;line-height:1.7;color:rgba(16,16,20,0.72);">
        Hello ${escapeHtml(name)}, thank you for applying to join The Global Call coordination layer.
        Our team will review your profile and respond with next steps.
      </p>
      <div style="margin:18px 0;padding:16px;border-radius:14px;background:rgba(55,171,250,0.12);border:1px solid rgba(0,0,0,0.08);">
        ${fieldRow("Organization", organization)}
        ${fieldRow("Role", role)}
        ${fieldRow("Country", country)}
      </div>
      <p style="margin:0;line-height:1.7;color:rgba(16,16,20,0.64);">
        Your stated intent has been recorded. We build coordination infrastructure for the next generation — and your signal is now part of that pipeline.
      </p>
    `,
  });

  await sendEmail({
    to: email,
    subject: "Application received — The Global Call",
    html: applicantHtml,
    text: [
      `Hello ${name},`,
      "",
      "Thank you for applying to join The Global Call.",
      "",
      `Organization: ${organization}`,
      `Role: ${role}`,
      `Country: ${country}`,
      "",
      "Our team will review your application and follow up soon.",
    ].join("\n"),
  });

  const internalHtml = emailShell({
    eyebrow: "Internal notification",
    title: "New join application",
    accent: BRAND.colors.green,
    bodyHtml: `
      <div style="margin:0;padding:16px;border-radius:14px;background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.08);">
        ${fieldRow("Name", name)}
        ${fieldRow("Email", email)}
        ${fieldRow("Organization", organization)}
        ${fieldRow("Role", role)}
        ${fieldRow("Country", country)}
        <p style="margin:12px 0 0;line-height:1.7;white-space:pre-wrap;"><strong>Intent:</strong><br />${escapeHtml(
          intent,
        )}</p>
      </div>
    `,
  });

  await sendEmailToNotifyList({
    subject: `[The Global Call] Join application — ${name} (${country})`,
    html: internalHtml,
    text: [
      "New join application — The Global Call",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Organization: ${organization}`,
      `Role: ${role}`,
      `Country: ${country}`,
      "",
      "Intent:",
      intent,
    ].join("\n"),
    replyTo: email,
  });
}
