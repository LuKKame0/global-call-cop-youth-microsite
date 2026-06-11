import "server-only";

import { sendEmailIndividually } from "@/lib/email/client";
import { buildAdminSignInAlertEmail } from "@/lib/notifications/sign-in-alerts/template";
import type {
  SignInAlertDeliveryReport,
  SignInAlertDispatcher,
  SignInAlertEvent,
} from "@/lib/notifications/types";

export class DirectSignInAlertDispatcher implements SignInAlertDispatcher {
  constructor(private readonly recipients: string[]) {}

  async dispatch(event: SignInAlertEvent): Promise<SignInAlertDeliveryReport> {
    const message = buildAdminSignInAlertEmail(event);

    const results = await sendEmailIndividually({
      recipients: this.recipients,
      subject: message.subject,
      html: message.html,
      text: message.text,
      tags: [
        { name: "category", value: "sign_in_alert" },
        { name: "provider", value: event.auth.provider },
      ],
    });

    const delivered = results.filter((result) => result.ok).length;

    return {
      eventId: event.eventId,
      attempted: results.length,
      delivered,
      failed: results.length - delivered,
      results,
    };
  }
}
