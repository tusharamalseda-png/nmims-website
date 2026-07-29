import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, MessageCircle, GraduationCap, Briefcase, Clock, Award, Users, BookOpen,
  Laptop, Video, Headphones, ChevronDown, MapPin, Star, ArrowRight,
  TrendingUp, Globe2, Sparkles, ShieldCheck, BarChart3, Building2, Cpu, Megaphone,
  Calculator, UserCog, Menu, X, FileEdit, FileCheck, CreditCard, CheckCircle2, HelpCircle,
} from "lucide-react";
import careerImg from "@/assets/career-growth.jpg";
import gCampus from "@/assets/gallery-campus.jpg";
import gClass from "@/assets/gallery-classroom.jpg";
import gEvents from "@/assets/gallery-events.jpg";
import gStudents from "@/assets/gallery-students.jpg";
import gFacilities from "@/assets/gallery-facilities.jpg";
import t1 from "@/assets/testimonial-1.jpg";
import t2 from "@/assets/testimonial-2.jpg";
import t3 from "@/assets/testimonial-3.jpg";
import { EnquiryForm } from "@/components/landing/EnquiryForm";
import { Counter } from "@/components/landing/Counter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Online MBA & Degree Programs | UGC-Entitled Admissions Open 2026" },
      { name: "description", content: "Earn a UGC-entitled online degree from India's top-ranked university. Live classes, career services & flexible learning. Admissions open - talk to a counsellor today." },
      { property: "og:title", content: "Online Degree Programs - Admissions Open 2026" },
      { property: "og:description", content: "UGC-entitled online MBA, MCA, BBA & more. Live classes, career services, flexible learning." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "NMIMS Online - Affiliate Enquiry Partner for NMIMS CDOE",
          url: "/",
          description: "Affiliate Enquiry Partner (AEP) for NMIMS Centre for Distance and Online Education (CDOE).",
          areaServed: "IN",
        }),
      },
    ],
  }),
  component: Index,
});

const PHONE = "+919876543210";
const WA = "919876543210";
const waLink = `https://wa.me/${WA}?text=${encodeURIComponent("Hi, I'd like to know about admissions.")}`;
const telLink = `tel:${PHONE}`;
// TODO: replace with the real Calendly event link once available
const CALENDLY_LINK = "https://calendly.com/nmims-online/counseling";

const programMenuItems = [
  { label: "Online MBA", href: "/programs/online-mba" },
  { label: "Online BBA", href: "/programs/online-bba" },
  { label: "Online B.Com", href: "/programs/online-bcom" },
  { label: "Diploma Programmes", href: "/programs/online-diploma" },
  { label: "Certificate Course", href: "/programs/online-certificate" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <CareerGrowth />
        <Gallery />
        <Programs />
        <Specializations />
        <WhyChoose />
        <Counters />
        <CampusSection />
        <AdmissionProcess />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingWA />
      <MobileCTABar />
    </div>
  );
}

