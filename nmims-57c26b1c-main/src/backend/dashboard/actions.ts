import { createServerFn } from "@tanstack/react-start";
import { desc, eq, gte, sql } from "drizzle-orm";
import { db } from "../db/client";
import { inquiries, activityLog, adminUsers, pages, blogPosts, testimonials } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { getMissingSeoFn, checkBrokenLinksFn } from "../health/actions";

export const getDashboardStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [leadsThisWeek] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(gte(inquiries.createdAt, weekAgo));

  const [newLeads] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(inquiries)
    .where(eq(inquiries.status, "new"));

  const [totalLeads] = await db.select({ count: sql<number>`count(*)::int` }).from(inquiries);
  const [totalPages] = await db.select({ count: sql<number>`count(*)::int` }).from(pages);
  const [draftPages] = await db.select({ count: sql<number>`count(*)::int` }).from(pages).where(eq(pages.status, "draft"));
  const [totalPosts] = await db.select({ count: sql<number>`count(*)::int` }).from(blogPosts);
  const [draftPosts] = await db.select({ count: sql<number>`count(*)::int` }).from(blogPosts).where(eq(blogPosts.status, "draft"));
  const [pendingTestimonials] = await db.select({ count: sql<number>`count(*)::int` }).from(testimonials).where(eq(testimonials.isVisible, false));

  const [missingSeo, brokenLinks] = await Promise.all([getMissingSeoFn(), checkBrokenLinksFn()]);

  const recentActivity = await db
    .select({
      id: activityLog.id,
      action: activityLog.action,
      entity: activityLog.entity,
      entityId: activityLog.entityId,
      createdAt: activityLog.createdAt,
      userEmail: adminUsers.email,
    })
    .from(activityLog)
    .leftJoin(adminUsers, eq(activityLog.userId, adminUsers.id))
    .orderBy(desc(activityLog.createdAt))
    .limit(8);

  const recentLeads = await db
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt))
    .limit(5);

  return {
    leadsThisWeek: leadsThisWeek.count,
    newLeads: newLeads.count,
    totalLeads: totalLeads.count,
    totalPages: totalPages.count,
    draftPages: draftPages.count,
    totalPosts: totalPosts.count,
    draftPosts: draftPosts.count,
    pendingTestimonials: pendingTestimonials.count,
    seoIssues: missingSeo.length,
    brokenLinks: brokenLinks.length,
    recentActivity,
    recentLeads,
  };
});
