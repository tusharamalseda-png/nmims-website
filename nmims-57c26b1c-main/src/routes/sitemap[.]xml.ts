import { createFileRoute } from "@tanstack/react-router";

// Old flat sitemap URL — kept as a redirect to the new Yoast-style index so
// any bookmarked/indexed links to /sitemap.xml keep working.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 301,
          headers: { Location: "/sitemap_index.xml" },
        }),
    },
  },
});
