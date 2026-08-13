import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login or Register — Wood & Wonders" },
      { name: "description", content: "Sign in with email or Google to track orders, save addresses and check out faster." },
      { property: "og:title", content: "Login or Register — Wood & Wonders" },
      { property: "og:description", content: "Access your Wood & Wonders account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) navigate({ to: "/account", replace: true });
  }, [loading, session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/account" });
      } else if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: "/account" });
        } else {
          toast.success("Check your email to confirm your account");
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent — check your inbox");
        setMode("login");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/account" });
  }

  return (
    <div className="container-ww grid place-items-center py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="eyebrow">Wood &amp; Wonders</span>
          <h1 className="mt-3 text-3xl">
            {mode === "login" ? "Welcome back" : mode === "register" ? "Create your account" : "Reset your password"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "forgot"
              ? "We'll email you a secure link to set a new password."
              : mode === "login"
                ? "Sign in to check out faster and track your orders."
                : "Save addresses, wishlists and invoices in one place."}
          </p>
        </div>

        <div className="surface-card mt-8 p-6">
          {mode !== "forgot" && (
            <div className="mb-6 grid grid-cols-2 rounded-md bg-secondary p-1 text-sm">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-md py-2 font-semibold ${
                    mode === m ? "bg-card text-accent shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {m === "login" ? "Login" : "Sign up"}
                </button>
              ))}
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit}>
            {mode === "register" && (
              <Field label="Full name" value={name} onChange={setName} placeholder="Ananya Sharma" />
            )}
            <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
            {mode !== "forgot" && (
              <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
            )}

            <div className="flex items-center justify-between text-xs">
              {mode === "forgot" ? (
                <button type="button" className="text-accent hover:underline" onClick={() => setMode("login")}>
                  Back to login
                </button>
              ) : (
                <button
                  type="button"
                  className="text-muted-foreground hover:text-accent"
                  onClick={() => setMode("forgot")}
                >
                  Forgot password?
                </button>
              )}
            </div>

            <button className="btn-primary w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "login" ? "Login" : mode === "register" ? "Create account" : "Send reset link"}
            </button>
          </form>

          {mode !== "forgot" && (
            <>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>
              <button type="button" onClick={google} className="btn-outline w-full">
                Continue with Google
              </button>
            </>
          )}

          <p className="mt-5 text-center text-xs text-muted-foreground">
            By continuing you agree to our{" "}
            <Link to="/about" className="text-accent hover:underline">
              terms
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}
