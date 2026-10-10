import { createServerFn } from "@tanstack/react-start";
import { COMPANY, CURRENCIES } from "@/lib/forex-data";

export type QuoteEmailPayload = {
  id: string;
  createdAt: number;
  mode: "buy" | "sell";
  code: string;
  fxAmount: string;
  inrAmount: string;
  rate: number;
  name: string;
  mobile: string;
  email: string;
  advance: string;
  reference: string;
  status: string;
};

export type EmailResult = { sent: boolean; reason?: string };

const ADMIN_EMAIL = "kirat.forex@gmail.com"; // company notification inbox
const DEFAULT_FROM = "Kirat Forex <onboarding@resend.dev>";
const SITE_URL = "https://kiratforex.com";
const LOGO_URL = `${SITE_URL}/kirat-forex-logo.png`;

// Brand palette (matches the website)
const NAVY = "#1e3a8a";
const BLUE = "#2563eb";
const INK = "#0f172a";
const SLATE = "#475569";
const MUTED = "#64748b";
const GOLD = "#ddb34a";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function currencyFlag(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.flag ?? "💱";
}

function currencyName(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.name ?? code;
}

function detailRows(q: QuoteEmailPayload): [string, string][] {
  const needsAdvance = parseFloat(q.advance || "0") > 0;
  return [
    ["Full name", q.name || "—"],
    ["Mobile", `+91 ${q.mobile}`],
    ["Email", q.email],
    ["Quote reference", q.reference],
    ["Requested on", formatDate(q.createdAt)],
    ["Advance payable", needsAdvance ? `₹ ${q.advance}` : "Not required"],
    ["Status", q.status],
  ];
}

type TemplateOptions = {
  heading: string;
  intro: string;
  showTrackButton: boolean;
  footerNote: string;
};

function buildHtml(q: QuoteEmailPayload, opts: TemplateOptions): string {
  const isBuy = q.mode === "buy";
  const modeLabel = isBuy ? "WE BUY FOREX" : "WE SELL FOREX";
  const modeBg = isBuy ? BLUE : "#059669";

  const rows = detailRows(q)
    .map(
      ([k, v]) =>
        `<tr>` +
        `<td style="padding:11px 16px;color:${MUTED};font-size:13px;border-bottom:1px solid #eef2f7;">${escapeHtml(k)}</td>` +
        `<td style="padding:11px 16px;color:${INK};font-size:13px;font-weight:700;text-align:right;border-bottom:1px solid #eef2f7;">${escapeHtml(v)}</td>` +
        `</tr>`,
    )
    .join("");

  const trackButton = opts.showTrackButton
    ? [
        `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 4px;"><tr>`,
        `<td style="border-radius:10px;background:linear-gradient(135deg, ${NAVY}, ${BLUE});">`,
        `<a href="${SITE_URL}/quote/${encodeURIComponent(q.id)}" style="display:inline-block;padding:13px 30px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.4px;">VIEW YOUR QUOTE →</a>`,
        `</td></tr></table>`,
      ].join("")
    : "";

  return [
    "<!DOCTYPE html>",
    `<html lang="en" style="margin:0;padding:0;">`,
    `<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">`,
    // Hidden preheader text for inbox preview
    `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(
      `${q.reference} · ${q.fxAmount} ${q.code} · ₹${q.inrAmount} · ${opts.heading}`,
    )}</div>`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;">`,
    `<tr><td align="center" style="padding:28px 12px;">`,
    `<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 6px 24px rgba(15,23,42,0.08);">`,
    // ── Header: gradient brand bar with logo
    `<tr><td style="background:linear-gradient(135deg, ${NAVY} 0%, ${BLUE} 100%);padding:22px 26px 20px;">`,
    `<table role="presentation" cellpadding="0" cellspacing="0"><tr>`,
    `<td style="vertical-align:middle;background:#ffffff;border-radius:12px;padding:7px 12px;">`,
    `<img src="${LOGO_URL}" width="132" alt="${escapeHtml(COMPANY.name)}" style="display:block;height:38px;width:auto;" />`,
    `</td>`,
    `<td style="vertical-align:middle;padding-left:14px;color:#dbeafe;font-size:11px;letter-spacing:2.2px;font-weight:600;">PRIVATE LIMITED</td>`,
    `</tr></table>`,
    `<div style="height:3px;background:linear-gradient(90deg, ${GOLD}, #f6e3a1);margin-top:16px;border-radius:2px;"></div>`,
    `</td></tr>`,
    // ── Body
    `<tr><td style="padding:26px 26px 8px;">`,
    `<h1 style="margin:0 0 8px;font-size:21px;line-height:1.3;color:${INK};">${escapeHtml(opts.heading)}</h1>`,
    `<p style="margin:0 0 4px;font-size:14px;line-height:1.6;color:${SLATE};">${escapeHtml(opts.intro)}</p>`,
    `</td></tr>`,
    // ── Currency highlight card
    `<tr><td style="padding:14px 26px 4px;">`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#eff6ff,#f8fafc);border:1px solid #dbeafe;border-radius:14px;">`,
    `<tr><td style="padding:16px 18px 6px;text-align:center;">`,
    `<span style="display:inline-block;background:${modeBg};color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1.4px;padding:5px 14px;border-radius:999px;">${modeLabel}</span>`,
    `</td></tr>`,
    `<tr><td style="padding:6px 18px 2px;text-align:center;">`,
    `<span style="font-size:16px;">${currencyFlag(q.code)}</span>` +
      `<span style="font-size:26px;font-weight:800;color:${NAVY};">${escapeHtml(q.fxAmount)} ${escapeHtml(q.code)}</span>`,
    `</td></tr>`,
    `<tr><td style="padding:2px 18px;text-align:center;color:#94a3b8;font-size:18px;font-weight:300;">↓</td></tr>`,
    `<tr><td style="padding:2px 18px 6px;text-align:center;">`,
    `<span style="font-size:26px;font-weight:800;color:${INK};">₹ ${escapeHtml(q.inrAmount)}</span>`,
    `</td></tr>`,
    `<tr><td style="padding:6px 18px 16px;text-align:center;">`,
    `<span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:12px;font-weight:700;padding:5px 14px;border-radius:999px;">1 ${escapeHtml(q.code)} = ₹ ${q.rate} · ${escapeHtml(currencyName(q.code))}</span>`,
    `</td></tr>`,
    `</table>`,
    `</td></tr>`,
    // ── Detail rows
    `<tr><td style="padding:16px 26px 2px;">`,
    `<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:${MUTED};text-transform:uppercase;">Quote details</p>`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;border-collapse:separate;overflow:hidden;">`,
    rows,
    `</table>`,
    `</td></tr>`,
    // ── CTA
    `<tr><td style="padding:6px 26px 6px;text-align:center;">${trackButton}</td></tr>`,
    // ── Footer
    `<tr><td style="padding:18px 26px 26px;">`,
    `<div style="height:1px;background:#e2e8f0;margin-bottom:16px;"></div>`,
    `<p style="margin:0 0 6px;font-size:12px;color:${MUTED};line-height:1.6;">`,
    `<strong style="color:${INK};">${escapeHtml(COMPANY.name)}</strong> · CIN ${escapeHtml(COMPANY.cin)}<br/>`,
    `${escapeHtml(COMPANY.branch.address)}<br/>`,
    `Phone: ${escapeHtml(COMPANY.branch.phone)} · <a href="mailto:${escapeHtml(COMPANY.email)}" style="color:${BLUE};text-decoration:none;">${escapeHtml(COMPANY.email)}</a>`,
    `</p>`,
    `<p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">${escapeHtml(opts.footerNote)}</p>`,
    `</td></tr>`,
    `</table>`,
    `</td></tr>`,
    `</table>`,
    `</body></html>`,
  ].join("");
}

