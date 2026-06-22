import "server-only";

import { parseNotifyEmails } from "@/lib/env/admin-emails";
import { sanitizeEnv } from "@/lib/env/sanitize";
import { BRAND } from "@/lib/branding/tokens";

export type EmailTransportMode = "smtp" | "mailgun" | "resend";

export type EmailConfig =
  | {
      transport: "smtp";
      senderEmail: string;
      from: string;
      smtp: {
        host: string;
        port: number;
        secure: boolean;
        auth: { user: string; pass: string };
      };
      notifyEmails: string[];
    }
  | {
      transport: "mailgun";
      senderEmail: string;
      from: string;
      mailgunApiKey: string;
      mailgunRegion: "US" | "EU";
      notifyEmails: string[];
    }
  | {
      transport: "resend";
      senderEmail: string;
      from: string;
      apiKey: string;
      notifyEmails: string[];
    };


function resolveTransportMode(): EmailTransportMode | null {
  if (sanitizeEnv(process.env.SMTP_HOST)) {
    return "smtp";
  }
  if (sanitizeEnv(process.env.MAILGUN_API_KEY)) {
    return "mailgun";
  }
  if (sanitizeEnv(process.env.EMAIL_API_KEY)) {
    return "resend";
  }
  return null;
}

export function isEmailTransportConfigured() {
  return Boolean(resolveTransportMode() && sanitizeEnv(process.env.SENDER_EMAIL));
}

function getSmtpConfig() {
  const host = sanitizeEnv(process.env.SMTP_HOST);
  const user = sanitizeEnv(process.env.SMTP_USER);
  const pass = sanitizeEnv(process.env.SMTP_PASSWORD);
  const port = Number(sanitizeEnv(process.env.SMTP_PORT) ?? "587");
  const secure =
    sanitizeEnv(process.env.SMTP_SECURE)?.toLowerCase() === "true" || port === 465;

  if (!host || !user || !pass) {
    throw new Error("SMTP requires SMTP_HOST, SMTP_USER, and SMTP_PASSWORD.");
  }

  return {
    host,
    port,
    secure,
    auth: { user, pass },
  };
}

function resolveMailgunRegion(): "US" | "EU" {
  return sanitizeEnv(process.env.MAILGUN_REGION)?.toUpperCase() === "EU" ? "EU" : "US";
}

export function getEmailConfig(): EmailConfig {
  const senderEmail = sanitizeEnv(process.env.SENDER_EMAIL);
  const resolvedNotifyEmails = parseNotifyEmails(
    process.env.INTERNAL_NOTIFY_EMAILS,
    process.env.LANDING_NOTIFY_EMAILS,
  );

  if (!senderEmail) {
    throw new Error("SENDER_EMAIL is required.");
  }

  const from = `${BRAND.name} <${senderEmail}>`;
  const transport = resolveTransportMode();

  if (!transport) {
    throw new Error(
      "Email is not configured. Set SMTP_*, MAILGUN_API_KEY, or EMAIL_API_KEY, plus SENDER_EMAIL.",
    );
  }

  if (transport === "smtp") {
    return {
      transport,
      senderEmail,
      from,
      smtp: getSmtpConfig(),
      notifyEmails: resolvedNotifyEmails,
    };
  }

  if (transport === "mailgun") {
    const mailgunApiKey = sanitizeEnv(process.env.MAILGUN_API_KEY);
    if (!mailgunApiKey) {
      throw new Error("MAILGUN_API_KEY is required when Mailgun is selected.");
    }

    return {
      transport,
      senderEmail,
      from,
      mailgunApiKey,
      mailgunRegion: resolveMailgunRegion(),
      notifyEmails: resolvedNotifyEmails,
    };
  }

  const apiKey = sanitizeEnv(process.env.EMAIL_API_KEY);
  if (!apiKey) {
    throw new Error("EMAIL_API_KEY is required when Resend is selected.");
  }

  return {
    transport,
    senderEmail,
    from,
    apiKey,
    notifyEmails: resolvedNotifyEmails,
  };
}

export function getMagicLinkProviderId(): "nodemailer" | "mailgun" | "resend" | null {
  const mode = resolveTransportMode();
  if (mode === "smtp") return "nodemailer";
  if (mode === "mailgun") return "mailgun";
  if (mode === "resend") return "resend";
  return null;
}
