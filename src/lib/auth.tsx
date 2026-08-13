import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const ADMIN_EMAIL = "ankitdhanoki797@gmail.com";

export const PERMISSIONS = [
  { id: "products", label: "Products" },
  { id: "categories", label: "Categories" },
  { id: "orders", label: "Orders & tracking" },
  { id: "customers", label: "Customers" },
  { id: "messages", label: "Messages" },
  { id: "banners", label: "Banners" },
  { id: "settings", label: "Settings" },
] as const;

export type PermissionId = (typeof PERMISSIONS)[number]["id"];

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
};

type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: string[];
  permissions: string[];
  isAdmin: boolean;
  isJrAdmin: boolean;
  can: (p: PermissionId) => boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);

  async function loadFor(userId: string | undefined) {
    if (!userId) {
      setProfile(null);
      setRoles([]);
      setPermissions([]);
      return;
    }
    const [p, r, perm] = await Promise.all([
      supabase.from("profiles").select("id,email,full_name,avatar_url,phone").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("admin_permissions").select("permission").eq("user_id", userId),
    ]);
    setProfile((p.data as Profile | null) ?? null);
    setRoles((r.data ?? []).map((x) => x.role as string));
    setPermissions((perm.data ?? []).map((x) => x.permission as string));
  }

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!active) return;
      setSession(s);
      void loadFor(s?.user?.id);
    });

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadFor(data.session?.user?.id);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const isAdmin = roles.includes("admin");
  const isJrAdmin = roles.includes("jr_admin");

  const value = useMemo<AuthState>(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      profile,
      roles,
      permissions,
      isAdmin,
      isJrAdmin,
      can: (p) => isAdmin || permissions.includes(p),
      signOut: async () => {
        await supabase.auth.signOut();
      },
      refresh: async () => {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        await loadFor(data.session?.user?.id);
      },
    }),
    [loading, session, profile, roles, permissions, isAdmin, isJrAdmin],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
