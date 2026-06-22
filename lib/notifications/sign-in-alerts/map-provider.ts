import type { SignInProvider } from "@/lib/notifications/types";

type AccountLike = {
  provider?: string | null;
  type?: string | null;
} | null | undefined;

export function mapAuthProvider(account: AccountLike): SignInProvider {
  const provider = account?.provider?.trim().toLowerCase();
  if (!provider) return "unknown";

  if (provider === "credentials") return "access_code";
  if (provider === "google") return "google";
  if (provider === "email" || provider === "resend" || provider === "nodemailer") {
    return "magic_link";
  }
  if (account?.type === "oauth") return "oauth";

  return "unknown";
}
