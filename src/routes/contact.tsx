import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { COMPANY } from "@/lib/forex-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Kirat Forex — Berhampore, Murshidabad" },
      {
        name: "description",
        content:
          "Call, WhatsApp or visit Kirat Forex Pvt Ltd in Berhampore, Murshidabad for currency exchange, forex cards and travel packages.",
      },
      { property: "og:title", content: "Contact Kirat Forex Pvt Ltd" },
      {
        property: "og:description",
        content: "Reach our Murshidabad forex desk by phone, WhatsApp or email.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      toast.error("Please enter your name");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Enter a valid 10 digit mobile number");
      return;
    }
    toast.success("Message sent — our team will call you shortly.");
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <div>
      <PageHero
        eyebrow="Contact Us"
        title="Talk to our Murshidabad forex desk"
        sub="Open Monday to Saturday, 10:00 AM – 7:00 PM"
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1fr]">
        <Reveal from="left" className="space-y-5">
          {[COMPANY.registered, COMPANY.branch].map((o) => (
            <div key={o.label} className="surface-card p-6">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <MapPin className="h-4 w-4" /> {o.label}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-navy">{o.address}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`tel:${o.tel}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-primary hover:text-primary"
                >
                  <Phone className="h-4 w-4" /> {o.phone}
                </a>
                <a
                  href={`https://wa.me/${o.tel.replace("+", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
          ))}

          <div className="surface-card space-y-3 p-6 text-sm text-navy">
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-primary">
                {COMPANY.email}
              </a>
            </p>
            <p className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary" /> Mon – Sat · 10:00 AM to 7:00 PM
            </p>
          </div>
        </Reveal>

        <Reveal from="right" className="surface-card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-navy">Send us a message</h2>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold text-muted-foreground">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                Mobile Number
              </label>
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                }
                placeholder="10 digit mobile number"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                Message
              </label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Which currency do you need, and when?"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <button
              type="submit"
              className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:scale-[1.03]"
              style={{ background: "var(--gradient-primary)" }}
            >
              Send message
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </Reveal>
      </section>
    </div>
  );
}
