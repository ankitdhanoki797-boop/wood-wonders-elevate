import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X, Home, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { useShop } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { categories } from "@/lib/shop-data";

const mainNav = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function Header() {
  const { cart, wishlist } = useShop();
  const { session, profile, isAdmin, isJrAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  const count = cart.reduce((s, l) => s + l.qty, 0);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();


  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="hidden bg-primary py-2 text-center text-xs text-primary-foreground md:block">
        Free Pan-India delivery on orders above ₹25,000 · Made-to-order craftsmanship
      </div>

      <div className="container-ww grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-4">
        <button
          type="button"
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Menu size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-display text-sm text-primary-foreground">
            W
          </span>
          <span className="truncate font-display text-xl leading-none">
            Wood <span className="text-accent">&</span> Wonders
          </span>
        </Link>

        <nav className="hidden justify-center gap-7 text-sm lg:col-start-2 lg:flex">
          {mainNav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`transition-colors hover:text-accent ${
                pathname === n.to ? "text-accent" : "text-foreground"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <button type="button" aria-label="Search" onClick={() => setSearch((s) => !s)}>
            <Search size={19} />
          </button>
          <Link to="/account" aria-label="Wishlist" className="relative hidden sm:block">
            <Heart size={19} />
            {wishlist.length > 0 && <Dot n={wishlist.length} />}
          </Link>
          <Link to="/login" aria-label="Account">
            <User size={19} />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative">
            <ShoppingBag size={19} />
            {count > 0 && <Dot n={count} />}
          </Link>
        </div>
      </div>

      {search && (
        <div className="border-t border-border bg-card">
          <div className="container-ww py-3">
            <input
              autoFocus
              placeholder="Search sofas, beds, dining tables…"
              className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
        </div>
      )}

      <div className="hidden border-t border-border lg:block">
        <div className="container-ww flex items-center justify-center gap-6 overflow-x-auto py-2.5 text-xs uppercase tracking-widest text-muted-foreground">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/shop"
              search={{ category: c.slug }}
              className="whitespace-nowrap transition-colors hover:text-accent"
            >
              {c.name}
            </Link>
          ))}
          <Link to="/shop" className="whitespace-nowrap transition-colors hover:text-accent">
            Accessories
          </Link>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card lg:hidden">
          <div className="container-ww flex items-center justify-between py-3">
            <span className="eyebrow">Menu</span>
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <nav className="container-ww grid gap-1 pb-4">
            {mainNav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-3">
              <span className="eyebrow">Shop by category</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    to="/shop"
                    search={{ category: c.slug }}
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Dot({ n }: { n: number }) {
  return (
    <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[0.6rem] font-bold text-accent-foreground">
      {n}
    </span>
  );
}

export function MobileTabBar() {
  const { cart } = useShop();
  const count = cart.reduce((s, l) => s + l.qty, 0);
  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/shop", label: "Shop", icon: LayoutGrid },
    { to: "/cart", label: "Cart", icon: ShoppingBag },
    { to: "/account", label: "Account", icon: User },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur sm:hidden">
      <div className="grid grid-cols-4">
        {items.map((i) => (
          <Link
            key={i.to}
            to={i.to}
            className="relative flex flex-col items-center gap-1 py-2.5 text-[0.65rem] text-muted-foreground"
            activeProps={{ className: "text-accent" }}
            activeOptions={{ exact: i.to === "/" }}
          >
            <i.icon size={18} />
            {i.label}
            {i.to === "/cart" && count > 0 && (
              <span className="absolute right-1/4 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[0.6rem] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
