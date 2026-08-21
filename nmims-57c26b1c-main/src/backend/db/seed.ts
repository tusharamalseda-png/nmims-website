// One-off/idempotent seed for the `pages`, `blog_posts`, `site_settings`,
// `navigation_items` and `testimonials` tables, run manually with:
//   bun --env-file=.env.local src/backend/db/seed.ts
import { db } from "./client";
import { pages, blogPosts, siteSettings, navigationItems, testimonials } from "./schema";

const seedPages: (typeof pages.$inferInsert)[] = [
  {
    slug: "home",
    type: "page",
    title: "Home",
    content: {},
    metaTitle: "Online MBA & Degree Programs | UGC-Entitled Admissions Open 2026",
    metaDescription:
      "Earn a UGC-entitled online degree from India's top-ranked university. Live classes, career services & flexible learning. Admissions open - talk to a counsellor today.",
    status: "published",
  },
  {
    slug: "about",
    type: "page",
    title: "About Us",
    content: {},
    metaTitle: "About Us | NMIMS Online - Authorized NMIMS CDOE Enquiry Partner in Gujarat Since 2018",
    metaDescription:
      "NMIMS Online is an Authorized NMIMS CDOE Enquiry Partner (AEP) counselling students and working professionals across Gujarat since 2018. Free, transparent guidance from enquiry to graduation - learn our story, our role, and how we work with NMIMS CDOE.",
    status: "published",
  },
  {
    slug: "contact-us",
    type: "page",
    title: "Contact Us",
    content: {},
    metaTitle: "Contact Us | NMIMS Online - Free Counselling for NMIMS CDOE Admissions",
    metaDescription:
      "Get in touch with NMIMS Online for free NMIMS CDOE admission counselling - call, WhatsApp, email, or visit our Ahmedabad office. Serving students across India since 2018.",
    status: "published",
  },
  {
    slug: "online-mba",
    type: "page",
    title: "Online MBA",
    content: {},
    metaTitle: "NMIMS Online MBA 2026 | UGC-DEB Entitled Degree | Fees, Eligibility & Admission",
    metaDescription:
      "Pursue a UGC-DEB entitled Online MBA from NMIMS CDOE - 2-year program, 7+ specialisations, live faculty sessions & career services. Check fees, eligibility, syllabus & apply for 2026 admissions.",
    status: "published",
  },
  {
    slug: "online-bba",
    type: "page",
    title: "Online BBA",
    content: {},
    metaTitle: "NMIMS Online BBA 2026 | UGC-DEB Entitled Degree | Fees, Eligibility & Admission",
    metaDescription:
      "Pursue a UGC-DEB entitled Online BBA from NMIMS CDOE - 3-year, 6-semester program with Marketing, Finance & Business Analytics tracks. Check fees, eligibility, syllabus & apply for 2026 admissions.",
    status: "published",
  },
  {
    slug: "online-bcom",
    type: "page",
    title: "Online B.Com",
    content: {},
    metaTitle: "NMIMS Online B.Com 2026 | UGC-DEB Entitled Degree | Fees, Eligibility & Admission",
    metaDescription:
      "Pursue a UGC-DEB entitled Online B.Com from NMIMS CDOE - 3-year, 6-semester commerce degree covering accounting, finance, taxation & audit. Check fees (₹33,000/year), eligibility, syllabus & apply for 2026 admissions.",
    status: "published",
  },
  {
    slug: "online-diploma",
    type: "page",
    title: "Online Diploma",
    content: {},
    metaTitle: "NMIMS Online Diploma Programmes 2026 | 5 Specialisations | Fees & Admission",
    metaDescription:
      "UGC-entitled 1-year Online Diploma from NMIMS CDOE - choose from Business Management, Finance Management, Marketing Management, HR Management or Operations Management. Fees from ₹55,000/semester. Admissions open 2026.",
    status: "published",
  },
  {
    slug: "online-certificate",
    type: "page",
    title: "Online Certificate",
    content: {},
    metaTitle: "NMIMS Certificate in Business Management 2026 | 6 Months | Fees & Admission",
    metaDescription:
      "UGC-entitled 6-month Certificate in Business Management from NMIMS CDOE - Business Communication, Financial Accounting, Marketing Management, Organisational Behaviour & more. Fee ₹55,000. Admissions open 2026.",
    status: "published",
  },
  {
    slug: "lp-online-mba",
    type: "landing_page",
    title: "Online MBA Landing Page",
    content: {},
    metaTitle: "NMIMS Online MBA",
    metaDescription:
      "UGC-Entitled Online MBA from NMIMS CDOE - MBA, BBA & B.Com programs. Check fees, EMI options, eligibility and apply for 2026 admissions.",
    status: "published",
  },
  {
    slug: "privacy-policy",
    type: "legal",
    title: "Privacy Policy",
    metaTitle: "Privacy Policy | RH Academy - NMIMS CDOE Enquiry Partner",
    metaDescription: "How RH Academy collects, uses and protects the personal information you share through cdoe.info.",
    status: "published",
    content: {
      body: `Last updated: August 2026

RH Academy ("we", "us", "our") operates cdoe.info as an Affiliate Enquiry Partner (AEP) for NMIMS Centre for Distance and Online Education (NMIMS CDOE). This Privacy Policy explains what information we collect through this site and how we use it.

**Information We Collect**
When you submit an enquiry form on this site, we collect the information you provide directly: your name, email address, phone number, the program you're interested in, and your state. We may also automatically record which page you submitted the form from and, where available, campaign source information (UTM parameters) to understand which channels bring genuine enquiries.

**How We Use Your Information**
We use the information you submit solely to: contact you about the program(s) you enquired about, provide free counselling and admission guidance, and share relevant updates about NMIMS CDOE programs, deadlines and admission steps. We do not sell your personal information to third parties.

**Sharing With NMIMS CDOE**
As an Authorized Enquiry Partner, we may share your enquiry details with NMIMS Centre for Distance and Online Education to facilitate your admission process. NMIMS CDOE's own privacy practices govern how they handle data once shared with them.

**Data Retention**
We retain enquiry data for as long as reasonably necessary to assist with your admission enquiry and for legitimate record-keeping, after which it may be archived or deleted.

**Cookies & Analytics**
This site may use analytics tools (such as Google Analytics) to understand site traffic and improve our content. These tools may use cookies that do not personally identify you.

**Your Rights**
You may request that we correct or delete the personal information you've shared with us at any time by contacting us using the details on our Contact Us page.

**Changes to This Policy**
We may update this Privacy Policy from time to time. Continued use of this site after changes are posted constitutes acceptance of the revised policy.`,
    },
  },
  {
    slug: "terms-of-service",
    type: "legal",
    title: "Terms of Service",
    metaTitle: "Terms of Service | RH Academy - NMIMS CDOE Enquiry Partner",
    metaDescription: "The terms governing your use of cdoe.info, operated by RH Academy.",
    status: "published",
    content: {
      body: `Last updated: August 2026

By accessing or using cdoe.info, you agree to the following terms.

**Who We Are**
cdoe.info is owned and operated by RH Academy, an Affiliate Enquiry Partner (AEP) for NMIMS Centre for Distance and Online Education (NMIMS CDOE). We are not NMIMS CDOE itself, and we do not have authority to make admission decisions, set official fees, or issue certifications on NMIMS CDOE's behalf.

**Our Role**
We provide free enquiry assistance, program information and counselling support to prospective students. Actual admissions, fee collection, academic delivery, examinations, results and certification are handled entirely by NMIMS CDOE, under its own terms and processes.

**No Guarantee of Admission**
Submitting an enquiry through this site does not guarantee admission to any NMIMS CDOE program. Admission is subject to NMIMS CDOE's eligibility criteria and internal review process.

**Accuracy of Information**
We make reasonable efforts to keep program details, fees and eligibility information on this site accurate and current, but this information can change. Always verify final figures and requirements directly with NMIMS CDOE before making a decision.

**Intellectual Property**
The NMIMS name, logo and related marks belong to their respective owners and are used on this site solely to describe our role as an enquiry partner. Content on this site not otherwise attributed belongs to RH Academy.

**Limitation of Liability**
RH Academy is not liable for any decisions made by NMIMS CDOE regarding admissions, fees, academic outcomes or certification, nor for indirect or consequential loss arising from use of this site.

**Governing Law**
These terms are governed by the laws of India, and any disputes are subject to the jurisdiction of the courts in Gujarat.

**Contact**
Questions about these terms can be sent to us via our Contact Us page.`,
    },
  },
  {
    slug: "disclaimer",
    type: "legal",
    title: "Disclaimer",
    metaTitle: "Disclaimer | RH Academy - NMIMS CDOE Enquiry Partner",
    metaDescription: "Our relationship to NMIMS CDOE and the limits of the information provided on this site.",
    status: "published",
    content: {
      body: `Last updated: August 2026

cdoe.info is owned and operated by RH Academy, an Affiliate Enquiry Partner (AEP) for NMIMS Centre for Distance and Online Education (NMIMS CDOE).

We provide enquiry assistance and counselling support only. We are not an official department, franchise, or representative office of NMIMS or SVKM's NMIMS University — we are an independent partner authorized to generate and assist admission enquiries.

**What NMIMS CDOE Handles Directly**
Admissions decisions, fee collection, academic delivery, examinations, results, and final certification are managed solely by NMIMS Centre for Distance and Online Education, not by RH Academy.

**Accuracy of Content**
Program details, fees, eligibility criteria and dates published on this site are provided in good faith based on the latest information available to us, but are subject to change by NMIMS CDOE without notice. In case of any discrepancy, the information published by NMIMS CDOE directly (nmims.edu / official NMIMS CDOE portals) takes precedence.

**External Links**
This site may link to NMIMS CDOE's official website or other third-party resources for your convenience. We are not responsible for the content or accuracy of external sites.

**No Warranty**
This site and its content are provided "as is" without warranties of any kind, express or implied.

If you notice information on this site that appears outdated or incorrect, please let us know via our Contact Us page and we'll review it promptly.`,
    },
  },
  {
    slug: "refund-policy",
    type: "legal",
    title: "Refund Policy",
    metaTitle: "Refund Policy | RH Academy - NMIMS CDOE Enquiry Partner",
    metaDescription: "RH Academy does not collect tuition or admission fees — here's how refunds work for NMIMS CDOE programs.",
    status: "published",
    content: {
      body: `Last updated: August 2026

**We Do Not Collect Fees**
RH Academy provides free enquiry assistance and counselling. We do not collect tuition fees, admission fees, or any program-related payment on behalf of NMIMS CDOE — all fee payments are made by students directly to NMIMS Centre for Distance and Online Education through their official payment channels.

**No Counselling Charges**
Our counselling and admission guidance services are provided to prospective students at no cost. Since no payment is collected by RH Academy for these services, no refund process applies to our services.

**Refunds for Program Fees Paid to NMIMS CDOE**
Any refund of tuition or admission fees paid directly to NMIMS CDOE is governed entirely by NMIMS CDOE's own refund policy, as published on their official website or admission documentation. Please refer to NMIMS CDOE directly, or reach out to us and we'll help point you to the right resource, for any refund request related to fees you've paid them.

**Questions**
If you have any questions about payments you've made as part of your NMIMS CDOE application, contact us via our Contact Us page and we'll help guide you to the right NMIMS CDOE resource.`,
    },
  },
];

