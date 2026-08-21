import { createFileRoute } from "@tanstack/react-router";
import { Award, Trash2, Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { listPagesFn } from "@/backend/pages/actions";
import { listAllLogosFn, createLogoFn, updateLogoFn, deleteLogoFn } from "@/backend/logos/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/_authed/logos")({
  loader: async () => {
    const [logos, pages] = await Promise.all([listAllLogosFn(), listPagesFn()]);
    return { logos, pages };
  },
  component: LogosAdmin,
});

type Logo = {
  id: string;
  name: string;
  logoUrl: string;
  category: string | null;
  pageSlugs: string[];
  sortOrder: number;
};

function LogosAdmin() {
  const { logos: initial, pages } = Route.useLoaderData();
  const [items, setItems] = useState<Logo[]>(initial as Logo[]);
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function refresh() {
    setItems((await listAllLogosFn()) as Logo[]);
  }

  async function handleDelete(id: string) {
    await deleteLogoFn({ data: { id } });
    setItems((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
            <Award className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-extrabold text-foreground">Logos & Badges</h1>
            <p className="text-sm text-muted-foreground">Partner bank logos and accreditation badges.</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setShowNew((v) => !v)}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add Logo
        </Button>
      </div>

      <div className="mt-6 max-w-3xl space-y-3">
        {showNew && (
          <LogoForm pages={pages} onSaved={() => { setShowNew(false); refresh(); }} />
        )}

        {items.length === 0 && !showNew && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No logos yet. Upload the image to Media first, then add it here.
          </p>
        )}

        {items.map((l) =>
          editingId === l.id ? (
            <LogoForm key={l.id} pages={pages} initial={l} onSaved={() => { setEditingId(null); refresh(); }} />
          ) : (
            <div key={l.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-card">
              <img src={l.logoUrl} alt={l.name} className="h-10 w-16 shrink-0 object-contain" />
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{l.name}</p>
                <p className="text-xs capitalize text-muted-foreground">
                  {l.category} · shows on {l.pageSlugs.length === 0 ? "every page" : l.pageSlugs.join(", ")}
                </p>
              </div>
              <button
                onClick={() => setEditingId(l.id)}
                className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary transition hover:opacity-80"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleDelete(l.id)}
                className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive transition hover:bg-destructive/20"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function LogoForm({
  pages, initial, onSaved,
}: {
  pages: { slug: string; title: string }[];
  initial?: Logo;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl ?? "");
  const [category, setCategory] = useState<"bank" | "accreditation">((initial?.category as "bank" | "accreditation") ?? "bank");
  const [pageSlugs, setPageSlugs] = useState<string[]>(initial?.pageSlugs ?? []);
  const [saving, setSaving] = useState(false);

  function togglePage(slug: string) {
    setPageSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  async function handleSave() {
    if (!name || !logoUrl) return;
    setSaving(true);
    try {
      const payload = { name, logoUrl, category, pageSlugs, sortOrder: initial?.sortOrder ?? 0 };
      if (initial) {
        await updateLogoFn({ data: { id: initial.id, ...payload } });
      } else {
        await createLogoFn({ data: payload });
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-dashed border-border p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{initial ? "Edit Logo" : "Add Logo"}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (e.g. HDFC Bank)" />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as "bank" | "accreditation")}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
        >
          <option value="bank">Bank (EMI partner)</option>
          <option value="accreditation">Accreditation</option>
        </select>
      </div>
      <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Logo image URL (upload to Media first)" />
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
      <Button size="sm" onClick={handleSave} disabled={saving || !name || !logoUrl}>
        {saving ? "Saving..." : initial ? "Save Changes" : "Add Logo"}
      </Button>
    </div>
  );
}
