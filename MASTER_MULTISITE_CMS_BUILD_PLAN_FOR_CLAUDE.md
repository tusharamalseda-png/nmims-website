# MASTER MULTI-SITE CMS + VISUAL PAGE BUILDER BUILD PLAN

> **Purpose of this file:** This is the single source of truth for Claude + VS Code while building the CMS. Do not try to build the whole system in one prompt. Read this file, execute **one numbered step at a time**, test it, mark it complete, and only then continue.

---

# 0. FIRST COMMAND TO GIVE CLAUDE

Copy this exact instruction to Claude first:

```text
Read MASTER_MULTISITE_CMS_BUILD_PLAN_FOR_CLAUDE.md completely before changing code.

Important rules:
1. Do not build the entire roadmap at once.
2. First audit the existing project and complete only Step 1.1.
3. Preserve all working functionality and current design unless the roadmap explicitly changes it.
4. Before coding, tell me which files you will inspect/change and why.
5. After coding, report files changed, database changes, test results, manual test steps, and known limitations.
6. Do not continue to the next step until I tell you to continue.
7. Never hard-code credentials, passwords, API keys, SMTP secrets, database passwords, or tokens.
8. Multi-site data isolation is non-negotiable. Never allow data from one website/site to appear in another site.
```

After each completed step, your normal command can simply be:

```text
Read MASTER_MULTISITE_CMS_BUILD_PLAN_FOR_CLAUDE.md and execute the next incomplete step only. Follow all acceptance tests. Do not continue beyond that step.
```

---

# 0.5 CURRENT_ARCHITECTURE (Step 1.1 audit — completed 2026-09-03)

This section is the required output of **Step 1.1**. No code was changed to produce it — read-only inspection only.

## Framework / language / build

