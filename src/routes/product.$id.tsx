import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { byId, discount, inr, products, reviewsData } from "@/lib/shop-data";
import { useShop } from "@/lib/store";
import { Stars } from "@/components/site/Stars";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = byId(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product unavailable — Wood & Wonders" }, { name: "robots", content: "noindex" }] };
    }
    const t = `${loaderData.product.name} — Wood & Wonders`;
    return {
      meta: [
        { title: t },
        { name: "description", content: `${loaderData.product.name} at ${inr(loaderData.product.price)}. Handcrafted, delivered pan-India with free installation.` },
        { property: "og:title", content: t },
        { property: "og:description", content: "Handcrafted premium furniture with pan-India delivery." },
      ],
    };
  },
  component: ProductPage,
});

const tabs = ["Description", "Specifications", "Dimensions", "Materials", "Delivery", "Warranty", "Returns", "Reviews"] as const;

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add, toggleWish, wishlist } = useShop();
  const navigate = useNavigate();

  const [colour, setColour] = useState("Beige");
  const [fabric, setFabric] = useState("Velvet");
  const [size, setSize] = useState("3 Seater");
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const [tab, setTab] = useState<(typeof tabs)[number]>("Description");
  const [active, setActive] = useState(0);

  const gallery = [product.image, ...products.filter((p) => p.id !== product.id).slice(0, 3).map((p) => p.image)];
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);
  const fbt = products.filter((p) => p.id !== product.id).slice(0, 2);
  const fbtTotal = fbt.reduce((s, p) => s + p.price, product.price);

  const line = { id: product.id, qty, colour, fabric, size };

  return (
    <div className="container-ww py-8">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-accent">Home</Link> /{" "}
        <Link to="/shop" search={{ category: product.category }} className="hover:text-accent">
          {product.category}
        </Link>{" "}
        / {product.name}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-xl bg-secondary">
            <img
              src={gallery[active]}
              alt={product.name}
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`overflow-hidden rounded-md border-2 ${i === active ? "border-accent" : "border-transparent"}`}
              >
                <img src={g} alt="" loading="lazy" width={200} height={200} className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Buy box */}
        <div>
          <h1 className="text-3xl sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Stars rating={product.rating} />
            <span>{product.rating} · {product.reviews} reviews</span>
            <span className={product.inStock ? "text-[var(--success)]" : "text-destructive"}>
              {product.inStock ? "In stock" : "Made to order · 6 weeks"}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold">{inr(product.price)}</span>
            <span className="text-base text-muted-foreground line-through">{inr(product.mrp)}</span>
            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
              {discount(product)}% off
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>
          <p className="mt-3 rounded-md bg-secondary px-4 py-3 text-sm">
            No-cost EMI from <strong>{inr(Math.round(product.price / 12))}/month</strong> for 12
            months · Placeholder payment provider
          </p>

          <Variation label="Colour" options={["Beige", "Grey", "Brown"]} value={colour} onChange={setColour} />
          <Variation label="Fabric" options={["Velvet", "Boucle", "Leatherette"]} value={fabric} onChange={setFabric} />
          <Variation label="Size" options={["3 Seater", "4 Seater", "L Shape"]} value={size} onChange={setSize} />

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-md border border-border">
              <button className="px-3 py-2.5" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button className="px-3 py-2.5" onClick={() => setQty((q) => q + 1)} aria-label="Increase">
                <Plus size={14} />
              </button>
            </div>
            <button
              className="btn-outline"
              onClick={() => toggleWish(product.id)}
            >
              <Heart size={15} className={wishlist.includes(product.id) ? "fill-accent text-accent" : ""} />
              Wishlist
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button className="btn-outline" onClick={() => add(line)}>
              Add to Cart
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                add(line);
                navigate({ to: "/cart" });
              }}
            >
              Buy Now
            </button>
          </div>

          {/* Pincode */}
          <div className="mt-6 rounded-lg border border-border p-4">
            <p className="text-sm font-semibold">Delivery availability</p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setPinMsg(
                  pincode.length === 6
                    ? `Delivering to ${pincode} · Estimated 8–12 days · Free installation`
                    : "Please enter a valid 6-digit pincode",
                );
              }}
            >
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter pincode"
                className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <button className="btn-primary px-4 py-2">Check</button>
            </form>
            {pinMsg && <p className="mt-2 text-xs text-muted-foreground">{pinMsg}</p>}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
            <Trust icon={Truck} label="Free delivery" />
            <Trust icon={ShieldCheck} label="3-yr warranty" />
            <Trust icon={RotateCcw} label="7-day returns" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <section className="mt-16">
        <div className="flex gap-6 overflow-x-auto border-b border-border text-sm">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap border-b-2 pb-3 ${
                tab === t ? "border-accent text-accent" : "border-transparent text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="max-w-3xl py-6 text-sm text-muted-foreground">
          <TabBody tab={tab} name={product.name} material={product.material} />
        </div>
      </section>

      {/* FBT */}
      <section className="mt-16">
        <h2 className="text-2xl">Frequently Bought Together</h2>
        <div className="mt-5 surface-card flex flex-col gap-6 p-6 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-4">
            {[product, ...fbt].map((p, i) => (
              <div key={p.id} className="flex items-center gap-4">
                {i > 0 && <span className="text-lg text-muted-foreground">+</span>}
                <img src={p.image} alt={p.name} loading="lazy" width={96} height={96} className="h-24 w-24 rounded-md object-cover" />
              </div>
            ))}
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {[product, ...fbt].map((p) => p.name).join(" + ")}
            </p>
            <p className="mt-2 text-lg font-semibold">Bundle price {inr(Math.round(fbtTotal * 0.95))}</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => [product, ...fbt].forEach((p) => add({ id: p.id, qty: 1, colour, fabric, size }))}
          >
            Add all 3 to cart
          </button>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl">You May Also Like</h2>
        <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Trust({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="rounded-md border border-border py-3">
      <Icon size={16} className="mx-auto text-accent" />
      <p className="mt-1.5">{label}</p>
    </div>
  );
}