const inserted = await db.insert(pages).values(seedPages).onConflictDoNothing({ target: pages.slug }).returning({ slug: pages.slug });
console.log(`Seeded ${inserted.length} new page(s):`, inserted.map((p) => p.slug).join(", ") || "(none — already seeded)");

// The 3 existing blog posts are hand-coded pages (custom layouts), so only
// their metadata lives here — content stays empty and their /blog/<slug>
// routes keep rendering the existing hardcoded .tsx files, not this row.
const seedPosts: (typeof blogPosts.$inferInsert)[] = [
  {
    slug: "is-online-mba-valid-ugc-equivalence",
    title: "Is an Online MBA Valid in India? UGC Equivalence Rules Explained (2026)",
    excerpt:
      "What UGC Regulation 22 actually says about online degrees, whether an NMIMS CDOE Online MBA counts the same as an on-campus one, and how to verify any online degree before you enrol.",
    content: "",
    category: "Eligibility & Recognition",
    metaTitle: "Is an Online MBA Valid in India? UGC Equivalence Rules Explained (2026)",
    metaDescription:
      "UGC Regulation 22 treats degrees earned through Open, Distance and Online mode as equivalent to conventional-mode degrees. Here's what that means for an NMIMS CDOE Online MBA, and how to verify any online degree before enrolling.",
    status: "published",
    publishedAt: new Date("2026-07-12"),
  },
  {
    slug: "abc-id-deb-id-guide-nmims-cdoe",
    title: "How to Create Your ABC ID and DEB ID for NMIMS CDOE Admission (2026 Guide)",
    excerpt:
      "A step-by-step walkthrough for creating your Academic Bank of Credits (ABC) ID via DigiLocker, understanding DEB registration, and avoiding the most common admission delays.",
    content: "",
    category: "Admission Process",
    metaTitle: "How to Create Your ABC ID and DEB ID for NMIMS CDOE Admission (2026 Guide)",
    metaDescription:
      "Step-by-step guide to creating your Academic Bank of Credits (ABC) ID via DigiLocker and your DEB ID at deb.ugc.ac.in - both mandatory before you can submit an NMIMS CDOE online degree application.",
    status: "published",
    publishedAt: new Date("2026-07-15"),
  },
  {
    slug: "nmims-online-mba-fees-emi-guide",
    title: "NMIMS CDOE Online MBA Fees & EMI Options Explained (2026)",
    excerpt:
      "The complete, transparent fee breakdown for the NMIMS Online MBA - annual vs semester-wise payment, hidden costs to budget for, EMI banks, and the defence personnel concession.",
    content: "",
    category: "Fees & EMI",
    metaTitle: "NMIMS CDOE Online MBA Fees & EMI Options Explained (2026)",
    metaDescription:
      "The complete NMIMS Online MBA fee breakdown for 2026 - annual vs semester-wise payment, admission processing and exam fees, EMI banks, and the defence personnel concession, with no hidden costs.",
    status: "published",
    publishedAt: new Date("2026-07-18"),
  },
];

