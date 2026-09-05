import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  Building2,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Coins,
  Globe2,
  Headphones,
  Hotel,
  IdCard,
  MessageCircle,
  Moon,
  Plane,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import heroImg from "@/assets/travel-hero.jpg";
import {
  DESTINATIONS,
  TRAVEL,
  TRAVEL_SERVICES,
  TRAVEL_TESTIMONIALS,
  TRAVEL_WHY,
} from "@/lib/travel-data";
import { COMPANY } from "@/lib/forex-data";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/travel")({
  head: () => ({
    meta: [
      { title: "Travel — International Tours, Flights & Visa | Kirat Forex" },
      {
        name: "description",
        content:
          "Kirat Travel: handpicked international holiday packages, flight & hotel booking, visa assistance, travel insurance and forex from Murshidabad.",
      },
      { property: "og:title", content: "Travel with Kirat — Tours, Flights, Visa & Forex" },
      {
        property: "og:description",
        content:
          "Dream it. Book it. Experience it. Handpicked destinations, best price guarantee and 24/7 support.",
      },
    ],
  }),
  component: TravelPage,
});

const ICONS: Record<string, typeof Plane> = {
  globe: Globe2,
  plane: Plane,
  hotel: Hotel,
  passport: IdCard,
  shield: Shield,
  coins: Coins,
  car: Car,
  moon: Moon,
};

const WHY_ICONS = [BadgeCheck, Users, Headphones, ShieldCheck, Sparkles, Star];

