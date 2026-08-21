import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { getSiteSettingsFn, updateSiteSettingsFn, getEmailConfigFn } from "@/backend/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/_authed/settings")({
  loader: async () => {
    const [settings, emailConfig] = await Promise.all([getSiteSettingsFn(), getEmailConfigFn()]);
    return { settings, emailConfig };
  },
  component: SettingsPage,
});

const TABS = [
  { key: "general", label: "General" },
  { key: "seo", label: "SEO (Site-wide)" },
  { key: "integrations", label: "Integrations" },
  { key: "engagement", label: "Engagement" },
  { key: "advanced", label: "Advanced" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const EMPTY = {
  siteTitle: "",
  siteTagline: "",
  logoUrl: "",
  faviconUrl: "",
  contactPhone: "",
  contactEmail: "",
  contactAddress: "",
  disclaimerText: "",
  robotsTxt: "",
  googleSiteVerification: "",
  bingSiteVerification: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  gaId: "",
  metaPixelId: "",
  gtmId: "",
  sitemapEnabled: true,
  maintenanceMode: false,
  cookieConsentEnabled: true,
  cookieConsentText: "",
  announcementEnabled: false,
  announcementText: "",
  announcementLink: "",
};

function SettingsPage() {
  const { settings: initial, emailConfig } = Route.useLoaderData();
  const [tab, setTab] = useState<TabKey>("general");
  const [form, setForm] = useState({
    siteTitle: initial?.siteTitle ?? EMPTY.siteTitle,
    siteTagline: initial?.siteTagline ?? EMPTY.siteTagline,
    logoUrl: initial?.logoUrl ?? EMPTY.logoUrl,
    faviconUrl: initial?.faviconUrl ?? EMPTY.faviconUrl,
    contactPhone: initial?.contactPhone ?? EMPTY.contactPhone,
    contactEmail: initial?.contactEmail ?? EMPTY.contactEmail,
    contactAddress: initial?.contactAddress ?? EMPTY.contactAddress,
    disclaimerText: initial?.disclaimerText ?? EMPTY.disclaimerText,
    robotsTxt: initial?.robotsTxt ?? EMPTY.robotsTxt,
    googleSiteVerification: initial?.googleSiteVerification ?? EMPTY.googleSiteVerification,
    bingSiteVerification: initial?.bingSiteVerification ?? EMPTY.bingSiteVerification,
    facebook: initial?.socialLinks?.facebook ?? "",
    instagram: initial?.socialLinks?.instagram ?? "",
    linkedin: initial?.socialLinks?.linkedin ?? "",
    youtube: initial?.socialLinks?.youtube ?? "",
    gaId: initial?.analyticsIds?.ga ?? "",
    metaPixelId: initial?.analyticsIds?.metaPixel ?? "",
    gtmId: initial?.analyticsIds?.gtm ?? "",
    sitemapEnabled: initial?.sitemapEnabled ?? EMPTY.sitemapEnabled,
    maintenanceMode: initial?.maintenanceMode ?? false,
    cookieConsentEnabled: initial?.cookieConsentEnabled ?? true,
    cookieConsentText: initial?.cookieConsentText ?? "",
    announcementEnabled: initial?.announcementEnabled ?? false,
    announcementText: initial?.announcementText ?? "",
    announcementLink: initial?.announcementLink ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await updateSiteSettingsFn({
        data: {
          siteTitle: form.siteTitle || null,
          siteTagline: form.siteTagline || null,
          logoUrl: form.logoUrl || null,
          faviconUrl: form.faviconUrl || null,
          contactPhone: form.contactPhone || null,
          contactEmail: form.contactEmail || null,
          contactAddress: form.contactAddress || null,
          disclaimerText: form.disclaimerText || null,
          robotsTxt: form.robotsTxt || null,
          googleSiteVerification: form.googleSiteVerification || null,
          bingSiteVerification: form.bingSiteVerification || null,
          socialLinks: {
            ...(form.facebook ? { facebook: form.facebook } : {}),
            ...(form.instagram ? { instagram: form.instagram } : {}),
            ...(form.linkedin ? { linkedin: form.linkedin } : {}),
            ...(form.youtube ? { youtube: form.youtube } : {}),
          },
          analyticsIds: {
            ...(form.gaId ? { ga: form.gaId } : {}),
            ...(form.metaPixelId ? { metaPixel: form.metaPixelId } : {}),
            ...(form.gtmId ? { gtm: form.gtmId } : {}),
          },
          sitemapEnabled: form.sitemapEnabled,
          maintenanceMode: form.maintenanceMode,
          cookieConsentEnabled: form.cookieConsentEnabled,
          cookieConsentText: form.cookieConsentText || null,
          announcementEnabled: form.announcementEnabled,
          announcementText: form.announcementText || null,
          announcementLink: form.announcementLink || null,
        },
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
          <SettingsIcon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Site-wide configuration — things that apply everywhere, not to one page.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${
              tab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card">
        {tab === "general" && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input id="siteTitle" value={form.siteTitle} onChange={(e) => set("siteTitle", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="siteTagline">Tagline</Label>
              <Input id="siteTagline" placeholder="Not set" value={form.siteTagline} onChange={(e) => set("siteTagline", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input id="logoUrl" value={form.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="faviconUrl">Favicon URL</Label>
              <Input id="faviconUrl" placeholder="/favicon.ico" value={form.faviconUrl} onChange={(e) => set("faviconUrl", e.target.value)} />
            </div>
            <hr className="border-border" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Contact</p>
            <div className="space-y-1.5">
              <Label htmlFor="contactPhone">Phone (footer)</Label>
              <Input id="contactPhone" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactEmail">Email (footer)</Label>
              <Input id="contactEmail" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactAddress">Office Address</Label>
              <Textarea id="contactAddress" rows={2} value={form.contactAddress} onChange={(e) => set("contactAddress", e.target.value)} />
            </div>
            <hr className="border-border" />
            <div className="space-y-1.5">
              <Label htmlFor="disclaimerText">Footer Disclaimer Text</Label>
              <Textarea id="disclaimerText" rows={4} value={form.disclaimerText} onChange={(e) => set("disclaimerText", e.target.value)} />
            </div>
            <hr className="border-border" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Social Links</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label htmlFor="facebook">Facebook URL</Label><Input id="facebook" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} /></div>
              <div className="space-y-1.5"><Label htmlFor="instagram">Instagram URL</Label><Input id="instagram" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} /></div>
              <div className="space-y-1.5"><Label htmlFor="linkedin">LinkedIn URL</Label><Input id="linkedin" value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} /></div>
              <div className="space-y-1.5"><Label htmlFor="youtube">YouTube URL</Label><Input id="youtube" value={form.youtube} onChange={(e) => set("youtube", e.target.value)} /></div>
            </div>
          </>
        )}

        {tab === "seo" && (
          <>
            <p className="text-xs text-muted-foreground">
              These apply to the whole site — for one page's meta title, description, robots and schema, edit that page directly under Pages or Blog Posts.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="robotsTxt">robots.txt</Label>
              <Textarea id="robotsTxt" rows={4} className="font-mono text-xs" value={form.robotsTxt} onChange={(e) => set("robotsTxt", e.target.value)} />
              <p className="text-xs text-muted-foreground">Served live at /robots.txt.</p>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">XML Sitemap</p>
                <p className="text-xs text-muted-foreground">Auto-generated at /sitemap.xml from published pages &amp; posts.</p>
              </div>
              <Switch checked={form.sitemapEnabled} onCheckedChange={(v) => set("sitemapEnabled", v)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="googleSiteVerification">Google Search Console verification tag</Label>
              <Input id="googleSiteVerification" placeholder="Paste your verification meta content value" value={form.googleSiteVerification} onChange={(e) => set("googleSiteVerification", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bingSiteVerification">Bing Webmaster verification tag</Label>
              <Input id="bingSiteVerification" placeholder="Not set" value={form.bingSiteVerification} onChange={(e) => set("bingSiteVerification", e.target.value)} />
            </div>
          </>
        )}

        {tab === "integrations" && (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Analytics</p>
            <div className="space-y-1.5">
              <Label htmlFor="gaId">Google Analytics 4 (GA4) Measurement ID</Label>
              <Input id="gaId" placeholder="G-XXXXXXXXXX" value={form.gaId} onChange={(e) => set("gaId", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gtmId">Google Tag Manager (GTM) Container ID</Label>
              <Input id="gtmId" placeholder="GTM-XXXXXXX" value={form.gtmId} onChange={(e) => set("gtmId", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="metaPixelId">Meta Pixel ID</Label>
              <Input id="metaPixelId" value={form.metaPixelId} onChange={(e) => set("metaPixelId", e.target.value)} />
            </div>
            <hr className="border-border" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Email (Resend)</p>
            <p className="text-xs text-muted-foreground">
              Configured via environment variables, not this form — shown here for visibility only.
            </p>
            <div className="space-y-1.5">
              <Label>API Key</Label>
              <Input disabled value={emailConfig.apiKeyConfigured ? "•••••••••••• (configured)" : "Not configured"} />
            </div>
            <div className="space-y-1.5">
              <Label>Notification Email</Label>
              <Input disabled value={emailConfig.notifyEmail ?? "Not set"} />
            </div>
            <div className="space-y-1.5">
              <Label>Sending Domain</Label>
              <Input disabled value={emailConfig.fromEmail ?? "onboarding@resend.dev"} />
              {!emailConfig.domainVerified && (
                <p className="text-xs font-medium text-amber-600">
                  Unverified — replies can currently only reach your own Resend signup email. Verify the cdoe.info domain in Resend before go-live.
                </p>
              )}
            </div>
          </>
        )}

        {tab === "engagement" && (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Announcement Bar</p>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Show announcement bar</p>
                <p className="text-xs text-muted-foreground">A dismissible strip across the top of every page — e.g. admissions deadlines.</p>
              </div>
              <Switch checked={form.announcementEnabled} onCheckedChange={(v) => set("announcementEnabled", v)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="announcementText">Announcement Text</Label>
              <Input id="announcementText" placeholder="Admissions closing soon — apply by 30th August" value={form.announcementText} onChange={(e) => set("announcementText", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="announcementLink">Link (optional)</Label>
              <Input id="announcementLink" placeholder="/contact-us" value={form.announcementLink} onChange={(e) => set("announcementLink", e.target.value)} />
            </div>
            <hr className="border-border" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Cookie Consent</p>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Show cookie consent banner</p>
                <p className="text-xs text-muted-foreground">Appears once per visitor at the bottom of every page.</p>
              </div>
              <Switch checked={form.cookieConsentEnabled} onCheckedChange={(v) => set("cookieConsentEnabled", v)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cookieConsentText">Banner Text</Label>
              <Textarea
                id="cookieConsentText"
                rows={2}
                placeholder="We use cookies to improve your experience and understand site traffic..."
                value={form.cookieConsentText}
                onChange={(e) => set("cookieConsentText", e.target.value)}
              />
            </div>
          </>
        )}

        {tab === "advanced" && (
          <>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Shows a "we'll be back soon" page to visitors. Admins signed in can still browse the site normally.</p>
              </div>
              <Switch checked={form.maintenanceMode} onCheckedChange={(v) => set("maintenanceMode", v)} />
            </div>
          </>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          {saved && <span className="text-sm font-medium text-emerald-600">Saved.</span>}
        </div>
      </div>
    </div>
  );
}
