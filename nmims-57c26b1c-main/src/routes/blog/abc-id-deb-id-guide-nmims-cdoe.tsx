import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Calendar, Clock, IdCard, CheckCircle2, ChevronDown,
  Phone, MessageCircle, Mail, Award, AlertTriangle, Users, Smartphone, FileCheck,
} from "lucide-react";
import {
  Header, Footer, FloatingWA, MobileCTABar, telLink, waLink,
} from "@/components/layout/SiteChrome";

export const Route = createFileRoute("/blog/abc-id-deb-id-guide-nmims-cdoe")({
  head: () => ({
    meta: [
      { title: "How to Create Your ABC ID and DEB ID for NMIMS CDOE Admission (2026 Guide)" },
      { name: "description", content: "Step-by-step guide to creating your Academic Bank of Credits (ABC) ID via DigiLocker and your DEB ID at deb.ugc.ac.in - both mandatory before you can submit an NMIMS CDOE online degree application." },
      { property: "og:title", content: "ABC ID & DEB ID Guide for NMIMS CDOE Admission" },
      { property: "og:description", content: "How to create your ABC ID via DigiLocker and your DEB ID at deb.ugc.ac.in before applying for an NMIMS CDOE online degree." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/blog/abc-id-deb-id-guide-nmims-cdoe" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blog/abc-id-deb-id-guide-nmims-cdoe" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
            { "@type": "ListItem", position: 3, name: "ABC ID and DEB ID Guide", item: "/blog/abc-id-deb-id-guide-nmims-cdoe" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: "How to Create Your ABC ID and DEB ID for NMIMS CDOE Admission (2026 Guide)",
          description: "Step-by-step guide to creating your ABC ID via DigiLocker and your DEB ID at deb.ugc.ac.in before applying for an NMIMS CDOE online degree.",
          datePublished: "2026-07-15",
          dateModified: "2026-07-15",
          author: { "@type": "Organization", name: "NMIMS Online Counselling Team" },
          publisher: { "@type": "Organization", name: "NMIMS Online" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to create an ABC ID via DigiLocker",
          step: abcSteps.map((s) => ({ "@type": "HowToStep", name: s.t, text: s.d })),
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

const abcSteps = [
  { t: "Log in to DigiLocker", d: "Go to digilocker.gov.in and sign in with your mobile number or Aadhaar number, then verify with the OTP sent to your registered mobile." },
  { t: "Search for the ABC document", d: "Inside DigiLocker, go to Search Documents and type \"Academic Bank of Credits (ABC Card)\"." },
  { t: "Fill in your details", d: "Enter your name, date of birth, identity value (as per Aadhaar) and institution name exactly as they appear on your academic records, then select Get Document." },
  { t: "Find your ABC ID", d: "Your ABC ID now appears under Issued Documents in DigiLocker - a 12-digit unique ID linking your academic credits across institutions." },
];

const debSteps = [
  { t: "Keep your ABC ID ready", d: "A DEB ID cannot be created without an existing ABC ID, so complete that step first." },
  { t: "Visit the DEB portal", d: "Go to deb.ugc.ac.in and open the student registration section." },
  { t: "Register using your ABC ID", d: "Complete the registration using your ABC ID and basic personal/academic details as prompted." },
  { t: "Receive your DEB ID", d: "Once verified, you receive a DEB ID (Distance Education Bureau Identification) confirming you're enrolling in a UGC-DEB recognised ODL/online programme." },
];

const faqItems = [
  { q: "Do I need both an ABC ID and a DEB ID for NMIMS CDOE admission?", a: "Yes. Both are mandatory before an application can be submitted for any UGC-DEB recognised online or ODL programme, including NMIMS CDOE's. The ABC ID must be created first, since the DEB ID registration requires it." },
  { q: "Is there a fee to create an ABC ID or DEB ID?", a: "No. Both the ABC ID (via DigiLocker) and the DEB ID (via deb.ugc.ac.in) are free government services. You should never need to pay anyone to create either ID for you." },
  { q: "How long does it take to create an ABC ID?", a: "Typically under 10 minutes if your Aadhaar and mobile number are already linked and you have your academic institution details on hand." },
  { q: "What happens if my name on the ABC ID doesn't match my academic certificates?", a: "Mismatches between your ABC ID details and your academic documents are one of the most common causes of admission delays. Double-check spelling, date of birth and institution name before submitting, and correct any discrepancy before you apply." },
  { q: "Is the DEB ID the same as a university enrolment number?", a: "No. The DEB ID is a UGC-level identifier confirming you're enrolling in a recognised ODL/online programme. Your university (NMIMS CDOE) will separately issue its own student/enrolment number once your admission is confirmed." },
  { q: "Can I create my ABC ID and DEB ID myself, or does NMIMS CDOE do it for me?", a: "You create both yourself, since they require your personal Aadhaar-linked DigiLocker login. As your counselling partner, we can guide you through each screen, but the IDs are tied to your own identity and cannot be generated on your behalf." },
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
            Before you can submit an NMIMS CDOE admission form, you need two free government-issued IDs: an Academic Bank of Credits (ABC) ID, created via DigiLocker using your Aadhaar, and a DEB ID (Distance Education Bureau Identification), created at deb.ugc.ac.in using that ABC ID. Create the ABC ID first - the DEB ID cannot be generated without it - and budget about 15-20 minutes for both.
          </AnswerBox>

          <div className="prose-content mt-10 space-y-6 text-muted-foreground">
            <h2 className="text-xl font-extrabold text-foreground">Why these two IDs exist</h2>
            <p>
              Under UGC rules, every learner in an Open, Distance Learning or Online programme must be uniquely identifiable and traceable to a UGC-DEB recognised institution before their admission form can be accepted. The Academic Bank of Credits (ABC) ID stores and links a student's academic credits across institutions over their lifetime. The DEB ID confirms that a specific enrolment is happening against a UGC-DEB recognised programme. Together, they're the university-agnostic layer that sits underneath every online degree admission in India - not something specific to NMIMS CDOE, but required by every UGC-DEB entitled programme.
            </p>

            <h2 className="text-xl font-extrabold text-foreground">Step 1: Create your ABC ID via DigiLocker</h2>
          </div>

          <ol className="mt-6 space-y-3">
            {abcSteps.map((s, i) => (
              <li key={s.t} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">{i + 1}</span>
                <div>
                  <p className="text-sm font-bold text-foreground">{s.t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="prose-content mt-8 space-y-6 text-muted-foreground">
            <p className="flex gap-2 rounded-2xl bg-surface-soft p-4 text-xs">
              <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Alternative route: you can also generate your ABC ID directly at abc.gov.in via My Account &rarr; Student Login, signing in with your DigiLocker credentials and selecting Generate ABC ID.
            </p>

            <h2 className="text-xl font-extrabold text-foreground">Step 2: Create your DEB ID</h2>
          </div>

          <ol className="mt-6 space-y-3">
            {debSteps.map((s, i) => (
              <li key={s.t} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">{i + 1}</span>
                <div>
                  <p className="text-sm font-bold text-foreground">{s.t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex gap-3 rounded-2xl border border-amber-300/40 bg-amber-50 p-5 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>The single most common admission delay we see is a mismatch between the name, date of birth or institution name entered on the ABC ID and what appears on official academic certificates. Complete both IDs a few days before your intended application date, not the night before.</p>
          </div>

          <div className="prose-content mt-8 space-y-4 text-muted-foreground">
            <h2 className="text-xl font-extrabold text-foreground">What happens after you have both IDs</h2>
            <p className="flex gap-2"><FileCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> With your ABC ID and DEB ID ready, you can proceed to the NMIMS CDOE admission form at online.nmims.edu, upload your academic and KYC documents, and pay the applicable fee - the same 4-step process we walk through on each programme page.</p>
          </div>

          <FAQ open={open} setOpen={setOpen} />
          <AuthorBox />
        </article>

        <PostCTA />
      </main>
      <Footer />
      <FloatingWA message="Hi, I need help creating my ABC ID / DEB ID for NMIMS CDOE admission." />
      <MobileCTABar message="Hi, I need help creating my ABC ID / DEB ID for NMIMS CDOE admission." />
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
          <IdCard className="h-3.5 w-3.5 text-[#fca5a5]" /> Admission Process
        </span>
        <h1 className="mt-5 font-serif text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
          How to Create Your ABC ID and DEB ID for NMIMS CDOE Admission (2026 Guide)
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/70">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> 15 Jul 2026</span>
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
          We're an Authorized NMIMS CDOE Enquiry Partner (AEP) - an independent counselling business, not NMIMS University or NMIMS CDOE itself. Portal steps and screens are set by DigiLocker and the UGC's DEB portal and may change - always follow the current on-screen instructions.
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
          Stuck on your ABC ID or DEB ID?
        </h2>
        <p className="relative mx-auto mt-3 max-w-lg text-sm text-white/85">
          Our counsellors walk students through this every week - get free, step-by-step help.
        </p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <a href={telLink} className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#dc2626)] px-6 py-3 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <a href={waLink("Hi, I need help creating my ABC ID / DEB ID for NMIMS CDOE admission.")} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </a>
          <a href="/about#enquire" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/15">
            <Mail className="h-4 w-4" /> Request a Callback <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
