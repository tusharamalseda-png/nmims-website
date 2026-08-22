import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, MessageCircle, GraduationCap, Briefcase, Clock, Award, BookOpen,
  Laptop, Video, Headphones, ChevronDown, MapPin, Star, ArrowRight, CheckCircle2,
  TrendingUp, Globe2, ShieldCheck, Building2, Cpu, Megaphone,
  UserCog, FileEdit, FileCheck, CreditCard, ClipboardCheck, Wallet,
  Smartphone, HelpCircle, CalendarCheck, Mail, Handshake, FileSearch, MessageSquare,
  Brain, Rocket, Landmark, ShoppingCart, Truck, HeartPulse, Quote, Download,
  BookMarked, Layers, IdCard,
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
  slug: "online-bba",
  title: "Online BBA",
  metaTitle: "NMIMS Online BBA 2026 | UGC-DEB Entitled Degree | Fees, Eligibility & Admission",
  metaDescription: "Pursue a UGC-DEB entitled Online BBA from NMIMS CDOE - 3-year, 6-semester program with Marketing, Finance & Business Analytics tracks. Check fees, eligibility, syllabus & apply for 2026 admissions.",
  canonicalUrl: "/programs/online-bba",
  ogImage: null as string | null,
  status: "published" as const,
};

export const Route = createFileRoute("/programs/online-bba")({
  loader: async () => {
    const [page, faqItems, testimonials] = await Promise.all([
      getPageFn({ data: { slug: "online-bba" } }),
      listFaqsForPageFn({ data: { pageSlug: "online-bba" } }),
      listTestimonialsFn({ data: { pageSlug: "online-bba" } }),
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
            { "@type": "ListItem", position: 3, name: "Online BBA", item: "/programs/online-bba" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOccupationalProgram",
          name: "Online BBA",
          description: "UGC-DEB entitled 3-year Online BBA offered by NMIMS Centre for Distance and Online Education (CDOE), with Marketing, Finance and Business Analytics specialisations.",
          provider: {
            "@type": "CollegeOrUniversity",
            name: "NMIMS Centre for Distance and Online Education (CDOE)",
          },
          educationalCredentialAwarded: "Bachelor of Business Administration (BBA)",
          timeToComplete: "P3Y",
          occupationalCategory: "Business Administration",
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
  component: OnlineBBAPage,
});

const waMessage = "Hi, I'd like to know about the NMIMS Online BBA program.";

const specializations = [
  { icon: Megaphone, name: "Marketing", desc: "Digital marketing, retail management, consumer behaviour and brand strategy." },
  { icon: Landmark, name: "Finance", desc: "Financial management, corporate finance, investment analysis and financial modelling." },
  { icon: TrendingUp, name: "Business Analytics", desc: "Python, machine learning, Tableau visualisation and big data techniques for business." },
];

const semesters = [
  { label: "Semester 1", core: ["Principles of Management", "Business Communication", "Financial Accounting", "Micro Economics", "Organisation Behaviour & HRM", "Essentials of IT"], electives: null },
  { label: "Semester 2", core: ["Cost and Management Accounting", "Principles of Marketing", "Operations Research", "Macro Economics", "Business Statistics for Decision Making", "Introduction to Analytics"], electives: null },
  { label: "Semester 3", core: ["Business and Allied Law", "Digital Marketing", "Financial Management", "Consumer Behaviour", "International Business & Export Import Management", "Sales Management"], electives: null },
  {
    label: "Semester 4",
    core: ["Production & Total Quality Management", "Research Methodology"],
    electives: {
      Marketing: ["Performance Management System", "Environment and Disaster Management", "Retail Management", "Fundamentals of Taxation"],
      Finance: ["Performance Management System", "Environment and Disaster Management", "Retail Management", "Fundamentals of Taxation"],
      "Business Analytics": ["Introduction to Python", "Machine Learning – I", "Data Visualization with Tableau", "Multivariate Techniques"],
    },
  },
  {
    label: "Semester 5",
    core: ["Entrepreneurship Management", "Project", "Customer Relationship Management"],
    electives: {
      Marketing: ["Rural Marketing", "Strategic Brand Management", "Financial Statement Analysis"],
      Finance: ["Financial Institutions & Markets", "Corporate Finance", "Financial Statement Analysis"],
      "Business Analytics": ["Analytics in Business Domains", "Data Management", "Machine Learning – II"],
    },
  },
  {
    label: "Semester 6",
    core: ["Business Ethics and Corporate Governance", "Strategic Management", "Operations and Supply Chain Management", "Project Management"],
    electives: {
      Marketing: ["Integrated Marketing Communications", "International Marketing"],
      Finance: ["Investment Analysis and Portfolio Management", "Financial Modeling"],
      "Business Analytics": ["Introduction to Big Data Technologies", "Time Series Forecasting"],
    },
  },
];

const skillModules = [
  { module: "Soft Skills for Managers", skill: "Soft Skills", semester: "Semester 1" },
  { module: "Design Thinking", skill: "Technical", semester: "Semester 2" },
  { module: "Start Your Start-up", skill: "Technical", semester: "Semester 3" },
];


function OnlineBBAPage() {
  const { testimonials } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header activeProgram="Online BBA" />
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
    { label: "Duration", value: "3 Years" },
    { label: "Mode", value: "100% Online" },
    { label: "Fees From", value: "₹25,000/sem" },
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
            UGC-DEB Entitled · Admissions Open 2026
          </span>
          <h1 className="mt-5 font-serif text-3xl font-extrabold leading-[1.15] sm:text-4xl lg:text-[44px]">
            Online BBA from
            <span className="mt-1 block bg-[linear-gradient(135deg,#ef4444,#f97316)] bg-clip-text text-transparent">
              NMIMS University
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-base">
            Ready to start your career? The NMIMS Online BBA is a UGC-DEB entitled, 3-year undergraduate degree for school leavers and early-career learners who want a recognised business qualification with complete flexibility.
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
    { icon: GraduationCap, t: "750+ Full-Time Faculty", d: "Learn from NMIMS' own faculty across its multidisciplinary schools." },
    { icon: Award, t: "India's Top 10 B-School", d: "Study with a university consistently ranked among India's best." },
    { icon: Briefcase, t: "Career Services", d: "Career services and access to a wide hiring-partner network." },
    { icon: Clock, t: "Flexible Learning", d: "Study on your schedule with mobile app-based access to every class." },
    { icon: Rocket, t: "Alumni Status", d: "Become part of the worldwide NMIMS CDOE alumni network on completion." },
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Key Highlights" title="Everything you need to succeed, in one place" subtitle="An undergraduate degree built around flexibility, faculty quality and career readiness." />
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

/* ---------- SPECIALIZATIONS ---------- */
function Specializations() {
  return (
    <section className="py-16 sm:py-24" id="specialisations">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="BBA Specialisations" title="Choose a track that matches your ambition" subtitle="Electives begin in Semester 4 - choose Marketing, Finance, or Business Analytics." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="flex flex-col items-start justify-center rounded-3xl gradient-primary p-6 text-primary-foreground shadow-card sm:col-span-2 lg:col-span-1">
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
  const current = semesters[active];
  return (
    <section className="bg-surface-soft py-16 sm:py-24" id="curriculum">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Curriculum" title="Semester-Wise Syllabus" subtitle="144 credits across 6 semesters - core business fundamentals first, specialisation electives from Semester 4." />

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

        <div className="mx-auto mt-8 max-w-4xl">
          <div className="grid gap-3 sm:grid-cols-2">
            {current.core.map((subj) => (
              <div key={subj} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-card">
                <BookOpen className="h-4 w-4 shrink-0 text-primary" />
                {subj}
              </div>
            ))}
          </div>

          {current.electives && (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {Object.entries(current.electives).map(([track, subjects]) => (
                <div key={track} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                    <Star className="h-3.5 w-3.5" /> {track} Electives
                  </p>
                  <ul className="space-y-2">
                    {(subjects as string[]).map((s) => (
                      <li key={s} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3F3083]" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-card">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Employability Skill Add-On Modules</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {skillModules.map((m) => (
              <div key={m.module} className="rounded-xl bg-surface-soft px-4 py-3 text-center">
                <p className="text-sm font-bold text-foreground">{m.module}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.skill} · {m.semester}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-muted-foreground">
          Programme credits: 144. Curriculum structure is as per university guidelines and subject to change without prior notice.
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
    <section className="py-16 sm:py-24">
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
            <span className="h-[7px] w-[7px] rounded-full bg-[#ffd7c9]" /> Degree & Alumni Status
          </span>
          <h2 className="mt-3 font-serif text-2xl font-bold sm:text-[30px] lg:text-[34px]">Be a Graduate - Earn Your NMIMS Degree</h2>
          <p className="mt-3 max-w-lg text-white/85">Earn an official Bachelor of Business Administration degree from NMIMS CDOE that recognises your dedication to learning and career growth.</p>
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
          <img src="/images/certificate-bba.jpg" alt="NMIMS Online BBA certificate sample" loading="lazy" className="mx-auto max-h-[320px] rounded-lg border-2 border-[#1c1c1c] shadow-elegant" />
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
        <div className="flex w-max animate-[hiring-scroll-bba_30s_linear_infinite] gap-4 hover:[animation-play-state:paused]">
          {track.map(({ icon: Icon, t }, i) => (
            <span key={`${t}-${i}`} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-border bg-card px-6 py-3.5 text-sm font-bold text-[#3F3083] shadow-card">
              <Icon className="h-4 w-4 text-primary" /> {t}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes hiring-scroll-bba {
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
    { icon: Megaphone, t: "Marketing", d: "Assistant manager / executive roles in brand, digital and sales functions." },
    { icon: Landmark, t: "Finance", d: "Entry into financial analysis, accounting and corporate finance functions." },
    { icon: UserCog, t: "HR", d: "Roles in talent acquisition, HR operations and people management." },
    { icon: Layers, t: "Operations", d: "Process, supply chain and operations management roles." },
    { icon: Cpu, t: "Information Technology", d: "IT-enabled business roles bridging technology and management." },
    { icon: Building2, t: "General Management", d: "Cross-functional management trainee and generalist roles." },
    { icon: Handshake, t: "Business", d: "Business development and entrepreneurial opportunities." },
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Career Opportunities" title="Where This BBA Can Take You" subtitle="This programme prepares you to respond to the challenges of the corporate world as an assistant manager or executive across these domains." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map(({ icon: Icon, t, d }) => (
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
const BBA_FEE_TRACKS = [
  {
    label: "Marketing & Finance Electives",
    plans: [
      { opt: "Option 1", title: "Annual Payment", price: "₹47,000", suffix: "/ year", bullets: ["Pay once per year", "3 instalments over 3 years", "Best value plan"] },
      { opt: "Option 2", title: "Semester-Wise Payment", price: "₹25,000", suffix: "/ semester", bullets: ["6 flexible instalments", "Pay per semester", "Easier on monthly budget"] },
      { opt: "Option 3", title: "Full Payment", price: "₹1,31,000", suffix: "one-time", bullets: ["Single one-time payment", "No further instalments", "Lower than the annual plan total"] },
      { opt: "Option 4", title: "EMI Facility", price: "0%", suffix: "interest EMI", bullets: ["No Cost EMI Plans - Students can pay with fees in 3,6,9,12,24,36 months tenures", "Credit card EMI - Banks charges applicable as per bank policy"] },
    ],
  },
  {
    label: "Business Analytics Electives (2nd & 3rd Year)",
    plans: [
      { opt: "Option 1", title: "Annual Payment", price: "₹56,400", suffix: "/ year", bullets: ["Pay once per year", "3 instalments over 3 years", "Best value plan"] },
      { opt: "Option 2", title: "Semester-Wise Payment", price: "₹30,000", suffix: "/ semester", bullets: ["6 flexible instalments", "Pay per semester", "Easier on monthly budget"] },
      { opt: "Option 3", title: "Full Payment", price: "₹1,45,000", suffix: "one-time", bullets: ["Single one-time payment", "No further instalments", "Lower than the annual plan total"] },
      { opt: "Option 4", title: "EMI Facility", price: "0%", suffix: "interest EMI", bullets: ["No Cost EMI Plans - Students can pay with fees in 3,6,9,12,24,36 months tenures", "Credit card EMI - Banks charges applicable as per bank policy"] },
    ],
  },
];

function FeeCard({ opt, title, price, suffix, bullets }: { opt: string; title: string; price: string; suffix: string; bullets: string[] }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-[linear-gradient(135deg,#785BEB,#3F3083)] hover:shadow-elegant">
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
  );
}

function Fees() {
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Fees & Payment" title="Fee Structure & EMI Options" subtitle="Fees vary by specialisation track - pay annually, semester-wise, as a full one-time payment, or via EMI." />
        {BBA_FEE_TRACKS.map((track, i) => (
          <div key={track.label} className={i === 0 ? "mt-12" : "mt-14"}>
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">{track.label}</h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {track.plans.map((p) => (
                <FeeCard key={p.opt} {...p} />
              ))}
            </div>
          </div>
        ))}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Loan facility available even without a credit card. <a href="#enquire" className="font-semibold text-[#3F3083] underline">Talk to our counsellor</a> for EMI details.
        </p>
        <div className="mx-auto mt-8 max-w-4xl space-y-2.5 rounded-2xl border border-border bg-card p-6 text-xs text-muted-foreground shadow-card">
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Admission processing fee of ₹1,200 applies to all admissions; an initial ₹10,000 from the programme fee is collected at registration.</p>
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Exam fee: ₹800 per subject per attempt. Project fee: ₹1,500 per attempt.</p>
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> EMI (3/6/9/12 months) available via credit cards of HDFC, ICICI, Axis, Citibank, Standard Chartered, HSBC and Kotak Mahindra Bank.</p>
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Demand drafts should be made in favour of "SVKM's NMIMS" payable at Mumbai.</p>
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Currently, no scholarships or concessions are available for the general category; a 20% fee concession applies for defence personnel and their immediate family.</p>
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
    "Minimum 50% aggregate marks (45% for SC/ST/OBC/PwD candidates).",
    "No entrance exam required for admission.",
    "An Academic Bank of Credits (ABC ID) is mandatory before the application can be submitted.",
  ];
  const structure = [
    ["Duration", "3 Years (6 Semesters)"],
    ["Maximum Validity", "Up to 6 Years"],
    ["Subjects per Semester", "6"],
    ["Specialisations", "3 (Marketing, Finance, Business Analytics)"],
    ["Total Programme Credits", "144"],
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
    { icon: FileEdit, tag: "Step 1", t: "Registration", d: "Register online at online.nmims.edu. A student counsellor will get in touch with you post-registration." },
    { icon: FileCheck, tag: "Step 2", t: "Document Submission", d: "Upload gazette-attested photocopies of your academic and KYC documents." },
    { icon: CreditCard, tag: "Step 3", t: "Fee Submission", d: "Confirm your admission by paying the fee online or by demand draft favouring 'SVKM's NMIMS' payable at Mumbai." },
    { icon: CheckCircle2, tag: "Step 4", t: "Confirmation", d: "On document and payment approval and student verification, your admission is confirmed and a student number is issued." },
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Admission Process" title="How to Get Admission" subtitle="A simple 4-step process to begin your BBA journey with NMIMS CDOE." />
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

        <div className="mx-auto mt-16 max-w-3xl rounded-3xl border-2 border-[#7154EA]/25 bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
              <IdCard className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-foreground">Additional Admission Requirement: ABC ID</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                As per UGC guidelines, every applicant must include an Academic Bank of Credits (ABC) ID on the admission form.
                <strong className="font-semibold text-foreground"> You won't be able to submit your application without one</strong>, so create your ABC ID before you start your registration to avoid delays.
              </p>
            </div>
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
              {["UGC-DEB Entitled", "NAAC A++", "NIRF Top 100", "Category 1 Autonomy"].map((b) => (
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
          Get a callback, chat instantly on WhatsApp, or join a free info session to learn more about the NMIMS Online BBA.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <a href={telLink} className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#dc2626)] px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <a href={waLink("Hi, I'm interested in the NMIMS Online BBA. Please share more details.")} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
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
