import "server-only";

import { createTransport, type Transporter } from "nodemailer";
import { Resend } from "resend";

import { getEmailConfig, type EmailTransportMode } from "@/lib/email/config";
import { applyEmailRecipientOverride } from "@/lib/email/override";
import { deliverViaMailgun } from "@/lib/email/mailgun";

export type DeliverEmailInput = {
  to: string | string[];
  from: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
};

let smtpTransport: Transporter | null = null;

function getSmtpTransport() {
  if (!smtpTransport) {
    const config = getEmailConfig();
    if (config.transport !== "smtp") {
      throw new Error("SMTP is not configured");
    }
    smtpTransport = createTransport(config.smtp);
  }
  return smtpTransport;
}

async function deliverViaSmtp(input: DeliverEmailInput) {
  const transport = getSmtpTransport();
  const result = await transport.sendMail({
    from: input.from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });

  const failed = [...(result.rejected ?? []), ...(result.pending ?? [])].filter(Boolean);
  if (failed.length > 0) {
    throw new Error(`SMTP rejected recipients: ${failed.join(", ")}`);
  }
}

async function deliverViaResend(input: DeliverEmailInput) {
  const config = getEmailConfig();
  if (config.transport !== "resend") {
    throw new Error("Resend is not configured");
  }

  const resend = new Resend(config.apiKey);
  const response = await resend.emails.send({
    from: input.from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
    tags: input.tags,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }
}

export function getEmailTransportMode(): EmailTransportMode {
  return getEmailConfig().transport;
}

export async function deliverEmail(input: DeliverEmailInput) {
  const routed = applyEmailRecipientOverride(input);
  const mode = getEmailTransportMode();
  if (mode === "smtp") {
    await deliverViaSmtp(routed);
    return;
  }
  if (mode === "mailgun") {
    await deliverViaMailgun(routed);
    return;
  }
  await deliverViaResend(routed);
}
