import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { testimonials } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { logActivity } from "../activity/log";

// Public — read by a page. Returns testimonials tagged for this page plus
// any global ones (empty pageSlugs = show everywhere), visible only.
export const listTestimonialsFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ pageSlug: z.string() }))
  .handler(async ({ data }) => {
    const rows = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isVisible, true))
      .orderBy(asc(testimonials.sortOrder));
    return rows.filter((t) => t.pageSlugs.length === 0 || t.pageSlugs.includes(data.pageSlug));
  });

// Public — a visitor submitting their own testimonial. Always goes in
// hidden until an admin approves it via the visibility toggle.
const submissionSchema = z.object({
  name: z.string().trim().min(1),
  designation: z.string().trim().optional(),
  quote: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5),
});

export const submitTestimonialFn = createServerFn({ method: "POST" })
  .inputValidator(submissionSchema)
  .handler(async ({ data }) => {
    await db.insert(testimonials).values({
      name: data.name,
      designation: data.designation || null,
      company: null,
      quote: data.quote,
      rating: data.rating,
      imageUrl: null,
      videoUrl: null,
      source: "Website Submission",
      isVideo: false,
      isVisible: false,
      sortOrder: 0,
      pageSlugs: [],
    });
    return { success: true };
  });

export const listAllTestimonialsFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  return db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
});

const testimonialSchema = z.object({
  name: z.string().trim().min(1),
  designation: z.string().nullable(),
  company: z.string().nullable(),
  quote: z.string().nullable(),
  rating: z.number().int().min(1).max(5),
  imageUrl: z.string().nullable(),
  videoUrl: z.string().nullable(),
  source: z.string().nullable(),
  isVideo: z.boolean(),
  isVisible: z.boolean(),
  sortOrder: z.number().int(),
  pageSlugs: z.array(z.string()),
});

export const createTestimonialFn = createServerFn({ method: "POST" })
  .inputValidator(testimonialSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    const [row] = await db.insert(testimonials).values(data).returning();
    logActivity({ userId: session.data.userId, action: "created", entity: "testimonial", entityId: row.id, details: { name: data.name } });
    return row;
  });

export const updateTestimonialFn = createServerFn({ method: "POST" })
  .inputValidator(testimonialSchema.extend({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    const { id, ...rest } = data;
    await db.update(testimonials).set(rest).where(eq(testimonials.id, id));
    logActivity({ userId: session.data.userId, action: "updated", entity: "testimonial", entityId: id, details: { name: data.name } });
    return { success: true };
  });

export const deleteTestimonialFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.delete(testimonials).where(eq(testimonials.id, data.id));
    logActivity({ userId: session.data.userId, action: "deleted", entity: "testimonial", entityId: data.id });
    return { success: true };
  });

export const toggleTestimonialVisibilityFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string(), isVisible: z.boolean() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.update(testimonials).set({ isVisible: data.isVisible }).where(eq(testimonials.id, data.id));
    return { success: true };
  });
