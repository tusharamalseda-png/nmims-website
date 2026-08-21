import { createFileRoute } from "@tanstack/react-router";
import { desc } from "drizzle-orm";
import { db } from "@/backend/db/client";
import { inquiries } from "@/backend/db/schema";
import { getAdminSession } from "@/backend/auth/session";

function csvEscape(value: string) {
  // Leads come from the public, unauthenticated enquiry form — a value like
  // `=cmd|'/C calc'!A1` could execute as a formula the moment this file is
  // opened in Excel/Sheets. Prefixing with ' forces spreadsheet apps to
  // treat it as plain text instead of a formula.
  let v = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  if (/[",\n]/.test(v)) v = `"${v.replace(/"/g, '""')}"`;
  return v;
}

export const Route = createFileRoute("/api/leads-export.csv")({
  server: {
    handlers: {
      GET: async () => {
        const session = await getAdminSession();
        if (!session.data.userId) return new Response("Not authenticated.", { status: 401 });

        const rows = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));

        const header = ["Name", "Email", "Phone", "Program", "State", "Status", "Source Page", "UTM Source", "UTM Campaign", "Received"];
        const lines = [header.join(",")];
        for (const r of rows) {
          lines.push(
            [
              r.name, r.email ?? "", r.phone ?? "", r.program ?? "", r.state ?? "",
              r.status, r.sourcePage ?? "", r.utmSource ?? "", r.utmCampaign ?? "",
              new Date(r.createdAt).toISOString(),
            ]
              .map((v) => csvEscape(String(v)))
              .join(","),
          );
        }

        return new Response(lines.join("\n"), {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
          },
        });
      },
    },
  },
});
