import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { byId, inr, sampleOrder } from "@/lib/shop-data";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order Confirmed #WW1025 — Wood & Wonders" },
      { name: "description", content: "Thank you for your order. Track delivery, download your invoice or continue shopping." },
      { property: "og:title", content: "Order Confirmed — Wood & Wonders" },
      { property: "og:description", content: "Your Wood & Wonders order has been placed." },
    ],
  }),
  component: Confirmation,
});

function Confirmation() {
  const product = byId("modern-3-seater-premium-sofa")!;
  const amount = Math.round(product.price * 1.18);

  return (
    <div className="container-ww py-16">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle2 size={44} className="mx-auto text-[var(--success)]" />
        <h1 className="mt-5 text-3xl sm:text-4xl">Thank You for Your Order</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          A confirmation has been sent to {sampleOrder.customer.email}. Order number{" "}
          <strong className="text-foreground">#{sampleOrder.number}</strong>
        </p>
      </div>

      <div className="surface-card mx-auto mt-10 max-w-2xl p-6">
        <div className="grid grid-cols-[80px_minmax(0,1fr)] gap-4">
          <img src={product.image} alt={product.name} loading="lazy" width={160} height={160} className="aspect-square w-full rounded-md object-cover" />
          <div className="min-w-0">
            <p className="font-semibold">{product.name}</p>
            <p className="text-xs text-muted-foreground">Beige · Velvet · 3 Seater · Qty 1</p>
            <p className="mt-2 font-semibold">{inr(amount)}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-border pt-6 text-sm sm:grid-cols-2">
          <Item label="Payment status" value={sampleOrder.payment} />
          <Item label="Estimated delivery" value={sampleOrder.eta} />
          <Item label="Delivery address" value={sampleOrder.customer.address} />
          <Item label="Contact" value={`${sampleOrder.customer.name} · ${sampleOrder.customer.phone}`} />
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/track-order" className="btn-primary">
            Track Order
          </Link>
          <Link to="/invoice" className="btn-outline">
            Download Invoice
          </Link>
          <Link to="/shop" className="btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
