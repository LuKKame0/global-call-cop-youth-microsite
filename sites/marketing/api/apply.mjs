import {
  emailShell,
  escapeHtml,
  fieldRow,
  getEmailConfig,
  readJsonBody,
  sendEmail,
  validateRequired,
} from "./_lib.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  try {
    const payload = readJsonBody(req);
    const missing = validateRequired(payload, [
      "name",
      "email",
      "organization",
      "role",
      "country",
      "intent",
    ]);

    if (missing.length) {
      return res.status(400).json({
        ok: false,
        error: `Missing required fields: ${missing.join(", ")}.`,
      });
    }

    const { apiKey, senderEmail, notifyEmails } = getEmailConfig();
    const name = String(payload.name).trim();
    const email = String(payload.email).trim();
    const organization = String(payload.organization).trim();
    const role = String(payload.role).trim();
    const country = String(payload.country).trim();
    const intent = String(payload.intent).trim();

    const applicantHtml = emailShell({
      eyebrow: "The Global Call",
      title: "Application received",
      bodyHtml: `
        <p style="margin:0 0 16px;line-height:1.7;color:rgba(244,244,245,0.82);">
          Hello ${escapeHtml(name)}, thank you for applying to join The Global Call coordination layer.
          Our team will review your profile and respond with next steps.
        </p>
        <div style="margin:18px 0;padding:16px;border-radius:14px;background:rgba(55,171,250,0.12);border:1px solid rgba(255,255,255,0.08);">
          ${fieldRow("Organization", organization)}
          ${fieldRow("Role", role)}
          ${fieldRow("Country", country)}
        </div>
        <p style="margin:0;line-height:1.7;color:rgba(244,244,245,0.72);">
          Your stated intent has been recorded. We build coordination infrastructure for the next generation — and your signal is now part of that pipeline.
        </p>
      `,
    });

    const applicantText = [
      `Hello ${name},`,
      "",
      "Thank you for applying to join The Global Call.",
      "",
      `Organization: ${organization}`,
      `Role: ${role}`,
      `Country: ${country}`,
      "",
      "Our team will review your application and follow up soon.",
    ].join("\n");

    await sendEmail({
      apiKey,
      from: senderEmail,
      to: email,
      subject: "Application received — The Global Call",
      html: applicantHtml,
      text: applicantText,
    });

    const internalHtml = emailShell({
      eyebrow: "Internal notification",
      title: "New join application",
      bodyHtml: `
        <div style="margin:0;padding:16px;border-radius:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">
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

    const internalText = [
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
    ].join("\n");

    await Promise.all(
      notifyEmails.map((recipient) =>
        sendEmail({
          apiKey,
          from: senderEmail,
          to: recipient,
          replyTo: email,
          subject: `[The Global Call] Join application — ${name} (${country})`,
          html: internalHtml,
          text: internalText,
        }),
      ),
    );

    return res.status(200).json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to process application.";
    return res.status(500).json({ ok: false, error: message });
  }
}
