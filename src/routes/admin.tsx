import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useAuth, PERMISSIONS, type PermissionId } from "@/lib/auth";
import { listManagedUsers, setUserRole, setUserPermissions, type ManagedUser } from "@/lib/admin.functions";
import {
  LayoutDashboard,
  Boxes,
  Tags,
  ShoppingCart,
  Users,
  Ticket,
  Star,
  Image as ImageIcon,
  Settings,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { inr, products } from "@/lib/shop-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Wood & Wonders" },
      { name: "description", content: "Demo admin console for sales, orders, products, customers and catalogue management." },
      { property: "og:title", content: "Admin Dashboard — Wood & Wonders" },
      { property: "og:description", content: "Manage the Wood & Wonders store catalogue and orders." },
    ],
  }),
  component: Admin,
});

const nav: { id: string; icon: typeof Boxes; perm?: PermissionId; adminOnly?: boolean }[] = [
  { id: "Dashboard", icon: LayoutDashboard },
  { id: "Products", icon: Boxes, perm: "products" },
  { id: "Categories", icon: Tags, perm: "categories" },
  { id: "Orders", icon: ShoppingCart, perm: "orders" },
  { id: "Customers", icon: Users, perm: "customers" },
  { id: "Coupons", icon: Ticket },
  { id: "Reviews", icon: Star },
  { id: "Banners", icon: ImageIcon, perm: "banners" },
  { id: "Settings", icon: Settings, perm: "settings" },
  { id: "Access", icon: ShieldCheck, adminOnly: true },
];

const recentOrders = [
  { id: "WW1025", customer: "Ananya Sharma", city: "Bengaluru", total: 64899, status: "Out for Delivery" },
  { id: "WW1024", customer: "Rohit Menon", city: "Mumbai", total: 88499, status: "Processing" },
  { id: "WW1023", customer: "Priya Nair", city: "Kochi", total: 32999, status: "Pending" },
  { id: "WW1022", customer: "Vikram Singh", city: "New Delhi", total: 129999, status: "Delivered" },
  { id: "WW1021", customer: "Meera Iyer", city: "Chennai", total: 18999, status: "Delivered" },
];

