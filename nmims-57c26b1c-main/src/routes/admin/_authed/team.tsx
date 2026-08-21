import { createFileRoute } from "@tanstack/react-router";
import { Users, Trash2, Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { listTeamMembersFn, createTeamMemberFn, updateTeamMemberFn, deleteTeamMemberFn } from "@/backend/team/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/_authed/team")({
  loader: async () => listTeamMembersFn(),
  component: TeamAdmin,
});

type Member = {
  id: string;
  name: string;
  designation: string | null;
  photoUrl: string | null;
  bio: string | null;
  sortOrder: number;
};

function TeamAdmin() {
  const initial = Route.useLoaderData();
  const [items, setItems] = useState<Member[]>(initial as Member[]);
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function refresh() {
    setItems((await listTeamMembersFn()) as Member[]);
  }

  async function handleDelete(id: string) {
    await deleteTeamMemberFn({ data: { id } });
    setItems((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-extrabold text-foreground">Team Members</h1>
            <p className="text-sm text-muted-foreground">Counsellor profiles shown on the About page.</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setShowNew((v) => !v)}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add Member
        </Button>
      </div>

      <div className="mt-6 max-w-3xl space-y-3">
        {showNew && <MemberForm onSaved={() => { setShowNew(false); refresh(); }} />}

        {items.length === 0 && !showNew && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No team members yet.
          </p>
        )}

        {items.map((m) =>
          editingId === m.id ? (
            <MemberForm key={m.id} initial={m} onSaved={() => { setEditingId(null); refresh(); }} />
          ) : (
            <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-card">
              {m.photoUrl ? (
                <img src={m.photoUrl} alt={m.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-sm font-bold text-muted-foreground">
                  {m.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.designation}</p>
              </div>
              <button onClick={() => setEditingId(m.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary transition hover:opacity-80" title="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(m.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive transition hover:bg-destructive/20" title="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function MemberForm({ initial, onSaved }: { initial?: Member; onSaved: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [designation, setDesignation] = useState(initial?.designation ?? "");
  const [photoUrl, setPhotoUrl] = useState(initial?.photoUrl ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name) return;
    setSaving(true);
    try {
      const payload = { name, designation: designation || null, photoUrl: photoUrl || null, bio: bio || null, sortOrder: initial?.sortOrder ?? 0 };
      if (initial) {
        await updateTeamMemberFn({ data: { id: initial.id, ...payload } });
      } else {
        await createTeamMemberFn({ data: payload });
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border border-dashed border-border p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{initial ? "Edit Member" : "Add Member"}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <Input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Designation" />
      </div>
      <Input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="Photo URL" />
      <Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short bio" />
      <Button size="sm" onClick={handleSave} disabled={saving || !name}>
        {saving ? "Saving..." : initial ? "Save Changes" : "Add Member"}
      </Button>
    </div>
  );
}
