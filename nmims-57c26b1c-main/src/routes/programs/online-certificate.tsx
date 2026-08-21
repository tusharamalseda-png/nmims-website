import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, MessageCircle, GraduationCap, Briefcase, Clock, Award, BookOpen,
  Video, Headphones, ChevronDown, MapPin, Star, ArrowRight, CheckCircle2,
  Globe2, ShieldCheck, ClipboardCheck,
  FileEdit, FileCheck, CreditCard, Wallet, Smartphone, HelpCircle, CalendarCheck,
  Mail, Quote, Download, BookMarked, TrendingUp,
} from "lucide-react";
import { EnquiryForm } from "@/components/landing/EnquiryForm";
import { Counter } from "@/components/landing/Counter";
import {
  Header, Footer, FloatingWA, MobileCTABar, SectionTitle,
  telLink, waLink, CALENDLY_LINK,
} from "@/components/layout/SiteChrome";
import { Testimonials } from "@/components/site/Testimonials";
import { getPageFn } from "@/backend/pages/actions";
import { listFaqsForPageFn } from "@/backend/faqs/actions";
import { listTestimonialsFn } from "@/backend/testimonials/actions";
import { buildSeoHead } from "@/lib/seo-head";

const FALLBACK_SEO = {
  slug: "online-certificate",
  title: "Certificate Course",
  metaTitle: "NMIMS Certificate in Business Management 2026 | 6 Months | Fees & Admission",
  metaDescription: "UGC-entitled 6-month Certificate in Business Management from NMIMS CDOE - Business Communication, Financial Accounting, Marketing Management, Organisational Behaviour & more. Fee ₹55,000. Admissions open 2026.",
  canonicalUrl: "/programs/online-certificate",
  ogImage: null as string | null,
  status: "published" as const,
};

