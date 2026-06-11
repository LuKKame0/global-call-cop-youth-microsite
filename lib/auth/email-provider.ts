import "server-only";

import Mailgun from "next-auth/providers/mailgun";
import Nodemailer from "next-auth/providers/nodemailer";
import Resend from "next-auth/providers/resend";

import { sendMagicLinkEmail } from "@/lib/auth/send-magic-link-email";
import { BRAND } from "@/lib/branding/tokens";
import { getMagicLinkProviderId } from "@/lib/email/config";
import { sanitizeEnv } from "@/lib/env/sanitize";

function buildFromAddress() {
  const sender = sanitizeEnv(process.env.SENDER_EMAIL) ?? "onboarding@resend.dev";
  return `${BRAND.name} <${sender}>`;
}

async function sendVerificationRequest({
  identifier,
  url,
  provider,
}: {
  identifier: string;
  url: string;
  provider: { from?: string };
}) {
  await sendMagicLinkEmail({
    email: identifier,
    url,
    from: provider.from,
  });
}

export function createMagicLinkProvider() {
  const from = buildFromAddress();
  const senderEmail = sanitizeEnv(process.env.SENDER_EMAIL) ?? "onboarding@resend.dev";
  const smtpHost = sanitizeEnv(process.env.SMTP_HOST);
  const mailgunApiKey = sanitizeEnv(process.env.MAILGUN_API_KEY);

  if (smtpHost) {
    const port = Number(sanitizeEnv(process.env.SMTP_PORT) ?? "587");
    return Nodemailer({
      server: {
        host: smtpHost,
        port,
        secure:
          sanitizeEnv(process.env.SMTP_SECURE)?.toLowerCase() === "true" ||
          port === 465,
        auth: {
          user: sanitizeEnv(process.env.SMTP_USER) ?? "",
          pass: sanitizeEnv(process.env.SMTP_PASSWORD) ?? "",
        },
      },
      from,
      sendVerificationRequest,
    });
  }

  if (mailgunApiKey) {
    return Mailgun({
      apiKey: mailgunApiKey,
      from: senderEmail,
      region: sanitizeEnv(process.env.MAILGUN_REGION)?.toUpperCase() === "EU" ? "EU" : "US",
      sendVerificationRequest,
    });
  }

  return Resend({
    apiKey: sanitizeEnv(process.env.EMAIL_API_KEY) ?? "",
    from,
    sendVerificationRequest,
  });
}

export { getMagicLinkProviderId };
