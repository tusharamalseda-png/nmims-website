import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { getPageFn, updatePageFn } from "@/backend/pages/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { formatDateTime } from "@/lib/format-date";

export const Route = createFileRoute("/admin/_authed/pages/$slug")({
  loader: async ({ params }) => {
    const page = await getPageFn({ data: { slug: params.slug } });
    if (!page) throw notFound();
    return page;
  },
  component: PageEdit,
});

const SCHEMA_TYPES = ["WebPage", "Article", "FAQPage", "Course", "Product", "LocalBusiness", "None"];

function PageEdit() {
  const page = Route.useLoaderData();
  const router = useRouter();
  const isLegal = page.type === "legal";
  const [tab, setTab] = useState<"content" | "seo">("content");

  const [slug, setSlug] = useState(page.slug);
  const [title, setTitle] = useState(page.title);
  const [status, setStatus] = useState(page.status);
  const [body, setBody] = useState(typeof page.content?.body === "string" ? page.content.body : "");

  const [focusKeyword, setFocusKeyword] = useState(page.focusKeyword ?? "");
  const [metaTitle, setMetaTitle] = useState(page.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(page.metaDescription ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(page.canonicalUrl ?? "");
  const [robotsIndex, setRobotsIndex] = useState(page.robotsIndex ?? true);
  const [robotsFollow, setRobotsFollow] = useState(page.robotsFollow ?? true);
  const [ogImage, setOgImage] = useState(page.ogImage ?? "");
  const [ogSameAsMeta, setOgSameAsMeta] = useState(!page.ogTitle && !page.ogDescription);
  const [ogTitle, setOgTitle] = useState(page.ogTitle ?? "");
  const [ogDescription, setOgDescription] = useState(page.ogDescription ?? "");
  const [twitterSameAsOg, setTwitterSameAsOg] = useState(!page.twitterTitle && !page.twitterDescription && !page.twitterImage);
  const [twitterCardType, setTwitterCardType] = useState(page.twitterCardType ?? "summary_large_image");
  const [twitterTitle, setTwitterTitle] = useState(page.twitterTitle ?? "");
  const [twitterDescription, setTwitterDescription] = useState(page.twitterDescription ?? "");
  const [twitterImage, setTwitterImage] = useState(page.twitterImage ?? "");
  const [schemaType, setSchemaType] = useState(page.schemaType ?? "WebPage");
  const [breadcrumbLabel, setBreadcrumbLabel] = useState(page.breadcrumbLabel ?? "");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const result = await updatePageFn({
        data: {
          slug: page.slug,
          newSlug: slug !== page.slug ? slug : undefined,
          title,
          metaTitle: metaTitle || null,
          metaDescription: metaDescription || null,
          canonicalUrl: canonicalUrl || null,
          ogImage: ogImage || null,
          status,
          ...(isLegal ? { body } : {}),
          focusKeyword: focusKeyword || null,
          ogTitle: ogSameAsMeta ? null : ogTitle || null,
          ogDescription: ogSameAsMeta ? null : ogDescription || null,
          twitterCardType,
          twitterTitle: twitterSameAsOg ? null : twitterTitle || null,
          twitterDescription: twitterSameAsOg ? null : twitterDescription || null,
          twitterImage: twitterSameAsOg ? null : twitterImage || null,
          schemaType,
          breadcrumbLabel: breadcrumbLabel || null,
          robotsIndex,
          robotsFollow,
        },
      });
      if (result.slug !== page.slug) {
        router.navigate({ to: "/admin/pages/$slug", params: { slug: result.slug } });
      } else {
        await router.invalidate();
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  const previewTitle = metaTitle || title;
  const previewDescription = metaDescription || "No meta description set.";
  const previewUrl = `cdoe.info${canonicalUrl.startsWith("/") ? canonicalUrl : `/${slug}`}`;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/pages" className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Pages
      </Link>

      <h1 className="text-lg font-extrabold text-foreground">{page.title}</h1>
      <p className="text-sm text-muted-foreground">/{page.slug}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setTab("content")}
          className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${tab === "content" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
        >
          Content
        </button>
        <button
          onClick={() => setTab("seo")}
          className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${tab === "seo" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
        >
          SEO
        </button>
      </div>

      <div className="mt-4 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card">
        {tab === "content" && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="title">Page Title (H1)</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {isLegal ? (
              <>
                <hr className="border-border" />
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Page Content</p>
                <div className="space-y-1.5">
                  <Label htmlFor="body">Body Text</Label>
                  <Textarea id="body" rows={16} className="font-mono text-xs" value={body} onChange={(e) => setBody(e.target.value)} />
                  <p className="text-xs text-muted-foreground">Separate paragraphs with a blank line. Wrap text in **double asterisks** for bold headings.</p>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
                This page's layout and body content are defined in code, not the database — a developer needs to add a section here before it becomes editable.
                In the meantime, use the "Edit This Page" button on the live page for anything already database-driven (SEO fields, images, testimonials, FAQs).
              </div>
            )}

            <hr className="border-border" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Info</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Published</Label>
                <Input disabled value={page.publishedAt ? formatDateTime(page.publishedAt) : "Not published yet"} />
              </div>
              <div className="space-y-1.5">
                <Label>Last Updated</Label>
                <Input disabled value={formatDateTime(page.updatedAt)} />
              </div>
            </div>
          </>
        )}

        {tab === "seo" && (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Search Appearance</p>
            <div className="space-y-1.5">
              <Label htmlFor="focusKeyword">Focus Keyword</Label>
              <Input id="focusKeyword" placeholder="e.g. NMIMS online MBA" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="metaTitle" className="flex justify-between">
                <span>Meta Title</span><span className="font-mono text-[10px] text-muted-foreground">{metaTitle.length} / 60</span>
              </Label>
              <Input id="metaTitle" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="metaDescription" className="flex justify-between">
                <span>Meta Description</span><span className="font-mono text-[10px] text-muted-foreground">{metaDescription.length} / 160</span>
              </Label>
              <Textarea id="metaDescription" rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input id="canonicalUrl" placeholder="/about" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <p className="mb-1 text-[11px] text-emerald-700">{previewUrl}</p>
              <p className="mb-0.5 truncate text-[15px] text-[#1558b0]">{previewTitle}</p>
              <p className="line-clamp-2 text-xs text-muted-foreground">{previewDescription}</p>
            </div>

            <hr className="border-border" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Indexing &amp; Robots</p>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Index this page</p>
                <p className="text-xs text-muted-foreground">Allow it to appear in search results</p>
              </div>
              <Switch checked={robotsIndex} onCheckedChange={setRobotsIndex} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Follow links on this page</p>
                <p className="text-xs text-muted-foreground">Let link-equity pass through outbound links</p>
              </div>
              <Switch checked={robotsFollow} onCheckedChange={setRobotsFollow} />
            </div>

            <hr className="border-border" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Social Sharing</p>
            <div className="space-y-1.5">
              <Label htmlFor="ogImage">Featured / OG Image URL</Label>
              <Input id="ogImage" value={ogImage} onChange={(e) => setOgImage(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={ogSameAsMeta} onChange={(e) => setOgSameAsMeta(e.target.checked)} />
              Open Graph title/description same as Meta Title/Description above
            </label>
            {!ogSameAsMeta && (
              <div className="space-y-3 rounded-lg border border-border p-3">
                <div className="space-y-1.5"><Label htmlFor="ogTitle">OG Title</Label><Input id="ogTitle" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} /></div>
                <div className="space-y-1.5"><Label htmlFor="ogDescription">OG Description</Label><Textarea id="ogDescription" rows={2} value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} /></div>
              </div>
            )}
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={twitterSameAsOg} onChange={(e) => setTwitterSameAsOg(e.target.checked)} />
              Twitter Card same as Open Graph
            </label>
            {!twitterSameAsOg && (
              <div className="space-y-3 rounded-lg border border-border p-3">
                <div className="space-y-1.5">
                  <Label htmlFor="twitterCardType">Card Type</Label>
                  <select id="twitterCardType" value={twitterCardType} onChange={(e) => setTwitterCardType(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm">
                    <option value="summary_large_image">summary_large_image</option>
                    <option value="summary">summary</option>
                  </select>
                </div>
                <div className="space-y-1.5"><Label htmlFor="twitterTitle">Twitter Title</Label><Input id="twitterTitle" value={twitterTitle} onChange={(e) => setTwitterTitle(e.target.value)} /></div>
                <div className="space-y-1.5"><Label htmlFor="twitterDescription">Twitter Description</Label><Textarea id="twitterDescription" rows={2} value={twitterDescription} onChange={(e) => setTwitterDescription(e.target.value)} /></div>
                <div className="space-y-1.5"><Label htmlFor="twitterImage">Twitter Image URL</Label><Input id="twitterImage" value={twitterImage} onChange={(e) => setTwitterImage(e.target.value)} /></div>
              </div>
            )}

            <hr className="border-border" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Structured Data</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="schemaType">Schema Type</Label>
                <select id="schemaType" value={schemaType} onChange={(e) => setSchemaType(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm">
                  {SCHEMA_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="breadcrumbLabel">Breadcrumb Label</Label>
                <Input id="breadcrumbLabel" placeholder={title} value={breadcrumbLabel} onChange={(e) => setBreadcrumbLabel(e.target.value)} />
              </div>
            </div>
          </>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          {saved && <span className="text-sm font-medium text-emerald-600">Saved.</span>}
          {error && <span className="text-sm font-medium text-destructive">{error}</span>}
        </div>
      </div>
    </div>
  );
}
