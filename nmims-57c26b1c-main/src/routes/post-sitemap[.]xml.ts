import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/backend/db/client";
import { blogPosts, siteSettings } from "@/backend/db/schema";
import { SITE_URL, xmlEscape, isoDate } from "@/lib/sitemap";

export const Route = createFileRoute("/post-sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [settingsRow] = await db
          .select({ sitemapEnabled: siteSettings.sitemapEnabled })
          .from(siteSettings)
          .where(eq(siteSettings.id, 1))
          .limit(1);
        if (settingsRow && !settingsRow.sitemapEnabled) {
          return new Response("Sitemap disabled.", { status: 404 });
        }

        const publishedPosts = await db
          .select({
            slug: blogPosts.slug,
            updatedAt: blogPosts.updatedAt,
            featuredImage: blogPosts.featuredImage,
          })
          .from(blogPosts)
          .where(eq(blogPosts.status, "published"));

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${SITE_URL}/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${publishedPosts
  .map(
    (p) => `<url>
<loc>${xmlEscape(`${SITE_URL}/blog/${p.slug}`)}</loc>
<lastmod>${isoDate(p.updatedAt)}</lastmod>
${p.featuredImage ? `<image:image>\n<image:loc>${xmlEscape(p.featuredImage)}</image:loc>\n</image:image>\n` : ""}</url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "no-cache, must-revalidate",
          },
        });
      },
    },
  },
});
