import "server-only";

import type { DeliverEmailInput } from "@/lib/email/transport";
import { getEmailConfig } from "@/lib/email/config";

function getMailgunApiHost(region: "US" | "EU") {
  return region === "EU" ? "api.eu.mailgun.net" : "api.mailgun.net";
}

function formatRecipients(to: string | string[]) {
  return Array.isArray(to) ? to.join(",") : to;
}

export async function deliverViaMailgun(input: DeliverEmailInput) {
  const config = getEmailConfig();
  if (config.transport !== "mailgun") {
    throw new Error("Mailgun is not configured");
  }

  const { mailgunApiKey, mailgunRegion, senderEmail } = config;

  const domain = senderEmail.split("@")[1]?.trim();
  if (!domain) {
    throw new Error("SENDER_EMAIL must include a domain for Mailgun delivery.");
  }

  const form = new FormData();
  form.append("from", input.from);
  form.append("to", formatRecipients(input.to));
  form.append("subject", input.subject);
  form.append("html", input.html);
  form.append("text", input.text);
  if (input.replyTo) {
    form.append("h:Reply-To", input.replyTo);
  }

  const response = await fetch(
    `https://${getMailgunApiHost(mailgunRegion)}/v3/${domain}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString("base64")}`,
      },
      body: form,
    },
  );

  if (!response.ok) {
    throw new Error(`Mailgun error: ${await response.text()}`);
  }
}
