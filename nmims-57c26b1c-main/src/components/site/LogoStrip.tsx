type Logo = { id: string; name: string; logoUrl: string; category: string | null };

export function LogoStrip({ items }: { items: Logo[] }) {
  if (items.length === 0) return null;

  const banks = items.filter((l) => l.category === "bank");
  const accreditations = items.filter((l) => l.category === "accreditation");

  return (
    <section className="border-y border-border bg-secondary/30 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {accreditations.length > 0 && (
          <div className="mb-8">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">Accreditations</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-8">
              {accreditations.map((l) => (
                <img key={l.id} src={l.logoUrl} alt={l.name} className="h-10 w-auto object-contain grayscale transition hover:grayscale-0" />
              ))}
            </div>
          </div>
        )}
        {banks.length > 0 && (
          <div>
            <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">EMI Partner Banks</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-8">
              {banks.map((l) => (
                <img key={l.id} src={l.logoUrl} alt={l.name} className="h-8 w-auto object-contain grayscale transition hover:grayscale-0" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
