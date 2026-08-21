import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";
import { listActivityFn } from "@/backend/activity/actions";
import { formatDateTime } from "@/lib/format-date";

export const Route = createFileRoute("/admin/_authed/activity")({
  loader: async () => listActivityFn(),
  component: ActivityLog,
});

const ACTION_STYLE: Record<string, string> = {
  created: "bg-emerald-100 text-emerald-700",
  updated: "bg-amber-100 text-amber-700",
  deleted: "bg-red-100 text-red-700",
  published: "bg-blue-100 text-blue-700",
};

const ENTITY_LABEL: Record<string, string> = {
  page: "Page",
  blog_post: "Blog Post",
  faq: "FAQ",
  testimonial: "Testimonial",
  media: "Media",
  inquiry: "Lead",
  site_settings: "Settings",
  nav_item: "Navigation",
  logo: "Logo",
  redirect: "Redirect",
};

function ActivityLog() {
  const entries = Route.useLoaderData();

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
          <History className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-foreground">Activity Log</h1>
          <p className="text-sm text-muted-foreground">Who changed what, and when. Last 200 changes.</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3">When</th>
              <th className="px-5 py-3">Who</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">Item</th>
              <th className="px-5 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  No activity recorded yet.
                </td>
              </tr>
            )}
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                <td className="px-5 py-3 text-xs text-muted-foreground">{formatDateTime(e.createdAt)}</td>
                <td className="px-5 py-3 text-xs font-semibold text-foreground">{e.userEmail ?? "—"}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${ACTION_STYLE[e.action] ?? "bg-secondary text-muted-foreground"}`}>
                    {e.action}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-foreground">{ENTITY_LABEL[e.entity] ?? e.entity}</td>
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                  {e.details ? JSON.stringify(e.details) : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
