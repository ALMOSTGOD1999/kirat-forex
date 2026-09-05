import { createServerFn } from "@tanstack/react-start";

export type Role = "admin" | "user";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export const AUTH_EVENT = "kf-auth-changed";

/** Seed admin so the control room is reachable before the real backend exists. */
export const DEFAULT_ADMIN = {
  email: "admin@kiratforex.com",
  password: "kirat@123",
};

const SESSION_KEY = "kf-session";

// ─── Client helpers ──────────────────────────────────────────────────────────

function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(AUTH_EVENT));
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, token);
  emit();
}

function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  emit();
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── Server Functions ────────────────────────────────────────────────────────

const currentUserServer = createServerFn({ method: "GET" })
  .validator((input: { token?: string | null }) => input)
  .handler(async ({ data }) => {
    if (!data.token) return null;

    const { db } = await import("@/db");
    const { users, sessions } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

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

const signInServer = createServerFn({ method: "POST" })
  .validator((input: { email: string; password: string }) => input)
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    const { users, sessions } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const { compare } = await import("bcryptjs");

    const clean = data.email.trim().toLowerCase();

    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, clean))
      .limit(1);

    if (rows.length === 0) {
      throw new Error("Invalid email or password.");
    }

    const found = rows[0]!;
    const valid = await compare(data.password, found.passwordHash);
    if (!valid) {
      throw new Error("Invalid email or password.");
    }

    const token = generateToken();
    await db.insert(sessions).values({ token, userId: found.id });

    return {
      user: {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role as Role,
      } as AppUser,
      token,
    };
  });

const signUpServer = createServerFn({ method: "POST" })
  .validator((input: { name: string; email: string; password: string }) => input)
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    const { users, sessions } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const { hash } = await import("bcryptjs");

    const clean = data.email.trim().toLowerCase();

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, clean))
      .limit(1);

    if (existing.length > 0) {
      throw new Error("An account with this email already exists.");
    }

    const id = `U${Date.now().toString(36).toUpperCase()}`;
    const passwordHash = await hash(data.password, 10);

    await db.insert(users).values({
      id,
      name: data.name.trim() || "Customer",
      email: clean,
      passwordHash,
      role: "user",
    });

    const token = generateToken();
    await db.insert(sessions).values({ token, userId: id });

    return {
      user: {
        id,
        name: data.name.trim() || "Customer",
        email: clean,
        role: "user" as Role,
      } as AppUser,
      token,
    };
  });

const signOutServer = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    const { sessions } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    await db.delete(sessions).where(eq(sessions.token, data.token));
  });

// ─── Client-side exports ─────────────────────────────────────────────────────

export async function currentUser(): Promise<AppUser | null> {
  const token = getToken();
  if (!token) return null;
  try {
    return await currentUserServer({ data: { token } });
  } catch {
    clearToken();
    return null;
  }
}

export async function signIn(email: string, password: string): Promise<AppUser> {
  const result = await signInServer({ data: { email, password } });
  setToken(result.token);
  return result.user;
}

export async function signUp(name: string, email: string, password: string): Promise<AppUser> {
  const result = await signUpServer({ data: { name, email, password } });
  setToken(result.token);
  return result.user;
}

export async function signOut(): Promise<void> {
  const token = getToken();
  if (token) {
    try {
      await signOutServer({ data: { token } });
    } catch {
      // ignore signOut errors
    }
  }
  clearToken();
}
