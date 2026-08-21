import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { pages, blogPosts, navigationItems } from "../db/schema";
import { getAdminSession } from "../auth/session";

export const getMissingSeoFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");

  const allPages = await db.select().from(pages);
  const allPosts = await db.select().from(blogPosts).where(eq(blogPosts.status, "published"));

  const pagesMissing = allPages
    .filter((p) => !p.metaTitle || !p.metaDescription)
    .map((p) => ({ type: "page" as const, slug: p.slug, title: p.title, missingMetaTitle: !p.metaTitle, missingMetaDescription: !p.metaDescription }));

  const postsMissing = allPosts
    .filter((p) => !p.metaTitle || !p.metaDescription)
    .map((p) => ({ type: "blog_post" as const, slug: p.slug, title: p.title, missingMetaTitle: !p.metaTitle, missingMetaDescription: !p.metaDescription }));

  return [...pagesMissing, ...postsMissing];
});

// Every route that actually exists as a file under src/routes, aside from
// admin/api/dynamic-slug ones handled separately below. Kept in sync by hand
// since this is a small, slow-changing list — update it when a page route
// is added, renamed or removed.
const KNOWN_STATIC_ROUTES = new Set([
  "/", "/about", "/contact-us", "/blog", "/share-your-story", "/maintenance", "/programs",
  "/programs/online-mba", "/programs/online-bba", "/programs/online-bcom", "/programs/online-diploma", "/programs/online-certificate",
  "/lp-online-mba", "/privacy-policy", "/terms-of-service", "/disclaimer", "/refund-policy",
]);

// The 3 original blog posts are hand-coded route files, not database rows,
// so they need to be recognized by slug explicitly.
const HAND_CODED_BLOG_SLUGS = new Set([
  "is-online-mba-valid-ugc-equivalence",
  "abc-id-deb-id-guide-nmims-cdoe",
  "nmims-online-mba-fees-emi-guide",
]);

// Checks every internal link actually used on the site (footer/header nav)
// against the real set of routes that exist — no network calls, so it can't
// hang, time out, or put load on the database or the site itself.
export const checkBrokenLinksFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");

  const [navItems, posts] = await Promise.all([
    db.select().from(navigationItems),
    db.select({ slug: blogPosts.slug }).from(blogPosts).where(eq(blogPosts.status, "published")),
  ]);

  const publishedSlugs = new Set(posts.map((p) => p.slug));

  function isValid(path: string) {
    if (KNOWN_STATIC_ROUTES.has(path)) return true;
    const blogMatch = path.match(/^\/blog\/([^/]+)$/);
    if (blogMatch) return HAND_CODED_BLOG_SLUGS.has(blogMatch[1]) || publishedSlugs.has(blogMatch[1]);
    return false;
  }

  const internalLinks = navItems.filter((n) => n.url.startsWith("/"));
  const broken = internalLinks.filter((n) => !isValid(n.url));

  return broken.map((n) => ({ path: n.url, label: n.label, location: n.location }));
});