function buildText(q: QuoteEmailPayload, heading: string, intro: string): string {
  const details = detailRows(q)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  return [
    heading,
    "",
    intro,
    "",
    `Currency: ${q.fxAmount} ${q.code} = ₹ ${q.inrAmount} (1 ${q.code} = ₹ ${q.rate})`,
    details,
    "",
    `Track your quote: ${SITE_URL}/quote/${q.id}`,
    "",
    `— ${COMPANY.name}`,
  ].join("\n");
}

async function sendViaResend(
  apiKey: string,
  from: string,
  to: string[],
  subject: string,
  html: string,
  text: string,
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend API ${res.status}: ${body}`);
  }
}

const sendQuoteEmailsServer = createServerFn({ method: "POST" })
  .validator((input: QuoteEmailPayload) => input)
  .handler(async ({ data }): Promise<EmailResult> => {
    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) {
      console.warn("[email] RESEND_API_KEY not set — skipping quote emails");
      return { sent: false, reason: "missing_key" };
    }
    const from = process.env["RESEND_FROM"] || DEFAULT_FROM;
    const who = data.name ? data.name : data.mobile;

    // The two copies are independent: a bad user address must never block the
    // company's copy (and vice versa).
    let userSent = false;
    let adminSent = false;

    // 1. Copy to the customer
    try {
      await sendViaResend(
        apiKey,
        from,
        [data.email],
        `Your Kirat Forex quote ${data.reference} — ${data.fxAmount} ${data.code} request received`,
        buildHtml(data, {
          heading: `Namaste, ${who}! Your quote request is in.`,
          intro:
            "Thank you for choosing Kirat Forex. Here is a summary of the rate you asked for — our team will call you shortly on your mobile to confirm and lock the rate.",
          showTrackButton: true,
          footerNote: `This email was sent to ${data.email} because a quote request was submitted on kiratforex.com. Rates are indicative and confirmed only on call.`,
        }),
        buildText(
          data,
          `Your quote request ${data.reference} has been received`,
          "Thank you for choosing Kirat Forex. Our team will call you shortly to confirm the rate.",
        ),
      );
      userSent = true;
    } catch (err) {
      console.error("[email] User copy failed:", err);
    }

    // 2. Copy to the company
    try {
      await sendViaResend(
        apiKey,
        from,
        [ADMIN_EMAIL],
        `New quote: ${who} — ${data.fxAmount} ${data.code} (${data.reference})`,
        buildHtml(data, {
          heading: `New quote request from ${who}`,
          intro: `${who} submitted a quote request on the website. Contact: +91 ${data.mobile} · ${data.email}. Call back to confirm and lock the rate.`,
          showTrackButton: true,
          footerNote: `Internal notification — sent to ${ADMIN_EMAIL}. Manage this request from the admin dashboard.`,
        }),
        buildText(
          data,
          `New quote request ${data.reference} from ${who}`,
          `Submitted on the website. Contact: +91 ${data.mobile} · ${data.email}`,
        ),
      );
      adminSent = true;
    } catch (err) {
      console.error("[email] Company copy failed:", err);
    }

    if (!userSent && !adminSent) return { sent: false, reason: "send_failed" };
    if (!userSent) return { sent: true, reason: "user_copy_failed" };
    if (!adminSent) return { sent: true, reason: "admin_copy_failed" };
    return { sent: true };
  });

export async function sendQuoteEmails(payload: QuoteEmailPayload): Promise<EmailResult> {
  try {
    return await sendQuoteEmailsServer({ data: payload });
  } catch (err) {
    console.error("[email] sendQuoteEmails failed:", err);
    return { sent: false, reason: "client_error" };
  }
}
