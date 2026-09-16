// Shared helpers for the sitemap route family (sitemap.xml index +
// page-sitemap.xml / post-sitemap.xml), so the URL-building and escaping
// logic isn't duplicated across each route file.
export const SITE_URL = "https://cdoe.info";

const PROGRAM_SLUGS = new Set([
  "online-mba",
  "online-bba",
  "online-bcom",
  "online-diploma",
  "online-certificate",
]);

export function pageUrl(slug: string, type: string) {
  if (slug === "home") return "/";
  if (type === "page" && PROGRAM_SLUGS.has(slug)) return `/programs/${slug}`;
  return `/${slug}`;
}

export function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function isoDate(value: Date | string | null | undefined) {
  return (value ? new Date(value) : new Date()).toISOString();
}
