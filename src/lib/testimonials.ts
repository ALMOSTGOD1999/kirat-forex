import { createServerFn } from "@tanstack/react-start";

export type TestimonialStatus = "pending" | "approved";

export type Testimonial = {
  id: string;
  createdAt: number;
  name: string;
  content: string;
  status: TestimonialStatus;
};

export const MIN_TESTIMONIAL_LENGTH = 10;
export const MAX_TESTIMONIAL_LENGTH = 500;

export function newTestimonialId(): string {
  return `KT${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
}

// ─── Server Functions ────────────────────────────────────────────────────────

const createTestimonialServer = createServerFn({ method: "POST" })
  .validator((input: { id: string; createdAt: number; name: string; content: string }) => input)
  .handler(async ({ data }) => {
    const content = data.content.trim();
    if (content.length < MIN_TESTIMONIAL_LENGTH) {
      throw new Error("Testimonial is too short");
    }
    if (content.length > MAX_TESTIMONIAL_LENGTH) {
      throw new Error("Testimonial is too long");
    }
    const { db } = await import("@/db");
    const { testimonials } = await import("@/db/schema");

    await db.insert(testimonials).values({
      id: data.id,
      createdAt: data.createdAt,
      name: data.name.trim().slice(0, 60),
      content,
      status: "pending",
    });
  });

const loadApprovedTestimonialsServer = createServerFn({ method: "GET" }).handler(async () => {
  const { db } = await import("@/db");
  const { testimonials } = await import("@/db/schema");
  const { desc, eq } = await import("drizzle-orm");

  const rows = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.status, "approved"))
    .orderBy(desc(testimonials.createdAt));

  return rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    name: r.name,
    content: r.content,
  }));
});

const loadAllTestimonialsServer = createServerFn({ method: "GET" }).handler(async () => {
  const { db } = await import("@/db");
  const { testimonials } = await import("@/db/schema");
  const { desc } = await import("drizzle-orm");

  const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));

  return rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt,
    name: r.name,
    content: r.content,
    status: r.status as TestimonialStatus,
  }));
});

const setTestimonialStatusServer = createServerFn({ method: "POST" })
  .validator((input: { id: string; status: TestimonialStatus }) => input)
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    const { testimonials } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    await db.update(testimonials).set({ status: data.status }).where(eq(testimonials.id, data.id));
  });

const deleteTestimonialServer = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    const { testimonials } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    await db.delete(testimonials).where(eq(testimonials.id, data.id));
  });

// ─── Client-side exports ─────────────────────────────────────────────────────

export async function createTestimonial(input: {
  id: string;
  createdAt: number;
  name: string;
  content: string;
}): Promise<void> {
  await createTestimonialServer({ data: input });
}

export async function loadApprovedTestimonials(): Promise<
  { id: string; createdAt: number; name: string; content: string }[]
> {
  return await loadApprovedTestimonialsServer();
}

export async function loadAllTestimonials(): Promise<Testimonial[]> {
  return await loadAllTestimonialsServer();
}

export async function setTestimonialStatus(id: string, status: TestimonialStatus): Promise<void> {
  await setTestimonialStatusServer({ data: { id, status } });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteTestimonialServer({ data: { id } });
}
