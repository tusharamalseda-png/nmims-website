import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, Calendar, ShieldCheck, IdCard, Wallet, BookOpen,
} from "lucide-react";
import {
  Header, Footer, FloatingWA, MobileCTABar,
} from "@/components/layout/SiteChrome";
import { listBlogPostsFn } from "@/backend/blog/actions";
import { formatDate } from "@/lib/format-date";

const CATEGORY_ICONS: Record<string, typeof ShieldCheck> = {
  "Eligibility & Recognition": ShieldCheck,
  "Admission Process": IdCard,
  "Fees & EMI": Wallet,
};

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    const all = await listBlogPostsFn();
    const now = Date.now();
    return all.filter((p) => p.status === "published" && (!p.scheduledFor || new Date(p.scheduledFor).getTime() <= now));
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: "NMIMS Online Blog | Admissions, Fees & Eligibility Guides for Gujarat Students" },
      { name: "description", content: "Clear, fact-checked guides on NMIMS CDOE online degree admissions - UGC validity, ABC ID & DEB ID setup, and fees & EMI options - written for students and working professionals across Gujarat." },
      { property: "og:title", content: "NMIMS Online Blog - Admission & Fees Guides" },
      { property: "og:description", content: "Fact-checked guides on NMIMS CDOE online degree admissions, UGC validity, ABC ID/DEB ID setup, and fees & EMI options." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/blog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "NMIMS Online Blog",
          description: "Admission, eligibility and fee guides for NMIMS CDOE's online degree programmes.",
          blogPost: (loaderData ?? []).map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.excerpt,
            datePublished: p.publishedAt,
            url: `/blog/${p.slug}`,
          })),
        }),
      },
    ],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const posts = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <PostGrid posts={posts} />
        <NeedHelp />
      </main>
      <Footer />
      <FloatingWA message="Hi, I read a blog post on your site and have a question about NMIMS CDOE admissions." />
      <MobileCTABar message="Hi, I read a blog post on your site and have a question about NMIMS CDOE admissions." />
    </div>
  );
}

/* ---------- POST GRID ---------- */
type BlogPostSummary = {
  slug: string;
  category: string | null;
  title: string;
  excerpt: string | null;
  publishedAt: Date | string | null;
};

function PostGrid({ posts }: { posts: BlogPostSummary[] }) {
  return (
    <>
      <IntroBanner />
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(({ slug, category, title, excerpt, publishedAt }, i) => {
            const Icon = (category && CATEGORY_ICONS[category]) || BookOpen;
            return (
              <motion.a
                key={slug}
                href={`/blog/${slug}`}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFDCE3] text-[#E63950]">
                  <Icon className="h-5 w-5" />
                </span>
                {category && (
                  <span className="mt-4 inline-block w-fit rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                    {category}
                  </span>
                )}
                <h3 className="mt-3 text-lg font-extrabold leading-snug text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{excerpt}</p>
                {publishedAt && (
                  <div className="mt-5 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(publishedAt)}</span>
                  </div>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary transition group-hover:gap-2">
                  Read Guide <ArrowRight className="h-4 w-4" />
                </span>
              </motion.a>
            );
          })}
        </div>
        </div>
      </section>
    </>
  );
}

/* ---------- INTRO BANNER ---------- */
function IntroBanner() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#1f1b2e_0%,#2a2440_55%,#3a2f55_100%)] py-14 sm:py-20">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#ef4444]/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#a855f7]/20 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90 backdrop-blur">
          <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#ef4444]" />
          Latest Guides
        </span>
        <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-white sm:text-[30px] lg:text-[34px]">Blogs</h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-white/80 sm:whitespace-nowrap">Three guides covering the questions we hear most often from students and parents.</p>
      </div>
    </section>
  );
}

/* ---------- NEED HELP ---------- */
function NeedHelp() {
  return (
    <section className="bg-surface-soft px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#1f1b2e_0%,#2a2440_55%,#3a2f55_100%)] p-8 text-center shadow-elegant sm:p-14">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-[color:var(--gold)]/25 blur-3xl" />
        <h2 className="relative font-serif text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Still have a question these guides didn't answer?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/85">
          Talk to a real counsellor, free of cost - no pressure, no hidden fees.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <a href="/about#enquire" className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#dc2626)] px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
            Talk to a Counsellor <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