/* ---------- HEADER ---------- */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled ? "border-b border-border bg-background/95 backdrop-blur-lg shadow-card" : "border-b border-transparent bg-background/80 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex shrink-0 items-center">
          <img
            src="/images/nmimslogo.webp"
            alt="NMIMS Centre for Distance and Online Education"
            className="h-10 w-auto sm:h-12"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          <a href="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-secondary hover:text-foreground">
            Home
          </a>
          <a href="/about" className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-secondary hover:text-foreground">
            About us
          </a>

          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-secondary hover:text-foreground"
            >
              Programs
              <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>
            <div className="invisible absolute left-0 top-full z-20 w-56 translate-y-1 rounded-xl border border-border bg-card p-2 opacity-0 shadow-elegant transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              {programMenuItems.map((p) => (
                <a
                  key={p.label}
                  href={p.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-secondary hover:text-foreground"
                >
                  {p.label}
                </a>
              ))}
            </div>
          </div>

          <a href="/blog" className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-secondary hover:text-foreground">
            Blog
          </a>
          <a href="/contact-us" className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-secondary hover:text-foreground">
            Contact Us
          </a>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <a
            href="/contact-us"
            className="inline-flex items-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-card transition hover:border-primary hover:text-primary"
          >
            Apply Now
          </a>
          <a
            href={CALENDLY_LINK}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center rounded-xl gradient-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-card transition hover:scale-[1.02]"
          >
            Book Counseling
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              <a href="/" className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/85 hover:bg-secondary">
                Home
              </a>
              <a href="/about" className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/85 hover:bg-secondary">
                About us
              </a>

              <button
                type="button"
                onClick={() => setMobileProgramsOpen((v) => !v)}
                aria-expanded={mobileProgramsOpen}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/85 hover:bg-secondary"
              >
                Programs
                <ChevronDown className={`h-4 w-4 transition ${mobileProgramsOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileProgramsOpen && (
                <div className="ml-3 flex flex-col gap-0.5 border-l border-border pl-3">
                  {programMenuItems.map((p) => (
                    <a key={p.label} href={p.href} className="rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-secondary">
                      {p.label}
                    </a>
                  ))}
                </div>
              )}

              <a href="/blog" className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/85 hover:bg-secondary">
                Blog
              </a>
              <a href="/contact-us" className="rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/85 hover:bg-secondary">
                Contact Us
              </a>

              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
                <a
                  href="/contact-us"
                  className="rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground"
                >
                  Apply Now
                </a>
                <a
                  href={CALENDLY_LINK}
                  target="_blank"
                  rel="noopener"
                  className="rounded-xl gradient-primary px-4 py-2.5 text-center text-sm font-bold text-primary-foreground"
                >
                  Book Counseling
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#1f1b2e]">
      <img
        src="/images/about.webp" alt="" aria-hidden loading="eager"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(31,27,46,0.92)_15%,rgba(42,36,64,0.55)_55%,rgba(58,47,85,0.35)_100%)]" aria-hidden />
      {/* decorative glows */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#ef4444]/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#a855f7]/20 blur-3xl" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-8 lg:px-8">
        {/* LEFT - copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur ring-1 ring-white/20">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ef4444]" />
            UGC Approved · Admissions Open 2026
          </span>
          <h1 className="mt-4 font-serif text-3xl font-extrabold leading-[1.15] sm:text-4xl lg:text-[40px]">
            <span className="whitespace-nowrap">NMIMS ONLINE</span>
            <span className="mt-1 block whitespace-nowrap bg-[linear-gradient(135deg,#ef4444,#f97316)] bg-clip-text text-transparent">
              MBA | BBA | BCOM
            </span>
          </h1>
          <p className="mt-2 text-lg font-bold text-white/95 sm:text-xl">One Degree, Unlimited Opportunities</p>
          <p className="mt-2 max-w-xl text-sm text-white/75 sm:text-base">
            Advance your career with NMIMS Online - offering UGC Approved Online MBA, Online BBA & Online BCom programs for students, freshers and working professionals across INDIA.
          </p>

          <ul className="mt-6 grid max-w-lg gap-2.5 sm:grid-cols-2">
            {[
              { icon: Video, t: "Live Interactive Lectures" },
              { icon: ShieldCheck, t: "UGC Approved Degree" },
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

        {/* RIGHT - form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto w-full max-w-[420px]"
        >
          <EnquiryForm compact />
        </motion.div>
      </div>

      {/* trust strip */}
      <div className="relative border-t border-white/10 bg-black/20 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-xs font-semibold text-white/80 sm:gap-x-10 sm:text-sm">
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#fbbf24]" /> UGC Approved</span>
          <span className="flex items-center gap-2"><Award className="h-4 w-4 text-[#fbbf24]" /> NAAC A++</span>
          <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" /> 4.8/5 · 12,000+ learners</span>
          <span className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-[#fbbf24]" /> 200+ cities across India</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- CAREER GROWTH ---------- */
function CareerGrowth() {
  const items = [
    { icon: TrendingUp, t: "Career Growth", d: "Average 60% salary hike reported by graduates within 12 months." },
    { icon: Award, t: "Industry Recognition", d: "Degree recognised by leading employers and government bodies." },
    { icon: Clock, t: "Flexible Learning", d: "Study evenings & weekends without pausing your career." },
    { icon: Sparkles, t: "Skill Development", d: "Industry-aligned electives, projects and capstone with mentors." },
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-3xl gradient-primary opacity-20 blur-2xl" aria-hidden />
          <img src={careerImg} alt="Career growth" loading="lazy" className="relative rounded-3xl shadow-elegant" width={1200} height={1200} />
          <div className="absolute -bottom-6 -right-4 rounded-2xl bg-card p-4 shadow-elegant sm:-right-6">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl gradient-gold">
                <TrendingUp className="h-5 w-5 text-accent-foreground" />
              </span>
              <div>
                <p className="text-2xl font-extrabold text-foreground">+60%</p>
                <p className="text-xs text-muted-foreground">Avg. salary growth</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e7d6ff] bg-[#F6EDFF] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#3F3083]">
            <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#e0527a]" />
            Why upgrade now
          </span>
          <h2 className="mt-3 font-serif text-2xl font-bold text-foreground sm:text-[30px] lg:text-[34px]">
            Elevate Your <span className="text-gradient">Career</span>
          </h2>
          <p className="mt-3 max-w-lg text-base text-muted-foreground">
            A globally recognised degree from a top-ranked Indian university - designed for working professionals who want measurable growth.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {items.map(({ icon: Icon, t, d }) => (
              <li key={t} className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-1 hover:shadow-elegant">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="mt-3 text-base font-bold text-foreground">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- GALLERY ---------- */
function Gallery() {
  const imgs = [
    { src: gCampus, label: "Campus" },
    { src: gClass, label: "Classrooms" },
    { src: gEvents, label: "Events" },
    { src: gStudents, label: "Students" },
    { src: gFacilities, label: "Facilities" },
  ];
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Inside the university" title="A campus built for ambition" />
        <div className="mt-10 -mx-4 flex gap-4 overflow-x-auto px-4 hide-scrollbar sm:gap-6">
          {imgs.map((i, idx) => (
            <motion.figure
              key={i.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="group relative shrink-0 overflow-hidden rounded-3xl shadow-card"
              style={{ width: "min(80vw, 380px)", aspectRatio: "4/3" }}
            >
              <img src={i.src} alt={i.label} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 text-sm font-bold text-white">
                {i.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- PROGRAMS ---------- */
function Programs() {
  const list = [
    { icon: Briefcase, name: "Online MBA", dur: "2 Years", high: ["7+ specialisations", "Live faculty sessions", "Career services"], href: "/programs/online-mba" },
    { icon: BookOpen, name: "Online BBA", dur: "3 Years", high: ["Marketing, Finance & Analytics", "Business fundamentals", "Career services"], href: "/programs/online-bba" },
    { icon: Calculator, name: "Online B.Com", dur: "3 Years", high: ["Accounting & finance core", "Taxation & audit", "UGC-DEB approved"], href: "/programs/online-bcom" },
    { icon: Award, name: "Diploma Programmes", dur: "1 Year", high: ["5 specialisation tracks", "Fast-track upskilling", "2 semesters"], href: "/programs/online-diploma" },
    { icon: Laptop, name: "Certificate Course", dur: "6 Months", high: ["Business Management focus", "Fast-track format", "1 semester"], href: "/programs/online-certificate" },
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24" id="programs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Explore programs" title="UGC-entitled degrees designed for working professionals" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(({ icon: Icon, name, dur, high, href }, i) => (
            <motion.article
              key={name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full gradient-primary opacity-10 blur-2xl transition group-hover:opacity-20" />
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-card">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-foreground">{name}</h3>
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Clock className="h-3.5 w-3.5" /> Duration: {dur}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {high.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--gold)]" />
                    {h}
                  </li>
                ))}
              </ul>
              <a href={href} className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-primary transition group-hover:gap-2">
                {href === "#enquire" ? "Get Curriculum" : "Learn More"} <ArrowRight className="h-4 w-4" />
              </a>
            </motion.article>
          ))}
          <div className="flex flex-col items-start justify-center rounded-3xl gradient-primary p-6 text-primary-foreground shadow-card">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <HelpCircle className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-xl font-extrabold">Not sure which program fits you?</h3>
            <p className="mt-2 text-sm text-primary-foreground/90">Talk to a counsellor and find the right degree for your goals - free of cost.</p>
            <a href="/contact-us" className="mt-6 inline-flex items-center gap-1 text-sm font-bold">
              Talk to a Counsellor <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SPECIALIZATIONS ---------- */
function Specializations() {
  const items = [
    { icon: BarChart3, t: "Finance" },
    { icon: Briefcase, t: "Business Management" },
    { icon: Megaphone, t: "Marketing" },
    { icon: UserCog, t: "Human Resources" },
    { icon: Building2, t: "Operations & Data Science" },
    { icon: Cpu, t: "IT Management" },
    { icon: TrendingUp, t: "Business Analytics" },
  ];
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="MBA Specializations" title="Choose a track that matches your ambition" />
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {items.map(({ icon: Icon, t }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group flex w-[calc(50%-0.5rem)] flex-col items-center rounded-2xl border border-border bg-card p-5 text-center shadow-card transition hover:-translate-y-1 hover:border-primary hover:shadow-elegant sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary transition group-hover:gradient-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-bold text-foreground">{t}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- WHY CHOOSE ---------- */
function WhyChoose() {
  const items = [
    { icon: Video, t: "Live Interactive Classes", d: "Weekend live sessions with award-winning faculty and real-time Q&A." },
    { icon: Laptop, t: "Recorded Sessions", d: "Lifetime access to high-quality recordings - learn at your pace." },
    { icon: GraduationCap, t: "Experienced Faculty", d: "Learn from experienced academicians and industry leaders with 15+ years of experience." },
    { icon: Briefcase, t: "Career Services", d: "1:1 career coaching, resume review and access to 700+ hiring partners." },
    { icon: Clock, t: "Flexible Learning", d: "Study evenings & weekends without putting your career on hold." },
    { icon: Headphones, t: "24×7 Student Support", d: "Dedicated mentors, doubt-solving and academic guidance whenever you need." },
  ];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Why students choose us" title="Everything you need to succeed, in one place" />
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

/* ---------- COUNTERS ---------- */
function Counters() {
  const items = [
    { n: 75000, s: "+", l: "Students Enrolled" },
    { n: 120000, s: "+", l: "Strong Alumni Network" },
    { n: 700, s: "+", l: "Hiring Partners" },
    { n: 60, s: "%", l: "Avg. Career Growth" },
  ];
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(120deg,#7154EA,#3F3083)] py-16 text-white sm:py-20">
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

/* ---------- CAMPUS / UNIVERSITY ---------- */
function CampusSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.img
          src="/images/about.webp" alt="NMIMS CDOE campus building" loading="lazy" width={1600} height={1000}
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="rounded-3xl shadow-elegant"
        />
        <div>
          <SectionTitle align="left" eyebrow="The University" title="A legacy of excellence, recognised globally" />
          <p className="mt-4 text-muted-foreground">
            Founded in 1981, SVKM's Narsee Monjee Institute of Management Studies (NMIMS) is one of India's most reputed multi-disciplinary universities, achieving Deemed-to-be-University status from the UGC in 2003.
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-secondary p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-foreground">
              <strong className="font-bold">Main Campus:</strong> SVKM's NMIMS, V.L. Mehta Road, Vile Parle (West), Mumbai, Maharashtra, India
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
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Admission Process" title="How to Get Admission" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

/* ---------- TESTIMONIALS ---------- */
function Testimonials() {
  const items = [
    { img: t1, name: "Rohit Sharma", program: "Online MBA - Marketing", quote: "The live mentor sessions changed how I approach my role. I got promoted to Marketing Manager within 8 months of joining the program." },
    { img: t2, name: "Priya Menon", program: "Online MCA", quote: "Flexible classes meant I could keep my full-time job. With help from career services on my resume and interview prep, I moved into a senior developer role with a 70% hike." },
    { img: t3, name: "Amit Kulkarni", program: "Online MBA - Finance", quote: "Faculty quality is on par with top B-schools. The capstone project gave me confidence to lead my own FP&A team." },
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
              animate={{ opacity: idx === i ? 1 : 0, x: idx === i ? 0 : 30, position: idx === i ? "relative" : "absolute" }}
              transition={{ duration: 0.5 }}
              className="inset-0 grid items-center gap-8 rounded-3xl bg-card p-6 shadow-elegant sm:p-10 lg:grid-cols-[auto_1fr] lg:gap-12"
              style={{ display: idx === i ? "grid" : "none" }}
            >
              <img src={it.img} alt={it.name} loading="lazy" width={512} height={512} className="mx-auto h-28 w-28 rounded-full object-cover shadow-card ring-4 ring-[color:var(--gold)]/40 sm:h-36 sm:w-36 lg:mx-0" />
              <div>
                <div className="flex gap-1 text-[color:var(--gold)]">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                </div>
                <blockquote className="mt-3 text-lg font-medium leading-relaxed text-foreground sm:text-xl">
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

/* ---------- FAQ ---------- */
function FAQ() {
  const items = [
    { q: "Who is eligible for the online programs?", a: "Eligibility varies by program. Generally, UG programs require 10+2 from a recognised board; PG programs require a recognised bachelor's degree with 50% marks (45% for reserved categories)." },
    { q: "What is the fee structure and are EMIs available?", a: "Program fees start from ₹33,000 per year for the Online B.Com, ranging up to ₹1,05,000 per year for the Online MBA and Diploma programs. No-cost EMI options over 3, 6, 9 or 12 months are available. Currently, no scholarships or concessions are available for the general category; a 20% fee concession applies for defence personnel and their immediate family." },
    { q: "How does the admission process work?", a: "1) Submit enquiry · 2) Counselling call · 3) Online application · 4) Document upload · 5) Fee payment & enrollment. Most admissions are confirmed within 48–72 hours." },
    { q: "Do you provide career support after the program?", a: "Yes. Our Career Services team offers 1:1 career coaching, resume reviews, mock interviews and access to a network of 700+ hiring partners across India and abroad. Direct campus placements are not offered - support is guidance and access, not a placement guarantee." },
    { q: "What is the program duration and validity?", a: "UG programs are 3 years (max 6), PG programs are 2 years (max 4). All degrees are UGC-DEB entitled and equivalent to on-campus degrees." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-surface-soft py-16 sm:py-24" id="faq">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Frequently Asked Questions" title="Everything you need to know" />
        <div className="mt-10 space-y-3">
          {items.map((it, i) => (
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

/* ---------- FINAL CTA ---------- */
function FinalCTA() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] gradient-primary p-8 text-center shadow-elegant sm:p-16">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-[color:var(--gold)]/30 blur-3xl" />
        <span className="relative inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold text-white ring-1 ring-white/30">
          <Sparkles className="h-3.5 w-3.5" /> Limited seats - last 7 days
        </span>
        <h2 className="relative mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
          Admissions Open
        </h2>
        <p className="relative mx-auto mt-4 max-w-2xl text-white/90 sm:text-lg">
          Join 75,000+ ambitious learners. Start your UGC-entitled online degree today and unlock the career you deserve.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <a href="#enquire" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-primary shadow-elegant transition hover:scale-[1.03]">
            Apply Now <ArrowRight className="h-4 w-4" />
          </a>
          <a href={telLink} className="inline-flex items-center gap-2 rounded-xl bg-foreground/30 px-6 py-3.5 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-foreground/40">
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <a href={waLink} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--whatsapp)] px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="bg-foreground pb-28 pt-16 text-white/80 sm:pb-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <a href="/" className="inline-flex items-center rounded-lg bg-white px-3 py-2">
            <img
              src="/images/nmimslogo.webp"
              alt="NMIMS Centre for Distance and Online Education"
              className="h-8 w-auto"
            />
          </a>
          <p className="mt-4 max-w-md text-sm">
            NMIMS Centre for Distance and Online Education (CDOE) is one of India's leading institutions for flexible, career-focused online education, offering UGC-entitled online degrees for working professionals.
          </p>
          <div className="mt-5 space-y-2 text-sm">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[color:var(--gold)]" /> {PHONE}</p>
            <p className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[color:var(--gold)]" /> Chat with us on WhatsApp</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="/" className="hover:text-[color:var(--gold)]">Home</a></li>
            <li><a href="/about" className="hover:text-[color:var(--gold)]">About us</a></li>
            <li><a href="/programs" className="hover:text-[color:var(--gold)]">Programs</a></li>
            <li><a href="/blog" className="hover:text-[color:var(--gold)]">Blog</a></li>
            <li><a href="/contact-us" className="hover:text-[color:var(--gold)]">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Programs</p>
          <ul className="mt-3 space-y-2 text-sm">
            {programMenuItems.map((p) => (
              <li key={p.label}><a href={p.href} className="hover:text-[color:var(--gold)]">{p.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#" className="hover:text-[color:var(--gold)]">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[color:var(--gold)]">Terms of Service</a></li>
            <li><a href="#" className="hover:text-[color:var(--gold)]">Disclaimer</a></li>
            <li><a href="#" className="hover:text-[color:var(--gold)]">Refund Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-white/10 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="disclaimer-ticker">
            <div className="disclaimer-ticker-track">
              {[0, 1].map((k) => (
                <span key={k} className="whitespace-nowrap pr-[70px] text-xs leading-relaxed text-white/60" aria-hidden={k === 1}>
                  <strong className="text-white/80">Disclaimer:</strong> We are an Affiliate Enquiry Partner (AEP) for NMIMS CDOE. Our role is limited to providing verified program information and assisting students with the application process. All admissions, academic decisions, program delivery, examinations, and certifications are solely handled and governed by NMIMS CDOE.
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-4 max-w-7xl px-4 text-xs text-white/60 sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} NMIMS Online. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ---------- FLOATING / STICKY ---------- */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.48 1.32 5L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.83 14.16c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.13.11-1.82-.11-.42-.14-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.14.11.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.16-.19.7-.82.89-1.1.19-.28.37-.24.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

function FloatingWA() {
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div className="relative w-[270px] rounded-2xl bg-white p-4 text-[13px] text-[#333] shadow-elegant">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute -right-2.5 -top-2.5 grid h-6 w-6 place-items-center rounded-full border-[1.5px] border-[#e2e2e2] bg-white text-[#555] shadow-md"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="mb-2 flex items-center gap-2 text-[13.5px] font-bold text-foreground">
            <img
              src="/images/nmims-online-icon.png"
              alt="NMIMS Online"
              className="h-[26px] w-[26px] shrink-0 rounded-full object-cover"
            />
            NMIMS Online - Online Now
          </div>
          <p className="mb-3 leading-relaxed">
            👋 Interested in NMIMS Online?
            <br />
            Get free counselling from our expert instantly!
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-[12.5px] font-semibold text-white"
          >
            <WhatsAppGlyph className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        className="grid h-[58px] w-[58px] place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(0,0,0,0.25)] transition hover:scale-105"
      >
        <WhatsAppGlyph className="h-7 w-7" />
      </button>
    </div>
  );
}

function MobileCTABar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-border bg-card/95 p-3 shadow-elegant backdrop-blur sm:hidden">
      <a href={telLink} className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-3 text-xs font-bold text-foreground">
        <Phone className="h-4 w-4" /> Call
      </a>
      <a href={waLink} target="_blank" rel="noopener" className="flex items-center justify-center gap-1.5 rounded-xl bg-[color:var(--whatsapp)] py-3 text-xs font-bold text-white">
        <MessageCircle className="h-4 w-4" /> WhatsApp
      </a>
      <a href="#enquire" className="flex items-center justify-center gap-1.5 rounded-xl gradient-primary py-3 text-xs font-bold text-primary-foreground">
        Enquire <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

/* ---------- shared ---------- */
function SectionTitle({ eyebrow, title, align = "center" }: { eyebrow: string; title: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-xl"}>
      <span className={`inline-flex items-center gap-2 rounded-full border border-[#e7d6ff] bg-[#F6EDFF] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#3F3083] ${align === "left" ? "" : "mx-auto"}`}>
        <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#e0527a]" />
        {eyebrow}
      </span>
      <h2 className="mt-3 text-balance font-serif text-2xl font-bold leading-tight text-foreground sm:text-[30px] lg:text-[34px]">{title}</h2>
    </div>
  );
}
