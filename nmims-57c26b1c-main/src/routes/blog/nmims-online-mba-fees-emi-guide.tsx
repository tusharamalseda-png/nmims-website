import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Calendar, Clock, Wallet, CheckCircle2, ChevronDown,
  Phone, MessageCircle, Mail, Award, Users, ShieldCheck,
} from "lucide-react";
import {
  Header, Footer, FloatingWA, MobileCTABar, telLink, waLink,
} from "@/components/layout/SiteChrome";
import { getBlogPostFn } from "@/backend/blog/actions";
import { buildSeoHead } from "@/lib/seo-head";

const FALLBACK_SEO = {
  metaTitle: "NMIMS CDOE Online MBA Fees & EMI Options Explained (2026)",
  metaDescription: "The complete NMIMS Online MBA fee breakdown for 2026 - annual vs semester-wise payment, admission processing and exam fees, EMI banks, and the defence personnel concession, with no hidden costs.",
};

export const Route = createFileRoute("/blog/nmims-online-mba-fees-emi-guide")({
  loader: async () => (await getBlogPostFn({ data: { slug: "nmims-online-mba-fees-emi-guide" } })) ?? FALLBACK_SEO,
  head: ({ loaderData }) => {
    const seo = loaderData ?? FALLBACK_SEO;
    const { meta, links } = buildSeoHead(
      "featuredImage" in seo ? { ...seo, ogImage: seo.featuredImage } : seo,
      { title: FALLBACK_SEO.metaTitle, description: FALLBACK_SEO.metaDescription, canonicalUrl: "/blog/nmims-online-mba-fees-emi-guide" },
    );
    return {
    meta,
    links,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
            { "@type": "ListItem", position: 3, name: "NMIMS Online MBA Fees & EMI Guide", item: "/blog/nmims-online-mba-fees-emi-guide" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: "NMIMS CDOE Online MBA Fees & EMI Options Explained (2026)",
          description: "Annual vs semester-wise fees, hidden costs, EMI options and the defence concession for the NMIMS CDOE Online MBA.",
          datePublished: "2026-07-18",
          dateModified: "2026-07-18",
          author: { "@type": "Organization", name: "NMIMS Online Counselling Team" },
          publisher: { "@type": "Organization", name: "NMIMS Online" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
    };
  },
  component: PostPage,
});

const hiddenCosts = [
  ["Admission processing fee", "₹1,200 (one-time, all admissions)"],
  ["Initial registration amount", "₹10,000 (collected at registration, adjusted against total fee)"],
  ["Exam fee", "₹800 per subject, per attempt"],
  ["Re-attempt/backlog exam fee", "₹800 per subject, per attempt (same as regular exam fee)"],
];

const comparisonRows = [
  ["Online MBA", "₹1,05,000 / yr", "₹55,000 / sem", "₹1,96,000"],
  ["Online BBA (Marketing/Finance)", "₹47,000 / yr", "₹25,000 / sem", "₹1,31,000"],
  ["Online BBA (Business Analytics)", "₹56,400 / yr", "₹30,000 / sem", "₹1,45,000"],
  ["Online B.Com", "₹33,000 / yr", "₹18,000 / sem", "₹94,000"],
];

const emiBanks = ["HDFC Bank", "ICICI Bank", "Axis Bank", "Citibank", "Standard Chartered", "HSBC", "Kotak Mahindra Bank"];

const faqItems = [
  { q: "Is EMI available without a credit card?", a: "Yes. Alongside card-based EMI (3, 6, 9 or 12 months) via the banks listed above, a loan facility is also available for students who don't hold a credit card - ask your counsellor for current terms." },
  { q: "Are there any scholarships for the NMIMS Online MBA?", a: "Currently, no scholarships or fee concessions are available for the general category. The only standing concession is 20% off the programme fee for defence and paramilitary personnel and their immediate family." },
  { q: "What's the difference between the annual and semester-wise payment options?", a: "Annual payment (₹1,05,000/year) is billed as 2 instalments across the 2-year programme. Semester-wise payment (₹55,000/semester) splits the same total cost across 4 instalments, one per semester - useful if you'd rather spread cash flow more finely. There's no fee saving either way; it's purely about instalment size and frequency." },
  { q: "What is the cheapest way to pay - full pay-in-full, annual, or semester-wise?", a: "Paying in full upfront (₹1,96,000) is the same total cost as paying annually or semester-wise for the standard track; NMIMS CDOE does not currently offer an early-payment discount on the MBA fee. Choose based on your cash flow, not on trying to save money by paying earlier." },
  { q: "Do fees ever change after I've enrolled?", a: "The fee structure is set by NMIMS CDOE and is subject to change at the University's discretion for future intakes; once you're enrolled at a given fee structure, always reconfirm your specific instalment schedule with your counsellor rather than assuming it matches a later intake's published rate." },
];

function PostPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <PostHeader />

        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <AnswerBox>
            The NMIMS CDOE Online MBA costs ₹1,05,000/year or ₹55,000/semester (₹1,96,000 pay-in-full for the full 2-year programme), plus a one-time ₹1,200 admission processing fee and ₹800 per subject exam fee. No-cost EMI is available over 3, 6, 9 or 12 months via seven major banks, and defence personnel and their families get a 20% fee concession.
          </AnswerBox>

          <div className="prose-content mt-10 space-y-6 text-muted-foreground">
            <h2 className="text-xl font-extrabold text-foreground">The headline fee, two ways to pay it</h2>
            <p>
              The Online MBA's total programme fee is the same regardless of how you split it - what changes is instalment size and frequency:
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Annual</p>
              <p className="mt-2 text-2xl font-extrabold text-foreground">₹1,05,000</p>
              <p className="text-xs text-muted-foreground">per year &middot; 2 instalments</p>
            </div>
            <div className="rounded-2xl border-2 border-primary bg-secondary p-5 text-center shadow-card">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Semester-wise</p>
              <p className="mt-2 text-2xl font-extrabold text-foreground">₹55,000</p>
              <p className="text-xs text-muted-foreground">per semester &middot; 4 instalments</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Pay-in-Full</p>
              <p className="mt-2 text-2xl font-extrabold text-foreground">₹1,96,000</p>
              <p className="text-xs text-muted-foreground">one payment &middot; whole programme</p>
            </div>
          </div>

          <div className="prose-content mt-8 space-y-6 text-muted-foreground">
            <h2 className="text-xl font-extrabold text-foreground">The costs people miss - budget for these too</h2>
            <p>Beyond the headline programme fee, a few smaller charges apply across the programme. None of these are hidden by NMIMS CDOE, but they're easy to miss when comparing fees across universities:</p>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-border shadow-card">
            <table className="w-full min-w-[420px] text-sm">
              <tbody>
                {hiddenCosts.map(([k, v]) => (
                  <tr key={k} className="border-b border-border bg-card last:border-0">
                    <td className="px-5 py-3.5 font-semibold text-foreground">{k}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8 space-y-6 text-muted-foreground">
            <h2 className="text-xl font-extrabold text-foreground">EMI and no-credit-card options</h2>
            <p>
              EMI over 3, 6, 9 or 12 months is available via credit cards from the following banks. If you don't hold a credit card, a separate loan facility is also available - speak to your counsellor for current terms, as bank tie-ups and rates can change.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {emiBanks.map((b) => (
              <span key={b} className="rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-foreground shadow-card">{b}</span>
            ))}
          </div>

          <div className="mt-8 flex gap-3 rounded-2xl border border-primary/30 bg-secondary p-5 text-sm text-foreground">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p><strong className="font-bold">Defence concession:</strong> Indian Army, Navy and Air Force personnel and their immediate family receive a 20% concession on the programme fee. Currently, no scholarships or concessions are available for the general category - we'd rather tell you that plainly than have you find out later.</p>
          </div>

          <div className="prose-content mt-10 space-y-4 text-muted-foreground">
            <h2 className="text-xl font-extrabold text-foreground">How the MBA fee compares to BBA and B.Com</h2>
            <p>If you're weighing the MBA against an undergraduate route, here's how the numbers stack up:</p>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-border shadow-card">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-soft">
                  <th className="px-5 py-3.5 text-left font-bold text-foreground">Programme</th>
                  <th className="px-5 py-3.5 text-left font-bold text-primary">Annual</th>
                  <th className="px-5 py-3.5 text-left font-bold text-primary">Semester-wise</th>
                  <th className="px-5 py-3.5 text-left font-bold text-primary">Full Pay-in-Full</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([program, annual, sem, full]) => (
                  <tr key={program} className="border-b border-border bg-card last:border-0">
                    <td className="px-5 py-3.5 font-semibold text-foreground">{program}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{annual}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{sem}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{full}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Figures shown are for the core/base track of each programme; always reconfirm current figures with your counsellor before enrolling, as fees are subject to change at the University's discretion.</p>

          <FAQ open={open} setOpen={setOpen} />
          <AuthorBox />
        </article>

        <PostCTA />
      </main>
      <Footer />
      <FloatingWA message="Hi, I read your blog post on MBA fees and have a question about EMI options." />
      <MobileCTABar message="Hi, I read your blog post on MBA fees and have a question about EMI options." />
    </div>
  );
}

/* ---------- SHARED BLOG PARTS ---------- */
function PostHeader() {
  return (
    <header className="relative overflow-hidden bg-[linear-gradient(135deg,#1f1b2e_0%,#2a2440_55%,#3a2f55_100%)] py-14 sm:py-20">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#ef4444]/20 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 text-white sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide backdrop-blur ring-1 ring-white/20">
          <Wallet className="h-3.5 w-3.5 text-[#fca5a5]" /> Fees & EMI
        </span>
        <h1 className="mt-5 font-serif text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
          NMIMS CDOE Online MBA Fees & EMI Options Explained (2026)
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/70">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> 18 Jul 2026</span>
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 6 min read</span>
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Reviewed by NMIMS Online Counselling Team</span>
        </div>
      </div>
    </header>
  );
}

function AnswerBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-primary/25 bg-secondary p-6 text-sm font-medium leading-relaxed text-foreground shadow-card">
      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
        <CheckCircle2 className="h-4 w-4" /> Short Answer
      </p>
      {children}
    </div>
  );
}

