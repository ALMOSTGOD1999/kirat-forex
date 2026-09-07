/**
 * Daily rates — server functions for admin to set currency rates.
 */
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { dailyRates, customCurrencies } from "@/db/schema";
import { CURRENCIES, RATE_UPDATED } from "@/lib/forex-data";

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export type DailyRate = {
  code: string;
  buy: number;
  sell: number;
};

/** Load today's rates from the database (including custom currencies). Falls back to static CURRENCIES if none set. */
export const loadDailyRates = createServerFn({ method: "GET" }).handler(async () => {
  const { db } = await import("@/db");
  const date = today();
  const [rows, customRows] = await Promise.all([
    db.select().from(dailyRates).where(eq(dailyRates.date, date)),
    db.select().from(customCurrencies),
  ]);

  // Build the base list from static CURRENCIES
  const staticRates = CURRENCIES.map((c) => ({ code: c.code, buy: c.buy, sell: c.sell }));

  // Add custom currencies that don't have rates yet
  for (const cc of customRows) {
    if (!staticRates.find((r) => r.code === cc.code)) {
      staticRates.push({ code: cc.code, buy: 0, sell: 0 });
    }
  }

  if (rows.length === 0) {
    return staticRates;
  }

  // Merge DB rates with the full list
  const map = new Map(rows.map((r) => [r.code, { buy: r.buy, sell: r.sell }]));
  return staticRates.map((c) => {
    const dbRate = map.get(c.code);
    return {
      code: c.code,
      buy: dbRate?.buy ?? c.buy,
      sell: dbRate?.sell ?? c.sell,
    };
  });
});

/** Save rates for today (upsert per currency). */
export const saveDailyRates = createServerFn({ method: "POST" })
  .validator((rates: DailyRate[]) => rates)
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    const date = today();

    for (const r of data) {
      const id = `${r.code}-${date}`;
      await db
        .insert(dailyRates)
        .values({ id, code: r.code, date, buy: r.buy, sell: r.sell })
        .onConflictDoUpdate({
          target: dailyRates.id,
          set: { buy: r.buy, sell: r.sell },
        });
    }
  });

/** Get the last updated timestamp (today's date or static fallback). */
export const getLastUpdated = createServerFn({ method: "GET" }).handler(async () => {
  const { db } = await import("@/db");
  const date = today();
  const rows = await db
    .select()
    .from(dailyRates)
    .where(eq(dailyRates.date, date))
    .limit(1);

  if (rows.length === 0) return RATE_UPDATED;

  // Format today's date nicely
  const d = new Date();
  const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return `${date} ${time}`;
});
