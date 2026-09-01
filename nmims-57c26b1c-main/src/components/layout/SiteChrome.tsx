import { useEffect, useState } from "react";
import { useLoaderData } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, Phone, MessageCircle, ArrowRight, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

/**
 * Shared site chrome (Header / Footer / floating WhatsApp / mobile CTA bar).
 * Mirrors the homepage (src/routes/index.tsx) header & footer so every
 * page under the main site shares one consistent nav, brand and footer.
 * New pages should import from here instead of redefining their own chrome.
 */

export const PHONE = "+917069181188";
export const PHONE_SECONDARY = "+919924266322";
export const WA = "917069181188";
export const waLink = (message: string) => `https://wa.me/${WA}?text=${encodeURIComponent(message)}`;
export const telLink = `tel:${PHONE}`;
// TODO: replace with the real Calendly event link once available
export const CALENDLY_LINK = "https://calendly.com/nmims-online/counseling";
export const EMAIL = "ncdoe-026@nmims.edu";
export const OFFICE_ADDRESS = "503, Sukhsagar Complex, Next to hotel fortune landmark, Ashram road, Ahmedabad, 380013";
export const OFFICE_HOURS = [
  ["Monday - Saturday", "9:30 AM - 7:00 PM"],
  ["Sunday", "By appointment only"],
];

// Cities we counsel students from — shared across every page that shows a
// city list (About Us, Contact Us) so they never drift out of sync.
export const PRESENCE_CITIES = [
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar", "Anand",
  "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Delhi (NCR)", "Chennai", "Kolkata", "Jaipur", "Lucknow", "Chandigarh", "Indore", "Nagpur",
];

export const programMenuItems = [
  { label: "Online MBA", href: "/programs/online-mba" },
  { label: "Online BBA", href: "/programs/online-bba" },
  { label: "Online B.Com", href: "/programs/online-bcom" },
  { label: "Diploma Programmes", href: "/programs/online-diploma" },
  { label: "Certificate Course", href: "/programs/online-certificate" },
];

const DEFAULT_FOOTER_LINKS = [
  { label: "Home", url: "/" },
  { label: "About us", url: "/about" },
  { label: "Programs", url: "/programs" },
  { label: "Blog", url: "/blog" },
  { label: "Contact Us", url: "/contact-us" },
];

const DEFAULT_DISCLAIMER =
  "cdoe.info is owned and operated by RH Academy, an Affiliate Enquiry Partner (AEP) for NMIMS Centre for Distance and Online Education (NMIMS CDOE). We provide enquiry assistance only. Admissions, fee collection, academics, examinations, results, and certification are solely managed by NMIMS CDOE.";

// Site-wide settings + nav are loaded once, at the root route — every page
// gets them for free without redeclaring a loader. Falls back to the
// hardcoded defaults above if the DB row is empty (fresh install, etc).
function useSiteChrome() {
  const data = useLoaderData({ from: "__root__" });
  const settings = data?.settings ?? null;
  const navItems = data?.navItems ?? [];
  const footerLinks = navItems.filter((n) => n.location === "footer" && !n.parentId);
  return {
    logoUrl: settings?.logoUrl || "/images/nmimslogo.webp",
    phone: settings?.contactPhone || PHONE,
    email: settings?.contactEmail || EMAIL,
    disclaimer: settings?.disclaimerText || DEFAULT_DISCLAIMER,
    footerLinks: footerLinks.length > 0 ? footerLinks : DEFAULT_FOOTER_LINKS,
    socialLinks: settings?.socialLinks ?? {},
  };
}

