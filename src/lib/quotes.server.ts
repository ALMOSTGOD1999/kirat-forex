import { createServerFn } from "@tanstack/react-start";
import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { quoteRequests } from "../db/schema";

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

// ─── Server Functions ────────────────────────────────────────────────────────

export const loadQuotes = createServerFn({ method: "GET" })
  .handler(async () => {
    const rows = await db
      .select()
      .from(quoteRequests)
      .orderBy(desc(quoteRequests.createdAt));

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

export const getQuote = createServerFn({ method: "GET" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
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

export const saveQuote = createServerFn({ method: "POST" })
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

export const setQuoteStatus = createServerFn({ method: "POST" })
  .validator((input: { id: string; status: QuoteStatus }) => input)
  .handler(async ({ data }) => {
    await db
      .update(quoteRequests)
      .set({ status: data.status })
      .where(eq(quoteRequests.id, data.id));
  });

export const deleteQuote = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    await db.delete(quoteRequests).where(eq(quoteRequests.id, data.id));
  });

export const newQuoteId = createServerFn({ method: "GET" })
  .handler(() => {
    return `KF${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
  });
