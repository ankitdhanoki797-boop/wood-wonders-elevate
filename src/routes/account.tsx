import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Truck,
  Heart,
  MapPin,
  User,
  FileDown,
  LogOut,
} from "lucide-react";
import { byId, inr, products, sampleOrder } from "@/lib/shop-data";
import { useShop } from "@/lib/store";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Wood & Wonders" },
      { name: "description", content: "Manage your orders, wishlist, addresses, profile and invoices." },
      { property: "og:title", content: "My Account — Wood & Wonders" },
      { property: "og:description", content: "Your Wood & Wonders customer dashboard." },
    ],
  }),
  component: Account,
});

const nav = [
  { id: "Dashboard", icon: LayoutDashboard },
  { id: "My Orders", icon: Package },
  { id: "Track Order", icon: Truck },
  { id: "Wishlist", icon: Heart },
  { id: "Saved Addresses", icon: MapPin },
  { id: "Profile", icon: User },
  { id: "Download Invoices", icon: FileDown },
] as const;

const orders = [
  { id: "WW1025", date: "11 Aug 2026", items: 1, total: 64899, status: "Out for Delivery" },
  { id: "WW0984", date: "02 Jul 2026", items: 2, total: 53498, status: "Delivered" },
  { id: "WW0921", date: "18 May 2026", items: 1, total: 24999, status: "Delivered" },
];

function Account() {
  const [tab, setTab] = useState<string>("Dashboard");
  const { wishlist, logout } = useShop();
  const navigate = useNavigate();

  return (
    <div className="container-ww py-10">
      <h1 className="text-3xl sm:text-4xl">My Account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Welcome back, {sampleOrder.customer.name}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="surface-card h-fit p-3">
          <nav className="grid gap-1 text-sm">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left ${
                  tab === n.id ? "bg-secondary font-semibold text-accent" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <n.icon size={16} /> {n.id}
              </button>
            ))}
            <button
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-muted-foreground hover:bg-secondary"
            >
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </aside>

        <section className="min-w-0">
          {tab === "Dashboard" && (
            <div className="grid gap-5 sm:grid-cols-3">
              <Stat label="Total orders" value="12" />
              <Stat label="Lifetime spend" value={inr(487500)} />
              <Stat label="Wishlist items" value={String(wishlist.length)} />
              <div className="surface-card p-6 sm:col-span-3">
                <h2 className="text-lg">Latest order</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  #{sampleOrder.number} · Out for delivery · Expected {sampleOrder.eta}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to="/track-order" className="btn-primary">Track Order</Link>
                  <Link to="/invoice" className="btn-outline">View Invoice</Link>
                </div>
              </div>
            </div>
          )}

          {tab === "My Orders" && (
            <div className="surface-card overflow-x-auto p-6">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                    <th className="pb-3">Order</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-border last:border-0">
                      <td className="py-4 font-semibold">#{o.id}</td>
                      <td className="py-4 text-muted-foreground">{o.date}</td>
                      <td className="py-4 text-muted-foreground">{o.items}</td>
                      <td className="py-4">{inr(o.total)}</td>
                      <td className="py-4">
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs">{o.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "Track Order" && (
            <div className="surface-card p-8 text-sm">
              <p className="text-muted-foreground">
                Order #{sampleOrder.number} is out for delivery, expected {sampleOrder.eta}.
              </p>
              <Link to="/track-order" className="btn-primary mt-5">Open full timeline</Link>
            </div>
          )}

          {tab === "Wishlist" && (
            <div>
              {wishlist.length === 0 ? (
                <div className="surface-card p-12 text-center text-sm text-muted-foreground">
                  Nothing saved yet. Tap the heart on any product.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
                  {wishlist.map((id) => {
                    const p = byId(id);
                    return p ? <ProductCard key={id} product={p} /> : null;
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "Saved Addresses" && (
            <div className="grid gap-5 sm:grid-cols-2">
              {["Home", "Office"].map((label) => (
                <div key={label} className="surface-card p-6 text-sm">
                  <p className="font-semibold">{label}</p>
                  <p className="mt-2 text-muted-foreground">{sampleOrder.customer.address}</p>
                  <p className="mt-2 text-muted-foreground">{sampleOrder.customer.phone}</p>
                  <div className="mt-4 flex gap-3 text-xs">
                    <button className="text-accent hover:underline">Edit</button>
                    <button className="text-muted-foreground hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "Profile" && (
            <div className="surface-card grid gap-4 p-6 sm:grid-cols-2">
              <Field label="Full name" value={sampleOrder.customer.name} />
              <Field label="Email" value={sampleOrder.customer.email} />
              <Field label="Mobile" value={sampleOrder.customer.phone} />
              <Field label="Preferred city" value="Bengaluru" />
              <div className="sm:col-span-2">
                <button className="btn-primary">Save changes</button>
              </div>
            </div>
          )}

          {tab === "Download Invoices" && (
            <div className="surface-card divide-y divide-border p-6 text-sm">
              {orders.map((o) => (
                <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-semibold">INV-2026-{o.id.slice(2)}</p>
                    <p className="text-xs text-muted-foreground">Order #{o.id} · {o.date}</p>
                  </div>
                  <Link to="/invoice" className="btn-outline py-2">
                    <FileDown size={14} /> Download
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl">Recommended for you</h2>
        <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card p-6">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        defaultValue={value}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}
