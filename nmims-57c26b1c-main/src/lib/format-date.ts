// Always pass an explicit locale to Intl date formatting. Leaving it
// implicit lets Node (server) and the browser (client) resolve different
// default locales, which makes the server-rendered date text disagree with
// what the client re-computes on hydration — React then discards and
// re-renders the affected tree, causing a visible flash on every load.
export function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(value: Date | string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
