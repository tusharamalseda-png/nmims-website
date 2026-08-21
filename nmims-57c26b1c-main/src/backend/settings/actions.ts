import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { siteSettings } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { logActivity } from "../activity/log";

// Public — read by every page (footer, header, root <head>).
export const getSiteSettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  return row ?? null;
});

// Admin-only — reports what's configured via environment variables. Never
// returns the actual Resend API key, only whether one is set.
export const getEmailConfigFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  return {
    notifyEmail: process.env.NOTIFY_EMAIL ?? null,
    fromEmail: process.env.RESEND_FROM_EMAIL ?? null,
    apiKeyConfigured: !!process.env.RESEND_API_KEY,
    domainVerified: (process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev") !== "onboarding@resend.dev",
  };
});

const updateSettingsSchema = z.object({
  siteTitle: z.string().nullable(),
  siteTagline: z.string().nullable(),
  logoUrl: z.string().nullable(),
  faviconUrl: z.string().nullable(),
  contactPhone: z.string().nullable(),
  contactEmail: z.string().nullable(),
  contactAddress: z.string().nullable(),
  socialLinks: z.record(z.string(), z.string()),
  disclaimerText: z.string().nullable(),
  robotsTxt: z.string().nullable(),
  googleSiteVerification: z.string().nullable(),
  bingSiteVerification: z.string().nullable(),
  sitemapEnabled: z.boolean(),
  analyticsIds: z.record(z.string(), z.string()),
  maintenanceMode: z.boolean(),
  cookieConsentEnabled: z.boolean(),
  cookieConsentText: z.string().nullable(),
  announcementEnabled: z.boolean(),
  announcementText: z.string().nullable(),
  announcementLink: z.string().nullable(),
});

export const updateSiteSettingsFn = createServerFn({ method: "POST" })
  .inputValidator(updateSettingsSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    await db
      .insert(siteSettings)
      .values({ id: 1, ...data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { ...data, updatedAt: new Date() },
      });

    logActivity({ userId: session.data.userId, action: "updated", entity: "site_settings" });
    return { success: true };
  });
