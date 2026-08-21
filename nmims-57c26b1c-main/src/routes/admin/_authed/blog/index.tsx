import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Pencil, ExternalLink, Plus } from "lucide-react";
import { listBlogPostsFn } from "@/backend/blog/actions";
import { formatDate } from "@/lib/format-date";

export const Route = createFileRoute("/admin/_authed/blog/")({
  loader: async () => listBlogPostsFn(),
  component: BlogList,
});

function BlogList() {
  const posts = Route.useLoaderData();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-lg font-extrabold text-foreground">Blog</h1>
            <p className="text-sm text-muted-foreground">Write and manage blog posts.</p>
          </div>
        </div>
        <Link
          to="/admin/blog/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[linear-gradient(135deg,#ef4444,#f97316)] px-4 py-2 text-sm font-bold text-white shadow-card transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add Blog Post
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Published</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                  No blog posts yet.
                </td>
              </tr>
            )}
            {posts.map((p) => (
              <tr key={p.slug} className="border-b border-border last:border-0 hover:bg-secondary/50">
                <td className="max-w-md px-5 py-3 font-semibold text-foreground">{p.title}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{p.category ?? "—"}</td>
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
                  {p.publishedAt ? formatDate(p.publishedAt) : "—"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      to="/admin/blog/$slug"
                      params={{ slug: p.slug }}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-primary transition hover:opacity-80"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <a
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      rel="noopener"
                      className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-muted-foreground transition hover:opacity-80"
                      title="View live"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
