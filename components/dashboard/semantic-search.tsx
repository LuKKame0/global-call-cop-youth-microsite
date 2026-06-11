"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

import { useTenant } from "@/lib/tenant/context";

interface SearchResultItem {
  chunkId: string;
  submissionId: string;
  countryCode: string;
  region: string;
  themeKey: string;
  fieldKey: string;
  content: string;
  similarity: number;
}

const THEME_COLORS: Record<string, string> = {
  self: "var(--brand-pink)",
  community: "var(--brand-green)",
  institutions: "var(--brand-blue)",
  systems: "var(--brand-orange)",
};

export function SemanticSearchPanel() {
  const { orgId, orgSlug } = useTenant();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || query.length < 3) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, orgId, limit: 20 }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-secondary, #888)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all submissions (semantic)..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-[var(--surface)] border border-white/10 text-[var(--text-primary)] placeholder:text-white/30 focus:outline-none focus:border-[var(--brand-blue)] transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading || query.length < 3}
          className="glass-button-primary px-6 py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {searched && results.length === 0 && !loading && (
        <div className="glass-panel rounded-xl p-6 text-center">
          <p style={{ color: "var(--text-secondary, #888)" }}>No matching results found.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs" style={{ color: "var(--text-secondary, #888)" }}>
            {results.length} results
          </p>
          {results.map((r) => (
            <div key={r.chunkId} className="glass-panel rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      color: THEME_COLORS[r.themeKey] ?? "#fff",
                      border: `1px solid ${THEME_COLORS[r.themeKey] ?? "#555"}`,
                    }}
                  >
                    {r.themeKey}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-secondary, #888)" }}>
                    {r.fieldKey.replace(/_/g, " ")}
                  </span>
                </div>
                <span className="text-xs font-mono" style={{ color: "var(--brand-green)" }}>
                  {(r.similarity * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {r.content.length > 300 ? `${r.content.slice(0, 300)}...` : r.content}
              </p>
              <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-secondary, #666)" }}>
                <Link
                  href={`/org/${orgSlug}/submissions/${r.submissionId}`}
                  style={{ color: "var(--brand-blue)" }}
                  className="hover:underline"
                >
                  {r.countryCode}
                </Link>
                <span>{r.region}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
