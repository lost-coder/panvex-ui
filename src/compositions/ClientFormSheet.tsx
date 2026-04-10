import { useState } from "react";
import { Button } from "@/base/button";
import { Input } from "@/base/input";
import { FormField } from "@/base/form-field";
import type { ClientFormSheetProps } from "@/types/pages";

export function ClientFormSheet({
  mode,
  data,
  onChange,
  onSubmit,
  onCancel,
  loading,
  error,
}: ClientFormSheetProps) {
  const [showLimits, setShowLimits] = useState(
    data.maxTcpConns > 0 || data.maxUniqueIps > 0 || data.dataQuotaBytes > 0,
  );

  function update<K extends keyof typeof data>(key: K, value: (typeof data)[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-title">
          {mode === "create" ? "New Client" : "Edit Client"}
        </h3>
        <p className="text-sm text-fg-muted mt-0.5">
          {mode === "create" ? "Configure a new Telemt client." : "Update client parameters."}
        </p>
      </div>

      <FormField label="Client Name" variant="uppercase" required>
        <Input
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. premium-users"
          disabled={loading}
        />
      </FormField>

      <FormField label="Ad Tag" variant="uppercase" description="Promotional channel displayed to users">
        <Input
          value={data.userAdTag}
          onChange={(e) => update("userAdTag", e.target.value)}
          placeholder="Telegram ad channel tag"
          disabled={loading}
        />
      </FormField>

      <FormField label="Expiration" variant="uppercase">
        <div className="flex gap-2">
          <Input
            type="date"
            value={data.expirationRfc3339 ? data.expirationRfc3339.slice(0, 10) : ""}
            onChange={(e) =>
              update(
                "expirationRfc3339",
                e.target.value ? new Date(e.target.value).toISOString() : "",
              )
            }
            className="flex-1"
            disabled={loading}
          />
          <Button
            variant={!data.expirationRfc3339 ? "default" : "ghost"}
            size="sm"
            onClick={() => update("expirationRfc3339", "")}
          >
            Never
          </Button>
        </div>
      </FormField>

      <button
        type="button"
        onClick={() => setShowLimits(!showLimits)}
        className="text-xs text-fg-muted hover:text-fg text-left border-t border-border pt-3 mt-1"
      >
        {showLimits ? "▾" : "▸"} Limits (optional)
      </button>
      {showLimits && (
        <div className="grid grid-cols-3 gap-3">
          <FormField label="Max TCP Conns" variant="compact">
            <Input
              type="number"
              value={data.maxTcpConns}
              onChange={(e) => update("maxTcpConns", Number(e.target.value))}
              placeholder="0 = unlimited"
              className="font-mono text-xs"
              disabled={loading}
            />
          </FormField>
          <FormField label="Max Unique IPs" variant="compact">
            <Input
              type="number"
              value={data.maxUniqueIps}
              onChange={(e) => update("maxUniqueIps", Number(e.target.value))}
              placeholder="0 = unlimited"
              className="font-mono text-xs"
              disabled={loading}
            />
          </FormField>
          <FormField label="Data Quota (bytes)" variant="compact">
            <Input
              type="number"
              value={data.dataQuotaBytes}
              onChange={(e) => update("dataQuotaBytes", Number(e.target.value))}
              placeholder="0 = unlimited"
              className="font-mono text-xs"
              disabled={loading}
            />
          </FormField>
        </div>
      )}

      {error && <div className="text-xs text-status-error">{error}</div>}

      <div className="flex gap-2 justify-end mt-2">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={loading || !data.name}>
          {loading ? "Saving..." : mode === "create" ? "Create Client" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
