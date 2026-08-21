import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { db } from "../db/client";
import { adminUsers } from "../db/schema";
import { supabaseAuthClient } from "../supabase/auth-client";
import { getAdminSession } from "./session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    const { data: authData, error } = await supabaseAuthClient.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !authData.user) {
      throw new Error("Incorrect email or password.");
    }

    const [profile] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, authData.user.id))
      .limit(1);

    if (!profile) {
      throw new Error("This account is not authorized for admin access.");
    }

    const session = await getAdminSession();

    if (profile.twoFactorEnabled) {
      await session.update({ pending2FAUserId: profile.id, userId: undefined, email: undefined, role: undefined });
      return { requires2FA: true as const };
    }

    await session.update({ userId: profile.id, email: profile.email, role: profile.role, pending2FAUserId: undefined });
    return { requires2FA: false as const, role: profile.role };
  });

export const verifyLoginTwoFactorFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ code: z.string().min(6).max(6) }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    const pendingId = session.data.pending2FAUserId;
    if (!pendingId) throw new Error("No login in progress.");

    const [profile] = await db.select().from(adminUsers).where(eq(adminUsers.id, pendingId)).limit(1);
    if (!profile || !profile.twoFactorSecret) throw new Error("Two-factor is not set up for this account.");

    const totp = new OTPAuth.TOTP({
      issuer: "cdoe.info Admin",
      label: profile.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(profile.twoFactorSecret),
    });
    const delta = totp.validate({ token: data.code, window: 1 });
    if (delta === null) throw new Error("Invalid code. Check your authenticator app and try again.");

    await session.update({ userId: profile.id, email: profile.email, role: profile.role, pending2FAUserId: undefined });
    return { role: profile.role };
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAdminSession();
  await session.clear();
});

export const getCurrentAdminFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) return null;
  return session.data;
});

export const listAdminUsersFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  return db
    .select({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name, role: adminUsers.role, twoFactorEnabled: adminUsers.twoFactorEnabled })
    .from(adminUsers);
});

// ---------- Two-factor authentication (own account) ----------

export const getTwoFactorStatusFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  const [profile] = await db.select({ twoFactorEnabled: adminUsers.twoFactorEnabled }).from(adminUsers).where(eq(adminUsers.id, session.data.userId)).limit(1);
  return { enabled: profile?.twoFactorEnabled ?? false };
});

// Generates (and stores) a fresh secret, but does NOT enable 2FA yet —
// enabling happens only once the user proves they can generate a valid code.
export const generateTwoFactorSetupFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");

  const secret = new OTPAuth.Secret({ size: 20 });
  const totp = new OTPAuth.TOTP({
    issuer: "cdoe.info Admin",
    label: session.data.email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  });

  await db.update(adminUsers).set({ twoFactorSecret: secret.base32, twoFactorEnabled: false }).where(eq(adminUsers.id, session.data.userId));

  const otpauthUri = totp.toString();
  const qrDataUrl = await QRCode.toDataURL(otpauthUri);
  return { secret: secret.base32, otpauthUri, qrDataUrl };
});

export const confirmTwoFactorSetupFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ code: z.string().min(6).max(6) }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    const [profile] = await db.select({ twoFactorSecret: adminUsers.twoFactorSecret }).from(adminUsers).where(eq(adminUsers.id, session.data.userId)).limit(1);
    if (!profile?.twoFactorSecret) throw new Error("Start setup again — no pending secret found.");

    const totp = new OTPAuth.TOTP({
      issuer: "cdoe.info Admin",
      label: session.data.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(profile.twoFactorSecret),
    });
    const delta = totp.validate({ token: data.code, window: 1 });
    if (delta === null) throw new Error("Invalid code. Check your authenticator app and try again.");

    await db.update(adminUsers).set({ twoFactorEnabled: true }).where(eq(adminUsers.id, session.data.userId));
    return { success: true };
  });

export const disableTwoFactorFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  await db.update(adminUsers).set({ twoFactorSecret: null, twoFactorEnabled: false }).where(eq(adminUsers.id, session.data.userId));
  return { success: true };
});
