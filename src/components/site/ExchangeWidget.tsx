import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, BadgeInfo, Banknote, Clock3, CreditCard, RefreshCw, Table2 } from "lucide-react";
import { toast } from "sonner";
import { CURRENCIES, RATE_UPDATED } from "@/lib/forex-data";
import { loadPaymentSettings, newQuoteId, saveQuote } from "@/lib/quotes";
import { loadDailyRates, getLastUpdated } from "@/lib/daily-rates";
import { RateTicker } from "./RateTicker";
import { cn } from "@/lib/utils";


type Tab = "buy" | "sell" | "rates";

export function ExchangeWidget({ initialTab = "buy" }: { initialTab?: Tab }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>(initialTab);

  const [liveRates, setLiveRates] = useState(() =>
    CURRENCIES.map((c) => ({ code: c.code, buy: c.buy, sell: c.sell })),
  );
  const [lastUpdated, setLastUpdated] = useState(RATE_UPDATED);

  useEffect(() => {
    loadDailyRates().then(setLiveRates);
    getLastUpdated().then(setLastUpdated);
  }, []);

  const [code, setCode] = useState("USD");
  const [fx, setFx] = useState("");
  const [inr, setInr] = useState("");
  const [lastEdited, setLastEdited] = useState<"fx" | "inr">("fx");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(true);

  const currency = useMemo(
    () => liveRates.find((c) => c.code === code) ?? CURRENCIES.find((c) => c.code === code)!,
    [code, liveRates],
  );
  const rate = tab === "sell" ? currency.sell : currency.buy;

  const setFxAmount = (v: string) => {
    setLastEdited("fx");
    setFx(v);
    const n = parseFloat(v);
    setInr(Number.isFinite(n) ? (n * rate).toFixed(2) : "");
  };
  const setInrAmount = (v: string) => {
    setLastEdited("inr");
    setInr(v);
    const n = parseFloat(v);
    setFx(Number.isFinite(n) ? (n / rate).toFixed(4) : "");
  };
  const onCurrency = (v: string) => {
    setCode(v);
    const next = liveRates.find((c) => c.code === v) ?? CURRENCIES.find((c) => c.code === v)!;
    const r = tab === "sell" ? next.sell : next.buy;
    if (lastEdited === "fx" && fx) setInr((parseFloat(fx) * r).toFixed(2));
    else if (inr) setFx((parseFloat(inr) / r).toFixed(4));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fxNum = parseFloat(fx);
    const inrNum = parseFloat(inr);
    if (!Number.isFinite(fxNum) || fxNum <= 0 || !Number.isFinite(inrNum)) {
      toast.error("Enter the amount you want to exchange");
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Enter a valid 10 digit mobile number");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email ID");
      return;
    }
    if (!accepted) {
      toast.error("Please accept the privacy policy");
      return;
    }
    const id = newQuoteId();
    const { advancePercent } = await loadPaymentSettings();
    await saveQuote({
      id,
      createdAt: Date.now(),
      mode: tab === "sell" ? "sell" : "buy",
      code,
      fxAmount: fxNum.toString(),
      inrAmount: inrNum.toFixed(2),
      rate,
      mobile,
      email,
      advance: ((inrNum * advancePercent) / 100).toFixed(2),
      reference: id,
      status: "pending",
    });
    toast.success("Quote created — pay the advance to confirm.");
    setMobile("");
    setEmail("");
    void navigate({ to: "/quote/$id", params: { id } });
  };


  const tabs: { id: Tab; label: string; icon: typeof Banknote }[] = [
    { id: "buy", label: "Buy Forex", icon: CreditCard },
    { id: "sell", label: "Sale Forex", icon: Banknote },
    { id: "rates", label: "Rates", icon: Table2 },
  ];

  return (
    <div className="surface-card overflow-hidden p-4 sm:p-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                active
                  ? "border-transparent text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "border-border text-navy hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary",
              )}
              style={active ? { background: "var(--gradient-primary)" } : undefined}
            >
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <RateTicker mode={tab === "sell" ? "sell" : "buy"} />
      </div>

      {tab === "rates" ? (
        <div key="rates" className="animate-fade-in mt-5">
          <RateTable rates={liveRates} />
        </div>
      ) : (
        <form key={tab} onSubmit={submit} className="animate-fade-in mt-6 space-y-5">
          <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div>
              <label className="mb-2 block text-sm font-bold text-primary">
                Forex Amount ({tab === "buy" ? "Buy" : "Sell"})
              </label>
              <div className="flex overflow-hidden rounded-xl border border-input focus-within:ring-2 focus-within:ring-ring/40">
                <select
                  value={code}
                  onChange={(e) => onCurrency(e.target.value)}
                  aria-label="Select currency"
                  className="border-r border-input bg-secondary px-3 py-3 text-sm font-semibold text-navy outline-none"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  inputMode="decimal"
                  value={fx}
                  onChange={(e) => setFxAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-background px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-border bg-secondary text-primary transition-transform duration-500 hover:rotate-180">
              <RefreshCw className="h-4 w-4" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-primary">INR Amount</label>
              <div className="flex overflow-hidden rounded-xl border border-input focus-within:ring-2 focus-within:ring-ring/40">
                <span className="border-r border-input bg-secondary px-4 py-3 text-sm font-semibold text-navy">
                  INR
                </span>
                <input
                  inputMode="decimal"
                  value={inr}
                  onChange={(e) => setInrAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-background px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div
            className="animate-shimmer rounded-xl px-4 py-3 text-sm font-semibold text-navy"
            style={{
              backgroundImage:
                "linear-gradient(100deg, var(--gold) 20%, oklch(0.92 0.09 92) 50%, var(--gold) 80%)",
              backgroundSize: "200% 100%",
            }}
          >
            Namaste! Looking for the best forex rate? 1 {code} = ₹ {rate}
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-navy">
              Share details to view quote
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                  Mobile Number
                </label>
                <div className="flex overflow-hidden rounded-xl border border-input focus-within:ring-2 focus-within:ring-ring/40">
                  <span className="border-r border-input bg-secondary px-3 py-3 text-sm font-semibold text-navy">
                    +91
                  </span>
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter Mobile Number"
                    className="w-full bg-background px-4 py-3 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                  Email ID
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email ID"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="h-4 w-4 accent-[oklch(0.52_0.19_258)]"
              />
              I accept the <span className="font-semibold text-primary underline">Privacy Policy</span>.
            </label>

            <button
              type="submit"
              className="group mt-5 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:scale-[1.03]"
              style={{ background: "var(--gradient-primary)" }}
            >
              Get your quote
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-secondary px-4 py-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5 text-primary" /> Last updated: {lastUpdated}
        </span>
        <span className="flex items-center gap-2">
          <BadgeInfo className="h-3.5 w-3.5 text-destructive" /> 1 FX = Displayed INR • Indicative rates
        </span>
      </div>
    </div>
  );
}

export function RateTable({ rates }: { rates?: { code: string; buy: number; sell: number }[] }) {
  const displayRates = rates ?? CURRENCIES.map((c) => ({ code: c.code, buy: c.buy, sell: c.sell }));
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="max-h-[26rem] overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 z-10 text-primary-foreground" >
            <tr style={{ background: "var(--gradient-primary)" }}>
              <th className="px-4 py-3 font-semibold">Currency</th>
              <th className="px-4 py-3 text-right font-semibold">Buy</th>
              <th className="px-4 py-3 text-right font-semibold">Sell</th>
            </tr>
          </thead>
          <tbody>
            {displayRates.map((r, i) => {
              const meta = CURRENCIES.find((c) => c.code === r.code);
              return (
                <tr
                  key={r.code}
                  style={{ animation: `tick-up 0.4s ease-out ${i * 35}ms both` }}
                  className="border-t border-border transition-colors hover:bg-accent/60"
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{meta?.flag}</span>
                      <span>
                        <span className="block font-bold text-navy">{r.code}</span>
                        <span className="block text-xs uppercase text-muted-foreground">{meta?.name}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-navy tabular-nums">{r.buy}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary tabular-nums">{r.sell}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
