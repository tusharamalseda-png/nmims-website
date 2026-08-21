import { createFileRoute } from "@tanstack/react-router";
import html from "../pages/lp-online-mba.html?raw";
import { getPageFn } from "@/backend/pages/actions";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export const Route = createFileRoute("/lp-online-mba")({
  server: {
    handlers: {
      GET: async () => {
        const page = await getPageFn({ data: { slug: "lp-online-mba" } });
        let output = html;

        if (page?.metaTitle) {
          output = output.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(page.metaTitle)}</title>`);
        }
        if (page?.metaDescription) {
          const metaTag = `<meta name="description" content="${escapeHtml(page.metaDescription)}">`;
          output = /<meta name="description"/.test(output)
            ? output.replace(/<meta name="description"[^>]*>/, metaTag)
            : output.replace(/<title>.*?<\/title>/, (match) => `${match}\n${metaTag}`);
        }

        return new Response(output, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
