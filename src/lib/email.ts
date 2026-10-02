import { createServerFn } from "@tanstack/react-start";

export type QuoteEmailPayload = {
  id: string;
  createdAt: number;
  mode: "buy" | "sell";
  code: string;
  fxAmount: string;
  inrAmount: string;
  rate: number;
  mobile: string;
  email: string;
  advance: string;
  reference: string;
  status: string;
};

export type EmailResult = { sent: boolean; reason?: string };

const ADMIN_EMAIL = "info.kiratforex@gmail.com";
const DEFAULT_FROM = "Kirat Forex <onboarding@resend.dev>";

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

function quoteRows(q: QuoteEmailPayload): [string, string][] {
  return [
    ["Quote reference", q.reference],
    ["Date", formatDate(q.createdAt)],
    ["Type", q.mode === "buy" ? "We Buy Forex" : "We Sell Forex"],
    ["Currency", q.code],
    ["Forex amount", q.fxAmount],
    ["INR amount", `Rs. ${q.inrAmount}`],
    ["Applied rate", `Rs. ${q.rate} per ${q.code}`],
    ["Advance payable", `Rs. ${q.advance}`],
    ["Mobile", `+91 ${q.mobile}`],
    ["Email", q.email],
    ["Status", q.status],
  ];
}

function buildHtml(heading: string, intro: string, rows: [string, string][]): string {
  const trs = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;">${escapeHtml(k)}</td>` +
        `<td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;font-weight:600;">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  return [
    "<!DOCTYPE html>",
    `<html><body style="margin:0;padding:24px;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">`,
    `<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">`,
    `<div style="background:linear-gradient(105deg,#1e3a8a,#2563eb);padding:20px 24px;">`,
    `<span style="color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:1px;">KIRAT FOREX</span>`,
    `</div>`,
    `<div style="padding:24px;">`,
    `<h1 style="margin:0 0 8px;font-size:18px;color:#111827;">${escapeHtml(heading)}</h1>`,
    `<p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.5;">${escapeHtml(intro)}</p>`,
    `<table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;">`,
    trs,
    `</table>`,
    `<p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">Kirat Forex Pvt. Ltd. • 11/9 K. K. Banerjee Road, Berhampore, Murshidabad, WB 742101</p>`,
    `</div></div></body></html>`,
  ].join("");
}

function buildText(heading: string, intro: string, rows: [string, string][]): string {
  const details = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  return `${heading}\n\n${intro}\n\n${details}\n\n— Kirat Forex Pvt. Ltd.`;
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
    const rows = quoteRows(data);

    try {
      await sendViaResend(
        apiKey,
        from,
        [data.email],
        `Your Kirat Forex quote ${data.reference} — request received`,
        buildHtml(
          "Your quote request has been received",
          "Namaste! Thank you for choosing Kirat Forex. Here are the details of your quote request. Our team will contact you shortly on your mobile number.",
          rows,
        ),
        buildText(
          "Your quote request has been received",
          "Thank you for choosing Kirat Forex. Details of your quote request:",
          rows,
        ),
      );
      await sendViaResend(
        apiKey,
        from,
        [ADMIN_EMAIL],
        `New quote request ${data.reference} from +91 ${data.mobile}`,
        buildHtml(
          "New quote request",
          `A new quote request was submitted on the website by +91 ${data.mobile} (${data.email}).`,
          rows,
        ),
        buildText(
          "New quote request",
          `A new quote request was submitted on the website by +91 ${data.mobile} (${data.email}).`,
          rows,
        ),
      );
      return { sent: true };
    } catch (err) {
      console.error("[email] Failed to send quote emails:", err);
      return { sent: false, reason: "send_failed" };
    }
  });

export async function sendQuoteEmails(payload: QuoteEmailPayload): Promise<EmailResult> {
  try {
    return await sendQuoteEmailsServer({ data: payload });
  } catch (err) {
    console.error("[email] sendQuoteEmails failed:", err);
    return { sent: false, reason: "client_error" };
  }
}
