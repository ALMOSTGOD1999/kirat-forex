import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, MessageCircle, X, LogIn, LogOut, UserRound } from "lucide-react";
import { COMPANY } from "@/lib/forex-data";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";


const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/travel", label: "Travel" },
  { to: "/rates", label: "Rates" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;


export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="group flex items-center gap-3">
      <img
        src="/kirat-forex-logo.png"
        alt="Kirat Forex logo"
        className="h-11 w-11 rounded-full object-contain shadow-[var(--shadow-glow)]"
      />
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-base font-bold tracking-tight text-navy sm:text-lg">
            KIRAT FOREX
          </span>
          <span className="block text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground">
            Private Limited
          </span>
        </span>
      )}
    </span>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    setOpen(false);
    navigate({ to: "/", replace: true });
  }



  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl shadow-[var(--shadow-soft)]"
          : "bg-background",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" onClick={() => setOpen(false)} aria-label="Kirat Forex home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <a
            href={`https://wa.me/${COMPANY.registered.tel.replace("+", "")}`}
            target="_blank"
            rel="noreferrer"
            className="mr-2 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <MessageCircle className="h-4 w-4" /> Whatsapp
          </a>
          <a
            href={`tel:${COMPANY.registered.tel}`}
            className="mr-3 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative rounded-full px-4 py-2 text-sm font-semibold text-navy transition-colors after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-6"
              activeProps={{ className: "text-primary after:w-6" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <span className="ml-3 flex items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-navy transition-colors hover:text-primary"
                >
                  Admin
                </Link>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-2 text-sm font-semibold text-navy">
                <UserRound className="h-4 w-4" /> {user.name.split(" ")[0]}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </span>
          ) : (
            <Link
              to="/auth"
              className="ml-3 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:scale-105"
              style={{ background: "var(--gradient-primary)" }}
            >
              <LogIn className="h-4 w-4" /> Login / Sign up
            </Link>
          )}
        </nav>


        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-11 w-11 place-items-center rounded-full border border-border text-navy transition-colors hover:bg-accent lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background transition-all duration-500 lg:hidden",
          open ? "max-h-[32rem]" : "max-h-0 border-transparent",
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
          {NAV.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              style={{ animation: open ? `fade-up 0.4s ease-out ${i * 60}ms both` : undefined }}
              className="rounded-xl px-4 py-3 text-base font-semibold text-navy transition-colors hover:bg-accent"
              activeProps={{ className: "bg-accent text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}

          {user ? (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-navy">
                <UserRound className="h-4 w-4" /> {user.name}
              </div>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border border-border px-4 py-3 text-base font-semibold text-navy"
                >
                  Admin panel
                </Link>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-navy"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <LogIn className="h-4 w-4" /> Login / Sign up
            </Link>
          )}

          <div className="mt-2 grid grid-cols-2 gap-2">

            <a
              href={`tel:${COMPANY.registered.tel}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-navy"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            <a
              href={`https://wa.me/${COMPANY.registered.tel.replace("+", "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <MessageCircle className="h-4 w-4" /> Whatsapp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
