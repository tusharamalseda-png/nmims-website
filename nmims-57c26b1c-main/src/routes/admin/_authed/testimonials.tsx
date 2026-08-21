import { createFileRoute } from "@tanstack/react-router";
import { Star, Trash2, Plus, Eye, EyeOff, Pencil, Check } from "lucide-react";
import { useState } from "react";
import { listPagesFn } from "@/backend/pages/actions";
import {
  listAllTestimonialsFn, createTestimonialFn, updateTestimonialFn,
  deleteTestimonialFn, toggleTestimonialVisibilityFn,
} from "@/backend/testimonials/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/_authed/testimonials")({
  loader: async () => {
    const [testimonials, pages] = await Promise.all([listAllTestimonialsFn(), listPagesFn()]);
    return { testimonials, pages };
  },
  component: TestimonialsAdmin,
});

type Testimonial = {
  id: string;
  name: string;
  designation: string | null;
  company: string | null;
  quote: string | null;
  rating: number | null;
  imageUrl: string | null;
  videoUrl: string | null;
  source: string | null;
  isVideo: boolean;
  isVisible: boolean;
  sortOrder: number;
  pageSlugs: string[];
};

function TestimonialsAdmin() {
  const { testimonials: initial, pages } = Route.useLoaderData();
  const [items, setItems] = useState<Testimonial[]>(initial);
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function refresh() {
    setItems(await listAllTestimonialsFn());
  }

  async function handleDelete(id: string) {
    await deleteTestimonialFn({ data: { id } });
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleToggle(id: string, isVisible: boolean) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, isVisible } : t)));
    await toggleTestimonialVisibilityFn({ data: { id, isVisible } });
  }

  const pending = items.filter((t) => t.source === "Website Submission" && !t.isVisible);
  const rest = items.filter((t) => !(t.source === "Website Submission" && !t.isVisible));

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
            <Star className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-extrabold text-foreground">Testimonials</h1>
            <p className="text-sm text-muted-foreground">Student stories shown on the homepage and program pages.</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setShowNew((v) => !v)}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add Testimonial
        </Button>
      </div>

      {pending.length > 0 && (
        <div className="mt-6 max-w-3xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-600">
            Pending Review ({pending.length})
          </p>
          <div className="space-y-3">
            {pending.map((t) => (
              <div key={t.id} className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.designation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(t.id, true)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200"
                      title="Approve and publish"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive transition hover:bg-destructive/20"
                      title="Reject and delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 max-w-3xl space-y-4">
        {showNew && (
          <TestimonialForm
            pages={pages}
            onSaved={() => {
              setShowNew(false);
              refresh();
            }}
          />
        )}

        {rest.length === 0 && !showNew && pending.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No testimonials yet.
          </p>
        )}

        {rest.map((t) =>
          editingId === t.id ? (
            <TestimonialForm
              key={t.id}
              pages={pages}
              initial={t}
              onSaved={() => {
                setEditingId(null);
                refresh();
              }}
            />
          ) : (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {t.imageUrl && <img src={t.imageUrl} alt={t.name} className="h-10 w-10 rounded-full object-cover" />}
                  <div>
                    <p className="font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.designation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(t.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary transition hover:opacity-80"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggle(t.id, !t.isVisible)}
                    className={`grid h-8 w-8 place-items-center rounded-lg transition ${t.isVisible ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-muted-foreground"}`}
                    title={t.isVisible ? "Visible — click to hide" : "Hidden — click to show"}
                  >
                    {t.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive transition hover:bg-destructive/20"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">"{t.quote}"</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Shows on: {t.pageSlugs.length === 0 ? "every page" : t.pageSlugs.join(", ")}
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function TestimonialForm({
  pages, initial, onSaved,
}: {
  pages: { slug: string; title: string }[];
  initial?: Testimonial;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [designation, setDesignation] = useState(initial?.designation ?? "");
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [pageSlugs, setPageSlugs] = useState<string[]>(initial?.pageSlugs ?? []);
  const [saving, setSaving] = useState(false);

  function togglePage(slug: string) {
    setPageSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  async function handleSave() {
    if (!name || !quote) return;
    setSaving(true);
    try {
      const payload = {
        name,
        designation: designation || null,
        company: null,
        quote,
        rating,
        imageUrl: imageUrl || null,
        videoUrl: null,
        source: null,
        isVideo: false,
        isVisible: true,
        sortOrder: 0,
        pageSlugs,
      };
      if (initial) {
        await updateTestimonialFn({ data: { id: initial.id, ...payload } });
      } else {
        await createTestimonialFn({ data: payload });
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-dashed border-border p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {initial ? "Edit Testimonial" : "Add Testimonial"}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <Input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Program / Designation" />
      </div>
      <Textarea rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Quote" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Photo URL" />
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} stars</option>
          ))}
        </select>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Show on (leave empty to show on every page)
        </p>
        <div className="flex flex-wrap gap-2">
          {pages.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => togglePage(p.slug)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                pageSlugs.includes(p.slug) ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>
      <Button size="sm" onClick={handleSave} disabled={saving || !name || !quote}>
        {saving ? "Saving..." : initial ? "Save Changes" : "Add Testimonial"}
      </Button>
    </div>
  );
}