function Admin() {
  const { loading, session, isAdmin, isJrAdmin, can } = useAuth();
  const [tab, setTab] = useState<string>("Dashboard");
  if (loading) return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</div>;
  if (!session || !(isAdmin || isJrAdmin)) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="max-w-sm text-center">
          <h1 className="text-2xl">Admin access only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {session ? "Your account doesn't have admin access." : "Please log in with an admin account."}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            {!session && <Link to="/login" className="btn-primary">Log in</Link>}
            <Link to="/" className="btn-outline">Back to store</Link>
          </div>
        </div>
      </div>
    );
  }
  const visible = nav.filter((n) => (n.adminOnly ? isAdmin : !n.perm || can(n.perm)));

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col bg-[var(--sidebar)] p-4 text-[var(--sidebar-foreground)] lg:flex">
        <p className="px-2 font-display text-lg">Wood &amp; Wonders</p>
        <p className="mb-6 px-2 text-[0.65rem] uppercase tracking-[0.2em] opacity-60">Admin</p>
        <nav className="grid gap-1 text-sm">
          {visible.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left ${
                tab === n.id ? "bg-[var(--sidebar-accent)] font-semibold" : "opacity-70 hover:opacity-100"
              }`}
            >
              <n.icon size={16} /> {n.id}
            </button>
          ))}
        </nav>
        <Link to="/" className="mt-auto flex items-center gap-2 px-3 py-2 text-xs opacity-70 hover:opacity-100">
          <ArrowLeft size={14} /> Back to store
        </Link>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-card px-6 py-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl">{tab}</h1>
            <p className="text-xs text-muted-foreground">Demo data · read-only prototype</p>
          </div>
          <Link to="/" className="btn-outline shrink-0 py-2 lg:hidden">
            Store
          </Link>
        </header>

        <div className="p-6">
          <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
            {visible.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs ${
                  tab === n.id ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground"
                }`}
              >
                {n.id}
              </button>
            ))}
          </div>

          {tab === "Access" && isAdmin ? (
            <AccessManager />
          ) : tab === "Products" ? (
            <ProductManager />
          ) : tab === "Orders" ? (
            <OrdersTable />
          ) : tab === "Dashboard" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <Stat label="Total Sales" value={inr(4820500)} sub="+18% vs last month" />
                <Stat label="Orders" value="284" sub="+32 this week" />
                <Stat label="Pending Orders" value="17" sub="4 awaiting payment" />
                <Stat label="Products" value={String(products.length * 18)} sub="9 categories" />
                <Stat label="Customers" value="1,942" sub="+126 new" />
              </div>
              <div className="mt-8">
                <OrdersTable />
              </div>
            </>
          ) : (
            <div className="surface-card p-12 text-center text-sm text-muted-foreground">
              {tab} module — demo placeholder.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="surface-card p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function OrdersTable() {
  return (
    <div className="surface-card overflow-x-auto p-6">
      <h2 className="text-lg">Recent orders</h2>
      <table className="mt-4 w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
            <th className="pb-3">Order</th>
            <th className="pb-3">Customer</th>
            <th className="pb-3">City</th>
            <th className="pb-3">Total</th>
            <th className="pb-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((o) => (
            <tr key={o.id} className="border-b border-border last:border-0">
              <td className="py-3.5 font-semibold">#{o.id}</td>
              <td className="py-3.5 text-muted-foreground">{o.customer}</td>
              <td className="py-3.5 text-muted-foreground">{o.city}</td>
              <td className="py-3.5">{inr(o.total)}</td>
              <td className="py-3.5">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs">{o.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductManager() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="surface-card overflow-x-auto p-6">
        <h2 className="text-lg">Catalogue</h2>
        <table className="mt-4 w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
              <th className="pb-3">Product</th>
              <th className="pb-3">SKU</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" loading="lazy" width={40} height={40} className="h-10 w-10 rounded object-cover" />
                    <span className="truncate">{p.name}</span>
                  </div>
                </td>
                <td className="py-3 text-muted-foreground">WW-{1000 + i}</td>
                <td className="py-3">{inr(p.price)}</td>
                <td className="py-3 text-muted-foreground">{p.inStock ? 12 + i : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="surface-card h-fit p-6">
        <h2 className="text-lg">Add / edit product</h2>
        <form className="mt-4 grid gap-4" onSubmit={(e) => e.preventDefault()}>
          <F label="Product name" placeholder="Modern 3 Seater Premium Sofa" />
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Product images</span>
            <div className="mt-1.5 grid place-items-center rounded-md border border-dashed border-border py-8 text-xs text-muted-foreground">
              Drop images or click to upload
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Description</span>
            <textarea
              rows={3}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <F label="Price (₹)" placeholder="54999" />
            <F label="SKU" placeholder="WW-SF-3001" />
            <F label="Stock" placeholder="24" />
            <F label="Category" placeholder="Sofas" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Variations</span>
            <div className="mt-2 grid gap-3">
              <F label="Colour" placeholder="Beige, Grey, Brown" />
              <F label="Size" placeholder="3 Seater, 4 Seater, L Shape" />
              <F label="Material" placeholder="Velvet, Boucle, Leatherette" />
            </div>
          </div>
          <button className="btn-primary">Save product</button>
        </form>
      </div>
    </div>
  );
}

function F({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}

function AccessManager() {
  const list = useServerFn(listManagedUsers);
  const saveRole = useServerFn(setUserRole);
  const savePerms = useServerFn(setUserPermissions);
  const [users, setUsers] = useState<ManagedUser[] | null>(null);
  const load = () => list().then(setUsers).catch((e) => toast.error(e.message));
  useEffect(() => { void load(); }, []);

  if (!users) return <p className="text-sm text-muted-foreground">Loading users…</p>;
  return (
    <div className="surface-card overflow-x-auto p-6">
      <h2 className="text-lg">Staff access</h2>
      <p className="mt-1 text-xs text-muted-foreground">Make a user a junior admin, then tick what they can manage.</p>
      <div className="mt-4 grid gap-4">
        {users.map((u) => {
          const role = u.roles.includes("admin") ? "admin" : u.roles.includes("jr_admin") ? "jr_admin" : "customer";
          return (
            <div key={u.id} className="rounded-md border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{u.full_name || u.email}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                </div>
                {role === "admin" ? (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs">Admin</span>
                ) : (
                  <select
                    value={role}
                    onChange={async (e) => {
                      try {
                        await saveRole({ data: { userId: u.id, role: e.target.value as "jr_admin" | "customer" } });
                        toast.success("Role updated");
                        load();
                      } catch (err) { toast.error((err as Error).message); }
                    }}
                    className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                  >
                    <option value="customer">Customer</option>
                    <option value="jr_admin">Junior admin</option>
                  </select>
                )}
              </div>
              {role === "jr_admin" && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {PERMISSIONS.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={u.permissions.includes(p.id)}
                        onChange={async (e) => {
                          const next = e.target.checked ? [...u.permissions, p.id] : u.permissions.filter((x) => x !== p.id);
                          try {
                            await savePerms({ data: { userId: u.id, permissions: next } });
                            setUsers((all) => all!.map((x) => (x.id === u.id ? { ...x, permissions: next } : x)));
                          } catch (err) { toast.error((err as Error).message); }
                        }}
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
