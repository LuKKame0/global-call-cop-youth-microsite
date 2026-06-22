import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

import type { ReportData } from "./generator";

const colors = {
  bg: "#050505",
  surface: "#101010",
  text: "#EAEAEA",
  muted: "#888888",
  blue: "#3B82F6",
  green: "#22C55E",
  orange: "#F97316",
  pink: "#EC4899",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.bg,
    padding: 40,
    fontFamily: "Helvetica",
    color: colors.text,
    fontSize: 10,
  },
  coverPage: {
    backgroundColor: colors.bg,
    padding: 40,
    fontFamily: "Helvetica",
    color: colors.text,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: 4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
    color: colors.blue,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  label: { fontSize: 9, color: colors.muted, marginBottom: 2 },
  value: { fontSize: 12, fontWeight: "bold" },
  metricRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  metricValue: { fontSize: 20, fontWeight: "bold" },
  metricLabel: { fontSize: 8, color: colors.muted, marginTop: 2 },
  themeSection: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  themeTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 6 },
  bodyText: { fontSize: 9, lineHeight: 1.5, color: colors.text },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: colors.muted,
  },
});

const themeColors: Record<string, string> = {
  self: colors.pink,
  community: colors.green,
  institutions: colors.blue,
  systems: colors.orange,
};

interface PdfReportProps {
  data: ReportData;
  executiveSummary?: string;
}

function PdfReport({ data, executiveSummary }: PdfReportProps) {
  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>{data.orgName}</Text>
          <Text style={styles.subtitle}>
            Youth Policy Implementation Report
          </Text>
          <Text style={{ ...styles.subtitle, marginTop: 20, fontSize: 10 }}>
            Generated {new Date(data.generatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <Text style={{ ...styles.subtitle, marginTop: 8, fontSize: 10 }}>
            {data.summary.totalSubmissions} submissions · {data.summary.totalCountries} countries · {data.summary.totalChunks} data points
          </Text>
        </View>
      </Page>

      {/* Executive Summary (if AI-generated) */}
      {executiveSummary && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.card}>
            <Text style={styles.bodyText}>{executiveSummary}</Text>
          </View>
          <Footer data={data} />
        </Page>
      )}

      {/* Summary Metrics */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.metricRow}>
          <MetricCard label="Submissions" value={data.summary.totalSubmissions} color={colors.green} />
          <MetricCard label="Countries" value={data.summary.totalCountries} color={colors.blue} />
          <MetricCard label="Data Points" value={data.summary.totalChunks} color={colors.orange} />
        </View>

        <Text style={styles.sectionTitle}>Regional Breakdown</Text>
        {data.summary.regionBreakdown.map((r) => (
          <View key={r.region} style={styles.row}>
            <Text style={{ fontSize: 10 }}>{r.region}</Text>
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>{r.count}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Thematic Coverage</Text>
        {data.themes.map((theme) => (
          <View key={theme.key} style={styles.themeSection}>
            <Text style={{ ...styles.themeTitle, color: themeColors[theme.key] ?? colors.text }}>
              {theme.label}
            </Text>
            <Text style={styles.label}>{theme.chunkCount} data points</Text>
            {theme.topCountries.length > 0 && (
              <View style={{ marginTop: 6 }}>
                <Text style={styles.label}>Top contributors:</Text>
                {theme.topCountries.map((c) => (
                  <Text key={c.country} style={{ fontSize: 9, marginLeft: 8 }}>
                    • {c.country} ({c.count})
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}

        <Footer data={data} />
      </Page>

      {/* Submissions List */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Submissions Register</Text>
        <View style={styles.row}>
          <Text style={{ ...styles.label, flex: 1 }}>Country</Text>
          <Text style={{ ...styles.label, flex: 1 }}>Region</Text>
          <Text style={{ ...styles.label, flex: 1 }}>Respondent</Text>
          <Text style={{ ...styles.label, flex: 1 }}>Date</Text>
        </View>
        {data.submissions.slice(0, 50).map((s, i) => (
          <View key={i} style={styles.row}>
            <Text style={{ flex: 1, fontSize: 8 }}>{s.country}</Text>
            <Text style={{ flex: 1, fontSize: 8 }}>{s.region}</Text>
            <Text style={{ flex: 1, fontSize: 8 }}>{s.respondent ?? "—"}</Text>
            <Text style={{ flex: 1, fontSize: 8 }}>
              {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : "—"}
            </Text>
          </View>
        ))}
        {data.submissions.length > 50 && (
          <Text style={{ ...styles.label, marginTop: 8 }}>
            ... and {data.submissions.length - 50} more submissions
          </Text>
        )}
        <Footer data={data} />
      </Page>
    </Document>
  );
}

function MetricCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={{ ...styles.metricValue, color }}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function Footer({ data }: { data: ReportData }) {
  return (
    <View style={styles.footer}>
      <Text>{data.orgName} — COP Youth Policy Implementation</Text>
      <Text>Generated {new Date(data.generatedAt).toLocaleDateString()}</Text>
    </View>
  );
}

export async function renderReportPdf(
  data: ReportData,
  executiveSummary?: string,
): Promise<Buffer> {
  return renderToBuffer(
    <PdfReport data={data} executiveSummary={executiveSummary} />,
  );
}
