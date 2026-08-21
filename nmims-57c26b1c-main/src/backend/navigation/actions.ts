import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { navigationItems } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { logActivity } from "../activity/log";

// Public — read by the header/footer on every page.
export const listNavItemsFn = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(navigationItems).orderBy(asc(navigationItems.sortOrder));
});

const navItemSchema = z.object({
  label: z.string().trim().min(1),
  url: z.string().trim().min(1),
  parentId: z.string().nullable(),
  location: z.enum(["header", "footer"]),
  sortOrder: z.number().int(),
});

export const createNavItemFn = createServerFn({ method: "POST" })
  .inputValidator(navItemSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    const [row] = await db.insert(navigationItems).values(data).returning();
    logActivity({ userId: session.data.userId, action: "created", entity: "nav_item", entityId: row.id, details: { label: data.label } });
    return row;
  });

export const updateNavItemFn = createServerFn({ method: "POST" })
  .inputValidator(navItemSchema.extend({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    const { id, ...rest } = data;
    await db.update(navigationItems).set(rest).where(eq(navigationItems.id, id));
    logActivity({ userId: session.data.userId, action: "updated", entity: "nav_item", entityId: id, details: { label: data.label } });
    return { success: true };
  });

export const deleteNavItemFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.delete(navigationItems).where(eq(navigationItems.id, data.id));
    logActivity({ userId: session.data.userId, action: "deleted", entity: "nav_item", entityId: data.id });
    return { success: true };
  });
