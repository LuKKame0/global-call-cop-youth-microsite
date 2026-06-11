import "server-only";

import { deliverEmail } from "@/lib/email/transport";
import { buildSignInEmail } from "@/lib/email/templates/sign-in";
import { getEmailConfig } from "@/lib/email/config";

type SendMagicLinkInput = {
  email: string;
  url: string;
  from?: string;
};

export async function sendMagicLinkEmail({ email, url, from }: SendMagicLinkInput) {
  const { from: defaultFrom } = getEmailConfig();
  const { subject, html, text } = buildSignInEmail({
    signInUrl: url,
    recipientEmail: email,
  });

  await deliverEmail({
    to: email,
    from: from ?? defaultFrom,
    subject,
    html,
    text,
  });
}
