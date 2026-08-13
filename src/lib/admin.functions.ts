import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export type ManagedUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  roles: string[];
  permissions: string[];
};

export const listManagedUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ManagedUser[]> => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: profiles }, { data: roles }, { data: perms }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id,email,full_name").order("created_at", { ascending: false }),
      supabaseAdmin.from("user_roles").select("user_id,role"),
      supabaseAdmin.from("admin_permissions").select("user_id,permission"),
    ]);

    return (profiles ?? []).map((p) => ({
      id: p.id,
      email: p.email,
      full_name: p.full_name,
      roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role as string),
      permissions: (perms ?? []).filter((r) => r.user_id === p.id).map((r) => r.permission),
    }));
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; role: "admin" | "jr_admin" | "customer" }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    if (data.userId === context.userId) throw new Error("You cannot change your own role");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.role });
    if (error) throw new Error(error.message);

    if (data.role !== "jr_admin") {
      await supabaseAdmin.from("admin_permissions").delete().eq("user_id", data.userId);
    }
    return { ok: true };
  });

export const setUserPermissions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; permissions: string[] }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await supabaseAdmin.from("admin_permissions").delete().eq("user_id", data.userId);
    if (data.permissions.length > 0) {
      const { error } = await supabaseAdmin
        .from("admin_permissions")
        .insert(data.permissions.map((permission) => ({ user_id: data.userId, permission })));
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
