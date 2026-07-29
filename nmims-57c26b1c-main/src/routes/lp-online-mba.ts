import { createFileRoute } from "@tanstack/react-router";
import html from "../pages/lp-online-mba.html?raw";

export const Route = createFileRoute("/lp-online-mba")({
  server: {
    handlers: {
      GET: async () =>
        new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
