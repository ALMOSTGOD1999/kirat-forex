import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import airplane from "@/assets/airplane.png";

const SYMBOLS = [
  "$", "€", "£", "¥", "₹", "₩", "₽", "฿", "₺", "₫", "﷼", "₴", "₦", "₱", "R$", "kr", "Fr", "₪", "د.إ", "₲",
];

const NAME = "KIRAT FOREX";

/**
 * Intro sequence:
 *  phase 0 — a US Dollar coin spins and flips into an Indian Rupee
 *  phase 1 — world currency symbols fly in and assemble the company name
 *  phase 2 — curtain lifts
 */
export function WelcomeAnimation() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMounted(true);
    document.body.style.overflow = "hidden";
    const timings = reduce ? [200, 500, 800] : [2600, 5400, 6200];
    const t1 = setTimeout(() => setPhase(1), timings[0]);
    const t2 = setTimeout(() => setPhase(2), timings[1]);
    const t3 = setTimeout(() => {
      setDone(true);
      document.body.style.overflow = "";
    }, timings[2]);
    return () => {
      [t1, t2, t3].forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted || done) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden transition-all duration-700",
        phase === 2 && "pointer-events-none -translate-y-full opacity-0",
      )}
      style={{ background: "var(--gradient-navy)" }}
    >
      {/* ambient orbs */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="animate-float absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
        <div className="animate-float absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-gold/30 blur-3xl [animation-delay:1.2s]" />
      </div>

      {/* floating symbol field */}
      <div className="pointer-events-none absolute inset-0">
        {SYMBOLS.map((s, i) => (
          <span
            key={`${s}-${i}`}
            className="animate-float absolute font-display text-2xl text-primary-foreground/15 sm:text-4xl"
            style={{
              left: `${(i * 97) % 94}%`,
              top: `${(i * 53) % 88}%`,
              animationDelay: `${(i % 7) * 0.4}s`,
              animationDuration: `${5 + (i % 5)}s`,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* phase 0 — dollar becomes rupee */}
      <div
        className={cn(
          "relative transition-all duration-700",
          phase >= 1 ? "-translate-y-6 scale-75 opacity-0" : "opacity-100",
        )}
      >
        <span className="absolute inset-0 animate-[pulse-ring_2.4s_ease-out_infinite] rounded-full border-2 border-gold/60" />
        <div className="[perspective:900px]">
          <div className="animate-[flip-coin_3.2s_ease-in-out_infinite] relative h-28 w-28 [transform-style:preserve-3d] sm:h-36 sm:w-36">
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full font-display text-5xl font-bold text-primary-foreground shadow-2xl [backface-visibility:hidden] sm:text-6xl"
              style={{ background: "var(--gradient-primary)" }}
            >
              $
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full font-display text-5xl font-bold text-navy shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] sm:text-6xl"
              style={{ background: "var(--gradient-gold)" }}
            >
              ₹
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-xs uppercase tracking-[0.4em] text-primary-foreground/70">
          USD &nbsp;→&nbsp; INR
        </p>
      </div>

      {/* phase 1 — name built from currency symbols */}
      <div
        className={cn(
          "absolute flex flex-col items-center px-4 transition-all duration-700",
          phase >= 1 ? "opacity-100" : "pointer-events-none translate-y-8 opacity-0",
        )}
      >
        <div className="flex flex-wrap justify-center">
          {NAME.split("").map((ch, i) => (
            <span
              key={i}
              className="relative inline-block font-display text-4xl font-extrabold text-primary-foreground sm:text-6xl md:text-7xl"
              style={{
                animation: phase >= 1 ? `scale-in 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 0.09}s both` : undefined,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
              <span
                className="absolute -top-5 left-1/2 -translate-x-1/2 font-display text-xs text-gold sm:-top-7 sm:text-base"
                style={{
                  animation:
                    phase >= 1 ? `fade-in 0.5s ease-out ${0.5 + i * 0.09}s both` : undefined,
                }}
              >
                {SYMBOLS[i % SYMBOLS.length]}
              </span>
            </span>
          ))}
        </div>
        <p
          className="mt-5 text-center text-[0.65rem] uppercase tracking-[0.45em] text-primary-foreground/70 sm:text-sm"
          style={{ animation: phase >= 1 ? "fade-up 0.8s ease-out 1.1s both" : undefined }}
        >
          Private Limited · Murshidabad
        </p>
      </div>

      {/* airplane flies across the screen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
      >
        <div
          style={{
            animation: "fly-across 4.6s cubic-bezier(0.4, 0, 0.3, 1) both",
            animationDelay: "0.3s",
          }}
        >
          <img
            src={airplane}
            alt=""
            width={1024}
            height={1024}
            className="h-40 w-40 -scale-x-100 object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.5)] sm:h-64 sm:w-64"
          />
        </div>
      </div>
    </div>
  );
}
