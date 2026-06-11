"use client";

import { useState } from "react";
import { FileText, Download, FileDown, Sheet } from "lucide-react";

interface ReportActionsProps {
  orgId: string;
  orgName: string;
}

export function ReportActions({ orgId, orgName }: ReportActionsProps) {
  const [loading, setLoading] = useState<"json" | "pdf" | "csv" | null>(null);
  const [report, setReport] = useState<Record<string, unknown> | null>(null);

  async function handleGenerateJson() {
    setLoading("json");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } finally {
      setLoading(null);
    }
  }

  async function handleDownloadPdf(includeAi: boolean) {
    setLoading("pdf");
    try {
      const res = await fetch("/api/reports/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId, includeAiSummary: includeAi }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cop-report-${orgName}-${new Date().toISOString().slice(0, 10)}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setLoading(null);
    }
  }

  async function handleDownloadCsv() {
    setLoading("csv");
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cop-submissions-${orgName}-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setLoading(null);
    }
  }

  function handleDownloadJson() {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${orgName}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => handleDownloadPdf(false)}
        disabled={loading !== null}
        className="glass-button-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
      >
        <FileDown size={16} />
        {loading === "pdf" ? "Generating PDF..." : "Download PDF"}
      </button>
      <button
        onClick={() => handleDownloadPdf(true)}
        disabled={loading !== null}
        className="glass-button-secondary flex items-center gap-2 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
      >
        <FileDown size={16} />
        {loading === "pdf" ? "..." : "PDF + AI Summary"}
      </button>
      <button
        onClick={handleDownloadCsv}
        disabled={loading !== null}
        className="glass-button-secondary flex items-center gap-2 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
      >
        <Sheet size={16} />
        {loading === "csv" ? "Exporting..." : "CSV Export"}
      </button>
      <button
        onClick={handleGenerateJson}
        disabled={loading !== null}
        className="glass-button-secondary flex items-center gap-2 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
      >
        <FileText size={16} />
        {loading === "json" ? "..." : "JSON"}
      </button>
      {report && (
        <button
          onClick={handleDownloadJson}
          className="glass-button-secondary flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
        >
          <Download size={16} />
          Save JSON
        </button>
      )}
    </div>
  );
}
