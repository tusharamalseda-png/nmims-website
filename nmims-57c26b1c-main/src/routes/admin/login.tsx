import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginFn, verifyLoginTwoFactorFn } from "@/backend/auth/actions";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsCode, setNeedsCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await loginFn({ data: { email, password } });
      if (result.requires2FA) {
        setNeedsCode(true);
      } else {
        await router.invalidate();
        navigate({ to: "/admin" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await verifyLoginTwoFactorFn({ data: { code } });
      await router.invalidate();
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-elegant">
        {!needsCode ? (
          <>
            <h1 className="text-xl font-extrabold text-foreground">Admin Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to manage the site.</p>

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              {error && <p className="text-sm font-medium text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-xl font-extrabold text-foreground">Two-Factor Code</h1>
            <p className="mt-1 text-sm text-muted-foreground">Enter the 6-digit code from your authenticator app.</p>

            <form onSubmit={handleCodeSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="text-center font-mono text-lg tracking-[0.4em]"
                  placeholder="000000"
                  autoFocus
                />
              </div>

              {error && <p className="text-sm font-medium text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
                {loading ? "Verifying..." : "Verify & Sign In"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
