import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/backend/db/client";
import { media } from "@/backend/db/schema";
import { supabaseAdmin } from "@/backend/supabase/admin-client";

export const Route = createFileRoute("/media/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const [row] = await db.select().from(media).where(eq(media.slug, params.slug)).limit(1);
        if (!row) return new Response("Not found", { status: 404 });

        const { data, error } = await supabaseAdmin.storage.from("media").download(row.storagePath);
        if (error || !data) return new Response("Not found", { status: 404 });

        return new Response(await data.arrayBuffer(), {
          headers: {
            "Content-Type": row.mimeType,
            // Stops the browser from ever re-interpreting this response as
            // something other than what Content-Type says (MIME sniffing),
            // and forces a filename so it can't be navigated to as a page.
            "X-Content-Type-Options": "nosniff",
            "Content-Disposition": `inline; filename="${encodeURIComponent(row.fileName ?? row.slug)}"`,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
