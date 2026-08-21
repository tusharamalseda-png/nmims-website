import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/backend/db/client";
import { pages, blogPosts, siteSettings } from "@/backend/db/schema";
import { eq } from "drizzle-orm";

const SITE_URL = "https://cdoe.info";

const PROGRAM_SLUGS = new Set([
  "online-mba", "online-bba", "online-bcom", "online-diploma", "online-certificate",
]);

function pageUrl(slug: string, type: string) {
  if (slug === "home") return "/";
  if (type === "page" && PROGRAM_SLUGS.has(slug)) return `/programs/${slug}`;
  return `/${slug}`;
}

function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [settingsRow] = await db.select({ sitemapEnabled: siteSettings.sitemapEnabled }).from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
        if (settingsRow && !settingsRow.sitemapEnabled) {
          return new Response("Sitemap disabled.", { status: 404 });
        }

        const [publishedPages, publishedPosts] = await Promise.all([
          db.select({ slug: pages.slug, type: pages.type, updatedAt: pages.updatedAt }).from(pages).where(eq(pages.status, "published")),
          db.select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt }).from(blogPosts).where(eq(blogPosts.status, "published")),
        ]);

        const urls: { loc: string; lastmod?: Date | null; priority: string }[] = [
          { loc: "/blog", priority: "0.7" },
          { loc: "/programs", priority: "0.8" },
        ];

        for (const p of publishedPages) {
          urls.push({ loc: pageUrl(p.slug, p.type), lastmod: p.updatedAt, priority: p.slug === "home" ? "1.0" : "0.8" });
        }
        for (const post of publishedPosts) {
          urls.push({ loc: `/blog/${post.slug}`, lastmod: post.updatedAt, priority: "0.6" });
        }

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(SITE_URL + u.loc)}</loc>
${u.lastmod ? `    <lastmod>${new Date(u.lastmod).toISOString().slice(0, 10)}</lastmod>\n` : ""}    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(body, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
