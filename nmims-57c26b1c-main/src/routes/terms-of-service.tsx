import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { getPageFn } from "@/backend/pages/actions";
import { buildSeoHead } from "@/lib/seo-head";

const FALLBACK_SEO = {
  slug: "terms-of-service",
  title: "Terms of Service",
  content: { body: "" } as Record<string, unknown>,
  metaTitle: "Terms of Service | RH Academy - NMIMS CDOE Enquiry Partner",
  metaDescription: "The terms governing your use of cdoe.info, operated by RH Academy.",
  canonicalUrl: "/terms-of-service",
  ogImage: null as string | null,
  status: "published" as const,
};

export const Route = createFileRoute("/terms-of-service")({
  loader: async () => (await getPageFn({ data: { slug: "terms-of-service" } })) ?? FALLBACK_SEO,
  head: ({ loaderData }) => {
    const seo = loaderData ?? FALLBACK_SEO;
    return buildSeoHead(
      { ...seo, robotsIndex: "robotsIndex" in seo ? seo.robotsIndex : false },
      { title: FALLBACK_SEO.metaTitle, description: FALLBACK_SEO.metaDescription, canonicalUrl: FALLBACK_SEO.canonicalUrl },
    );
  },
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  const page = Route.useLoaderData();
  return <LegalPage page={page ?? FALLBACK_SEO} />;
}
