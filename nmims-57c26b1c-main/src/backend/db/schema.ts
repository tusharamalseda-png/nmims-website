import { pgTable, uuid, text, boolean, integer, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";

// JSON-safe value type — used instead of `unknown` on jsonb columns, since
// TanStack Start's server-function return validation rejects `unknown`.
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

// ---------- enums ----------
export const pageStatusEnum = pgEnum("page_status", ["draft", "published"]);
export const pageTypeEnum = pgEnum("page_type", ["page", "landing_page", "legal"]);
export const adminRoleEnum = pgEnum("admin_role", ["admin", "editor"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "enrolled", "lost"]);
export const redirectStatusEnum = pgEnum("redirect_status", ["301", "302"]);

// ---------- admin users (profile linked to Supabase Auth's auth.users) ----------
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey(), // same id as auth.users.id
  email: text("email").notNull(),
  name: text("name"),
  role: adminRoleEnum("role").notNull().default("editor"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  twoFactorSecret: text("two_factor_secret"),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
});

// ---------- pages (Home, About, Programs, Contact, landing pages, legal pages) ----------
export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  type: pageTypeEnum("type").notNull().default("page"),
  title: text("title").notNull(),
  content: jsonb("content").$type<Record<string, JsonValue>>().notNull().default({}), // structured section/block content
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  canonicalUrl: text("canonical_url"),
  ogImage: text("og_image"),
  schemaJsonld: jsonb("schema_jsonld").$type<Record<string, JsonValue>>(),
  status: pageStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: uuid("updated_by").references(() => adminUsers.id),
  // ---- page-level SEO (added for the full CMS SEO tab) ----
  focusKeyword: text("focus_keyword"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  twitterCardType: text("twitter_card_type").default("summary_large_image"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  schemaType: text("schema_type").default("WebPage"),
  breadcrumbLabel: text("breadcrumb_label"),
  robotsIndex: boolean("robots_index").notNull().default(true),
  robotsFollow: boolean("robots_follow").notNull().default(true),
});

// ---------- blog posts ----------
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull().default(""),
  featuredImage: text("featured_image"),
  category: text("category"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  status: pageStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  // ---- page-level SEO (added for the full CMS SEO tab) ----
  canonicalUrl: text("canonical_url"),
  focusKeyword: text("focus_keyword"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  twitterCardType: text("twitter_card_type").default("summary_large_image"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  schemaType: text("schema_type").default("Article"),
  breadcrumbLabel: text("breadcrumb_label"),
  robotsIndex: boolean("robots_index").notNull().default(true),
  robotsFollow: boolean("robots_follow").notNull().default(true),
});

// ---------- FAQs (attached to a page by slug) ----------
export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageSlug: text("page_slug").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------- media library ----------
export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(), // short public id, used in the served URL: /media/<slug>
  fileUrl: text("file_url").notNull(), // our own short URL — never the raw Supabase URL
  storagePath: text("storage_path").notNull(), // internal Supabase Storage object path
  fileName: text("file_name"),
  mimeType: text("mime_type").notNull(),
  fileType: text("file_type").notNull(), // image | pdf
  fileSize: integer("file_size"), // bytes
  altText: text("alt_text"),
  title: text("title"),
  caption: text("caption"),
  folder: text("folder").default("uncategorized"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- testimonials ----------
export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  designation: text("designation"),
  company: text("company"),
  quote: text("quote"),
  rating: integer("rating").default(5),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  source: text("source"), // Google, Clutch, GoodFirms, etc
  isVideo: boolean("is_video").notNull().default(false),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  pageSlugs: jsonb("page_slugs").$type<string[]>().notNull().default([]), // empty = show on every page
});

// ---------- leads / inquiries ----------
export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  program: text("program"),
  state: text("state"),
  message: text("message"),
  sourcePage: text("source_page"),
  utmSource: text("utm_source"),
  utmCampaign: text("utm_campaign"),
  status: leadStatusEnum("status").notNull().default("new"),
  assignedTo: uuid("assigned_to").references(() => adminUsers.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- client / partner / accreditation logos ----------
export const logos = pgTable("logos", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  category: text("category"), // bank | accreditation
  pageSlugs: jsonb("page_slugs").$type<string[]>().notNull().default([]), // which pages it appears on
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------- team members ----------
export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  designation: text("designation"),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------- navigation ----------
export const navigationItems = pgTable("navigation_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  url: text("url").notNull(),
  parentId: uuid("parent_id"),
  location: text("location").notNull().default("header"), // header | footer
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---------- redirects ----------
export const redirects = pgTable("redirects", {
  id: uuid("id").primaryKey().defaultRandom(),
  fromPath: text("from_path").notNull().unique(),
  toPath: text("to_path").notNull(),
  statusCode: redirectStatusEnum("status_code").notNull().default("301"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- site-wide settings (single row) ----------
export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  siteTitle: text("site_title"),
  siteTagline: text("site_tagline"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  contactAddress: text("contact_address"),
  socialLinks: jsonb("social_links").$type<Record<string, string>>().notNull().default({}),
  disclaimerText: text("disclaimer_text"),
  robotsTxt: text("robots_txt"),
  googleSiteVerification: text("google_site_verification"),
  bingSiteVerification: text("bing_site_verification"),
  sitemapEnabled: boolean("sitemap_enabled").notNull().default(true),
  analyticsIds: jsonb("analytics_ids").$type<Record<string, string>>().notNull().default({}),
  maintenanceMode: boolean("maintenance_mode").notNull().default(false),
  cookieConsentEnabled: boolean("cookie_consent_enabled").notNull().default(true),
  cookieConsentText: text("cookie_consent_text"),
  announcementEnabled: boolean("announcement_enabled").notNull().default(false),
  announcementText: text("announcement_text"),
  announcementLink: text("announcement_link"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- activity log ----------
export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => adminUsers.id),
  action: text("action").notNull(), // created | updated | deleted | published
  entity: text("entity").notNull(), // page | blog_post | testimonial | ...
  entityId: text("entity_id"),
  details: jsonb("details").$type<Record<string, JsonValue>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- 404 monitor ----------
export const notFoundHits = pgTable("not_found_hits", {
  id: uuid("id").primaryKey().defaultRandom(),
  path: text("path").notNull(),
  referrer: text("referrer"),
  hitCount: integer("hit_count").notNull().default(1),
  resolved: boolean("resolved").notNull().default(false),
  firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- backups (point-in-time content snapshots) ----------
export const backups = pgTable("backups", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  snapshot: jsonb("snapshot").$type<Record<string, JsonValue>>().notNull(),
  createdBy: uuid("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- GDPR data requests (export / erase a person's submitted data) ----------
export const dataRequestTypeEnum = pgEnum("data_request_type", ["export", "erase"]);
export const dataRequests = pgTable("data_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestType: dataRequestTypeEnum("request_type").notNull(),
  identifier: text("identifier").notNull(), // email or phone searched against leads/testimonials
  fulfilledBy: uuid("fulfilled_by").references(() => adminUsers.id),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