export function Header({ activeProgram }: { activeProgram?: string }) {
  const { logoUrl } = useSiteChrome();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            src={logoUrl}
            alt="NMIMS Centre for Distance and Online Education"
            className="h-10 w-auto sm:h-12"
          />
        </a>

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
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-secondary hover:text-foreground ${
                    activeProgram === p.label ? "text-primary" : "text-foreground/80"
                  }`}
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
                    <a
                      key={p.label}
                      href={p.href}
                      className={`rounded-lg px-3 py-2 text-sm hover:bg-secondary ${
                        activeProgram === p.label ? "font-semibold text-primary" : "text-foreground/70"
                      }`}
                    >
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

const SOCIAL_ICONS: Record<string, typeof Facebook> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export function Footer() {
  const { logoUrl, phone, email, disclaimer, footerLinks, socialLinks } = useSiteChrome();
  const socialEntries = Object.entries(socialLinks).filter(([platform, url]) => url && SOCIAL_ICONS[platform]);
  return (
    <footer className="bg-foreground pb-28 pt-16 text-white/80 sm:pb-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <a href="/" className="inline-flex items-center rounded-lg bg-white px-3 py-2">
            <img
              src={logoUrl}
              alt="NMIMS Centre for Distance and Online Education"
              className="h-8 w-auto"
            />
          </a>
          <p className="mt-4 max-w-md text-sm">
            NMIMS Centre for Distance and Online Education (CDOE) is one of India's leading institutions for flexible, career-focused online education, offering UGC-entitled online degrees for working professionals.
          </p>
          <div className="mt-5 space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[color:var(--gold)]" />
              <a href={`tel:${phone}`} className="transition hover:text-[color:var(--gold)]">{phone}</a>
              <span>,</span>
              <a href={`tel:${PHONE_SECONDARY}`} className="transition hover:text-[color:var(--gold)]">{PHONE_SECONDARY}</a>
            </p>
            {email && (
              <p className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 shrink-0 text-[color:var(--gold)]" />
                <a href={`mailto:${email}`} className="transition hover:text-[color:var(--gold)]">{email}</a>
              </p>
            )}
          </div>
          {socialEntries.length > 0 && (
            <div className="mt-5 flex items-center gap-3">
              {socialEntries.map(([platform, url]) => {
                const Icon = SOCIAL_ICONS[platform];
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener"
                    aria-label={platform}
                    className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-[color:var(--gold)] hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-white">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm">
            {footerLinks.map((l) => (
              <li key={l.label}><a href={l.url} className="hover:text-[color:var(--gold)]">{l.label}</a></li>
            ))}
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
            <li><a href="/privacy-policy" className="hover:text-[color:var(--gold)]">Privacy Policy</a></li>
            <li><a href="/terms-of-service" className="hover:text-[color:var(--gold)]">Terms of Service</a></li>
            <li><a href="/disclaimer" className="hover:text-[color:var(--gold)]">Disclaimer</a></li>
            <li><a href="/refund-policy" className="hover:text-[color:var(--gold)]">Refund Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-white/10 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="disclaimer-ticker">
            <div className="disclaimer-ticker-track">
              {[0, 1].map((k) => (
                <span key={k} className="whitespace-nowrap pr-[70px] text-xs leading-relaxed text-white/60" aria-hidden={k === 1}>
                  <strong className="text-white/80">Disclaimer:</strong> {disclaimer}
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

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.48 1.32 5L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.83 14.16c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.13.11-1.82-.11-.42-.14-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.14.11.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.16-.19.7-.82.89-1.1.19-.28.37-.24.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

const WA_POPUP_DISMISSED_KEY = "wa-popup-dismissed";

export function FloatingWA({ message }: { message: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(WA_POPUP_DISMISSED_KEY) === "1") return;
    setOpen(true);
  }, []);

  function dismiss() {
    setOpen(false);
    sessionStorage.setItem(WA_POPUP_DISMISSED_KEY, "1");
  }

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div className="relative w-[270px] rounded-2xl bg-white p-4 text-[13px] text-[#333] shadow-elegant">
          <button
            type="button"
            onClick={dismiss}
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
            href={waLink(message)}
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

export function MobileCTABar({ message }: { message: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-border bg-card/95 p-3 shadow-elegant backdrop-blur sm:hidden">
      <a href={telLink} className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-3 text-xs font-bold text-foreground">
        <Phone className="h-4 w-4" /> Call
      </a>
      <a href={waLink(message)} target="_blank" rel="noopener" className="flex items-center justify-center gap-1.5 rounded-xl bg-[color:var(--whatsapp)] py-3 text-xs font-bold text-white">
        <MessageCircle className="h-4 w-4" /> WhatsApp
      </a>
      <a href="#enquire" className="flex items-center justify-center gap-1.5 rounded-xl gradient-primary py-3 text-xs font-bold text-primary-foreground">
        Enquire <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, subtitle, align = "center" }: { eyebrow: string; title: string; subtitle?: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-xl"}>
      <span className={`inline-flex items-center gap-2 rounded-full border border-[#e7d6ff] bg-[#F6EDFF] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#3F3083] ${align === "left" ? "" : "mx-auto"}`}>
        <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#e0527a]" />
        {eyebrow}
      </span>
      <h2 className="mt-3 text-balance font-serif text-2xl font-bold leading-tight text-foreground sm:text-[30px] lg:text-[34px]">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
