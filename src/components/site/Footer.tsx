import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/shop-data";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/60">
      <div className="container-ww grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl">
            Wood <span className="text-accent">&</span> Wonders
          </h3>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Handcrafted solid wood furniture from our Jodhpur and Bengaluru workshops, delivered
            across India.
          </p>
        </div>
        <div>
          <span className="eyebrow">Shop</span>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to="/shop" search={{ category: c.slug }} className="hover:text-accent">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="eyebrow">Company</span>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-accent">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/track-order" className="hover:text-accent">
                Track order
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-accent">
                Admin demo
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <span className="eyebrow">Newsletter</span>
          <p className="mt-3 text-sm text-muted-foreground">
            New collections, early access and interior notes.
          </p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="email"
              placeholder="Email address"
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button className="btn-primary px-4 py-2">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-ww flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Wood & Wonders. Demo prototype — mock payments only.</span>
          <span>GSTIN 29ABCDE1234F1Z5 · Made in India</span>
        </div>
      </div>
    </footer>
  );
}
