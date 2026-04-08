import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TotpDisableSheetProps {
  onDisable: (password: string, totpCode: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string;
}

export function TotpDisableSheet({
  onDisable,
  onCancel,
  loading,
  error,
}: TotpDisableSheetProps) {
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-fg">Disable Two-Factor Authentication</h3>
        <p className="text-sm text-fg-muted mt-0.5">
          Enter your password and current authenticator code to disable 2FA.
        </p>
      </div>

      <div>
        <label className="text-xs font-medium text-fg-muted uppercase tracking-wider block mb-1.5">
          Password *
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your current password"
          disabled={loading}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-fg-muted uppercase tracking-wider block mb-1.5">
          Authenticator Code *
        </label>
        <Input
          value={totpCode}
          onChange={(e) => setTotpCode(e.target.value)}
          placeholder="6-digit code"
          maxLength={6}
          disabled={loading}
          className="font-mono tracking-widest"
        />
      </div>

      {error && <div className="text-xs text-status-error">{error}</div>}

      <div className="flex gap-2 justify-end mt-2">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => onDisable(password, totpCode)}
          disabled={loading || !password || totpCode.length < 6}
        >
          {loading ? "Disabling..." : "Disable 2FA"}
        </Button>
      </div>
    </div>
  );
}
