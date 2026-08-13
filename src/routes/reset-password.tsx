import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a New Password — Wood & Wonders" },
      { name: "description", content: "Choose a new password for your Wood & Wonders account." },
      { property: "og:title", content: "Set a New Password — Wood & Wonders" },
      { property: "og:description", content: "Securely update your Wood & Wonders password." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Use at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    navigate({ to: "/account" });
  }

  return (
    <div className="container-ww grid place-items-center py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="eyebrow">Account security</span>
          <h1 className="mt-3 text-3xl">Set a new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Open this page from the reset link we emailed you.
          </p>
        </div>
        <form className="surface-card mt-8 space-y-4 p-6" onSubmit={onSubmit}>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">New password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Confirm password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
