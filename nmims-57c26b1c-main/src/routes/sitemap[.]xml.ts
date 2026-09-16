import { createFileRoute } from "@tanstack/react-router";
import { desc, eq } from "drizzle-orm";
import { db } from "@/backend/db/client";
import { pages, blogPosts, siteSettings } from "@/backend/db/schema";
import { SITE_URL, isoDate } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
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

        const [latestPage] = await db
          .select({ updatedAt: pages.updatedAt })
          .from(pages)
          .where(eq(pages.status, "published"))
          .orderBy(desc(pages.updatedAt))
          .limit(1);
        const [firstPost] = await db
          .select({ updatedAt: blogPosts.updatedAt })
          .from(blogPosts)
          .where(eq(blogPosts.status, "published"))
          .orderBy(desc(blogPosts.updatedAt))
          .limit(1);

        const sitemaps = [
          { loc: `${SITE_URL}/page-sitemap.xml`, lastmod: isoDate(latestPage?.updatedAt) },
          ...(firstPost
            ? [{ loc: `${SITE_URL}/post-sitemap.xml`, lastmod: isoDate(firstPost.updatedAt) }]
            : []),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${SITE_URL}/main-sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (s) => `<sitemap>
<loc>${s.loc}</loc>
<lastmod>${s.lastmod}</lastmod>
</sitemap>`,
  )
  .join("\n")}
</sitemapindex>`;

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
