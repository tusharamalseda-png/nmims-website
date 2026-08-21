import { Header, Footer, FloatingWA, MobileCTABar } from "@/components/layout/SiteChrome";

// Minimal markdown-lite: paragraphs separated by blank lines, **bold** inline.
function renderBody(body: string) {
  return body.split(/\n\n+/).map((para, i) => {
    const parts = para.split(/\*\*(.+?)\*\*/g);
    return (
      <p key={i} className="mt-4 text-sm leading-relaxed text-muted-foreground first:mt-0">
        {parts.map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="font-bold text-foreground">
              {part}
            </strong>
          ) : (
            part
          ),
        )}
      </p>
    );
  });
}

export type LegalPageData = {
  slug: string;
  title: string;
  content: Record<string, unknown>;
};

export function LegalPage({ page }: { page: LegalPageData }) {
  const body = typeof page.content?.body === "string" ? page.content.body : "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-3xl font-extrabold sm:text-4xl">{page.title}</h1>
          </div>
        </section>
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">{renderBody(body)}</div>
        </section>
      </main>
      <Footer />
      <FloatingWA message="Hi, I have a question about your policies." />
      <MobileCTABar message="Hi, I have a question about your policies." />
    </div>
  );
}
