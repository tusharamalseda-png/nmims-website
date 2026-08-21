import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { inquiries } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { sendNewLeadNotification, sendLeadReply } from "../email/client";
import { logActivity } from "../activity/log";

const createInquirySchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().optional(),
  program: z.string().trim().optional(),
  state: z.string().trim().optional(),
  message: z.string().trim().optional(),
  sourcePage: z.string().optional(),
  utmSource: z.string().optional(),
  utmCampaign: z.string().optional(),
});

// Public — called from the live enquiry form, no admin session required.
export const createInquiryFn = createServerFn({ method: "POST" })
  .inputValidator(createInquirySchema)
  .handler(async ({ data }) => {
    await db.insert(inquiries).values({
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      program: data.program || null,
      state: data.state || null,
      message: data.message || null,
      sourcePage: data.sourcePage || null,
      utmSource: data.utmSource || null,
      utmCampaign: data.utmCampaign || null,
    });
    sendNewLeadNotification(data).catch((err) => console.error("Lead notification email failed:", err));
    return { success: true };
  });

export const listInquiriesFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
});

export const updateInquiryStatusFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string(), status: z.enum(["new", "contacted", "enrolled", "lost"]) }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.update(inquiries).set({ status: data.status }).where(eq(inquiries.id, data.id));
    logActivity({ userId: session.data.userId, action: "updated", entity: "inquiry", entityId: data.id, details: { status: data.status } });
    return { success: true };
  });

export const assignInquiryFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string(), assignedTo: z.string().nullable() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.update(inquiries).set({ assignedTo: data.assignedTo }).where(eq(inquiries.id, data.id));
    logActivity({ userId: session.data.userId, action: "updated", entity: "inquiry", entityId: data.id, details: { assignedTo: data.assignedTo } });
    return { success: true };
  });

export const deleteInquiryFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.delete(inquiries).where(eq(inquiries.id, data.id));
    logActivity({ userId: session.data.userId, action: "deleted", entity: "inquiry", entityId: data.id });
    return { success: true };
  });

export const replyToLeadFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string(), subject: z.string().min(1), message: z.string().min(1) }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    const [lead] = await db.select().from(inquiries).where(eq(inquiries.id, data.id)).limit(1);
    if (!lead?.email) throw new Error("This lead has no email address on file.");

    await sendLeadReply(lead.email, data.subject, data.message);
    return { success: true };
  });
