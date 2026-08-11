import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Trash2 } from "lucide-react";
import { inr } from "@/lib/shop-data";
import { cartTotals, useShop } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Cart — Wood & Wonders" },
      { name: "description", content: "Review your selected furniture, quantities and order summary before checkout." },
      { property: "og:title", content: "Shopping Cart — Wood & Wonders" },
      { property: "og:description", content: "Review your furniture order before checkout." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, remove, setQty, toggleWish } = useShop();
  const t = cartTotals(cart);

  return (
    <div className="container-ww py-10">
      <h1 className="text-3xl sm:text-4xl">Shopping Cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{cart.length} item(s)</p>

      {cart.length === 0 ? (
        <div className="surface-card mt-8 p-14 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link to="/shop" className="btn-primary mt-6">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            {t.items.map(({ line, product }, i) => (
              <div key={i} className="surface-card grid grid-cols-[88px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[120px_minmax(0,1fr)]">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  width={240}
                  height={240}
                  className="aspect-square w-full rounded-md object-cover"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Link to="/product/$id" params={{ id: product.id }} className="font-semibold hover:text-accent">
                      {product.name}
                    </Link>
                    <span className="font-semibold">{inr(product.price * line.qty)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {line.colour} · {line.fabric} · {line.size}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center rounded-md border border-border text-sm">
                      <button className="px-3 py-1.5" onClick={() => setQty(i, line.qty - 1)}>−</button>
                      <span className="w-8 text-center">{line.qty}</span>
                      <button className="px-3 py-1.5" onClick={() => setQty(i, line.qty + 1)}>+</button>
                    </div>
                    <button
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent"
                      onClick={() => toggleWish(product.id)}
                    >
                      <Heart size={14} /> Move to wishlist
                    </button>
                    <button
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                      onClick={() => remove(i)}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="surface-card h-fit p-6">
            <h2 className="text-xl">Order Summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <Row label="Subtotal" value={inr(t.subtotal)} />
              <Row label="Discount" value={`− ${inr(t.discountAmt)}`} accent />
              <Row label="GST (18%)" value={inr(t.gst)} />
              <Row label="Delivery" value={t.delivery === 0 ? "Free" : inr(t.delivery)} />
              <div className="border-t border-border pt-3">
                <Row label="Grand Total" value={inr(t.total)} bold />
              </div>
            </dl>
            <Link to="/login" className="btn-primary mt-6 w-full">
              Proceed to Checkout
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Mock checkout — no real payment is collected.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-base font-semibold" : ""}`}>
      <dt className={bold ? "" : "text-muted-foreground"}>{label}</dt>
      <dd className={accent ? "text-accent" : ""}>{value}</dd>
    </div>
  );
}
