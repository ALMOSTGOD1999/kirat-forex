import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, LogIn, Mail, User as UserIcon, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/PageHero";
import { useAuth } from "@/hooks/use-auth";
import { DEFAULT_ADMIN, signIn, signUp } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Sign Up | Kirat Forex Pvt Ltd" },
      {
        name: "description",
        content:
          "Log in or create your Kirat Forex account to track currency exchange quotes, advance payments and approvals.",
      },
      { property: "og:title", content: "Login or Sign Up | Kirat Forex Pvt Ltd" },
      {
        property: "og:description",
        content: "Access your Kirat Forex account to track quotes and approvals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const href = useRouterState({ select: (s) => s.location.href });

  useEffect(() => {
    if (user) navigate({ to: user.role === "admin" ? "/admin" : "/", replace: true });
  }, [user, navigate, href]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const account =
        mode === "login"
          ? await signIn(email, password)
          : await signUp(name, email, password);
      toast.success(mode === "login" ? `Welcome back, ${account.name}` : "Account created");
      navigate({ to: account.role === "admin" ? "/admin" : "/", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-navy outline-none transition-colors focus:border-primary";

  return (
    <div>
      <PageHero
        eyebrow="Account"
        title={mode === "login" ? "Welcome back" : "Create your account"}
        sub="Log in to follow your quote requests, advance payments and approval status."
      />

      <section className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-accent p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-full py-2 text-sm font-semibold transition-all ${
                  mode === m
                    ? "bg-background text-primary shadow-[var(--shadow-soft)]"
                    : "text-muted-foreground hover:text-navy"
                }`}
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className={field}
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={field}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className={field}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
              style={{ background: "var(--gradient-primary)" }}
            >
              {mode === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="mt-5 rounded-xl bg-accent px-4 py-3 text-xs text-muted-foreground">
            Admin demo access — {DEFAULT_ADMIN.email} / {DEFAULT_ADMIN.password}. Accounts are
            stored in the database.
          </p>
        </div>
      </section>
    </div>
  );
}
