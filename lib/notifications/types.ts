export type SignInProvider =
  | "access_code"
  | "password"
  | "magic_link"
  | "google"
  | "oauth"
  | "unknown";

export type SignInAlertEvent = {
  /** Stable id for idempotency / future queue consumers */
  eventId: string;
  occurredAt: string;
  actor: {
    userId: string;
    email: string;
    name?: string | null;
  };
  auth: {
    provider: SignInProvider;
    providerAccountId?: string | null;
    isNewUser?: boolean;
  };
  context?: {
    ipAddress?: string;
    userAgent?: string;
    appUrl?: string;
  };
};

export type SignInAlertDeliveryResult = {
  recipient: string;
  ok: boolean;
  error?: string;
};

export type SignInAlertDeliveryReport = {
  eventId: string;
  attempted: number;
  delivered: number;
  failed: number;
  results: SignInAlertDeliveryResult[];
};

export interface SignInAlertDispatcher {
  dispatch(event: SignInAlertEvent): Promise<SignInAlertDeliveryReport>;
}
