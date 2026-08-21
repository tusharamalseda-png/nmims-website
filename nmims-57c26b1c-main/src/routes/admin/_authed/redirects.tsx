import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightLeft, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { listRedirectsFn, createRedirectFn, deleteRedirectFn } from "@/backend/redirects/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/_authed/redirects")({
  loader: async () => listRedirectsFn(),
  component: RedirectsAdmin,
});

type Redirect = {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: "301" | "302";
  createdAt: Date;
};

function RedirectsAdmin() {
  const initial = Route.useLoaderData();
  const [items, setItems] = useState<Redirect[]>(initial as Redirect[]);
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
  const [statusCode, setStatusCode] = useState<"301" | "302">("301");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!fromPath || !toPath) return;
    setSaving(true);
    setError(null);
    try {
      const row = await createRedirectFn({ data: { fromPath, toPath, statusCode } });
      setItems((prev) => [row as Redirect, ...prev]);
      setFromPath("");
      setToPath("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create redirect.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteRedirectFn({ data: { id } });
    setItems((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
          <ArrowRightLeft className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-foreground">Redirects</h1>
          <p className="text-sm text-muted-foreground">Send an old URL to a new one. Takes effect within a minute of saving.</p>
        </div>
      </div>

      <div className="mt-6 max-w-3xl space-y-3">
        <div className="flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-border p-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">From (old path)</label>
            <Input value={fromPath} onChange={(e) => setFromPath(e.target.value)} placeholder="/old-page" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">To (new path or URL)</label>
            <Input value={toPath} onChange={(e) => setToPath(e.target.value)} placeholder="/new-page" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Type</label>
            <select
              value={statusCode}
              onChange={(e) => setStatusCode(e.target.value as "301" | "302")}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
            >
              <option value="301">301 (permanent)</option>
              <option value="302">302 (temporary)</option>
            </select>
          </div>
          <Button size="sm" onClick={handleCreate} disabled={saving || !fromPath || !toPath}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add
          </Button>
        </div>
        {error && <p className="text-xs font-medium text-destructive">{error}</p>}

        {items.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No redirects yet.
          </p>
        )}
        {items.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-card">
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-muted-foreground">{r.statusCode}</span>
            <span className="flex-1 truncate font-mono text-xs text-foreground">{r.fromPath}</span>
            <ArrowRightLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate font-mono text-xs text-foreground">{r.toPath}</span>
            <button
              onClick={() => handleDelete(r.id)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive transition hover:bg-destructive/20"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
