import { createFileRoute } from "@tanstack/react-router";
import { Navigation as NavIcon, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { listNavItemsFn, createNavItemFn, deleteNavItemFn } from "@/backend/navigation/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/_authed/navigation")({
  loader: async () => listNavItemsFn(),
  component: NavigationAdmin,
});

type NavItem = {
  id: string;
  label: string;
  url: string;
  parentId: string | null;
  location: "header" | "footer";
  sortOrder: number;
};

function NavigationAdmin() {
  const initial = Route.useLoaderData();
  const [items, setItems] = useState<NavItem[]>(initial as NavItem[]);

  async function refresh() {
    setItems((await listNavItemsFn()) as NavItem[]);
  }

  async function handleDelete(id: string) {
    await deleteNavItemFn({ data: { id } });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
          <NavIcon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-foreground">Navigation</h1>
          <p className="text-sm text-muted-foreground">
            Footer "Quick Links" column. The header menu and Programs dropdown are structural and stay in code.
          </p>
        </div>
      </div>

      <div className="mt-6 max-w-2xl space-y-3">
        {items.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No footer links yet.
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-card">
            <span className="font-mono text-xs text-muted-foreground">{item.sortOrder}</span>
            <span className="flex-1 text-sm font-semibold text-foreground">{item.label}</span>
            <span className="flex-1 truncate font-mono text-xs text-muted-foreground">{item.url}</span>
            <button
              onClick={() => handleDelete(item.id)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive transition hover:bg-destructive/20"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <NewNavItemRow nextOrder={items.length} onCreated={refresh} />
      </div>
    </div>
  );
}

function NewNavItemRow({ nextOrder, onCreated }: { nextOrder: number; onCreated: () => void }) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!label || !url) return;
    setSaving(true);
    try {
      await createNavItemFn({ data: { label, url, parentId: null, location: "footer", sortOrder: nextOrder } });
      setLabel("");
      setUrl("");
      onCreated();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-border p-3">
      <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" className="flex-1" />
      <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/url-path" className="flex-1" />
      <Button size="sm" onClick={handleCreate} disabled={saving || !label || !url}>
        <Plus className="mr-1 h-3.5 w-3.5" /> Add
      </Button>
    </div>
  );
}
