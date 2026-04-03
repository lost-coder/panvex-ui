import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LoginPageProps } from "@/types/pages";

export function LoginPage({ onLogin, error, loading }: LoginPageProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [totpCode, setTotpCode] = React.useState("");
  const [showTotp, setShowTotp] = React.useState(false);

  const canShowTotp = username.length > 0 && password.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onLogin(username, password, totpCode || undefined);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-sm bg-bg-card border border-border rounded-xl shadow-xl p-8 flex flex-col gap-6">
        {/* Logo / Title */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-3xl font-bold text-fg tracking-tight">
            Panvex
          </span>
          <span className="text-xs text-fg-muted uppercase tracking-widest font-mono">
            Control Plane
          </span>
        </div>

        {/* Error banner */}
        {error && (
          <div className="rounded-xs border border-status-error/30 bg-status-error/10 px-3 py-2 text-sm text-status-error">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-fg-muted uppercase tracking-wider">
              Username
            </label>
            <Input
              type="text"
              autoComplete="username"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-fg-muted uppercase tracking-wider">
              Password
            </label>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* TOTP toggle */}
          {canShowTotp && !showTotp && (
            <button
              type="button"
              onClick={() => setShowTotp(true)}
              className="text-xs text-accent hover:text-accent/80 self-start transition-colors"
            >
              Enter 2FA code
            </button>
          )}

          {showTotp && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-fg-muted uppercase tracking-wider">
                2FA Code
              </label>
              <Input
                type="text"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loading || !username || !password}
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
