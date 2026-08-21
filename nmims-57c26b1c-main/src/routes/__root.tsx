import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  redirect,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { getSiteSettingsFn } from "@/backend/settings/actions";
import { getCurrentAdminFn } from "@/backend/auth/actions";
import { listNavItemsFn } from "@/backend/navigation/actions";
import { getRedirectFn } from "@/backend/redirects/actions";
import { CookieConsent } from "@/components/site/CookieConsent";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { logNotFoundHitFn } from "@/backend/health/not-found";

const DEFAULT_TITLE = "NMIMS Online | UGC-Entitled Online Degrees";
const DEFAULT_DESCRIPTION = "Earn a UGC-entitled online degree from NMIMS CDOE. Free admission counselling, transparent fees, and flexible learning for working professionals.";

function NotFoundComponent() {
  useEffect(() => {
    logNotFoundHitFn({ data: { path: window.location.pathname, referrer: document.referrer || null } }).catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ location }) => {
    const settings = await getSiteSettingsFn();

    if (settings?.maintenanceMode && location.pathname !== "/maintenance" && !location.pathname.startsWith("/admin")) {
      const admin = await getCurrentAdminFn();
      if (!admin) throw redirect({ href: "/maintenance" });
    }

    const target = await getRedirectFn({ data: { path: location.pathname } });
    if (target) {
      throw redirect({ href: target.toPath, statusCode: Number(target.statusCode) });
    }

    return { settings };
  },
  loader: async ({ context }) => {
    const navItems = await listNavItemsFn();
    return { settings: context.settings, navItems };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.settings?.siteTitle || DEFAULT_TITLE;
    const favicon = loaderData?.settings?.faviconUrl;
    const analytics = loaderData?.settings?.analyticsIds ?? {};
    const gaId = analytics.ga;
    const gtmId = analytics.gtm;
    const metaPixelId = analytics.metaPixel;
    const googleVerification = loaderData?.settings?.googleSiteVerification;
    const bingVerification = loaderData?.settings?.bingSiteVerification;
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title },
        { name: "description", content: DEFAULT_DESCRIPTION },
        { name: "author", content: "RH Academy" },
        { property: "og:title", content: title },
        { property: "og:description", content: DEFAULT_DESCRIPTION },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        ...(googleVerification ? [{ name: "google-site-verification", content: googleVerification }] : []),
        ...(bingVerification ? [{ name: "msvalidate.01", content: bingVerification }] : []),
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap" },
        ...(favicon ? [{ rel: "icon", href: favicon }] : []),
      ],
      scripts: [
        ...(gaId
          ? [
              { src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`, async: true },
              {
                children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              },
            ]
          : []),
        ...(gtmId
          ? [
              {
                children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
              },
            ]
          : []),
        ...(metaPixelId
          ? [
              {
                children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`,
              },
            ]
          : []),
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AnnouncementBar />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <CookieConsent />
    </QueryClientProvider>
  );
}
