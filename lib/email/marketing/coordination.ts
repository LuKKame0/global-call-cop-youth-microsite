import { BRAND } from "@/lib/branding/tokens";
import { sendEmail, sendEmailToNotifyList } from "@/lib/email/client";
import { emailShell, escapeHtml, fieldRow } from "@/lib/email/templates/shell";
import type { CoordinationFormPayload } from "@/lib/forms/marketing-schemas";

export async function sendCoordinationFormEmails(payload: CoordinationFormPayload) {
  const { name, email, organization, role, country, intent } = payload;
  const normalizedEmail = email?.trim() ?? "";

  if (normalizedEmail) {
    const applicantHtml = emailShell({
      eyebrow: "Build the Future",
      title: "You entered the coordination layer",
      accent: BRAND.colors.green,
      bodyHtml: `
        <p style="margin:0 0 16px;line-height:1.7;color:rgba(16,16,20,0.72);">
          Hello ${escapeHtml(name)}, your request to enter The Global Call coordination infrastructure has been received.
        </p>
        <div style="margin:18px 0;padding:16px;border-radius:14px;background:rgba(97,200,121,0.12);border:1px solid rgba(0,0,0,0.08);">
          ${fieldRow("Organization", organization)}
          ${fieldRow("Role", role)}
          ${fieldRow("Country", country)}
          ${fieldRow("Intent", intent)}
        </div>
        <p style="margin:0;line-height:1.7;color:rgba(16,16,20,0.64);">
          History does not wait for coordination. It rewards those who build it.
        </p>
      `,
    });

    await sendEmail({
      to: normalizedEmail,
      subject: "Coordination layer access request received",
      html: applicantHtml,
      text: [
        `Hello ${name},`,
        "",
        "Your request to enter The Global Call coordination layer has been received.",
        "",
        `Organization: ${organization}`,
        `Role: ${role}`,
        `Country: ${country}`,
        `Intent: ${intent}`,
      ].join("\n"),
    });
  }

  const internalHtml = emailShell({
    eyebrow: "Build the Future",
    title: "New coordination layer request",
    accent: BRAND.colors.blue,
    bodyHtml: `
      <div style="margin:0;padding:16px;border-radius:14px;background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.08);">
        ${fieldRow("Name", name)}
        ${fieldRow("Email", normalizedEmail || "Not provided")}
        ${fieldRow("Organization", organization)}
        ${fieldRow("Role", role)}
        ${fieldRow("Country", country)}
        ${fieldRow("Intent", intent)}
      </div>
    `,
  });

  await sendEmailToNotifyList({
    subject: `[Build the Future] Coordination request — ${name} (${country})`,
    html: internalHtml,
    text: [
      "New coordination layer request",
      "",
      `Name: ${name}`,
      `Email: ${normalizedEmail || "Not provided"}`,
      `Organization: ${organization}`,
      `Role: ${role}`,
      `Country: ${country}`,
      `Intent: ${intent}`,
    ].join("\n"),
    replyTo: normalizedEmail || undefined,
  });
}