export const Route = createFileRoute("/programs/online-certificate")({
  loader: async () => {
    const [page, faqItems, testimonials] = await Promise.all([
      getPageFn({ data: { slug: "online-certificate" } }),
      listFaqsForPageFn({ data: { pageSlug: "online-certificate" } }),
      listTestimonialsFn({ data: { pageSlug: "online-certificate" } }),
    ]);
    return { seo: page ?? FALLBACK_SEO, faqItems, testimonials };
  },
  head: ({ loaderData }) => {
    const seo = loaderData?.seo ?? FALLBACK_SEO;
    const { meta, links } = buildSeoHead(seo, { title: FALLBACK_SEO.metaTitle, description: FALLBACK_SEO.metaDescription, canonicalUrl: FALLBACK_SEO.canonicalUrl });
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
            { "@type": "ListItem", position: 2, name: "Programs", item: "/programs" },
            { "@type": "ListItem", position: 3, name: "Certificate Course", item: "/programs/online-certificate" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOccupationalProgram",
          name: "Certificate in Business Management",
          description: "UGC-entitled 6-month Certificate in Business Management offered by NMIMS Centre for Distance and Online Education (CDOE), covering business communication, financial accounting, marketing management, economics and organisational behaviour.",
          provider: {
            "@type": "CollegeOrUniversity",
            name: "NMIMS Centre for Distance and Online Education (CDOE)",
          },
          educationalCredentialAwarded: "Certificate in Business Management",
          timeToComplete: "P6M",
          occupationalCategory: "Business Management",
          educationalProgramMode: "online",
          offers: {
            "@type": "Offer",
            price: "55000",
            priceCurrency: "INR",
            category: "Full program fee (excluding GST)",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (loaderData?.faqItems ?? []).map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
    };
  },
  component: OnlineCertificatePage,
});

const waMessage = "Hi, I'd like to know about the NMIMS Certificate in Business Management.";

const subjects = ["Business Communication", "Financial Accounting", "Marketing Management", "Micro & Macro Economics", "Organisational Behaviour", "Quantitative Methods – I"];

const outcomes = [
  { icon: Briefcase, t: "Business Development Manager", d: "Apply core business, marketing and communication skills in growth-focused roles." },
  { icon: TrendingUp, t: "Business Strategy Manager", d: "Build a foundation in business frameworks to support strategic decision-making." },
  { icon: BookOpen, t: "Understand Business Challenges", d: "Develop the ability to interpret business challenges using management principles." },
  { icon: CheckCircle2, t: "Apply Management Principles", d: "Implement strategies that enhance organisational performance in your current role." },
];


function OnlineCertificatePage() {
  const { testimonials } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header activeProgram="Certificate Course" />
      <main>
        <Hero />
        <TrustStats />
        <WhyChoose />
        <Curriculum />
        <LearningExperience />
        <Certificate />
        <CareerOutcomes />
        <Testimonials items={testimonials} />
        <Fees />
        <EligibilityAndStructure />
        <AdmissionProcess />
        <AboutCDOE />
        <FAQ />
        <NeedHelp />
      </main>
      <Footer />
      <FloatingWA message={waMessage} />
      <MobileCTABar message={waMessage} />
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const facts = [
    { label: "Duration", value: "6 Months" },
    { label: "Mode", value: "100% Online" },
    { label: "Program Fee", value: "₹55,000" },
    { label: "Eligibility", value: "HSC (10+2)" },
  ];
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#1f1b2e_0%,#2a2440_55%,#3a2f55_100%)]">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#ef4444]/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#a855f7]/20 blur-3xl" aria-hidden />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-[60px] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur ring-1 ring-white/20">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ef4444]" />
            UGC-Entitled · Admissions Open 2026
          </span>
          <h1 className="mt-5 font-serif text-3xl font-extrabold leading-[1.15] sm:text-4xl lg:text-[44px]">
            Certificate in Business Management from
            <span className="mt-1 block bg-[linear-gradient(135deg,#ef4444,#f97316)] bg-clip-text text-transparent">
              NMIMS University
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-base">
            Skill up and stand out in no time. A UGC-entitled, 6-month online certificate from NMIMS CDOE that builds a solid foundation in core business fundamentals - in a single semester.
          </p>

          <ul className="mt-6 grid max-w-lg gap-2.5 sm:grid-cols-2">
            {[
              { icon: Video, t: "Live Interactive Lectures" },
              { icon: ShieldCheck, t: "UGC-Entitled Credential" },
              { icon: Clock, t: "Just 1 Semester" },
              { icon: BookOpen, t: "Business Fundamentals" },
            ].map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-2.5 text-sm font-semibold text-white/95">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#ef4444]/20 ring-1 ring-[#ef4444]/40">
                  <Icon className="h-3.5 w-3.5 text-[#fca5a5]" />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-6 grid max-w-lg grid-cols-4 gap-2">
            {facts.map((f) => (
              <div key={f.label} className="rounded-xl border border-white/15 bg-white/[.06] px-2 py-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wide text-white/60">{f.label}</p>
                <p className="mt-1 text-xs font-extrabold text-white sm:text-sm">{f.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#enquire"
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ef4444,#dc2626)] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-10px_rgba(239,68,68,0.7)] transition hover:scale-[1.03]"
            >
              Apply Now <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={telLink}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/15"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto w-full max-w-[420px]"
        >
          <EnquiryForm compact />
        </motion.div>
      </div>

      <div className="relative border-t border-white/10 bg-black/20 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-xs font-semibold text-white/80 sm:gap-x-10 sm:text-sm">
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#fbbf24]" /> UGC-Entitled</span>
          <span className="flex items-center gap-2"><Award className="h-4 w-4 text-[#fbbf24]" /> NAAC A++ · NIRF Top 100</span>
          <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" /> Category 1 Autonomy</span>
          <span className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-[#fbbf24]" /> 200+ cities across India</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- TRUST STATS BAR ---------- */
function TrustStats() {
  const items = [
    { n: 150000, s: "+", l: "Students in ODL Mode" },
    { n: 750, s: "+", l: "Full-Time Faculty" },
    { n: 90, s: "+", l: "PhD Faculty" },
    { n: 8, s: "", l: "Campuses Across India" },
  ];
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(120deg,#7154EA,#3F3083)] py-16 text-white sm:py-24">
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-white opacity-10 blur-3xl" aria-hidden />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[color:var(--gold)] opacity-25 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map(({ n, s, l }) => (
          <div key={l} className="text-center">
            <p className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <Counter to={n} suffix={s} />
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/70 sm:text-sm">{l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- WHY CHOOSE ---------- */
function WhyChoose() {
  const items = [
    { icon: Clock, t: "Skill Up in No Time", d: "A focused 6-month certificate - build core business fundamentals without a long-term commitment." },
    { icon: Video, t: "Flexible Online Learning", d: "Learn at your own pace while engaging with interactive sessions and enriching resources." },
    { icon: MapPin, t: "Study Anytime, Anywhere", d: "Use the Student Zone via the portal or mobile app for all course materials and updates." },
    { icon: BookOpen, t: "Comprehensive Learning Resources", d: "E-books, journals, lecture transcripts and 24/7 access to recorded lectures." },
    { icon: GraduationCap, t: "Guided by Experts", d: "90+ PhD holders and 120+ faculty from IIT & IIM, with 800+ years of combined industry experience." },
    { icon: Headphones, t: "Dedicated Student Support", d: "The Student Success Team assists with admissions, academics, exams and fee receipts throughout your programme." },
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Key Highlights" title="Skill up and stand out in no time" subtitle="A six-month certificate built around flexibility, faculty quality and a well-rounded business foundation." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-card">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-extrabold text-foreground">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CURRICULUM ---------- */
function Curriculum() {
  return (
    <section className="py-16 sm:py-24" id="curriculum">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Curriculum" title="A Single-Semester Business Foundation" subtitle="One semester, six subjects - a well-rounded introduction to core business concepts." />
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="grid gap-3 sm:grid-cols-2">
            {subjects.map((subj) => (
              <div key={subj} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-card">
                <BookOpen className="h-4 w-4 shrink-0 text-primary" />
                {subj}
              </div>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-muted-foreground">
          Curriculum structure is as per university guidelines and subject to change without prior notice.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href="#enquire" className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-card transition hover:scale-[1.03]">
            <Download className="h-4 w-4" /> Download Brochure
          </a>
          <a href="#enquire" className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground">
            Download Detailed Syllabus
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- LEARNING EXPERIENCE / LMS ---------- */
function LearningExperience() {
  const items = [
    { icon: MapPin, t: "Study Anytime, Anywhere", d: "24/7 unlimited online access across platforms to live & recorded lectures." },
    { icon: GraduationCap, t: "Focus on Academic Excellence", d: "Programme content and syllabus meticulously designed by academicians & industry experts." },
    { icon: ShieldCheck, t: "Examination and Evaluation", d: "Exams are conducted online with stringent remote-proctoring systems in place." },
    { icon: Smartphone, t: "Technology-Based Learning", d: "Delivered online through a mobile app-based learning platform." },
    { icon: Award, t: "Get Alumni Status", d: "On completion, become part of the worldwide NMIMS CDOE alumni network." },
    { icon: Headphones, t: "24×7 Student Support", d: "Dedicated mentors and a responsive helpdesk for academic and technical queries." },
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Learning Experience" title="A tech-enabled journey, built for every learner" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="rounded-3xl border border-border bg-card p-6 text-center shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#3A1642,#3F3083)] text-[color:var(--gold)]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-foreground">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CERTIFICATE ---------- */
function Certificate() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(120deg,#7154EA,#3F3083)] py-16 text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#ffd7c9] ring-1 ring-white/20">
            <span className="h-[7px] w-[7px] rounded-full bg-[#ffd7c9]" /> Certificate & Alumni Status
          </span>
          <h2 className="mt-3 font-serif text-2xl font-bold sm:text-[30px] lg:text-[34px]">Earn Your NMIMS Certificate</h2>
          <p className="mt-3 max-w-lg text-white/85">Earn an official Certificate in Business Management from NMIMS CDOE that recognises your dedication to learning and pursuit of excellence.</p>
          <ul className="mt-6 space-y-3">
            {[
              "Recognised by employers across India",
              "Issued by Prestigious NMIMS - Deemed to be University",
              "Shareable on LinkedIn & job portals",
              "NAAC A++ accredited University",
            ].map((c) => (
              <li key={c} className="flex items-center gap-2.5 text-sm text-white/90">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#8bffb0]" /> {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-white/15 bg-white/[.06] p-6 text-center">
          <img src="/images/certificate-course.jpg" alt="NMIMS Certificate in Business Management sample" loading="lazy" className="mx-auto max-h-[320px] rounded-lg border-2 border-[#1c1c1c] shadow-elegant" />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffd68c]/60 px-3 py-1.5 text-xs font-bold text-[#ffd88c]">
              <CheckCircle2 className="h-3.5 w-3.5" /> Official Certificate
            </span>
            <span className="inline-flex items-center rounded-full border border-[#ffd68c]/60 px-3 py-1.5 text-xs font-bold text-[#ffd88c]">NMIMS CDOE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CAREER OUTCOMES ---------- */
function CareerOutcomes() {
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Career Outcomes" title="What This Certificate Prepares You For" subtitle="A well-rounded introduction to core business concepts, with a direct line to these roles." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="mt-3 text-sm font-extrabold text-foreground">{t}</h3>
              <p className="mt-2 text-xs text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FEES ---------- */
function Fees() {
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Fees & Payment" title="Program Fee" subtitle="A single, flat fee for the full 6-month programme." />
        <div className="mx-auto mt-12 max-w-sm">
          <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-[linear-gradient(135deg,#785BEB,#3F3083)] hover:shadow-elegant">
            <div className="absolute -right-10 -top-8 h-36 w-36 rounded-full bg-white/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors duration-300 group-hover:text-white/70">Certificate in Business Management</p>
            <p className="mt-4 text-4xl font-extrabold text-[#3F3083] transition-colors duration-300 group-hover:text-[#ffd24d]">
              ₹55,000 <span className="block text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-white/70">excluding GST</span>
            </p>
            <ul className="mx-auto mt-5 space-y-2.5 text-left text-sm text-muted-foreground transition-colors duration-300 group-hover:text-white">
              {["Single, one-time program fee", "Covers the full 6-month programme", "Loan facility available without a credit card"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-colors duration-300 group-hover:text-[#8bffb0]" /> {f}
                </li>
              ))}
            </ul>
            <a
              href="#enquire"
              className="mt-6 block rounded-full bg-[#3F3083] py-3 text-center text-sm font-bold text-white transition-colors duration-300 group-hover:bg-[#ffd24d] group-hover:text-[#3a2a00]"
            >
              Enroll Now
            </a>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Loan facility available even without a credit card. <a href="#enquire" className="font-semibold text-[#3F3083] underline">Talk to our counsellor</a> for finance options.
        </p>
        <div className="mx-auto mt-8 max-w-3xl space-y-2.5 rounded-2xl border border-border bg-card p-6 text-xs text-muted-foreground shadow-card">
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Admission processing fee of ₹1,200 applies to all admissions; an initial ₹10,000 from the programme fee is collected at registration.</p>
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Exam fee: ₹800 per subject per attempt.</p>
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> A loan facility to pay fees without a credit card is available; finance options are available on request.</p>
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Demand drafts should be made in favour of "SVKM's NMIMS" payable at Mumbai.</p>
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Fee structure is subject to change at the discretion of the University; please reconfirm current figures with your counsellor.</p>
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Refunds and cancellations are governed by the official <a href="#" className="underline">Refund Policy</a> of NMIMS CDOE.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- ELIGIBILITY + PROGRAM STRUCTURE ---------- */
function EligibilityAndStructure() {
  const eligibility = [
    "HSC (10+2) in any discipline from a recognised board.",
    "No entrance exam required for admission.",
  ];
  const structure = [
    ["Duration", "6 Months (1 Semester)"],
    ["Subjects", "6"],
    ["Specialisation Tracks", "None - single generalist business programme"],
    ["Credential", "UGC-entitled Certificate"],
    ["Mode", "100% Online - Live + Recorded"],
  ];
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Admission Essentials" title="Eligibility & Program Structure" subtitle="Everything you need to know before you apply." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
              <ClipboardCheck className="h-5 w-5 text-primary" /> Eligibility Criteria
            </h3>
            <ul className="mt-5 space-y-3">
              {eligibility.map((e) => (
                <li key={e} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3F3083]" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
              <BookMarked className="h-5 w-5 text-primary" /> Program Structure
            </h3>
            <table className="mt-5 w-full text-sm">
              <tbody>
                {structure.map(([k, v]) => (
                  <tr key={k} className="border-b border-border last:border-0">
                    <td className="w-1/2 py-3 font-bold text-foreground">{k}</td>
                    <td className="py-3 text-muted-foreground">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- ADMISSION PROCESS ---------- */
function AdmissionProcess() {
  const steps = [
    { icon: FileEdit, tag: "Step 1", t: "Registration", d: "Fill out the registration form and pay the Admission Processing Fee to begin your journey." },
    { icon: FileCheck, tag: "Step 2", t: "Document Submission", d: "Upload academic certificates, a work experience letter, identity proof and a passport-size photo." },
    { icon: CreditCard, tag: "Step 3", t: "Fee Submission", d: "Confirm your admission by paying the fee online or by demand draft favouring 'SVKM's NMIMS' payable at Mumbai." },
    { icon: CheckCircle2, tag: "Step 4", t: "Confirmation", d: "Receive your confirmation letter with a student number. Study Kit dispatch and Student Portal access follow confirmation." },
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Admission Process" title="How to Get Admission" subtitle="A simple 4-step process to begin your Certificate journey with NMIMS CDOE." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, tag, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="relative rounded-3xl border border-border bg-card p-6 pt-8 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <span className="absolute -top-4 left-6 grid h-9 w-9 place-items-center rounded-full bg-[#7154EA] text-sm font-extrabold text-white shadow-card">
                {i + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">{tag}</p>
              <h3 className="mt-1 text-base font-extrabold text-foreground">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#enquire"
            className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-card transition hover:scale-[1.03]"
          >
            Start Your Application <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- ABOUT CDOE ---------- */
function AboutCDOE() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.img
          src="/images/about.webp" alt="NMIMS CDOE campus building" loading="lazy" width={1600} height={1000}
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="rounded-3xl shadow-elegant"
        />
        <div>
          <SectionTitle align="left" eyebrow="About NMIMS CDOE" title="A legacy of excellence, recognised nationwide" />
          <p className="mt-4 text-muted-foreground">
            SVKM's Narsee Monjee Institute of Management was founded in 1981 and achieved Deemed-to-be-University status from the UGC in 2003. Today NMIMS is a globalised centre of learning with 750+ full-time faculty across multidisciplinary specialised schools, giving students balanced exposure to research, academics and industry practice.
          </p>
          <p className="mt-3 text-muted-foreground">
            NMIMS Centre for Distance and Online Education (CDOE) began its distance and online learning journey in 2013 with a state-of-the-art learning management system, delivering interactive learning on connected platforms 24/7 - changing the dynamics of higher education delivery in India.
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-secondary p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-foreground">
              <strong className="font-bold">Home Campus:</strong> SVKM's NMIMS, V.L. Mehta Road, Vile Parle (West), Mumbai, Maharashtra, India
            </p>
          </div>
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Accreditations & Recognition</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["UGC-Entitled", "NAAC A++", "NIRF Top 100", "Category 1 Autonomy"].map((b) => (
                <span key={b} className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground shadow-card">
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>
          <a href="/about" className="mt-7 inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-card transition hover:scale-[1.03]">
            Want to Know More <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const { faqItems } = Route.useLoaderData();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-surface-soft py-16 sm:py-24" id="faq">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Frequently Asked Questions" title="Everything you need to know" />
        <div className="mt-12 space-y-3">
          {faqItems.map((it, i) => (
            <div key={it.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
                aria-expanded={open === i}
              >
                <span className="font-bold text-foreground">{it.question}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{it.answer}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- NEED HELP ---------- */
function NeedHelp() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#1f1b2e_0%,#2a2440_55%,#3a2f55_100%)] p-8 text-center shadow-elegant sm:p-14">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-[color:var(--gold)]/25 blur-3xl" />
        <span className="relative inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold text-white ring-1 ring-white/30">
          <HelpCircle className="h-3.5 w-3.5" /> Still have questions?
        </span>
        <h2 className="relative mt-5 font-serif text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Talk to an admissions counsellor
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/85">
          Get a callback, chat instantly on WhatsApp, or join a free info session to learn more about the NMIMS Certificate in Business Management.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <a href={telLink} className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#dc2626)] px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <a href={waLink("Hi, I'm interested in the NMIMS Certificate in Business Management. Please share more details.")} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </a>
          <a href="#enquire" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/15">
            <Mail className="h-4 w-4" /> Request a Callback
          </a>
          <a href={CALENDLY_LINK} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/15">
            <CalendarCheck className="h-4 w-4" /> Join Free Info Session
          </a>
        </div>
      </div>
    </section>
  );
}
