import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { hash, compare } from "bcryptjs";
import { db } from "../db";
import { users, sessions } from "../db/schema";

export type Role = "admin" | "user";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

const SALT_ROUNDS = 10;
const SESSION_COOKIE = "kf-session";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function setCookie(name: string, value: string, maxAge: number): string {
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

function clearCookie(name: string): string {
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

// ─── Server Functions ────────────────────────────────────────────────────────

export const signUp = createServerFn({ method: "POST" })
  .validator((input: { name: string; email: string; password: string }) => input)
  .handler(async ({ data }) => {
    const { name, email, password } = data;
    const clean = email.trim().toLowerCase();

    // Check for existing user
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, clean))
      .limit(1);

    if (existing.length > 0) {
      throw new Error("An account with this email already exists.");
    }

    const id = `U${Date.now().toString(36).toUpperCase()}`;
    const passwordHash = await hash(password, SALT_ROUNDS);

    await db.insert(users).values({
      id,
      name: name.trim() || "Customer",
      email: clean,
      passwordHash,
      role: "user",
    });

    // Create session
    const token = generateToken();
    await db.insert(sessions).values({ token, userId: id });

    const user: AppUser = {
      id,
      name: name.trim() || "Customer",
      email: clean,
      role: "user",
    };

    return { user, cookie: setCookie(SESSION_COOKIE, token, 60 * 60 * 24 * 30) };
  });

export const signIn = createServerFn({ method: "POST" })
  .validator((input: { email: string; password: string }) => input)
  .handler(async ({ data }) => {
    const { email, password } = data;
    const clean = email.trim().toLowerCase();

    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, clean))
      .limit(1);

    if (rows.length === 0) {
      throw new Error("Invalid email or password.");
    }

    const found = rows[0]!;
    const valid = await compare(password, found.passwordHash);
    if (!valid) {
      throw new Error("Invalid email or password.");
    }

    // Create session
    const token = generateToken();
    await db.insert(sessions).values({ token, userId: found.id });

    const user: AppUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role as Role,
    };

    return { user, cookie: setCookie(SESSION_COOKIE, token, 60 * 60 * 24 * 30) };
  });

export const signOut = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    await db.delete(sessions).where(eq(sessions.token, data.token));
    return { cookie: clearCookie(SESSION_COOKIE) };
  });

export const currentUser = createServerFn({ method: "GET" })
  .validator((input: { token?: string }) => input)
  .handler(async ({ data }) => {
    if (!data.token) return null;

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.token, data.token))
      .limit(1);

    if (rows.length === 0) return null;

    const row = rows[0]!;
    return { id: row.id, name: row.name, email: row.email, role: row.role as Role } as AppUser;
  });
