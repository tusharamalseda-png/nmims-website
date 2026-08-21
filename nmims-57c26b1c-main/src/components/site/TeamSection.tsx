import { SectionTitle } from "@/components/layout/SiteChrome";

type Member = { id: string; name: string; designation: string | null; photoUrl: string | null; bio: string | null };

export function TeamSection({ items }: { items: Member[] }) {
  if (items.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Meet the team" title="Your Admission Counsellors" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <div key={m.id} className="rounded-2xl border border-border bg-card p-6 text-center shadow-card">
              {m.photoUrl ? (
                <img src={m.photoUrl} alt={m.name} className="mx-auto h-24 w-24 rounded-full object-cover shadow-card" />
              ) : (
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-secondary text-2xl font-bold text-muted-foreground">
                  {m.name.charAt(0)}
                </div>
              )}
              <p className="mt-4 font-extrabold text-foreground">{m.name}</p>
              {m.designation && <p className="text-sm text-muted-foreground">{m.designation}</p>}
              {m.bio && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
