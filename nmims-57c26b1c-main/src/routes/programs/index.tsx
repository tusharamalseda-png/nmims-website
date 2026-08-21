import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Briefcase, BookOpen, Calculator, Award, Laptop, Clock, ArrowRight, HelpCircle } from "lucide-react";
import { Header, Footer, FloatingWA, MobileCTABar, SectionTitle } from "@/components/layout/SiteChrome";

export const Route = createFileRoute("/programs/")({
  head: () => ({
    meta: [
      { title: "All Programs | NMIMS Online - MBA, BBA, B.Com, Diploma & Certificate" },
      { name: "description", content: "Browse every UGC-entitled NMIMS CDOE online program - MBA, BBA, B.Com, Diploma and Certificate courses - and find the one that fits your career goals." },
      { property: "og:title", content: "All Programs | NMIMS Online" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/programs" }],
  }),
  component: ProgramsIndexPage,
});

const PROGRAMS = [
  { icon: Briefcase, name: "Online MBA", dur: "2 Years", high: ["7+ specialisations", "Live faculty sessions", "Career services"], href: "/programs/online-mba" },
  { icon: BookOpen, name: "Online BBA", dur: "3 Years", high: ["Marketing, Finance & Analytics", "Business fundamentals", "Career services"], href: "/programs/online-bba" },
  { icon: Calculator, name: "Online B.Com", dur: "3 Years", high: ["Accounting & finance core", "Taxation & audit", "UGC-DEB entitled"], href: "/programs/online-bcom" },
  { icon: Award, name: "Diploma Programmes", dur: "1 Year", high: ["5 specialisation tracks", "Fast-track upskilling", "2 semesters"], href: "/programs/online-diploma" },
  { icon: Laptop, name: "Certificate Course", dur: "6 Months", high: ["Business Management focus", "Fast-track format", "1 semester"], href: "/programs/online-certificate" },
];

function ProgramsIndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="bg-surface-soft py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle eyebrow="All programs" title="UGC-entitled degrees designed for working professionals" />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PROGRAMS.map(({ icon: Icon, name, dur, high, href }, i) => (
                <motion.article
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
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
                    Learn More <ArrowRight className="h-4 w-4" />
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
      </main>
      <Footer />
      <FloatingWA message="Hi, I'd like to know about admissions." />
      <MobileCTABar message="Hi, I'd like to know about admissions." />
    </div>
  );
}
