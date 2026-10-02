import { useEffect, useState } from "react";
import { CURRENCIES } from "@/lib/forex-data";
import { loadDailyRates } from "@/lib/daily-rates";
import { loadCurrencyIcons } from "@/lib/currency-assets";
import { cn } from "@/lib/utils";

export function RateTicker({
  mode = "buy",
  className,
}: {
  mode?: "buy" | "sell";
  className?: string;
}) {
  const [rates, setRates] = useState(() =>
    CURRENCIES.map((c) => ({ code: c.code, buy: c.buy, sell: c.sell, flag: c.flag, img: "" })),
  );
  const [icons, setIcons] = useState<Record<string, string>>({});

  useEffect(() => {
    loadDailyRates().then((r) =>
      setRates(
        r.map((rr) => {
          const meta = CURRENCIES.find((c) => c.code === rr.code);
          return { ...rr, flag: meta?.flag ?? "🌐", img: "" };
        }),
      ),
    );
    loadCurrencyIcons()
      .then((rows) => setIcons(Object.fromEntries(rows.map((i) => [i.code, i.img]))))
      .catch(() => {
        /* icons are optional decoration */
      });
  }, []);

  const items = rates.map((r) => ({ ...r, img: icons[r.code] ?? "" }));
  const loop = [...items, ...items];
  return (
    <div
      className={cn("relative overflow-hidden rounded-xl", className)}
      style={{ background: "var(--gradient-primary)" }}
    >
      <div className="animate-marquee flex w-max items-center gap-8 py-2.5 pl-8">
        {loop.map((c, i) => (
          <span
            key={`${c.code}-${i}`}
            className="flex shrink-0 items-center gap-2 text-sm font-semibold text-primary-foreground"
          >
            {c.img ? (
              <img src={c.img} alt="" loading="lazy" className="h-5 w-5 rounded object-cover" />
            ) : (
              <span className="text-base">{c.flag}</span>
            )}
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
