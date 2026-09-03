import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { sites } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { userHasSiteAccess } from "../memberships/actions";

// The browser may request any site ID — this is the only place that request
// is trusted. Every check below is re-run server-side against current DB
// state, never against whatever the client claims.
export const setActiveSiteFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ siteId: z.string().uuid("Invalid site ID.") }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    const [site] = await db.select().from(sites).where(eq(sites.id, data.siteId)).limit(1);
    if (!site) {
      setResponseStatus(404);
      throw new Error("Site not found.");
    }

    const allowed = await userHasSiteAccess(session.data.userId, site.id);
    if (!allowed) {
      setResponseStatus(403);
      throw new Error("You do not have access to this site.");
    }

    await session.update({ activeSiteId: site.id });
    return site;
  });

// Re-verifies membership on every read (not just at switch time) — a
// membership revoked after activeSiteId was set must take effect immediately.
export const getActiveSiteFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  if (!session.data.activeSiteId) return null;

  const [site] = await db
    .select()
    .from(sites)
    .where(eq(sites.id, session.data.activeSiteId))
    .limit(1);
  if (!site || !(await userHasSiteAccess(session.data.userId, site.id))) {
    await session.update({ activeSiteId: undefined });
    return null;
  }

  return site;
});

// Reusable server-side guard for future site-scoped features (Phase 4+):
// call this instead of trusting session.data.activeSiteId directly.
export async function requireActiveSite() {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  if (!session.data.activeSiteId) throw new Error("No active site selected.");

  const [site] = await db
    .select()
    .from(sites)
    .where(eq(sites.id, session.data.activeSiteId))
    .limit(1);
  if (!site) throw new Error("Active site not found.");

  const allowed = await userHasSiteAccess(session.data.userId, site.id);
  if (!allowed) {
    setResponseStatus(403);
    throw new Error("You do not have access to the active site.");
  }

  return site;
}
