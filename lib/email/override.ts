import "server-only";

import { sanitizeEnv } from "@/lib/env/sanitize";

export function getEmailOverrideTo() {
  return sanitizeEnv(process.env.EMAIL_OVERRIDE_TO)?.toLowerCase();
}

export function isEmailOverrideActive() {
  return Boolean(getEmailOverrideTo());
}

export function applyEmailRecipientOverride<T extends {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}>(input: T): T {
  const overrideTo = getEmailOverrideTo();
  if (!overrideTo) {
    return input;
  }

  const originalTo = Array.isArray(input.to) ? input.to.join(", ") : input.to;
  if (originalTo.toLowerCase() === overrideTo) {
    return input;
  }

  const subject = input.subject.includes("[→")
    ? input.subject
    : `[→ ${originalTo}] ${input.subject}`;

  const bannerHtml = `<p style="margin:0 0 16px;padding:12px 14px;border-radius:10px;background:rgba(255,70,13,0.12);border:1px solid rgba(255,70,13,0.25);font-size:13px;line-height:1.6;color:#101014;"><strong>Dev redirect:</strong> original recipient was <code>${originalTo}</code></p>`;

  const bannerText = `[Dev redirect — original recipient: ${originalTo}]\n\n`;

  return {
    ...input,
    to: overrideTo,
    subject,
    html: bannerHtml + input.html,
    text: bannerText + input.text,
  };
}
