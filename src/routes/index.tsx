import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  Globe2,
  IndianRupee,
  Lock,
  Plane,
  Quote,
  Send,
  Shield,
  Star,
  Truck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import serviceCurrency from "@/assets/service-currency.jpg";
import serviceCheque from "@/assets/service-cheque.jpg";
import serviceCard from "@/assets/service-card.jpg";
import { DEFAULT_SLIDES, loadHeroSlides, type HeroSlide } from "@/lib/hero-slides";

import { ExchangeWidget } from "@/components/site/ExchangeWidget";
import { Reveal, useCountUp } from "@/components/site/Reveal";
import { RateTicker } from "@/components/site/RateTicker";
import {
  COMPANY,
  DUAL_SERVICES,
  HIGHLIGHTS,
  SERVICES,
  STATS,
  TESTIMONIALS,
} from "@/lib/forex-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kirat Forex Pvt Ltd — Currency Exchange in Murshidabad" },
      {
        name: "description",
        content:
          "Buy and sell foreign currency, forex cards and travellers cheques at the best rates in Murshidabad. RBI authorised dealer with doorstep delivery.",
      },
      { property: "og:title", content: "Kirat Forex — Best Currency Exchange Rates in Murshidabad" },
      {
        property: "og:description",
        content:
          "Live forex rates for 20+ currencies, forex cards, money transfer and doorstep delivery across Murshidabad.",
      },
    ],
  }),
  component: Home,
});




const HL_ICONS: Record<string, typeof Shield> = {
  shield: Shield,
  trending: TrendingUp,
  truck: Truck,
  lock: Lock,
};

const STEPS = [
  { icon: Globe2, title: "Choose currency", body: "Pick from 20+ currencies and check the live rate instantly." },
  { icon: FileCheck2, title: "Share documents", body: "Passport, ticket and visa — we handle the RBI compliance." },
  { icon: Wallet, title: "Lock the rate", body: "Pay a small amount now to freeze today's rate for you." },
  { icon: Truck, title: "Get delivery", body: "Collect at our Berhampore branch or get doorstep delivery." },
];

