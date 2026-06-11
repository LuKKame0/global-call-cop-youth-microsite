import "server-only";

import { getEmailConfig } from "@/lib/email/config";
import { deliverEmail, type DeliverEmailInput } from "@/lib/email/transport";

export type SendEmailInput = Omit<DeliverEmailInput, "from"> & {
  from?: string;
};

export type IndividualEmailSendResult = {
  recipient: string;
  ok: boolean;
  error?: string;
};

export async function sendEmail(input: SendEmailInput) {
  const { from } = getEmailConfig();
  await deliverEmail({
    ...input,
    from: input.from ?? from,
  });
}

function normalizeRecipients(recipients: string[]) {
  return [...new Set(recipients.map((entry) => entry.trim().toLowerCase()).filter(Boolean))];
}

export async function sendEmailIndividually(
  input: Omit<SendEmailInput, "to"> & {
    recipients: string[];
    tags?: DeliverEmailInput["tags"];
  },
): Promise<IndividualEmailSendResult[]> {
  const recipients = normalizeRecipients(input.recipients);

  if (recipients.length === 0) {
    return [];
  }

  const { from } = getEmailConfig();
  const resolvedFrom = input.from ?? from;

  const results = await Promise.all(
    recipients.map(async (recipient): Promise<IndividualEmailSendResult> => {
      try {
        await deliverEmail({
          from: resolvedFrom,
          to: recipient,
          subject: input.subject,
          html: input.html,
          text: input.text,
          replyTo: input.replyTo,
          tags: input.tags,
        });

        return { recipient, ok: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown delivery error";
        console.error("[email] individual delivery failed", {
          recipient,
          error: message,
        });
        return { recipient, ok: false, error: message };
      }
    }),
  );

  console.info("[email] individual notifications attempted", {
    attempted: results.length,
    delivered: results.filter((result) => result.ok).length,
  });

  return results;
}

export async function sendEmailToNotifyList(
  input: Omit<SendEmailInput, "to"> & { notifyEmails?: string[] },
) {
  const { notifyEmails } = getEmailConfig();
  const recipients = input.notifyEmails ?? notifyEmails;

  if (recipients.length === 0) {
    console.warn("[email] no notify recipients configured, skipping send");
    return;
  }

  await sendEmail({ ...input, to: recipients });

  console.info("[email] notification sent to recipients", {
    count: recipients.length,
    recipients,
  });
}
