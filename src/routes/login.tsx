import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login or Register — Wood & Wonders" },
      { name: "description", content: "Sign in with email, mobile OTP or create a Wood & Wonders account to track orders." },
      { property: "og:title", content: "Login or Register — Wood & Wonders" },
      { property: "og:description", content: "Access your Wood & Wonders account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [method, setMethod] = useState<"password" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);
  const { login } = useShop();
  const navigate = useNavigate();

  return (
    <div className="container-ww grid place-items-center py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="eyebrow">Wood &amp; Wonders</span>
          <h1 className="mt-3 text-3xl">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to check out faster and track your orders."
              : "Save addresses, wishlists and invoices in one place."}
          </p>
        </div>

        <div className="surface-card mt-8 p-6">
          <div className="mb-6 grid grid-cols-2 rounded-md bg-secondary p-1 text-sm">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md py-2 font-semibold capitalize ${
                  mode === m ? "bg-card text-accent shadow-sm" : "text-muted-foreground"
                }`}
              >
                {m === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              login();
              navigate({ to: "/checkout" });
            }}
          >
            {mode === "register" && <Field label="Full name" placeholder="Ananya Sharma" />}
            {method === "password" ? (
              <>
                <Field label="Email address" type="email" placeholder="you@example.com" />
                <Field label="Mobile number" placeholder="+91 98450 21178" />
                <Field label="Password" type="password" placeholder="••••••••" />
              </>
            ) : (
              <>
                <Field label="Mobile number" placeholder="+91 98450 21178" />
                {otpSent && <Field label="Enter OTP" placeholder="6-digit code" />}
                {!otpSent && (
                  <button
                    type="button"
                    className="btn-outline w-full"
                    onClick={() => setOtpSent(true)}
                  >
                    Send OTP
                  </button>
                )}
              </>
            )}

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                className="text-accent hover:underline"
                onClick={() => setMethod(method === "password" ? "otp" : "password")}
              >
                {method === "password" ? "Login with OTP instead" : "Use password instead"}
              </button>
              <button type="button" className="text-muted-foreground hover:text-accent">
                Forgot password?
              </button>
            </div>

            <button className="btn-primary w-full">
              {mode === "login" ? "Login & Continue" : "Create Account"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Demo authentication — no credentials are stored.{" "}
            <Link to="/account" className="text-accent hover:underline">
              Skip to account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}
