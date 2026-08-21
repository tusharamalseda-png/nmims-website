import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { teamMembers } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { logActivity } from "../activity/log";

// Public — read on the About page.
export const listTeamMembersFn = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder));
});

const teamMemberSchema = z.object({
  name: z.string().trim().min(1),
  designation: z.string().nullable(),
  photoUrl: z.string().nullable(),
  bio: z.string().nullable(),
  sortOrder: z.number().int(),
});

export const createTeamMemberFn = createServerFn({ method: "POST" })
  .inputValidator(teamMemberSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    const [row] = await db.insert(teamMembers).values(data).returning();
    logActivity({ userId: session.data.userId, action: "created", entity: "team_member", entityId: row.id, details: { name: data.name } });
    return row;
  });

export const updateTeamMemberFn = createServerFn({ method: "POST" })
  .inputValidator(teamMemberSchema.extend({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    const { id, ...rest } = data;
    await db.update(teamMembers).set(rest).where(eq(teamMembers.id, id));
    logActivity({ userId: session.data.userId, action: "updated", entity: "team_member", entityId: id, details: { name: data.name } });
    return { success: true };
  });

export const deleteTeamMemberFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");
    await db.delete(teamMembers).where(eq(teamMembers.id, data.id));
    logActivity({ userId: session.data.userId, action: "deleted", entity: "team_member", entityId: data.id });
    return { success: true };
  });
