import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { FileText, Pencil, ExternalLink, Copy } from "lucide-react";
import { Fragment, useState } from "react";
import { listPagesFn, duplicatePageFn } from "@/backend/pages/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format-date";

export const Route = createFileRoute("/admin/_authed/pages/")({
  loader: async () => listPagesFn(),
  component: PagesList,
});

const DISPLAY_ORDER = [
  "home",
  "about",
  "online-mba",
  "online-bba",
  "online-bcom",
  "online-diploma",
  "online-certificate",
  "contact-us",
  "lp-online-mba",
  "privacy-policy",
  "terms-of-service",
  "disclaimer",
  "refund-policy",
];

const LIVE_PATH: Record<string, string> = {
  home: "/",
  about: "/about",
  "contact-us": "/contact-us",
  "online-mba": "/programs/online-mba",
  "online-bba": "/programs/online-bba",
  "online-bcom": "/programs/online-bcom",
  "online-diploma": "/programs/online-diploma",
  "online-certificate": "/programs/online-certificate",
  "lp-online-mba": "/lp-online-mba",
  "privacy-policy": "/privacy-policy",
  "terms-of-service": "/terms-of-service",
  disclaimer: "/disclaimer",
  "refund-policy": "/refund-policy",
};

function seoCompleteness(p: { metaTitle: string | null; metaDescription: string | null; canonicalUrl: string | null }) {
  const filled = [p.metaTitle, p.metaDescription, p.canonicalUrl].filter(Boolean).length;
  return filled; // 0-3
}

function PagesList() {
  const pages = Route.useLoaderData();
  const router = useRouter();
  const sorted = [...pages].sort(
    (a, b) => DISPLAY_ORDER.indexOf(a.slug) - DISPLAY_ORDER.indexOf(b.slug),
  );
  const [duplicatingSlug, setDuplicatingSlug] = useState<string | null>(null);
  const [newSlug, setNewSlug] = useState("");
  const [duplicating, setDuplicating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDuplicate(sourceSlug: string) {
    if (!newSlug) return;
    setDuplicating(true);
    setError(null);
    try {
      await duplicatePageFn({ data: { sourceSlug, newSlug } });
      setDuplicatingSlug(null);
      setNewSlug("");
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to duplicate.");
    } finally {
      setDuplicating(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
          <FileText className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-foreground">Pages</h1>
          <p className="text-sm text-muted-foreground">Edit page content and SEO settings.</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3">Page</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">SEO</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Updated</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <Fragment key={p.slug}>
                <tr className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="px-5 py-3 font-semibold text-foreground">{p.title}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">/{p.slug}</td>
                  <td className="px-5 py-3">
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={`h-2 w-2 rounded-full ${i < seoCompleteness(p) ? "bg-emerald-500" : "bg-muted"}`}
                        />
                      ))}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        p.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {formatDate(p.updatedAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to="/admin/pages/$slug"
                        params={{ slug: p.slug }}
                        className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary transition hover:opacity-80"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <a
                        href={LIVE_PATH[p.slug] ?? "/"}
                        target="_blank"
                        rel="noopener"
                        className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-muted-foreground transition hover:opacity-80"
                        title="View live"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      {p.type === "landing_page" && (
                        <button
                          onClick={() => {
                            setDuplicatingSlug(duplicatingSlug === p.slug ? null : p.slug);
                            setError(null);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-muted-foreground transition hover:opacity-80"
                          title="Duplicate as a new campaign page"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {duplicatingSlug === p.slug && (
                  <tr className="border-b border-border bg-secondary/30">
                    <td colSpan={6} className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          Copies this page's SEO fields as a draft under a new slug. You'll still need a developer to give it its own live URL/layout.
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Input
                          value={newSlug}
                          onChange={(e) => setNewSlug(e.target.value)}
                          placeholder="lp-new-campaign"
                          className="w-64"
                        />
                        <Button size="sm" onClick={() => handleDuplicate(p.slug)} disabled={duplicating || !newSlug}>
                          {duplicating ? "Duplicating..." : "Duplicate"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDuplicatingSlug(null)}>Cancel</Button>
                      </div>
                      {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
