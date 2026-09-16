import { useLoaderData } from "@tanstack/react-router";

// GTM's noscript fallback (for visitors with JS disabled) — the head script
// itself is injected via __root.tsx's head(), which already has access to
// loaderData directly. This one needs the hook form instead since it renders
// actual markup, and per TanStack Router, that hook can only resolve "__root__"
// from a file other than __root.tsx itself (self-reference breaks the types).
export function GtmNoscript() {
  const data = useLoaderData({ from: "__root__" });
  const gtmId = data?.settings?.analyticsIds?.gtm;
  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
