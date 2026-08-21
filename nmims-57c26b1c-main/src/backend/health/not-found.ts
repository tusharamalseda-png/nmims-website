import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { notFoundHits, redirects } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { logActivity } from "../activity/log";

// Public — fired once by the 404 page itself when a real visitor hits it.
export const logNotFoundHitFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ path: z.string().min(1), referrer: z.string().nullable() }))
  .handler(async ({ data }) => {
    const [existing] = await db.select().from(notFoundHits).where(eq(notFoundHits.path, data.path)).limit(1);
    if (existing) {
      await db
        .update(notFoundHits)
        .set({ hitCount: existing.hitCount + 1, lastSeenAt: new Date(), resolved: false })
        .where(eq(notFoundHits.id, existing.id));
    } else {
      await db.insert(notFoundHits).values({ path: data.path, referrer: data.referrer });
    }
    return { success: true };
  });

export const listNotFoundHitsFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  return db.select().from(notFoundHits).orderBy(desc(notFoundHits.hitCount));
});

export const dismissNotFoundHitFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.update(notFoundHits).set({ resolved: true }).where(eq(notFoundHits.id, data.id));
    return { success: true };
  });

export const deleteNotFoundHitFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.delete(notFoundHits).where(eq(notFoundHits.id, data.id));
    return { success: true };
  });

// Creates a real redirect from the 404'd path and marks the hit resolved —
// the "one-click turn it into a redirect" action.
export const convertNotFoundToRedirectFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string(), fromPath: z.string(), toPath: z.string().min(1) }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    const [existing] = await db.select({ id: redirects.id }).from(redirects).where(eq(redirects.fromPath, data.fromPath)).limit(1);
    if (existing) throw new Error("A redirect from this path already exists.");

    await db.insert(redirects).values({ fromPath: data.fromPath, toPath: data.toPath, statusCode: "301" });
    await db.update(notFoundHits).set({ resolved: true }).where(eq(notFoundHits.id, data.id));
    logActivity({ userId: session.data.userId, action: "created", entity: "redirect", details: { fromPath: data.fromPath, toPath: data.toPath, source: "404_monitor" } });
    return { success: true };
  });
