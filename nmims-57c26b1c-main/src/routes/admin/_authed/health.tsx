import { createFileRoute } from "@tanstack/react-router";
import { HeartPulse, AlertTriangle, CheckCircle2, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { getMissingSeoFn, checkBrokenLinksFn } from "@/backend/health/actions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/_authed/health")({
  loader: async () => getMissingSeoFn(),
  component: HealthCheck,
});

function HealthCheck() {
  const missingSeo = Route.useLoaderData();
  const [linkResults, setLinkResults] = useState<{ path: string; label: string; location: string }[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  async function runLinkCheck() {
    setChecking(true);
    setCheckError(null);
    try {
      setLinkResults(await checkBrokenLinksFn());
    } catch (err) {
      setCheckError(err instanceof Error ? err.message : "Link check failed.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
          <HeartPulse className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-foreground">Site Health</h1>
          <p className="text-sm text-muted-foreground">SEO gaps and broken internal links.</p>
        </div>
      </div>

      <div className="mt-6 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Missing SEO Fields ({missingSeo.length})</p>
        <div className="mt-2 space-y-2">
          {missingSeo.length === 0 && (
            <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" /> Every page and published post has a meta title and description.
            </p>
          )}
          {missingSeo.map((m) => (
            <div key={`${m.type}-${m.slug}`} className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-foreground">{m.title}</p>
                <p className="text-xs text-amber-700">
                  Missing {[m.missingMetaTitle && "meta title", m.missingMetaDescription && "meta description"].filter(Boolean).join(" and ")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-wide text-muted-foreground">Broken Internal Links</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Checks every footer/header nav link against the site's real routes — no page loads, so this is instant.
        </p>
        <div className="mt-2">
          <Button size="sm" onClick={runLinkCheck} disabled={checking}>
            <LinkIcon className="mr-1.5 h-3.5 w-3.5" /> {checking ? "Checking..." : "Run Link Check"}
          </Button>
          {checkError && <p className="mt-2 text-xs font-medium text-destructive">{checkError}</p>}
          {linkResults && (
            <div className="mt-3 space-y-2">
              {linkResults.length === 0 && (
                <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> No broken links found.
                </p>
              )}
              {linkResults.map((r) => (
                <div key={r.path} className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                  <div>
                    <p className="font-mono text-xs text-foreground">{r.path}</p>
                    <p className="text-xs text-destructive/80">"{r.label}" in {r.location} navigation points to a page that doesn't exist</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
