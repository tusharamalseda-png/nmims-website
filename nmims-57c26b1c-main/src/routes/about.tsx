import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, MessageCircle, ArrowRight, ChevronDown, HelpCircle, Mail, CalendarCheck,
  ShieldCheck, Award, Star, Globe2, GraduationCap, Briefcase, Building2, Rocket,
  UserCog, Handshake, Wallet, MapPin, Users, Clock, CheckCircle2, FileSearch,
  HeartHandshake,
} from "lucide-react";
import { EnquiryForm } from "@/components/landing/EnquiryForm";
import { Counter } from "@/components/landing/Counter";
import {
  Header, Footer, FloatingWA, MobileCTABar, SectionTitle,
  telLink, waLink, CALENDLY_LINK,
} from "@/components/layout/SiteChrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | NMIMS Online - Authorized NMIMS CDOE Enquiry Partner in Gujarat Since 2018" },
      { name: "description", content: "NMIMS Online is an Authorized NMIMS CDOE Enquiry Partner (AEP) counselling students and working professionals across Gujarat since 2018. Free, transparent guidance from enquiry to graduation - learn our story, our role, and how we work with NMIMS CDOE." },
      { property: "og:title", content: "About NMIMS Online - Authorized NMIMS CDOE Enquiry Partner" },
      { property: "og:description", content: "An Authorized NMIMS CDOE Enquiry Partner serving Gujarat since 2018 - free counselling, transparent guidance, and end-to-end admission support." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "About Us", item: "/about" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "NMIMS Online",
          description: "An Authorized NMIMS CDOE Enquiry Partner (AEP) - an independent education counselling business, not NMIMS University or NMIMS CDOE itself - providing free admission counselling for NMIMS CDOE's online degree programs across Gujarat since 2018.",
          foundingDate: "2018",
          areaServed: gujaratCities.map((c) => ({ "@type": "City", name: c })),
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
  component: AboutPage,
});

const waMessage = "Hi, I'd like to know more about NMIMS Online and how you help with NMIMS CDOE admissions.";

const gujaratCities = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhidham", "Bhuj", "Kutch", "Bharuch", "Navsari", "Vapi"];

const personas = [
  { icon: GraduationCap, t: "Fresh Graduates", d: "Starting a career and looking for a recognised degree that opens doors from day one." },
  { icon: Briefcase, t: "Working Professionals", d: "0–15 years of experience, upgrading qualifications without pausing their career." },
  { icon: Building2, t: "Entrepreneurs & Business Owners", d: "Building formal management knowledge alongside running a business." },
  { icon: Users, t: "Family Business Professionals", d: "Bringing structured business education into a family enterprise." },
  { icon: Rocket, t: "Career Switchers", d: "Moving into management or a new function and need a credible degree to back the switch." },
  { icon: UserCog, t: "Leadership Aspirants", d: "Preparing for promotion or a leadership role that expects a postgraduate qualification." },
];

const whyChoose = [
  { icon: ShieldCheck, t: "Authorized NMIMS CDOE Enquiry Partner", d: "Associated with NMIMS CDOE since 2018, helping students make informed decisions with complete transparency." },
  { icon: Users, t: "Trusted Across Gujarat", d: "Thousands of students and working professionals counselled across 10 cities - and counting." },
  { icon: Clock, t: "15+ Years of Counselling Experience", d: "Our team has guided students through every stage of the admission journey, long before this partnership began." },
  { icon: Handshake, t: "1:10 Counsellor-to-Student Ratio", d: "Personalised attention for every learner instead of a call-centre queue." },
  { icon: CheckCircle2, t: "End-to-End Assistance", d: "From your first enquiry through documentation, fee guidance and exams, to graduation." },
  { icon: HeartHandshake, t: "Support That Doesn't Stop at Admission", d: "We continue assisting with university processes and academic queries even after you enrol." },
];

