import { BRAND } from "@/lib/branding/tokens";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function fieldRow(label: string, value: string) {
  return `<p style="margin:0 0 10px;line-height:1.6;"><strong>${escapeHtml(
    label,
  )}:</strong> ${escapeHtml(value || "—")}</p>`;
}

type EmailShellInput = {
  eyebrow: string;
  title: string;
  bodyHtml: string;
  accent?: string;
};

export function emailShell({ eyebrow, title, bodyHtml, accent }: EmailShellInput) {
  const accentColor = accent ?? BRAND.colors.blue;

  return `
    <div style="font-family: Inter, 'Helvetica Neue', Arial, sans-serif; background:${BRAND.colors.pageLight}; color:${BRAND.colors.textLight}; padding:24px;">
      <div style="max-width:640px;margin:0 auto;background:${BRAND.colors.surfaceLight};border:1px solid rgba(0,0,0,0.1);border-radius:18px;padding:28px;box-shadow:0 24px 80px rgba(0,0,0,0.08);">
        <p style="margin:0 0 12px;color:rgba(16,16,20,0.45);font-size:12px;letter-spacing:0.12em;text-transform:uppercase;">${escapeHtml(
          eyebrow,
        )}</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.15;color:${BRAND.colors.textLight};">${escapeHtml(
          title,
        )}</h1>
        <div style="height:3px;width:64px;border-radius:999px;background:linear-gradient(90deg, ${accentColor}, ${BRAND.colors.green});margin:0 0 18px;"></div>
        ${bodyHtml}
        <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:rgba(16,16,20,0.45);">${escapeHtml(
          BRAND.name,
        )}</p>
      </div>
    </div>
  `;
}
