import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { paymentSettings } from "../db/schema";

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

const DEFAULTS: PaymentSettings = {
  bankName: "HDFC Bank",
  accountName: "Kirat Forex Pvt. Ltd.",
  accountNumber: "50200071234567",
  ifsc: "HDFC0001234",
  branch: "Berhampore, Murshidabad",
  upiId: "kiratforex@hdfcbank",
  qrImage: "",
  advancePercent: 10,
};

// ─── Server Functions ────────────────────────────────────────────────────────

export const loadPaymentSettings = createServerFn({ method: "GET" })
  .handler(async () => {
    const rows = await db
      .select()
      .from(paymentSettings)
      .where(eq(paymentSettings.id, "default"))
      .limit(1);

    if (rows.length === 0) return DEFAULTS;

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

export const savePaymentSettings = createServerFn({ method: "POST" })
  .validator((input: PaymentSettings) => input)
  .handler(async ({ data }) => {
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
