import { createFileRoute } from "@tanstack/react-router";
import { Image as ImageIcon, FileText, Trash2, Upload, Copy, Check, Pencil, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { listMediaFn, uploadMediaFn, deleteMediaFn, updateMediaFn } from "@/backend/media/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/_authed/media")({
  loader: async () => listMediaFn(),
  component: MediaLibrary,
});

type MediaItem = {
  id: string;
  slug: string;
  fileUrl: string;
  fileName: string | null;
  fileType: string;
  fileSize: number | null;
  altText: string | null;
  title: string | null;
  caption: string | null;
  folder: string | null;
  uploadedAt: Date;
};

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function MediaLibrary() {
  const initialItems = Route.useLoaderData();
  const [items, setItems] = useState<MediaItem[]>(initialItems as MediaItem[]);
  const [folder, setFolder] = useState("uncategorized");
  const [altText, setAltText] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "pdf">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = useMemo(() => {
    const set = new Set(items.map((i) => i.folder || "uncategorized"));
    return ["all", ...Array.from(set)];
  }, [items]);

  const visibleItems = items
    .filter((i) => activeFilter === "all" || (i.folder || "uncategorized") === activeFilter)
    .filter((i) => typeFilter === "all" || i.fileType === typeFilter);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("altText", altText);
      formData.append("title", title);
      formData.append("caption", caption);
      const row = await uploadMediaFn({ data: formData });
      setItems((prev) => [row as MediaItem, ...prev]);
      setAltText("");
      setTitle("");
      setCaption("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(item: MediaItem) {
    await deleteMediaFn({ data: { id: item.id } });
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  function handleCopy(fileUrl: string, id: string) {
    navigator.clipboard.writeText(`${window.location.origin}${fileUrl}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function handleSaveEdit(item: MediaItem, patch: { title: string; caption: string; altText: string; folder: string }) {
    await updateMediaFn({
      data: { id: item.id, title: patch.title || null, caption: patch.caption || null, altText: patch.altText || null, folder: patch.folder },
    });
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...patch, title: patch.title || null, caption: patch.caption || null, altText: patch.altText || null } : i)));
    setEditingId(null);
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
          <ImageIcon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground">Upload and manage images and PDFs — with the per-file fields search engines and screen readers use.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="space-y-1.5">
          <Label>Folder</Label>
          <Input value={folder} onChange={(e) => setFolder(e.target.value)} className="w-40" placeholder="e.g. blog" />
        </div>
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="w-48" placeholder="Media title" />
        </div>
        <div className="space-y-1.5">
          <Label>Alt Text</Label>
          <Input value={altText} onChange={(e) => setAltText(e.target.value)} className="w-56" placeholder="Describe the image" />
        </div>
        <div className="space-y-1.5">
          <Label>Caption</Label>
          <Input value={caption} onChange={(e) => setCaption(e.target.value)} className="w-56" placeholder="Optional caption" />
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <Upload className="mr-1.5 h-4 w-4" /> {uploading ? "Uploading..." : "Upload File"}
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleUpload} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(["all", "image", "pdf"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              typeFilter === t ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "all" ? "All types" : t === "image" ? "Images" : "Documents"}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              activeFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visibleItems.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No media in this folder yet.
          </p>
        )}
        {visibleItems.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="flex aspect-square items-center justify-center bg-secondary">
              {item.fileType === "image" ? (
                <img src={item.fileUrl} alt={item.altText ?? ""} className="h-full w-full object-cover" />
              ) : (
                <FileText className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-0.5 p-2.5">
              <p className="truncate text-xs font-semibold text-foreground">{item.title || item.fileName}</p>
              <p className="text-[11px] text-muted-foreground">{item.folder} · {formatBytes(item.fileSize)}</p>
              {item.caption && <p className="truncate text-[11px] text-muted-foreground">{item.caption}</p>}
              {item.altText && <p className="truncate text-[11px] italic text-muted-foreground">"{item.altText}"</p>}
            </div>
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition group-hover:opacity-100">
              <button
                onClick={() => setEditingId(item.id)}
                className="grid h-9 w-9 place-items-center rounded-lg bg-white text-foreground transition hover:opacity-90"
                title="Edit details"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleCopy(item.fileUrl, item.id)}
                className="grid h-9 w-9 place-items-center rounded-lg bg-white text-foreground transition hover:opacity-90"
                title="Copy URL"
              >
                {copiedId === item.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="grid h-9 w-9 place-items-center rounded-lg bg-destructive text-white transition hover:opacity-90"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {editingId === item.id && <MediaEditPanel item={item} onClose={() => setEditingId(null)} onSave={(patch) => handleSaveEdit(item, patch)} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaEditPanel({
  item,
  onClose,
  onSave,
}: {
  item: MediaItem;
  onClose: () => void;
  onSave: (patch: { title: string; caption: string; altText: string; folder: string }) => Promise<void>;
}) {
  const [title, setTitle] = useState(item.title ?? "");
  const [caption, setCaption] = useState(item.caption ?? "");
  const [altText, setAltText] = useState(item.altText ?? "");
  const [folder, setFolder] = useState(item.folder ?? "uncategorized");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({ title, caption, altText, folder });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="absolute inset-0 z-10 flex flex-col gap-2 overflow-y-auto bg-card p-3 text-left shadow-elegant">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-foreground">Edit Media</p>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
      </div>
      <div className="space-y-1">
        <Label className="text-[10px]">Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-7 text-xs" />
      </div>
      <div className="space-y-1">
        <Label className="text-[10px]">Alt Text</Label>
        <Input value={altText} onChange={(e) => setAltText(e.target.value)} className="h-7 text-xs" />
      </div>
      <div className="space-y-1">
        <Label className="text-[10px]">Caption</Label>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} className="text-xs" />
      </div>
      <div className="space-y-1">
        <Label className="text-[10px]">Folder</Label>
        <Input value={folder} onChange={(e) => setFolder(e.target.value)} className="h-7 text-xs" />
      </div>
      <Button size="sm" onClick={handleSave} disabled={saving} className="mt-1">
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
