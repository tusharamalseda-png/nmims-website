import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, MessageCircle, Mail, MapPin, Clock, ArrowRight,
  ChevronDown, CalendarCheck, Building2, ShieldCheck,
} from "lucide-react";
import { EnquiryForm } from "@/components/landing/EnquiryForm";
import {
  Header, Footer, FloatingWA, MobileCTABar, SectionTitle,
  telLink, waLink, CALENDLY_LINK, PHONE, EMAIL, OFFICE_ADDRESS, OFFICE_HOURS,
} from "@/components/layout/SiteChrome";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us | NMIMS Online - Free Counselling for NMIMS CDOE Admissions" },
      { name: "description", content: "Get in touch with NMIMS Online for free NMIMS CDOE admission counselling - call, WhatsApp, email, or visit our Ahmedabad office. Serving students across Gujarat since 2018." },
      { property: "og:title", content: "Contact NMIMS Online - Free NMIMS CDOE Admission Counselling" },
      { property: "og:description", content: "Call, WhatsApp, email or visit us for free NMIMS CDOE admission counselling across Gujarat." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact-us" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact-us" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Contact Us", item: "/contact-us" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "NMIMS Online",
          telephone: PHONE,
          email: EMAIL,
          address: { "@type": "PostalAddress", streetAddress: OFFICE_ADDRESS, addressCountry: "IN" },
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
  component: ContactUsPage,
});

const waMessage = "Hi, I'd like to get in touch about NMIMS CDOE admissions.";
const gujaratCities = ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhidham", "Bhuj", "Kutch", "Bharuch", "Navsari", "Vapi"];

const quickContacts = [
  { icon: Phone, t: "Call Us", v: PHONE, d: "Speak directly to a counsellor.", href: telLink, cta: "Call Now" },
  { icon: MessageCircle, t: "WhatsApp Us", v: "Chat instantly", d: "Get answers in minutes, not days.", href: waLink(waMessage), cta: "Chat Now", external: true },
  { icon: Mail, t: "Email Us", v: EMAIL, d: "For detailed queries or documents.", href: `mailto:${EMAIL}`, cta: "Send Email" },
  { icon: CalendarCheck, t: "Book a Session", v: "Free info session", d: "Talk to us over a video call.", href: CALENDLY_LINK, cta: "Schedule Call", external: true },
];

const faqItems = [
  { q: "What are your office hours?", a: "We're available Monday to Saturday, 9:30 AM to 7:00 PM. Sundays are by appointment only - message us on WhatsApp to schedule one." },
  { q: "Do you have a physical office I can visit?", a: "Yes, our office is in Ahmedabad, Gujarat. That said, most students never need to visit in person - our counsellors handle enquiries, documentation and follow-ups over call, WhatsApp and video sessions for students across all 10 cities we serve." },
  { q: "How quickly will you respond to my enquiry?", a: "Most enquiries submitted during office hours receive a callback or WhatsApp response the same day. Outside office hours, expect a response by the next working day." },
  { q: "Is there any fee for the initial consultation?", a: "No. Our counselling, admission guidance and application support are completely free for students - you only ever pay the official programme fee directly to NMIMS CDOE." },
  { q: "Which cities do you have counsellors in?", a: "Ahmedabad, Surat, Vadodara, Rajkot, Gandhidham, Bhuj, Kutch, Bharuch, Navsari and Vapi." },
  { q: "Can I schedule a video call instead of visiting the office?", a: "Yes. Use the \"Book a Session\" option to schedule a free info session over video call at a time that works for you." },
];

function ContactUsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <QuickContacts />
        <OfficeAndCities />
        <SendMessage />
        <FAQ />
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
            We reply the same working day
          </span>
          <h1 className="mt-5 font-serif text-3xl font-extrabold leading-[1.15] sm:text-4xl lg:text-[44px]">
            Talk to a Real Counsellor,
            <span className="mt-1 block bg-[linear-gradient(135deg,#ef4444,#f97316)] bg-clip-text text-transparent">
              Free of Cost
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-base">
            Call, WhatsApp, email or book a free video session - whichever's easiest for you. No pressure, no hidden fees, just honest guidance on NMIMS CDOE admissions.
          </p>

          <ul className="mt-6 grid max-w-lg gap-2.5 sm:grid-cols-2">
            {[
              { icon: Phone, t: PHONE },
              { icon: MessageCircle, t: "Chat on WhatsApp" },
              { icon: Mail, t: EMAIL },
              { icon: MapPin, t: "Ahmedabad, Gujarat" },
            ].map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-2.5 text-sm font-semibold text-white/95">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#ef4444]/20 ring-1 ring-[#ef4444]/40">
                  <Icon className="h-3.5 w-3.5 text-[#fca5a5]" />
                </span>
                {t}
              </li>
            ))}
          </ul>
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
    </section>
  );
}

/* ---------- QUICK CONTACTS ---------- */
function QuickContacts() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Get in Touch" title="Reach us however works best for you" subtitle="Four ways to start a conversation - pick whichever's most convenient." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickContacts.map(({ icon: Icon, t, v, d, href, cta, external }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="flex flex-col rounded-3xl border border-border bg-card p-6 text-center shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-card">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-foreground">{t}</h3>
              <p className="mt-1 text-sm font-semibold text-primary">{v}</p>
              <p className="mt-2 flex-1 text-xs text-muted-foreground">{d}</p>
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener" : undefined}
                className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-primary px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                {cta} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- OFFICE & CITIES ---------- */
function OfficeAndCities() {
  const track = [...gujaratCities, ...gujaratCities];
  return (
    <section className="bg-surface-soft py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Our Office" title="Visit us, or let us come to you" subtitle="Most students never need to visit in person - but if you'd like to, here's where we are." />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
              <Building2 className="h-5 w-5 text-primary" /> Head Office
            </h3>
            <p className="mt-4 flex gap-3 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {OFFICE_ADDRESS}
            </p>
            <p className="mt-3 flex gap-3 text-sm text-muted-foreground">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {PHONE}
            </p>
            <p className="mt-3 flex gap-3 text-sm text-muted-foreground">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {EMAIL}
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <h3 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
              <Clock className="h-5 w-5 text-primary" /> Office Hours
            </h3>
            <table className="mt-5 w-full text-sm">
              <tbody>
                {OFFICE_HOURS.map(([day, hours]) => (
                  <tr key={day} className="border-b border-border last:border-0">
                    <td className="w-1/2 py-3 font-bold text-foreground">{day}</td>
                    <td className="py-3 text-muted-foreground">{hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 flex gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> WhatsApp messages outside office hours are answered the next working day.
            </p>
          </div>
        </div>

        <div className="mt-14 text-center">
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            We counsel students across 10 major cities in Gujarat, in person and online.
          </p>
        </div>
        <div className="mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex w-max animate-[city-scroll-contact_28s_linear_infinite] gap-4 hover:[animation-play-state:paused]">
            {track.map((city, i) => (
              <span key={`${city}-${i}`} className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-border bg-card px-6 py-3.5 text-sm font-bold text-[#3F3083] shadow-card">
                <MapPin className="h-4 w-4 text-primary" /> {city}
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes city-scroll-contact {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </section>
  );
}

/* ---------- SEND MESSAGE ---------- */
function SendMessage() {
  return (
    <section className="py-16 sm:py-24" id="enquire-full">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Send a Message" title="Prefer to write it down?" subtitle="Fill this in and a counsellor will call you back - usually the same working day." />
        <div className="mt-10">
          <EnquiryForm compact showMessage />
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
        <SectionTitle eyebrow="Frequently Asked Questions" title="Before you reach out" />
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
