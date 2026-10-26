/**
 * Daily rates — server functions for admin to set currency rates.
 */
import { createServerFn } from "@tanstack/react-start";
import { desc } from "drizzle-orm";
import { dailyRates, customCurrencies, hiddenCurrencies } from "@/db/schema";
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

/** Load the latest saved rates (per currency, any date) including custom currencies, excluding removed ones. Falls back to static CURRENCIES if none set. Rates stay until the admin changes them again. */
export const loadDailyRates = createServerFn({ method: "GET" }).handler(async () => {
  const { db } = await import("@/db");
  const [rows, customRows, hiddenRows] = await Promise.all([
    // Latest saved rate per currency — not date-scoped, so admin edits persist
    // across days until the next change.
    db
      .selectDistinctOn([dailyRates.code], {
        code: dailyRates.code,
        buy: dailyRates.buy,
        sell: dailyRates.sell,
      })
      .from(dailyRates)
      .orderBy(dailyRates.code, desc(dailyRates.date)),
    db.select().from(customCurrencies),
    db.select().from(hiddenCurrencies),
  ]);
  const hidden = new Set(hiddenRows.map((h) => h.code));

  // Build the base list from static CURRENCIES
  const staticRates = CURRENCIES.map((c) => ({ code: c.code, buy: c.buy, sell: c.sell }));

  // Add custom currencies that don't have rates yet
  for (const cc of customRows) {
    if (!staticRates.find((r) => r.code === cc.code)) {
      staticRates.push({ code: cc.code, buy: 0, sell: 0 });
    }
  }

  // Drop currencies the admin removed from the site
  const visible = staticRates.filter((c) => !hidden.has(c.code));

  // Merge DB rates with the full list (codes never saved keep static defaults)
  const map = new Map(rows.map((r) => [r.code, { buy: r.buy, sell: r.sell }]));
  return visible.map((c) => {
    const dbRate = map.get(c.code);
    return {
      code: c.code,
      buy: dbRate?.buy ?? c.buy,
      sell: dbRate?.sell ?? c.sell,
    };
  });
});

/** Save rates for today (upsert per currency), stamping the exact save time. */
export const saveDailyRates = createServerFn({ method: "POST" })
  .validator((rates: DailyRate[]) => rates)
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    const date = today();
    const savedAt = new Date();

    for (const r of data) {
      const id = `${r.code}-${date}`;
      await db
        .insert(dailyRates)
        .values({ id, code: r.code, date, buy: r.buy, sell: r.sell, updatedAt: savedAt })
        .onConflictDoUpdate({
          target: dailyRates.id,
          set: { buy: r.buy, sell: r.sell, updatedAt: savedAt },
        });
    }
  });

/** Get the last updated stamp (date + IST time of the latest save; date-only for rows saved before timestamps existed). */
export const getLastUpdated = createServerFn({ method: "GET" }).handler(async () => {
  const { db } = await import("@/db");
  const rows = await db
    .select({ date: dailyRates.date, updatedAt: dailyRates.updatedAt })
    .from(dailyRates)
    .orderBy(desc(dailyRates.date))
    .limit(1);

  const latest = rows[0];
  if (!latest) return RATE_UPDATED;
  if (!latest.updatedAt) return latest.date;

  const d = new Date(latest.updatedAt);
  const istDate = d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
  const istTime = d.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${istDate} ${istTime}`;
});
