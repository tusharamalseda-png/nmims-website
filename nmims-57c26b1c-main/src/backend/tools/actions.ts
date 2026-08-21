import { createServerFn } from "@tanstack/react-start";
import { desc, eq, or, ilike } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import {
  pages, blogPosts, faqs, testimonials, teamMembers, logos, navigationItems, redirects, siteSettings,
  backups, dataRequests, inquiries,
} from "../db/schema";
import { getAdminSession } from "../auth/session";
import { logActivity } from "../activity/log";

const SNAPSHOT_TABLES = { pages, blogPosts, faqs, testimonials, teamMembers, logos, navigationItems, redirects, siteSettings } as const;
type SnapshotKey = keyof typeof SNAPSHOT_TABLES;

// Destructive/PII-touching tools (site-wide restore, GDPR erase) are
// restricted to the "admin" role — an "editor" account can still export a
// backup or read-only site content, but can't wipe or restore live data.
async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  if (session.data.role !== "admin") throw new Error("This action requires an administrator account.");
  return { userId: session.data.userId };
}

async function buildSnapshot() {
  const entries = await Promise.all(
    (Object.keys(SNAPSHOT_TABLES) as SnapshotKey[]).map(async (key) => [key, await db.select().from(SNAPSHOT_TABLES[key])] as const),
  );
  // Round-trip through JSON so Date objects become ISO strings, matching the jsonb column's JsonValue type.
  return JSON.parse(JSON.stringify(Object.fromEntries(entries)));
}

// ---------- Export / Import ----------

export const exportSiteDataFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  return { exportedAt: new Date().toISOString(), data: await buildSnapshot() };
});

const importSchema = z.object({
  data: z.record(z.string(), z.array(z.record(z.string(), z.unknown()))),
});

export const importSiteDataFn = createServerFn({ method: "POST" })
  .inputValidator(importSchema)
  .handler(async ({ data }) => {
    const { userId } = await requireAdmin();

    const summary: Record<string, number> = {};

    // Pages & blog posts: upsert by slug (safe to re-run, never deletes anything).
    if (Array.isArray(data.data.pages)) {
      let count = 0;
      for (const row of data.data.pages as Record<string, unknown>[]) {
        if (typeof row.slug !== "string") continue;
        const [existing] = await db.select({ id: pages.id }).from(pages).where(eq(pages.slug, row.slug)).limit(1);
        if (!existing) {
          await db.insert(pages).values(row as typeof pages.$inferInsert);
          count++;
        }
      }
      summary.pages = count;
    }
    if (Array.isArray(data.data.blogPosts)) {
      let count = 0;
      for (const row of data.data.blogPosts as Record<string, unknown>[]) {
        if (typeof row.slug !== "string") continue;
        const [existing] = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, row.slug)).limit(1);
        if (!existing) {
          await db.insert(blogPosts).values(row as typeof blogPosts.$inferInsert);
          count++;
        }
      }
      summary.blogPosts = count;
    }

    // Everything else: insert only rows whose id isn't already present, so importing the same file twice never duplicates.
    const listTables = { faqs, testimonials, teamMembers, logos, navigationItems, redirects } as const;
    for (const key of Object.keys(listTables) as (keyof typeof listTables)[]) {
      const rows = data.data[key];
      if (!Array.isArray(rows)) continue;
      const table = listTables[key];
      let count = 0;
      for (const row of rows as Record<string, unknown>[]) {
        if (typeof row.id !== "string") continue;
        const [existing] = await db.select({ id: table.id }).from(table).where(eq(table.id, row.id)).limit(1);
        if (!existing) {
          await db.insert(table).values(row as never);
          count++;
        }
      }
      summary[key] = count;
    }

    logActivity({ userId, action: "created", entity: "site_data", details: { source: "import", summary: summary as Record<string, number> } });
    return { success: true, summary };
  });

// ---------- Backups ----------

export const listBackupsFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  return db.select({ id: backups.id, label: backups.label, createdAt: backups.createdAt }).from(backups).orderBy(desc(backups.createdAt));
});

export const createBackupFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ label: z.string().trim().min(1) }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    const snapshot = await buildSnapshot();
    const [row] = await db.insert(backups).values({ label: data.label, snapshot, createdBy: session.data.userId }).returning({ id: backups.id, label: backups.label, createdAt: backups.createdAt });

    logActivity({ userId: session.data.userId, action: "created", entity: "backup", entityId: row.id, details: { label: data.label } });
    return row;
  });

export const restoreBackupFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { userId } = await requireAdmin();

    const [backup] = await db.select().from(backups).where(eq(backups.id, data.id)).limit(1);
    if (!backup) throw new Error("Backup not found.");
    const snapshot = backup.snapshot as Record<SnapshotKey, Record<string, unknown>[]>;

    await db.transaction(async (tx) => {
      for (const key of Object.keys(SNAPSHOT_TABLES) as SnapshotKey[]) {
        const rows = snapshot[key];
        if (!Array.isArray(rows)) continue;
        const table = SNAPSHOT_TABLES[key];
        await tx.delete(table);
        if (rows.length > 0) await tx.insert(table).values(rows as never[]);
      }
    });

    logActivity({ userId, action: "updated", entity: "site_data", details: { source: "restore", backupId: data.id, label: backup.label } });
    return { success: true };
  });

export const deleteBackupFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    await db.delete(backups).where(eq(backups.id, data.id));
    return { success: true };
  });

// ---------- GDPR data requests ----------

export const searchPersonDataFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ identifier: z.string().trim().min(2) }))
  .handler(async ({ data }) => {
    await requireAdmin();

    const term = `%${data.identifier}%`;
    const leads = await db
      .select()
      .from(inquiries)
      .where(or(ilike(inquiries.email, term), ilike(inquiries.phone, term), ilike(inquiries.name, term)));
    const matchingTestimonials = await db.select().from(testimonials).where(ilike(testimonials.name, term));

    return { leads, testimonials: matchingTestimonials };
  });

export const fulfillDataRequestFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    requestType: z.enum(["export", "erase"]),
    identifier: z.string().trim().min(2),
    notes: z.string().nullable(),
    eraseLeadIds: z.array(z.string()).default([]),
    eraseTestimonialIds: z.array(z.string()).default([]),
  }))
  .handler(async ({ data }) => {
    const { userId } = await requireAdmin();

    if (data.requestType === "erase") {
      for (const id of data.eraseLeadIds) {
        await db.update(inquiries).set({ name: "[erased]", email: null, phone: null, message: null }).where(eq(inquiries.id, id));
      }
      for (const id of data.eraseTestimonialIds) {
        await db.update(testimonials).set({ name: "[erased]", quote: null, designation: null, company: null }).where(eq(testimonials.id, id));
      }
    }

    const [row] = await db
      .insert(dataRequests)
      .values({ requestType: data.requestType, identifier: data.identifier, fulfilledBy: userId, notes: data.notes })
      .returning();

    logActivity({ userId, action: data.requestType === "erase" ? "deleted" : "updated", entity: "personal_data", details: { identifier: data.identifier, requestType: data.requestType } });
    return row;
  });

export const listDataRequestsFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return db.select().from(dataRequests).orderBy(desc(dataRequests.createdAt));
});
