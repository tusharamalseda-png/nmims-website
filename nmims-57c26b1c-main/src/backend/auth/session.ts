import { useSession } from "@tanstack/react-start/server";

export type AdminSessionData = {
  userId: string;
  email: string;
  role: "admin" | "editor";
  // set right after a correct password, before the 2FA code is verified —
  // userId stays unset until then, so every existing "not authenticated"
  // check keeps working without changes.
  pending2FAUserId?: string;
};

export function getAdminSession() {
  return useSession<AdminSessionData>({
    password: process.env.SESSION_SECRET!,
    name: "admin_session",
    cookie: { secure: true, sameSite: "lax", path: "/" },
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}
