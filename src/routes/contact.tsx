import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Wood & Wonders — Furniture Support" },
      { name: "description", content: "Talk to our furniture consultants about custom sizing, delivery timelines and bulk orders." },
      { property: "og:title", content: "Contact Wood & Wonders" },
      { property: "og:description", content: "Reach our design and delivery teams across India." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="container-ww py-12">
      <span className="eyebrow">We'd love to help</span>
      <h1 className="mt-3 text-3xl sm:text-4xl">Contact us</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form className="surface-card grid gap-4 p-6 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <F label="Name" placeholder="Your name" />
          <F label="Email" placeholder="you@example.com" />
          <F label="Mobile" placeholder="+91 " />
          <F label="City" placeholder="Bengaluru" />
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</span>
            <textarea
              rows={5}
              placeholder="Tell us about the piece you're looking for…"
              className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>
          <div className="sm:col-span-2">
            <button className="btn-primary">Send message</button>
          </div>
        </form>

        <aside className="surface-card h-fit space-y-5 p-6 text-sm">
          <Info icon={Phone} title="Call us" text="+91 91166 40040 · Mon–Sat, 10am–7pm" />
          <Info icon={Mail} title="Email" text="care@woodandwonders.in" />
          <Info icon={MapPin} title="Experience centre" text="Plot 18, Boranada Industrial Area, Jodhpur, Rajasthan 342012" />
        </aside>
      </div>
    </div>
  );
}

function F({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
      />
    </label>
  );
}

function Info({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-accent" />
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
