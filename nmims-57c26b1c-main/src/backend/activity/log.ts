import { db } from "../db/client";
import { activityLog, type JsonValue } from "../db/schema";

export async function logActivity(entry: {
  userId: string | null;
  action: "created" | "updated" | "deleted" | "published";
  entity: string;
  entityId?: string | null;
  details?: Record<string, JsonValue>;
}) {
  try {
    await db.insert(activityLog).values({
      userId: entry.userId,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId ?? null,
      details: entry.details ?? null,
    });
  } catch (err) {
    console.error("Failed to write activity log:", err);
  }
}
