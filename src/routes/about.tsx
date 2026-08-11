import { createFileRoute } from "@tanstack/react-router";
import { images } from "@/lib/shop-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Wood & Wonders Furniture" },
      { name: "description", content: "Wood & Wonders crafts solid wood furniture in Jodhpur and Bengaluru for homes across India." },
      { property: "og:title", content: "Our Story — Wood & Wonders" },
      { property: "og:description", content: "Fifteen years of Indian craftsmanship in solid wood furniture." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="container-ww py-12">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Since 2011</span>
          <h1 className="mt-3 text-3xl sm:text-4xl">Furniture made by hand, made to last</h1>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Wood &amp; Wonders began in a small Jodhpur workshop with four karigars and a belief
            that good furniture should outlive the trend that inspired it. Today our teams in
            Jodhpur and Bengaluru craft solid teak, sheesham and mango wood pieces for homes in
            over 400 Indian cities.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Every piece is kiln-dried for Indian humidity, joined with traditional mortise-and-tenon
            joinery, and finished with low-VOC natural oils.
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-6">
            {[
              ["15+", "Years crafting"],
              ["120", "In-house karigars"],
              ["48k", "Homes furnished"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-3xl">{v}</dt>
                <dd className="text-xs text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <img
          src={images.hero}
          alt="Wood & Wonders workshop styled living room"
          loading="lazy"
          width={1920}
          height={1200}
          className="rounded-xl object-cover"
        />
      </div>
    </div>
  );
}
