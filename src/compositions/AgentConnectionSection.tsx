// src/compositions/AgentConnectionSection.tsx
import { cn } from "@/lib/utils";
import { presenceSeverity } from "@/lib/status";
import { SectionHeader } from "@/layout/SectionHeader";
import { Badge } from "@/primitives/Badge";
import { StatusBeacon } from "@/primitives/StatusBeacon";
import { MonoValue } from "@/primitives/MonoValue";
import { FieldLabel } from "@/primitives/FieldLabel";
import { KvGrid } from "@/primitives/KvGrid";
import { Button } from "@/components/ui/button";
import type { AgentConnectionSectionProps } from "@/types/pages";

export function AgentConnectionSection({
  data,
  onAllowReEnrollment,
  onRevokeGrant,
}: AgentConnectionSectionProps) {
  const certColor =
    data.certificate.remainingDays > 7
      ? "text-status-ok"
      : data.certificate.remainingDays > 1
        ? "text-status-warn"
        : "text-status-error";

  const presenceStatus = presenceSeverity[data.presenceState] ?? "error";

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Agent Connection" />

      {/* Status */}
      <div className="rounded-xs bg-bg-card border border-border p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusBeacon status={presenceStatus} />
            <span className="text-sm font-medium text-fg capitalize">{data.presenceState}</span>
          </div>
          <span className="text-xs text-fg-muted">Last seen: {data.lastSeenAt}</span>
        </div>

        <KvGrid
          rows={[
            { label: "Agent ID", value: <MonoValue>{data.agentId}</MonoValue> },
            { label: "Version", value: <MonoValue>{data.version}</MonoValue> },
            { label: "Fleet Group", value: data.fleetGroup },
          ]}
        />
      </div>

      {/* Certificate */}
      <div className="rounded-xs bg-bg-card border border-border p-4 flex flex-col gap-3">
        <FieldLabel>Certificate</FieldLabel>
        <KvGrid
          rows={[
            {
              label: "Issued",
              value: <span className="text-xs">{data.certificate.issuedAt}</span>,
            },
            {
              label: "Expires",
              value: <span className="text-xs">{data.certificate.expiresAt}</span>,
            },
            {
              label: "Remaining",
              value: (
                <span className={cn("text-xs font-medium", certColor)}>
                  {data.certificate.remainingDays} days
                </span>
              ),
            },
          ]}
        />

        {data.recoveryGrant ? (
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <Badge variant={data.recoveryGrant.status === "allowed" ? "ok" : "default"}>
                Recovery {data.recoveryGrant.status}
              </Badge>
              {data.recoveryGrant.status === "allowed" && (
                <span className="text-[10px] text-fg-muted">
                  expires {new Date(data.recoveryGrant.expiresAtUnix * 1000).toLocaleTimeString()}
                </span>
              )}
            </div>
            {data.recoveryGrant.status === "allowed" && (
              <Button variant="ghost" size="sm" onClick={onRevokeGrant}>
                Revoke
              </Button>
            )}
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAllowReEnrollment}
            className="self-start mt-1"
          >
            Allow Re-enrollment
          </Button>
        )}
      </div>
    </div>
  );
}
