import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { getPageFn } from "@/backend/pages/actions";
import { buildSeoHead } from "@/lib/seo-head";

const FALLBACK_SEO = {
  slug: "refund-policy",
  title: "Refund Policy",
  content: { body: "" } as Record<string, unknown>,
  metaTitle: "Refund Policy | RH Academy - NMIMS CDOE Enquiry Partner",
  metaDescription: "RH Academy does not collect tuition or admission fees - here's how refunds work for NMIMS CDOE programs.",
  canonicalUrl: "/refund-policy",
  ogImage: null as string | null,
  status: "published" as const,
};

export const Route = createFileRoute("/refund-policy")({
  loader: async () => (await getPageFn({ data: { slug: "refund-policy" } })) ?? FALLBACK_SEO,
  head: ({ loaderData }) => {
    const seo = loaderData ?? FALLBACK_SEO;
    return buildSeoHead(
      { ...seo, robotsIndex: "robotsIndex" in seo ? seo.robotsIndex : false },
      { title: FALLBACK_SEO.metaTitle, description: FALLBACK_SEO.metaDescription, canonicalUrl: FALLBACK_SEO.canonicalUrl },
    );
  },
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  const page = Route.useLoaderData();
  return <LegalPage page={page ?? FALLBACK_SEO} />;
}
