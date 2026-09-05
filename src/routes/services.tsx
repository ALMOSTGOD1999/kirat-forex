import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Banknote, CheckCircle2, CreditCard, FileCheck2, IndianRupee, Send } from "lucide-react";
import serviceCurrency from "@/assets/service-currency.jpg";
import serviceCheque from "@/assets/service-cheque.jpg";
import serviceCard from "@/assets/service-card.jpg";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { DUAL_SERVICES, SERVICES } from "@/lib/forex-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Forex Services — Currency, Cards & Transfers | Kirat Forex" },
      {
        name: "description",
        content:
          "Foreign currency notes, travellers cheques, forex cards, outward money transfer and doorstep delivery from Kirat Forex, Murshidabad.",
      },
      { property: "og:title", content: "Forex Services in Murshidabad | Kirat Forex" },
      {
        property: "og:description",
        content: "Currency exchange, forex cards, travellers cheques and money transfer services.",
      },
    ],
  }),
  component: ServicesPage,
});

const IMAGES = [serviceCurrency, serviceCheque, serviceCard];
const ICONS = [Banknote, FileCheck2, CreditCard];

function ServicesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Our Services"
        title="Everything you need before you fly"
        sub="Authorised money changer services for travellers, students, pilgrims and businesses."
      />

      <section className="mx-auto max-w-7xl space-y-14 px-4 py-20 sm:px-6">
        {SERVICES.map((s, i) => {
          const Icon = ICONS[i % ICONS.length]!;
          return (
            <Reveal
              key={s.slug}
              from={i % 2 === 0 ? "left" : "right"}
              className="grid items-center gap-8 lg:grid-cols-2"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-card)]">
                  <img
                    src={IMAGES[i % IMAGES.length]}
                    alt={s.title}
                    loading="lazy"
                    className="h-72 w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
              <div>
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold text-navy sm:text-3xl">
                  {s.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <ul className="mt-5 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-navy">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> {p}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="group mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:scale-105"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Enquire now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          );
        })}
      </section>

      <section className="bg-secondary/50 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          {DUAL_SERVICES.map((d, i) => {
            const Icon = [IndianRupee, Send][i % 2]!;
            return (
              <Reveal key={d.title} delay={i * 120} className="surface-card hover-lift p-8">
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl text-primary-foreground"
                  style={{ background: "var(--gradient-navy)" }}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-navy">{d.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {d.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-navy">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
