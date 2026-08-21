import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { getPageFn } from "@/backend/pages/actions";
import { buildSeoHead } from "@/lib/seo-head";

const FALLBACK_SEO = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  content: { body: "" } as Record<string, unknown>,
  metaTitle: "Privacy Policy | RH Academy - NMIMS CDOE Enquiry Partner",
  metaDescription: "How RH Academy collects, uses and protects the personal information you share through cdoe.info.",
  canonicalUrl: "/privacy-policy",
  ogImage: null as string | null,
  status: "published" as const,
};

export const Route = createFileRoute("/privacy-policy")({
  loader: async () => (await getPageFn({ data: { slug: "privacy-policy" } })) ?? FALLBACK_SEO,
  head: ({ loaderData }) => {
    const seo = loaderData ?? FALLBACK_SEO;
    return buildSeoHead(
      { ...seo, robotsIndex: "robotsIndex" in seo ? seo.robotsIndex : false },
      { title: FALLBACK_SEO.metaTitle, description: FALLBACK_SEO.metaDescription, canonicalUrl: FALLBACK_SEO.canonicalUrl },
    );
  },
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const page = Route.useLoaderData();
  return <LegalPage page={page ?? FALLBACK_SEO} />;
}
