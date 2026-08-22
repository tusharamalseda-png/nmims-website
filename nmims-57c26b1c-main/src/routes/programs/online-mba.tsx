import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, MessageCircle, GraduationCap, Briefcase, Clock, Award, BookOpen,
  Laptop, Video, Headphones, ChevronDown, MapPin, Star, ArrowRight, CheckCircle2,
  TrendingUp, Globe2, ShieldCheck, BarChart3, Building2, Cpu, Megaphone,
  UserCog, FileEdit, FileCheck, CreditCard, ClipboardCheck, Wallet,
  Smartphone, HelpCircle, CalendarCheck, Mail, Handshake, FileSearch, MessageSquare,
  Brain, Rocket, Landmark, ShoppingCart, Truck, HeartPulse, Quote, Download,
  BookMarked, Layers,
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
  slug: "online-mba",
  title: "Online MBA",
  metaTitle: "NMIMS Online MBA 2026 | UGC-DEB Entitled Degree | Fees, Eligibility & Admission",
  metaDescription: "Pursue a UGC-DEB entitled Online MBA from NMIMS CDOE - 2-year program, 7+ specialisations, live faculty sessions & career services. Check fees, eligibility, syllabus & apply for 2026 admissions.",
  canonicalUrl: "/programs/online-mba",
  ogImage: null as string | null,
  status: "published" as const,
};

