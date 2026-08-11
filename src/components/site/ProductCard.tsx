import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { discount, inr, type Product } from "@/lib/shop-data";
import { useShop } from "@/lib/store";
import { Stars } from "./Stars";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWish, wishlist, add } = useShop();
  const wished = wishlist.includes(product.id);

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-lg bg-secondary">
        <Link to="/product/$id" params={{ id: product.id }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-primary-foreground">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => toggleWish(product.id)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground transition-colors hover:bg-card"
        >
          <Heart size={16} className={wished ? "fill-accent text-accent" : ""} />
        </button>
        <button
          type="button"
          onClick={() =>
            add({
              id: product.id,
              qty: 1,
              colour: product.colour,
              fabric: product.material,
              size: product.size,
            })
          }
          className="btn-primary absolute inset-x-3 bottom-3 translate-y-2 py-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Plus size={15} /> Quick Add
        </button>
      </div>

      <div className="mt-3 flex min-w-0 flex-col gap-1">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="truncate text-sm font-semibold hover:text-accent"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Stars rating={product.rating} size={12} />
          <span>
            {product.rating} ({product.reviews})
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-baseline gap-2">
          <span className="text-base font-semibold">{inr(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{inr(product.mrp)}</span>
          <span className="text-xs font-semibold text-accent">{discount(product)}% off</span>
        </div>
      </div>
    </article>
  );
}
