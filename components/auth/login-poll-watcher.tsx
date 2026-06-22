"use client";

import { useEffect, useRef } from "react";

type Props = {
  pollToken: string;
  redirectTo?: string;
};

async function hasActiveSession() {
  const sessionRes = await fetch("/api/auth/session", { cache: "no-store" });
  if (!sessionRes.ok) return false;
  const session = await sessionRes.json();
  return Boolean(session?.user?.email);
}

function redirectToTarget(target: string) {
  window.location.assign(target);
}

export function LoginPollWatcher({ pollToken, redirectTo = "/dashboard" }: Props) {
  const claimingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function tryRedirectIfSignedIn() {
      if (await hasActiveSession()) {
        redirectToTarget(redirectTo);
        return true;
      }
      return false;
    }

    async function poll() {
      while (!cancelled) {
        try {
          const statusRes = await fetch(
            `/api/auth/login-status?pollToken=${encodeURIComponent(pollToken)}`,
            { cache: "no-store" },
          );
          const status = await statusRes.json();

          if (status.status === "claimed") {
            if (await tryRedirectIfSignedIn()) return;
          }

          if (status.status === "verified" && !claimingRef.current) {
            claimingRef.current = true;
            const claimRes = await fetch("/api/auth/claim-session", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ pollToken }),
              cache: "no-store",
            });

            if (claimRes.ok || claimRes.status === 409) {
              if (await tryRedirectIfSignedIn()) return;
            }

            claimingRef.current = false;
          }

          if (status.status === "expired" || status.status === "missing") {
            return;
          }
        } catch {
          // Keep polling through transient network errors.
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    poll();

    return () => {
      cancelled = true;
    };
  }, [pollToken, redirectTo]);

  return null;
}
