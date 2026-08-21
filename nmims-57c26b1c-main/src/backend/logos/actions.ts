import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { logos } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { logActivity } from "../activity/log";

// Public — read by a page. Empty pageSlugs = show everywhere.
export const listLogosFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ pageSlug: z.string() }))
  .handler(async ({ data }) => {
    const rows = await db.select().from(logos).orderBy(asc(logos.sortOrder));
    return rows.filter((l) => l.pageSlugs.length === 0 || l.pageSlugs.includes(data.pageSlug));
  });

export const listAllLogosFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  return db.select().from(logos).orderBy(asc(logos.sortOrder));
});

const logoSchema = z.object({
  name: z.string().trim().min(1),
  logoUrl: z.string().trim().min(1),
  category: z.enum(["bank", "accreditation"]),
  pageSlugs: z.array(z.string()),
  sortOrder: z.number().int(),
});

export const createLogoFn = createServerFn({ method: "POST" })
  .inputValidator(logoSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    const [row] = await db.insert(logos).values(data).returning();
    logActivity({ userId: session.data.userId, action: "created", entity: "logo", entityId: row.id, details: { name: data.name } });
    return row;
  });

export const updateLogoFn = createServerFn({ method: "POST" })
  .inputValidator(logoSchema.extend({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    const { id, ...rest } = data;
    await db.update(logos).set(rest).where(eq(logos.id, id));
    logActivity({ userId: session.data.userId, action: "updated", entity: "logo", entityId: id, details: { name: data.name } });
    return { success: true };
  });

export const deleteLogoFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.delete(logos).where(eq(logos.id, data.id));
    logActivity({ userId: session.data.userId, action: "deleted", entity: "logo", entityId: data.id });
    return { success: true };
  });
