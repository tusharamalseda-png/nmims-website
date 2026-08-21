import { useEffect, useState } from "react";
import { useLoaderData } from "@tanstack/react-router";

const STORAGE_KEY = "cookie-consent-accepted";
const DEFAULT_TEXT =
  "We use cookies to improve your experience and understand site traffic. By continuing to browse, you agree to our use of cookies.";

export function CookieConsent() {
  const data = useLoaderData({ from: "__root__" });
  const settings = data?.settings ?? null;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (settings?.cookieConsentEnabled === false) return;
    if (localStorage.getItem(STORAGE_KEY) === "1") return;
    setVisible(true);
  }, [settings?.cookieConsentEnabled]);

  if (!visible) return null;

  function accept() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 p-4 shadow-elegant backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-xs text-muted-foreground sm:text-sm">
          {settings?.cookieConsentText || DEFAULT_TEXT}
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-full gradient-primary px-5 py-2 text-xs font-bold text-primary-foreground sm:text-sm"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
