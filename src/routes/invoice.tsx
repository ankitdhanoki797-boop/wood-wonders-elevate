import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { byId, inr, sampleOrder } from "@/lib/shop-data";

export const Route = createFileRoute("/invoice")({
  head: () => ({
    meta: [
      { title: "Tax Invoice INV-2026-1025 — Wood & Wonders" },
      { name: "description", content: "GST tax invoice for Wood & Wonders order #WW1025 with billing and shipping details." },
      { property: "og:title", content: "Tax Invoice — Wood & Wonders" },
      { property: "og:description", content: "Sample GST invoice for a Wood & Wonders furniture order." },
    ],
  }),
  component: Invoice,
});

function Invoice() {
  const product = byId("modern-3-seater-premium-sofa")!;
  const taxable = product.price;
  const gst = Math.round(taxable * 0.18);
  const total = taxable + gst;

  return (
    <div className="container-ww py-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl">Invoice</h1>
          <button className="btn-primary" onClick={() => window.print()}>
            <Download size={15} /> Download Invoice PDF
          </button>
        </div>

        <div className="surface-card mt-6 p-8">
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border pb-6">
            <div>
              <h2 className="font-display text-2xl uppercase tracking-[0.14em]">Wood &amp; Wonders</h2>
              <p className="mt-2 text-xs text-muted-foreground">
                Plot 18, Boranada Industrial Area, Jodhpur, Rajasthan 342012
                <br />
                GSTIN 29ABCDE1234F1Z5 · support@woodandwonders.in
              </p>
            </div>
            <div className="text-xs">
              <Line label="Invoice Number" value={sampleOrder.invoice} />
              <Line label="Order Number" value={`#${sampleOrder.number}`} />
              <Line label="Invoice Date" value={sampleOrder.date} />
              <Line label="Place of Supply" value="Karnataka (29)" />
            </div>
          </div>

          <div className="grid gap-6 border-b border-border py-6 text-xs sm:grid-cols-3">
            <Block title="Customer">
              {sampleOrder.customer.name}
              <br />
              {sampleOrder.customer.phone}
              <br />
              {sampleOrder.customer.email}
            </Block>
            <Block title="Billing Address">{sampleOrder.customer.address}</Block>
            <Block title="Shipping Address">{sampleOrder.customer.address}</Block>
          </div>

          <div className="overflow-x-auto py-6">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Qty</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">GST 18%</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-4">
                    {product.name}
                    <span className="block text-xs text-muted-foreground">
                      HSN 9401 · Beige / Velvet / 3 Seater
                    </span>
                  </td>
                  <td className="py-4">1</td>
                  <td className="py-4">{inr(taxable)}</td>
                  <td className="py-4">{inr(gst)}</td>
                  <td className="py-4 text-right">{inr(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-end gap-2 border-t border-border pt-6 text-sm">
            <Total label="Taxable value" value={inr(taxable)} />
            <Total label="CGST 9%" value={inr(Math.round(gst / 2))} />
            <Total label="SGST 9%" value={inr(Math.round(gst / 2))} />
            <Total label="Delivery" value="Free" />
            <div className="mt-2 flex w-full max-w-xs items-center justify-between border-t border-border pt-3 text-base font-semibold">
              <span>Grand Total</span>
              <span>{inr(total)}</span>
            </div>
            <span className="mt-3 rounded-full bg-[var(--success)]/15 px-3 py-1 text-xs font-semibold text-[var(--success)]">
              Payment Status: PAID
            </span>
          </div>

          <p className="mt-8 text-center text-[0.65rem] text-muted-foreground">
            This is a computer-generated sample invoice for demonstration purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex gap-3">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold">{value}</span>
    </p>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
      <p className="mt-2 leading-relaxed">{children}</p>
    </div>
  );
}

function Total({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full max-w-xs items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
