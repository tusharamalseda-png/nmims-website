import { createFileRoute, Link } from "@tanstack/react-router";
import { Inbox, FileText, BookOpen, Star, ArrowRight, HeartPulse, ShieldAlert, LinkIcon, LayoutDashboard } from "lucide-react";
import { getDashboardStatsFn } from "@/backend/dashboard/actions";
import { formatDate } from "@/lib/format-date";

export const Route = createFileRoute("/admin/_authed/")({
  loader: async () => getDashboardStatsFn(),
  component: AdminDashboard,
});

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
  backup: "Backup",
  personal_data: "Personal data",
  site_data: "Site data",
};

function AdminDashboard() {
  const { admin } = Route.useRouteContext();
  const stats = Route.useLoaderData();

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
          <LayoutDashboard className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="font-semibold text-foreground">{admin?.email}</span> <span className="capitalize">({admin?.role})</span>
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Leads this week" value={stats.leadsThisWeek} to="/admin/leads" icon={Inbox} tone="brand" sub={stats.newLeads > 0 ? `${stats.newLeads} unhandled` : "all handled"} subTone={stats.newLeads > 0 ? "warn" : "good"} />
        <StatCard label="Total leads" value={stats.totalLeads} to="/admin/leads" icon={Inbox} tone="neutral" />
        <StatCard label="Pages" value={stats.totalPages} to="/admin/pages" icon={FileText} tone="neutral" sub={stats.draftPages > 0 ? `${stats.draftPages} draft` : "all published"} subTone={stats.draftPages > 0 ? "warn" : "good"} />
        <StatCard label="Blog posts" value={stats.totalPosts} to="/admin/blog" icon={BookOpen} tone="neutral" sub={stats.draftPosts > 0 ? `${stats.draftPosts} draft` : "all published"} subTone={stats.draftPosts > 0 ? "warn" : "good"} />
        <StatCard label="Pending approvals" value={stats.pendingTestimonials} to="/admin/testimonials" icon={Star} tone={stats.pendingTestimonials > 0 ? "warn" : "neutral"} sub="testimonials" />
        <StatCard label="SEO issues" value={stats.seoIssues} to="/admin/health" icon={ShieldAlert} tone={stats.seoIssues > 0 ? "warn" : "good"} sub={stats.brokenLinks > 0 ? `+ ${stats.brokenLinks} broken links` : "no broken links"} subTone={stats.brokenLinks > 0 ? "warn" : "good"} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Recent Leads</h2>
            <Link to="/admin/leads" className="text-xs font-semibold text-primary hover:underline">View all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {stats.recentLeads.length === 0 && <p className="text-sm text-muted-foreground">No leads yet.</p>}
            {stats.recentLeads.map((l) => (
              <div key={l.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-foreground">{l.name}</p>
                  <p className="text-xs text-muted-foreground">{l.program ?? "—"}</p>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(l.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Recent Activity</h2>
            <Link to="/admin/activity" className="text-xs font-semibold text-primary hover:underline">View all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {stats.recentActivity.length === 0 && <p className="text-sm text-muted-foreground">No activity yet.</p>}
            {stats.recentActivity.map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{a.userEmail ?? "Someone"}</span>{" "}
                  <span className="text-muted-foreground">{a.action}</span>{" "}
                  {ENTITY_LABEL[a.entity] ?? a.entity}
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDate(a.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-bold text-foreground">Quick Actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink to="/admin/leads" icon={Inbox} label="Review Leads" />
          <QuickLink to="/admin/pages" icon={FileText} label="Edit Pages" />
          <QuickLink to="/admin/blog" icon={BookOpen} label="Write a Blog Post" />
          <QuickLink to="/admin/testimonials" icon={Star} label="Manage Testimonials" />
          <QuickLink to="/admin/health" icon={HeartPulse} label="Run Site Health Check" />
          <QuickLink to="/admin/not-found" icon={LinkIcon} label="Check 404 Monitor" />
        </div>
      </div>
    </div>
  );
}

const TONE_STYLES: Record<"brand" | "neutral" | "warn" | "good", { chip: string; icon: string }> = {
  brand: { chip: "bg-[linear-gradient(135deg,#ef4444,#f97316)]", icon: "text-white" },
  neutral: { chip: "bg-secondary", icon: "text-primary" },
  warn: { chip: "bg-amber-100", icon: "text-amber-600" },
  good: { chip: "bg-emerald-100", icon: "text-emerald-600" },
};

const SUB_TONE: Record<"warn" | "good", string> = {
  warn: "text-amber-600",
  good: "text-emerald-600",
};

function StatCard({
  label,
  value,
  to,
  icon: Icon,
  tone,
  sub,
  subTone,
}: {
  label: string;
  value: number;
  to: string;
  icon: typeof Inbox;
  tone: "brand" | "neutral" | "warn" | "good";
  sub?: string;
  subTone?: "warn" | "good";
}) {
  const t = TONE_STYLES[tone];
  return (
    <Link to={to} className="rounded-2xl border border-border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="flex items-center justify-between">
        <span className={`grid h-9 w-9 place-items-center rounded-lg ${t.chip}`}>
          <Icon className={`h-4 w-4 ${t.icon}`} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-foreground">{value}</p>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      {sub && <p className={`mt-0.5 text-[11px] font-medium ${subTone ? SUB_TONE[subTone] : "text-muted-foreground"}`}>{sub}</p>}
    </Link>
  );
}

function QuickLink({ to, icon: Icon, label }: { to: string; icon: typeof Inbox; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card transition hover:border-primary"
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </span>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
