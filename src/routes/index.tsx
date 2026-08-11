import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, Hammer, ShieldCheck, Sparkles } from "lucide-react";
import { categories, products, reviewsData, rooms, images } from "@/lib/shop-data";
import { ProductCard } from "@/components/site/ProductCard";
import { Stars } from "@/components/site/Stars";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wood & Wonders — Furniture Crafted for Beautiful Living" },
      {
        name: "description",
        content:
          "Shop premium handcrafted Indian furniture: sofas, beds, dining tables, storage and modular kitchens. Pan-India delivery.",
      },
      { property: "og:title", content: "Wood & Wonders — Furniture Crafted for Beautiful Living" },
      {
        property: "og:description",
        content: "Timeless solid wood furniture designed and delivered across India.",
      },
    ],
  }),
  component: Index,
});

const benefits = [
  { icon: Sparkles, title: "Premium Materials", text: "FSC-certified teak, sheesham and mango wood, kiln-dried for Indian climates." },
  { icon: Truck, title: "Pan-India Delivery", text: "White-glove delivery and free installation across 19,000+ pincodes." },
  { icon: Hammer, title: "Custom Furniture", text: "Made-to-order sizing, finishes and fabrics from our in-house karigars." },
  { icon: ShieldCheck, title: "Secure Payments", text: "UPI, cards, net banking and no-cost EMI with 3-year structural warranty." },
];

function Index() {
  const featured = products.filter((p) => p.tags.includes("featured")).slice(0, 8);
  const newArrivals = products.filter((p) => p.tags.includes("new"));
  const best = products.filter((p) => p.tags.includes("bestseller"));

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
          <img
            src={images.hero}
            alt="Warm minimal living room with a teak wood sofa"
            width={1920}
            height={1200}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="container-ww absolute inset-0 flex items-center">
            <div className="max-w-xl">
              <span className="eyebrow">Est. 2011 · Jodhpur & Bengaluru</span>
              <h1 className="mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                Furniture Crafted for Beautiful Living
              </h1>
              <p className="mt-5 max-w-md text-base text-muted-foreground">
                Discover timeless furniture designed to bring warmth, comfort and character to
                every room.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/shop" className="btn-primary">
                  Shop Collection <ArrowRight size={16} />
                </Link>
                <Link to="/categories" className="btn-outline">
                  Explore Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <Section
        eyebrow="Browse"
        title="Shop by Category"
        action={{ to: "/categories", label: "All categories" }}
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/shop"
              search={{ category: c.slug }}
              className="group overflow-hidden rounded-lg border border-border bg-card"
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                width={1024}
                height={1024}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="flex items-center justify-between gap-2 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.count} products</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-accent">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Featured */}
      <Section eyebrow="Curated" title="Featured Collection" action={{ to: "/shop", label: "View all" }}>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Rooms */}
      <Section eyebrow="Spaces" title="Shop by Room">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((r) => (
            <Link
              key={r.name}
              to="/shop"
              className="group relative overflow-hidden rounded-lg"
            >
              <img
                src={r.image}
                alt={r.name}
                loading="lazy"
                width={1200}
                height={900}
                className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-background">
                <h3 className="text-xl text-background">{r.name}</h3>
                <p className="mt-1 text-xs opacity-80">{r.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* New arrivals carousel */}
      <Section eyebrow="Just In" title="New Arrivals">
        <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4">
          {newArrivals.map((p) => (
            <div key={p.id} className="w-[70%] shrink-0 snap-start sm:w-[45%] lg:w-[24%]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </Section>

      {/* Best sellers */}
      <Section eyebrow="Loved by India" title="Best Sellers" action={{ to: "/shop", label: "View all" }}>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {best.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Why */}
      <section className="mt-24 bg-secondary/60 py-20">
        <div className="container-ww">
          <span className="eyebrow">Why Wood &amp; Wonders</span>
          <h2 className="mt-3 max-w-lg text-3xl sm:text-4xl">
            Craftsmanship you can feel, service you can trust
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="surface-card p-6">
                <b.icon size={22} className="text-accent" />
                <h3 className="mt-4 text-lg">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <Section eyebrow="Testimonials" title="Customer Reviews">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reviewsData.map((r) => (
            <figure key={r.name} className="surface-card flex h-full flex-col p-6">
              <Stars rating={r.rating} />
              <blockquote className="mt-4 flex-1 text-sm text-muted-foreground">
                "{r.text}"
              </blockquote>
              <figcaption className="mt-5 text-sm font-semibold">
                {r.name}
                <span className="block text-xs font-normal text-muted-foreground">{r.city}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="container-ww mt-24">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={images.bedroom}
            alt="Warm bedroom styled with Wood & Wonders furniture"
            loading="lazy"
            width={1200}
            height={900}
            className="h-[340px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h2 className="max-w-xl text-3xl text-background sm:text-4xl">
              Create a Home You'll Love
            </h2>
            <Link to="/shop" className="btn-primary mt-6">
              Shop Furniture
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  action?: { to: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="container-ww mt-24">
      <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="mt-2 text-3xl sm:text-4xl">{title}</h2>
        </div>
        {action && (
          <Link
            to={action.to as "/shop"}
            className="shrink-0 text-sm font-semibold text-accent hover:underline"
          >
            {action.label} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
