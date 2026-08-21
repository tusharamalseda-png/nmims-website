// Shared head-tag builder so page-level SEO fields (robots, OG/Twitter
// overrides, canonical) actually reach the live HTML from a single place,
// instead of every route hand-rolling near-identical meta arrays.
export type SeoRow = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  twitterCardType?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  robotsIndex?: boolean | null;
  robotsFollow?: boolean | null;
};

export type SeoFallback = {
  title: string;
  description: string;
  canonicalUrl: string;
};

export function buildSeoHead(seo: SeoRow | null | undefined, fallback: SeoFallback) {
  const title = seo?.metaTitle ?? fallback.title;
  const description = seo?.metaDescription ?? fallback.description;
  const canonical = seo?.canonicalUrl ?? fallback.canonicalUrl;
  const ogTitle = seo?.ogTitle ?? title;
  const ogDescription = seo?.ogDescription ?? description;
  const twitterTitle = seo?.twitterTitle ?? ogTitle;
  const twitterDescription = seo?.twitterDescription ?? ogDescription;
  const twitterImage = seo?.twitterImage ?? seo?.ogImage ?? undefined;
  const robotsIndex = seo?.robotsIndex ?? true;
  const robotsFollow = seo?.robotsFollow ?? true;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: `${robotsIndex ? "index" : "noindex"}, ${robotsFollow ? "follow" : "nofollow"}` },
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      ...(seo?.ogImage ? [{ property: "og:image", content: seo.ogImage }] : []),
      { name: "twitter:card", content: seo?.twitterCardType ?? "summary_large_image" },
      { name: "twitter:title", content: twitterTitle },
      { name: "twitter:description", content: twitterDescription },
      ...(twitterImage ? [{ name: "twitter:image", content: twitterImage }] : []),
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}