function Variation({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-widest">
        {label}: <span className="text-muted-foreground">{value}</span>
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-md border px-4 py-2 text-sm transition-colors ${
              value === o ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function TabBody({ tab, name, material }: { tab: string; name: string; material: string }) {
  if (tab === "Reviews")
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {reviewsData.map((r) => (
          <div key={r.name} className="surface-card p-5">
            <Stars rating={r.rating} />
            <p className="mt-3">"{r.text}"</p>
            <p className="mt-3 text-xs font-semibold text-foreground">
              {r.name} · {r.city}
            </p>
          </div>
        ))}
      </div>
    );

  const copy: Record<string, string> = {
    Description: `${name} is hand-finished by our karigars using kiln-dried solid wood and high-resilience foam. The silhouette is designed for Indian living rooms — compact footprint, deep seat and a fabric that stays cool through summer.`,
    Specifications: "Frame: Solid wood · Foam: 32-density HR · Legs: Natural stained wood · Assembly: Minimal, done at delivery · SKU: WW-SF-3001",
    Dimensions: "Overall: 213 cm W × 88 cm D × 82 cm H · Seat height 45 cm · Seat depth 58 cm · Weight 62 kg",
    Materials: `Primary material: ${material}. Upholstery is OEKO-TEX certified and finished with a water-repellent coating.`,
    Delivery: "Dispatched within 5 working days. Delivery in 8–12 days across metros, 12–18 days elsewhere. Free white-glove installation.",
    Warranty: "3 years on frame and structure, 1 year on upholstery and mechanisms. Warranty is non-transferable.",
    Returns: "7-day easy returns on unused products in original packaging. Custom-made items are non-returnable.",
  };
  return <p>{copy[tab]}</p>;
}
