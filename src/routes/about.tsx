import { createFileRoute } from "@tanstack/react-router";
import { Award, CheckCircle2, HeartHandshake, MapPin, ShieldCheck } from "lucide-react";
import aboutImg from "@/assets/about.jpg";
import { PageHero } from "@/components/site/PageHero";
import { Reveal, useCountUp } from "@/components/site/Reveal";
import { COMPANY, STATS } from "@/lib/forex-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Kirat Forex Pvt Ltd — Murshidabad Money Changer" },
      {
        name: "description",
        content:
          "Kirat Forex Pvt Ltd is an RBI authorised full fledged money changer serving Murshidabad since 2017 with honest rates and personal service.",
      },
      { property: "og:title", content: "About Kirat Forex Pvt Ltd" },
      {
        property: "og:description",
        content: "RBI authorised forex dealer serving Murshidabad and West Bengal since 2017.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: ShieldCheck, title: "Compliance first", body: "Every transaction follows RBI FEMA guidelines and proper documentation." },
  { icon: HeartHandshake, title: "Personal service", body: "Local team that speaks your language and guides first time travellers." },
  { icon: Award, title: "Honest pricing", body: "Transparent rates with no hidden charges — what you see is what you pay." },
];

function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About Us"
        title="Murshidabad's trusted foreign exchange partner since 2017"
        sub={`CIN: ${COMPANY.cin}`}
      />

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <Reveal from="left">
          <img
            src={aboutImg}
            alt="Kirat Forex counter in Berhampore"
            loading="lazy"
            className="w-full rounded-3xl object-cover shadow-[var(--shadow-card)]"
          />
        </Reveal>
        <Reveal from="right">
          <h2 className="font-display text-3xl font-bold text-navy">
            A local desk with <span className="text-gradient">global reach</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {COMPANY.name} started with a simple idea — people from Murshidabad travelling abroad
            for work, study, pilgrimage or holidays deserve fair rates without travelling to
            Kolkata. Today we serve thousands of customers every year with currency notes, forex
            cards, travellers cheques and outward remittance.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Our team helps you plan how much currency to carry, arranges small denominations for
            Hajj and Umrah pilgrims, and delivers to your doorstep across the district.
          </p>
          <ul className="mt-6 space-y-2">
            {[
              "RBI authorised dealer (Category II - FFMC)",
              "20+ currencies available in stock",
              "Doorstep delivery across Murshidabad",
              "Support for students, pilgrims and businesses",
            ].map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-navy">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Stat key={s.label} {...s} delay={i * 100} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold text-navy">What we stand for</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.title} delay={i * 110} className="surface-card hover-lift p-7">
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {[COMPANY.registered, COMPANY.branch].map((o, i) => (
            <Reveal key={o.label} delay={i * 120} className="surface-card p-7">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <MapPin className="h-4 w-4" /> {o.label}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-navy">{o.address}</p>
              <a href={`tel:${o.tel}`} className="mt-3 inline-block text-sm font-bold text-primary">
                {o.phone}
              </a>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({
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
