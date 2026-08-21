import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Trash2, Reply, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { listInquiriesFn, updateInquiryStatusFn, deleteInquiryFn, assignInquiryFn, replyToLeadFn } from "@/backend/leads/actions";
import { listAdminUsersFn } from "@/backend/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/lib/format-date";

export const Route = createFileRoute("/admin/_authed/leads")({
  loader: async () => {
    const [leads, admins] = await Promise.all([listInquiriesFn(), listAdminUsersFn()]);
    return { leads, admins };
  },
  component: LeadsAdmin,
});

type Status = "new" | "contacted" | "enrolled" | "lost";

type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  program: string | null;
  state: string | null;
  message: string | null;
  sourcePage: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  status: Status;
  assignedTo: string | null;
  createdAt: Date;
};

const STATUS_STYLE: Record<Status, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  enrolled: "bg-emerald-100 text-emerald-700",
  lost: "bg-red-100 text-red-700",
};

function LeadsAdmin() {
  const { leads: initial, admins } = Route.useLoaderData();
  const [leads, setLeads] = useState<Lead[]>(initial as Lead[]);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length, new: 0, contacted: 0, enrolled: 0, lost: 0 };
    for (const l of leads) c[l.status]++;
    return c;
  }, [leads]);

  const visible = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  async function handleStatusChange(id: string, status: Status) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await updateInquiryStatusFn({ data: { id, status } });
  }

  async function handleAssign(id: string, assignedTo: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, assignedTo: assignedTo || null } : l)));
    await assignInquiryFn({ data: { id, assignedTo: assignedTo || null } });
  }

  async function handleDelete(id: string) {
    await deleteInquiryFn({ data: { id } });
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
            <Inbox className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-extrabold text-foreground">Leads / Inquiries</h1>
            <p className="text-sm text-muted-foreground">Enquiry form submissions from the website.</p>
          </div>
        </div>
        <a
          href="/api/leads-export.csv"
          className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-foreground transition hover:opacity-80"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "new", "contacted", "enrolled", "lost"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize transition ${
              filter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {visible.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No leads here yet.
          </p>
        )}
        {visible.map((lead) => (
          <div key={lead.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-foreground">{lead.name}</p>
                <p className="text-xs text-muted-foreground">
                  {lead.email && <span>{lead.email} · </span>}
                  {lead.phone && <span>{lead.phone}</span>}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[lead.status]}`}>{lead.status}</span>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value as Status)}
                  className="h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-sm"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="lost">Lost</option>
                </select>
                <select
                  value={lead.assignedTo ?? ""}
                  onChange={(e) => handleAssign(lead.id, e.target.value)}
                  className="h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-sm"
                  title="Assign to counsellor"
                >
                  <option value="">Unassigned</option>
                  {admins.map((a) => (
                    <option key={a.id} value={a.id}>{a.name || a.email}</option>
                  ))}
                </select>
                {lead.email && (
                  <button
                    onClick={() => setReplyingTo(replyingTo === lead.id ? null : lead.id)}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary transition hover:opacity-80"
                    title="Reply by email"
                  >
                    <Reply className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(lead.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive transition hover:bg-destructive/20"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
              {lead.program && <span><strong className="text-foreground">Program:</strong> {lead.program}</span>}
              {lead.state && <span><strong className="text-foreground">State:</strong> {lead.state}</span>}
              {lead.sourcePage && <span><strong className="text-foreground">Source:</strong> {lead.sourcePage}</span>}
              {lead.utmSource && <span><strong className="text-foreground">UTM Source:</strong> {lead.utmSource}</span>}
              {lead.utmCampaign && <span><strong className="text-foreground">UTM Campaign:</strong> {lead.utmCampaign}</span>}
              <span><strong className="text-foreground">Received:</strong> {formatDateTime(lead.createdAt)}</span>
            </div>
            {lead.message && <p className="mt-2 text-sm text-muted-foreground">{lead.message}</p>}

            {replyingTo === lead.id && lead.email && (
              <ReplyForm leadId={lead.id} email={lead.email} onSent={() => setReplyingTo(null)} onCancel={() => setReplyingTo(null)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReplyForm({
  leadId, email, onSent, onCancel,
}: {
  leadId: string;
  email: string;
  onSent: () => void;
  onCancel: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (!subject || !message) return;
    setSending(true);
    setError(null);
    try {
      await replyToLeadFn({ data: { id: leadId, subject, message } });
      onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-4 space-y-2 rounded-xl border border-dashed border-border p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Reply to {email}</p>
      <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
      <Textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleSend} disabled={sending || !subject || !message}>
          {sending ? "Sending..." : "Send"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
