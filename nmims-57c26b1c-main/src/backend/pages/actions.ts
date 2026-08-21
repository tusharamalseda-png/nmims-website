import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { pages } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { logActivity } from "../activity/log";

export const listPagesFn = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(pages);
});

export const duplicatePageFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ sourceSlug: z.string(), newSlug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only") }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    const [source] = await db.select().from(pages).where(eq(pages.slug, data.sourceSlug)).limit(1);
    if (!source) throw new Error("Source page not found.");

    const [existing] = await db.select({ slug: pages.slug }).from(pages).where(eq(pages.slug, data.newSlug)).limit(1);
    if (existing) throw new Error("That slug is already in use.");

    const [row] = await db
      .insert(pages)
      .values({
        slug: data.newSlug,
        type: source.type,
        title: `${source.title} (Copy)`,
        content: source.content,
        metaTitle: source.metaTitle,
        metaDescription: source.metaDescription,
        canonicalUrl: null,
        ogImage: source.ogImage,
        status: "draft",
        updatedBy: session.data.userId,
      })
      .returning();

    logActivity({ userId: session.data.userId, action: "created", entity: "page", entityId: row.slug, details: { duplicatedFrom: data.sourceSlug } });
    return row;
  });

export const getPageFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const [page] = await db.select().from(pages).where(eq(pages.slug, data.slug)).limit(1);
    return page ?? null;
  });

const updatePageSchema = z.object({
  slug: z.string(),
  newSlug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only").optional(),
  title: z.string().min(1),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  canonicalUrl: z.string().nullable(),
  ogImage: z.string().nullable(),
  status: z.enum(["draft", "published"]),
  body: z.string().optional(), // legal pages only — stored in content.body
  // page-level SEO
  focusKeyword: z.string().nullable().optional(),
  ogTitle: z.string().nullable().optional(),
  ogDescription: z.string().nullable().optional(),
  twitterCardType: z.string().nullable().optional(),
  twitterTitle: z.string().nullable().optional(),
  twitterDescription: z.string().nullable().optional(),
  twitterImage: z.string().nullable().optional(),
  schemaType: z.string().nullable().optional(),
  breadcrumbLabel: z.string().nullable().optional(),
  robotsIndex: z.boolean().optional(),
  robotsFollow: z.boolean().optional(),
});

export const updatePageFn = createServerFn({ method: "POST" })
  .inputValidator(updatePageSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    if (data.newSlug && data.newSlug !== data.slug) {
      const [existing] = await db.select({ slug: pages.slug }).from(pages).where(eq(pages.slug, data.newSlug)).limit(1);
      if (existing) throw new Error("That slug is already in use.");
    }

    await db
      .update(pages)
      .set({
        ...(data.newSlug ? { slug: data.newSlug } : {}),
        title: data.title,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        canonicalUrl: data.canonicalUrl,
        ogImage: data.ogImage,
        status: data.status,
        ...(data.body !== undefined ? { content: { body: data.body } } : {}),
        ...(data.focusKeyword !== undefined ? { focusKeyword: data.focusKeyword } : {}),
        ...(data.ogTitle !== undefined ? { ogTitle: data.ogTitle } : {}),
        ...(data.ogDescription !== undefined ? { ogDescription: data.ogDescription } : {}),
        ...(data.twitterCardType !== undefined ? { twitterCardType: data.twitterCardType } : {}),
        ...(data.twitterTitle !== undefined ? { twitterTitle: data.twitterTitle } : {}),
        ...(data.twitterDescription !== undefined ? { twitterDescription: data.twitterDescription } : {}),
        ...(data.twitterImage !== undefined ? { twitterImage: data.twitterImage } : {}),
        ...(data.schemaType !== undefined ? { schemaType: data.schemaType } : {}),
        ...(data.breadcrumbLabel !== undefined ? { breadcrumbLabel: data.breadcrumbLabel } : {}),
        ...(data.robotsIndex !== undefined ? { robotsIndex: data.robotsIndex } : {}),
        ...(data.robotsFollow !== undefined ? { robotsFollow: data.robotsFollow } : {}),
        updatedAt: new Date(),
        updatedBy: session.data.userId,
      })
      .where(eq(pages.slug, data.slug));

    logActivity({ userId: session.data.userId, action: "updated", entity: "page", entityId: data.newSlug ?? data.slug, details: { title: data.title } });
    return { success: true, slug: data.newSlug ?? data.slug };
  });
