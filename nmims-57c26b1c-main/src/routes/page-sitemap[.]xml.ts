import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/backend/db/client";
import { pages, siteSettings } from "@/backend/db/schema";
import { SITE_URL, pageUrl, xmlEscape, isoDate } from "@/lib/sitemap";

export const Route = createFileRoute("/page-sitemap.xml")({
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

        const publishedPages = await db
          .select({
            slug: pages.slug,
            type: pages.type,
            updatedAt: pages.updatedAt,
            ogImage: pages.ogImage,
          })
          .from(pages)
          .where(eq(pages.status, "published"));

        const urls: { loc: string; lastmod: string; image?: string | null }[] = [
          { loc: "/programs", lastmod: isoDate(null) },
          { loc: "/blog", lastmod: isoDate(null) },
          ...publishedPages.map((p) => ({
            loc: pageUrl(p.slug, p.type),
            lastmod: isoDate(p.updatedAt),
            image: p.ogImage,
          })),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${SITE_URL}/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `<url>
<loc>${xmlEscape(SITE_URL + u.loc)}</loc>
<lastmod>${u.lastmod}</lastmod>
${u.image ? `<image:image>\n<image:loc>${xmlEscape(u.image)}</image:loc>\n</image:image>\n` : ""}</url>`,
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
