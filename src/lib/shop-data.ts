import sofa from "@/assets/sofa.jpg";
import chair from "@/assets/chair.jpg";
import table from "@/assets/table.jpg";
import bed from "@/assets/bed.jpg";
import armchair from "@/assets/armchair.jpg";
import storage from "@/assets/storage.jpg";
import tvunit from "@/assets/tvunit.jpg";
import kitchen from "@/assets/kitchen.jpg";
import bedroom from "@/assets/room-bedroom.jpg";
import hero from "@/assets/hero.jpg";

export const images = {
  sofa,
  chair,
  table,
  bed,
  armchair,
  storage,
  tvunit,
  kitchen,
  bedroom,
  hero,
};

export type Product = {
  id: string;
  name: string;
  category: string;
  room: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  image: string;
  material: string;
  colour: string;
  size: string;
  seating: string;
  inStock: boolean;
  badge?: string;
  tags: ("new" | "bestseller" | "featured")[];
};

export const categories = [
  { slug: "sofas", name: "Sofas", image: sofa, count: 48 },
  { slug: "chairs", name: "Chairs", image: chair, count: 36 },
  { slug: "tables", name: "Tables", image: table, count: 42 },
  { slug: "beds", name: "Beds", image: bed, count: 29 },
  { slug: "armchairs", name: "Armchairs", image: armchair, count: 21 },
  { slug: "storage", name: "Storage", image: storage, count: 33 },
  { slug: "tv-units", name: "TV Units", image: tvunit, count: 18 },
  { slug: "modular-kitchen", name: "Modular Kitchen", image: kitchen, count: 12 },
];

export const rooms = [
  { name: "Living Room", image: hero, desc: "Sofas, coffee tables & media units" },
  { name: "Bedroom", image: bedroom, desc: "Beds, wardrobes & nightstands" },
  { name: "Dining Room", image: table, desc: "Dining sets, chairs & sideboards" },
  { name: "Home Office", image: chair, desc: "Desks, study chairs & shelving" },
];

const p = (
  id: string,
  name: string,
  category: string,
  room: string,
  price: number,
  mrp: number,
  rating: number,
  reviews: number,
  image: string,
  extra: Partial<Product> = {},
): Product => ({
  id,
  name,
  category,
  room,
  price,
  mrp,
  rating,
  reviews,
  image,
  material: "Sheesham Wood",
  colour: "Brown",
  size: "Standard",
  seating: "NA",
  inStock: true,
  tags: [],
  ...extra,
});

