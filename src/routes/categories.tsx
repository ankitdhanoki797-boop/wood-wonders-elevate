import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/lib/shop-data";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "All Furniture Categories — Wood & Wonders" },
      { name: "description", content: "Explore sofas, chairs, tables, beds, armchairs, storage, TV units and modular kitchens." },
      { property: "og:title", content: "All Furniture Categories — Wood & Wonders" },
      { property: "og:description", content: "Browse every Wood & Wonders furniture category." },
    ],
  }),
  component: Categories,
});

function Categories() {
  return (
    <div className="container-ww py-12">
      <span className="eyebrow">Browse</span>
      <h1 className="mt-3 text-3xl sm:text-4xl">Categories</h1>
      <p className="mt-2 max-w-lg text-sm text-muted-foreground">
        Every piece is made to order in solid wood and finished by hand.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="flex items-center justify-between gap-3 p-5">
              <div className="min-w-0">
                <h2 className="truncate text-lg">{c.name}</h2>
                <p className="text-xs text-muted-foreground">{c.count} products</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-accent">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
