"use client";

import { useEffect, useState } from "react";

import { CalmModal } from "@/components/calm-modal";

type RecordDetailModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  fetchUrl: string | null;
  render: (data: unknown) => React.ReactNode;
};

export function RecordDetailModal({
  open,
  onClose,
  title,
  eyebrow,
  fetchUrl,
  render,
}: RecordDetailModalProps) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !fetchUrl) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    fetch(fetchUrl, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? "Unable to load record details.");
        }
        return response.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
        }
      })
      .catch((fetchError) => {
        if (!cancelled) {
          setError(
            fetchError instanceof Error ? fetchError.message : "Unable to load record details.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetchUrl, open]);

  return (
    <CalmModal open={open} onClose={onClose} title={title} eyebrow={eyebrow} size="wide">
      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading details…</p>
      ) : error ? (
        <p className="text-sm text-rose-400">{error}</p>
      ) : data ? (
        render(data)
      ) : (
        <p className="text-sm text-[var(--text-muted)]">Select a record to inspect its inputs.</p>
      )}
    </CalmModal>
  );
}
