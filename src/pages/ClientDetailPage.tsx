import { useState } from "react";
import { PageHeader } from "@/layout/PageHeader";
import { SectionHeader } from "@/layout/SectionHeader";
import { Breadcrumbs } from "@/compositions/Breadcrumbs";
import { SwipeTabView } from "@/compositions/SwipeTabView";
import { Badge } from "@/primitives/Badge";
import { StatCard } from "@/primitives/StatCard";
import { KvGrid } from "@/primitives/KvGrid";
import { MonoValue } from "@/primitives/MonoValue";
import { FieldLabel } from "@/primitives/FieldLabel";
import { CopyButton } from "@/primitives/CopyButton";
import { DataTable } from "@/components/DataTable";
import { formatBytes, formatQuota, formatExpiry, deployVariant } from "./_shared";
import type { ClientDetailPageProps, ClientDeploymentData } from "@/types/pages";

// ─── Overview content ─────────────────────────────────────────────────────────

function OverviewContent({ client }: { client: ClientDetailPageProps["client"] }) {
  const settingsRows = [
    {
      label: "Max TCP Connections",
      value: <MonoValue>{client.maxTcpConns > 0 ? client.maxTcpConns : "Unlimited"}</MonoValue>,
    },
    {
      label: "Max Unique IPs",
      value: <MonoValue>{client.maxUniqueIps > 0 ? client.maxUniqueIps : "Unlimited"}</MonoValue>,
    },
    {
      label: "Data Quota",
      value: <MonoValue>{formatQuota(client.dataQuotaBytes)}</MonoValue>,
    },
    {
      label: "Expiration",
      value: <MonoValue>{formatExpiry(client.expirationRfc3339)}</MonoValue>,
    },
    {
      label: "Fleet Groups",
      value: (
        <MonoValue>
          {client.fleetGroupIds.length > 0 ? client.fleetGroupIds.join(", ") : "All"}
        </MonoValue>
      ),
    },
    {
      label: "Secret",
      value: (
        <span className="flex items-center">
          <MonoValue>{"••••••••"}</MonoValue>
          <CopyButton text={client.secret} />
        </span>
      ),
    },
    {
      label: "User Ad Tag",
      value: (
        <MonoValue className="text-fg-muted">
          {client.userAdTag || "—"}
        </MonoValue>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Settings card */}
      <div className="rounded-xs bg-bg-card border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <FieldLabel>Settings</FieldLabel>
        </div>
        <div className="p-4">
          <KvGrid rows={settingsRows} />
        </div>
      </div>

      {/* Connection links placeholder */}
      <div className="rounded-xs bg-bg-card border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <FieldLabel>Connection Links</FieldLabel>
        </div>
        <div className="px-4 py-6 text-center text-fg-muted text-sm">
          Links available after deployment
        </div>
      </div>
    </div>
  );
}

// ─── Deployments content ──────────────────────────────────────────────────────

function DeploymentsContent({
  deployments,
}: {
  deployments: ClientDeploymentData[];
}) {
  const deployColumns = [
    {
      key: "agentId",
      header: "Server",
      render: (row: ClientDeploymentData) => (
        <MonoValue className="truncate max-w-[120px]">{row.agentId}</MonoValue>
      ),
    },
    {
      key: "operation",
      header: "Operation",
      render: (row: ClientDeploymentData) => (
        <Badge variant="default">{row.desiredOperation}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: ClientDeploymentData) => (
        <Badge variant={deployVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      key: "lastApplied",
      header: "Last Applied",
      render: (row: ClientDeploymentData) => (
        <span className="font-mono text-xs text-fg-muted">
          {row.lastAppliedAtUnix > 0
            ? new Date(row.lastAppliedAtUnix * 1000).toLocaleString()
            : "—"}
        </span>
      ),
    },
    {
      key: "error",
      header: "Error",
      render: (row: ClientDeploymentData) =>
        row.lastError ? (
          <span
            className="text-xs text-status-error truncate max-w-[160px] block"
            title={row.lastError}
          >
            {row.lastError.slice(0, 60)}{row.lastError.length > 60 ? "…" : ""}
          </span>
        ) : (
          <span className="text-fg-muted text-xs">—</span>
        ),
    },
    {
      key: "link",
      header: "Link",
      render: (row: ClientDeploymentData) =>
        row.connectionLink ? (
          <CopyButton text={row.connectionLink} />
        ) : (
          <span className="text-fg-muted text-xs">—</span>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={deployColumns}
        data={deployments}
        keyExtractor={(row) => row.agentId}
        emptyMessage="No deployments"
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function ClientDetailPage({ client, onBack }: ClientDetailPageProps) {
  const overviewContent = <OverviewContent client={client} />;
  const deploymentsContent = <DeploymentsContent deployments={client.deployments} />;

  const mobileTabs = [
    { id: "overview", label: "Overview", content: overviewContent },
    { id: "deployments", label: "Deployments", content: deploymentsContent },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="px-4 md:px-8 pt-3">
        <Breadcrumbs
          items={[
            { label: "Clients", onClick: onBack },
            { label: client.name },
          ]}
        />
      </div>

      {/* Page header */}
      <PageHeader
        title={client.name}
        trailing={
          <Badge variant={client.enabled ? "ok" : "error"}>
            {client.enabled ? "Active" : "Disabled"}
          </Badge>
        }
      />

      <div className="px-4 md:px-8 flex flex-col gap-6 pb-8">
        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <StatCard label="Active Connections" value={String(client.activeTcpConns)} />
          <StatCard label="Unique IPs" value={String(client.uniqueIpsUsed)} />
          <StatCard label="Traffic Used" value={formatBytes(client.trafficUsedBytes)} />
          <StatCard label="Quota" value={formatQuota(client.dataQuotaBytes)} />
        </div>

        {/* Mobile: SwipeTabView */}
        <div className="md:hidden">
          <SwipeTabView tabs={mobileTabs} />
        </div>

        {/* Desktop: stacked sections */}
        <div className="hidden md:flex flex-col gap-6">
          <div>
            <SectionHeader title="Settings" />
            <div className="rounded-xs bg-bg-card border border-border p-4">
              <KvGrid
                rows={[
                  {
                    label: "Max TCP Connections",
                    value: (
                      <MonoValue>
                        {client.maxTcpConns > 0 ? client.maxTcpConns : "Unlimited"}
                      </MonoValue>
                    ),
                  },
                  {
                    label: "Max Unique IPs",
                    value: (
                      <MonoValue>
                        {client.maxUniqueIps > 0 ? client.maxUniqueIps : "Unlimited"}
                      </MonoValue>
                    ),
                  },
                  {
                    label: "Data Quota",
                    value: <MonoValue>{formatQuota(client.dataQuotaBytes)}</MonoValue>,
                  },
                  {
                    label: "Expiration",
                    value: <MonoValue>{formatExpiry(client.expirationRfc3339)}</MonoValue>,
                  },
                  {
                    label: "Fleet Groups",
                    value: (
                      <MonoValue>
                        {client.fleetGroupIds.length > 0
                          ? client.fleetGroupIds.join(", ")
                          : "All"}
                      </MonoValue>
                    ),
                  },
                  {
                    label: "Secret",
                    value: (
                      <span className="flex items-center">
                        <MonoValue>{"••••••••"}</MonoValue>
                        <CopyButton text={client.secret} />
                      </span>
                    ),
                  },
                  {
                    label: "User Ad Tag",
                    value: (
                      <MonoValue className="text-fg-muted">
                        {client.userAdTag || "—"}
                      </MonoValue>
                    ),
                  },
                ]}
              />
            </div>
          </div>

          <div>
            <SectionHeader title="Connection Links" />
            <div className="rounded-xs bg-bg-card border border-border px-4 py-6 text-center text-fg-muted text-sm">
              Links available after deployment
            </div>
          </div>

          <div>
            <SectionHeader title="Deployments" badge={client.deployments.length} />
            <DeploymentsContent deployments={client.deployments} />
          </div>
        </div>
      </div>
    </>
  );
}