function FAQ({ open, setOpen }: { open: number | null; setOpen: (i: number | null) => void }) {
  return (
    <div className="mt-14" id="faq">
      <h2 className="text-xl font-extrabold text-foreground">Frequently Asked Questions</h2>
      <div className="mt-6 space-y-3">
        {faqItems.map((it, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
              aria-expanded={open === i}
            >
              <span className="text-sm font-bold text-foreground">{it.q}</span>
              <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <motion.div
              initial={false}
              animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{it.a}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuthorBox() {
  return (
    <div className="mt-12 flex items-start gap-4 rounded-2xl border border-border bg-surface-soft p-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-primary">
        <Award className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-bold text-foreground">Reviewed by the NMIMS Online Counselling Team</p>
        <p className="mt-1 text-xs text-muted-foreground">
          We're an Authorized NMIMS CDOE Enquiry Partner (AEP) - an independent counselling business, not NMIMS University or NMIMS CDOE itself. All figures above are from the official NMIMS CDOE fee schedule and are subject to change at the University's discretion; always reconfirm current figures with your counsellor before enrolling.
        </p>
      </div>
    </div>
  );
}

function PostCTA() {
  return (
    <section className="bg-surface-soft px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#1f1b2e_0%,#2a2440_55%,#3a2f55_100%)] p-8 text-center shadow-elegant sm:p-12">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[color:var(--gold)]/25 blur-3xl" />
        <h2 className="relative font-serif text-2xl font-extrabold leading-tight text-white sm:text-3xl">
          Want a fee breakdown for your exact situation?
        </h2>
        <p className="relative mx-auto mt-3 max-w-lg text-sm text-white/85">
          Talk to a counsellor about EMI plans, the defence concession, or how MBA fees compare to BBA and B.Com - free of cost.
        </p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <a href={telLink} className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#dc2626)] px-6 py-3 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <a href={waLink("Hi, I read your blog post on MBA fees and would like to know more about EMI options.")} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </a>
          <a href="/programs/online-mba" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/15">
            <Mail className="h-4 w-4" /> Explore Online MBA <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
