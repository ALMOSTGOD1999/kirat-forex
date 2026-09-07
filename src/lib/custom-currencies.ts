/**
 * Custom currencies — server functions for admin to add/remove currencies.
 */
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { customCurrencies } from "@/db/schema";

export type CustomCurrency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
};

/** Load all custom currencies. */
export const loadCustomCurrencies = createServerFn({ method: "GET" }).handler(async () => {
  const { db } = await import("@/db");
  const rows = await db.select().from(customCurrencies);
  return rows as CustomCurrency[];
});

/** Save a custom currency (upsert). */
export const saveCustomCurrency = createServerFn({ method: "POST" })
  .validator((currency: CustomCurrency) => currency)
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    await db
      .insert(customCurrencies)
      .values(data)
      .onConflictDoUpdate({
        target: customCurrencies.code,
        set: { name: data.name, symbol: data.symbol, flag: data.flag },
      });
  });

/** Delete a custom currency by code. */
export const deleteCustomCurrency = createServerFn({ method: "POST" })
  .validator((code: string) => code)
  .handler(async ({ data: code }) => {
    const { db } = await import("@/db");
    await db.delete(customCurrencies).where(eq(customCurrencies.code, code));
  });
