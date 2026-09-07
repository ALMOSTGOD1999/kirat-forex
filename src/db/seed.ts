/**
 * Seed script — run with: npx tsx src/db/seed.ts
 *
 * Requires DATABASE_URL in your .env file.
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcryptjs from "bcryptjs";
const { hash } = bcryptjs;
import * as schema from "./schema";
import { CURRENCIES } from "@/lib/forex-data";

const sql = neon(process.env["DATABASE_URL"]!);
const db = drizzle(sql, { schema });

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function main() {
  console.log("Seeding database...");

  // ── Admin user ──────────────────────────────────────────────────────────────
  const adminPasswordHash = await hash("kirat@123", 10);

  await db
    .insert(schema.users)
    .values({
      id: "admin",
      name: "Kirat Admin",
      email: "admin@kiratforex.com",
      passwordHash: adminPasswordHash,
      role: "admin",
    })
    .onConflictDoNothing();

  console.log("✓ Admin user seeded (admin@kiratforex.com / kirat@123)");

  // ── Default payment settings ────────────────────────────────────────────────
  await db
    .insert(schema.paymentSettings)
    .values({
      id: "default",
      bankName: "HDFC Bank",
      accountName: "Kirat Forex Pvt. Ltd.",
      accountNumber: "50200071234567",
      ifsc: "HDFC0001234",
      branch: "Berhampore, Murshidabad",
      upiId: "kiratforex@hdfcbank",
      qrImage: "",
      advancePercent: 10,
    })
    .onConflictDoNothing();

  console.log("✓ Default payment settings seeded");

  // ── Create daily_rates table if not exists ───────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS daily_rates (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      date TEXT NOT NULL,
      buy DOUBLE PRECISION NOT NULL,
      sell DOUBLE PRECISION NOT NULL
    )
  `;
  console.log("✓ daily_rates table ensured");

  // ── Create custom_currencies table if not exists ─────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS custom_currencies (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL,
      flag TEXT NOT NULL
    )
  `;
  console.log("✓ custom_currencies table ensured");

  // ── Seed today's rates from forex-data defaults ──────────────────────────────
  const date = today();
  for (const c of CURRENCIES) {
    const id = `${c.code}-${date}`;
    await sql`
      INSERT INTO daily_rates (id, code, date, buy, sell)
      VALUES (${id}, ${c.code}, ${date}, ${c.buy}, ${c.sell})
      ON CONFLICT (id) DO UPDATE SET buy = ${c.buy}, sell = ${c.sell}
    `;
  }
  console.log(`✓ Today's rates seeded (${date})`);

  console.log("\nDone!");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
