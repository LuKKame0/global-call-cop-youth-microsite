import { BRAND } from "@/lib/branding/tokens";
import { emailShell, escapeHtml } from "@/lib/email/templates/shell";

type SignInEmailInput = {
  signInUrl: string;
  recipientEmail: string;
};

export function buildSignInEmail({ signInUrl, recipientEmail }: SignInEmailInput) {
  const safeUrl = escapeHtml(signInUrl);

  const bodyHtml = `
    <p style="margin:0 0 16px;line-height:1.75;color:rgba(16,16,20,0.72);font-size:15px;">
      Hello,
    </p>
    <p style="margin:0 0 16px;line-height:1.75;color:rgba(16,16,20,0.72);font-size:15px;">
      You requested secure access to <strong>The Global Call</strong> admin panel —
      the coordination layer for COP Youth Policy Implementation, national frameworks,
      and internal lead management.
    </p>
    <p style="margin:0 0 22px;line-height:1.75;color:rgba(16,16,20,0.72);font-size:15px;">
      Confirm your sign-in on any device. The browser where you started this request
      will open your dashboard automatically once you click below.
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
      <tr>
        <td style="border-radius:999px;background:linear-gradient(135deg, ${BRAND.colors.blue}, ${BRAND.colors.green});">
          <a href="${safeUrl}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.01em;">
            Sign in to The Global Call
          </a>
        </td>
      </tr>
    </table>
    <div style="margin:0 0 20px;padding:16px 18px;border-radius:14px;background:rgba(55,171,250,0.08);border:1px solid rgba(0,0,0,0.06);">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(16,16,20,0.45);">
        Access details
      </p>
      <p style="margin:0;line-height:1.6;font-size:14px;color:rgba(16,16,20,0.68);">
        <strong>Account:</strong> ${escapeHtml(recipientEmail)}<br />
        <strong>Expires:</strong> 24 hours from this message<br />
        <strong>Scope:</strong> Admin panel &amp; platform tools
      </p>
    </div>
    <p style="margin:0 0 12px;line-height:1.65;font-size:13px;color:rgba(16,16,20,0.55);">
      If the button does not work, copy and paste this link into your browser:
    </p>
    <p style="margin:0 0 20px;word-break:break-all;font-size:12px;line-height:1.6;color:rgba(16,16,20,0.45);">
      <a href="${safeUrl}" style="color:${BRAND.colors.blue};text-decoration:underline;">${safeUrl}</a>
    </p>
    <p style="margin:0;line-height:1.65;font-size:13px;color:rgba(16,16,20,0.5);">
      If you did not request this link, you can safely ignore this email. No changes
      will be made to your account unless you confirm sign-in.
    </p>
  `;

  const html = emailShell({
    eyebrow: BRAND.name,
    title: "Confirm your secure sign-in",
    accent: BRAND.colors.blue,
    bodyHtml,
  });

  const text = [
    "The Global Call — Confirm your secure sign-in",
    "",
    "You requested access to The Global Call admin panel (COP Youth Policy Implementation).",
    "",
    "Open this link on any device to confirm. Your original browser will sign in automatically:",
    signInUrl,
    "",
    `Account: ${recipientEmail}`,
    "This link expires in 24 hours.",
    "",
    "If you did not request this email, you can ignore it.",
    "",
    BRAND.name,
  ].join("\n");

  return {
    subject: "Sign in to The Global Call — secure access link",
    html,
    text,
  };
}
