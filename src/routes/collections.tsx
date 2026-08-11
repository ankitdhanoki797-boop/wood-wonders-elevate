import { createFileRoute, Link } from "@tanstack/react-router";
import { images, products } from "@/lib/shop-data";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Wood & Wonders" },
      { name: "description", content: "Seasonal and signature furniture collections: Heritage Teak, Urban Compact and Soft Modern." },
      { property: "og:title", content: "Collections — Wood & Wonders" },
      { property: "og:description", content: "Curated furniture collections from Wood & Wonders." },
    ],
  }),
  component: Collections,
});

const collections = [
  { name: "Heritage Teak", image: images.bed, text: "Hand-carved teak silhouettes inspired by Rajasthani havelis." },
  { name: "Urban Compact", image: images.tvunit, text: "Space-smart pieces designed for metro apartments." },
  { name: "Soft Modern", image: images.sofa, text: "Rounded forms in boucle and velvet, built for slow evenings." },
];

function Collections() {
  return (
    <div className="container-ww py-12">
      <span className="eyebrow">Curated</span>
      <h1 className="mt-3 text-3xl sm:text-4xl">Collections</h1>

      <div className="mt-10 space-y-6">
        {collections.map((c, i) => (
          <div
            key={c.name}
            className={`grid items-center gap-8 overflow-hidden rounded-xl border border-border bg-card lg:grid-cols-2 ${
              i % 2 === 1 ? "lg:[&>img]:order-2" : ""
            }`}
          >
            <img
              src={c.image}
              alt={c.name}
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full max-h-[360px] w-full object-cover"
            />
            <div className="p-8">
              <h2 className="text-2xl">{c.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{c.text}</p>
              <Link to="/shop" className="btn-primary mt-6">
                Shop the collection
              </Link>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-2xl">Pieces from our collections</h2>
      <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {products.slice(0, 8).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
