import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Check, ImagePlus, Plus, RotateCcw, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/PageHero";
import {
  DEFAULT_SLIDES,
  MAX_SLIDES,
  loadHeroSlides,
  resetHeroSlides,
  saveHeroSlides,
  type HeroSlide,
} from "@/lib/hero-slides";
import {
  DEFAULT_PAYMENT,
  QUOTES_EVENT,
  deleteQuote,
  loadPaymentSettings,
  loadQuotes,
  savePaymentSettings,
  setQuoteStatus,
  type PaymentSettings,
  type QuoteRequest,
} from "@/lib/quotes";
import { loadDailyRates, saveDailyRates, type DailyRate } from "@/lib/daily-rates";
import { loadCustomCurrencies, saveCustomCurrency, deleteCustomCurrency, type CustomCurrency } from "@/lib/custom-currencies";
import { CURRENCIES } from "@/lib/forex-data";


export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Hero Slideshow Admin | Kirat Forex" },
      {
        name: "description",
        content:
          "Internal admin screen to upload, reorder and edit the home page hero slideshow images of Kirat Forex.",
      },
      { property: "og:title", content: "Hero Slideshow Admin | Kirat Forex" },
      {
        property: "og:description",
        content: "Upload and manage the home page hero slides.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [panel, setPanel] = useState<"slides" | "requests" | "rates">("slides");
  const { user, isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <div>
        <PageHero
          eyebrow="Admin"
          title="Admin access only"
          sub="Log in with an admin account to manage the hero slideshow and quote requests."
        />
        <section className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <p className="text-sm text-muted-foreground">
            {user
              ? "You are signed in as a customer. Please log in with the admin account."
              : "You need to log in to view the control room."}
          </p>
          <Link
            to="/auth"
            className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-primary)" }}
          >
            Go to login
          </Link>
        </section>
      </div>
    );
  }

  return (

    <div>
      <PageHero
        eyebrow="Admin"
        title="Kirat Forex control room"
        sub="Manage the home page hero slideshow, quote requests and the company payment details."
      />
      <section className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["slides", "Hero slideshow"],
              ["rates", "Daily rates"],
              ["requests", "Quote requests"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPanel(id)}
              className={
                panel === id
                  ? "rounded-xl px-5 py-2.5 text-sm font-bold text-primary-foreground"
                  : "rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-navy hover:bg-accent"
              }
              style={panel === id ? { background: "var(--gradient-primary)" } : undefined}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
      {panel === "slides" ? <SlidesPanel /> : panel === "rates" ? <RatesPanel /> : <RequestsPanel />}
    </div>
  );
}

