import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BadgeCheck, Building2, Clock3, Copy, QrCode, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/PageHero";
import {
  DEFAULT_PAYMENT,
  QUOTES_EVENT,
  getQuote,
  loadPaymentSettings,
  type PaymentSettings,
  type QuoteRequest,
} from "@/lib/quotes";

export const Route = createFileRoute("/quote/$id")({
  head: () => ({
    meta: [
      { title: "Confirm Your Forex Quote | Kirat Forex" },
      {
        name: "description",
        content:
          "Review your forex quote, pay the advance to Kirat Forex via bank transfer or UPI QR, and track approval from our Murshidabad desk.",
      },
      { property: "og:title", content: "Confirm Your Forex Quote | Kirat Forex" },
      {
        property: "og:description",
        content: "Pay the advance amount by bank transfer or UPI QR and await approval.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: QuotePage,
});

function Row({ label, value, copy }: { label: string; value: string; copy?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="flex items-center gap-2 text-right text-sm font-bold text-navy">
        {value}
        {copy && (
          <button
            type="button"
            aria-label={`Copy ${label}`}
            onClick={() => {
              navigator.clipboard?.writeText(value);
              toast.success(`${label} copied`);
            }}
            className="text-primary transition-transform hover:scale-110"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}
      </span>
    </div>
  );
}

function QuotePage() {
  const { id } = Route.useParams();
  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [pay, setPay] = useState<PaymentSettings>(DEFAULT_PAYMENT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = async () => {
      setQuote((await getQuote(id)) ?? null);
      setPay(await loadPaymentSettings());
      setReady(true);
    };
    sync();
    window.addEventListener(QUOTES_EVENT, sync);
    const t = window.setInterval(sync, 4000);
    return () => {
      window.removeEventListener(QUOTES_EVENT, sync);
      window.clearInterval(t);
    };
  }, [id]);

  return (
    <div>
      <PageHero
        eyebrow="Step 2 of 2"
        title="Confirm your quote"
        sub="Pay the advance to lock your rate. Our Murshidabad desk approves your order right after."
      />

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        {!ready ? (
          <p className="text-sm text-muted-foreground">Loading your quote…</p>
        ) : !quote ? (
          <div className="surface-card p-8 text-center">
            <XCircle className="mx-auto h-10 w-10 text-destructive" />
            <h2 className="mt-4 text-xl font-bold text-navy">Quote not found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This request may have been placed on another device. Please raise a new quote.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl px-6 py-3 text-sm font-bold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              Get a new quote
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
            <div className="surface-card animate-fade-in p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-navy">Order summary</h2>
                <StatusPill status={quote.status} />
              </div>
              <div className="mt-4">
                <Row label="Reference" value={quote.reference} copy />
                <Row
                  label={quote.mode === "buy" ? "You buy" : "You sell"}
                  value={`${quote.fxAmount} ${quote.code}`}
                />
                <Row label="Rate" value={`1 ${quote.code} = ₹ ${quote.rate}`} />
                <Row label="Total INR" value={`₹ ${quote.inrAmount}`} />
                <Row label="Advance payable" value={`₹ ${quote.advance}`} />
                <Row label="Mobile" value={`+91 ${quote.mobile}`} />
                <Row label="Email" value={quote.email} />
              </div>
              <p className="mt-5 flex items-start gap-2 rounded-xl bg-secondary px-4 py-3 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Rates are indicative and locked once the advance ({pay.advancePercent}% of order
                value) reflects in our account and the request is approved.
              </p>
            </div>

            <div className="surface-card animate-fade-in p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
                <Building2 className="h-5 w-5 text-primary" /> Pay the advance
              </h2>
              <div className="mt-4">
                <Row label="Bank" value={pay.bankName} />
                <Row label="Account name" value={pay.accountName} />
                <Row label="Account no." value={pay.accountNumber} copy />
                <Row label="IFSC" value={pay.ifsc} copy />
                <Row label="Branch" value={pay.branch} />
                <Row label="UPI ID" value={pay.upiId} copy />
              </div>

              <div className="mt-5 grid place-items-center rounded-xl border border-dashed border-border bg-secondary p-5">
                {pay.qrImage ? (
                  <img
                    src={pay.qrImage}
                    alt={`UPI payment QR code for ${pay.accountName}`}
                    className="h-48 w-48 rounded-lg bg-background object-contain p-2"
                  />
                ) : (
                  <div className="grid h-48 w-48 place-items-center rounded-lg bg-background text-center text-xs text-muted-foreground">
                    <span>
                      <QrCode className="mx-auto mb-2 h-8 w-8 text-primary" />
                      QR code will appear here once uploaded by the admin
                    </span>
                  </div>
                )}
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Scan with any UPI app and use reference{" "}
                  <span className="font-bold text-navy">{quote.reference}</span>
                </p>
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-xl bg-accent/60 px-4 py-3 text-xs text-navy">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                After paying, keep this page handy — the status updates to{" "}
                <span className="font-bold">Approved</span> once our team verifies your advance.
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function StatusPill({ status }: { status: QuoteRequest["status"] }) {
  const map = {
    pending: { label: "Awaiting approval", cls: "bg-secondary text-navy", Icon: Clock3 },
    approved: { label: "Approved", cls: "bg-primary/10 text-primary", Icon: BadgeCheck },
    rejected: { label: "Rejected", cls: "bg-destructive/10 text-destructive", Icon: XCircle },
  }[status];
  const { Icon } = map;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${map.cls}`}
    >
      <Icon className="h-3.5 w-3.5" /> {map.label}
    </span>
  );
}
