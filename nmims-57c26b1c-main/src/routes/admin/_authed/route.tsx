import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FileText, BookOpen, HelpCircle, Image as ImageIcon, Inbox, LogOut, Star, Navigation as NavIcon, Settings as SettingsIcon, History, ArrowRightLeft, Award, Users, HeartPulse, Radar, Wrench, UserCog, ChevronRight } from "lucide-react";
import { useState } from "react";
import { logoutFn, getCurrentAdminFn } from "@/backend/auth/actions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/_authed")({
  beforeLoad: async () => {
    const admin = await getCurrentAdminFn();
    if (!admin) {
      throw redirect({ to: "/admin/login" });
    }
    return { admin };
  },
  component: AuthedAdminLayout,
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
type NavGroup = { label: string | null; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    label: null,
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/pages", label: "Pages", icon: FileText },
      { to: "/admin/blog", label: "Blog", icon: BookOpen },
      { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
      { to: "/admin/media", label: "Media", icon: ImageIcon },
      { to: "/admin/testimonials", label: "Testimonials", icon: Star },
      { to: "/admin/logos", label: "Logos & Badges", icon: Award },
      { to: "/admin/team", label: "Team Members", icon: Users },
    ],
  },
  {
    label: "Growth",
    items: [
      { to: "/admin/leads", label: "Leads", icon: Inbox },
      { to: "/admin/health", label: "Site Health", icon: HeartPulse },
      { to: "/admin/navigation", label: "Navigation", icon: NavIcon },
      { to: "/admin/redirects", label: "Redirects", icon: ArrowRightLeft },
      { to: "/admin/not-found", label: "404 Monitor", icon: Radar },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
      { to: "/admin/tools", label: "Tools", icon: Wrench },
      { to: "/admin/account", label: "My Account", icon: UserCog },
      { to: "/admin/activity", label: "Activity Log", icon: History },
    ],
  },
];

function initialsFor(email: string | undefined) {
  if (!email) return "?";
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase();
}

function AuthedAdminLayout() {
  const { admin } = Route.useRouteContext();
  const navigate = useNavigate();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ Content: true, Growth: true, System: true });

  async function handleLogout() {
    await logoutFn();
    await router.invalidate();
    navigate({ to: "/admin/login" });
  }

  function isItemActive(to: string, exact?: boolean) {
    return exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  }

  return (
    <div className="flex min-h-screen bg-secondary">
      <aside className="flex w-64 shrink-0 flex-col bg-[#0c0d12] text-white">
        <div className="border-b border-white/[0.08] px-5 pb-6 pt-7">
          <p className="text-xl font-extrabold leading-none tracking-tight text-white">
            cdoe<span className="text-[#FF6C4A]">.info</span>
          </p>
          <p className="mt-2.5 text-[10.5px] font-bold uppercase tracking-[0.22em] text-white/55">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-5 pt-5">
          {navGroups.map((group, i) => {
            const isOpen = !collapsed[group.label ?? ""];
            return (
              <div key={group.label ?? `top-${i}`} className={group.label ? "pt-4" : undefined}>
                {group.label && (
                  <button
                    onClick={() => setCollapsed((c) => ({ ...c, [group.label as string]: !c[group.label as string] }))}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40",
                      isOpen ? "bg-white/[0.06] text-white" : "text-white/70 hover:bg-white/[0.05] hover:text-white",
                    )}
                  >
                    {group.label}
                    <ChevronRight className={cn("h-3.5 w-3.5 text-[#FF9270] transition-transform duration-200", isOpen && "rotate-90")} />
                  </button>
                )}
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="mt-1.5 space-y-1">
                      {group.items.map(({ to, label, icon: Icon, exact }) => {
                        const active = isItemActive(to, exact);
                        return (
                          <Link
                            key={to}
                            to={to}
                            className={cn(
                              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold outline-none transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40",
                              active
                                ? "bg-[linear-gradient(135deg,#FF6C4A,#F5B942)] text-white"
                                : "bg-white/[0.045] text-white/80 hover:bg-[linear-gradient(135deg,#FF6C4A,#F5B942)] hover:text-white",
                            )}
                          >
                            <Icon className={cn("h-[15px] w-[15px] shrink-0", !active && "text-[#FF9270]")} strokeWidth={2.25} />
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.08] p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.1] text-[11px] font-bold text-white">
              {initialsFor(admin?.email)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-white">{admin?.email}</p>
              <p className="text-[10.5px] capitalize text-white/55">{admin?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-white/55 transition hover:bg-white/10 hover:text-white"
              title="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <main className={cn("flex-1 overflow-x-hidden p-8")}>
        <Outlet />
      </main>
    </div>
  );
}