export const Route = createFileRoute("/programs/online-mba")({
  loader: async () => {
    const [page, faqItems, testimonials] = await Promise.all([
      getPageFn({ data: { slug: "online-mba" } }),
      listFaqsForPageFn({ data: { pageSlug: "online-mba" } }),
      listTestimonialsFn({ data: { pageSlug: "online-mba" } }),
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
            { "@type": "ListItem", position: 3, name: "Online MBA", item: "/programs/online-mba" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOccupationalProgram",
          name: "Online MBA",
          description: "UGC-DEB entitled 2-year Online MBA offered by NMIMS Centre for Distance and Online Education (CDOE), with 7+ specialisations, live faculty-led sessions and career services.",
          provider: {
            "@type": "CollegeOrUniversity",
            name: "NMIMS Centre for Distance and Online Education (CDOE)",
          },
          educationalCredentialAwarded: "Master of Business Administration (MBA)",
          timeToComplete: "P2Y",
          occupationalCategory: "Business Management",
          educationalProgramMode: "online",
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
  component: OnlineMBAPage,
});

const waMessage = "Hi, I'd like to know about the NMIMS Online MBA program.";

const specializations = [
  { icon: BarChart3, name: "Financial Management", desc: "Master corporate finance, investment strategies and financial decision-making." },
  { icon: Briefcase, name: "Business Management", desc: "Build leadership skills and strategic thinking to drive organisational growth." },
  { icon: Megaphone, name: "Marketing Management", desc: "Learn brand strategy, digital marketing and consumer behaviour insights." },
  { icon: UserCog, name: "Human Resource Management", desc: "Develop people management, talent acquisition and HR strategy expertise." },
  { icon: Layers, name: "Operations & Data Science", desc: "Combine operational efficiency with data-driven decision making skills." },
  { icon: Cpu, name: "IT Management", desc: "Bridge technology and business with IT strategy and digital transformation." },
  { icon: TrendingUp, name: "Business Analytics", desc: "Turn complex data into actionable insights with analytics and visualisation tools." },
];

const semesters = [
  { label: "Semester 1", subjects: ["Principles of Management", "Managerial Economics", "Financial Accounting", "Business Statistics", "Organisational Behaviour", "Business Communication"] },
  { label: "Semester 2", subjects: ["Marketing Management", "Human Resource Management", "Financial Management", "Operations Management", "Business Research Methods", "Legal Aspects of Business"] },
  { label: "Semester 3", subjects: ["Strategic Management", "Specialisation Elective I", "Specialisation Elective II", "Specialisation Elective III", "Business Analytics", "Entrepreneurship & Innovation"] },
  { label: "Semester 4", subjects: ["Specialisation Elective IV", "Specialisation Elective V", "International Business", "Corporate Governance & Ethics", "Capstone Project", "Summer Internship Report"] },
];


function OnlineMBAPage() {
  const { testimonials } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header activeProgram="Online MBA" />
      <main>
        <Hero />
        <TrustStats />
        <WhyChoose />
        <Specializations />
        <Curriculum />
        <LearningExperience />
        <Certificate />
        <CareerServices />
        <HiringSectors />
        <CareerOptions />
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
    { label: "Duration", value: "2 Years" },
    { label: "Mode", value: "100% Online" },
    { label: "Fees From", value: "₹55,000/sem" },
    { label: "Eligibility", value: "Any Graduate" },
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
            UGC-DEB Entitled · Admissions Open 2026
          </span>
          <h1 className="mt-5 font-serif text-3xl font-extrabold leading-[1.15] sm:text-4xl lg:text-[44px]">
            Online MBA from
            <span className="mt-1 block bg-[linear-gradient(135deg,#ef4444,#f97316)] bg-clip-text text-transparent">
              NMIMS University
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-base">
            Ready to take your career to the next level? The NMIMS Online MBA is designed for working professionals and graduates who want a globally recognised management degree without pausing their career.
          </p>

          <ul className="mt-6 grid max-w-lg gap-2.5 sm:grid-cols-2">
            {[
              { icon: Video, t: "Live Interactive Lectures" },
              { icon: ShieldCheck, t: "UGC-DEB Entitled Degree" },
              { icon: Briefcase, t: "Career Services" },
              { icon: Clock, t: "Flexible Learning" },
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
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#fbbf24]" /> UGC-DEB Entitled</span>
          <span className="flex items-center gap-2"><Award className="h-4 w-4 text-[#fbbf24]" /> NAAC A++</span>
          <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" /> 4.8/5 · 12,000+ learners</span>
          <span className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-[#fbbf24]" /> 200+ cities across India</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- TRUST STATS BAR ---------- */
function TrustStats() {
  const items = [
    { n: 75000, s: "+", l: "Students Enrolled" },
    { n: 120000, s: "+", l: "Strong Alumni Network" },
    { n: 700, s: "+", l: "Hiring Partners" },
    { n: 25, s: "%", l: "of Salary Increment Reported" },
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
    { icon: Video, t: "Live Interactive Classes", d: "Weekend and Weekday live sessions with faculty and real-time doubt-solving Q&A." },
    { icon: Laptop, t: "Recorded Sessions", d: "Lifetime access to high-quality recordings - learn at your own pace." },
    { icon: GraduationCap, t: "Experienced Faculty", d: "Learn from academicians and industry leaders with years of experience." },
    { icon: Briefcase, t: "Career Services", d: "1:1 career coaching, resume review and access to 700+ hiring partners." },
    { icon: Clock, t: "Flexible Learning", d: "Study evenings & weekends without putting your career on hold." },
    { icon: Headphones, t: "24×7 Student Support", d: "Dedicated mentors, doubt-solving and academic guidance whenever you need." },
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Key Highlights" title="Everything you need to succeed, in one place" subtitle="A management degree built around your career, not the other way around." />
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

/* ---------- ELIGIBILITY + PROGRAM STRUCTURE ---------- */
function EligibilityAndStructure() {
  const eligibility = [
    "Graduation (10+2+3 or equivalent) in any discipline from a UGC-recognised university.",
    "Minimum 50% aggregate marks (45% for reserved categories, as applicable).",
    "Final-year graduation students can apply provisionally, subject to result submission.",
    "No entrance exam required for admission.",
    "Work experience is not mandatory but is viewed favourably.",
  ];
  const structure = [
    ["Duration", "2 Years (4 Semesters)"],
    ["Maximum Duration", "Up to 4 Years"],
    ["Mode", "100% Online - Live + Recorded"],
    ["Medium of Instruction", "English"],
    ["Evaluation Pattern", "Continuous Assessment + Term-End Exam"],
    ["Exams", "Computer-based, at designated centres pan-India"],
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

/* ---------- SPECIALIZATIONS ---------- */
function Specializations() {
  return (
    <section className="py-16 sm:py-24" id="specialisations">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="MBA Specialisations" title="Choose a track that matches your ambition" subtitle="Every specialisation is industry-aligned and taught by experienced faculty." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {specializations.map(({ icon: Icon, name, desc }, i) => (
            <motion.article
              key={name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFDCE3] text-[#E63950]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-foreground">{name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              <a href="#enquire" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary transition group-hover:gap-2">
                Learn more <ArrowRight className="h-4 w-4" />
              </a>
            </motion.article>
          ))}
          <div className="flex flex-col items-start justify-center rounded-3xl gradient-primary p-6 text-primary-foreground shadow-card">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
              <Mail className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-bold">Not sure which to pick?</h3>
            <p className="mt-2 text-sm text-primary-foreground/90">Talk to a counsellor and choose the right specialisation for your goals.</p>
            <a href="#enquire" className="mt-4 inline-flex items-center gap-1 text-sm font-bold">
              Get free guidance <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CURRICULUM ---------- */
function Curriculum() {
  const [active, setActive] = useState(0);
  return (
    <section className="bg-surface-soft py-16 sm:py-24" id="curriculum">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Curriculum" title="Semester-Wise Syllabus" subtitle="A structured, industry-relevant curriculum - core management fundamentals in Year 1, specialisation depth in Year 2." />

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {semesters.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setActive(i)}
              className={`rounded-full border-2 px-5 py-2 text-sm font-bold transition ${
                active === i ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground/70 hover:border-primary"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
          {semesters[active].subjects.map((subj) => (
            <div key={subj} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-card">
              <BookOpen className="h-4 w-4 shrink-0 text-primary" />
              {subj}
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-muted-foreground">
          Curriculum structure is indicative and subject to periodic revision by NMIMS CDOE. Electives are chosen as per your selected specialisation.
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
    { icon: Video, t: "Live Interactive & Recorded Lectures", d: "24/7 access to all content, including recorded sessions of every lecture." },
    { icon: Smartphone, t: "Mobile App & Student Portal", d: "Attend classes, submit assignments and track progress from one dashboard." },
    { icon: BookOpen, t: "E-Library & Digital Resources", d: "Access e-books, case studies and journals through the online library, anytime." },
    { icon: GraduationCap, t: "High Focus on Academic Excellence", d: "Experienced academicians and industry experts with a globally curated curriculum." },
    { icon: Headphones, t: "24×7 Student Support", d: "Dedicated mentors and a responsive helpdesk for academic and technical queries." },
    { icon: Laptop, t: "Application-Oriented Assessment", d: "Computer-based exams at designated centres all over India." },
  ];
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Learning Experience" title="A tech-enabled journey, built for professionals" />
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
            <span className="h-[7px] w-[7px] rounded-full bg-[#ffd7c9]" /> Program Certificate
          </span>
          <h2 className="mt-3 font-serif text-2xl font-bold sm:text-[30px] lg:text-[34px]">Earn Your NMIMS Certificate</h2>
          <p className="mt-3 max-w-lg text-white/85">Earn an official certificate from NMIMS CDOE that recognises your dedication to learning and pursuit of excellence.</p>
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
          <img src="/images/certificate.jpeg" alt="NMIMS Online MBA certificate sample" loading="lazy" className="mx-auto max-h-[320px] rounded-lg border-2 border-[#1c1c1c] shadow-elegant" />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffd68c]/60 px-3 py-1.5 text-xs font-bold text-[#ffd88c]">
              <CheckCircle2 className="h-3.5 w-3.5" /> Degree Certificate
            </span>
            <span className="inline-flex items-center rounded-full border border-[#ffd68c]/60 px-3 py-1.5 text-xs font-bold text-[#ffd88c]">NMIMS CDOE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CAREER SERVICES ---------- */
function CareerServices() {
  const items = [
    { icon: Building2, t: "Job Portal & Hiring-Partner Access", d: "Browse curated job openings and connect with our hiring-partner network." },
    { icon: Handshake, t: "1:1 Career Coaching & Mentorship", d: "Personalised guidance to map your specialisation to the right career path." },
    { icon: FileSearch, t: "Resume & LinkedIn Profile Building", d: "Get your profile reviewed and polished by career-services experts." },
    { icon: MessageSquare, t: "Mock Interviews & GD Practice", d: "Practice with mock interviews and group discussions before the real thing." },
    { icon: Brain, t: "Psychometric & Aptitude Assessment", d: "Understand your strengths with structured career-readiness assessments." },
    { icon: Rocket, t: "Industry Webinars & Workshops", d: "Stay current with sessions led by practitioners across sectors." },
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Career Services" title="Support that goes beyond the classroom" subtitle="Our career services team works with you from enrolment to career readiness." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-foreground">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- HIRING SECTORS ---------- */
function HiringSectors() {
  const sectors = [
    { icon: Landmark, t: "BFSI" },
    { icon: Cpu, t: "IT & Technology" },
    { icon: ShoppingCart, t: "FMCG & Retail" },
    { icon: Briefcase, t: "Consulting" },
    { icon: Building2, t: "Manufacturing" },
    { icon: Truck, t: "E-commerce & Logistics" },
    { icon: HeartPulse, t: "Healthcare & Pharma" },
    { icon: Laptop, t: "EdTech" },
  ];
  const track = [...sectors, ...sectors];
  return (
    <section className="py-16 text-center sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="700+ Hiring Partners" title="Our alumni work across every major sector" subtitle="From BFSI to technology, our hiring-partner network spans industries hiring NMIMS CDOE graduates." />
      </div>
      <div className="mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-[hiring-scroll_30s_linear_infinite] gap-4 hover:[animation-play-state:paused]">
          {track.map(({ icon: Icon, t }, i) => (
            <span key={`${t}-${i}`} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-border bg-card px-6 py-3.5 text-sm font-bold text-[#3F3083] shadow-card">
              <Icon className="h-4 w-4 text-primary" /> {t}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes hiring-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

/* ---------- CAREER OPTIONS ---------- */
function CareerOptions() {
  const roles = [
    { t: "Marketing Manager", d: "Lead brand, digital and go-to-market strategy for a business unit." },
    { t: "Financial Analyst", d: "Drive budgeting, forecasting and investment decision support." },
    { t: "HR Business Partner", d: "Align talent strategy with business goals across the employee lifecycle." },
    { t: "Business Analyst", d: "Turn data into insights that inform strategic business decisions." },
    { t: "Operations Manager", d: "Own process efficiency, supply chain and delivery performance." },
    { t: "IT Project Manager", d: "Bridge business and technology teams to deliver digital initiatives." },
    { t: "Management Consultant", d: "Advise organisations on strategy, growth and operational improvement." },
    { t: "Entrepreneur / Founder", d: "Apply core management skills to build and scale your own venture." },
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Career Options" title="Where This MBA Can Take You" subtitle="Representative roles pursued by NMIMS Online MBA graduates across specialisations." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <div key={r.t} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h3 className="text-sm font-extrabold text-foreground">{r.t}</h3>
              <p className="mt-2 text-xs text-muted-foreground">{r.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ---------- FEES ---------- */
const FEE_PLANS = [
  { opt: "Option 1", title: "Annual Payment", price: "₹1,05,000", suffix: "/ year", bullets: ["Pay once per year", "2 installments over 2 years", "Best value plan"] },
  { opt: "Option 2", title: "Semester-Wise Payment", price: "₹55,000", suffix: "/ semester", bullets: ["4 flexible installments", "Pay per semester", "Easier on monthly budget"] },
  { opt: "Option 3", title: "Full Payment", price: "₹1,96,000", suffix: "one-time", bullets: ["Single one-time payment", "No further installments", "Lower than the annual plan total"] },
  { opt: "Option 4", title: "EMI Facility", price: "0%", suffix: "interest EMI", bullets: ["No Cost EMI Plans - Students can pay with fees in 3,6,9,12,24,36 months tenures", "Credit card EMI - Banks charges applicable as per bank policy"] },
];

function Fees() {
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Fees & Payment" title="Fee Structure & EMI Options" subtitle="Select a payment plan that works for you - pay semester-wise across 4 semesters, annually over 2 years, as a single one-time payment, or via EMI." />
        <div className="mx-auto mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEE_PLANS.map(({ opt, title, price, suffix, bullets }) => (
            <div
              key={opt}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-[linear-gradient(135deg,#785BEB,#3F3083)] hover:shadow-elegant"
            >
              <div className="absolute -right-10 -top-8 h-36 w-36 rounded-full bg-white/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors duration-300 group-hover:text-white/70">{opt}</p>
              <h3 className="mt-1 text-lg font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-white">{title}</h3>
              <p className="mt-4 text-2xl font-extrabold text-[#3F3083] transition-colors duration-300 group-hover:text-[#ffd24d]">
                {price} <span className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-white/70">{suffix}</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2.5 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-white">
                {bullets.map((f) => (
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
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          EMI options available. <a href="#enquire" className="font-semibold text-[#3F3083] underline">Talk to our counsellor</a> for zero-cost EMI details.
        </p>
        <div className="mx-auto mt-8 max-w-3xl space-y-2.5 rounded-2xl border border-border bg-card p-6 text-xs text-muted-foreground shadow-card">
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Fees may vary slightly by specialisation; confirm the current schedule with your counsellor before enrolling.</p>
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Processing, examination and project/dissertation fees (where applicable) are charged separately as per the official NMIMS CDOE fee schedule.</p>
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> 0% interest EMI options are available. Currently, no scholarships or concessions are available for the general category; a 20% fee concession applies for defence personnel and their immediate family.</p>
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Refunds and cancellations are governed by the official <a href="#" className="underline">Refund Policy</a> of NMIMS CDOE.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- ADMISSION PROCESS ---------- */
function AdmissionProcess() {
  const steps = [
    { icon: FileEdit, tag: "Step 1", t: "Registration", d: "Complete the online registration form and pay the application fee to begin your journey." },
    { icon: FileCheck, tag: "Step 2", t: "Document Submission", d: "Submit academic documents, work experience proof (if any), and a valid photo ID." },
    { icon: CreditCard, tag: "Step 3", t: "Fee Payment", d: "Pay your program fees online, or split them with easy 0% interest EMI options." },
    { icon: CheckCircle2, tag: "Step 4", t: "Confirmation", d: "Your admission is confirmed and you receive an official student number." },
  ];
  const docs = [
    "Passport-size photograph",
    "Government-issued photo ID",
    "10th & 12th marksheets",
    "Graduation marksheets & degree certificate",
    "Work experience certificate (if applicable)",
    "Category certificate (if applicable)",
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Admission Process" title="How to Get Admission" subtitle="Simple 4-step process to begin your MBA journey with NMIMS CDOE." />
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

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-foreground">
              <CalendarCheck className="h-4 w-4 text-primary" /> Upcoming Intake
            </h3>
            <table className="mt-4 w-full overflow-hidden rounded-xl text-sm">
              <thead>
                <tr className="bg-[#7154EA] text-left text-white">
                  <th className="rounded-l-lg px-4 py-2.5 font-bold">Batch</th>
                  <th className="px-4 py-2.5 font-bold">Applications</th>
                  <th className="rounded-r-lg px-4 py-2.5 font-bold">Session Start</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-surface-soft">
                  <td className="rounded-l-lg px-4 py-2.5 text-foreground">2026 Intake</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Rolling admissions</td>
                  <td className="rounded-r-lg px-4 py-2.5 text-muted-foreground">July 2026</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-3 text-xs text-muted-foreground">Admissions are processed on a rolling basis. Talk to your counsellor to confirm the exact intake calendar and re-registration schedule for each subsequent semester.</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="text-sm font-extrabold text-foreground">Documents Required</h3>
            <ul className="mt-4 space-y-2.5">
              {docs.map((doc) => (
                <li key={doc} className="flex gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {doc}
                </li>
              ))}
            </ul>
          </div>
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
            NMIMS Centre for Distance and Online Education (CDOE) is one of India's leading institutions for flexible, career-focused online education. Established in 1994 as the distance learning division of SVKM's NMIMS, the institute has consistently delivered high-quality academic programs designed to meet evolving industry demands.
          </p>
          <p className="mt-3 text-muted-foreground">
            With a strong focus on accessible learning, industry-relevant curriculum and student success, NMIMS CDOE empowers learners to build in-demand skills, achieve their career goals and excel in today's competitive business environment.
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
              {["UGC-DEB Entitled", "NAAC A++", "AICTE Approved", "Category 1 Autonomy"].map((b) => (
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
          Get a callback, chat instantly on WhatsApp, or join a free info session to learn more about the NMIMS Online MBA.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <a href={telLink} className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#dc2626)] px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <a href={waLink("Hi, I'm interested in the NMIMS Online MBA. Please share more details.")} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
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
