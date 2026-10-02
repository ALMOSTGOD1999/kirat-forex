/**
 * Currency assets — hidden (deleted) currencies and uploaded currency icons.
 */
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { hiddenCurrencies, currencyIcons } from "@/db/schema";

export type CurrencyIcon = { code: string; img: string };

// ─── Hidden currencies ──────────────────────────────────────────────────────

/** Codes of currencies the admin removed from the site. */
export const loadHiddenCurrencies = createServerFn({ method: "GET" }).handler(async () => {
  const { db } = await import("@/db");
  const rows = await db.select().from(hiddenCurrencies);
  return rows.map((r) => r.code);
});

/** Remove a built-in currency from the site (restorable). */
export const hideCurrency = createServerFn({ method: "POST" })
  .validator((code: string) => code)
  .handler(async ({ data: code }) => {
    const { db } = await import("@/db");
    await db.insert(hiddenCurrencies).values({ code }).onConflictDoNothing();
  });

/** Restore a previously removed currency. */
export const unhideCurrency = createServerFn({ method: "POST" })
  .validator((code: string) => code)
  .handler(async ({ data: code }) => {
    const { db } = await import("@/db");
    await db.delete(hiddenCurrencies).where(eq(hiddenCurrencies.code, code));
  });

// ─── Currency icons ─────────────────────────────────────────────────────────

/** All uploaded currency icons. */
export const loadCurrencyIcons = createServerFn({ method: "GET" }).handler(async () => {
  const { db } = await import("@/db");
  const rows = await db.select().from(currencyIcons);
  return rows as CurrencyIcon[];
});

/** Upload/replace a currency icon (already-compressed data URL). */
export const saveCurrencyIcon = createServerFn({ method: "POST" })
  .validator((input: { code: string; img: string }) => input)
  .handler(async ({ data }) => {
    if (!data.img.startsWith("data:image/")) {
      throw new Error("Icon must be an image data URL");
    }
    if (data.img.length > 300_000) {
      throw new Error("Icon too large after compression");
    }
    const { db } = await import("@/db");
    await db
      .insert(currencyIcons)
      .values({ code: data.code, img: data.img })
      .onConflictDoUpdate({ target: currencyIcons.code, set: { img: data.img } });
  });

/** Remove a currency icon. */
export const deleteCurrencyIcon = createServerFn({ method: "POST" })
  .validator((code: string) => code)
  .handler(async ({ data: code }) => {
    const { db } = await import("@/db");
    await db.delete(currencyIcons).where(eq(currencyIcons.code, code));
  });
