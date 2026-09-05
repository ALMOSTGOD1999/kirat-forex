import { pgTable, text, integer, real } from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"), // "admin" | "user"
});

// ─── Sessions (cookie-based) ─────────────────────────────────────────────────
export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// ─── Quote Requests ──────────────────────────────────────────────────────────
export const quoteRequests = pgTable("quote_requests", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  mode: text("mode").notNull(), // "buy" | "sell"
  code: text("code").notNull(),
  fxAmount: text("fx_amount").notNull(),
  inrAmount: text("inr_amount").notNull(),
  rate: real("rate").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email").notNull(),
  advance: text("advance").notNull(),
  reference: text("reference").notNull(),
  status: text("status").notNull().default("pending"), // "pending" | "approved" | "rejected"
});

// ─── Hero Slides ─────────────────────────────────────────────────────────────
export const heroSlides = pgTable("hero_slides", {
  id: text("id").primaryKey(),
  position: integer("position").notNull(),
  img: text("img").notNull(),
  title: text("title").notNull(),
  sub: text("sub").notNull(),
});

// ─── Payment Settings (single row) ──────────────────────────────────────────
export const paymentSettings = pgTable("payment_settings", {
  id: text("id").primaryKey().default("default"),
  bankName: text("bank_name").notNull().default(""),
  accountName: text("account_name").notNull().default(""),
  accountNumber: text("account_number").notNull().default(""),
  ifsc: text("ifsc").notNull().default(""),
  branch: text("branch").notNull().default(""),
  upiId: text("upi_id").notNull().default(""),
  qrImage: text("qr_image").notNull().default(""),
  advancePercent: integer("advance_percent").notNull().default(10),
});
