import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/maintenance")({
  head: () => ({
    meta: [{ title: "Down for maintenance" }, { name: "robots", content: "noindex" }],
  }),
  component: MaintenancePage,
});

function MaintenancePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md">
        <img src="/images/nmimslogo.webp" alt="NMIMS Online" className="mx-auto h-12 w-auto" />
        <h1 className="mt-6 font-serif text-2xl font-bold text-foreground">We'll be right back</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The site is undergoing scheduled maintenance. Please check back shortly, or reach out to us directly if it's urgent.
        </p>
      </div>
    </div>
  );
}