const faqItems = [
  { q: "Is NMIMS Online the official NMIMS CDOE website?", a: "No. We are an Authorized NMIMS CDOE Enquiry Partner (AEP) - an independent counselling business, not NMIMS University or NMIMS CDOE itself. Admissions, academics, examinations and certification are solely managed by NMIMS CDOE; our role is limited to counselling, enquiry assistance and application support." },
  { q: "Do I have to pay any fee for your counselling services?", a: "No. Our counselling, admission guidance and application support are completely free for students. You only ever pay the official programme fee directly towards NMIMS CDOE." },
  { q: "Which cities in Gujarat do you serve?", a: "Ahmedabad, Surat, Vadodara, Rajkot, Gandhidham, Bhuj, Kutch, Bharuch, Navsari and Vapi." },
  { q: "Since when have you been an NMIMS CDOE Enquiry Partner?", a: "We've been an Authorized NMIMS CDOE Enquiry Partner since 2018, counselling students and working professionals across Gujarat." },
  { q: "What exactly do you help with, and what does NMIMS CDOE handle?", a: "We help with enquiry guidance, documentation, application submission, fee and EMI guidance, ABC ID/DEB ID setup, and post-admission support. Programme delivery, examinations, evaluation and certification are solely handled and governed by NMIMS CDOE - we have no role in those." },
  { q: "Is my enquiry registered with NMIMS CDOE, or only with you?", a: "As an authorised partner, your enquiry is registered directly with NMIMS CDOE, so your admission stays fully recognised and traceable through official channels - not just noted on our end." },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <TrackRecord />
        <OurStory />
        <WhoWeServe />
        <WhyChooseUs />
        <CityPresence />
        <AboutUniversity />
        <OurRole />
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
  return (
    <section className="relative overflow-hidden bg-[#1f1b2e]">
      <img
        src="/images/about.webp" alt="" aria-hidden loading="eager"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(31,27,46,0.93)_15%,rgba(42,36,64,0.6)_55%,rgba(58,47,85,0.4)_100%)]" aria-hidden />
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[#ef4444]/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#a855f7]/20 blur-3xl" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-[60px] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur ring-1 ring-white/20">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ef4444]" />
            Authorized NMIMS CDOE Enquiry Partner
          </span>
          <h1 className="mt-5 font-serif text-3xl font-extrabold leading-[1.15] sm:text-4xl lg:text-[44px]">
            Your NMIMS CDOE Affiliate Enquiry Partner,
            <span className="mt-1 block bg-[linear-gradient(135deg,#ef4444,#f97316)] bg-clip-text text-transparent">
              In Gujarat Since 2018
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-base">
            We sell no degree of our own - we sell honest guidance. Free, personalised counselling for NMIMS CDOE's UGC-DEB approved online degrees, with a 1:10 counsellor-to-student ratio and support that runs from your first enquiry to graduation.
          </p>

          <ul className="mt-6 grid max-w-lg gap-2.5 sm:grid-cols-2">
            {[
              { icon: ShieldCheck, t: "Authorized Enquiry Partner" },
              { icon: Wallet, t: "Free Counselling, Always" },
              { icon: Handshake, t: "1:10 Counsellor Ratio" },
              { icon: MapPin, t: "10 Cities Across Gujarat" },
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
              Talk to a Counsellor <ArrowRight className="h-4 w-4" />
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
          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#fbbf24]" /> Authorized AEP Since 2018</span>
          <span className="flex items-center gap-2"><Award className="h-4 w-4 text-[#fbbf24]" /> Represents a NAAC A++ University</span>
          <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" /> Zero Cost to Students</span>
          <span className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-[#fbbf24]" /> 10 Cities Across Gujarat</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- TRACK RECORD ---------- */
function TrackRecord() {
  const items = [
    { n: 2018, s: "", l: "Authorized Partner Since" },
    { n: 15, s: "+", l: "Years Counselling Experience" },
    { n: 10, s: "", l: "Gujarat Cities Served" },
    { n: 1, s: ":10", l: "Counsellor-to-Student Ratio" },
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

/* ---------- OUR STORY ---------- */
function OurStory() {
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Our Story" title="We sell guidance, not a degree" />
        <div className="mt-8 space-y-4 text-muted-foreground">
          <p>
            Since 2018, we've worked as an Authorized NMIMS CDOE Enquiry Partner (AEP), counselling students and working professionals across Gujarat - Ahmedabad, Surat, Vadodara, Rajkot, Gandhidham, Bhuj, Kutch, Bharuch, Navsari and Vapi - through the process of enrolling in NMIMS CDOE's UGC-DEB approved online degree programmes.
          </p>
          <p>
            We don't award the degree, run the classes, or conduct the exams - NMIMS CDOE does all of that. What we do is sit with a fresh graduate, a working professional weighing an MBA against their job, or a family-business owner deciding between BBA and B.Com, and help them make that decision with complete, honest information: real fees, real eligibility, real timelines - no pressure, no hidden cost.
          </p>
          <p>
            Our team brings 15+ years of combined counselling experience to that conversation, and we deliberately keep our counsellor-to-student ratio close to 1:10 so that guidance stays personal rather than turning into a call-centre script. That support doesn't end at admission - we stay reachable for documentation, fee and EMI queries, ABC ID/DEB ID setup, and academic process questions all the way through to graduation.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- WHO WE SERVE ---------- */
function WhoWeServe() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Who We Serve" title="Built for every kind of ambition" subtitle="Our programmes and guidance are designed for ambitious individuals balancing work, business or personal commitments." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map(({ icon: Icon, t, d }, i) => (
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

/* ---------- WHY CHOOSE US ---------- */
function WhyChooseUs() {
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Why Choose Us" title="Choosing the right admission partner matters too" subtitle="Not just which university - who guides you there." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map(({ icon: Icon, t, d }, i) => (
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

/* ---------- CITY PRESENCE ---------- */
function CityPresence() {
  const track = [...gujaratCities, ...gujaratCities];
  return (
    <section className="py-16 text-center sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Our Presence" title="A counsellor in your city - not a call centre" subtitle="We counsel students across 10 major cities in Gujarat, in person and online." />
      </div>
      <div className="mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max animate-[city-scroll-about_28s_linear_infinite] gap-4 hover:[animation-play-state:paused]">
          {track.map((city, i) => (
            <span key={`${city}-${i}`} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-border bg-card px-6 py-3.5 text-sm font-bold text-[#3F3083] shadow-card">
              <MapPin className="h-4 w-4 text-primary" /> {city}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes city-scroll-about {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

/* ---------- ABOUT THE UNIVERSITY ---------- */
function AboutUniversity() {
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.img
          src="/images/about.webp" alt="NMIMS CDOE campus building" loading="lazy" width={1600} height={1000}
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="rounded-3xl shadow-elegant lg:order-2"
        />
        <div>
          <SectionTitle align="left" eyebrow="The University We Represent" title="NMIMS CDOE - the degree behind our guidance" />
          <p className="mt-4 text-muted-foreground">
            SVKM's Narsee Monjee Institute of Management was founded in 1981 and achieved Deemed-to-be-University status from the UGC in 2003. NMIMS Centre for Distance and Online Education (CDOE) began its distance and online learning journey in 2013, delivering interactive, technology-enabled education to learners across India.
          </p>
          <p className="mt-3 text-muted-foreground">
            As an Authorized NMIMS CDOE Enquiry Partner, we are an independent counselling business - not NMIMS University or NMIMS CDOE itself. Every degree, class, exam and certificate is issued and governed solely by NMIMS CDOE; our role is limited to helping you reach them with clear information and honest guidance.
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-secondary p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-foreground">
              <strong className="font-bold">University Home Campus:</strong> SVKM's NMIMS, V.L. Mehta Road, Vile Parle (West), Mumbai, Maharashtra, India
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
        </div>
      </div>
    </section>
  );
}

/* ---------- OUR ROLE, CLEARLY EXPLAINED ---------- */
function OurRole() {
  const weHelp = [
    "Understanding programmes, specialisations, fees and eligibility",
    "Completing registration and gathering the right documents",
    "Fee, EMI and payment-plan guidance",
    "ABC ID and DEB ID setup - a common admission drop-off point",
    "Staying in touch after enrolment for process and academic queries",
  ];
  const nmimsHandles = [
    "Admission approval and student verification",
    "Programme delivery - live classes, recorded lectures, LMS access",
    "Examinations, evaluation and results",
    "Certification and degree issuance",
  ];
  return (
    <section className="py-16 sm:py-24" id="our-role">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Transparency" title="Our role, clearly explained" subtitle="We believe a trustworthy admission partner is upfront about exactly where its role starts and ends." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
              <Handshake className="h-5 w-5 text-primary" /> What We Help With
            </h3>
            <ul className="mt-5 space-y-3">
              {weHelp.map((e) => (
                <li key={e} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3F3083]" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
              <FileSearch className="h-5 w-5 text-primary" /> What NMIMS CDOE Handles
            </h3>
            <ul className="mt-5 space-y-3">
              {nmimsHandles.map((e) => (
                <li key={e} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
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
        <SectionTitle eyebrow="Frequently Asked Questions" title="Everything you need to know about us" />
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
          <HelpCircle className="h-3.5 w-3.5" /> Still have questions about us?
        </span>
        <h2 className="relative mt-5 font-serif text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Talk to a real counsellor, free of cost
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/85">
          Get a callback, chat instantly on WhatsApp, or join a free info session - no pressure, no fee, just honest guidance.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <a href={telLink} className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ef4444,#dc2626)] px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <a href={waLink("Hi, I'd like to know more about NMIMS Online. Please share more details.")} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-elegant transition hover:scale-[1.03]">
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
