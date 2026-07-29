import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, MessageCircle, GraduationCap, Briefcase, Clock, Award, BookOpen,
  Video, Headphones, ChevronDown, MapPin, Star, ArrowRight, CheckCircle2,
  TrendingUp, Globe2, ShieldCheck, Building2, Landmark, ClipboardCheck,
  FileEdit, FileCheck, CreditCard, Wallet, Smartphone, HelpCircle, CalendarCheck,
  Mail, Quote, Download, BookMarked, Megaphone, UserCog, Layers,
} from "lucide-react";
import t1 from "@/assets/testimonial-1.jpg";
import t2 from "@/assets/testimonial-2.jpg";
import t3 from "@/assets/testimonial-3.jpg";
import { EnquiryForm } from "@/components/landing/EnquiryForm";
import { Counter } from "@/components/landing/Counter";
import {
  Header, Footer, FloatingWA, MobileCTABar, SectionTitle,
  telLink, waLink, CALENDLY_LINK,
} from "@/components/layout/SiteChrome";

export const Route = createFileRoute("/programs/online-diploma")({
  head: () => ({
    meta: [
      { title: "NMIMS Online Diploma Programmes 2026 | 5 Specialisations | Fees & Admission" },
      { name: "description", content: "UGC-entitled 1-year Online Diploma from NMIMS CDOE - choose from Business Management, Finance Management, Marketing Management, HR Management or Operations Management. Fees from ₹55,000/semester. Admissions open 2026." },
      { property: "og:title", content: "NMIMS Online Diploma Programmes 2026 - 5 Specialisations" },
      { property: "og:description", content: "1-year UGC-entitled Online Diploma with 5 specialisation tracks, live classes and flexible learning from NMIMS CDOE. Admissions open for 2026." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/programs/online-diploma" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/programs/online-diploma" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Programs", item: "/programs" },
            { "@type": "ListItem", position: 3, name: "Diploma Programmes", item: "/programs/online-diploma" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "NMIMS Online Diploma Specialisation Tracks",
          itemListElement: tracks.map((tr, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `Diploma in ${tr.name}`,
            description: tr.desc,
          })),
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
  component: OnlineDiplomaPage,
});

const waMessage = "Hi, I'd like to know about the NMIMS Online Diploma Programmes.";

const tracks = [
  { icon: Landmark, name: "Finance Management", desc: "Corporate Finance, Cost & Management Accounting and Capital Market & Portfolio Management - build financial analysis, planning and decision-making expertise.", roles: "Financial Auditor · Financial Planning Analyst · Financial Planner" },
  { icon: Megaphone, name: "Marketing Management", desc: "Sales Management, Brand Management and Consumer Behaviour - learn to analyse market trends and design impactful campaigns.", roles: "Product Manager · Brand Manager" },
  { icon: Briefcase, name: "Business Management", desc: "Deepen your understanding of business frameworks and strategic thinking to navigate diverse business environments and make well-informed managerial decisions.", roles: "Business Strategy Manager · Business Development Manager · Account Manager" },
  { icon: Layers, name: "Operations Management", desc: "Supply Chain Management, Project Management and Operations Management - streamline processes, manage supply chains and boost operational efficiency.", roles: "Operations, Supply Chain & Process Management roles" },
  { icon: UserCog, name: "Human Resource Management", desc: "Compensation, employee policies, organisational behaviour, manpower planning, recruitment & selection and performance management systems.", roles: "Talent Acquisition Manager · Employee Relations Manager · HR Operations Manager" },
];

const COMMON_SEM1 = ["Business Communication", "Financial Accounting", "Marketing Management", "Micro & Macro Economics", "Organisational Behaviour", "Quantitative Methods – I"];

const curriculum = [
  { track: "Finance Management", sem1: COMMON_SEM1, sem2: ["Capital Market and Portfolio Management", "Business Analytics", "Corporate Finance", "Legal Aspect of Business", "Cost & Management Accounting", "Strategic Management"] },
  { track: "Marketing Management", sem1: [...COMMON_SEM1, "Brand Management"], sem2: ["Business Analytics", "Consumer Behaviour", "Legal Aspect of Business", "Sales Management", "Strategic Management"] },
  { track: "Business Management", sem1: COMMON_SEM1, sem2: ["Business Analytics", "Cost & Management Accounting", "Human Resource Management", "Legal Aspect of Business", "Operations Management", "Strategic Management"] },
  { track: "Operations Management", sem1: COMMON_SEM1, sem2: ["Operations Management", "Business Analytics", "Project Management", "Legal Aspect of Business", "Supply Chain Management", "Strategic Management"] },
  { track: "Human Resource Management", sem1: [...COMMON_SEM1, "Human Resource Management"], sem2: ["Business Analytics", "Manpower Planning, Recruitment and Selection", "Legal Aspect of Business", "Performance Management System", "Strategic Management"] },
];

const careerRoles = [
  { icon: Landmark, t: "Financial Auditor", d: "Apply financial analysis, planning and decision-making skills from the Finance Management track." },
  { icon: TrendingUp, t: "Financial Planning Analyst", d: "Build client-facing financial planning expertise grounded in capital markets and portfolio management." },
  { icon: Megaphone, t: "Product / Brand Manager", d: "Lead campaigns and product strategy using brand management and consumer behaviour skills." },
  { icon: Briefcase, t: "Business Strategy Manager", d: "Navigate diverse business environments with strategic thinking and frameworks." },
  { icon: Building2, t: "Business Development Manager", d: "Drive growth and partnerships using business management fundamentals." },
  { icon: Layers, t: "Operations / Supply Chain Roles", d: "Streamline processes and manage supply chains using operations and project management skills." },
  { icon: UserCog, t: "Talent Acquisition Manager", d: "Apply recruitment, selection and manpower planning skills from the HR Management track." },
  { icon: GraduationCap, t: "HR Operations Manager", d: "Align HR strategy with organisational goals using compensation and performance management expertise." },
];

const faqItems = [
  { q: "Are NMIMS Online Diploma Programmes UGC recognised?", a: "Yes. NMIMS CDOE's Diploma Programmes carry UGC-entitled credentials, offered by SVKM's NMIMS - a NAAC A++ accredited, Category 1 Autonomous, NIRF Top-100 deemed university." },
  { q: "What specialisation tracks are available in the Diploma Programmes?", a: "Five one-year diploma specialisations: Finance Management, Marketing Management, Business Management, Operations Management, and Human Resource Management." },
  { q: "How long does the Diploma take to complete?", a: "1 year, delivered across 2 semesters." },
  { q: "What is the fee structure for the Diploma Programmes?", a: "₹1,05,000 as a single full payment, or ₹55,000 per semester across 2 semesters. An admission processing fee of ₹1,200 applies, with an initial ₹10,000 collected at registration and an exam fee of ₹800 per subject per attempt. A loan facility is available even without a credit card, and finance options are available - talk to your counsellor for details." },
  { q: "What is the eligibility criteria for the Diploma Programmes?", a: "HSC (10+2) in any discipline from a recognised board." },
  { q: "What documents are required for admission?", a: "Academic certificates, a work experience letter, identity proof and a passport-size photo, submitted after registration." },
  { q: "How is the Diploma different from the Certificate in Business Management?", a: "The Diploma is a 1-year, 2-semester programme with 5 specialisation tracks to choose from. The Certificate in Business Management is a faster, 6-month, 1-semester generalist programme covering core business fundamentals only, with no specialisation tracks." },
  { q: "Can I switch my specialisation track after enrolling?", a: "Track changes are subject to NMIMS CDOE's academic policy at the time of request - speak to your student counsellor as early as possible if you wish to change your track." },
  { q: "How are exams conducted for the Diploma Programmes?", a: "Exams are conducted online with stringent remote-proctoring systems in place, so you can appear from anywhere." },
];

function OnlineDiplomaPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header activeProgram="Diploma Programmes" />
      <main>
        <Hero />
        <TrustStats />
        <WhyChoose />
        <TrackSelector />
        <Curriculum />
        <LearningExperience />
        <Certificate />
        <CareerOutcomes />
        <Testimonials />
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
    { label: "Duration", value: "1 Year" },
    { label: "Mode", value: "100% Online" },
    { label: "Fees From", value: "₹55,000/sem" },
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
            Online Diploma Programmes from
            <span className="mt-1 block bg-[linear-gradient(135deg,#ef4444,#f97316)] bg-clip-text text-transparent">
              NMIMS University
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-base">
            Fast-track your career with a UGC-entitled, 1-year online diploma from NMIMS CDOE. Choose from 5 specialisation tracks - Finance, Marketing, Business, Operations or HR Management - and build industry-ready skills in half the time of a degree.
          </p>

          <ul className="mt-6 grid max-w-lg gap-2.5 sm:grid-cols-2">
            {[
              { icon: Video, t: "Live Interactive Lectures" },
              { icon: ShieldCheck, t: "UGC-Entitled Credential" },
              { icon: Layers, t: "5 Specialisation Tracks" },
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
    { icon: Clock, t: "Achieve More in Less Time", d: "A focused 1-year diploma - fast-track specialised skills without a multi-year commitment." },
    { icon: Video, t: "Flexible Online Learning", d: "Learn at your own pace while engaging with interactive sessions and enriching resources." },
    { icon: MapPin, t: "Study Anytime, Anywhere", d: "Use the Student Zone via the portal or mobile app for all course materials and updates." },
    { icon: BookOpen, t: "Comprehensive Learning Resources", d: "E-books, journals, lecture transcripts and 24/7 access to recorded lectures." },
    { icon: GraduationCap, t: "Guided by Experts", d: "90+ PhD holders and 120+ faculty from IIT & IIM, with 800+ years of combined industry experience." },
    { icon: Headphones, t: "Dedicated Student Support", d: "The Student Success Team assists with admissions, academics, exams and fee receipts throughout your programme." },
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Key Highlights" title="Thrive with knowledge, lead with confidence" subtitle="A one-year diploma built around flexibility, faculty quality and career-ready skills." />
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

/* ---------- TRACK SELECTOR ---------- */
function TrackSelector() {
  return (
    <section className="py-16 sm:py-24" id="tracks">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="5 Specialisation Tracks" title="Choose your Diploma track" subtitle="Each track is a standalone 1-year, 2-semester diploma - pick the one that matches your career goals." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map(({ icon: Icon, name, desc, roles }, i) => (
            <motion.article
              key={name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFDCE3] text-[#E63950]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-foreground">Diploma in {name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              <p className="mt-3 text-xs font-semibold text-primary">{roles}</p>
              <a href="#enquire" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary transition group-hover:gap-2">
                Get Curriculum <ArrowRight className="h-4 w-4" />
              </a>
            </motion.article>
          ))}
          <div className="flex flex-col items-start justify-center rounded-3xl gradient-primary p-6 text-primary-foreground shadow-card">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
              <HelpCircle className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-bold">Not sure which track fits you?</h3>
            <p className="mt-2 text-sm text-primary-foreground/90">Talk to a counsellor and find the right specialisation for your goals - free of cost.</p>
            <a href="#enquire" className="mt-4 inline-flex items-center gap-1 text-sm font-bold">
              Talk to a Counsellor <ArrowRight className="h-4 w-4" />
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
  const current = curriculum[active];
  return (
    <section className="bg-surface-soft py-16 sm:py-24" id="curriculum">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Curriculum" title="Semester-Wise Syllabus" subtitle="Semester 1 builds a common business foundation across every track; Semester 2 delivers your chosen specialisation." />

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {curriculum.map((c, i) => (
            <button
              key={c.track}
              onClick={() => setActive(i)}
              className={`rounded-full border-2 px-5 py-2 text-sm font-bold transition ${
                active === i ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground/70 hover:border-primary"
              }`}
            >
              {c.track}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-4xl grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Semester 1</h3>
            <div className="grid gap-3">
              {current.sem1.map((subj) => (
                <div key={subj} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-card">
                  <BookOpen className="h-4 w-4 shrink-0 text-primary" />
                  {subj}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">Semester 2</h3>
            <div className="grid gap-3">
              {current.sem2.map((subj) => (
                <div key={subj} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-card">
                  <BookOpen className="h-4 w-4 shrink-0 text-primary" />
                  {subj}
                </div>
              ))}
            </div>
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
            <span className="h-[7px] w-[7px] rounded-full bg-[#ffd7c9]" /> Diploma & Alumni Status
          </span>
          <h2 className="mt-3 font-serif text-2xl font-bold sm:text-[30px] lg:text-[34px]">Earn Your NMIMS Diploma</h2>
          <p className="mt-3 max-w-lg text-white/85">Earn an official Diploma certificate from NMIMS CDOE that recognises your dedication to learning and pursuit of excellence.</p>
          <ul className="mt-6 space-y-3">
            {[
              "UGC-entitled credential from NMIMS CDOE",
              "Issued by NMIMS CDOE - a Deemed University",
              "Shareable on LinkedIn & job portals",
              "Comes with worldwide NMIMS CDOE alumni status",
            ].map((c) => (
              <li key={c} className="flex items-center gap-2.5 text-sm text-white/90">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#8bffb0]" /> {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-white/15 bg-white/[.06] p-6 text-center">
          <img src="/images/certificate-diploma.jpg" alt="NMIMS Online Diploma certificate sample" loading="lazy" className="mx-auto max-h-[320px] rounded-lg border-2 border-[#1c1c1c] shadow-elegant" />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffd68c]/60 px-3 py-1.5 text-xs font-bold text-[#ffd88c]">
              <CheckCircle2 className="h-3.5 w-3.5" /> Official Diploma
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
        <SectionTitle eyebrow="Career Outcomes" title="Where This Diploma Can Take You" subtitle="Each specialisation track is designed to prepare you for specific roles in your chosen field." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {careerRoles.map(({ icon: Icon, t, d }) => (
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

/* ---------- TESTIMONIALS ---------- */
function Testimonials() {
  const items = [
    { img: t1, name: "Aditi Rao", program: "Diploma in Finance Management", quote: "A full MBA wasn't the right fit for my timeline, but this diploma gave me exactly the corporate finance and portfolio management skills I needed for my role - in just a year." },
    { img: t2, name: "Karan Desai", program: "Diploma in Operations Management", quote: "The project management and supply chain subjects were directly applicable at work within weeks. Being able to finish in one year while working full-time made all the difference." },
    { img: t3, name: "Simran Kaur", program: "Diploma in Human Resource Management", quote: "The recruitment, performance management and manpower planning modules gave me the confidence to move into an HR generalist role right after completing the programme." },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Student stories" title="Real outcomes from real learners" />
        <div className="mt-12 relative">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{ opacity: idx === i ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="grid items-center gap-8 rounded-3xl bg-card p-6 shadow-elegant sm:p-10 lg:grid-cols-[auto_1fr] lg:gap-12"
              style={{ display: idx === i ? "grid" : "none" }}
            >
              <img src={it.img} alt={it.name} loading="lazy" width={512} height={512} className="mx-auto h-28 w-28 rounded-full object-cover shadow-card ring-4 ring-[color:var(--gold)]/40 sm:h-36 sm:w-36 lg:mx-0" />
              <div>
                <Quote className="h-6 w-6 text-[color:var(--gold)]" />
                <blockquote className="mt-2 text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                  "{it.quote}"
                </blockquote>
                <p className="mt-4 font-extrabold text-foreground">{it.name}</p>
                <p className="text-sm text-muted-foreground">{it.program}</p>
              </div>
            </motion.div>
          ))}
          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-2 rounded-full transition-all ${idx === i ? "w-8 gradient-primary" : "w-2 bg-border"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FEES ---------- */
const DIPLOMA_FEE_PLANS = [
  { opt: "Option 1", title: "Full Payment", price: "₹1,05,000", suffix: "one-time", bullets: ["Single one-time payment", "No further instalments", "Lower than the semester-wise total"] },
  { opt: "Option 2", title: "Semester-Wise Payment", price: "₹55,000", suffix: "/ semester", bullets: ["2 instalments across the year", "Pay per semester", "Easier on monthly budget"] },
];

function Fees() {
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Fees & Payment" title="Fee Structure" subtitle="Select a payment plan that works for you - pay in full or split across 2 semesters." />
        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          {DIPLOMA_FEE_PLANS.map(({ opt, title, price, suffix, bullets }) => (
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
        <div className="mx-auto mt-8 max-w-3xl space-y-2.5 rounded-2xl border border-border bg-card p-6 text-xs text-muted-foreground shadow-card">
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Admission processing fee of ₹1,200 applies to all admissions; an initial ₹10,000 from the programme fee is collected at registration.</p>
          <p className="flex gap-2"><Wallet className="h-4 w-4 shrink-0 text-primary" /> Exam fee: ₹800 per subject per attempt.</p>
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
    ["Duration", "1 Year (2 Semesters)"],
    ["Specialisation Tracks", "5"],
    ["Subjects per Semester", "5–7 (varies by track)"],
    ["Credential", "UGC-entitled Diploma"],
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
        <SectionTitle eyebrow="Admission Process" title="How to Get Admission" subtitle="A simple 4-step process to begin your Diploma journey with NMIMS CDOE." />
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
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-surface-soft py-16 sm:py-24" id="faq">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Frequently Asked Questions" title="Everything you need to know" />
        <div className="mt-12 space-y-3">
          {faqItems.map((it, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
                aria-expanded={open === i}
              >
                <span className="font-bold text-foreground">{it.q}</span>
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
          Get a callback, chat instantly on WhatsApp, or join a free info session to learn more about the NMIMS Online Diploma Programmes.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <a href={telLink} className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#dc2626)] px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <a href={waLink("Hi, I'm interested in the NMIMS Online Diploma Programmes. Please share more details.")} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
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
