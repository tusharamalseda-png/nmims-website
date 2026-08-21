import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { faqs } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { logActivity } from "../activity/log";

export const listAllFaqsFn = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(faqs).orderBy(asc(faqs.pageSlug), asc(faqs.sortOrder));
});

export const listFaqsForPageFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ pageSlug: z.string() }))
  .handler(async ({ data }) => {
    return db.select().from(faqs).where(eq(faqs.pageSlug, data.pageSlug)).orderBy(asc(faqs.sortOrder));
  });

const faqSchema = z.object({
  pageSlug: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

export const createFaqFn = createServerFn({ method: "POST" })
  .inputValidator(faqSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.insert(faqs).values(data);
    logActivity({ userId: session.data.userId, action: "created", entity: "faq", details: { pageSlug: data.pageSlug, question: data.question } });
    return { success: true };
  });

export const updateFaqFn = createServerFn({ method: "POST" })
  .inputValidator(faqSchema.extend({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db
      .update(faqs)
      .set({
        pageSlug: data.pageSlug,
        question: data.question,
        answer: data.answer,
        sortOrder: data.sortOrder,
      })
      .where(eq(faqs.id, data.id));
    logActivity({ userId: session.data.userId, action: "updated", entity: "faq", entityId: data.id, details: { question: data.question } });
    return { success: true };
  });

export const deleteFaqFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.delete(faqs).where(eq(faqs.id, data.id));
    logActivity({ userId: session.data.userId, action: "deleted", entity: "faq", entityId: data.id });
    return { success: true };
  });
