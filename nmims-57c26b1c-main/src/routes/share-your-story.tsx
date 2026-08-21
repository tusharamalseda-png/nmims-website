import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { Header, Footer, FloatingWA, MobileCTABar } from "@/components/layout/SiteChrome";
import { submitTestimonialFn } from "@/backend/testimonials/actions";

export const Route = createFileRoute("/share-your-story")({
  head: () => ({
    meta: [
      { title: "Share Your Story | NMIMS Online" },
      { name: "description", content: "Tell other students about your experience with NMIMS CDOE admissions." },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: ShareStoryPage,
});

function ShareStoryPage() {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !quote) return;
    setSubmitting(true);
    try {
      await submitTestimonialFn({ data: { name, designation, quote, rating } });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-extrabold">Share Your Story</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell other students about your experience. We review every submission before it goes live.
        </p>

        {submitted ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center shadow-card">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            <p className="font-bold text-foreground">Thank you!</p>
            <p className="text-sm text-muted-foreground">Your story has been submitted for review.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Your Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Program (e.g. Online MBA - Finance)</label>
              <input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button key={r} type="button" onClick={() => setRating(r)} aria-label={`${r} stars`}>
                    <Star className={`h-6 w-6 ${r <= rating ? "fill-[color:var(--gold)] text-[color:var(--gold)]" : "text-muted"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Your Story</label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                required
                rows={5}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !name || !quote}
              className="w-full rounded-full gradient-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Story"}
            </button>
          </form>
        )}
      </main>
      <Footer />
      <FloatingWA message="Hi, I'd like to know about admissions." />
      <MobileCTABar message="Hi, I'd like to know about admissions." />
    </div>
  );
}
