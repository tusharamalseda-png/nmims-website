import { createFileRoute } from "@tanstack/react-router";
import { Wrench, Download, Upload, Save, RotateCcw, Trash2, Search, ShieldAlert } from "lucide-react";
import { useRef, useState } from "react";
import {
  exportSiteDataFn, importSiteDataFn, listBackupsFn, createBackupFn, restoreBackupFn, deleteBackupFn,
  searchPersonDataFn, fulfillDataRequestFn, listDataRequestsFn,
} from "@/backend/tools/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate, formatDateTime } from "@/lib/format-date";

export const Route = createFileRoute("/admin/_authed/tools")({
  loader: async () => {
    const [backupList, requests] = await Promise.all([listBackupsFn(), listDataRequestsFn()]);
    return { backupList, requests };
  },
  component: ToolsPage,
});

const TABS = ["Import / Export", "Backups", "Privacy (GDPR)"] as const;

function ToolsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Import / Export");

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
          <Wrench className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-foreground">Tools</h1>
          <p className="text-sm text-muted-foreground">Export/import site content, snapshot backups, and privacy data requests.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 max-w-3xl">
        {tab === "Import / Export" && <ImportExportTab />}
        {tab === "Backups" && <BackupsTab />}
        {tab === "Privacy (GDPR)" && <PrivacyTab />}
      </div>
    </div>
  );
}

