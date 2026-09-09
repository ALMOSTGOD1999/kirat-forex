import { useEffect, useState } from "react";
import { CURRENCIES } from "@/lib/forex-data";
import { loadDailyRates } from "@/lib/daily-rates";
import { cn } from "@/lib/utils";

export function RateTicker({
  mode = "buy",
  className,
}: {
  mode?: "buy" | "sell";
  className?: string;
}) {
  const [rates, setRates] = useState(() =>
    CURRENCIES.map((c) => ({ code: c.code, buy: c.buy, sell: c.sell, flag: c.flag })),
  );

  useEffect(() => {
    loadDailyRates().then((r) =>
      setRates(r.map((rr) => {
        const meta = CURRENCIES.find((c) => c.code === rr.code);
        return { ...rr, flag: meta?.flag ?? "🌐" };
      })),
    );
  }, []);

  const items = [...rates, ...rates];
  return (
    <div
      className={cn("relative overflow-hidden rounded-xl", className)}
      style={{ background: "var(--gradient-primary)" }}
    >
      <div className="animate-marquee flex w-max items-center gap-8 py-2.5 pl-8">
        {items.map((c, i) => (
          <span
            key={`${c.code}-${i}`}
            className="flex shrink-0 items-center gap-2 text-sm font-semibold text-primary-foreground"
          >
            <span className="text-base">{c.flag}</span>
            {c.code}
            <span className="font-normal text-primary-foreground/85">
              ₹ {mode === "buy" ? c.buy : c.sell}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
