import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { getPageFn } from "@/backend/pages/actions";
import { buildSeoHead } from "@/lib/seo-head";

const FALLBACK_SEO = {
  slug: "disclaimer",
  title: "Disclaimer",
  content: { body: "" } as Record<string, unknown>,
  metaTitle: "Disclaimer | RH Academy - NMIMS CDOE Enquiry Partner",
  metaDescription: "Our relationship to NMIMS CDOE and the limits of the information provided on this site.",
  canonicalUrl: "/disclaimer",
  ogImage: null as string | null,
  status: "published" as const,
};

export const Route = createFileRoute("/disclaimer")({
  loader: async () => (await getPageFn({ data: { slug: "disclaimer" } })) ?? FALLBACK_SEO,
  head: ({ loaderData }) => {
    const seo = loaderData ?? FALLBACK_SEO;
    return buildSeoHead(
      { ...seo, robotsIndex: "robotsIndex" in seo ? seo.robotsIndex : false },
      { title: FALLBACK_SEO.metaTitle, description: FALLBACK_SEO.metaDescription, canonicalUrl: FALLBACK_SEO.canonicalUrl },
    );
  },
  component: DisclaimerPage,
});

function DisclaimerPage() {
  const page = Route.useLoaderData();
  return <LegalPage page={page ?? FALLBACK_SEO} />;
}
