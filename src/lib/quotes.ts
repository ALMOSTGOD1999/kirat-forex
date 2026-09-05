import { createServerFn } from "@tanstack/react-start";

export type QuoteStatus = "pending" | "approved" | "rejected";

export type QuoteRequest = {
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
  status: QuoteStatus;
};

export type PaymentSettings = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  upiId: string;
  qrImage: string;
  advancePercent: number;
};

export const DEFAULT_PAYMENT: PaymentSettings = {
  bankName: "HDFC Bank",
  accountName: "Kirat Forex Pvt. Ltd.",
  accountNumber: "50200071234567",
  ifsc: "HDFC0001234",
  branch: "Berhampore, Murshidabad",
  upiId: "kiratforex@hdfcbank",
  qrImage: "",
  advancePercent: 10,
};

export const QUOTES_EVENT = "kf-quotes-changed";

function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(QUOTES_EVENT));
}

// ─── Server Functions ────────────────────────────────────────────────────────

const loadQuotesServer = createServerFn({ method: "GET" }).handler(async () => {
  const { db } = await import("@/db");
  const { quoteRequests } = await import("@/db/schema");
  const { desc } = await import("drizzle-orm");

  const rows = await db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt));

  return rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    mode: r.mode as "buy" | "sell",
    code: r.code,
    fxAmount: r.fxAmount,
    inrAmount: r.inrAmount,
    rate: r.rate,
    mobile: r.mobile,
    email: r.email,
    advance: r.advance,
    reference: r.reference,
    status: r.status as QuoteStatus,
  }));
});

const getQuoteServer = createServerFn({ method: "GET" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    const { quoteRequests } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const rows = await db
      .select()
      .from(quoteRequests)
      .where(eq(quoteRequests.id, data.id))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0]!;
    return {
      id: r.id,
      createdAt: r.createdAt,
      mode: r.mode as "buy" | "sell",
      code: r.code,
      fxAmount: r.fxAmount,
      inrAmount: r.inrAmount,
      rate: r.rate,
      mobile: r.mobile,
      email: r.email,
      advance: r.advance,
      reference: r.reference,
      status: r.status as QuoteStatus,
    };
  });

const saveQuoteServer = createServerFn({ method: "POST" })
  .validator(
    (input: {
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
      status: QuoteStatus;
    }) => input,
  )
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    const { quoteRequests } = await import("@/db/schema");

    await db
      .insert(quoteRequests)
      .values({
        id: data.id,
        createdAt: data.createdAt,
        mode: data.mode,
        code: data.code,
        fxAmount: data.fxAmount,
        inrAmount: data.inrAmount,
        rate: data.rate,
        mobile: data.mobile,
        email: data.email,
        advance: data.advance,
        reference: data.reference,
        status: data.status,
      })
      .onConflictDoUpdate({
        target: quoteRequests.id,
        set: {
          mode: data.mode,
          code: data.code,
          fxAmount: data.fxAmount,
          inrAmount: data.inrAmount,
          rate: data.rate,
          mobile: data.mobile,
          email: data.email,
          advance: data.advance,
          reference: data.reference,
          status: data.status,
        },
      });
  });

const setQuoteStatusServer = createServerFn({ method: "POST" })
  .validator((input: { id: string; status: QuoteStatus }) => input)
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    const { quoteRequests } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    await db.update(quoteRequests).set({ status: data.status }).where(eq(quoteRequests.id, data.id));
  });

const deleteQuoteServer = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    const { quoteRequests } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    await db.delete(quoteRequests).where(eq(quoteRequests.id, data.id));
  });

const loadPaymentSettingsServer = createServerFn({ method: "GET" }).handler(async () => {
  const { db } = await import("@/db");
  const { paymentSettings } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  const rows = await db
    .select()
    .from(paymentSettings)
    .where(eq(paymentSettings.id, "default"))
    .limit(1);

  if (rows.length === 0) return DEFAULT_PAYMENT;
  const r = rows[0]!;
  return {
    bankName: r.bankName,
    accountName: r.accountName,
    accountNumber: r.accountNumber,
    ifsc: r.ifsc,
    branch: r.branch,
    upiId: r.upiId,
    qrImage: r.qrImage,
    advancePercent: r.advancePercent,
  };
});

const savePaymentSettingsServer = createServerFn({ method: "POST" })
  .validator((input: PaymentSettings) => input)
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    const { paymentSettings } = await import("@/db/schema");

    await db
      .insert(paymentSettings)
      .values({
        id: "default",
        bankName: data.bankName,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        ifsc: data.ifsc,
        branch: data.branch,
        upiId: data.upiId,
        qrImage: data.qrImage,
        advancePercent: data.advancePercent,
      })
      .onConflictDoUpdate({
        target: paymentSettings.id,
        set: {
          bankName: data.bankName,
          accountName: data.accountName,
          accountNumber: data.accountNumber,
          ifsc: data.ifsc,
          branch: data.branch,
          upiId: data.upiId,
          qrImage: data.qrImage,
          advancePercent: data.advancePercent,
        },
      });
  });

// ─── Client-side exports ─────────────────────────────────────────────────────

export function newQuoteId(): string {
  return `KF${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
}

export async function loadQuotes(): Promise<QuoteRequest[]> {
  return await loadQuotesServer();
}

export async function getQuote(id: string): Promise<QuoteRequest | undefined> {
  return (await getQuoteServer({ data: { id } })) ?? undefined;
}

export async function saveQuote(q: QuoteRequest): Promise<void> {
  await saveQuoteServer({ data: q });
  emit();
}

export async function setQuoteStatus(id: string, status: QuoteStatus): Promise<void> {
  await setQuoteStatusServer({ data: { id, status } });
  emit();
}

export async function deleteQuote(id: string): Promise<void> {
  await deleteQuoteServer({ data: { id } });
  emit();
}

export async function loadPaymentSettings(): Promise<PaymentSettings> {
  return await loadPaymentSettingsServer();
}

export async function savePaymentSettings(p: PaymentSettings): Promise<void> {
  await savePaymentSettingsServer({ data: p });
}
