import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { MonoValue } from "@/primitives/MonoValue";
import { CopyButton } from "@/primitives/CopyButton";
import { FieldLabel } from "@/primitives/FieldLabel";

interface TotpSetupSheetProps {
  secret: string;
  otpauthUrl: string;
  onEnable: (password: string, totpCode: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string;
}

export function TotpSetupSheet({
  secret,
  otpauthUrl,
  onEnable,
  onCancel,
  loading,
  error,
}: TotpSetupSheetProps) {
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-title">Set Up Two-Factor Authentication</h3>
        <p className="text-sm text-fg-muted mt-0.5">
          Scan the QR code with your authenticator app, then enter your password and the generated
          code to verify.
        </p>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center gap-3 p-4 rounded-xs bg-white">
        <QRCodeSVG value={otpauthUrl} size={180} level="M" />
      </div>

      {/* Manual secret */}
      <div>
        <FieldLabel>Manual Entry Key</FieldLabel>
        <div className="flex items-center gap-2 mt-1">
          <MonoValue className="text-xs break-all">{secret}</MonoValue>
          <CopyButton text={secret} />
        </div>
      </div>

      {/* Verification */}
      <FormField label="Password" variant="uppercase" required>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your current password"
          disabled={loading}
        />
      </FormField>

      <FormField label="Authenticator Code" variant="uppercase" required>
        <Input
          value={totpCode}
          onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="6-digit code"
          maxLength={6}
          disabled={loading}
          className="font-mono tracking-widest"
        />
      </FormField>

      {error && <div className="text-xs text-status-error">{error}</div>}

      <div className="flex gap-2 justify-end mt-2">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={() => onEnable(password, totpCode)}
          disabled={loading || !password || totpCode.length < 6}
        >
          {loading ? "Verifying..." : "Enable 2FA"}
        </Button>
      </div>
    </div>
  );
}