const insertedPosts = await db.insert(blogPosts).values(seedPosts).onConflictDoNothing({ target: blogPosts.slug }).returning({ slug: blogPosts.slug });
console.log(`Seeded ${insertedPosts.length} new blog post(s):`, insertedPosts.map((p) => p.slug).join(", ") || "(none — already seeded)");

// ---------- site settings (single row, id=1) ----------
const insertedSettings = await db
  .insert(siteSettings)
  .values({
    id: 1,
    siteTitle: "NMIMS Online | UGC-Entitled Online Degrees",
    logoUrl: "/images/nmimslogo.webp",
    faviconUrl: null,
    contactPhone: "+917069181188",
    contactEmail: "ncdoe-026@nmims.edu",
    contactAddress: "503, Sukhsagar Complex, Next to hotel fortune landmark, Ashram road, Ahmedabad, 380013",
    socialLinks: {},
    disclaimerText:
      "cdoe.info is owned and operated by RH Academy, an Affiliate Enquiry Partner (AEP) for NMIMS Centre for Distance and Online Education (NMIMS CDOE). We provide enquiry assistance only. Admissions, fee collection, academics, examinations, results, and certification are solely managed by NMIMS CDOE.",
    robotsTxt: "User-agent: *\nAllow: /\n\nSitemap: https://cdoe.info/sitemap.xml",
    analyticsIds: {},
    maintenanceMode: false,
  })
  .onConflictDoNothing({ target: siteSettings.id })
  .returning({ id: siteSettings.id });
