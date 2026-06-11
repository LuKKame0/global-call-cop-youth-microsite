"use client";

import { useState, useTransition } from "react";

import { LEAD_TYPES, type LeadType } from "@/lib/leads/types";

const TYPE_LABELS: Record<LeadType, string> = {
  apply: "Apply to Join",
  partner: "Partnership",
  coordination: "Build the Future",
  focal_point: "National Focal Point",
};

function parseFilename(contentDisposition: string | null, fallback: string) {
  if (!contentDisposition) return fallback;
  const match = contentDisposition.match(/filename="([^"]+)"/);
  return match?.[1] ?? fallback;
}

async function downloadExport(path: string, fallbackFilename: string) {
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Export failed. Check your admin session and try again.");
  }

  const blob = await response.blob();
  const filename = parseFilename(response.headers.get("Content-Disposition"), fallbackFilename);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function LeadsExportButtons() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function runExport(label: string, path: string, fallbackFilename: string) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      try {
        await downloadExport(path, fallbackFilename);
        setMessage(`${label} downloaded.`);
      } catch (exportError) {
        setError(
          exportError instanceof Error ? exportError.message : "Export failed unexpectedly.",
        );
      }
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            runExport("All leads", "/api/admin/leads/export?scope=all", "marketing-leads-all.json")
          }
          className="rounded-full bg-[var(--brand-blue)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
        >
          Export all JSON
        </button>
        {LEAD_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            disabled={isPending}
            onClick={() =>
              runExport(
                TYPE_LABELS[type],
                `/api/admin/leads/export?type=${type}`,
                `${type}-leads.json`,
              )
            }
            className="rounded-full border border-[var(--glass-border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--glass-button-secondary-bg)] disabled:opacity-60"
          >
            Export {TYPE_LABELS[type]}
          </button>
        ))}
      </div>
      {message ? <p className="text-xs text-[var(--brand-green)]">{message}</p> : null}
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}
