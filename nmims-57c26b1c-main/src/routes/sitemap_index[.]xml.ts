import { createFileRoute } from "@tanstack/react-router";

// The canonical sitemap address is /sitemap.xml — this redirects there so
// the brief window this route was live doesn't leave a dead link behind.
export const Route = createFileRoute("/sitemap_index.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 301,
          headers: { Location: "/sitemap.xml" },
        }),
    },
  },
});