console.log(`Seeded site_settings:`, insertedSettings.length > 0 ? "created" : "(already exists)");

// ---------- footer nav items ----------
const seedNavItems: (typeof navigationItems.$inferInsert)[] = [
  { label: "Home", url: "/", parentId: null, location: "footer", sortOrder: 0 },
  { label: "About us", url: "/about", parentId: null, location: "footer", sortOrder: 1 },
  { label: "Programs", url: "/programs", parentId: null, location: "footer", sortOrder: 2 },
  { label: "Blog", url: "/blog", parentId: null, location: "footer", sortOrder: 3 },
  { label: "Contact Us", url: "/contact-us", parentId: null, location: "footer", sortOrder: 4 },
];
const existingNavCount = await db.select({ id: navigationItems.id }).from(navigationItems).limit(1);
if (existingNavCount.length === 0) {
  const insertedNav = await db.insert(navigationItems).values(seedNavItems).returning({ label: navigationItems.label });
  console.log(`Seeded ${insertedNav.length} nav item(s).`);
} else {
  console.log("Seeded nav items: (already exists)");
}

// ---------- testimonials, migrated from the 6 hardcoded page copies ----------
const seedTestimonials: (typeof testimonials.$inferInsert)[] = [
  { name: "Rohit Sharma", designation: "Online MBA - Marketing", quote: "The live mentor sessions changed how I approach my role. I got promoted to Marketing Manager within 8 months of joining the program.", rating: 5, imageUrl: "/images/testimonials/testimonial-1.jpg", isVideo: false, isVisible: true, sortOrder: 0, pageSlugs: ["home"] },
  { name: "Priya Menon", designation: "Online MCA", quote: "Flexible classes meant I could keep my full-time job. With help from career services on my resume and interview prep, I moved into a senior developer role with a 70% hike.", rating: 5, imageUrl: "/images/testimonials/testimonial-2.jpg", isVideo: false, isVisible: true, sortOrder: 1, pageSlugs: ["home"] },
  { name: "Amit Kulkarni", designation: "Online MBA - Finance", quote: "Faculty quality is on par with top B-schools. The capstone project gave me confidence to lead my own FP&A team.", rating: 5, imageUrl: "/images/testimonials/testimonial-3.jpg", isVideo: false, isVisible: true, sortOrder: 2, pageSlugs: ["home"] },

  { name: "Rohit Sharma", designation: "Online MBA - Marketing Management", quote: "The live mentor sessions changed how I approach my role. I was able to take on a bigger team within a year of starting the program.", rating: 5, imageUrl: "/images/testimonials/testimonial-1.jpg", isVideo: false, isVisible: true, sortOrder: 0, pageSlugs: ["online-mba"] },
  { name: "Priya Menon", designation: "Online MBA - Business Analytics", quote: "Flexible weekend classes meant I could keep my full-time job. The career services team helped me prep for a senior role interview.", rating: 5, imageUrl: "/images/testimonials/testimonial-2.jpg", isVideo: false, isVisible: true, sortOrder: 1, pageSlugs: ["online-mba"] },
  { name: "Amit Kulkarni", designation: "Online MBA - Financial Management", quote: "Faculty quality is excellent, and the capstone project gave me the confidence to lead my own finance function.", rating: 5, imageUrl: "/images/testimonials/testimonial-3.jpg", isVideo: false, isVisible: true, sortOrder: 2, pageSlugs: ["online-mba"] },

  { name: "Aditya Rane", designation: "Online BBA - Marketing", quote: "Doing my BBA online meant I could work part-time and still keep up with live classes. The faculty made even the toughest subjects easy to follow.", rating: 5, imageUrl: "/images/testimonials/testimonial-1.jpg", isVideo: false, isVisible: true, sortOrder: 0, pageSlugs: ["online-bba"] },
  { name: "Sanya Kapoor", designation: "Online BBA - Business Analytics", quote: "The Python and Tableau electives gave me a real head-start - I landed an analyst internship before I'd even graduated.", rating: 5, imageUrl: "/images/testimonials/testimonial-2.jpg", isVideo: false, isVisible: true, sortOrder: 1, pageSlugs: ["online-bba"] },
  { name: "Karan Desai", designation: "Online BBA - Finance", quote: "The finance electives in the final year were genuinely practical. I walked into my first job already knowing how to read a balance sheet.", rating: 5, imageUrl: "/images/testimonials/testimonial-3.jpg", isVideo: false, isVisible: true, sortOrder: 2, pageSlugs: ["online-bba"] },

  { name: "Priya Nair", designation: "Online B.Com", quote: "Studying my B.Com online let me prep for my CA foundation alongside my degree. The accounting and taxation subjects lined up perfectly with what I needed.", rating: 5, imageUrl: "/images/testimonials/testimonial-1.jpg", isVideo: false, isVisible: true, sortOrder: 0, pageSlugs: ["online-bcom"] },
  { name: "Rohan Mehta", designation: "Online B.Com", quote: "The live faculty sessions on financial statement analysis and audit made concepts click that I'd struggled with in textbooks alone.", rating: 5, imageUrl: "/images/testimonials/testimonial-2.jpg", isVideo: false, isVisible: true, sortOrder: 1, pageSlugs: ["online-bcom"] },
  { name: "Ishita Sharma", designation: "Online B.Com", quote: "I could keep a part-time internship at a CA firm going while finishing my semesters - the flexibility of the recorded lectures made that possible.", rating: 5, imageUrl: "/images/testimonials/testimonial-3.jpg", isVideo: false, isVisible: true, sortOrder: 2, pageSlugs: ["online-bcom"] },

  { name: "Aditi Rao", designation: "Diploma in Finance Management", quote: "A full MBA wasn't the right fit for my timeline, but this diploma gave me exactly the corporate finance and portfolio management skills I needed for my role - in just a year.", rating: 5, imageUrl: "/images/testimonials/testimonial-1.jpg", isVideo: false, isVisible: true, sortOrder: 0, pageSlugs: ["online-diploma"] },
  { name: "Karan Desai", designation: "Diploma in Operations Management", quote: "The project management and supply chain subjects were directly applicable at work within weeks. Being able to finish in one year while working full-time made all the difference.", rating: 5, imageUrl: "/images/testimonials/testimonial-2.jpg", isVideo: false, isVisible: true, sortOrder: 1, pageSlugs: ["online-diploma"] },
  { name: "Simran Kaur", designation: "Diploma in Human Resource Management", quote: "The recruitment, performance management and manpower planning modules gave me the confidence to move into an HR generalist role right after completing the programme.", rating: 5, imageUrl: "/images/testimonials/testimonial-3.jpg", isVideo: false, isVisible: true, sortOrder: 2, pageSlugs: ["online-diploma"] },

  { name: "Neha Kulkarni", designation: "Certificate in Business Management", quote: "I wanted a quick, credible refresher on business fundamentals before switching teams internally - six months and I had exactly the grounding I needed.", rating: 5, imageUrl: "/images/testimonials/testimonial-1.jpg", isVideo: false, isVisible: true, sortOrder: 0, pageSlugs: ["online-certificate"] },
  { name: "Arjun Bhatt", designation: "Certificate in Business Management", quote: "The marketing and financial accounting modules were directly useful at work almost immediately. A great low-commitment way to test if I wanted to go further with a diploma or degree.", rating: 5, imageUrl: "/images/testimonials/testimonial-2.jpg", isVideo: false, isVisible: true, sortOrder: 1, pageSlugs: ["online-certificate"] },
  { name: "Divya Menon", designation: "Certificate in Business Management", quote: "Balancing this alongside a full-time job was easy with the recorded lectures. It gave me the confidence to take on more business-facing responsibilities.", rating: 5, imageUrl: "/images/testimonials/testimonial-3.jpg", isVideo: false, isVisible: true, sortOrder: 2, pageSlugs: ["online-certificate"] },
];
const existingTestimonialCount = await db.select({ id: testimonials.id }).from(testimonials).limit(1);
if (existingTestimonialCount.length === 0) {
  const insertedTestimonials = await db.insert(testimonials).values(seedTestimonials).returning({ id: testimonials.id });
  console.log(`Seeded ${insertedTestimonials.length} testimonial(s).`);
} else {
  console.log("Seeded testimonials: (already exist)");
}

process.exit(0);
