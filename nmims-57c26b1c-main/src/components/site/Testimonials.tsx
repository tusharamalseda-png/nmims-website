import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionTitle } from "@/components/layout/SiteChrome";

type Testimonial = {
  id: string;
  name: string;
  designation: string | null;
  quote: string | null;
  rating: number | null;
  imageUrl: string | null;
};

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Student stories" title="Real outcomes from real learners" />
        <div className="mt-12 relative">
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={false}
              animate={{ opacity: idx === i ? 1 : 0, x: idx === i ? 0 : 30, position: idx === i ? "relative" : "absolute" }}
              transition={{ duration: 0.5 }}
              className="inset-0 grid items-center gap-8 rounded-3xl bg-card p-6 shadow-elegant sm:p-10 lg:grid-cols-[auto_1fr] lg:gap-12"
              style={{ display: idx === i ? "grid" : "none" }}
            >
              {it.imageUrl && (
                <img
                  src={it.imageUrl}
                  alt={it.name}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="mx-auto h-28 w-28 rounded-full object-cover shadow-card ring-4 ring-[color:var(--gold)]/40 sm:h-36 sm:w-36 lg:mx-0"
                />
              )}
              <div>
                <div className="flex gap-1 text-[color:var(--gold)]">
                  {Array.from({ length: it.rating ?? 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-3 text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                  "{it.quote}"
                </blockquote>
                <p className="mt-4 font-extrabold text-foreground">{it.name}</p>
                {it.designation && <p className="text-sm text-muted-foreground">{it.designation}</p>}
              </div>
            </motion.div>
          ))}
          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all ${idx === i ? "w-8 gradient-primary" : "w-2 bg-border"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