- **Framework:** TanStack Start (React 19) + TanStack Router, file-based routing under `src/routes/`. Originally scaffolded/edited via Lovable.dev (see `AGENTS.md`, `.lovable/`) and now also built/deployed independently via Vercel.
- **Language:** TypeScript throughout, `strict: true`. Validation via Zod on every server function input.
- **Build tool:** Vite 8, with `@lovable.dev/vite-tanstack-config` supplying the TanStack Start / Nitro / Tailwind / path-alias wiring. `vite.config.ts` overrides the Nitro preset to `"vercel"` (Lovable's sandbox defaults to Cloudflare) so plain `vite build` produces Vercel's Build Output API format.
- **Package manager:** Bun (`bun.lock`, `bunfig.toml`).

## Routing

- Public marketing site: `src/routes/index.tsx`, `about.tsx`, `contact-us.tsx`, `programs/*`, `blog/*`, legal pages (`privacy-policy.tsx`, `terms-of-service.tsx`, `refund-policy.tsx`, `disclaimer.tsx`), plus utility routes (`robots[.]txt.ts`, `sitemap[.]xml.ts`, `media/$slug.ts`, `lp-online-mba.ts`, `maintenance.tsx`).
- Admin panel: `src/routes/admin/login.tsx` (public) and `src/routes/admin/_authed/*` — a layout route (`_authed/route.tsx`) whose `beforeLoad` calls `getCurrentAdminFn()` and redirects to `/admin/login` if there's no session; every admin screen is nested under it.
- A couple of thin API-style routes: `src/routes/api/inquiries.ts`, `src/routes/api/leads-export[.]csv.ts`.

## Backend / API

- No separate REST/Express server. Backend logic lives as **TanStack Start server functions** (`createServerFn`) colocated by domain in `src/backend/<domain>/actions.ts` (e.g. `pages/actions.ts`, `leads/actions.ts`, `media/actions.ts`). These run server-side only and are called directly from route loaders/components — there is no conventional REST/GraphQL API surface to design around, aside from the couple of raw routes above.
- Domains present under `src/backend/`: `activity`, `auth`, `blog`, `dashboard`, `db`, `email`, `faqs`, `health`, `leads`, `logos`, `media`, `navigation`, `pages`, `redirects`, `settings`, `supabase`, `team`, `testimonials`, `tools`.

## Database / ORM

- **PostgreSQL**, hosted on Supabase (pooled connection string in `DATABASE_URL`).
- **Drizzle ORM** (`drizzle-orm/postgres-js`). Single flat schema file: `src/backend/db/schema.ts` (~250 lines, ~17 tables/enums).
- `drizzle.config.ts` points `out` at `./drizzle`, but **no `drizzle/` migrations folder exists in the repo** — schema changes are evidently applied with a push-style workflow (`drizzle-kit push`) rather than versioned migration files. This needs to be confirmed/decided explicitly in Step 1.3 before any multi-site migration is attempted.

## Authentication

Two layers:
1. **Supabase Auth** (email/password) via `@supabase/supabase-js` — `supabaseAuthClient.auth.signInWithPassword` verifies credentials.
2. A custom **app-level session cookie**, sealed via TanStack Start's `useSession` (`getAdminSession`, `SESSION_SECRET` env var, 7-day maxAge), storing `{ userId, email, role, pending2FAUserId }`.

An `admin_users` table profiles Supabase's `auth.users` (same UUID `id`), carrying `role` (`admin | editor`) and optional **per-user TOTP 2FA** (`otpauth` + `qrcode`) enforced at login. Authorization today is a single global "is there a session" guard on the whole `/admin/_authed` tree — the `admin`/`editor` role field exists on the schema but a quick scan didn't show it gating individual actions yet (worth confirming before Phase 23 roles/permissions work).

## Existing admin/CMS routes (already built)

Dashboard, Pages, Blog, FAQs, Media, Testimonials, Logos & Badges, Team Members, Leads (labelled "Inquiries" in the schema), Site Health, Navigation, Redirects, 404 Monitor, Settings, Tools, My Account, Activity Log — see the nav groups in `src/routes/admin/_authed/route.tsx`.

## Existing content tables (`src/backend/db/schema.ts`)

`pages`, `blog_posts`, `faqs`, `media`, `testimonials`, `inquiries` (= leads), `logos`, `team_members`, `navigation_items`, `redirects`, `site_settings` (**singleton row, `id` hard-defaulted to `1`**), `activity_log`, `not_found_hits`, `backups`, `data_requests` (GDPR export/erase tool).

**None of these tables have a `site_id`/tenant column. This is a fully single-tenant schema today** — confirmed via a repo-wide grep for `site_id` / `siteId` / "multi-site" / "multi-tenant", which returned zero matches in `src/`.

## ⚠️ Key structural finding: there is no JSON page-builder/renderer today

This is the most important gap relative to this roadmap's Phase 5–8 assumptions:

- Public pages are **not** driven by a generic `PageDocument`/`BuilderNode` tree. Each page is a **hand-written route component** with hard-coded JSX/Tailwind/Framer Motion (`about.tsx` is 523 lines, `programs/online-mba.tsx` is 874 lines, `index.tsx` is 589 lines), pulling shared chrome from `src/components/layout/SiteChrome.tsx` (`Header`, `Footer`, `FloatingWA`, `MobileCTABar`, `SectionTitle`, link helpers) and a handful of shared content components (`EnquiryForm`, `Counter`, `TeamSection`, `Testimonials`, `LogoStrip`, `AnnouncementBar`, `CookieConsent`, `LegalPage`).
- The `pages` DB table only carries **SEO metadata** (title, meta description, canonical, OG/Twitter tags, JSON-LD schema type, robots flags) per page. For `type: "legal"` pages only, there's a single rich-text-ish body string at `content.body`. There is no node tree, no component registry, no drag/drop, and no renderer shared between an editor and the live site — "editing a page" today means an SEO-metadata form (`updatePageSchema` in `pages/actions.ts`) plus, for legal pages, a body textarea.
- Blog posts store `content` as a single text field, not structured JSON either.

Building the visual/drag-drop page builder (Phases 5–13) is therefore a genuinely new subsystem, not an upgrade of an existing renderer — this should shape how much this roadmap is trimmed/resequenced.

## Email

`src/backend/email/client.ts` uses **Resend**. Single hard-coded `NOTIFY_EMAIL` recipient and single `FROM` address from env vars — one inbox for the whole site (consistent with single-tenant status quo, but the opposite of the roadmap's per-site recipient requirement). `sendNewLeadNotification` is fire-and-forget with `.catch(console.error)` — it already follows the roadmap's "email failure must never lose the lead" principle, since the lead is inserted into the DB first and the email call can't roll that back. There is no `email_logs` table — failures are only console-logged, not persisted/retryable from the UI.

## Media

Supabase Storage (bucket `media`), served through an app-controlled short URL `/media/<slug>` rather than the raw Supabase URL (`media/$slug.ts` route). Uploads are validated by **real file-signature sniffing** (not filename/MIME trust) and restricted to JPEG/PNG/WebP/PDF; SVG is deliberately excluded (script risk). No per-site path prefixing exists (n/a today — single tenant).

## Component system / styling

- `src/components/ui/*` — ~45 shadcn/ui (Radix-based) primitives: accordion, dialog, dropdown, table, etc. Standard reusable UI kit, **not** page-builder nodes.
- `src/components/site/*` and `src/components/landing/*` are page-content building blocks imported directly as React components with props into route files — not resolved dynamically from a JSON tree/registry.
- Styling: Tailwind CSS v4 (`@tailwindcss/vite`) + `tw-animate-css` + Framer Motion; `components.json` present (shadcn CLI config).
- The existing admin shell (`_authed/route.tsx`) already matches this roadmap's §3 visual direction closely: dark (`#0c0d12`) left sidebar, light content area, orange/amber gradient accent (`#FF6C4A → #F5B942`), grouped/collapsible nav sections, avatar+role footer. Good baseline to preserve/extend rather than rebuild.

## Hosting / deployment

Vercel. `vercel.json` currently only holds a host-based redirect from the old `nmims-website.vercel.app` domain to `rh-academy-website.vercel.app` (the project's current production alias while the `cdoe.info` custom domain is still pending — matches prior session notes). Nitro's Vercel preset is forced on in `vite.config.ts` specifically so `vite build` emits Vercel-compatible output outside Lovable's sandbox.

## Environment variables in use (names only)

`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `SESSION_SECRET`, `RESEND_API_KEY`, `NOTIFY_EMAIL`, `RESEND_FROM_EMAIL`, plus a Vercel-CLI-managed `VERCEL_OIDC_TOKEN`. All live in `.env.local`, which is gitignored (`*.local` and `.env*` both in `.gitignore`) — no secrets are committed. **No `.env.example` exists yet** (Section 5 of this plan asks for one — that's a later step, not part of 1.1).

## Net assessment for planning purposes

The codebase is a **mature, purpose-built, single-tenant admin CMS** for one marketing website (NMIMS CDOE / `cdoe.info`), not a blank slate. It already has: real auth + 2FA, an SEO layer, a lead/inquiry pipeline with email notification, media library with signature-based validation, redirects, a 404 monitor, activity log, backups, and a GDPR tool — i.e. large parts of "Milestone 1" and pieces of "Milestone 3" in §19 already exist, just without multi-site scoping. What does **not** exist at all is: (a) any multi-site/tenant concept (Phase 2), and (b) any JSON page-document/visual builder (Phases 5–13) — pages are hard-coded route components today. Phase 2 (multi-site foundation) is the correct starting point per this roadmap's own sequencing, but it will need to retrofit `site_id` onto ~14 existing tables with real production data (the live inquiries/pages/media for `cdoe.info`), not greenfield tables — that migration should be treated as higher-risk than the roadmap's generic Step 2.1–2.6 description implies, and reversibility should be double-checked at each migration.

---

# 1. PRODUCT WE ARE BUILDING

We are building a **simple-to-use multi-site CMS with a visual drag-and-drop page builder**, inspired by the ease of WordPress/Elementor/Webflow-style editors but fully owned by us.

It must be able to manage **multiple completely separate websites** from one CMS account.

Example:

```text
CMS Platform
│
├── Site A: DMX Media
│   ├── Pages
│   ├── Blog
│   ├── Media
│   ├── Leads
│   ├── Forms
│   ├── Menus
│   ├── SEO
│   └── Site Settings
│
├── Site B: Client Website 1
│   ├── Pages
│   ├── Blog
│   ├── Media
│   ├── Leads
│   ├── Forms
│   ├── Menus
│   ├── SEO
│   └── Site Settings
│
└── Site C: Client Website 2
    └── Completely separate data
```

**Data from Site A must never appear inside Site B or Site C.**

---

# 2. NON-NEGOTIABLE ARCHITECTURE RULES

Claude must follow these rules for every future feature.

## 2.1 Multi-site isolation

Every site-specific record must contain `site_id`.

Examples:

```text
pages.site_id
page_versions.site_id
posts.site_id
categories.site_id
media.site_id
forms.site_id
form_submissions.site_id
leads.site_id
menus.site_id
redirects.site_id
site_settings.site_id
seo_settings.site_id
components.site_id
collections.site_id
collection_items.site_id
```

A query such as this is forbidden:

```ts
findMany({ where: { status: 'published' } })
```

It must be scoped to the current site:

```ts
findMany({
  where: {
    siteId: activeSiteId,
    status: 'published'
  }
})
```

## 2.2 Never trust a site ID supplied by the browser

The backend must verify that the signed-in user actually has access to that site.

Correct flow:

```text
Request
  ↓
Authenticated User
  ↓
Requested/Active Site
  ↓
Verify site membership + permission
  ↓
Query only records where site_id = verified site
```

## 2.3 Shared/global tables vs site-scoped tables

Only truly platform-level data can be global.

### Global/platform tables

```text
users
roles (or role definitions)
sites
site_memberships
platform_settings
```

### Site-scoped tables

Almost everything else:

```text
pages
posts
media
leads
forms
menus
redirects
settings
collections
components
activity logs
SEO data
```

## 2.4 Unique constraints must usually include site_id

Wrong:

```text
UNIQUE(slug)
```

Correct:

```text
UNIQUE(site_id, slug)
```

This allows both Site A and Site B to have `/about` without conflicts.

## 2.5 Media isolation

Store files under a site-specific path/prefix.

```text
/sites/{siteId}/media/...
```

Never place every site's uploads into one uncontrolled folder.

## 2.6 Leads isolation

Every lead must belong to exactly one site.

```text
lead.site_id
lead.form_id
lead.source_page_id
```

Lead notifications must use the selected site's email settings.

## 2.7 Same renderer for editor preview and published website

Do not build separate rendering logic.

```text
Page JSON
   ↓
Shared Renderer
   ├── Visual Editor Preview
   └── Live Website
```

## 2.8 Structured JSON is the page source of truth

Do not store generated HTML as the primary page document.

Use structured JSON and render it.

## 2.9 All editor changes go through commands/actions

Examples:

```text
addNode
removeNode
moveNode
updateProps
updateStyles
duplicateNode
```

This is required for reliable undo/redo and future collaboration.

## 2.10 Do not rebuild unrelated systems

Before adding a feature, inspect whether an equivalent system already exists in the project.

Reuse/refactor instead of creating duplicates.

---

# 3. VISUAL/UX DIRECTION

The CMS should feel close to the sample admin panel supplied by the owner:

- dark left sidebar
- light main workspace
- orange primary accent
- clean rounded cards
- large readable spacing
- simple icons
- obvious status chips
- minimal technical wording
- easy enough for a non-developer to use

Main sidebar grouping should be similar to:

```text
Dashboard

CONTENT
  Pages
  Blog
  Media
  FAQs
  Testimonials
  Components

GROWTH
  Leads
  Forms
  Site Health
  Navigation
  Redirects
  404 Monitor

DESIGN
  Visual Builder
  Templates
  Global Styles
  Menus

SYSTEM
  Settings
  Users
  Tools
  Activity Log
  My Account
```

## 3.1 Site switcher must be always easy to access

Place it at the top of the sidebar or top header.

Example:

```text
[ DMX Media ▾ ]
```

Dropdown:

```text
DMX Media            ✓
Client Site A
Client Site B
----------------------
+ Add Website
Manage Websites
```

When switching:

1. Save/finish current safe state.
2. Change `activeSiteId`.
3. Reload site-specific navigation/data.
4. Update site name/logo/domain in header.
5. Never retain Site A data in Site B screens.

## 3.2 Dashboard

Dashboard cards should be easy to read, for the current site only:

```text
Leads this week
Total leads
Pages
Blog posts
Pending approvals
SEO issues
```

Below:

```text
Recent Leads
Recent Activity
Quick Actions
```

No cross-site totals unless the user intentionally opens a separate **Platform Overview** page.

---

# 4. RECOMMENDED STACK RULE

First inspect the current codebase.

**Do not rewrite the existing website solely to match this recommendation.**

If the project is already React/Next.js/TypeScript, prefer continuing with it.

Recommended modern stack when compatible:

```text
Frontend/Admin: React or Next.js + TypeScript
Database: PostgreSQL
Schema validation: Zod
Visual builder: Puck and/or custom builder modules
Drag/drop extension: dnd-kit where needed
Rich text: Tiptap
State: Zustand or existing state solution
Object storage later: S3-compatible/R2
Email later: existing SMTP/provider or configurable provider
Tests: unit + integration + Playwright/e2e
```

Do not introduce a new dependency unless it clearly solves a real problem.

---

# 5. SECURITY + CREDENTIAL RULES

Never ask the owner to paste account passwords into Claude.

Never hard-code:

```text
Database passwords
SMTP passwords
API keys
Cloud storage keys
GitHub tokens
Hosting tokens
Payment details
```

Use environment variables:

```env
DATABASE_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
MAIL_FROM=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

Commit only:

```text
.env.example
```

Never commit:

```text
.env
.env.local
.env.production
```

Use separate development and production credentials.

---

# 6. DATABASE / DATA MODEL MASTER MAP

Exact table names may adapt to the existing stack, but the concepts must stay.

## 6.1 Platform tables

### `users`

```text
id
name
email
password_hash / auth_provider_id
status
created_at
updated_at
```

### `sites`

```text
id
name
slug
primary_domain
logo_url
status
created_by
created_at
updated_at
```

### `site_memberships`

This table lets one user access multiple sites.

```text
id
site_id
user_id
role
status
created_at
```

Recommended unique key:

```text
UNIQUE(site_id, user_id)
```

### Optional `roles` / `permissions`

```text
roles
permissions
role_permissions
```

or keep role permissions in code initially and expand later.

---

## 6.2 Site-scoped content tables

### `pages`

```text
id
site_id
title
slug
parent_page_id
status
draft_version_id
published_version_id
template_id
created_by
updated_by
created_at
updated_at
published_at
```

Unique:

```text
UNIQUE(site_id, slug)
```

### `page_versions`

```text
id
site_id
page_id
version_number
document_json
created_by
created_at
```

### `posts`

```text
id
site_id
title
slug
excerpt
content_json or rich_text_json
featured_media_id
status
author_id
published_at
created_at
updated_at
```

### `categories`

```text
id
site_id
name
slug
```

### `post_categories`

```text
site_id
post_id
category_id
```

### `media`

```text
id
site_id
filename
storage_key
mime_type
size
width
height
alt_text
caption
folder_id
uploaded_by
created_at
```

### `media_folders`

```text
id
site_id
name
parent_id
```

### `menus`

```text
id
site_id
name
location
```

### `menu_items`

```text
id
site_id
menu_id
parent_id
label
link_type
page_id
url
target
sort_order
```

### `site_settings`

Prefer one structured record per site or categorized settings.

```text
site_id
site_name
logo
favicon
timezone
locale
contact_email
business_phone
business_address
social_links
analytics_config
custom_head_code
custom_footer_code
```

### `seo_settings`

```text
site_id
default_title_template
default_description
default_og_image
robots_rules
sitemap_enabled
organization_schema
```

### `redirects`

```text
id
site_id
from_path
to_path
status_code
enabled
created_at
```

### `not_found_logs`

```text
id
site_id
path
referrer
hit_count
last_seen_at
```

---

## 6.3 Forms + leads tables

### `forms`

```text
id
site_id
name
slug
fields_json
settings_json
created_at
updated_at
```

### `form_submissions`

```text
id
site_id
form_id
page_id
payload_json
submitted_at
ip_hash_or_safe_metadata
user_agent
utm_source
utm_medium
utm_campaign
```

### `leads`

```text
id
site_id
form_submission_id
name
email
phone
company
program_or_interest
status
assigned_to
source
source_page_id
notes
created_at
updated_at
```

Possible status:

```text
new
contacted
qualified
enrolled_or_won
lost
spam
```

### `lead_notes`

```text
id
site_id
lead_id
user_id
note
created_at
```

### `email_settings`

Must be site-specific.

```text
site_id
provider_type
from_name
from_email
reply_to
notification_recipients
lead_notification_enabled
```

Secrets must be encrypted or environment/provider references, not exposed in browser JSON.

### `email_logs`

```text
id
site_id
lead_id
form_submission_id
template
recipient
status
provider_message_id
sent_at
error_summary
```

---

## 6.4 Visual builder tables

### `components`

For reusable/global components.

```text
id
site_id
name
type
document_json
is_global
created_at
updated_at
```

### `component_versions`

```text
id
site_id
component_id
document_json
version_number
created_at
```

### `patterns`

Reusable copied sections.

```text
id
site_id
name
category
document_json
thumbnail
```

### `templates`

```text
id
site_id
name
type
page_json
```

### `design_tokens`

```text
id
site_id
category
name
key
value_json
```

Examples:

```text
colors
fonts
spacing
radius
shadow
breakpoints
```

---

## 6.5 Dynamic CMS tables

### `collections`

```text
id
site_id
name
slug
settings_json
```

### `collection_fields`

```text
id
site_id
collection_id
name
key
field_type
settings_json
sort_order
```

### `collection_items`

```text
id
site_id
collection_id
slug
data_json
status
created_at
updated_at
published_at
```

Every lookup still includes `site_id`.

---

## 6.6 Audit tables

### `activity_logs`

```text
id
site_id nullable for platform-only events
user_id
action
entity_type
entity_id
summary
metadata_json
created_at
```

The Dashboard Recent Activity section should show activity for the active site only.

---

# 7. PAGE DOCUMENT / BUILDER SCHEMA

Use a versioned structure.

Example:

```ts
interface PageDocument {
  schemaVersion: number;
  pageId: string;
  siteId: string;
  root: BuilderNode;
  seo?: SeoData;
}
```

Node:

```ts
interface BuilderNode {
  id: string;
  type: string;
  name?: string;
  props: Record<string, unknown>;
  styles: ResponsiveStyles;
  attributes?: Record<string, string>;
  bindings?: DataBinding[];
  conditions?: Condition[];
  animations?: AnimationConfig[];
  children?: BuilderNode[];
  hidden?: boolean;
  locked?: boolean;
}
```

Responsive styles:

```ts
interface ResponsiveStyles {
  base?: StyleMap;
  tablet?: StyleMap;
  mobile?: StyleMap;
}
```

Only overrides belong in tablet/mobile.

---

# 8. COMPONENT REGISTRY RULE

Do not hard-code every element into the editor core.

A component definition should contain concepts like:

```text
type
label
icon
category
defaultProps
allowedChildren
fields/inspector schema
renderer
```

Initial components:

```text
Section
Container
Row
Column
Stack
Grid
Heading
Text
RichText
Image
Button
Divider
Spacer
Icon
```

Later:

```text
Navbar
Menu
Form
Input
Textarea
Select
Checkbox
Tabs
Accordion
Modal
Carousel
Video
Gallery
CollectionList
DynamicText
DynamicImage
DynamicLink
HTML Embed
```

---

# 9. CLAUDE EXECUTION PROTOCOL FOR EVERY STEP

Before coding Claude must output:

```text
STEP:

FILES TO INSPECT:

FILES LIKELY TO CHANGE:

DATABASE/MIGRATION IMPACT:

TEST PLAN:
```

After coding Claude must output:

```text
COMPLETED:

FILES CHANGED:

MIGRATIONS:

TESTS RUN:

MANUAL TEST:

KNOWN LIMITATIONS:

NEXT STEP (do not execute yet):
```

Definition of Done for a step:

```text
[ ] Type checking passes
[ ] Build passes
[ ] Relevant automated tests pass
[ ] No new console errors
[ ] Data survives refresh when persistence is involved
[ ] Site isolation tests pass when site data is involved
[ ] Existing working functionality still works
```

---

# 10. STEP-BY-STEP BUILD ROADMAP

Do these in order.

---

## PHASE 1 — AUDIT + PROTECT CURRENT PROJECT

### [x] Step 1.1 — Audit current stack only — COMPLETED 2026-09-03

Findings recorded in [§0.5 CURRENT_ARCHITECTURE](#05-current_architecture-step-11-audit--completed-2026-09-03) above. No code was changed.

### [ ] Step 1.2 — Create safety branch + baseline tests

Before major CMS work:

```text
create/confirm Git branch
run current build
run current tests
record known failures
```

Do not “fix” unrelated existing issues without permission.

### [ ] Step 1.3 — Create migration strategy

Confirm how schema/database migrations work in the current project.

Acceptance:

```text
One reversible migration can be created and applied in development.
```

---

## PHASE 2 — MULTI-SITE FOUNDATION (MUST COME BEFORE PAGE BUILDER)

### [x] Step 2.1 — Create `sites` — COMPLETED 2026-09-03

Implemented `sites` table + `listSitesFn`/`getSiteFn`/`createSiteFn`/`updateSiteFn` in `src/backend/sites/actions.ts`. Migration `0001_add_sites_table` generated and tested on the dev database (created two independent sites, confirmed duplicate-slug rejection, cleaned up test rows). No UI yet, no other tables touched.

Implement the Site model/table and CRUD service.

Minimum fields:

```text
id
name
slug
primary_domain
status
created_by
created_at
updated_at
```

Acceptance:

```text
Can create Site A and Site B.
Both exist independently.
```

### [ ] Step 2.2 — Create `site_memberships`

One user can belong to multiple sites.

Acceptance:

```text
User A can access Site A.
User A can optionally access Site B.
User B cannot access Site A unless membership exists.
```

### [ ] Step 2.3 — Create verified Active Site context

Implement one safe backend-supported concept:

```text
activeSiteId
```

The browser may request a site, but the backend must verify membership.

Acceptance:

```text
Invalid site ID → rejected.
Unauthorized site ID → 403.
Authorized site ID → accepted.
```

### [ ] Step 2.4 — Add site switcher UI

Add easy site switcher in the admin shell.

Visual direction:

```text
[ Site Logo ] DMX Media ▾
```

Acceptance:

```text
Switch from Site A to Site B.
Header changes.
Dashboard reloads.
No old site-specific data remains visible.
```

### [ ] Step 2.5 — Add Site Management screen

Simple table/cards:

```text
Name
Domain
Status
Members
Actions
```

Actions:

```text
Open
Edit
Manage Members
Archive
```

### [ ] Step 2.6 — Build automated site-isolation test helper

Create reusable tests proving that any site-scoped service/API never leaks records across sites.

This helper must be reused in future phases.

---

## PHASE 3 — CMS ADMIN SHELL / DASHBOARD

### [ ] Step 3.1 — Rebuild/standardize admin shell without breaking existing screens

Visual structure:

```text
Dark sidebar
Light content area
Orange accent
Grouped menu sections
Top active-site indicator
User account bottom/upper menu
```

### [ ] Step 3.2 — Active-site Dashboard

Cards:

```text
Leads this week
Total Leads
Pages
Blog Posts
Pending Approvals
SEO Issues
```

Then:

```text
Recent Leads
Recent Activity
Quick Actions
```

Everything on this dashboard must be filtered by active `site_id`.

### [ ] Step 3.3 — Platform Overview (optional admin-only)

This is the only screen allowed to intentionally aggregate multiple sites.

Examples:

```text
Total Sites
Sites needing attention
Total platform users
```

Clearly label it **Platform Overview**, not a normal site dashboard.

---

## PHASE 4 — PAGES + DRAFT/PUBLISH FOUNDATION

### [ ] Step 4.1 — Make Pages fully site-scoped

Implement/upgrade `pages.site_id`.

Acceptance test:

```text
Create /about in Site A.
Create /about in Site B.
No conflict.
Neither appears in the other site's page list.
```

### [ ] Step 4.2 — Page list UX

Columns:

```text
Title
Slug
Status
Updated
Author
Actions
```

Actions:

```text
Edit
Edit Visually
Preview
Duplicate
Trash
```

### [ ] Step 4.3 — Draft vs Published records

Public website reads **published** page version.
Visual editor reads **draft** page version.

Acceptance:

```text
Edit draft → public live page unchanged.
Publish → live page updates.
```

### [ ] Step 4.4 — Page versions

Create version history.

Minimum actions:

```text
View
Restore
```

Do “Compare/Diff” later.

---

## PHASE 5 — SHARED PAGE RENDERER

### [ ] Step 5.1 — Define Builder JSON schema

Add schema validation.

Invalid document must not save.

### [ ] Step 5.2 — Build shared Renderer

Support only:

```text
Section
Container
Heading
Text
Image
Button
```

Acceptance:

```text
Same JSON renders correctly in preview and live rendering mode.
```

### [ ] Step 5.3 — Build Component Registry

Renderer must resolve nodes from a registry, not hard-coded giant switch statements.

Acceptance:

```text
A new demo component can be registered without changing renderer core logic.
```

---

## PHASE 6 — VISUAL EDITOR SHELL

### [ ] Step 6.1 — Create Visual Editor route

Example:

```text
/admin/sites/{siteId}/pages/{pageId}/editor
```

or equivalent safe route in the current stack.

### [ ] Step 6.2 — Build editor layout

Target layout:

```text
TOP BAR
Back | Page | Desktop Tablet Mobile | Undo Redo | Preview | Save | Publish

LEFT
Add | Layers | Pages | CMS | Assets | Components

CENTER
Canvas

RIGHT
Content | Style | Advanced | Animation
```

### [ ] Step 6.3 — Add actual renderer preview inside isolated canvas/iframe when compatible

Use the shared renderer.

Do not create a fake second page renderer.

### [ ] Step 6.4 — Selection system

Clicking a visual element must set:

```text
selectedNodeId
```

Show a clear orange selection outline.

### [ ] Step 6.5 — Hover system

Hover an element → subtle outline + element label.

Do not interfere with actual page controls.

---

## PHASE 7 — LAYERS + ADD ELEMENTS + DRAG/DROP

### [ ] Step 7.1 — Layers tree

Show nested structure.

Example:

```text
Page
  Section
    Container
      Heading
      Text
      Button
```

Features:

```text
select
rename
collapse
expand
hide
lock
```

### [ ] Step 7.2 — Add Element panel

Start with:

```text
Section
Container
Row
Column
Heading
Text
Image
Button
Divider
Spacer
```

Clicking inserts an element in a valid location.

### [ ] Step 7.3 — Drag/drop reorder

Implement reliable reordering inside the same parent.

### [ ] Step 7.4 — Drag/drop nesting

Allow valid cross-container moves.

Rules:

```text
Heading cannot contain Section.
Button cannot contain Container.
Section/Container can contain approved children.
A node cannot be dropped inside itself or one of its descendants.
```

### [ ] Step 7.5 — Floating element toolbar

Selected element toolbar similar to the reference builder:

```text
ELEMENT NAME | Move Up | Move Down | Settings | Duplicate | Code/Advanced | Delete
```

### [ ] Step 7.6 — Context menu

Right click:

```text
Copy
Paste
Duplicate
Move Up
Move Down
Wrap
Save as Pattern
Lock
Hide
Delete
```

Implement only actions supported at this stage; disable future ones cleanly.

---

## PHASE 8 — EDITOR COMMANDS + UNDO/REDO

### [ ] Step 8.1 — Central mutation commands

Create commands such as:

```text
addNode
removeNode
moveNode
duplicateNode
updateProps
updateStyles
```

No random direct page JSON mutations from UI components.

### [ ] Step 8.2 — Undo/redo

Must support:

```text
Add
Delete
Move
Duplicate
Content edit
Style edit
```

Keyboard:

```text
Ctrl/Cmd+Z
Ctrl/Cmd+Shift+Z
```

### [ ] Step 8.3 — Copy/paste

Copy nodes between positions on the same page.

Later allow between pages of the same site.

Do not copy site-bound data into another site without an explicit import/clone workflow.

---

## PHASE 9 — INSPECTOR / CONTENT SETTINGS

### [ ] Step 9.1 — Schema-driven Inspector

Inspector controls must be generated from component definitions where possible.

### [ ] Step 9.2 — Heading controls

```text
Text
Tag H1-H6
Link optional
```

### [ ] Step 9.3 — Text controls

```text
Text/Rich text
```

### [ ] Step 9.4 — Image controls

```text
Select Media
Alt Text
Caption
Link
Object Fit
Object Position
Lazy Load
```

### [ ] Step 9.5 — Button controls

```text
Label
Link
Target
Icon
Icon position
```

---

## PHASE 10 — STYLE ENGINE

Build in small batches.

### [ ] Step 10.1 — Basic spacing/sizing

```text
Width
Height
Min/Max Width
Min/Max Height
Margin
Padding
```

Units:

```text
px
%
rem
em
vw
vh
auto
```

### [ ] Step 10.2 — Typography

```text
Font family
Weight
Size
Line height
Letter spacing
Color
Alignment
Text transform
Text decoration
```

### [ ] Step 10.3 — Background

```text
Color
Image
Gradient
Position
Size
Repeat
Overlay
```

### [ ] Step 10.4 — Border + radius

```text
Width
Style
Color
Radius
Per-corner radius
```

### [ ] Step 10.5 — Flexbox

```text
Display
Direction
Wrap
Justify
Align
Gap
Grow
Shrink
Basis
Order
```

### [ ] Step 10.6 — Grid

```text
Columns
Rows
Gap
Auto Flow
Grid position
```

### [ ] Step 10.7 — Position

```text
Static
Relative
Absolute
Fixed
Sticky
Top/Right/Bottom/Left
Z-index
```

### [ ] Step 10.8 — Effects

```text
Opacity
Box shadow
Text shadow
Overflow
Transform
Filter
Backdrop filter
Transition
```

---

## PHASE 11 — RESPONSIVE EDITING

### [ ] Step 11.1 — Viewport selector

Top bar:

```text
Desktop
Tablet
Mobile
```

### [ ] Step 11.2 — Save breakpoint overrides only

Base/Desktop contains base values.
Tablet/Mobile store only overrides.

### [ ] Step 11.3 — Style inheritance indicator

Show whether a property is:

```text
Inherited
Overridden
Reset to inherited
```

### [ ] Step 11.4 — Per-device visibility

Allow:

```text
Show on Desktop
Show on Tablet
Show on Mobile
```

Do not use destructive deletion to hide elements.

---

## PHASE 12 — GLOBAL DESIGN SYSTEM

### [ ] Step 12.1 — Colors

Site-scoped tokens:

```text
Primary
Secondary
Text
Muted
Background
Border
Success
Warning
Danger
```

### [ ] Step 12.2 — Typography presets

```text
Body
H1
H2
H3
H4
H5
H6
Small
Button
Link
```

### [ ] Step 12.3 — Spacing/radius/shadow tokens

Reusable tokens.

### [ ] Step 12.4 — Theme/global update

Changing a token updates every component using that token on that site only.

Site B must remain unchanged.

---

## PHASE 13 — RICH TEXT

### [ ] Step 13.1 — Integrate rich-text editor

Start with:

```text
Paragraph
H1-H6
Bold
Italic
Underline
Links
Bullets
Numbering
Quote
Code
Undo/Redo
```

### [ ] Step 13.2 — Add media/table support

After the base rich text is stable.

### [ ] Step 13.3 — Inline editing in visual canvas

Only after normal rich-text editing works reliably.

---

## PHASE 14 — MEDIA LIBRARY

### [ ] Step 14.1 — Site-scoped Media screen

Tabs/filters:

```text
All
Images
Videos
Documents
```

### [ ] Step 14.2 — Upload

Requirements:

```text
Site-specific storage path
File type validation
Size validation
Image dimension capture
```

### [ ] Step 14.3 — Media details

```text
Preview
Filename
Alt text
Caption
Dimensions
File size
Copy URL
Replace
Delete
```

### [ ] Step 14.4 — Folders

Site-specific folders only.

### [ ] Step 14.5 — Image optimization

Later add responsive image variants and WebP/AVIF where appropriate.

---

## PHASE 15 — AUTOSAVE + PUBLISHING + HISTORY

### [ ] Step 15.1 — Autosave draft

Flow:

```text
Change
↓
Local state
↓
Debounce
↓
Save draft
↓
Saved ✓
```

Never auto-publish.

### [ ] Step 15.2 — Publish

Explicit Publish button.

### [ ] Step 15.3 — Preview unpublished draft

Use secure preview token/session.

### [ ] Step 15.4 — Version history UI

Show:

```text
Date
User
Action
Version
```

Actions:

```text
Preview
Restore
```

### [ ] Step 15.5 — Scheduled publishing

Only after normal publish is stable.

---

## PHASE 16 — REUSABLE PATTERNS + GLOBAL COMPONENTS

### [ ] Step 16.1 — Patterns

“Save as Pattern” stores a copyable section for that site.

When inserted, it becomes an independent copy.

### [ ] Step 16.2 — Pattern library

Categories:

```text
Hero
Features
Testimonials
Pricing
FAQ
CTA
Contact
Footer
Custom
```

### [ ] Step 16.3 — Global Components

Examples:

```text
Header
Footer
CTA
Announcement Bar
```

Editing definition updates all linked instances on that site.

### [ ] Step 16.4 — Instance overrides

Allow only explicitly exposed props to vary between instances.

---

## PHASE 17 — MENUS + NAVIGATION

### [ ] Step 17.1 — Site-scoped Menu Manager

```text
Primary Menu
Footer Menu
Mobile Menu
```

### [ ] Step 17.2 — Drag/drop menu items

Support nested items.

### [ ] Step 17.3 — Bind navigation component to a menu

The site header can consume a selected menu.

---

## PHASE 18 — BLOG

### [ ] Step 18.1 — Site-scoped Blog Posts

Metadata:

```text
Title
Slug
Excerpt
Featured image
Author
Category
Tags
Status
Publish date
SEO
```

### [ ] Step 18.2 — Blog rich-content editor

Use the rich-text system.

### [ ] Step 18.3 — Blog archive/list page

Allow visual layout control using Collection List later.

### [ ] Step 18.4 — Blog post template

One design renders all posts for a site.

### [ ] Step 18.5 — Categories/tags

Must be site-scoped.

Site A category `SEO` and Site B category `SEO` are separate records.

---

## PHASE 19 — CUSTOM COLLECTIONS / DYNAMIC CMS

### [ ] Step 19.1 — Collection Builder

Initial field types:

```text
Text
Long Text
Rich Text
Number
Boolean
Date
Image
Select
Reference
Multi-reference
URL
Email
```

### [ ] Step 19.2 — Collection item editor

Auto-generate forms from field definitions.

### [ ] Step 19.3 — Dynamic data binding

Visual components can choose:

```text
Static Content
Connect Data
```

Start with:

```text
Dynamic Text
Dynamic Image
Dynamic Link
```

### [ ] Step 19.4 — Collection template

One visual template renders every item.

### [ ] Step 19.5 — Collection List

Controls:

```text
Source
Filter
Sort
Limit
```

### [ ] Step 19.6 — Pagination/search/filter

Add only after basic Collection List works.

---

## PHASE 20 — FORMS + LEADS + EMAIL (IMPORTANT)

This phase must preserve the simple lead-management experience shown in the sample CMS.

### [ ] Step 20.1 — Form Builder component

Initial fields:

```text
Text
Email
Phone
Textarea
Select
Checkbox
Radio
Date
Hidden
Submit Button
```

### [ ] Step 20.2 — Server-side submission endpoint

On submit:

```text
Validate
Anti-spam/rate limit
Store Form Submission
Optionally create/update Lead
Trigger notification job/email
Return safe success response
```

### [ ] Step 20.3 — Lead creation

Map common form fields into `leads`.

Required relation:

```text
lead.site_id = form.site_id
```

Never trust a hidden browser `site_id` without server validation.

### [ ] Step 20.4 — Leads screen

Visual direction similar to existing CMS.

Tabs/status filters:

```text
All
New
Contacted
Qualified/Enrolled/Won
Lost
Spam
```

Each card/row can show:

```text
Name
Email
Phone
Interest/Program
State/Location optional
Source
Received date
Assigned user
Status
```

Actions:

```text
Change status
Assign
Add note
Email/Contact shortcut
Delete/Spam
```

### [ ] Step 20.5 — Lead detail panel/page

Show:

```text
Contact details
Original form submission
Source page
UTM/source data
Notes timeline
Status history
Email history
```

### [ ] Step 20.6 — Per-site notification recipients

Each website can configure its own recipients.

Example:

```text
Site A Lead → sales@site-a.com
Site B Lead → enquiries@site-b.com
```

### [ ] Step 20.7 — Send lead email notification

Email should contain:

```text
Site name
Lead name
Email
Phone
Form name
Source page
Submission values
Timestamp
Link to lead inside CMS
```

Do not include sensitive technical secrets.

### [ ] Step 20.8 — Email logging/retry

Store status:

```text
queued
sent
failed
```

Do not lose the lead if email sending fails.

The database is the source of truth; email is a notification.

### [ ] Step 20.9 — Export CSV

Export only leads from the current active site and applied filters.

### [ ] Step 20.10 — Lead isolation tests

Required tests:

```text
Site A admin cannot read Site B leads.
Site A export contains no Site B rows.
Site A notification config cannot send Site B lead data.
Direct API manipulation with Site B lead ID returns 403/404.
```

---

## PHASE 21 — SEO + REDIRECTS + 404 + SITE HEALTH

### [ ] Step 21.1 — Page SEO

```text
SEO title
Meta description
Canonical URL
Index/Noindex
Follow/Nofollow
OG title
OG description
OG image
```

### [ ] Step 21.2 — Site SEO defaults

Site-specific defaults.

### [ ] Step 21.3 — Sitemap + robots controls

Generate per site/domain.

### [ ] Step 21.4 — Redirect Manager

Site-scoped:

```text
From
To
301/302
Status
```

### [ ] Step 21.5 — 404 Monitor

Track missing paths per site.

### [ ] Step 21.6 — Site Health

Initial checks:

```text
Missing page titles
Missing descriptions
Missing image alt text
Broken internal links
Multiple H1 warnings
Missing form labels
```

Keep diagnostics simple and actionable.

---

## PHASE 22 — ADVANCED PAGE BUILDER FEATURES

### [ ] Step 22.1 — Element states

```text
Normal
Hover
Focus
Active
Disabled
```

### [ ] Step 22.2 — Animation basics

```text
Fade
Slide
Scale
Rotate
```

Controls:

```text
Duration
Delay
Easing
```

### [ ] Step 22.3 — Scroll/interaction triggers

Only after basic animations are stable.

### [ ] Step 22.4 — Custom CSS

Scope custom element CSS safely.

### [ ] Step 22.5 — Custom attributes

```text
aria-label
role
title
data-*
tabindex
```

### [ ] Step 22.6 — HTML Embed

Sanitize unsafe HTML.

Arbitrary scripts must be restricted to privileged administrators and safely isolated.

### [ ] Step 22.7 — CSS classes for advanced users

Optional advanced mode; normal users should not need CSS knowledge.

---

## PHASE 23 — ROLES + PERMISSIONS + CLIENT-SAFE EDITING

### [ ] Step 23.1 — Roles

Start with:

```text
Super Admin
Site Admin
Designer
Editor
Author
Viewer
```

### [ ] Step 23.2 — Permissions

Examples:

```text
View Pages
Edit Page Content
Edit Page Layout
Publish Pages
Manage Blog
Manage Media
Manage Leads
Export Leads
Manage Forms
Manage SEO
Manage Users
Manage Site Settings
Use Custom Code
```

### [ ] Step 23.3 — Designer mode

Full layout/style access.

### [ ] Step 23.4 — Content Editor mode

Allow text/image/link changes without layout destruction.

### [ ] Step 23.5 — Super Admin site access

Super Admin can switch across permitted/all sites.

Normal Site Admin sees only assigned site(s).

---

## PHASE 24 — AUDIT / ACTIVITY LOG

### [ ] Step 24.1 — Log meaningful actions

Examples:

```text
created page
published page
restored version
created lead note
changed lead status
updated settings
added team member
deleted media
```

### [ ] Step 24.2 — Site-scoped Activity screen

Default screen shows active-site logs only.

### [ ] Step 24.3 — Platform audit view for Super Admin

Optional global filterable view.

---

## PHASE 25 — SITE SETTINGS + DOMAINS

### [ ] Step 25.1 — General Settings

```text
Site name
Logo
Favicon
Timezone
Language
Business info
Social links
```

### [ ] Step 25.2 — Domain configuration model

Support one or more domains per site later.

Do not mix content based only on host header without validating domain → site mapping.

### [ ] Step 25.3 — Email settings

Per-site notification sender/recipient settings.

### [ ] Step 25.4 — Analytics/integration settings

Site-specific.

Do not expose secrets to client-side JavaScript unless designed as public keys.

---

## PHASE 26 — TEMPLATE + SITE CLONING

### [ ] Step 26.1 — Page templates

```text
Blank
Landing Page
Service Page
About
Contact
```

### [ ] Step 26.2 — Site templates

Later allow creating a new site from a starter template.

### [ ] Step 26.3 — Safe clone site feature

Clone:

```text
Pages
Builder structures
Patterns
Global components
Design tokens
Menus
Optional sample content
```

Do **not** clone by default:

```text
Leads
Real form submissions
Users/members
Email secrets
Analytics secrets
Production domains
Activity logs
```

Every cloned record receives the new `site_id`.

---

## PHASE 27 — BACKUPS / IMPORT / EXPORT

### [ ] Step 27.1 — Site export

Export site structure/content without secrets.

### [ ] Step 27.2 — Site import

Import into a new site ID and rewrite internal references.

### [ ] Step 27.3 — Backups

Implement backup strategy appropriate to the existing infrastructure.

Never rely only on UI-level backups; database/storage backups matter too.

---

## PHASE 28 — PERFORMANCE

### [ ] Step 28.1 — Separate admin/editor bundle from public website bundle

Visitors must not download page-builder libraries.

### [ ] Step 28.2 — Optimize published rendering

Avoid editor-only transformations on every request.

### [ ] Step 28.3 — Image optimization/caching

### [ ] Step 28.4 — Large page editor performance

Virtualize panels/layers when necessary.

Avoid full-page rerender on every small property change.

---

## PHASE 29 — ACCESSIBILITY

### [ ] Step 29.1 — Builder controls keyboard accessibility

### [ ] Step 29.2 — Accessibility inspector

```text
Alt text
ARIA label
Role
Tab index
```

### [ ] Step 29.3 — Site health accessibility rules

```text
Missing alt
Missing form label
Empty link/button
Heading order
Contrast warning where reliable
```

---

## PHASE 30 — OPTIONAL AI FEATURES (BUILD LAST)

Do not implement until core CMS is stable.

### [ ] Step 30.1 — AI content actions

```text
Rewrite text
Shorten
Improve headline
SEO title
Meta description
Alt text
Blog outline
```

### [ ] Step 30.2 — AI section generation

AI must output **approved BuilderNode JSON**, not unrestricted arbitrary HTML.

### [ ] Step 30.3 — AI page generation

AI can use only components registered in the current site's component registry/design system.

### [ ] Step 30.4 — AI usage limits/audit

Track requests/cost if using paid AI APIs.

---

# 11. PAGE BUILDER TARGET FEATURE LIST

The final builder may contain these categories.

## Layout

```text
Section
Container
Row
Column
Stack
Grid
Spacer
Divider
Wrapper
```

## Typography

```text
Heading
Paragraph
Text
Rich Text
List
Blockquote
Code
```

## Media

```text
Image
Gallery
Video
Audio
Icon
SVG
Lottie later
```

## Interactive

```text
Button
Tabs
Accordion
Modal
Drawer
Tooltip
Carousel
Progress
```

## Navigation

```text
Navbar
Menu
Dropdown
Breadcrumb
Pagination
```

## Forms

```text
Form
Text Input
Email
Phone
Textarea
Select
Checkbox
Radio
Date
File Upload later
Hidden
Submit
```

## CMS/Dynamic

```text
Collection List
Dynamic Text
Dynamic Image
Dynamic Link
Repeater
Conditional Content
Pagination
Filter
Search
```

## Advanced

```text
HTML Embed
iframe
Custom Component
JSON-LD
Custom CSS
```

---

# 12. RIGHT INSPECTOR TARGET STRUCTURE

```text
CONTENT
STYLE
ADVANCED
ANIMATION
```

## Content

Component-specific fields.

## Style

```text
Layout
Sizing
Spacing
Typography
Background
Border
Effects
Position
Overflow
Transform
Transitions
```

## Advanced

```text
Element Name
CSS Classes
ID
Attributes
Visibility
Custom CSS
Custom Code permissions
```

## Animation

```text
Preset
Trigger
Duration
Delay
Easing
```

---

# 13. TOP TOOLBAR TARGET

```text
Back
Page selector
Site indicator/switcher
Desktop
Tablet
Mobile
Zoom
Undo
Redo
History
Preview
Save status
Save Draft
Publish
More
```

More menu later:

```text
Duplicate Page
Export
Import
Version History
Page Settings
```

---

# 14. LEFT EDITOR SIDEBAR TARGET

Tabs:

```text
Add
Layers
Pages
CMS
Assets
Components
```

Keep it understandable for a non-technical user.

---

# 15. LEAD MANAGEMENT TARGET UX

The existing simple lead management idea is good and should be retained/improved.

Recommended Lead screen:

```text
Leads / Inquiries

[All] [New] [Contacted] [Qualified/Won] [Lost] [Spam]

Search __________________
Filters: Date | Form | Source | Assigned To
Export CSV
```

Lead card/row:

```text
Name
Email · Phone
Interest/Program
Source · Received
Status dropdown
Assigned user dropdown
Open detail
Delete/Spam
```

Lead detail:

```text
CONTACT
Name
Email
Phone
Company

SOURCE
Site
Form
Page
UTM
Received At

SUBMISSION
All original form fields

PIPELINE
Status
Assigned To

NOTES
Timeline

EMAIL
Notification/email history
```

Keep lead management fast; do not turn it into an overly complicated CRM in V1.

---

# 16. EMAIL FLOW FOR WEBSITE LEADS

Required design:

```text
Website Visitor
      ↓
Form submission
      ↓
Server validation
      ↓
Save submission in database
      ↓
Create/update lead
      ↓
Commit successful database transaction
      ↓
Queue/send notification email
      ↓
Log email status
```

Important:

**Email failure must never delete or lose the lead.**

If email fails:

```text
Lead remains in CMS
Email log = failed
Retry can run later
```

Per-site email configuration:

```text
DMX Media → dmx recipient(s)
Client A → Client A recipient(s)
Client B → Client B recipient(s)
```

Never use one hard-coded recipient for every site.

---

# 17. MULTI-SITE ISOLATION TEST SUITE — REQUIRED

Every major site-scoped feature must pass these tests.

## Test A — list isolation

```text
Create Site A record.
Create Site B record.
Open Site A list.
Only A record appears.
Open Site B list.
Only B record appears.
```

## Test B — direct ID attack

While authenticated for Site A, request a known Site B record by ID.

Expected:

```text
403 or 404
```

Never return Site B data.

## Test C — mutation attack

Try updating/deleting Site B record while active in Site A.

Expected:

```text
Rejected
```

## Test D — export isolation

Exports include only active-site data.

## Test E — search isolation

Global-looking search inside a site still searches only that site's content.

## Test F — dashboard isolation

Counts, recent activity, recent leads and SEO counts are site-specific.

## Test G — media isolation

Site A media picker cannot browse Site B files.

## Test H — lead/email isolation

Site A lead uses Site A recipient configuration only.

## Test I — slug isolation

Both Site A and Site B can safely have `/about`, `/contact`, `/blog`.

## Test J — permissions

A user with membership only in Site A cannot switch to or query Site B.

---

# 18. DO NOT BUILD THESE EARLY

These are useful later but should not block the core CMS:

```text
Real-time collaboration
Plugin marketplace
Full Webflow-style animation timeline
A/B testing
Heatmaps
E-commerce
Advanced personalization
Multi-language
AI page generation
Complex workflow approvals
Advanced CRM automation
```

Build the reliable foundation first.

---

# 19. MILESTONES

## Milestone 1 — Multi-site CMS core

Must support:

```text
Login
Site switcher
Strict site isolation
Dashboard
Pages
Draft/Publish
Simple Blog
Media
Leads
Email notifications
Settings
Activity Log
```

## Milestone 2 — Useful visual builder

Must support:

```text
Visual Edit
Add elements
Drag/drop
Layers
Content settings
Style settings
Responsive editing
Undo/Redo
Autosave
Preview
Publish
```

## Milestone 3 — Professional CMS

```text
Global styles
Patterns
Global components
Menus
SEO
Forms builder
Rich text
Version history
Lead pipeline
Redirects
404 monitor
Site health
Roles
```

## Milestone 4 — Flexible platform

```text
Custom collections
Dynamic bindings
Collection templates
Collection lists
Site cloning
Imports/exports
Advanced animation
Custom code
Localization later
AI later
```

---

# 20. FIRST RELEASE ACCEPTANCE CHECKLIST

Do not call V1 complete until all are true.

## Multi-site

```text
[ ] Can create multiple sites
[ ] Can switch sites easily
[ ] Site-specific data never leaks
[ ] Same slugs work across different sites
[ ] Site memberships/permissions work
```

## Pages

```text
[ ] Create/edit/delete page
[ ] Draft/live separation
[ ] Preview
[ ] Publish
[ ] Version restore
```

## Visual Builder

```text
[ ] Add elements
[ ] Drag/drop
[ ] Layers
[ ] Content Inspector
[ ] Style Inspector
[ ] Desktop/Tablet/Mobile
[ ] Undo/Redo
[ ] Autosave
```

## Content

```text
[ ] Blog
[ ] Media
[ ] Menus
[ ] SEO basics
```

## Leads

```text
[ ] Form submission saved
[ ] Lead created
[ ] Lead shown only in correct site
[ ] Status can change
[ ] Notes work
[ ] CSV export is site-scoped
[ ] Email notification works
[ ] Email failure does not lose lead
```

## Security

```text
[ ] Auth works
[ ] Authorization works
[ ] Cross-site ID attack blocked
[ ] Secrets not exposed
[ ] Uploads validated
[ ] Unsafe HTML sanitized/restricted
```

## Quality

```text
[ ] Build passes
[ ] Typecheck passes
[ ] Tests pass
[ ] No major console errors
[ ] Mobile admin is usable enough for management
[ ] Existing live website functionality remains intact
```

---

# 21. WHEN CLAUDE WANTS TO CHANGE ARCHITECTURE

Claude must stop and ask before doing any of these:

```text
Switching database
Switching framework
Replacing authentication system
Replacing the entire existing CMS
Adding a paid service
Adding a major dependency
Changing public URL structure
Changing multi-site ownership model
Deleting/migrating production content
Making destructive database migrations
Changing live email behavior
Changing live domain/DNS configuration
```

---

# 22. EXTERNAL SERVICES / COST POLICY

The CMS should be buildable locally without purchasing new services.

During local development prefer:

```text
Local database
Local/mock email
Local media storage
Development secrets
```

Only connect production services when the related feature is stable.

Possible future services:

```text
Production hosting
Managed PostgreSQL
Object storage
Transactional email
Backups
Monitoring
AI API (optional)
```

Before introducing a paid service Claude must state:

```text
Why it is needed
Free/local alternative
Approximate cost model
What credentials are required
Whether we can postpone it
```

Never request passwords; request only environment-variable names and guide the owner to create limited API credentials themselves.

---

# 23. VERY IMPORTANT IMPLEMENTATION PRINCIPLE

Whenever Claude builds a feature such as Pages, Leads, Blog, Media, Forms, SEO, Menus, Collections, or Activity Log, Claude must ask itself:

```text
1. Is this record global or site-specific?
2. If site-specific, where is site_id stored?
3. How is active site verified on the backend?
4. Are every list/read/update/delete/search/export query scoped by site_id?
5. Is there an automated cross-site isolation test?
6. Could a direct-ID request bypass the UI?
7. Could cached state show old-site information after switching?
```

If any answer is unclear, the feature is not complete.

---

# 24. SIMPLE DAILY WORKFLOW FOR THE OWNER

You do not need to digest this whole roadmap each day.

Use this workflow:

### First day

```text
Read MASTER_MULTISITE_CMS_BUILD_PLAN_FOR_CLAUDE.md and execute Step 1.1 only.
```

### After Claude finishes

Test what it says to test.

Then say:

```text
Step 1.1 is approved. Mark it complete and execute Step 1.2 only.
```

Repeat.

For a larger step, you may tell Claude:

```text
Break this step into 2-5 internal substeps before coding, but finish only this numbered step. Do not proceed to the next numbered step.
```

This keeps development controlled, understandable, and recoverable.

---

# 25. FINAL PRODUCT EXPERIENCE

The final experience should be:

```text
Login
 ↓
Choose / switch website
 ↓
Dashboard for that website only
 ↓
Pages / Blog / Media / Leads / SEO / Forms / Settings
 ↓
Edit page visually
 ↓
Drag/drop components
 ↓
Change text, image, layout, spacing, colors, responsive styles
 ↓
Preview
 ↓
Publish
```

And for a lead:

```text
Visitor submits form on Site B
 ↓
Lead saved under Site B
 ↓
Site B team receives email
 ↓
Lead appears only in Site B CMS
 ↓
Admin changes New → Contacted → Won/Lost
 ↓
All actions recorded in Site B activity log
```

That is the core product. Advanced features should improve this flow, not make it harder to use.

---

# END OF MASTER BUILD PLAN

**Claude: do not execute multiple phases at once. Work in sequence, preserve site isolation, test every site-scoped feature, and keep the UI simple enough for a non-developer.**

