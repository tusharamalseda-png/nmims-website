import { createFileRoute } from "@tanstack/react-router";
import { UserCog, ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";
import { getTwoFactorStatusFn, generateTwoFactorSetupFn, confirmTwoFactorSetupFn, disableTwoFactorFn } from "@/backend/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/_authed/account")({
  loader: async () => getTwoFactorStatusFn(),
  component: AccountPage,
});

function AccountPage() {
  const { admin } = Route.useRouteContext();
  const initial = Route.useLoaderData();
  const [enabled, setEnabled] = useState(initial.enabled);
  const [setup, setSetup] = useState<{ secret: string; otpauthUri: string; qrDataUrl: string } | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function startSetup() {
    setError(null);
    setBusy(true);
    try {
      const result = await generateTwoFactorSetupFn();
      setSetup(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start setup.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmSetup() {
    setError(null);
    setBusy(true);
    try {
      await confirmTwoFactorSetupFn({ data: { code } });
      setEnabled(true);
      setSetup(null);
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDisable() {
    if (!confirm("Turn off two-factor authentication for your account?")) return;
    setBusy(true);
    try {
      await disableTwoFactorFn();
      setEnabled(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#ef4444,#f97316)] text-white">
          <UserCog className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-foreground">My Account</h1>
          <p className="text-sm text-muted-foreground">{admin?.email} · <span className="capitalize">{admin?.role}</span></p>
        </div>
      </div>

      <div className="mt-6 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Two-Factor Authentication</p>

        {enabled && !setup && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              <p className="text-sm font-semibold">Two-factor authentication is on.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleDisable} disabled={busy}>Turn off</Button>
          </div>
        )}

        {!enabled && !setup && (
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldOff className="h-4 w-4" />
              <p className="text-sm font-semibold text-foreground">Two-factor authentication is off.</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Add a second step at login using any authenticator app (Google Authenticator, Authy, 1Password...).</p>
            <Button size="sm" className="mt-3" onClick={startSetup} disabled={busy}>{busy ? "Starting..." : "Set Up 2FA"}</Button>
          </div>
        )}

        {setup && (
          <div className="space-y-4 rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-semibold text-foreground">1. Scan this QR code</p>
              <p className="text-xs text-muted-foreground">Use your authenticator app's "scan QR code" option.</p>
              <img src={setup.qrDataUrl} alt="Two-factor setup QR code" className="mt-3 h-40 w-40 rounded-lg border border-border" />
              <p className="mt-2 break-all font-mono text-[10px] text-muted-foreground">Can't scan? Enter manually: {setup.secret}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">2. Enter the 6-digit code it shows</p>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="max-w-[140px] text-center font-mono tracking-[0.4em]"
                  placeholder="000000"
                />
                <Button size="sm" onClick={confirmSetup} disabled={busy || code.length !== 6}>{busy ? "Verifying..." : "Confirm & Enable"}</Button>
                <Button size="sm" variant="ghost" onClick={() => { setSetup(null); setCode(""); }}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-xs font-medium text-destructive">{error}</p>}

        <hr className="border-border" />
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Account</p>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input disabled value={admin?.email ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label>Role</Label>
          <Input disabled value={admin?.role ?? ""} className="capitalize" />
        </div>
      </div>
    </div>
  );
}
