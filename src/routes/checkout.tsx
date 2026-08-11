import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { inr } from "@/lib/shop-data";
import { cartTotals, useShop } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — Wood & Wonders" },
      { name: "description", content: "Complete your furniture order: delivery address, delivery method and payment." },
      { property: "og:title", content: "Secure Checkout — Wood & Wonders" },
      { property: "og:description", content: "Multi-step checkout with UPI, card, net banking and wallets." },
    ],
  }),
  component: Checkout,
});

const steps = ["Customer Details", "Delivery Address", "Delivery Method", "Payment", "Order Review"] as const;

function Checkout() {
  const [step, setStep] = useState(0);
  const [pay, setPay] = useState("UPI");
  const [ship, setShip] = useState("Standard");
  const { cart, clear } = useShop();
  const t = cartTotals(cart);
  const navigate = useNavigate();

  const next = () => {
    if (step === steps.length - 1) {
      clear();
      navigate({ to: "/order-confirmation" });
    } else setStep((s) => s + 1);
  };

  return (
    <div className="container-ww py-10">
      <h1 className="text-3xl sm:text-4xl">Checkout</h1>

      <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full text-[0.65rem] font-bold ${
                i < step
                  ? "bg-accent text-accent-foreground"
                  : i === step
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {i < step ? <Check size={12} /> : i + 1}
            </span>
            <span className={i === step ? "font-semibold" : "text-muted-foreground"}>{s}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="surface-card p-6">
          <h2 className="text-xl">{steps[step]}</h2>

          <div className="mt-6 space-y-4">
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value="Ananya Sharma" />
                <Field label="Email" value="ananya.sharma@example.com" />
                <Field label="Mobile" value="+91 98450 21178" />
                <Field label="GSTIN (optional)" value="" />
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Address line 1" value="42, Palm Grove Residency" full />
                <Field label="Address line 2" value="12th Main, Indiranagar" full />
                <Field label="City" value="Bengaluru" />
                <Field label="State" value="Karnataka" />
                <Field label="Pincode" value="560038" />
                <Field label="Landmark" value="Near Chinmaya Hospital" />
              </div>
            )}

            {step === 2 &&
              [
                { id: "Standard", label: "Standard delivery", note: "8–12 days · Free above ₹25,000" },
                { id: "Express", label: "Express delivery", note: "4–6 days · ₹2,499" },
                { id: "Scheduled", label: "Scheduled installation", note: "Pick a date · ₹999" },
              ].map((o) => (
                <Option key={o.id} selected={ship === o.id} onSelect={() => setShip(o.id)} label={o.label} note={o.note} />
              ))}

            {step === 3 && (
              <>
                {["UPI", "Credit/Debit Card", "Net Banking", "Wallets"].map((o) => (
                  <Option key={o} selected={pay === o} onSelect={() => setPay(o)} label={o} note="Mock gateway — demo only" />
                ))}
                <p className="rounded-md bg-secondary px-4 py-3 text-xs text-muted-foreground">
                  This prototype uses a placeholder payment gateway. No real payment details are
                  collected or processed.
                </p>
              </>
            )}

            {step === 4 && (
              <div className="space-y-4 text-sm">
                <Summary label="Ship to" value="Ananya Sharma, 42 Palm Grove Residency, Indiranagar, Bengaluru 560038" />
                <Summary label="Delivery" value={`${ship} delivery`} />
                <Summary label="Payment" value={`${pay} (mock)`} />
                <div className="border-t border-border pt-4">
                  {t.items.map(({ line, product }, i) => (
                    <div key={i} className="flex justify-between py-1.5 text-muted-foreground">
                      <span className="truncate pr-3">
                        {product.name} × {line.qty}
                      </span>
                      <span>{inr(product.price * line.qty)}</span>
                    </div>
                  ))}
                  {t.items.length === 0 && (
                    <p className="text-muted-foreground">
                      Cart is empty — <Link to="/shop" className="text-accent">add products</Link> to
                      complete the flow.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {step > 0 && (
              <button className="btn-outline" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            <button className="btn-primary" onClick={next}>
              {step === steps.length - 1 ? "Place Order" : "Continue"}
            </button>
          </div>
        </div>

        <aside className="surface-card h-fit p-6 text-sm">
          <h2 className="text-xl">Order Summary</h2>
          <dl className="mt-5 space-y-3">
            <Row label="Subtotal" value={inr(t.subtotal)} />
            <Row label="Discount" value={`− ${inr(t.discountAmt)}`} />
            <Row label="GST (18%)" value={inr(t.gst)} />
            <Row label="Delivery" value={t.delivery === 0 ? "Free" : inr(t.delivery)} />
            <div className="border-t border-border pt-3">
              <Row label="Grand Total" value={inr(t.total)} bold />
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        defaultValue={value}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}

function Option({
  selected,
  onSelect,
  label,
  note,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  note: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between gap-4 rounded-md border p-4 text-left transition-colors ${
        selected ? "border-accent bg-accent/5" : "border-border hover:border-accent"
      }`}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-muted-foreground">{note}</span>
      </span>
      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected ? "border-accent bg-accent" : "border-border"}`}>
        {selected && <Check size={12} className="text-accent-foreground" />}
      </span>
    </button>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <p className="mt-1">{value}</p>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-base font-semibold" : ""}`}>
      <dt className={bold ? "" : "text-muted-foreground"}>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
