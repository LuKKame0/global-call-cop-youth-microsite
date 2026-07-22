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
    const email = String(payload.email ?? "").trim();
    const organization = String(payload.organization).trim();
    const role = String(payload.role).trim();
    const country = String(payload.country).trim();
    const intent = String(payload.intent).trim();

    if (email) {
      const applicantHtml = emailShell({
        eyebrow: "Build the Future",
        title: "You entered the coordination layer",
        bodyHtml: `
          <p style="margin:0 0 16px;line-height:1.7;color:rgba(244,244,245,0.82);">
            Hello ${escapeHtml(name)}, your request to enter The Global Call coordination infrastructure has been received.
          </p>
          <div style="margin:18px 0;padding:16px;border-radius:14px;background:rgba(97,200,121,0.12);border:1px solid rgba(255,255,255,0.08);">
            ${fieldRow("Organization", organization)}
            ${fieldRow("Role", role)}
            ${fieldRow("Country", country)}
            ${fieldRow("Intent", intent)}
          </div>
          <p style="margin:0;line-height:1.7;color:rgba(244,244,245,0.72);">
            History does not wait for coordination. It rewards those who build it.
          </p>
        `,
      });

      await sendEmail({
        apiKey,
        from: senderEmail,
        to: email,
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
      bodyHtml: `
        <div style="margin:0;padding:16px;border-radius:14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);">
          ${fieldRow("Name", name)}
          ${fieldRow("Email", email || "Not provided")}
          ${fieldRow("Organization", organization)}
          ${fieldRow("Role", role)}
          ${fieldRow("Country", country)}
          ${fieldRow("Intent", intent)}
        </div>
      `,
    });

    await Promise.all(
      notifyEmails.map((recipient) =>
        sendEmail({
          apiKey,
          from: senderEmail,
          to: recipient,
          replyTo: email || undefined,
          subject: `[Build the Future] Coordination request — ${name} (${country})`,
          html: internalHtml,
          text: [
            "New coordination layer request",
            "",
            `Name: ${name}`,
            `Email: ${email || "Not provided"}`,
            `Organization: ${organization}`,
            `Role: ${role}`,
            `Country: ${country}`,
            `Intent: ${intent}`,
          ].join("\n"),
        }),
      ),
    );

    return res.status(200).json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to process coordination request.";
    return res.status(500).json({ ok: false, error: message });
  }
}
