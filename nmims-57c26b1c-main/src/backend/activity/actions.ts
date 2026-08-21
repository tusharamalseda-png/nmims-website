import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { activityLog, adminUsers } from "../db/schema";
import { getAdminSession } from "../auth/session";

export const listActivityFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");

  return db
    .select({
      id: activityLog.id,
      action: activityLog.action,
      entity: activityLog.entity,
      entityId: activityLog.entityId,
      details: activityLog.details,
      createdAt: activityLog.createdAt,
      userEmail: adminUsers.email,
    })
    .from(activityLog)
    .leftJoin(adminUsers, eq(activityLog.userId, adminUsers.id))
    .orderBy(desc(activityLog.createdAt))
    .limit(200);
});