function Home() {
  return (
    <div>
      <HeroSection />
      <HighlightStrip />
      <ServicesSection />
      <StepsSection />
      <DualServices />
      <StatsSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}

function HeroSection() {
  const [i, setI] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);

  useEffect(() => {
    const sync = async () => {
      setSlides(await loadHeroSlides());
      setI(0);
    };
    sync();
    window.addEventListener("kf-hero-slides-changed", sync);
    return () => window.removeEventListener("kf-hero-slides-changed", sync);
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const current = slides[i] ?? slides[0]!;

  return (
    <section className="relative overflow-hidden">
      {slides.map((s, k) => (
        <img
          key={s.id}
          src={s.img}
          alt={s.title}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            k === i ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, oklch(0.24 0.07 260 / 0.92) 12%, oklch(0.24 0.07 260 / 0.55) 58%, oklch(0.24 0.07 260 / 0.8))",
        }}
      />
      <div className="bg-grid absolute inset-0 opacity-30" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_28rem] lg:py-20">
        <div className="text-primary-foreground">
          <span className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <Shield className="h-3.5 w-3.5" /> RBI Authorised FFMC
          </span>
          <h1 key={i} className="animate-fade-up mt-6 font-display text-4xl font-black leading-[1.05] sm:text-6xl">
            {current.title}
            <span className="mt-2 block text-2xl font-semibold text-gold sm:text-3xl">
              {current.sub}
            </span>
          </h1>
          <p className="animate-fade-up mt-5 max-w-xl text-base text-primary-foreground/85">
            {COMPANY.name} is your trusted money changer in Murshidabad — foreign currency notes,
            forex cards, travellers cheques and outward remittance, all under one roof.
          </p>

          <div className="animate-fade-up mt-8 flex flex-wrap gap-3">
            <Link
              to="/rates"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wide text-navy transition-transform duration-300 hover:scale-105"
              style={{ background: "var(--gradient-gold)" }}
            >
              Live Rates
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/travel"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-primary-foreground/10"
            >
              <Plane className="h-4 w-4" /> Travel Packages
            </Link>
          </div>

          <div className="mt-10 max-w-xl">
            <RateTicker />
          </div>
        </div>

        <div className="animate-scale-in">
          <ExchangeWidget />
        </div>
      </div>
    </section>
  );
}

function HighlightStrip() {
  return (
    <section className="mx-auto -mt-6 max-w-7xl px-4 sm:px-6">
      <div className="surface-card relative z-10 grid gap-px overflow-hidden bg-border sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((h, i) => {
          const Icon = HL_ICONS[h.icon] ?? Shield;
          return (
            <Reveal
              key={h.title}
              delay={i * 90}
              className="group flex items-center gap-4 bg-card px-6 py-6 transition-colors hover:bg-accent/50"
            >
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-primary-foreground transition-transform duration-500 group-hover:rotate-12"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-sm font-bold text-navy">{h.title}</span>
                <span className="block text-xs text-muted-foreground">{h.sub}</span>
              </span>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

const SERVICE_IMAGES = [serviceCurrency, serviceCheque, serviceCard];
const SERVICE_ICONS = [Banknote, FileCheck2, CreditCard];

function ServicesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">What we do</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
          Complete <span className="text-gradient">forex solutions</span> under one roof
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          From currency notes to prepaid travel cards — everything a traveller, student or business
          needs before flying abroad.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {SERVICES.map((s, i) => {
          const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]!;
          return (
            <Reveal key={s.slug} delay={i * 120} className="surface-card hover-lift overflow-hidden p-0">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={SERVICE_IMAGES[i % SERVICE_IMAGES.length]}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <span
                  className="absolute bottom-3 left-3 grid h-11 w-11 place-items-center rounded-full text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <ul className="mt-4 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-navy">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> {p}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/services"
                  className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary"
                >
                  Read more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="relative overflow-hidden py-20 text-primary-foreground" style={{ background: "var(--gradient-navy)" }}>
      <div className="bg-grid absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Get your forex in four simple steps
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal
                key={s.title}
                delay={i * 120}
                from="up"
                className="group relative rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur transition-transform duration-500 hover:-translate-y-2"
              >
                <span className="absolute right-5 top-4 font-display text-4xl font-black text-primary-foreground/10">
                  0{i + 1}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/50 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-primary-foreground/75">{s.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DualServices() {
  const icons = [IndianRupee, Send];
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-2">
      {DUAL_SERVICES.map((d, i) => {
        const Icon = icons[i % icons.length]!;
        return (
          <Reveal
            key={d.title}
            from={i === 0 ? "left" : "right"}
            className="surface-card hover-lift p-8"
          >
            <span
              className="grid h-14 w-14 place-items-center rounded-2xl text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-display text-2xl font-bold text-navy">{d.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {d.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-navy">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> {p}
                </li>
              ))}
            </ul>
          </Reveal>
        );
      })}
    </section>
  );
}

function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <div className="grid gap-6 rounded-3xl border border-border bg-secondary/60 p-8 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <StatItem key={s.label} {...s} delay={i * 100} />
        ))}
      </div>
    </section>
  );
}

function StatItem({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const { ref, value: v } = useCountUp(value);
  return (
    <Reveal delay={delay} className="text-center">
      <span ref={ref} className="block font-display text-4xl font-black text-gradient">
        {v.toLocaleString("en-IN")}
        {suffix}
      </span>
      <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
    </Reveal>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-secondary/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Testimonials</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
            Trusted by travellers across Murshidabad
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.slice(0, 6).map((t, i) => (
            <Reveal key={t.name} delay={i * 90} className="surface-card hover-lift relative p-6">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10" />
              <div className="flex gap-1 text-gold">
                {Array.from({ length: t.stars }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
              <p className="mt-5 text-sm font-bold text-navy">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.place}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal
        from="scale"
        className="relative overflow-hidden rounded-3xl px-6 py-14 text-center text-primary-foreground"
      >
        <span className="absolute inset-0 -z-10" style={{ background: "var(--gradient-primary)" }} aria-hidden />
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Ready to lock today&apos;s rate?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-primary-foreground/85">
          Call our Berhampore desk or drop us a message — we will reserve your currency and deliver
          it wherever you are in Murshidabad.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`tel:${COMPANY.branch.tel}`}
            className="rounded-full bg-background px-6 py-3 text-sm font-bold uppercase tracking-wide text-navy transition-transform duration-300 hover:scale-105"
          >
            Call {COMPANY.branch.phone}
          </a>
          <Link
            to="/contact"
            className="rounded-full border border-primary-foreground/50 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-primary-foreground/10"
          >
            Contact Us
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
