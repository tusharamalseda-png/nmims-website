import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { redirects } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { logActivity } from "../activity/log";

// Public — checked on every navigation by the root route, so this is
// cached in-memory (per server instance) instead of hitting Postgres
// on every single page view. Redirect rules change rarely.
let cache: { map: Map<string, typeof redirects.$inferSelect>; expiresAt: number } | null = null;
const CACHE_TTL_MS = 60_000;

async function getRedirectsMap() {
  if (cache && cache.expiresAt > Date.now()) return cache.map;
  const rows = await db.select().from(redirects);
  const map = new Map(rows.map((r) => [r.fromPath, r]));
  cache = { map, expiresAt: Date.now() + CACHE_TTL_MS };
  return map;
}

export const getRedirectFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ path: z.string() }))
  .handler(async ({ data }) => {
    const map = await getRedirectsMap();
    return map.get(data.path) ?? null;
  });

export const listRedirectsFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  return db.select().from(redirects).orderBy(desc(redirects.createdAt));
});

const redirectSchema = z.object({
  fromPath: z.string().trim().min(1).regex(/^\//, "Must start with /"),
  toPath: z.string().trim().min(1),
  statusCode: z.enum(["301", "302"]),
});

export const createRedirectFn = createServerFn({ method: "POST" })
  .inputValidator(redirectSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    const [row] = await db.insert(redirects).values(data).returning();
    cache = null;
    logActivity({ userId: session.data.userId, action: "created", entity: "redirect", entityId: row.id, details: { fromPath: data.fromPath, toPath: data.toPath } });
    return row;
  });

export const deleteRedirectFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.delete(redirects).where(eq(redirects.id, data.id));
    cache = null;
    logActivity({ userId: session.data.userId, action: "deleted", entity: "redirect", entityId: data.id });
    return { success: true };
  });
