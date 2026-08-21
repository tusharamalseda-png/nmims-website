import { createFileRoute } from "@tanstack/react-router";
import { Radar, ArrowRightLeft, Check, Trash2, X } from "lucide-react";
import { useState } from "react";
import { listNotFoundHitsFn, dismissNotFoundHitFn, deleteNotFoundHitFn, convertNotFoundToRedirectFn } from "@/backend/health/not-found";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format-date";

export const Route = createFileRoute("/admin/_authed/not-found")({
  loader: async () => listNotFoundHitsFn(),
  component: NotFoundMonitor,
});

type Hit = {
  id: string;
  path: string;
  referrer: string | null;
  hitCount: number;
  resolved: boolean;
  firstSeenAt: Date;
  lastSeenAt: Date;
};

function NotFoundMonitor() {
  const initial = Route.useLoaderData();
  const [items, setItems] = useState<Hit[]>(initial as Hit[]);
  const [showResolved, setShowResolved] = useState(false);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [toPath, setToPath] = useState("");
  const [error, setError] = useState<string | null>(null);

  const visible = items.filter((i) => showResolved || !i.resolved);

  async function handleDismiss(id: string) {
    await dismissNotFoundHitFn({ data: { id } });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, resolved: true } : i)));
  }

  async function handleDelete(id: string) {
    await deleteNotFoundHitFn({ data: { id } });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleConvert(hit: Hit) {
    if (!toPath) return;
    setError(null);
    try {
      await convertNotFoundToRedirectFn({ data: { id: hit.id, fromPath: hit.path, toPath } });
      setItems((prev) => prev.map((i) => (i.id === hit.id ? { ...i, resolved: true } : i)));
      setConvertingId(null);
      setToPath("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create redirect.");
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
          <Radar className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-foreground">404 Monitor</h1>
          <p className="text-sm text-muted-foreground">Real visitor 404 hits, most frequent first — turn one into a redirect in one click.</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <button
          onClick={() => setShowResolved(false)}
          className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${!showResolved ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
        >
          Unresolved ({items.filter((i) => !i.resolved).length})
        </button>
        <button
          onClick={() => setShowResolved(true)}
          className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${showResolved ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
        >
          All ({items.length})
        </button>
      </div>

      <div className="mt-4 max-w-3xl space-y-3">
        {visible.length === 0 && (
          <p className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center text-sm text-emerald-700">
            Nothing to see here — no unresolved 404s.
          </p>
        )}
        {visible.map((hit) => (
          <div key={hit.id} className={`rounded-xl border p-3 shadow-card ${hit.resolved ? "border-border bg-secondary/40 opacity-70" : "border-border bg-card"}`}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">{hit.hitCount}× hit</span>
              <span className="flex-1 truncate font-mono text-xs font-semibold text-foreground">{hit.path}</span>
              {hit.resolved && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Resolved</span>}
              <span className="text-[11px] text-muted-foreground">Last seen {formatDate(hit.lastSeenAt)}</span>
              {!hit.resolved && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setConvertingId(convertingId === hit.id ? null : hit.id); setError(null); }}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary transition hover:opacity-80"
                    title="Convert to redirect"
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDismiss(hit.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-muted-foreground transition hover:opacity-80" title="Dismiss">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <button onClick={() => handleDelete(hit.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive transition hover:bg-destructive/20" title="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {hit.referrer && <p className="mt-1 truncate text-[11px] text-muted-foreground">Referred from: {hit.referrer}</p>}

            {convertingId === hit.id && (
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border p-2.5">
                <span className="font-mono text-xs text-muted-foreground">{hit.path} →</span>
                <Input value={toPath} onChange={(e) => setToPath(e.target.value)} placeholder="/new-page" className="h-8 max-w-xs text-xs" />
                <Button size="sm" onClick={() => handleConvert(hit)} disabled={!toPath}>Create Redirect</Button>
                <button onClick={() => setConvertingId(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
            )}
          </div>
        ))}
        {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
    </div>
  );
}
