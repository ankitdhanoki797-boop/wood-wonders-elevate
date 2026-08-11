import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { byId, type Product } from "./shop-data";

export type CartLine = {
  id: string;
  qty: number;
  colour: string;
  fabric: string;
  size: string;
};

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  loggedIn: boolean;
  add: (line: CartLine) => void;
  remove: (index: number) => void;
  setQty: (index: number, qty: number) => void;
  clear: () => void;
  toggleWish: (id: string) => void;
  login: () => void;
  logout: () => void;
};

const Ctx = createContext<ShopState | null>(null);

const KEY = "ww-shop-v1";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setCart(parsed.cart ?? []);
        setWishlist(parsed.wishlist ?? []);
        setLoggedIn(!!parsed.loggedIn);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ cart, wishlist, loggedIn }));
    } catch {
      /* ignore */
    }
  }, [cart, wishlist, loggedIn]);

  const value = useMemo<ShopState>(
    () => ({
      cart,
      wishlist,
      loggedIn,
      add: (line) =>
        setCart((c) => {
          const i = c.findIndex(
            (l) =>
              l.id === line.id &&
              l.colour === line.colour &&
              l.fabric === line.fabric &&
              l.size === line.size,
          );
          if (i >= 0) {
            const next = [...c];
            next[i] = { ...next[i], qty: next[i].qty + line.qty };
            return next;
          }
          return [...c, line];
        }),
      remove: (index) => setCart((c) => c.filter((_, i) => i !== index)),
      setQty: (index, qty) =>
        setCart((c) => c.map((l, i) => (i === index ? { ...l, qty: Math.max(1, qty) } : l))),
      clear: () => setCart([]),
      toggleWish: (id) =>
        setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
      login: () => setLoggedIn(true),
      logout: () => setLoggedIn(false),
    }),
    [cart, wishlist, loggedIn],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}

export function cartTotals(cart: CartLine[]) {
  const items = cart
    .map((l) => ({ line: l, product: byId(l.id) as Product }))
    .filter((x) => x.product);
  const subtotal = items.reduce((s, x) => s + x.product.price * x.line.qty, 0);
  const mrpTotal = items.reduce((s, x) => s + x.product.mrp * x.line.qty, 0);
  const discountAmt = mrpTotal - subtotal;
  const gst = Math.round(subtotal * 0.18);
  const delivery = subtotal > 25000 || subtotal === 0 ? 0 : 1499;
  const total = subtotal + gst + delivery;
  return { items, subtotal, mrpTotal, discountAmt, gst, delivery, total };
}
