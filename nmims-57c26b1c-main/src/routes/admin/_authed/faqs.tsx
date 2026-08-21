import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { listPagesFn } from "@/backend/pages/actions";
import { listFaqsForPageFn, createFaqFn, updateFaqFn, deleteFaqFn } from "@/backend/faqs/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/_authed/faqs")({
  loader: async () => {
    const pages = await listPagesFn();
    return { pages };
  },
  component: FaqsAdmin,
});

type Faq = {
  id: string;
  pageSlug: string;
  question: string;
  answer: string;
  sortOrder: number;
};

function FaqsAdmin() {
  const { pages } = Route.useLoaderData();
  const sortedPages = [...pages].sort((a, b) => a.slug.localeCompare(b.slug));
  const [selectedSlug, setSelectedSlug] = useState(sortedPages[0]?.slug ?? "");
  const [faqList, setFaqList] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);

  async function loadFaqs(slug: string) {
    setLoading(true);
    const list = await listFaqsForPageFn({ data: { pageSlug: slug } });
    setFaqList(list);
    setLoading(false);
    setLoadedOnce(true);
  }

  async function handleSlugChange(slug: string) {
    setSelectedSlug(slug);
    await loadFaqs(slug);
  }

  async function handleDelete(id: string) {
    await deleteFaqFn({ data: { id } });
    await loadFaqs(selectedSlug);
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
          <HelpCircle className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-foreground">FAQs</h1>
          <p className="text-sm text-muted-foreground">Manage FAQs shown on each page.</p>
        </div>
      </div>

      <div className="mt-6 max-w-3xl">
        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Page</label>
        <select
          value={selectedSlug}
          onChange={(e) => handleSlugChange(e.target.value)}
          className="mt-1.5 flex h-9 w-full max-w-sm rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
        >
          {sortedPages.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title} (/{p.slug})
            </option>
          ))}
        </select>
        {!loadedOnce && !loading && (
          <Button className="mt-3" onClick={() => loadFaqs(selectedSlug)}>
            Load FAQs
          </Button>
        )}
      </div>

      {loading && <p className="mt-6 text-sm text-muted-foreground">Loading...</p>}

      {loadedOnce && !loading && (
        <div className="mt-6 max-w-3xl space-y-4">
          {faqList.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No FAQs for this page yet.
            </p>
          )}
          {faqList.map((faq) => (
            <FaqRow key={faq.id} faq={faq} onSaved={() => loadFaqs(selectedSlug)} onDelete={() => handleDelete(faq.id)} />
          ))}

          <NewFaqRow pageSlug={selectedSlug} nextOrder={faqList.length} onCreated={() => loadFaqs(selectedSlug)} />
        </div>
      )}
    </div>
  );
}

function FaqRow({ faq, onSaved, onDelete }: { faq: Faq; onSaved: () => void; onDelete: () => void }) {
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updateFaqFn({ data: { id: faq.id, pageSlug: faq.pageSlug, question, answer, sortOrder: faq.sortOrder } });
    setSaving(false);
    onSaved();
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-card">
      <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" />
      <Textarea rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Answer" />
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <button
          onClick={onDelete}
          className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive transition hover:bg-destructive/20"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function NewFaqRow({ pageSlug, nextOrder, onCreated }: { pageSlug: string; nextOrder: number; onCreated: () => void }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!question || !answer) return;
    setSaving(true);
    await createFaqFn({ data: { pageSlug, question, answer, sortOrder: nextOrder } });
    setQuestion("");
    setAnswer("");
    setSaving(false);
    onCreated();
  }

  return (
    <div className="space-y-3 rounded-2xl border border-dashed border-border p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Add FAQ</p>
      <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" />
      <Textarea rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Answer" />
      <Button size="sm" onClick={handleCreate} disabled={saving || !question || !answer}>
        <Plus className="mr-1 h-3.5 w-3.5" /> {saving ? "Adding..." : "Add FAQ"}
      </Button>
    </div>
  );
}
