import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { categories, products, type Product } from "@/lib/shop-data";
import { ProductCard } from "@/components/site/ProductCard";

type Search = { category?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: typeof s["category"] === "string" ? (s["category"] as string) : undefined,
  }),

  head: () => ({
    meta: [
      { title: "Shop All Furniture — Wood & Wonders" },
      {
        name: "description",
        content:
          "Browse sofas, chairs, beds, tables, storage and TV units. Filter by material, colour, size and price.",
      },
      { property: "og:title", content: "Shop All Furniture — Wood & Wonders" },
      { property: "og:description", content: "Premium Indian furniture catalogue with filters and fast delivery." },
    ],
  }),
  component: Shop,
});

const materials = ["Velvet", "Boucle", "Leatherette", "Teak Wood", "Sheesham Wood", "Oak Wood", "Mango Wood", "Ash Wood", "Engineered Wood", "Cane & Wood", "Marine Ply"];
const colours = ["Beige", "Grey", "Brown"];
const sizes = ["2 Seater", "3 Seater", "L Shape", "6 Seater", "King", "Queen", "Standard", "Medium", "Tall", "1 Seater", "180 cm"];
const seatings = ["1 Seater", "2 Seater", "3 Seater", "6 Seater"];
const sorts = ["Popular", "Newest", "Price Low to High", "Price High to Low"] as const;

function Shop() {
  const { category } = Route.useSearch();
  const [cat, setCat] = useState<string | undefined>(category);
  const [maxPrice, setMaxPrice] = useState(250000);
  const [material, setMaterial] = useState<string[]>([]);
  const [colour, setColour] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);
  const [seating, setSeating] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<(typeof sorts)[number]>("Popular");
  const [drawer, setDrawer] = useState(false);

  const list = useMemo(() => {
    let out = products.filter(
      (p) =>
        (!cat || p.category === cat) &&
        p.price <= maxPrice &&
        (material.length === 0 || material.includes(p.material)) &&
        (colour.length === 0 || colour.includes(p.colour)) &&
        (size.length === 0 || size.includes(p.size)) &&
        (seating.length === 0 || seating.includes(p.seating)) &&
        (!inStockOnly || p.inStock),
    );
    const cmp: Record<string, (a: Product, b: Product) => number> = {
      Popular: (a, b) => b.reviews - a.reviews,
      Newest: (a, b) => Number(b.tags.includes("new")) - Number(a.tags.includes("new")),
      "Price Low to High": (a, b) => a.price - b.price,
      "Price High to Low": (a, b) => b.price - a.price,
    };
    out = [...out].sort(cmp[sort]!);
    return out;
  }, [cat, maxPrice, material, colour, size, seating, inStockOnly, sort]);

  const filters = (
    <div className="space-y-7 text-sm">
      <FilterGroup title="Category">
        <button
          onClick={() => setCat(undefined)}
          className={`block text-left ${!cat ? "font-semibold text-accent" : "text-muted-foreground"}`}
        >
          All furniture
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug)}
            className={`block text-left ${cat === c.slug ? "font-semibold text-accent" : "text-muted-foreground"}`}
          >
            {c.name}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        <input
          type="range"
          min={5000}
          max={250000}
          step={5000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
        <p className="text-xs text-muted-foreground">Up to ₹{maxPrice.toLocaleString("en-IN")}</p>
      </FilterGroup>

      <CheckGroup title="Material" options={materials} value={material} onChange={setMaterial} />
      <CheckGroup title="Colour" options={colours} value={colour} onChange={setColour} />
      <CheckGroup title="Size" options={sizes} value={size} onChange={setSize} />
      <CheckGroup title="Seating Capacity" options={seatings} value={seating} onChange={setSeating} />

      <FilterGroup title="Availability">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          In stock only
        </label>
      </FilterGroup>
    </div>
  );

  return (
    <div className="container-ww py-10">
      <nav className="text-xs text-muted-foreground">
        <Link to="/" className="hover:text-accent">
          Home
        </Link>{" "}
        / Shop
      </nav>
      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl sm:text-4xl">
            {cat ? categories.find((c) => c.slug === cat)?.name : "All Furniture"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{list.length} products</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button className="btn-outline py-2 lg:hidden" onClick={() => setDrawer(true)}>
            <SlidersHorizontal size={15} /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as (typeof sorts)[number])}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm"
          >
            {sorts.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">{filters}</aside>
        <div>
          {list.length === 0 ? (
            <p className="py-20 text-center text-sm text-muted-foreground">
              No products match these filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl">Filters</h2>
              <button onClick={() => setDrawer(false)} aria-label="Close filters">
                <X size={18} />
              </button>
            </div>
            {filters}
            <button className="btn-primary mt-8 w-full" onClick={() => setDrawer(false)}>
              Show {list.length} products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <FilterGroup title={title}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button
              key={o}
              onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                on
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-accent"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </FilterGroup>
  );
}