function ImportExportTab() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleExport() {
    setExporting(true);
    try {
      const { exportedAt, data } = await exportSiteDataFn();
      const blob = new Blob([JSON.stringify({ exportedAt, data }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cdoe-site-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setError(null);
    setResult(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const { summary } = await importSiteDataFn({ data: { data: parsed.data } });
      setResult(`Imported: ${Object.entries(summary).map(([k, v]) => `${k} (+${v})`).join(", ") || "nothing new"}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed — check the file is a valid export.");
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
      <div>
        <p className="text-sm font-semibold text-foreground">Export</p>
        <p className="text-xs text-muted-foreground">Downloads every page, post, FAQ, testimonial, team member, logo, menu link, redirect and site setting as one JSON file.</p>
        <Button size="sm" className="mt-3" onClick={handleExport} disabled={exporting}>
          <Download className="mr-1.5 h-3.5 w-3.5" /> {exporting ? "Exporting..." : "Export All Content"}
        </Button>
      </div>
      <hr className="border-border" />
      <div>
        <p className="text-sm font-semibold text-foreground">Import</p>
        <p className="text-xs text-muted-foreground">
          Restores from a previously exported file. Safe to re-run — pages/posts are matched by slug and updated only if new, everything else is only added if it doesn't already exist. Never deletes anything.
        </p>
        <Button size="sm" variant="outline" className="mt-3" onClick={() => fileRef.current?.click()} disabled={importing}>
          <Upload className="mr-1.5 h-3.5 w-3.5" /> {importing ? "Importing..." : "Choose Export File"}
        </Button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
        {result && <p className="mt-2 text-xs font-medium text-emerald-600">{result}</p>}
        {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
      </div>
    </div>
  );
}

type Backup = { id: string; label: string; createdAt: Date };

function BackupsTab() {
  const { backupList } = Route.useLoaderData();
  const [items, setItems] = useState<Backup[]>(backupList as Backup[]);
  const [label, setLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setCreating(true);
    try {
      const row = await createBackupFn({ data: { label: label || `Manual backup — ${formatDateTime(new Date())}` } });
      setItems((prev) => [row as Backup, ...prev]);
      setLabel("");
    } finally {
      setCreating(false);
    }
  }

  async function handleRestore(id: string) {
    setBusy(true);
    setError(null);
    try {
      await restoreBackupFn({ data: { id } });
      setRestoringId(null);
      setConfirmText("");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Restore failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteBackupFn({ data: { id } });
    setItems((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex-1">
          <Label>Backup Label</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Before homepage rewrite" />
        </div>
        <Button size="sm" onClick={handleCreate} disabled={creating}>
          <Save className="mr-1.5 h-3.5 w-3.5" /> {creating ? "Saving..." : "Create Backup Now"}
        </Button>
      </div>

      {items.length === 0 && <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No backups yet.</p>}

      {items.map((b) => (
        <div key={b.id} className="rounded-xl border border-border bg-card p-3 shadow-card">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex-1 text-sm font-semibold text-foreground">{b.label}</span>
            <span className="text-xs text-muted-foreground">{formatDateTime(b.createdAt)}</span>
            <button onClick={() => { setRestoringId(restoringId === b.id ? null : b.id); setConfirmText(""); setError(null); }} className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary transition hover:opacity-80" title="Restore">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => handleDelete(b.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive transition hover:bg-destructive/20" title="Delete">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {restoringId === b.id && (
            <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="flex items-center gap-1.5 text-xs font-bold text-destructive"><ShieldAlert className="h-3.5 w-3.5" /> This replaces ALL current content with this backup. It cannot be undone.</p>
              <p className="mt-1 text-xs text-muted-foreground">Type <b>RESTORE</b> to confirm.</p>
              <div className="mt-2 flex items-center gap-2">
                <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="max-w-[160px] h-8 text-xs" />
                <Button size="sm" variant="destructive" disabled={confirmText !== "RESTORE" || busy} onClick={() => handleRestore(b.id)}>
                  {busy ? "Restoring..." : "Restore Now"}
                </Button>
              </div>
              {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

type LeadMatch = { id: string; name: string; email: string | null; phone: string | null; message: string | null; createdAt: Date };
type TestimonialMatch = { id: string; name: string; quote: string | null; designation: string | null };
type DataRequest = { id: string; requestType: "export" | "erase"; identifier: string; notes: string | null; createdAt: Date };

function PrivacyTab() {
  const { requests } = Route.useLoaderData();
  const [identifier, setIdentifier] = useState("");
  const [searching, setSearching] = useState(false);
  const [leads, setLeads] = useState<LeadMatch[]>([]);
  const [testimonialMatches, setTestimonialMatches] = useState<TestimonialMatch[]>([]);
  const [searched, setSearched] = useState(false);
  const [log, setLog] = useState<DataRequest[]>(requests as DataRequest[]);
  const [busy, setBusy] = useState(false);

  async function handleSearch() {
    if (identifier.trim().length < 2) return;
    setSearching(true);
    setSearched(false);
    try {
      const result = await searchPersonDataFn({ data: { identifier } });
      setLeads(result.leads as LeadMatch[]);
      setTestimonialMatches(result.testimonials as TestimonialMatch[]);
      setSearched(true);
    } finally {
      setSearching(false);
    }
  }

  async function handleExportRequest() {
    setBusy(true);
    try {
      const blob = new Blob([JSON.stringify({ leads, testimonials: testimonialMatches }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `personal-data-${identifier}.json`;
      a.click();
      URL.revokeObjectURL(url);
      const row = await fulfillDataRequestFn({ data: { requestType: "export", identifier, notes: null, eraseLeadIds: [], eraseTestimonialIds: [] } });
      setLog((prev) => [row as DataRequest, ...prev]);
    } finally {
      setBusy(false);
    }
  }

  async function handleErase() {
    if (!confirm(`Permanently erase the ${leads.length + testimonialMatches.length} matching record(s)? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const row = await fulfillDataRequestFn({
        data: { requestType: "erase", identifier, notes: null, eraseLeadIds: leads.map((l) => l.id), eraseTestimonialIds: testimonialMatches.map((t) => t.id) },
      });
      setLog((prev) => [row as DataRequest, ...prev]);
      setLeads([]);
      setTestimonialMatches([]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <p className="text-sm font-semibold text-foreground">Find a person's data</p>
        <p className="mb-3 text-xs text-muted-foreground">Search by name, email or phone across leads and testimonial submissions.</p>
        <div className="flex items-center gap-2">
          <Input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="name@example.com" />
          <Button size="sm" onClick={handleSearch} disabled={searching || identifier.trim().length < 2}>
            <Search className="mr-1.5 h-3.5 w-3.5" /> {searching ? "Searching..." : "Search"}
          </Button>
        </div>

        {searched && (
          <div className="mt-4 space-y-3">
            {leads.length === 0 && testimonialMatches.length === 0 ? (
              <p className="text-xs text-muted-foreground">No matching records found.</p>
            ) : (
              <>
                {leads.map((l) => (
                  <div key={l.id} className="rounded-lg border border-border p-2.5 text-xs">
                    <p className="font-semibold text-foreground">{l.name} <span className="font-normal text-muted-foreground">— lead, {formatDate(l.createdAt)}</span></p>
                    <p className="text-muted-foreground">{l.email} · {l.phone}</p>
                  </div>
                ))}
                {testimonialMatches.map((t) => (
                  <div key={t.id} className="rounded-lg border border-border p-2.5 text-xs">
                    <p className="font-semibold text-foreground">{t.name} <span className="font-normal text-muted-foreground">— testimonial</span></p>
                    <p className="truncate text-muted-foreground">{t.quote}</p>
                  </div>
                ))}
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={handleExportRequest} disabled={busy}>Export this data</Button>
                  <Button size="sm" variant="destructive" onClick={handleErase} disabled={busy}>Erase this data</Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Request Log</p>
        {log.length === 0 && <p className="text-xs text-muted-foreground">No requests fulfilled yet.</p>}
        {log.map((r) => (
          <div key={r.id} className="flex items-center gap-2 border-b border-border py-2 text-xs last:border-0">
            <span className={`rounded-full px-2 py-0.5 font-bold ${r.requestType === "erase" ? "bg-destructive/10 text-destructive" : "bg-emerald-100 text-emerald-700"}`}>{r.requestType}</span>
            <span className="flex-1 truncate text-foreground">{r.identifier}</span>
            <span className="text-muted-foreground">{formatDate(r.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
