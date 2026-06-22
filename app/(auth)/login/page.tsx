"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

import { LoginPollWatcher } from "@/components/auth/login-poll-watcher";

type LoginMethods = {
  magicLink: boolean;
  accessToken: boolean;
  google: boolean;
};

const DEFAULT_METHODS: LoginMethods = {
  magicLink: false,
  accessToken: false,
  google: false,
};

function createPollToken() {
  return crypto.randomUUID();
}

function normalizeAccessTokenInput(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 6);
}

async function fetchLoginMethods() {
  const response = await fetch("/api/auth/login-methods", { cache: "no-store" });
  if (!response.ok) return DEFAULT_METHODS;
  return (await response.json()) as LoginMethods;
}

async function resolveMagicLinkProviderId() {
  const response = await fetch("/api/auth/providers", { cache: "no-store" });
  if (!response.ok) return null;

  const providers = (await response.json()) as Record<
    string,
    { id: string; type?: string }
  >;

  const emailProvider = Object.values(providers).find(
    (provider) => provider.type === "email",
  );

  return emailProvider?.id ?? null;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [pollToken, setPollToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [methods, setMethods] = useState<LoginMethods>(DEFAULT_METHODS);
  const [magicLinkProviderId, setMagicLinkProviderId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchLoginMethods()
      .then(setMethods)
      .catch(() => setMethods(DEFAULT_METHODS));
  }, []);

  useEffect(() => {
    if (!methods.magicLink) return;
    resolveMagicLinkProviderId()
      .then(setMagicLinkProviderId)
      .catch(() => setMagicLinkProviderId(null));
  }, [methods.magicLink]);

  async function handleAccessTokenLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const normalizedToken = normalizeAccessTokenInput(accessToken);
    if (normalizedToken.length !== 6) {
      setError("Enter the 6-digit access code.");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        accessToken: normalizedToken,
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or access code.");
        return;
      }

      window.location.assign("/dashboard");
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!magicLinkProviderId) return;

    setLoading(true);
    setError(null);

    const nextPollToken = createPollToken();
    const callbackUrl = `${window.location.origin}/auth/approved?pollToken=${nextPollToken}`;

    try {
      const pollRes = await fetch("/api/auth/login-poll", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, pollToken: nextPollToken }),
      });

      if (!pollRes.ok) {
        throw new Error("Unable to start cross-device login");
      }

      const result = await signIn(magicLinkProviderId, {
        email,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "We couldn't send the sign-in email. Check that your address is correct and try again.",
        );
        return;
      }

      setPollToken(nextPollToken);
      setSent(true);
    } catch {
      setError("We couldn't start sign-in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const showDivider =
    methods.accessToken && (methods.magicLink || methods.google);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--page-background)" }}>
      {pollToken ? <LoginPollWatcher pollToken={pollToken} /> : null}
      <div className="glass-panel w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Sign in
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary, #888)" }}>
            COP Youth Policy Implementation Platform
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-3">
            <p style={{ color: "var(--brand-green)" }}>Check your email for a sign-in link.</p>
            <p className="text-sm" style={{ color: "var(--text-secondary, #888)" }}>
              We sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary, #666)" }}>
              Open the link on any device. This browser will sign you in automatically once you
              confirm the email.
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary, #666)" }}>
              Waiting for confirmation…
            </p>
          </div>
        ) : (
          <>
            {error ? (
              <p className="text-sm text-center" style={{ color: "#f87171" }}>
                {error}
              </p>
            ) : null}

            {methods.accessToken ? (
              <form onSubmit={handleAccessTokenLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm mb-1" style={{ color: "var(--text-secondary, #888)" }}>
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@organization.org"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-white/10 text-[var(--text-primary)] placeholder:text-white/30 focus:outline-none focus:border-[var(--brand-blue)] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="accessToken" className="block text-sm mb-1" style={{ color: "var(--text-secondary, #888)" }}>
                    6-digit access code
                  </label>
                  <input
                    id="accessToken"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                    value={accessToken}
                    onChange={(e) => setAccessToken(normalizeAccessTokenInput(e.target.value))}
                    placeholder="000000"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-white/10 text-[var(--text-primary)] tracking-[0.35em] text-center text-lg font-semibold placeholder:tracking-normal placeholder:font-normal placeholder:text-white/30 focus:outline-none focus:border-[var(--brand-blue)] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button-primary w-full py-3 rounded-lg font-medium transition-opacity disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            ) : null}

            {methods.magicLink ? (
              <>
                {methods.accessToken ? (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2" style={{ background: "var(--surface)", color: "var(--text-secondary, #888)" }}>
                        or use magic link
                      </span>
                    </div>
                  </div>
                ) : null}
                <form onSubmit={handleMagicLink} className="space-y-4">
                  {!methods.accessToken ? (
                    <div>
                      <label htmlFor="magic-email" className="block text-sm mb-1" style={{ color: "var(--text-secondary, #888)" }}>
                        Email address
                      </label>
                      <input
                        id="magic-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@organization.org"
                        className="w-full px-4 py-3 rounded-lg bg-[var(--surface)] border border-white/10 text-[var(--text-primary)] placeholder:text-white/30 focus:outline-none focus:border-[var(--brand-blue)] transition-colors"
                      />
                    </div>
                  ) : null}
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="glass-button-secondary w-full py-3 rounded-lg font-medium transition-opacity disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send magic link"}
                  </button>
                </form>
              </>
            ) : null}

            {showDivider && methods.google ? (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2" style={{ background: "var(--surface)", color: "var(--text-secondary, #888)" }}>
                    or
                  </span>
                </div>
              </div>
            ) : null}

            {methods.google ? (
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="glass-button-secondary w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
