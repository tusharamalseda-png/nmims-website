import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Calendar, Clock, ShieldCheck, CheckCircle2, ChevronDown,
  Phone, MessageCircle, Mail, Award, FileCheck, AlertTriangle, Users,
} from "lucide-react";
import {
  Header, Footer, FloatingWA, MobileCTABar, telLink, waLink,
} from "@/components/layout/SiteChrome";

export const Route = createFileRoute("/blog/is-online-mba-valid-ugc-equivalence")({
  head: () => ({
    meta: [
      { title: "Is an Online MBA Valid in India? UGC Equivalence Rules Explained (2026)" },
      { name: "description", content: "UGC Regulation 22 treats degrees earned through Open, Distance and Online mode as equivalent to conventional-mode degrees. Here's what that means for an NMIMS CDOE Online MBA, and how to verify any online degree before enrolling." },
      { property: "og:title", content: "Is an Online MBA Valid in India? UGC Equivalence Rules Explained" },
      { property: "og:description", content: "What UGC Regulation 22 says about online degree equivalence, and how to verify an online MBA is genuinely valid before you enrol." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/blog/is-online-mba-valid-ugc-equivalence" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blog/is-online-mba-valid-ugc-equivalence" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
            { "@type": "ListItem", position: 3, name: "Is an Online MBA Valid in India?", item: "/blog/is-online-mba-valid-ugc-equivalence" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: "Is an Online MBA Valid in India? UGC Equivalence Rules Explained (2026)",
          description: "What UGC Regulation 22 says about online degree equivalence, and how to verify an online MBA is genuinely valid before you enrol.",
          datePublished: "2026-07-12",
          dateModified: "2026-07-12",
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
  }),
  component: PostPage,
});

const checklist = [
  { t: "UGC-DEB Entitlement", d: "The specific programme (not just the university) must appear on the UGC-DEB list of entitled institutions for the year you're applying." },
  { t: "NAAC Accreditation", d: "A NAAC A+ or A++ grade signals institutional quality, though it's separate from UGC-DEB programme entitlement." },
  { t: "AIU Recognition", d: "Association of Indian Universities recognition matters if you plan further studies or roles requiring degree equivalence certificates." },
  { t: "Regulation 22 Coverage", d: "Confirm the degree falls under the UGC ODL/Online Regulations, 2020 - this is what makes the equivalence claim legally sound, not just marketing language." },
];

const faqItems = [
  { q: "Will an online MBA be accepted for government job eligibility?", a: "If the degree is from a UGC-DEB entitled programme covered under Regulation 22, it is treated as equivalent to a conventional-mode degree for eligibility purposes. Always check the specific recruitment notification, since some government exams set their own additional criteria beyond degree equivalence." },
  { q: "Is an online MBA the same as a distance-learning MBA?", a: "Both fall under the UGC's ODL and Online Programmes Regulations, 2020, and both receive the same equivalence treatment under Regulation 22 when UGC-DEB entitled. The practical difference is delivery: online programmes are typically more tech-enabled with live virtual classes, while distance/ODL programmes have historically leaned on printed study material and periodic contact classes." },
  { q: "Does NAAC accreditation matter more than UGC-DEB entitlement?", a: "They answer different questions. NAAC accreditation grades the university's overall institutional quality. UGC-DEB entitlement is what specifically permits that university to offer a given programme in online/ODL mode. For a valid online degree, you need the programme itself to be UGC-DEB entitled - a high NAAC grade alone doesn't substitute for that." },
  { q: "Is NMIMS CDOE's Online MBA UGC-DEB entitled?", a: "Yes. NMIMS CDOE's online programmes are offered under UGC-DEB entitlement, and NMIMS itself holds a NAAC A++ accreditation and AIU recognition." },
  { q: "Can I verify a degree's UGC-DEB status myself before enrolling?", a: "Yes. The UGC-DEB list of entitled higher educational institutions and programmes is published publicly for each academic year - cross-check the specific university and specific programme (not just the university's name) before you enrol anywhere." },
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
            Yes. Under Regulation 22 of the UGC (Open and Distance Learning Programmes and Online Programmes) Regulations, 2020 - reaffirmed in a UGC public notice dated August 2022 - degrees earned through UGC-DEB entitled Open, Distance or Online mode are treated as equivalent to the corresponding degrees awarded through conventional, on-campus mode. An NMIMS CDOE Online MBA, being UGC-DEB entitled, carries this same equivalence.
          </AnswerBox>

          <div className="prose-content mt-10 space-y-6 text-muted-foreground">
            <h2 className="text-xl font-extrabold text-foreground">What Regulation 22 actually says</h2>
            <p>
              In August 2022, the UGC issued a public notice (F.No.3-5/2022(DEB-III)) reproducing Regulation 22 of the UGC (Open and Distance Learning Programmes and Online Programmes) Regulations, 2020, titled "Equivalence of qualification acquired through Conventional or Open and Distance Learning and Online modes." The regulation states, in the UGC's own words:
            </p>
            <blockquote className="rounded-2xl border-l-4 border-primary bg-surface-soft p-5 text-sm italic text-foreground">
              "Degrees at undergraduate and postgraduate level in conformity with UGC notification on Specification of Degrees, 2014 and, post graduate diplomas awarded through Open and Distance Learning mode and/or Online mode by Higher Educational Institutions, recognised by the Commission under these regulations, shall be treated as equivalent to the corresponding awards of the Degrees at undergraduate and postgraduate level and post graduate diplomas offered through conventional mode."
            </blockquote>
            <p>
              In plain terms: if a university's online or distance programme is properly recognised by the UGC under these regulations (i.e., UGC-DEB entitled), the degree it awards carries the same legal standing as the same degree earned on-campus. This isn't an interpretation or a marketing claim - it's the regulator's own published position, applicable to the general public and all stakeholders.
            </p>

            <h2 className="text-xl font-extrabold text-foreground">What this means in practice</h2>
            <p>
              Legal equivalence is necessary but not, by itself, the whole picture. A few things worth knowing before you rely on this for a specific decision:
            </p>
            <ul className="space-y-2">
              <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" /> For eligibility purposes (further education, government exams that accept the degree category, promotion criteria that specify "MBA/PGDM"), a UGC-DEB entitled online MBA satisfies the requirement the same way an on-campus MBA does.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" /> Individual employers may still have their own hiring preferences based on institution brand, specialisation fit or interview performance - equivalence covers legal recognition, not a guarantee of identical hiring outcomes.</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" /> Some specific government recruitment notifications add their own extra conditions beyond "UGC-recognised degree" - always read the specific notification you're applying against.</li>
            </ul>

            <h2 className="text-xl font-extrabold text-foreground">Is NMIMS CDOE's Online MBA covered by this?</h2>
            <p>
              Yes. NMIMS CDOE's online programmes, including the Online MBA, are UGC-DEB entitled, and NMIMS holds NAAC A++ accreditation and AIU recognition. That combination is exactly what Regulation 22 requires for the equivalence treatment to apply.
            </p>

            <h2 className="text-xl font-extrabold text-foreground">A quick checklist before enrolling in any online degree</h2>
            <p>Not every "online MBA" advertised online meets this bar. Before enrolling anywhere, verify:</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {checklist.map(({ t, d }) => (
              <div key={t} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <p className="flex items-center gap-2 text-sm font-bold text-foreground"><FileCheck className="h-4 w-4 text-primary" /> {t}</p>
                <p className="mt-2 text-xs text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3 rounded-2xl border border-amber-300/40 bg-amber-50 p-5 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>Always check UGC-DEB status for the specific programme and academic year you're applying to, not just the university's general reputation - entitlement is reviewed and can change year to year.</p>
          </div>

          <FAQ open={open} setOpen={setOpen} />
          <AuthorBox />
        </article>

        <PostCTA />
      </main>
      <Footer />
      <FloatingWA message="Hi, I read your blog post on online MBA validity and have a question." />
      <MobileCTABar message="Hi, I read your blog post on online MBA validity and have a question." />
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
          <ShieldCheck className="h-3.5 w-3.5 text-[#fca5a5]" /> Eligibility & Recognition
        </span>
        <h1 className="mt-5 font-serif text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
          Is an Online MBA Valid in India? UGC Equivalence Rules Explained (2026)
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/70">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> 12 Jul 2026</span>
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 7 min read</span>
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
          We're an Authorized NMIMS CDOE Enquiry Partner (AEP) - an independent counselling business, not NMIMS University or NMIMS CDOE itself. This guide is written from official UGC and NMIMS CDOE sources; always confirm current entitlement status with your counsellor before enrolling anywhere.
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
          Want it confirmed for your specific case?
        </h2>
        <p className="relative mx-auto mt-3 max-w-lg text-sm text-white/85">
          Talk to a counsellor about the NMIMS Online MBA's UGC-DEB status, eligibility and fees - free of cost.
        </p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <a href={telLink} className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#dc2626)] px-6 py-3 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <a href={waLink("Hi, I read your blog post on online MBA validity and would like to know more.")} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
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
