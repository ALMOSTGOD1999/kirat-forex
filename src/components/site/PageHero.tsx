import { CURRENCIES } from "@/lib/forex-data";

function FloatingSymbols() {
  const symbols = CURRENCIES.map((c) => c.symbol);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {symbols.map((s, i) => (
        <span
          key={i}
          className="absolute animate-float font-display font-black text-primary-foreground/[0.08] select-none"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 90}%`,
            fontSize: `${2 + (i % 4) * 1.1}rem`,
            animationDelay: `${(i % 7) * 0.9}s`,
            animationDuration: `${5 + (i % 5)}s`,
          }}
        >
          {s}
        </span>
      ))}
      {/* scrolling marquee of symbols along the bottom */}
      <div className="absolute bottom-3 left-0 w-full opacity-[0.12]">
        <div className="animate-marquee-slow flex w-max gap-12 text-2xl text-primary-foreground">
          {[...symbols, ...symbols].map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <section
      className="relative overflow-hidden py-16 text-primary-foreground sm:py-20"
      style={{ background: "var(--gradient-navy)" }}
    >
      <div className="bg-grid absolute inset-0 opacity-25" />
      <FloatingSymbols />
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <p className="animate-fade-in text-xs font-bold uppercase tracking-[0.35em] text-gold">
          {eyebrow}
        </p>
        <h1 className="animate-fade-up mt-4 max-w-3xl font-display text-3xl font-black leading-tight sm:text-5xl">
          {title}
        </h1>
        {sub && (
          <p
            className="animate-fade-up mt-4 max-w-2xl text-sm text-primary-foreground/80 sm:text-base"
            style={{ animationDelay: "120ms" }}
          >
            {sub}
          </p>
        )}
      </div>
    </section>
  );
}
