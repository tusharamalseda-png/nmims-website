import { createFileRoute, notFound } from "@tanstack/react-router";
import { Calendar, ArrowRight } from "lucide-react";
import { getBlogPostFn } from "@/backend/blog/actions";
import { Header, Footer, FloatingWA, MobileCTABar } from "@/components/layout/SiteChrome";
import { buildSeoHead } from "@/lib/seo-head";
import { formatDate } from "@/lib/format-date";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getBlogPostFn({ data: { slug: params.slug } });
    const isScheduledForFuture = post?.scheduledFor && new Date(post.scheduledFor).getTime() > Date.now();
    if (!post || post.status !== "published" || isScheduledForFuture) throw notFound();
    return post;
  },
  head: ({ loaderData, params }) =>
    buildSeoHead(loaderData ? { ...loaderData, ogImage: loaderData.featuredImage } : null, {
      title: loaderData?.title ?? "Blog | NMIMS Online",
      description: loaderData?.excerpt ?? "",
      canonicalUrl: loaderData?.canonicalUrl ?? `/blog/${params.slug}`,
    }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <header className="relative overflow-hidden bg-[linear-gradient(135deg,#1f1b2e_0%,#2a2440_55%,#3a2f55_100%)] py-14 sm:py-20">
          <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#ef4444]/20 blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-4 text-white sm:px-6 lg:px-8">
            {post.category && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide backdrop-blur ring-1 ring-white/20">
                {post.category}
              </span>
            )}
            <h1 className="mt-5 font-serif text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
              {post.title}
            </h1>
            {post.publishedAt && (
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/70">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> {formatDate(post.publishedAt)}
                </span>
              </div>
            )}
          </div>
        </header>

        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {post.featuredImage && (
            <img src={post.featuredImage} alt={post.title} className="mb-8 w-full rounded-2xl object-cover" />
          )}
          <div className="prose-content space-y-4 text-muted-foreground">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </article>

        <section className="bg-surface-soft px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#1f1b2e_0%,#2a2440_55%,#3a2f55_100%)] p-8 text-center shadow-elegant sm:p-14">
            <h2 className="relative font-serif text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Still have a question this guide didn't answer?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/85">
              Talk to a real counsellor, free of cost - no pressure, no hidden fees.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="/about#enquire"
                className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#dc2626)] px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]"
              >
                Talk to a Counsellor <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWA message="Hi, I read a blog post on your site and have a question about NMIMS CDOE admissions." />
      <MobileCTABar message="Hi, I read a blog post on your site and have a question about NMIMS CDOE admissions." />
    </div>
  );
}
