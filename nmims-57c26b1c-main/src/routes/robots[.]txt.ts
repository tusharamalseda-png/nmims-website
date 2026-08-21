import { createFileRoute } from "@tanstack/react-router";
import { getSiteSettingsFn } from "@/backend/settings/actions";

const DEFAULT_ROBOTS = "User-agent: *\nAllow: /\n\nSitemap: https://cdoe.info/sitemap.xml";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const settings = await getSiteSettingsFn();
        const body = settings?.robotsTxt || DEFAULT_ROBOTS;
        return new Response(body, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      },
    },
  },
});
