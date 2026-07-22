export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseNotifyEmails(raw) {
  if (!raw?.trim()) return [];

  return raw
    .split(/[,;]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function getEmailConfig() {
  const apiKey = process.env.EMAIL_API_KEY?.trim();
  const senderEmail = process.env.SENDER_EMAIL?.trim();
  const notifyEmails = parseNotifyEmails(
    process.env.LANDING_NOTIFY_EMAILS?.trim() ||
      process.env.INTERNAL_NOTIFY_EMAILS?.trim(),
  );

  if (!apiKey || !senderEmail) {
    throw new Error(
      "Email integration is not configured. Set EMAIL_API_KEY and SENDER_EMAIL.",
    );
  }

  return { apiKey, senderEmail, notifyEmails };
}

export async function sendEmail({ apiKey, from, to, subject, html, text, replyTo }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      reply_to: replyTo,
    }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      body?.message || body?.error || `Resend request failed (${response.status}).`;
    throw new Error(message);
  }

  return body;
}

export function readJsonBody(req) {
  if (typeof req.body === "string") {
    return JSON.parse(req.body);
  }

  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  return null;
}

export function emailShell({ eyebrow, title, bodyHtml }) {
  return `
    <div style="font-family: Inter, Arial, sans-serif; background:#050505; color:#f4f4f5; padding:24px;">
      <div style="max-width:640px;margin:0 auto;background:#101010;border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:28px;">
        <p style="margin:0 0 12px;color:rgba(244,244,245,0.45);font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">${escapeHtml(
          eyebrow,
        )}</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.15;">${escapeHtml(title)}</h1>
        ${bodyHtml}
      </div>
    </div>
  `;
}

export function fieldRow(label, value) {
  return `<p style="margin:0 0 10px;line-height:1.6;"><strong>${escapeHtml(
    label,
  )}:</strong> ${escapeHtml(value || "—")}</p>`;
}

export function validateRequired(payload, fields) {
  const missing = fields.filter((field) => !String(payload[field] ?? "").trim());
  return missing;
}