function TravelPage() {
  const [tab, setTab] = useState<"tours" | "flights" | "hotels">("tours");
  const [slide, setSlide] = useState(0);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks! Our travel desk will share the best options shortly.");
  };

  return (
    <div>
      {/* Utility bar */}
      <div
        className="hidden text-xs text-primary-foreground md:block"
        style={{ background: "var(--gradient-navy)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2.5">
          <span className="flex items-center gap-2">
            <Plane className="h-3.5 w-3.5 text-gold" /> {TRAVEL.tagline}
          </span>
          <span className="flex items-center gap-6">
            <span>24/7 Customer Support</span>
            <a href={`tel:${COMPANY.branch.tel}`} className="hover:text-gold">
              {COMPANY.branch.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="hover:text-gold">
              {COMPANY.email}
            </a>
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Sunset over the Eiffel Tower with hot air balloons"
          width={1600}
          height={900}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, oklch(0.24 0.07 260 / 0.88) 10%, oklch(0.24 0.07 260 / 0.45) 55%, oklch(0.24 0.07 260 / 0.7))",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="text-primary-foreground">
            <p className="animate-fade-in font-display text-2xl italic text-gold sm:text-3xl">
              Explore the World with
            </p>
            <h1 className="animate-fade-up mt-2 text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl">
              Kirat
              <br />
              Travel
            </h1>
            <p className="animate-fade-up mt-5 text-lg text-primary-foreground/90" style={{ animationDelay: "120ms" }}>
              {TRAVEL.headline}
            </p>
            <p className="animate-fade-up text-lg text-primary-foreground/80" style={{ animationDelay: "180ms" }}>
              {TRAVEL.sub}
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
              {[
                { icon: BadgeCheck, a: "Best Price", b: "Guaranteed" },
                { icon: Users, a: "Expert Travel", b: "Consultants" },
                { icon: ShieldCheck, a: "Safe & Secure", b: "Journeys" },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <li
                    key={f.a}
                    className="animate-fade-up flex items-center gap-3"
                    style={{ animationDelay: `${260 + i * 90}ms` }}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/50 text-gold">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm leading-tight">
                      <span className="block font-semibold">{f.a}</span>
                      <span className="block text-primary-foreground/70">{f.b}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Booking card */}
          <div className="animate-scale-in rounded-2xl bg-background/95 p-2 shadow-[var(--shadow-card)] backdrop-blur">
            <div className="grid grid-cols-3 border-b border-border">
              {[
                { id: "tours", label: "TOURS", icon: Globe2 },
                { id: "flights", label: "FLIGHTS", icon: Plane },
                { id: "hotels", label: "HOTELS", icon: Building2 },
              ].map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id as typeof tab)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-4 text-xs font-semibold tracking-wide transition-colors",
                      active
                        ? "border-b-2 border-gold text-navy"
                        : "border-b-2 border-transparent text-muted-foreground hover:text-navy",
                    )}
                  >
                    <Icon className={cn("h-5 w-5", active && "text-gold")} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <form onSubmit={search} className="space-y-3 p-4">
              <Field label={tab === "hotels" ? "Where to stay?" : "Where to?"}>
                <input
                  placeholder="Search your destination"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Check In" icon={<Calendar className="h-4 w-4 text-gold" />}>
                  <input type="date" className="w-full bg-transparent text-sm outline-none" />
                </Field>
                <Field label="Check Out" icon={<Calendar className="h-4 w-4 text-gold" />}>
                  <input type="date" className="w-full bg-transparent text-sm outline-none" />
                </Field>
              </div>
              <Field label="Travelers">
                <select className="w-full bg-transparent text-sm outline-none">
                  <option>2 Adults, 0 Children</option>
                  <option>1 Adult, 0 Children</option>
                  <option>2 Adults, 2 Children</option>
                  <option>4 Adults, 0 Children</option>
                </select>
              </Field>
              <button
                type="submit"
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-bold uppercase tracking-wide text-navy transition-transform duration-300 hover:scale-[1.02]"
                style={{ background: "var(--gradient-gold)" }}
              >
                <Search className="h-4 w-4" />
                Search {tab === "tours" ? "Packages" : tab === "flights" ? "Flights" : "Hotels"}
              </button>
              <a
                href={`https://wa.me/${COMPANY.branch.tel.replace("+", "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 pb-1 pt-1 text-sm font-semibold text-navy underline underline-offset-4"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" /> Need Help? Chat with us
              </a>
            </form>
          </div>
        </div>
      </section>

      {/* Service strip */}
      <section className="mx-auto -mt-8 max-w-7xl px-4 sm:px-6">
        <div className="surface-card relative z-10 grid grid-cols-2 gap-px overflow-hidden bg-border sm:grid-cols-4 lg:grid-cols-8">
          {TRAVEL_SERVICES.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Plane;
            return (
              <Reveal
                key={s.label}
                delay={i * 60}
                from="scale"
                className="group flex flex-col items-center gap-2 bg-card px-3 py-6 text-center transition-colors hover:bg-accent/60"
              >
                <Icon className="h-7 w-7 text-navy transition-transform duration-300 group-hover:-translate-y-1 group-hover:text-primary" />
                <span className="whitespace-pre-line text-xs font-semibold leading-tight text-navy">
                  {s.label}
                </span>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Popular destinations */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal className="text-center">
          <h2 className="flex items-center justify-center gap-4 text-2xl font-bold uppercase tracking-wide text-navy">
            <span className="hidden h-px w-16 bg-gold sm:block" />
            Popular Destinations
            <span className="hidden h-px w-16 bg-gold sm:block" />
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">Handpicked destinations just for you</p>
        </Reveal>

        <div className="relative mt-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {DESTINATIONS.map((d, i) => (
              <Reveal
                key={d.name}
                delay={i * 80}
                className={cn(
                  "surface-card hover-lift overflow-hidden p-0",
                  i < slide ? "hidden xl:block" : "",
                )}
              >
                <div className="overflow-hidden">
                  <img
                    src={d.image}
                    alt={`${d.name} holiday package`}
                    loading="lazy"
                    width={768}
                    height={576}
                    className="h-40 w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-bold text-navy">{d.name}</h3>
                  <p className="text-xs text-muted-foreground">{d.nights}</p>
                  <p className="mt-1 text-sm font-semibold text-navy">
                    From <span className="text-gold">₹{d.price}</span>
                  </p>
                  <Link
                    to="/contact"
                    className="mt-3 block rounded-md py-2 text-center text-xs font-bold uppercase tracking-wide text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
                    style={{ background: "var(--gradient-navy)" }}
                  >
                    Explore
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-3 xl:hidden">
            <button
              type="button"
              onClick={() => setSlide((s) => Math.max(0, s - 1))}
              aria-label="Previous destinations"
              className="grid h-10 w-10 place-items-center rounded-full border border-gold text-gold transition-colors hover:bg-gold hover:text-navy"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setSlide((s) => Math.min(DESTINATIONS.length - 1, s + 1))}
              aria-label="Next destinations"
              className="grid h-10 w-10 place-items-center rounded-full border border-gold text-gold transition-colors hover:bg-gold hover:text-navy"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Why choose + testimonials */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-2">
        <Reveal from="left" className="surface-card p-6 sm:p-8">
          <h2 className="text-xl font-bold uppercase tracking-wide text-navy">
            Why Choose Kirat Travel?
          </h2>
          <span className="mt-3 block h-0.5 w-16 bg-gold" />
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {TRAVEL_WHY.map((w, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length]!;
              return (
                <div key={w.title} className="flex gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/60 text-gold">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-navy">{w.title}</span>
                    <span className="block text-xs text-muted-foreground">{w.body}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal
          from="right"
          className="relative overflow-hidden rounded-2xl p-8 text-center text-primary-foreground"
          //
        >
          <span
            className="absolute inset-0 -z-10"
            style={{ background: "var(--gradient-navy)" }}
            aria-hidden
          />
          <h2 className="text-xl font-bold uppercase tracking-wide">What Our Clients Say</h2>
          <div className="mt-4 flex justify-center gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <TestimonialRotator />
        </Reveal>
      </section>

      {/* Forex band */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Reveal
          className="relative overflow-hidden rounded-2xl px-6 py-10 text-primary-foreground"
          from="scale"
        >
          <span
            className="absolute inset-0 -z-10"
            style={{ background: "var(--gradient-navy)" }}
            aria-hidden
          />
          <div className="grid items-center gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-display text-xl font-bold uppercase">Forex Services</h3>
              <p className="mt-2 text-sm text-primary-foreground/80">
                Best rates for 100+ currencies worldwide
              </p>
              <div className="mt-4 flex gap-3">
                {["$", "€", "£", "¥"].map((s, i) => (
                  <span
                    key={s}
                    className="animate-float grid h-10 w-10 place-items-center rounded-full border border-gold/60 text-gold"
                    style={{ animationDelay: `${i * 300}ms` }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-bold uppercase leading-snug">
                Plan your journey
                <br />
                with Kirat Travel
              </p>
              <Link
                to="/rates"
                className="mt-4 inline-block rounded-md px-6 py-3 text-sm font-bold uppercase tracking-wide text-navy transition-transform duration-300 hover:scale-105"
                style={{ background: "var(--gradient-gold)" }}
              >
                Get Best Quote
              </Link>
            </div>
            <div className="flex items-center justify-end gap-4">
              <p className="font-display text-lg font-bold uppercase leading-snug">
                Let&apos;s make your
                <br />
                <span className="text-gold">dream trip</span>
                <br />a reality!
              </p>
              <Plane className="animate-float h-14 w-14 shrink-0 text-primary-foreground/90" />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-input px-4 py-2.5 transition-colors focus-within:border-gold">
      <span className="min-w-0 flex-1">
        <span className="block text-[0.7rem] font-semibold text-navy">{label}</span>
        {children}
      </span>
      {icon}
    </label>
  );
}

function TestimonialRotator() {
  const [i, setI] = useState(0);
  const t = TRAVEL_TESTIMONIALS[i]!;
  const move = (d: number) =>
    setI((v) => (v + d + TRAVEL_TESTIMONIALS.length) % TRAVEL_TESTIMONIALS.length);

  return (
    <div className="mt-5">
      <p key={i} className="animate-fade-in mx-auto max-w-xl text-sm leading-relaxed text-primary-foreground/90">
        &ldquo;{t.quote}&rdquo;
      </p>
      <p className="mt-5 text-sm font-bold">{t.name}</p>
      <p className="text-xs text-primary-foreground/70">{t.place}</p>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Previous testimonial"
          className="grid h-9 w-9 place-items-center rounded-full border border-gold text-gold transition-colors hover:bg-gold hover:text-navy"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="flex gap-1.5">
          {TRAVEL_TESTIMONIALS.map((_, k) => (
            <span
              key={k}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                k === i ? "bg-gold" : "bg-primary-foreground/30",
              )}
            />
          ))}
        </span>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Next testimonial"
          className="grid h-9 w-9 place-items-center rounded-full border border-gold text-gold transition-colors hover:bg-gold hover:text-navy"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
