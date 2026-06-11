import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/config";
import { hasPermission, type OrgRole } from "@/lib/auth/permissions";
import { getOrgById } from "@/lib/tenant/queries";
import { generateReport } from "@/lib/reports/generator";
import { renderReportPdf } from "@/lib/reports/pdf";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orgId, includeAiSummary } = await request.json();
  if (!orgId) {
    return NextResponse.json({ error: "orgId required" }, { status: 400 });
  }

  const roles: OrgRole[] = (session as any).roles ?? [];
  if (!hasPermission(roles, orgId, "reports.generate")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const org = await getOrgById(orgId);
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const report = await generateReport(org.id, org.name);

  let executiveSummary: string | undefined;
  if (includeAiSummary && process.env.NIM_API_KEY) {
    try {
      const { getProvider } = await import("@/lib/ai");
      const provider = getProvider();
      const result = await provider.generate(
        `Generate an executive summary for this COP Youth Policy Implementation report:\n\n` +
          `Organization: ${report.orgName}\n` +
          `Total submissions: ${report.summary.totalSubmissions}\n` +
          `Countries covered: ${report.summary.totalCountries}\n` +
          `Regions: ${report.summary.regionBreakdown.map((r) => `${r.region} (${r.count})`).join(", ")}\n` +
          `Themes: ${report.themes.map((t) => `${t.label} (${t.chunkCount} data points)`).join(", ")}`,
        {
          systemPrompt:
            "You are a multilateral policy analyst. Write a concise executive summary (3-4 paragraphs) for a COP youth policy implementation report. Focus on coverage, key patterns, gaps, and recommended next steps. Write in formal institutional English.",
          temperature: 0.3,
          maxTokens: 1024,
        },
      );
      executiveSummary = result.text;
    } catch (err) {
      console.error("[reports] AI summary generation failed:", err);
    }
  }

  const pdfBuffer = await renderReportPdf(report, executiveSummary);
  const filename = `cop-report-${org.slug}-${new Date().toISOString().slice(0, 10)}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