export const products: Product[] = [
  p("modern-3-seater-premium-sofa", "Modern 3 Seater Premium Sofa", "sofas", "Living Room", 54999, 79999, 4.7, 218, sofa, {
    material: "Velvet",
    colour: "Beige",
    size: "3 Seater",
    seating: "3 Seater",
    tags: ["featured", "bestseller"],
    badge: "Bestseller",
  }),
  p("jaipur-l-shape-fabric-sofa", "Jaipur L-Shape Fabric Sofa", "sofas", "Living Room", 74999, 99999, 4.6, 142, sofa, {
    material: "Boucle",
    colour: "Grey",
    size: "L Shape",
    seating: "6 Seater",
    tags: ["featured"],
  }),
  p("mysore-teak-2-seater-sofa", "Mysore Teak 2 Seater Sofa", "sofas", "Living Room", 38999, 52999, 4.4, 96, sofa, {
    material: "Teak Wood",
    colour: "Brown",
    size: "2 Seater",
    seating: "2 Seater",
    tags: ["new"],
  }),
  p("kanha-cane-dining-chair", "Kanha Cane Dining Chair", "chairs", "Dining Room", 7499, 10999, 4.5, 310, chair, {
    material: "Cane & Wood",
    colour: "Brown",
    size: "Standard",
    tags: ["bestseller", "featured"],
  }),
  p("udaipur-solid-wood-dining-table", "Udaipur 6 Seater Dining Table", "tables", "Dining Room", 45999, 62999, 4.8, 87, table, {
    material: "Sheesham Wood",
    colour: "Brown",
    size: "6 Seater",
    seating: "6 Seater",
    tags: ["featured", "bestseller"],
  }),
  p("nordic-coffee-table", "Nordic Oak Coffee Table", "tables", "Living Room", 16999, 23999, 4.3, 64, table, {
    material: "Oak Wood",
    colour: "Beige",
    size: "Medium",
    tags: ["new"],
  }),
  p("kashmir-king-platform-bed", "Kashmir King Platform Bed", "beds", "Bedroom", 64999, 89999, 4.7, 121, bed, {
    material: "Teak Wood",
    colour: "Brown",
    size: "King",
    tags: ["featured", "bestseller"],
  }),
  p("aria-queen-storage-bed", "Aria Queen Storage Bed", "beds", "Bedroom", 49999, 68999, 4.5, 78, bed, {
    material: "Engineered Wood",
    colour: "Grey",
    size: "Queen",
    tags: ["new"],
  }),
  p("goa-leather-accent-armchair", "Goa Leather Accent Armchair", "armchairs", "Living Room", 27999, 38999, 4.6, 155, armchair, {
    material: "Leatherette",
    colour: "Brown",
    size: "1 Seater",
    seating: "1 Seater",
    tags: ["featured", "bestseller"],
  }),
  p("lounge-wing-armchair", "Sereno Wing Armchair", "armchairs", "Home Office", 21999, 29999, 4.2, 41, armchair, {
    material: "Boucle",
    colour: "Beige",
    size: "1 Seater",
    seating: "1 Seater",
    inStock: false,
    tags: ["new"],
  }),
  p("fluted-tall-storage-cabinet", "Fluted Tall Storage Cabinet", "storage", "Bedroom", 34999, 46999, 4.4, 59, storage, {
    material: "Mango Wood",
    colour: "Brown",
    size: "Tall",
    tags: ["featured"],
  }),
  p("slatted-media-tv-unit", "Slatted Media TV Unit", "tv-units", "Living Room", 24999, 33999, 4.5, 73, tvunit, {
    material: "Oak Wood",
    colour: "Brown",
    size: "180 cm",
    tags: ["new", "bestseller"],
  }),
  p("veneer-modular-kitchen", "Veneer Modular Kitchen (L-Shape)", "modular-kitchen", "Home Office", 189999, 249999, 4.9, 26, kitchen, {
    material: "Marine Ply",
    colour: "Beige",
    size: "L Shape",
    tags: ["featured"],
  }),
  p("study-writing-desk", "Ashwood Writing Desk", "tables", "Home Office", 18999, 25999, 4.3, 48, table, {
    material: "Ash Wood",
    colour: "Brown",
    size: "Medium",
    tags: ["new"],
  }),
];

export const byId = (id: string) => products.find((x) => x.id === id);

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const discount = (p: Product) => Math.round(((p.mrp - p.price) / p.mrp) * 100);

export const reviewsData = [
  {
    name: "Ananya Sharma",
    city: "Bengaluru",
    rating: 5,
    text: "The teak finish is stunning in person. Delivery to Bengaluru took 8 days and the installation team was excellent.",
  },
  {
    name: "Rohit Menon",
    city: "Mumbai",
    rating: 5,
    text: "We furnished our entire living room with Wood & Wonders. Quality far above what we expected at this price.",
  },
  {
    name: "Priya Nair",
    city: "Kochi",
    rating: 4,
    text: "Beautiful boucle armchair, very comfortable. Would have loved more colour options for the fabric.",
  },
  {
    name: "Vikram Singh",
    city: "New Delhi",
    rating: 5,
    text: "Custom sized dining table crafted exactly to our drawings. Communication throughout was superb.",
  },
];

export const sampleOrder = {
  number: "WW1025",
  date: "11 Aug 2026",
  invoice: "INV-2026-1025",
  payment: "PAID · UPI (mock)",
  eta: "24 Aug 2026",
  customer: {
    name: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    phone: "+91 98450 21178",
    address: "42, Palm Grove Residency, 12th Main, Indiranagar, Bengaluru, Karnataka 560038",
  },
};
