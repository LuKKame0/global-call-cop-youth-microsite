import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";

import { authConfig } from "@/lib/auth/auth.config";
import { createMagicLinkProvider } from "@/lib/auth/email-provider";
import { authorizeLocalAdmin, isLocalAuthConfigured } from "@/lib/auth/local-credentials";
import { getDb } from "@/lib/db";
import { markLatestPendingPollVerified } from "@/lib/auth/login-poll";
import { isEmailTransportConfigured } from "@/lib/email/config";
import { users, accounts, verificationTokens, userOrgRoles } from "@/lib/db/schema";

function createAuthProviders() {
  const providers = [];

  if (isEmailTransportConfigured()) {
    providers.push(createMagicLinkProvider());
  }

  if (isLocalAuthConfigured()) {
    providers.push(
      Credentials({
        name: "Admin access code",
        credentials: {
          email: { label: "Email", type: "email" },
          accessToken: { label: "Access code", type: "text" },
        },
        authorize: async (credentials) => {
          const email = credentials?.email;
          const accessToken = credentials?.accessToken;
          if (typeof email !== "string" || typeof accessToken !== "string") {
            return null;
          }
          return authorizeLocalAdmin(email, accessToken);
        },
      }),
    );
  }

  if (process.env.AUTH_GOOGLE_ID) {
    providers.push(
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    );
  }

  if (providers.length === 0) {
    throw new Error(
      "No auth providers configured. Set AUTH_ADMIN_EMAILS + AUTH_ACCESS_TOKEN, email transport, or Google OAuth.",
    );
  }

  return providers;
}

function createAuthAdapter() {
  if (!process.env.DATABASE_URL?.trim()) {
    return undefined;
  }

  return DrizzleAdapter(getDb(), {
    usersTable: users,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
  });
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: createAuthAdapter(),
  providers: createAuthProviders(),
  events: {
    async signIn({ user, account, isNewUser }) {
      if (user.email && user.id && process.env.DATABASE_URL?.trim()) {
        await markLatestPendingPollVerified(user.email, user.id);
      }

      void import("@/lib/notifications/sign-in-alerts")
        .then(({ handleSignInAlert }) =>
          handleSignInAlert({
            user,
            account,
            isNewUser,
          }),
        )
        .catch((error) => {
          console.error("[sign-in-alert] dispatch failed", {
            userId: user.id,
            error: error instanceof Error ? error.message : "unknown error",
          });
        });
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      if (!user.id || !process.env.DATABASE_URL?.trim()) return false;

      const roles = await getDb()
        .select({ id: userOrgRoles.id })
        .from(userOrgRoles)
        .where(eq(userOrgRoles.userId, user.id))
        .limit(1);

      return roles.length > 0;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user?.id && process.env.DATABASE_URL?.trim()) {
        token.userId = user.id;
      } else if (user?.email && process.env.DATABASE_URL?.trim()) {
        const [dbUser] = await getDb()
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, user.email.trim().toLowerCase()))
          .limit(1);

        if (dbUser) {
          token.userId = dbUser.id;
        }
      } else if (!token.userId && token.sub) {
        token.userId = token.sub;
      }

      if (token.userId && process.env.DATABASE_URL?.trim()) {
        const roles = await getDb()
          .select()
          .from(userOrgRoles)
          .where(eq(userOrgRoles.userId, token.userId as string));
        token.roles = roles.map((r) => ({
          organizationId: r.organizationId,
          role: r.role,
          region: r.region,
          countryCode: r.countryCode,
        }));
      }

      return token;
    },
    async session({ session, token }) {
      const userId = (token.userId as string | undefined) ?? (token.sub as string | undefined);
      if (userId) {
        session.user.id = userId;
        (session as any).roles = token.roles;
      }
      return session;
    },
  },
});
