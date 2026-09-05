/**
 * Seed script — run with: npx tsx src/db/seed.ts
 *
 * Requires DATABASE_URL in your .env file.
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcryptjs";
import * as schema from "./schema";

const sql = neon(process.env["DATABASE_URL"]!);
const db = drizzle(sql, { schema });

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

  console.log("\nDone!");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
