// =====================================================================
// ✉️  EMAIL — server-side sending via Resend
// ---------------------------------------------------------------------
// Imported ONLY by server route handlers. The API key never reaches the
// browser. Also holds small branded HTML templates so the contact and
// order emails look consistent with the store.
// =====================================================================
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const isEmailConfigured = Boolean(apiKey);
export const MAIL_FROM =
  process.env.MAIL_FROM || "ShortKurti <onboarding@resend.dev>";
export const OWNER_EMAIL = process.env.OWNER_EMAIL || "";

const resend = apiKey ? new Resend(apiKey) : null;

// Escape user-supplied strings before dropping them into email HTML.
export function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendEmail({ to, subject, html, replyTo }) {
  if (!resend) throw new Error("Email is not configured (missing RESEND_API_KEY).");
  const { data, error } = await resend.emails.send({
    from: MAIL_FROM,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
  if (error) throw new Error(error.message || "Email provider rejected the request.");
  return data;
}

// ---- Branded wrapper so all emails share one look ----
export function layout(title, bodyHtml) {
  return `<!doctype html><html><body style="margin:0;background:#fbf7f2;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#2d2a32;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:24px;font-weight:700;letter-spacing:.5px;">Short<span style="color:#b76e79;">Kurti</span></span>
    </div>
    <div style="background:#ffffff;border:1px solid #ede2cf;border-radius:20px;padding:28px;">
      <h1 style="margin:0 0 16px;font-size:20px;">${esc(title)}</h1>
      ${bodyHtml}
    </div>
    <p style="text-align:center;color:#9b8f86;font-size:12px;margin-top:20px;">
      Sent from the ShortKurti website · Lagoon collection ✨
    </p>
  </div></body></html>`;
}

// Small key/value row used inside emails.
export function row(label, value) {
  return `<tr>
    <td style="padding:6px 0;color:#8a7f78;font-size:13px;width:130px;vertical-align:top;">${esc(label)}</td>
    <td style="padding:6px 0;font-size:14px;">${esc(value)}</td>
  </tr>`;
}
