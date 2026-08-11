import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { byId, sampleOrder } from "@/lib/shop-data";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Order #WW1025 — Wood & Wonders" },
      { name: "description", content: "Live delivery timeline for your Wood & Wonders furniture order." },
      { property: "og:title", content: "Track Your Order — Wood & Wonders" },
      { property: "og:description", content: "Follow your furniture from workshop to living room." },
    ],
  }),
  component: Track,
});

const timeline = [
  { label: "Order Placed", date: "11 Aug 2026, 10:24 AM", state: "done" },
  { label: "Payment Confirmed", date: "11 Aug 2026, 10:25 AM", state: "done" },
  { label: "Processing", date: "13 Aug 2026", state: "done" },
  { label: "Dispatched", date: "17 Aug 2026 · Bengaluru hub", state: "done" },
  { label: "Out for Delivery", date: "Expected 24 Aug 2026", state: "current" },
  { label: "Delivered", date: "Pending", state: "todo" },
] as const;

function Track() {
  const product = byId("modern-3-seater-premium-sofa")!;

  return (
    <div className="container-ww py-12">
      <h1 className="text-3xl sm:text-4xl">Track Order</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Order <strong className="text-foreground">#{sampleOrder.number}</strong> · Expected delivery{" "}
        {sampleOrder.eta}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ol className="surface-card space-y-0 p-8">
          {timeline.map((t, i) => (
            <li key={t.label} className="grid grid-cols-[28px_minmax(0,1fr)] gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-[0.6rem] ${
                    t.state === "done"
                      ? "bg-[var(--success)] text-background"
                      : t.state === "current"
                        ? "bg-accent text-accent-foreground"
                        : "border border-border bg-card"
                  }`}
                >
                  {t.state === "done" ? <Check size={13} /> : t.state === "current" ? "●" : ""}
                </span>
                {i < timeline.length - 1 && <span className="w-px flex-1 bg-border" />}
              </div>
              <div className="pb-8">
                <p className={`text-sm font-semibold ${t.state === "todo" ? "text-muted-foreground" : ""}`}>
                  {t.label}
                </p>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </div>
            </li>
          ))}
        </ol>

        <aside className="surface-card h-fit p-6">
          <h2 className="text-lg">Order item</h2>
          <img src={product.image} alt={product.name} loading="lazy" width={400} height={400} className="mt-4 aspect-square w-full rounded-md object-cover" />
          <p className="mt-3 text-sm font-semibold">{product.name}</p>
          <p className="text-xs text-muted-foreground">Beige · Velvet · 3 Seater</p>
          <Link to="/invoice" className="btn-outline mt-5 w-full">
            View Invoice
          </Link>
        </aside>
      </div>
    </div>
  );
}
