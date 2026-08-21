import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Phone, MessageCircle, Mail, MapPin, Clock, ArrowRight,
  CalendarCheck, Building2, ShieldCheck,
} from "lucide-react";
import { EnquiryForm } from "@/components/landing/EnquiryForm";
import {
  Header, Footer, FloatingWA, MobileCTABar, SectionTitle,
  telLink, waLink, CALENDLY_LINK, PHONE, EMAIL, OFFICE_ADDRESS, OFFICE_HOURS, PRESENCE_CITIES,
} from "@/components/layout/SiteChrome";
import { getPageFn } from "@/backend/pages/actions";
import { buildSeoHead } from "@/lib/seo-head";

const FALLBACK_SEO = {
  slug: "contact-us",
  title: "Contact Us",
  metaTitle: "Contact Us | NMIMS Online - Free Counselling for NMIMS CDOE Admissions",
  metaDescription: "Get in touch with NMIMS Online for free NMIMS CDOE admission counselling - call, WhatsApp, email, or visit our Ahmedabad office. Serving students across India since 2018.",
  canonicalUrl: "/contact-us",
  ogImage: null as string | null,
  status: "published" as const,
};

export const Route = createFileRoute("/contact-us")({
  loader: async () => {
    const page = await getPageFn({ data: { slug: "contact-us" } });
    return { seo: page ?? FALLBACK_SEO };
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
          areaServed: PRESENCE_CITIES.map((c) => ({ "@type": "City", name: c })),
        }),
      },
    ],
    };
  },
  component: ContactUsPage,
});

const waMessage = "Hi, I'd like to get in touch about NMIMS CDOE admissions.";

const quickContacts = [
  { icon: Phone, t: "Call Us", v: PHONE, d: "Speak directly to a counsellor.", href: telLink, cta: "Call Now" },
  { icon: MessageCircle, t: "WhatsApp Us", v: "Chat instantly", d: "Get answers in minutes, not days.", href: waLink(waMessage), cta: "Chat Now", external: true },
  { icon: Mail, t: "Email Us", v: EMAIL, d: "For detailed queries or documents.", href: `mailto:${EMAIL}`, cta: "Send Email" },
  { icon: CalendarCheck, t: "Book a Session", v: "Free info session", d: "Talk to us over a video call.", href: CALENDLY_LINK, cta: "Schedule Call", external: true },
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
            Talk to our Counsellor,
            <span className="mt-1 block bg-[linear-gradient(135deg,#ef4444,#f97316)] bg-clip-text text-transparent">
              Get Program Brochure Instantly
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-base">
            Call, WhatsApp, email or book a free video session - whichever's easiest for you.
          </p>

          <ul className="mt-6 grid max-w-lg gap-2.5 sm:grid-cols-2">
            {[
              { icon: Phone, t: PHONE, href: telLink },
              { icon: MessageCircle, t: "Chat on WhatsApp", href: waLink(waMessage), external: true },
              { icon: Mail, t: EMAIL, href: `mailto:${EMAIL}` },
              { icon: MapPin, t: "Across India" },
            ].map(({ icon: Icon, t, href, external }) => {
              const inner = (
                <>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#ef4444]/20 ring-1 ring-[#ef4444]/40">
                    <Icon className="h-3.5 w-3.5 text-[#fca5a5]" />
                  </span>
                  {t}
                </>
              );
              return (
                <li key={t} className="flex items-center gap-2.5 text-sm font-semibold text-white/95">
                  {href ? (
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener" : undefined}
                      className="flex items-center gap-2.5 transition hover:text-[#fca5a5]"
                    >
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
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
  const track = [...PRESENCE_CITIES, ...PRESENCE_CITIES];
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
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_ADDRESS)}`}
                target="_blank"
                rel="noopener"
                className="transition hover:text-primary"
              >
                {OFFICE_ADDRESS}
              </a>
            </p>
            <p className="mt-3 flex gap-3 text-sm text-muted-foreground">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href={telLink} className="transition hover:text-primary">{PHONE}</a>
            </p>
            <p className="mt-3 flex gap-3 text-sm text-muted-foreground">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a href={`mailto:${EMAIL}`} className="transition hover:text-primary">{EMAIL}</a>
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
            We counsel students across the globe.
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
