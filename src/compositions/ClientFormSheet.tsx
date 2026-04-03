import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ClientFormSheetProps } from "@/types/pages";

export function ClientFormSheet({ mode, data, onChange, onSubmit, onCancel, loading, error }: ClientFormSheetProps) {
  const [showLimits, setShowLimits] = useState(
    data.maxTcpConns > 0 || data.maxUniqueIps > 0 || data.dataQuotaBytes > 0,
  );

  function update<K extends keyof typeof data>(key: K, value: (typeof data)[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-fg">{mode === "create" ? "New Client" : "Edit Client"}</h3>
        <p className="text-sm text-fg-muted mt-0.5">
          {mode === "create" ? "Configure a new Telemt client." : "Update client parameters."}
        </p>
      </div>

      <div>
        <label className="text-xs font-medium text-fg-muted uppercase tracking-wider block mb-1.5">Client Name *</label>
        <Input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. premium-users" disabled={loading} />
      </div>

      <div>
        <label className="text-xs font-medium text-fg-muted uppercase tracking-wider block mb-1.5">Ad Tag</label>
        <Input value={data.userAdTag} onChange={(e) => update("userAdTag", e.target.value)} placeholder="Telegram ad channel tag" disabled={loading} />
        <p className="text-[11px] text-fg-muted mt-1">Promotional channel displayed to users</p>
      </div>

      <div>
        <label className="text-xs font-medium text-fg-muted uppercase tracking-wider block mb-1.5">Expiration</label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={data.expirationRfc3339 ? data.expirationRfc3339.slice(0, 10) : ""}
            onChange={(e) => update("expirationRfc3339", e.target.value ? new Date(e.target.value).toISOString() : "")}
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
      </div>

      <button
        type="button"
        onClick={() => setShowLimits(!showLimits)}
        className="text-xs text-fg-muted hover:text-fg text-left border-t border-border pt-3 mt-1"
      >
        {showLimits ? "▾" : "▸"} Limits (optional)
      </button>
      {showLimits && (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-medium text-fg-muted uppercase block mb-1">Max TCP Conns</label>
            <Input type="number" value={data.maxTcpConns} onChange={(e) => update("maxTcpConns", Number(e.target.value))} placeholder="0 = unlimited" className="font-mono text-xs" disabled={loading} />
          </div>
          <div>
            <label className="text-[10px] font-medium text-fg-muted uppercase block mb-1">Max Unique IPs</label>
            <Input type="number" value={data.maxUniqueIps} onChange={(e) => update("maxUniqueIps", Number(e.target.value))} placeholder="0 = unlimited" className="font-mono text-xs" disabled={loading} />
          </div>
          <div>
            <label className="text-[10px] font-medium text-fg-muted uppercase block mb-1">Data Quota (bytes)</label>
            <Input type="number" value={data.dataQuotaBytes} onChange={(e) => update("dataQuotaBytes", Number(e.target.value))} placeholder="0 = unlimited" className="font-mono text-xs" disabled={loading} />
          </div>
        </div>
      )}

      {error && <div className="text-xs text-status-error">{error}</div>}

      <div className="flex gap-2 justify-end mt-2">
        <Button variant="ghost" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button onClick={onSubmit} disabled={loading || !data.name}>
          {loading ? "Saving..." : mode === "create" ? "Create Client" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
