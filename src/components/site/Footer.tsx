import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY, CURRENCIES } from "@/lib/forex-data";
import { Logo } from "./Header";

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden text-primary-foreground"
      style={{ background: "var(--gradient-navy)" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="animate-marquee-slow flex w-max gap-10 py-10 font-display text-6xl">
          {[...CURRENCIES, ...CURRENCIES].map((c, i) => (
            <span key={i}>{c.symbol}</span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="rounded-2xl bg-background/95 p-3 inline-block">
            <Logo />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-primary-foreground/75">
            RBI approved authorized forex dealer (Category&nbsp;&nbsp;-&nbsp;FFMC) serving
            Murshidabad and West Bengal since 2017.
          </p>
          <p className="mt-3 text-xs text-primary-foreground/55">CIN: {COMPANY.cin}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Quick Links
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/services", label: "Services" },
              { to: "/travel", label: "Travel" },
              { to: "/rates", label: "Live Rates" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact Us" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="inline-block text-primary-foreground/75 transition-all duration-300 hover:translate-x-1 hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Services</h4>
          <ul className="mt-5 space-y-3 text-sm text-primary-foreground/75">
            <li>Foreign Currencies</li>
            <li>Travellers Cheques</li>
            <li>Forex Cards</li>
            <li>Money Transfer</li>
            <li>Doorstep Delivery</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Reach Us</h4>
          <ul className="mt-5 space-y-4 text-sm text-primary-foreground/75">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{COMPANY.registered.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`tel:${COMPANY.registered.tel}`} className="hover:text-gold">
                {COMPANY.registered.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-gold">
                {COMPANY.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-primary-foreground/10 px-4 py-6 text-center text-xs text-primary-foreground/60">
        <p>
          © {new Date().getFullYear()} {COMPANY.name} · All rights reserved. Rates are indicative
          and subject to change.
        </p>
        <p
          className="mt-2 inline-block overflow-hidden whitespace-nowrap border-r-2 border-primary-foreground/60"
          style={{
            animation:
              "typewriter 2.5s steps(20) 1s 1 normal both, blink-caret 0.75s step-end infinite",
          }}
        >
          crafted by{" "}
          <a
            href="https://www.incodent.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary-foreground/80 transition-colors hover:text-gold"
          >
            Incodent
          </a>
        </p>
      </div>
    </footer>
  );
}
