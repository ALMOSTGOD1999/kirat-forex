import { createServerFn } from "@tanstack/react-start";
import carousel1 from "@/assets/carousel-1.jpg";
import carousel2 from "@/assets/carousel-2.jpg";
import carousel3 from "@/assets/carousel-3.jpg";

export type HeroSlide = {
  id: string;
  img: string;
  title: string;
  sub: string;
};

export const DEFAULT_SLIDES: HeroSlide[] = [
  { id: "s1", img: carousel1, title: "Best Forex Rates", sub: "in Murshidabad, every single day" },
  { id: "s2", img: carousel2, title: "Travel The World", sub: "with currency ready before you fly" },
  { id: "s3", img: carousel3, title: "Doorstep Delivery", sub: "cash & cards delivered to your home" },
];

export const MAX_SLIDES = 4;

// ─── Server Functions ────────────────────────────────────────────────────────

const loadHeroSlidesServer = createServerFn({ method: "GET" }).handler(async () => {
  const { db } = await import("@/db");
  const { heroSlides } = await import("@/db/schema");
  const { asc } = await import("drizzle-orm");

  const rows = await db.select().from(heroSlides).orderBy(asc(heroSlides.position));
  return rows.map((r) => ({ id: r.id, img: r.img, title: r.title, sub: r.sub }));
});

const saveHeroSlidesServer = createServerFn({ method: "POST" })
  .validator((input: { slides: HeroSlide[] }) => input)
  .handler(async ({ data }) => {
    const { db } = await import("@/db");
    const { heroSlides } = await import("@/db/schema");

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

// ─── Client-side exports ─────────────────────────────────────────────────────

export async function loadHeroSlides(): Promise<HeroSlide[]> {
  const slides = await loadHeroSlidesServer();
  return slides.length > 0 ? slides : DEFAULT_SLIDES;
}

export async function saveHeroSlides(slides: HeroSlide[]): Promise<void> {
  await saveHeroSlidesServer({ data: { slides: slides.slice(0, MAX_SLIDES) } });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("kf-hero-slides-changed"));
  }
}

export async function resetHeroSlides(): Promise<void> {
  await saveHeroSlidesServer({ data: { slides: [] } });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("kf-hero-slides-changed"));
  }
}
