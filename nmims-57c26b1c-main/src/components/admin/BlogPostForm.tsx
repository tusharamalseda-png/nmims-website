import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { createBlogPostFn, updateBlogPostFn } from "@/backend/blog/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  category: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: "draft" | "published";
  scheduledFor: Date | string | null;
  canonicalUrl?: string | null;
  focusKeyword?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  twitterCardType?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  schemaType?: string | null;
  breadcrumbLabel?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
};

function toDatetimeLocal(value: Date | string | null) {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const SCHEMA_TYPES = ["Article", "WebPage", "FAQPage", "None"];

export function BlogPostForm({ post }: { post?: BlogPost }) {
  const navigate = useNavigate();
  const isEditing = !!post;
  const [tab, setTab] = useState<"content" | "seo">("content");

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [scheduledFor, setScheduledFor] = useState(toDatetimeLocal(post?.scheduledFor ?? null));

  const [focusKeyword, setFocusKeyword] = useState(post?.focusKeyword ?? "");
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(post?.canonicalUrl ?? "");
  const [robotsIndex, setRobotsIndex] = useState(post?.robotsIndex ?? true);
  const [robotsFollow, setRobotsFollow] = useState(post?.robotsFollow ?? true);
  const [ogSameAsMeta, setOgSameAsMeta] = useState(!post?.ogTitle && !post?.ogDescription);
  const [ogTitle, setOgTitle] = useState(post?.ogTitle ?? "");
  const [ogDescription, setOgDescription] = useState(post?.ogDescription ?? "");
  const [twitterSameAsOg, setTwitterSameAsOg] = useState(!post?.twitterTitle && !post?.twitterDescription && !post?.twitterImage);
  const [twitterCardType, setTwitterCardType] = useState(post?.twitterCardType ?? "summary_large_image");
  const [twitterTitle, setTwitterTitle] = useState(post?.twitterTitle ?? "");
  const [twitterDescription, setTwitterDescription] = useState(post?.twitterDescription ?? "");
  const [twitterImage, setTwitterImage] = useState(post?.twitterImage ?? "");
  const [schemaType, setSchemaType] = useState(post?.schemaType ?? "Article");
  const [breadcrumbLabel, setBreadcrumbLabel] = useState(post?.breadcrumbLabel ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        slug,
        title,
        excerpt: excerpt || null,
        content,
        featuredImage: featuredImage || null,
        category: category || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        status,
        scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : null,
        canonicalUrl: canonicalUrl || null,
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
      };
      if (isEditing) {
        await updateBlogPostFn({ data: { ...payload, originalSlug: post.slug } });
      } else {
        await createBlogPostFn({ data: payload });
      }
      navigate({ to: "/admin/blog" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const previewTitle = metaTitle || title || "Untitled post";
  const previewDescription = metaDescription || excerpt || "No meta description set.";

  return (
    <div className="max-w-2xl">
      <div className="mb-4 flex gap-2">
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

      <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card">
        {tab === "content" && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} />
              <p className="text-xs text-muted-foreground">/blog/{slug || "..."}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" rows={12} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write the post. Leave a blank line between paragraphs." />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input id="featuredImage" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="scheduledFor">Schedule for later (optional)</Label>
              <Input id="scheduledFor" type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} />
              <p className="text-xs text-muted-foreground">If set to a future time and Status is Published, the post stays hidden until then.</p>
            </div>
          </>
        )}

        {tab === "seo" && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="focusKeyword">Focus Keyword</Label>
              <Input id="focusKeyword" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} />
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
            <div className="space-y-1.5">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input id="canonicalUrl" placeholder={`/blog/${slug}`} value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <p className="mb-1 text-[11px] text-emerald-700">cdoe.info/blog/{slug || "..."}</p>
              <p className="mb-0.5 truncate text-[15px] text-[#1558b0]">{previewTitle}</p>
              <p className="line-clamp-2 text-xs text-muted-foreground">{previewDescription}</p>
            </div>

            <hr className="border-border" />
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div><p className="text-sm font-semibold text-foreground">Index this post</p><p className="text-xs text-muted-foreground">Allow it to appear in search results</p></div>
              <Switch checked={robotsIndex} onCheckedChange={setRobotsIndex} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div><p className="text-sm font-semibold text-foreground">Follow links on this post</p></div>
              <Switch checked={robotsFollow} onCheckedChange={setRobotsFollow} />
            </div>

            <hr className="border-border" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Social Sharing</p>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={ogSameAsMeta} onChange={(e) => setOgSameAsMeta(e.target.checked)} />
              Open Graph title/description same as Meta Title/Description
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

        {error && <p className="text-sm font-medium text-destructive">{error}</p>}

        <Button onClick={handleSave} disabled={saving || !title || !slug}>
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Post"}
        </Button>
      </div>
    </div>
  );
}
