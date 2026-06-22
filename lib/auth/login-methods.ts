import "server-only";

import { isAccessTokenAuthAvailable } from "@/lib/auth/local-credentials";
import { isEmailTransportConfigured } from "@/lib/email/config";
import { sanitizeEnv } from "@/lib/env/sanitize";

export async function getLoginMethods() {
  return {
    magicLink: isEmailTransportConfigured(),
    accessToken: isAccessTokenAuthAvailable(),
    google: Boolean(sanitizeEnv(process.env.AUTH_GOOGLE_ID)),
  };
}
