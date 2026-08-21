import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { blogPosts } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { logActivity } from "../activity/log";

export const listBlogPostsFn = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
});

export const getBlogPostFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, data.slug)).limit(1);
    return post ?? null;
  });

const postSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().nullable(),
  content: z.string(),
  featuredImage: z.string().nullable(),
  category: z.string().nullable(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  status: z.enum(["draft", "published"]),
  scheduledFor: z.string().nullable(), // ISO datetime — if set and in the future, stays hidden from the public until then
  // page-level SEO
  canonicalUrl: z.string().nullable().optional(),
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

export const createBlogPostFn = createServerFn({ method: "POST" })
  .inputValidator(postSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    await db.insert(blogPosts).values({
      ...data,
      scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
      publishedAt: data.status === "published" ? new Date() : null,
    });
    logActivity({ userId: session.data.userId, action: "created", entity: "blog_post", entityId: data.slug, details: { title: data.title } });
    return { success: true };
  });

export const updateBlogPostFn = createServerFn({ method: "POST" })
  .inputValidator(postSchema.extend({ originalSlug: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    const [existing] = await db.select().from(blogPosts).where(eq(blogPosts.slug, data.originalSlug)).limit(1);

    await db
      .update(blogPosts)
      .set({
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        category: data.category,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        status: data.status,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
        publishedAt: data.status === "published" ? (existing?.publishedAt ?? new Date()) : existing?.publishedAt,
        updatedAt: new Date(),
        ...(data.canonicalUrl !== undefined ? { canonicalUrl: data.canonicalUrl } : {}),
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
      })
      .where(eq(blogPosts.slug, data.originalSlug));

    logActivity({ userId: session.data.userId, action: "updated", entity: "blog_post", entityId: data.slug, details: { title: data.title } });
    return { success: true };
  });

export const deleteBlogPostFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.delete(blogPosts).where(eq(blogPosts.slug, data.slug));
    logActivity({ userId: session.data.userId, action: "deleted", entity: "blog_post", entityId: data.slug });
    return { success: true };
  });