function RequestsPanel() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [pay, setPay] = useState<PaymentSettings>(DEFAULT_PAYMENT);

  useEffect(() => {
    const sync = async () => {
      setQuotes(await loadQuotes());
    };
    sync();
    loadPaymentSettings().then(setPay);
    window.addEventListener(QUOTES_EVENT, sync);
    return () => window.removeEventListener(QUOTES_EVENT, sync);
  }, []);

  const onQr = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 1_500_000) {
      toast.error("QR image too large — use one under 1.5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPay((p) => ({ ...p, qrImage: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const field = (label: string, key: keyof PaymentSettings) => (
    <div key={String(key)}>
      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</label>
      <input
        value={String(pay[key] ?? "")}
        onChange={(e) =>
          setPay((p) => ({
            ...p,
            [key]: key === "advancePercent" ? Number(e.target.value) || 0 : e.target.value,
          }))
        }
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
      />
    </div>
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="surface-card p-6">
        <h2 className="text-lg font-bold text-navy">Company payment details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Shown to customers on the advance payment page.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {field("Bank name", "bankName")}
          {field("Account name", "accountName")}
          {field("Account number", "accountNumber")}
          {field("IFSC", "ifsc")}
          {field("Branch", "branch")}
          {field("UPI ID", "upiId")}
          {field("Advance %", "advancePercent")}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          {pay.qrImage ? (
            <img
              src={pay.qrImage}
              alt="Company UPI QR code"
              className="h-28 w-28 rounded-xl border border-border object-contain p-1"
            />
          ) : (
            <div className="grid h-28 w-28 place-items-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
              No QR
            </div>
          )}
          <label className="cursor-pointer rounded-xl border border-border px-5 py-3 text-sm font-bold text-navy hover:bg-accent">
            Upload QR image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                onQr(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            onClick={async () => {
              await savePaymentSettings(pay);
              toast.success("Payment details saved");
            }}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Save className="h-4 w-4" /> Save details
          </button>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-bold text-navy">Quote requests ({quotes.length})</h2>
      <div className="mt-4 grid gap-4">
        {quotes.length === 0 && (
          <p className="rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
            No requests yet.
          </p>
        )}
        {quotes.map((q) => (
          <div key={q.id} className="surface-card grid gap-4 p-5 sm:grid-cols-[1fr_auto]">
            <div className="grid gap-1 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-navy">{q.reference}</span>
                <span
                  className={
                    q.status === "approved"
                      ? "rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                      : q.status === "rejected"
                        ? "rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive"
                        : "rounded-full bg-secondary px-3 py-1 text-xs font-bold text-navy"
                  }
                >
                  {q.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(q.createdAt).toLocaleString()}
                </span>
              </div>
              <span className="text-muted-foreground">
                {q.mode === "buy" ? "Buy" : "Sell"} {q.fxAmount} {q.code} @ ₹{q.rate} • Total ₹
                {q.inrAmount} • Advance ₹{q.advance}
              </span>
              <span className="text-muted-foreground">
                +91 {q.mobile} • {q.email}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  await setQuoteStatus(q.id, "approved");
                  toast.success("Request approved");
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Check className="h-3.5 w-3.5" /> Approve
              </button>
              <button
                type="button"
                onClick={async () => {
                  await setQuoteStatus(q.id, "rejected");
                  toast("Request rejected");
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10"
              >
                <X className="h-3.5 w-3.5" /> Reject
              </button>
              <button
                type="button"
                onClick={async () => { await deleteQuote(q.id); }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 rounded-xl bg-secondary px-4 py-3 text-xs text-muted-foreground">
        Requests and payment details are stored in this browser for now. When the Neon backend is
        wired up, swap the functions in <code>src/lib/quotes.ts</code> for server calls and this
        screen keeps working unchanged.
      </p>
    </section>
  );
}

function SlidesPanel() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadHeroSlides().then(setSlides);
  }, []);


  const update = (id: string, patch: Partial<HeroSlide>) =>
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const move = (i: number, dir: -1 | 1) =>
    setSlides((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });

  const onFiles = (files: FileList | null, replaceId?: string) => {
    if (!files?.length) return;
    const file = files[0]!;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 2_500_000) {
      toast.error("Image too large — please use one under 2.5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = String(reader.result);
      if (replaceId) {
        update(replaceId, { img });
      } else {
        setSlides((prev) =>
          prev.length >= MAX_SLIDES
            ? prev
            : [...prev, { id: `s${Date.now()}`, img, title: "New slide", sub: "Add a subtitle" }],
        );
      }
      toast.success("Image loaded — remember to save");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>


      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={slides.length >= MAX_SLIDES}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-primary-foreground transition-transform duration-300 hover:scale-[1.03] disabled:opacity-50"
            style={{ background: "var(--gradient-primary)" }}
          >
            <ImagePlus className="h-4 w-4" /> Add slide
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              onFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={async () => {
              await saveHeroSlides(slides);
              toast.success("Hero slideshow updated");
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-accent"
          >
            <Save className="h-4 w-4" /> Save changes
          </button>
          <button
            type="button"
            onClick={async () => {
              await resetHeroSlides();
              setSlides(DEFAULT_SLIDES);
              toast.success("Restored default slides");
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>

        <div className="mt-8 grid gap-5">
          {slides.map((s, i) => (
            <div key={s.id} className="surface-card grid gap-5 p-5 sm:grid-cols-[14rem_1fr]">
              <div className="relative overflow-hidden rounded-xl">
                <img src={s.img} alt={s.title} className="h-40 w-full object-cover sm:h-full" />
                <label className="absolute inset-x-2 bottom-2 cursor-pointer rounded-lg bg-background/90 py-2 text-center text-xs font-bold text-navy">
                  Replace image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      onFiles(e.target.files, s.id);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              <div className="grid gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    Title
                  </label>
                  <input
                    value={s.title}
                    onChange={(e) => update(s.id, { title: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                    Subtitle
                  </label>
                  <input
                    value={s.sub}
                    onChange={(e) => update(s.id, { sub: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy hover:bg-accent"
                  >
                    <ArrowUp className="h-3.5 w-3.5" /> Up
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy hover:bg-accent"
                  >
                    <ArrowDown className="h-3.5 w-3.5" /> Down
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSlides((prev) =>
                        prev.length > 1 ? prev.filter((x) => x.id !== s.id) : prev,
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 rounded-xl bg-secondary px-4 py-3 text-xs text-muted-foreground">
          Slides are stored in this browser for now. When the Neon backend is wired up, swap the two
          functions in <code>src/lib/hero-slides.ts</code> for server calls and this screen keeps
          working unchanged.
        </p>
      </section>
    </div>
  );
}

function RatesPanel() {
  const [rates, setRates] = useState<DailyRate[]>([]);
  const [customCurrencies, setCustomCurrencies] = useState<CustomCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [rateDisplay, setRateDisplay] = useState<Record<string, string>>({});
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newSymbol, setNewSymbol] = useState("");
  const [newFlag, setNewFlag] = useState("🌐");

  const COMMON_FLAGS = [
    "🌐", "🇺🇸", "🇪🇺", "🇬🇧", "🇯🇵", "🇨🇭", "🇦🇺", "🇨🇦", "🇸🇬", "🇭🇰",
    "🇦🇪", "🇸🇦", "🇶🇦", "🇰🇼", "🇧🇭", "🇴🇲", "🇮🇳", "🇨🇳", "🇰🇷", "🇹🇭",
    "🇲🇾", "🇮🇩", "🇵🇭", "🇻🇳", "🇹🇷", "🇷🇺", "🇿🇦", "🇳🇬", "🇪🇬", "🇧🇷",
    "🇲🇽", "🇦🇷", "🇨🇱", "🇨🇴", "🇵🇪", "🇵🇰", "🇧🇩", "🇱🇰", "🇳🇵", "🇲🇲",
    "🇰🇪", "🇪🇹", "🇬🇭", "🇹🇿", "🇺🇬", "🇲🇿", "🇦🇴", "🇨🇩", "🇸🇳", "🇨🇲",
  ];

  useEffect(() => {
    Promise.all([loadDailyRates(), loadCustomCurrencies()]).then(([r, cc]) => {
      setRates(r);
      setCustomCurrencies(cc);
      setLoading(false);
    });
  }, []);

  const allCurrencies = [
    ...CURRENCIES.map((c) => ({ code: c.code, name: c.name, symbol: c.symbol, flag: c.flag })),
    ...customCurrencies,
  ];

  const update = (code: string, field: "buy" | "sell", value: string) => {
    // Allow empty, digits, and one decimal point — store as string so decimals work while typing
    if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
    setRates((prev) =>
      prev.map((r) =>
        r.code === code ? { ...r, [field]: value === "" ? 0 : parseFloat(value) || 0 } : r,
      ),
    );
    // Keep the raw string in the input by using a separate display state
    setRateDisplay((prev) => ({ ...prev, [`${code}-${field}`]: value }));
  };

  const addCurrency = async () => {
    const code = newCode.trim().toUpperCase();
    if (!code || code.length < 2 || code.length > 5) {
      toast.error("Currency code must be 2-5 characters");
      return;
    }
    if (allCurrencies.find((c) => c.code === code)) {
      toast.error("Currency code already exists");
      return;
    }
    const name = newName.trim() || code;
    const symbol = newSymbol.trim() || code;
    const curr: CustomCurrency = { code, name, symbol, flag: newFlag };
    await saveCustomCurrency({ data: curr });
    setCustomCurrencies((prev) => [...prev, curr]);
    setRates((prev) => [...prev, { code, buy: 0, sell: 0 }]);
    setNewCode("");
    setNewName("");
    setNewSymbol("");
    setNewFlag("🌐");
    setShowAdd(false);
    toast.success(`${code} added — set its buy/sell rates below`);
  };

  const removeCurrency = async (code: string) => {
    if (!confirm(`Remove ${code} from your currency list?`)) return;
    await deleteCustomCurrency({ data: code });
    setCustomCurrencies((prev) => prev.filter((c) => c.code !== code));
    setRates((prev) => prev.filter((r) => r.code !== code));
    toast.success(`${code} removed`);
  };

  const handleSave = async () => {
    await saveDailyRates({ data: rates });
    toast.success("Daily rates saved — changes are live on the website");
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm text-muted-foreground">Loading rates…</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="surface-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-navy">Set today's exchange rates</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              These rates are shown to customers on the home page, rates page, and in the exchange widget.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-accent"
          >
            <Plus className="h-4 w-4" /> Add currency
          </button>
        </div>

        {showAdd && (
          <div className="mt-5 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-5">
            <h3 className="text-sm font-bold text-navy">New currency</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Code</label>
                <input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase().slice(0, 5))}
                  placeholder="e.g. KWD"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Name</label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Kuwaiti Dinar"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Symbol</label>
                <input
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  placeholder="e.g. د.ك"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Flag</label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{newFlag}</span>
                  <select
                    value={newFlag}
                    onChange={(e) => setNewFlag(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                  >
                    {COMMON_FLAGS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={addCurrency}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Plus className="h-4 w-4" /> Add
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-muted-foreground hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <div className="max-h-[36rem] overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 text-primary-foreground">
                <tr style={{ background: "var(--gradient-primary)" }}>
                  <th className="px-4 py-3 font-semibold">Currency</th>
                  <th className="px-4 py-3 text-right font-semibold">Buy (₹)</th>
                  <th className="px-4 py-3 text-right font-semibold">Sell (₹)</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((r) => {
                  const meta = allCurrencies.find((c) => c.code === r.code);
                  const isCustom = !CURRENCIES.find((c) => c.code === r.code);
                  return (
                    <tr
                      key={r.code}
                      className="border-t border-border transition-colors hover:bg-accent/60"
                    >
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-3">
                          <span className="text-lg">{meta?.flag ?? "🌐"}</span>
                          <span>
                            <span className="block font-bold text-navy">
                              {r.code}
                              {isCustom && (
                                <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold">
                                  CUSTOM
                                </span>
                              )}
                            </span>
                            <span className="block text-xs uppercase text-muted-foreground">
                              {meta?.name ?? r.code}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input
                          inputMode="decimal"
                          value={rateDisplay[`${r.code}-buy`] ?? String(r.buy)}
                          onChange={(e) => update(r.code, "buy", e.target.value)}
                          className="w-24 rounded-lg border border-input bg-background px-3 py-2 text-right text-sm font-semibold text-navy outline-none focus:ring-2 focus:ring-ring/40"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input
                          inputMode="decimal"
                          value={rateDisplay[`${r.code}-sell`] ?? String(r.sell)}
                          onChange={(e) => update(r.code, "sell", e.target.value)}
                          className="w-24 rounded-lg border border-input bg-background px-3 py-2 text-right text-sm font-semibold text-primary outline-none focus:ring-2 focus:ring-ring/40"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isCustom && (
                          <button
                            type="button"
                            onClick={() => removeCurrency(r.code)}
                            className="inline-flex items-center gap-1 rounded-lg border border-destructive/40 px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Save className="h-4 w-4" /> Save today's rates
          </button>
          <p className="text-xs text-muted-foreground">
            Rates are stored per day. Custom currencies appear across the entire website.
          </p>
        </div>
      </div>
    </section>
  );
}
