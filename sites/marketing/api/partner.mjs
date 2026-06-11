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
      "partnershipType",
      "message",
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
    const partnershipType = String(payload.partnershipType).trim();
    const message = String(payload.message).trim();

    const applicantHtml = emailShell({
      eyebrow: "The Global Call — Partnerships",
      title: "Partnership inquiry received",
      bodyHtml: `
        <p style="margin:0 0 16px;line-height:1.7;color:rgba(244,244,245,0.82);">
          Hello ${escapeHtml(name)}, thank you for reaching out to partner with The Global Call.
          Our alliances team will review your inquiry and coordinate the next conversation.
        </p>
        <div style="margin:18px 0;padding:16px;border-radius:14px;background:rgba(255,70,13,0.12);border:1px solid rgba(255,255,255,0.08);">
          ${fieldRow("Organization", organization)}
          ${fieldRow("Partnership type", partnershipType)}
        </div>
        <p style="margin:0;line-height:1.7;color:rgba(244,244,245,0.72);white-space:pre-wrap;">${escapeHtml(
          message,
        )}</p>
      `,
    });

    await sendEmail({
      apiKey,
      from: senderEmail,
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
      bodyHtml: `
        <div style="margin:0;padding:16px;border-radius:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">
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

    await Promise.all(
      notifyEmails.map((recipient) =>
        sendEmail({
          apiKey,
          from: senderEmail,
          to: recipient,
          replyTo: email,
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
        }),
      ),
    );

    return res.status(200).json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to process partnership inquiry.";
    return res.status(500).json({ ok: false, error: message });
  }
}
