// Aliased on import: this is TanStack Start's server-side session store, not
// a React hook, but its name starts with "use" so eslint-plugin-react-hooks
// misreads any wrapper around it as a hook call unless the local name doesn't
// match the /^use/ pattern.
import { useSession as getSessionStore } from "@tanstack/react-start/server";

export type AdminSessionData = {
  userId: string;
  email: string;
  role: "admin" | "editor";
  // set right after a correct password, before the 2FA code is verified —
  // userId stays unset until then, so every existing "not authenticated"
  // check keeps working without changes.
  pending2FAUserId?: string;
  // Set only via setActiveSiteFn, which re-verifies membership server-side —
  // never trust this value alone without re-checking (see requireActiveSite).
  activeSiteId?: string;
};

export function getAdminSession() {
  return getSessionStore<AdminSessionData>({
    password: process.env.SESSION_SECRET!,
    name: "admin_session",
    cookie: { secure: true, sameSite: "lax", path: "/" },
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}
