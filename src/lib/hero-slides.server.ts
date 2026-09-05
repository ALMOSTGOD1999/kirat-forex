import { createServerFn } from "@tanstack/react-start";
import { eq, asc } from "drizzle-orm";
import { db } from "../db";
import { heroSlides } from "../db/schema";

export type HeroSlide = {
  id: string;
  img: string;
  title: string;
  sub: string;
};

// ─── Server Functions ────────────────────────────────────────────────────────

export const loadHeroSlides = createServerFn({ method: "GET" })
  .handler(async () => {
    const rows = await db
      .select()
      .from(heroSlides)
      .orderBy(asc(heroSlides.position));

    return rows.map((r) => ({
      id: r.id,
      img: r.img,
      title: r.title,
      sub: r.sub,
    }));
  });

export const saveHeroSlides = createServerFn({ method: "POST" })
  .validator((input: { slides: HeroSlide[] }) => input)
  .handler(async ({ data }) => {
    // Clear all existing slides and re-insert in order
    await db.delete(heroSlides);

    if (data.slides.length > 0) {
      await db.insert(heroSlides).values(
        data.slides.map((s, i) => ({
          id: s.id,
          position: i,
          img: s.img,
          title: s.title,
          sub: s.sub,
        })),
      );
    }
  });
