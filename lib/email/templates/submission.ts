import type { SubmissionRecord } from "@/types/submission";

import { BRAND } from "@/lib/branding/tokens";
import { sendEmail, sendEmailToNotifyList } from "@/lib/email/client";
import { emailShell, escapeHtml, fieldRow } from "@/lib/email/templates/shell";

const THEME_LABELS: Record<keyof SubmissionRecord["themes"], string> = {
  self: "Theme 1 — Self: Courage & Agency",
  community: "Theme 2 — Community: Collective Action",
  institutions: "Theme 3 — Institutions: Working with Systems",
  systems: "Theme 4 — Systems: Transforming Society",
};

function humanizeKey(key: string) {
  return key
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function sendConfirmationEmail(submission: SubmissionRecord) {
  const themeList = Object.values(THEME_LABELS);

  const html = emailShell({
    eyebrow: BRAND.frameworkName,
    title: "Submission received",
    accent: BRAND.colors.blue,
    bodyHtml: `
      <p style="margin:0 0 16px;line-height:1.7;color:rgba(16,16,20,0.72);">
        Hello ${escapeHtml(submission.name)}, your national framework has been received and added to the implementation pipeline.
      </p>
      <div style="margin:18px 0;padding:16px;border-radius:14px;background:rgba(55,171,250,0.12);border:1px solid rgba(0,0,0,0.08);">
        ${fieldRow("Country", submission.country)}
        ${fieldRow("Submission ID", submission.metadata.submission_id)}
        ${fieldRow("Region", submission.metadata.region)}
      </div>
      <p style="margin:0 0 10px;font-weight:700;color:${BRAND.colors.textLight};">Included themes</p>
      <ul style="margin:0;padding-left:18px;line-height:1.7;color:rgba(16,16,20,0.72);">
        ${themeList.map((theme) => `<li>${escapeHtml(theme)}</li>`).join("")}
      </ul>
      <p style="margin:20px 0 0;line-height:1.7;color:rgba(16,16,20,0.64);">
        Thank you for contributing to the national implementation framework.
      </p>
    `,
  });

  const text = [
    `Hello ${submission.name},`,
    "",
    "Your COP - Youth Policy Implementation submission has been received.",
    `Country: ${submission.country}`,
    `Submission ID: ${submission.metadata.submission_id}`,
    `Region: ${submission.metadata.region}`,
    "",
    "Included themes:",
    ...themeList.map((theme) => `- ${theme}`),
    "",
    "Thank you for contributing to the national implementation framework.",
  ].join("\n");

  await sendEmail({
    to: submission.email,
    subject: `COP submission received - ${submission.country}`,
    html,
    text,
  });

  console.info("[email] confirmation sent", {
    submissionId: submission.metadata.submission_id,
    recipient: submission.email,
  });
}

export async function sendInternalNotification(submission: SubmissionRecord) {
  const textLines: string[] = [
    "New COP Youth Policy framework submission",
    "",
    `Submission ID: ${submission.metadata.submission_id}`,
    `Timestamp:     ${submission.metadata.timestamp}`,
    `Region:        ${submission.metadata.region}`,
    "",
    "Respondent",
    `  Name:            ${submission.name}`,
    `  Email:           ${submission.email}`,
    `  Country:         ${submission.country}`,
    `  Youth structure: ${submission.youth_structure}`,
    "",
  ];

  const themeSectionsHtml: string[] = [];

  for (const themeKey of Object.keys(submission.themes) as Array<
    keyof SubmissionRecord["themes"]
  >) {
    const themeLabel = THEME_LABELS[themeKey];
    const themeData = submission.themes[themeKey] as unknown as Record<
      string,
      string
    >;

    textLines.push(themeLabel);
    const fieldsHtml: string[] = [];

    for (const [fieldKey, value] of Object.entries(themeData)) {
      const label = humanizeKey(fieldKey);
      textLines.push(`  ${label}:`);
      textLines.push(
        ...value.split(/\r?\n/).map((line) => `    ${line}`),
      );
      textLines.push("");
      fieldsHtml.push(`
        <div style="margin:0 0 14px;">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(16,16,20,0.45);">${escapeHtml(
            label,
          )}</p>
          <p style="margin:0;line-height:1.6;white-space:pre-wrap;color:rgba(16,16,20,0.78);">${escapeHtml(
            value,
          )}</p>
        </div>`);
    }

    themeSectionsHtml.push(`
      <section style="margin:0 0 22px;padding:18px;border-radius:14px;background:rgba(55,171,250,0.08);border:1px solid rgba(0,0,0,0.08);">
        <h2 style="margin:0 0 14px;font-size:16px;color:${BRAND.colors.textLight};">${escapeHtml(themeLabel)}</h2>
        ${fieldsHtml.join("")}
      </section>`);
  }

  const html = emailShell({
    eyebrow: `${BRAND.frameworkName} — Internal`,
    title: "New submission received",
    accent: BRAND.colors.pink,
    bodyHtml: `
      <table style="width:100%;border-collapse:collapse;margin:0 0 22px;font-size:14px;color:rgba(16,16,20,0.78);">
        <tbody>
          <tr><td style="padding:6px 0;color:rgba(16,16,20,0.45);width:160px;">Submission ID</td><td style="padding:6px 0;">${escapeHtml(
            submission.metadata.submission_id,
          )}</td></tr>
          <tr><td style="padding:6px 0;color:rgba(16,16,20,0.45);">Timestamp</td><td style="padding:6px 0;">${escapeHtml(
            submission.metadata.timestamp,
          )}</td></tr>
          <tr><td style="padding:6px 0;color:rgba(16,16,20,0.45);">Region</td><td style="padding:6px 0;">${escapeHtml(
            submission.metadata.region,
          )}</td></tr>
          <tr><td style="padding:6px 0;color:rgba(16,16,20,0.45);">Country</td><td style="padding:6px 0;">${escapeHtml(
            submission.country,
          )}</td></tr>
          <tr><td style="padding:6px 0;color:rgba(16,16,20,0.45);">Youth structure</td><td style="padding:6px 0;">${escapeHtml(
            submission.youth_structure,
          )}</td></tr>
          <tr><td style="padding:6px 0;color:rgba(16,16,20,0.45);">Respondent</td><td style="padding:6px 0;">${escapeHtml(
            submission.name,
          )} &lt;${escapeHtml(submission.email)}&gt;</td></tr>
        </tbody>
      </table>
      ${themeSectionsHtml.join("")}
    `,
  });

  await sendEmailToNotifyList({
    subject: `[COP Youth] New submission — ${submission.country} (${submission.name})`,
    html,
    text: textLines.join("\n"),
    replyTo: submission.email,
  });
}
