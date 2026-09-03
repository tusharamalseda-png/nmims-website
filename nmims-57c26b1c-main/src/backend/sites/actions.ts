import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { sites } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { logActivity } from "../activity/log";

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only");

export const listSitesFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  return db.select().from(sites).orderBy(sites.createdAt);
});

export const getSiteFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    const [site] = await db.select().from(sites).where(eq(sites.id, data.id)).limit(1);
    return site ?? null;
  });

const createSiteSchema = z.object({
  name: z.string().trim().min(1),
  slug: slugSchema,
  primaryDomain: z.string().trim().min(1).nullable().optional(),
});

export const createSiteFn = createServerFn({ method: "POST" })
  .inputValidator(createSiteSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    const [existing] = await db
      .select({ id: sites.id })
      .from(sites)
      .where(eq(sites.slug, data.slug))
      .limit(1);
    if (existing) throw new Error("That slug is already in use.");

    const [row] = await db
      .insert(sites)
      .values({
        name: data.name,
        slug: data.slug,
        primaryDomain: data.primaryDomain || null,
        createdBy: session.data.userId,
      })
      .returning();

    logActivity({
      userId: session.data.userId,
      action: "created",
      entity: "site",
      entityId: row.id,
      details: { name: row.name, slug: row.slug },
    });
    return row;
  });

const updateSiteSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1).optional(),
  primaryDomain: z.string().trim().min(1).nullable().optional(),
  status: z.enum(["active", "archived"]).optional(),
});

export const updateSiteFn = createServerFn({ method: "POST" })
  .inputValidator(updateSiteSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    const [existing] = await db
      .select({ id: sites.id })
      .from(sites)
      .where(eq(sites.id, data.id))
      .limit(1);
    if (!existing) throw new Error("Site not found.");

    await db
      .update(sites)
      .set({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.primaryDomain !== undefined ? { primaryDomain: data.primaryDomain } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        updatedAt: new Date(),
      })
      .where(eq(sites.id, data.id));

    logActivity({
      userId: session.data.userId,
      action: "updated",
      entity: "site",
      entityId: data.id,
      details: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
    });
    return { success: true };
  });
