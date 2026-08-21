import { useEffect, useState } from "react";
import { useLoaderData } from "@tanstack/react-router";
import { X } from "lucide-react";

const STORAGE_PREFIX = "announcement-dismissed:";

export function AnnouncementBar() {
  const data = useLoaderData({ from: "__root__" });
  const settings = data?.settings ?? null;
  const [dismissed, setDismissed] = useState(true);

  const text = settings?.announcementText;
  const enabled = settings?.announcementEnabled && !!text;

  useEffect(() => {
    if (!enabled || !text) return;
    setDismissed(localStorage.getItem(STORAGE_PREFIX + text) === "1");
  }, [enabled, text]);

  if (!enabled || dismissed || !text) return null;

  function dismiss() {
    localStorage.setItem(STORAGE_PREFIX + text!, "1");
    setDismissed(true);
  }

  const content = (
    <span className="text-xs font-semibold sm:text-sm">{text}</span>
  );

  return (
    <div className="relative z-[70] flex items-center justify-center gap-3 bg-[linear-gradient(135deg,#ef4444,#f97316)] px-4 py-2.5 text-center text-white">
      {settings?.announcementLink ? (
        <a href={settings.announcementLink} className="underline underline-offset-2">
          {content}
        </a>
      ) : (
        content
      )}
      <button onClick={dismiss} aria-label="Dismiss" className="absolute right-3 grid h-5 w-5 shrink-0 place-items-center rounded-full hover:bg-white/20">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
