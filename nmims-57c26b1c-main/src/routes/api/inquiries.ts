import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { db } from "@/backend/db/client";
import { inquiries } from "@/backend/db/schema";
import { sendNewLeadNotification } from "@/backend/email/client";

const schema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  program: z.string().trim().optional(),
  state: z.string().trim().optional(),
  message: z.string().trim().optional(),
  sourcePage: z.string().optional(),
  utmSource: z.string().optional(),
  utmCampaign: z.string().optional(),
});

const CORS_HEADERS = { "Access-Control-Allow-Origin": "*" };

export const Route = createFileRoute("/api/inquiries")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body." }, { status: 400, headers: CORS_HEADERS });
        }

        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400, headers: CORS_HEADERS });
        }

        const data = parsed.data;
        await db.insert(inquiries).values({
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          program: data.program || null,
          state: data.state || null,
          message: data.message || null,
          sourcePage: data.sourcePage || null,
          utmSource: data.utmSource || null,
          utmCampaign: data.utmCampaign || null,
        });

        sendNewLeadNotification(data).catch((err) => console.error("Lead notification email failed:", err));

        return Response.json({ success: true }, { headers: CORS_HEADERS });
      },
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: { ...CORS_HEADERS, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" },
        }),
    },
  },
});
