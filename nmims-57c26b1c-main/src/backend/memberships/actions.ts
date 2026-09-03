import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { siteMemberships } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { logActivity } from "../activity/log";

// Plain async helper (not a server fn) — the backend-verified access check
// that Step 2.3's activeSiteId context will call directly.
export async function userHasSiteAccess(userId: string, siteId: string) {
  const [row] = await db
    .select({ id: siteMemberships.id })
    .from(siteMemberships)
    .where(
      and(
        eq(siteMemberships.userId, userId),
        eq(siteMemberships.siteId, siteId),
        eq(siteMemberships.status, "active"),
      ),
    )
    .limit(1);
  return !!row;
}

export const listMembershipsForSiteFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ siteId: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    return db.select().from(siteMemberships).where(eq(siteMemberships.siteId, data.siteId));
  });

export const listMySiteMembershipsFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  return db.select().from(siteMemberships).where(eq(siteMemberships.userId, session.data.userId));
});

const addMembershipSchema = z.object({
  siteId: z.string(),
  userId: z.string(),
  role: z.enum(["admin", "editor"]).optional(),
});

export const addMembershipFn = createServerFn({ method: "POST" })
  .inputValidator(addMembershipSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    const [existing] = await db
      .select({ id: siteMemberships.id })
      .from(siteMemberships)
      .where(and(eq(siteMemberships.siteId, data.siteId), eq(siteMemberships.userId, data.userId)))
      .limit(1);
    if (existing) throw new Error("This user already has access to that site.");

    const [row] = await db
      .insert(siteMemberships)
      .values({ siteId: data.siteId, userId: data.userId, role: data.role ?? "editor" })
      .returning();

    logActivity({
      userId: session.data.userId,
      action: "created",
      entity: "site_membership",
      entityId: row.id,
      details: { siteId: data.siteId, userId: data.userId },
    });
    return row;
  });

const updateMembershipSchema = z.object({
  id: z.string(),
  role: z.enum(["admin", "editor"]).optional(),
  status: z.enum(["active", "revoked"]).optional(),
});

export const updateMembershipFn = createServerFn({ method: "POST" })
  .inputValidator(updateMembershipSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    await db
      .update(siteMemberships)
      .set({
        ...(data.role !== undefined ? { role: data.role } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      })
      .where(eq(siteMemberships.id, data.id));

    logActivity({
      userId: session.data.userId,
      action: "updated",
      entity: "site_membership",
      entityId: data.id,
      details: {
        ...(data.role !== undefined ? { role: data.role } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
    });
    return { success: true };
  });

export const removeMembershipFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    await db.delete(siteMemberships).where(eq(siteMemberships.id, data.id));

    logActivity({
      userId: session.data.userId,
      action: "deleted",
      entity: "site_membership",
      entityId: data.id,
    });
    return { success: true };
  });
