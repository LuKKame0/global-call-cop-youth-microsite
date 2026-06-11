import type {
  SignInAlertDeliveryReport,
  SignInAlertDispatcher,
  SignInAlertEvent,
} from "@/lib/notifications/types";

/**
 * Placeholder for a future queue-backed dispatcher (Supabase pgmq, Vercel Queues, Inngest, etc.).
 * Producers should emit `SignInAlertEvent` JSON and let workers call `DirectSignInAlertDispatcher`.
 */
export class QueuedSignInAlertDispatcher implements SignInAlertDispatcher {
  async dispatch(event: SignInAlertEvent): Promise<SignInAlertDeliveryReport> {
    throw new Error(
      `Queued sign-in alert dispatch is not configured yet (eventId=${event.eventId}).`,
    );
  }
}
