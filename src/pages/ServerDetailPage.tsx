import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── ActionsDropdown ──────────────────────────────────────────────────────────

function ActionsDropdown({ onReload }: { onReload?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-xs hover:bg-white/10 transition-colors text-fg-muted hover:text-fg"
        title="Server actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-xs bg-bg-card border border-border shadow-lg py-1 flex flex-col">
            <button onClick={() => { onReload?.(); setOpen(false); }} className="px-3 py-2 text-left text-sm text-fg hover:bg-bg-card-hover transition-colors">⟳ Reload Runtime</button>
            <button onClick={() => setOpen(false)} className="px-3 py-2 text-left text-sm text-fg hover:bg-bg-card-hover transition-colors">🔄 Restart Server</button>
            <div className="h-px bg-border my-1" />
            <button onClick={() => setOpen(false)} className="px-3 py-2 text-left text-sm text-status-error hover:bg-bg-card-hover transition-colors">⏻ Force Stop</button>
          </div>
        </>
      )}
    </div>
  );
}
import { PageHeader } from "@/layout/PageHeader";
import { SectionHeader } from "@/layout/SectionHeader";
import { Breadcrumbs } from "@/compositions/Breadcrumbs";
import { GaugeStrip } from "@/compositions/GaugeStrip";
import { DCScrollStrip } from "@/compositions/DCScrollStrip";
import { AlertStrip } from "@/compositions/AlertStrip";
import { SwipeTabView } from "@/compositions/SwipeTabView";
import { StatusBeacon } from "@/primitives/StatusBeacon";
import { Badge } from "@/primitives/Badge";
import { ProgressBar } from "@/primitives/ProgressBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/DataTable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
} from "@/components/ui/sheet";
import type {
  ServerDetailPageProps,
  ServerDcData,
  ServerUpstreamData,
  ServerMeWriterData,
  ServerEventData,
} from "@/types/pages";

// ─── Formatting helpers ───────────────────────────────────────────────────────

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  return d > 0 ? `${d}d ${h}h` : `${h}h`;
}

function formatBytes(bytes: number): string {
  if (bytes > 1e9) return (bytes / 1e9).toFixed(1) + " GB";
  if (bytes > 1e6) return (bytes / 1e6).toFixed(1) + " MB";
  return bytes + " B";
}

function formatTime(epochSecs: number): string {
  return new Date(epochSecs * 1000).toLocaleTimeString();
}

function coverageColor(pct: number): string {
  if (pct < 70) return "text-status-error";
  if (pct < 100) return "text-status-warn";
  return "text-status-ok";
}

// ─── Local UI helpers ─────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] text-fg-muted uppercase tracking-wider font-medium leading-none">{children}</span>;
}

function MonoValue({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("font-mono text-xs text-fg", className)}>{children}</span>;
}

function StatCard({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xs bg-bg-card p-3 flex flex-col gap-0.5", className)}>
      <span className="text-lg font-mono font-semibold text-fg leading-none">{value}</span>
      <FieldLabel>{label}</FieldLabel>
    </div>
  );
}

function KvGrid({ rows, className }: { rows: Array<{ label: string; value: React.ReactNode }>; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm", className)}>
      {rows.map(({ label, value }) => (
        <React.Fragment key={label}>
          <span className="text-fg-muted">{label}</span>
          <span className="font-mono text-xs text-fg">{value}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Tab content components ───────────────────────────────────────────────────

function ConnectionsTab({ server }: { server: ServerDetailPageProps["server"] }) {
  const { connections, summary } = server;
  const total = connections.current;
  const mePct = total > 0 ? Math.round((connections.currentMe / total) * 100) : 0;
  const directPct = total > 0 ? Math.round((connections.currentDirect / total) * 100) : 0;

  const byConnColumns = [
    {
      key: "username",
      header: "Username",
      render: (row: { username: string; connections: number; octets: number }) => (
        <MonoValue>{row.username}</MonoValue>
      ),
    },
    {
      key: "connections",
      header: "Connections",
      render: (row: { username: string; connections: number; octets: number }) => (
        <MonoValue>{row.connections}</MonoValue>
      ),
    },
    {
      key: "traffic",
      header: "Traffic",
      render: (row: { username: string; connections: number; octets: number }) => (
        <MonoValue>{formatBytes(row.octets)}</MonoValue>
      ),
    },
  ];

  const byThroughputColumns = [
    {
      key: "username",
      header: "Username",
      render: (row: { username: string; connections: number; octets: number }) => (
        <MonoValue>{row.username}</MonoValue>
      ),
    },
    {
      key: "traffic",
      header: "Traffic",
      render: (row: { username: string; connections: number; octets: number }) => (
        <MonoValue>{formatBytes(row.octets)}</MonoValue>
      ),
    },
    {
      key: "connections",
      header: "Connections",
      render: (row: { username: string; connections: number; octets: number }) => (
        <MonoValue>{row.connections}</MonoValue>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* Routing split */}
      <div className="rounded-xs bg-bg-card p-4 flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <FieldLabel>Total: {total.toLocaleString()}</FieldLabel>
          <FieldLabel>Active Users: {connections.activeUsers.toLocaleString()}</FieldLabel>
        </div>
        <ProgressBar
          value={mePct}
          label={`ME: ${connections.currentMe.toLocaleString()} (${mePct}%)`}
          size="sm"
        />
        <ProgressBar
          value={directPct}
          label={`Direct: ${connections.currentDirect.toLocaleString()} (${directPct}%)`}
          size="sm"
        />
        {connections.staleCacheUsed && (
          <Badge variant="warn">⚠ Stale cache in use</Badge>
        )}
      </div>

      {/* Top by connections */}
      {connections.topByConnections.length > 0 && (
        <div>
          <SectionHeader title="Top by Connections" />
          <DataTable
            columns={byConnColumns}
            data={connections.topByConnections}
            keyExtractor={(row) => row.username}
          />
        </div>
      )}

      {/* Top by throughput */}
      {connections.topByThroughput.length > 0 && (
        <div>
          <SectionHeader title="Top by Throughput" />
          <DataTable
            columns={byThroughputColumns}
            data={connections.topByThroughput}
            keyExtractor={(row) => row.username}
          />
        </div>
      )}

      {/* Lifetime stats */}
      <div className="rounded-xs bg-bg-card p-4 flex flex-col gap-2">
        <FieldLabel>Lifetime Stats</FieldLabel>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <span className="text-fg-muted">Total connections</span>
          <MonoValue>{summary.connectionsTotal.toLocaleString()}</MonoValue>
          <span className="text-fg-muted">Bad connections</span>
          <span className="font-mono text-xs text-fg">
            {summary.connectionsBadTotal.toLocaleString()}
            {summary.connectionsTotal > 0 && (
              <span className="text-fg-muted ml-1">
                ({((summary.connectionsBadTotal / summary.connectionsTotal) * 100).toFixed(1)}%)
              </span>
            )}
          </span>
          <span className="text-fg-muted">Handshake timeouts</span>
          <MonoValue>{summary.handshakeTimeoutsTotal.toLocaleString()}</MonoValue>
          <span className="text-fg-muted">Configured users</span>
          <MonoValue>{summary.configuredUsers.toLocaleString()}</MonoValue>
        </div>
      </div>
    </div>
  );
}

function MePoolTab({ server }: { server: ServerDetailPageProps["server"] }) {
  const { mePool } = server;

  if (!mePool || !mePool.enabled) {
    return (
      <div className="py-8 text-center text-fg-muted text-sm">
        ME Pool is not available on this server.
      </div>
    );
  }

  const writerColumns = [
    {
      key: "writerId",
      header: "Writer ID",
      render: (row: ServerMeWriterData) => (
        <MonoValue>{row.writerId}</MonoValue>
      ),
    },
    {
      key: "dc",
      header: "DC",
      render: (row: ServerMeWriterData) => (
        <MonoValue>{row.dc != null ? `DC${row.dc}` : "—"}</MonoValue>
      ),
    },
    {
      key: "endpoint",
      header: "Endpoint",
      render: (row: ServerMeWriterData) => (
        <MonoValue className="truncate">{row.endpoint}</MonoValue>
      ),
    },
    {
      key: "state",
      header: "State",
      render: (row: ServerMeWriterData) => (
        <Badge variant={row.degraded ? "warn" : row.state === "active" ? "ok" : "default"}>
          {row.state}
          {row.degraded && " ⚠"}
        </Badge>
      ),
    },
    {
      key: "rtt",
      header: "RTT",
      render: (row: ServerMeWriterData) => (
        <MonoValue>
          {row.rttEmaMs != null ? `${row.rttEmaMs}ms` : "—"}
        </MonoValue>
      ),
    },
    {
      key: "clients",
      header: "Clients",
      render: (row: ServerMeWriterData) => (
        <MonoValue>{row.boundClients}</MonoValue>
      ),
    },
    {
      key: "idle",
      header: "Idle",
      render: (row: ServerMeWriterData) => (
        <MonoValue>
          {row.idleForSecs != null ? `${row.idleForSecs}s` : "—"}
        </MonoValue>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* ME Writers Summary — 9-field 3×3 grid */}
      <div>
        <SectionHeader title="ME Writers Summary" />
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Alive Writers", value: mePool.summary.aliveWriters },
            { label: "Available Endpoints", value: mePool.summary.availableEndpoints },
            { label: "Available %", value: `${mePool.summary.availablePct}%` },
            { label: "Configured DC Groups", value: mePool.summary.configuredDcGroups },
            { label: "Configured Endpoints", value: mePool.summary.configuredEndpoints },
            { label: "Coverage %", value: `${mePool.summary.coveragePct}%`, color: coverageColor(mePool.summary.coveragePct) },
            { label: "Fresh Alive Writers", value: mePool.summary.freshAliveWriters },
            { label: "Fresh Coverage %", value: `${mePool.summary.freshCoveragePct}%`, color: coverageColor(mePool.summary.freshCoveragePct) },
            { label: "Required Writers", value: mePool.summary.requiredWriters },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xs bg-bg-card p-3 flex flex-col gap-0.5">
              <span className={`text-lg font-mono font-semibold leading-none ${color ?? "text-fg"}`}>{value}</span>
              <FieldLabel>{label}</FieldLabel>
            </div>
          ))}
        </div>
      </div>

      {/* Three side-by-side cards: Generations / Contour / Writers Health */}
      <div className="grid grid-cols-3 gap-2">
        {/* Generations */}
        <div className="rounded-xs bg-bg-card p-3 flex flex-col gap-2">
          <FieldLabel>Generations</FieldLabel>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-fg-muted">Active</span>
              <span className="font-mono text-fg">{mePool.generations.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Warm</span>
              <span className="font-mono text-fg">{mePool.generations.warm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Pending Hardswap</span>
              <span className="font-mono text-fg">
                {mePool.generations.pendingHardswap > 0
                  ? <Badge variant="warn">{mePool.generations.pendingHardswap}</Badge>
                  : mePool.generations.pendingHardswap}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Hardswap</span>
              <Badge variant={mePool.hardswap.enabled ? "ok" : "default"}>
                {mePool.hardswap.enabled ? "ON" : "OFF"}
              </Badge>
            </div>
            {mePool.generations.drainingGenerations.length > 0 && (
              <div className="flex justify-between">
                <span className="text-fg-muted">Draining</span>
                <span className="font-mono text-xs text-fg">
                  [{mePool.generations.drainingGenerations.join(", ")}]
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contour */}
        <div className="rounded-xs bg-bg-card p-3 flex flex-col gap-2">
          <FieldLabel>Contour</FieldLabel>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-fg-muted">Active</span>
              <span className="font-mono text-fg">{mePool.contour.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Warm</span>
              <span className="font-mono text-fg">{mePool.contour.warm}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Draining</span>
              <span className="font-mono text-fg">{mePool.contour.draining}</span>
            </div>
          </div>
        </div>

        {/* Writers Health */}
        <div className="rounded-xs bg-bg-card p-3 flex flex-col gap-2">
          <FieldLabel>Writers Health</FieldLabel>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-fg-muted">Healthy</span>
              <span className="font-mono text-status-ok">{mePool.writersHealth.healthy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Degraded</span>
              <span className={`font-mono ${mePool.writersHealth.degraded > 0 ? "text-status-warn" : "text-fg"}`}>
                {mePool.writersHealth.degraded}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Draining</span>
              <span className="font-mono text-fg">{mePool.writersHealth.draining}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Refill */}
      <div className="rounded-xs bg-bg-card p-4 flex flex-col gap-2">
        <FieldLabel>Refill</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-mono font-semibold text-fg leading-none">
              {mePool.refill.inflightEndpoints}
            </span>
            <FieldLabel>Inflight Endpoints</FieldLabel>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-mono font-semibold text-fg leading-none">
              {mePool.refill.inflightDcs}
            </span>
            <FieldLabel>Inflight DC</FieldLabel>
          </div>
        </div>
        {mePool.refill.byDc.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {mePool.refill.byDc.map((entry) => (
              <Badge key={`${entry.dc}-${entry.family}`} variant="default">
                DC {entry.dc} ({entry.family}): {entry.inflight}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Writers table */}
      <div>
        <SectionHeader title="Writers" />
        <DataTable
          columns={writerColumns}
          data={mePool.writersList}
          keyExtractor={(row) => String(row.writerId)}
          emptyMessage="No writers"
        />
      </div>
    </div>
  );
}

function UpstreamsTab({ server }: { server: ServerDetailPageProps["server"] }) {
  const { upstreams, upstreamSummary, upstreamZeroCounters } = server;
  const [showZeroCounters, setShowZeroCounters] = useState(false);

  const columns = [
    {
      key: "id",
      header: "#",
      render: (row: ServerUpstreamData) => (
        <span className="font-mono text-xs text-fg-muted">{row.upstreamId}</span>
      ),
      className: "w-10",
    },
    {
      key: "routeKind",
      header: "Type",
      render: (row: ServerUpstreamData) => (
        <Badge variant="default">{row.routeKind}</Badge>
      ),
    },
    {
      key: "address",
      header: "Address",
      render: (row: ServerUpstreamData) => (
        <MonoValue>{row.address}</MonoValue>
      ),
    },
    {
      key: "healthy",
      header: "Health",
      render: (row: ServerUpstreamData) => (
        <Badge variant={row.healthy ? "ok" : "error"}>
          {row.healthy ? "✓ OK" : "✗ FAIL"}
        </Badge>
      ),
    },
    {
      key: "fails",
      header: "Fails",
      render: (row: ServerUpstreamData) => (
        <span className={`font-mono text-xs ${row.fails > 0 ? "text-status-warn" : ""}`}>
          {row.fails}
        </span>
      ),
    },
    {
      key: "latency",
      header: "Latency",
      render: (row: ServerUpstreamData) => (
        <MonoValue>
          {row.effectiveLatencyMs != null && row.effectiveLatencyMs > 0
            ? `${row.effectiveLatencyMs}ms`
            : "—"}
        </MonoValue>
      ),
    },
    {
      key: "lastCheck",
      header: "Last Check",
      render: (row: ServerUpstreamData) => (
        <span className="font-mono text-xs text-fg-muted">{row.lastCheckAgeSecs}s ago</span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 pt-2">
      {/* Summary badges */}
      {upstreamSummary && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Total: {upstreamSummary.configuredTotal}</Badge>
          <Badge variant="ok">✓ Healthy: {upstreamSummary.healthyTotal}</Badge>
          {upstreamSummary.unhealthyTotal > 0 && (
            <Badge variant="error">✗ Unhealthy: {upstreamSummary.unhealthyTotal}</Badge>
          )}
          {upstreamSummary.directTotal > 0 && (
            <Badge variant="default">Direct: {upstreamSummary.directTotal}</Badge>
          )}
          {upstreamSummary.socks5Total > 0 && (
            <Badge variant="default">SOCKS5: {upstreamSummary.socks5Total}</Badge>
          )}
        </div>
      )}

      <DataTable
        columns={columns}
        data={upstreams}
        keyExtractor={(row) => String(row.upstreamId)}
        emptyMessage="No upstreams configured"
      />

      {/* Connect Statistics (collapsible) */}
      {upstreamZeroCounters && (
        <div className="rounded-xs bg-bg-card overflow-hidden">
          <button
            onClick={() => setShowZeroCounters((v) => !v)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-bg-card-hover transition-colors"
          >
            <FieldLabel>Connect Statistics</FieldLabel>
            <span className="text-fg-muted text-xs select-none">{showZeroCounters ? "▾" : "›"}</span>
          </button>
          {showZeroCounters && (
            <div className="px-4 pb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: "Attempt Total", value: upstreamZeroCounters.connectAttemptTotal },
                { label: "Success Total", value: upstreamZeroCounters.connectSuccessTotal },
                { label: "Fail Total", value: upstreamZeroCounters.connectFailTotal },
                { label: "Failfast Hard Error", value: upstreamZeroCounters.connectFailfastHardErrorTotal },
                { label: "Success ≤100ms", value: upstreamZeroCounters.connectDurationSuccessBucketLe100ms },
                { label: "Success 101–500ms", value: upstreamZeroCounters.connectDurationSuccessBucket101_500ms },
                { label: "Success 501–1000ms", value: upstreamZeroCounters.connectDurationSuccessBucket501_1000ms },
                { label: "Success >1000ms", value: upstreamZeroCounters.connectDurationSuccessBucketGt1000ms },
                { label: "Fail ≤100ms", value: upstreamZeroCounters.connectDurationFailBucketLe100ms },
                { label: "Fail 101–500ms", value: upstreamZeroCounters.connectDurationFailBucket101_500ms },
                { label: "Fail 501–1000ms", value: upstreamZeroCounters.connectDurationFailBucket501_1000ms },
                { label: "Fail >1000ms", value: upstreamZeroCounters.connectDurationFailBucketGt1000ms },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xs bg-bg-hover p-2 flex flex-col gap-0.5">
                  <span className="text-base font-mono font-semibold text-fg leading-none">{value.toLocaleString()}</span>
                  <span className="text-[10px] text-fg-muted uppercase tracking-wider leading-none">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DiagnosticsTab({ server }: { server: ServerDetailPageProps["server"] }) {
  const { selftest, meQuality, natStun, systemInfo, networkPath } = server;

  const stateIcon = (state: string) => {
    if (state === "ok" || state === "good" || state === "one") return "✓";
    return "✗";
  };
  const stateVariant = (state: string): "ok" | "error" => {
    if (state === "ok" || state === "good" || state === "one") return "ok";
    return "error";
  };

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* Self-test checklist */}
      {selftest?.enabled && (
        <div className="rounded-xs bg-bg-card p-4 flex flex-col gap-3">
          <FieldLabel>Self-Test</FieldLabel>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-fg-muted">KDF</span>
              <div className="flex items-center gap-2">
                <Badge variant={stateVariant(selftest.kdf.state)}>
                  {stateIcon(selftest.kdf.state)} {selftest.kdf.state}
                </Badge>
                <span className="text-xs text-fg-muted font-mono">
                  {selftest.kdf.ewmaErrorsPerMin.toFixed(1)} err/min
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-fg-muted">Time Skew</span>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <Badge variant={stateVariant(selftest.timeskew.state)}>
                  {stateIcon(selftest.timeskew.state)} {selftest.timeskew.state}
                </Badge>
                {selftest.timeskew.maxSkewSecs15m != null && (
                  <span className="text-xs text-fg-muted font-mono">
                    max {selftest.timeskew.maxSkewSecs15m}s in 15m
                  </span>
                )}
                {selftest.timeskew.samples15m != null && (
                  <span className="text-xs text-fg-muted font-mono">
                    samples: {selftest.timeskew.samples15m}
                  </span>
                )}
                {selftest.timeskew.lastSkewSecs != null && (
                  <span className="text-xs text-fg-muted font-mono">
                    last: {selftest.timeskew.lastSkewSecs}s
                  </span>
                )}
                {selftest.timeskew.lastSource && (
                  <span className="text-xs text-fg-muted font-mono">
                    src: {selftest.timeskew.lastSource}
                  </span>
                )}
              </div>
            </div>
            {selftest.ip.v4 && (
              <div className="flex items-center justify-between">
                <span className="text-fg-muted">IP v4</span>
                <div className="flex items-center gap-2">
                  <Badge variant={stateVariant(selftest.ip.v4.state)}>
                    {stateIcon(selftest.ip.v4.state)} {selftest.ip.v4.state}
                  </Badge>
                  <span className="text-xs font-mono text-fg">{selftest.ip.v4.addr}</span>
                </div>
              </div>
            )}
            {selftest.ip.v6 && (
              <div className="flex items-center justify-between">
                <span className="text-fg-muted">IP v6</span>
                <div className="flex items-center gap-2">
                  <Badge variant={stateVariant(selftest.ip.v6.state)}>
                    {stateIcon(selftest.ip.v6.state)} {selftest.ip.v6.state}
                  </Badge>
                  <span className="text-xs font-mono text-fg">{selftest.ip.v6.addr}</span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-fg-muted">PID</span>
              <div className="flex items-center gap-2">
                <Badge variant={stateVariant(selftest.pid.state)}>
                  {stateIcon(selftest.pid.state)} {selftest.pid.state}
                </Badge>
                <span className="text-xs font-mono text-fg-muted">PID: {selftest.pid.pid}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-fg-muted">BND addr</span>
              <div className="flex items-center gap-2">
                <Badge variant={stateVariant(selftest.bnd.addrState)}>
                  {stateIcon(selftest.bnd.addrState)} {selftest.bnd.addrState}
                </Badge>
                {selftest.bnd.lastAddr && (
                  <span className="text-xs font-mono text-fg-muted">{selftest.bnd.lastAddr}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ME Quality counters */}
      {meQuality?.enabled && (
        <div className="rounded-xs bg-bg-card p-4 flex flex-col gap-2">
          <FieldLabel>ME Quality</FieldLabel>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <span className="text-fg-muted">KDF Drift</span>
            <MonoValue>{meQuality.counters.kdfDriftTotal}</MonoValue>
            <span className="text-fg-muted">KDF Port-only Drift</span>
            <MonoValue>{meQuality.counters.kdfPortOnlyDriftTotal}</MonoValue>
            <span className="text-fg-muted">Route Drops: no_conn</span>
            <span className={`font-mono ${meQuality.counters.routeDropNoConn > 0 ? "text-status-warn" : "text-fg"}`}>
              {meQuality.counters.routeDropNoConn}
            </span>
            <span className="text-fg-muted">Route Drops: channel_closed</span>
            <MonoValue>{meQuality.counters.routeDropChannelClosed}</MonoValue>
            <span className="text-fg-muted">Route Drops: queue_full</span>
            <MonoValue>{meQuality.counters.routeDropQueueFull}</MonoValue>
            <span className="text-fg-muted">Reconnect attempts</span>
            <MonoValue>{meQuality.counters.reconnectAttemptTotal}</MonoValue>
            <span className="text-fg-muted">Reconnect success</span>
            <span className="font-mono text-xs text-fg">
              {meQuality.counters.reconnectSuccessTotal}
              {meQuality.counters.reconnectAttemptTotal > 0 && (
                <span className="text-fg-muted ml-1">
                  ({((meQuality.counters.reconnectSuccessTotal / meQuality.counters.reconnectAttemptTotal) * 100).toFixed(1)}%)
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* NAT / STUN */}
      {natStun?.enabled && (
        <div className="rounded-xs bg-bg-card p-4 flex flex-col gap-2">
          <FieldLabel>NAT / STUN</FieldLabel>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <span className="text-fg-muted">NAT Probe</span>
            <Badge variant={natStun.natProbeEnabled ? "ok" : "default"}>
              {natStun.natProbeEnabled ? "Enabled" : "Disabled"}
            </Badge>
            <span className="text-fg-muted">Live STUNs</span>
            <MonoValue>
              {natStun.liveStunTotal}/{natStun.configuredStunTotal}
            </MonoValue>
            <span className="text-fg-muted">Public v4</span>
            <MonoValue>
              {natStun.reflectionV4
                ? `${natStun.reflectionV4.addr} (${Math.round(natStun.reflectionV4.ageSecs / 60)}min ago)`
                : "—"}
            </MonoValue>
            <span className="text-fg-muted">Public v6</span>
            <MonoValue>
              {natStun.reflectionV6
                ? `${natStun.reflectionV6.addr} (${Math.round(natStun.reflectionV6.ageSecs / 60)}min ago)`
                : "—"}
            </MonoValue>
          </div>
          {natStun.configuredServers.length > 0 && (
            <div className="flex flex-col gap-1 mt-1">
              <FieldLabel>Configured Servers</FieldLabel>
              <div className="flex flex-wrap gap-1">
                {natStun.configuredServers.map((addr) => (
                  <Badge key={addr} variant="default">
                    <MonoValue>{addr}</MonoValue>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Network Path */}
      {networkPath && networkPath.length > 0 && (
        <div className="flex flex-col gap-2">
          <SectionHeader title="Network Path" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {networkPath.map((entry) => (
              <div key={entry.dc} className="rounded-xs bg-bg-card p-3 flex flex-col gap-1">
                <span className="text-sm font-semibold text-fg">DC {entry.dc}</span>
                {entry.ipPreference && (
                  <span className="text-xs text-fg-muted font-mono">ip preference: {entry.ipPreference}</span>
                )}
                {entry.selectedAddrV4 && (
                  <span className="text-xs font-mono text-fg">v4: {entry.selectedAddrV4}</span>
                )}
                {entry.selectedAddrV6 && (
                  <span className="text-xs font-mono text-fg">v6: {entry.selectedAddrV6}</span>
                )}
                {!entry.selectedAddrV4 && !entry.selectedAddrV6 && (
                  <span className="text-xs text-fg-muted">No addresses</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Info */}
      <div className="rounded-xs bg-bg-card p-4 flex flex-col gap-2">
        <FieldLabel>System Info</FieldLabel>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <span className="text-fg-muted">Version</span>
          <MonoValue>{systemInfo.version}</MonoValue>
          <span className="text-fg-muted">Arch / OS</span>
          <MonoValue>{systemInfo.targetArch} / {systemInfo.targetOs}</MonoValue>
          <span className="text-fg-muted">Build</span>
          <MonoValue>{systemInfo.buildProfile}</MonoValue>
          {systemInfo.gitCommit && (
            <>
              <span className="text-fg-muted">Git commit</span>
              <MonoValue>{systemInfo.gitCommit.slice(0, 8)}</MonoValue>
            </>
          )}
          {systemInfo.buildTimeUtc && (
            <>
              <span className="text-fg-muted">Build time</span>
              <MonoValue>{systemInfo.buildTimeUtc}</MonoValue>
            </>
          )}
          <span className="text-fg-muted">Config path</span>
          <MonoValue className="truncate">{systemInfo.configPath}</MonoValue>
          <span className="text-fg-muted">Config reloads</span>
          <span className="font-mono text-xs text-fg">
            {systemInfo.configReloadCount}
            {systemInfo.lastConfigReloadEpochSecs && (
              <span className="text-fg-muted ml-1">
                (last: {formatTime(systemInfo.lastConfigReloadEpochSecs)})
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function EventsTab({
  server,
}: {
  server: ServerDetailPageProps["server"];
}) {
  const { events, eventsDroppedTotal } = server;

  const eventColumns = [
    {
      key: "time",
      header: "Time",
      render: (row: ServerEventData) => (
        <span className="font-mono text-xs text-fg-muted">{formatTime(row.tsEpochSecs)}</span>
      ),
      className: "w-24",
    },
    {
      key: "type",
      header: "Type",
      render: (row: ServerEventData) => (
        <Badge variant="default">{row.eventType}</Badge>
      ),
    },
    {
      key: "context",
      header: "Context",
      render: (row: ServerEventData) => (
        <span className="text-xs text-fg">{row.context}</span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 pt-2">
      {eventsDroppedTotal > 0 && (
        <Badge variant="warn">⚠ {eventsDroppedTotal} events dropped</Badge>
      )}

      <DataTable
        columns={eventColumns}
        data={events}
        keyExtractor={(row) => String(row.seq)}
        emptyMessage="No events"
      />
    </div>
  );
}

// ─── DC DataTable (desktop) ───────────────────────────────────────────────────

function DcTable({ dcs }: { dcs: ServerDcData[] }) {
  const [expandedDc, setExpandedDc] = useState<number | null>(null);

  return (
    <div className="rounded-xs border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-card">
            <th className="w-8 px-2 py-2" />
            <th className="px-3 py-2 text-left"><FieldLabel>DC</FieldLabel></th>
            <th className="px-3 py-2 text-left"><FieldLabel>Available%</FieldLabel></th>
            <th className="px-3 py-2 text-left"><FieldLabel>Writers</FieldLabel></th>
            <th className="px-3 py-2 text-left"><FieldLabel>Coverage%</FieldLabel></th>
            <th className="px-3 py-2 text-left"><FieldLabel>Fresh%</FieldLabel></th>
            <th className="px-3 py-2 text-left"><FieldLabel>RTT</FieldLabel></th>
            <th className="px-3 py-2 text-left"><FieldLabel>Load</FieldLabel></th>
          </tr>
        </thead>
        <tbody>
          {dcs.length === 0 && (
            <tr>
              <td colSpan={9} className="px-3 py-6 text-center text-fg-muted text-sm">No DC data</td>
            </tr>
          )}
          {dcs.map((row) => (
            <>
              <tr
                key={row.dc}
                className="border-b border-border hover:bg-bg-hover cursor-pointer"
                onClick={() => setExpandedDc(expandedDc === row.dc ? null : row.dc)}
              >
                <td className="px-2 py-2 text-center text-fg-muted text-xs select-none">
                  {expandedDc === row.dc ? "▾" : "›"}
                </td>
                <td className="px-3 py-2">
                  <span className="font-mono text-xs font-semibold">DC{row.dc}</span>
                </td>
                <td className="px-3 py-2">
                  <MonoValue className={row.availablePct < 100 ? "text-status-warn" : undefined}>
                    {row.availablePct}%
                  </MonoValue>
                </td>
                <td className="px-3 py-2">
                  <MonoValue>{row.aliveWriters}/{row.requiredWriters}</MonoValue>
                </td>
                <td className="px-3 py-2">
                  <MonoValue className={`font-semibold ${coverageColor(row.coveragePct)}`}>
                    {row.coveragePct}%
                  </MonoValue>
                </td>
                <td className="px-3 py-2">
                  <MonoValue className="text-fg-muted">
                    {row.freshAlivePct != null ? `${row.freshAlivePct}%` : "—"}
                  </MonoValue>
                </td>
                <td className="px-3 py-2">
                  <MonoValue className={(row.rttMs ?? 0) > 300 ? "text-status-error" : (row.rttMs ?? 0) > 100 ? "text-status-warn" : undefined}>
                    {row.rttMs != null ? `${row.rttMs}ms` : "—"}
                  </MonoValue>
                </td>
                <td className="px-3 py-2">
                  <MonoValue>{row.load}</MonoValue>
                </td>
              </tr>
              {expandedDc === row.dc && (
                <tr key={`${row.dc}-expanded`} className="border-b border-border bg-bg">
                  <td />
                  <td colSpan={7} className="px-4 py-4">
                    <div className="flex flex-col gap-4">
                      {/* Floor info */}
                      <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-fg-muted uppercase tracking-wider">Floor policy</span>
                          <span className="font-mono text-fg">
                            min: {row.floorMin} · target: {row.floorTarget} · max: {row.floorMax}
                            {row.floorCapped && <span className="text-status-warn ml-2">⚠ capped</span>}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-fg-muted uppercase tracking-wider">Endpoints</span>
                          <MonoValue>{row.availableEndpoints}/{row.endpoints.length} available</MonoValue>
                        </div>
                      </div>
                      {/* Endpoint writers */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-fg-muted uppercase tracking-wider font-medium">Endpoint Writers</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                          {row.endpointWriters.length === 0 ? (
                            <span className="text-xs text-fg-muted">No endpoint data</span>
                          ) : (
                            row.endpointWriters.map((ew) => (
                              <div key={ew.endpoint} className="flex items-center justify-between gap-3 px-3 py-1.5 rounded-xs bg-bg-card border border-border">
                                <MonoValue className="truncate">{ew.endpoint}</MonoValue>
                                <span className={`font-mono text-xs shrink-0 ${ew.activeWriters === 0 ? "text-status-warn" : "text-fg-muted"}`}>
                                  {ew.activeWriters} {ew.activeWriters === 1 ? "writer" : "writers"}
                                  {ew.activeWriters === 0 && " ⚠"}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function ServerDetailPage({ server, onBack, onReload }: ServerDetailPageProps) {
  const { systemInfo, gates, connections, summary, dcs } = server;

  // DC sort: problematic (low coverage) first
  const sortedDcs = [...dcs].sort((a, b) => a.coveragePct - b.coveragePct);

  // Mobile DC sheet state
  const [selectedDc, setSelectedDc] = useState<ServerDcData | null>(null);

  // KPI gauge items
  const minCoverage = sortedDcs.length > 0 ? Math.min(...sortedDcs.map((d) => d.coveragePct)) : 100;
  const badRate =
    summary.connectionsTotal > 0
      ? ((summary.connectionsBadTotal / summary.connectionsTotal) * 100).toFixed(1)
      : "0.0";

  const gaugeItems = [
    {
      value: connections.current.toLocaleString(),
      label: "Connections",
    },
    {
      value: connections.activeUsers.toLocaleString(),
      label: "Active Users",
    },
    {
      value: badRate,
      unit: "%",
      label: "Bad Rate",
    },
    {
      value: String(minCoverage),
      unit: "%",
      label: "Coverage",
    },
  ];

  // DC strip items (mobile) — sorted
  const dcItems = sortedDcs.map((dc) => ({
    code: `DC${dc.dc}`,
    city: `DC ${dc.dc}`,
    latency: dc.rttMs ?? 0,
    load: dc.load,
    status:
      dc.coveragePct < 70
        ? ("error" as const)
        : dc.coveragePct < 100
        ? ("warn" as const)
        : ("ok" as const),
  }));

  // Alerts — crit for <70%, warn for <100%, degraded flag first
  const alertItems: { severity: "crit" | "warn"; message: string; source: string }[] = [];
  sortedDcs
    .filter((dc) => dc.coveragePct < 100)
    .forEach((dc) => {
      alertItems.push({
        severity: dc.coveragePct < 70 ? ("crit" as const) : ("warn" as const),
        message: `DC${dc.dc} coverage at ${dc.coveragePct}% (${dc.aliveWriters}/${dc.requiredWriters} writers)`,
        source: "dc-coverage",
      });
    });
  if (gates.degraded) {
    alertItems.unshift({ severity: "crit" as const, message: "Server operating in degraded mode", source: "gates" });
  }

  const hasAlerts = alertItems.length > 0;

  // Subtitle
  const subtitle = `${systemInfo.version} · ${formatUptime(systemInfo.uptimeSeconds)} · ${server.ip ?? ""}`.replace(/ · $/, "");

  // Tab content
  const connectionsContent = <ConnectionsTab server={server} />;
  const mePoolContent = <MePoolTab server={server} />;
  const upstreamsContent = <UpstreamsTab server={server} />;
  const diagnosticsContent = <DiagnosticsTab server={server} />;
  const eventsContent = <EventsTab server={server} />;

  const mobileTabs = [
    { id: "connections", label: "Connections", content: connectionsContent },
    { id: "me-pool", label: "ME Pool", content: mePoolContent },
    { id: "upstreams", label: "Upstreams", content: upstreamsContent },
    { id: "diagnostics", label: "Diagnostics", content: diagnosticsContent },
    { id: "events", label: "Events", content: eventsContent },
  ];

  return (
    <>
      {/* Breadcrumbs */}
      <div className="px-4 md:px-8 pt-3">
        <Breadcrumbs
          items={[
            { label: "Servers", onClick: onBack },
            { label: server.name },
          ]}
        />
      </div>

      {/* Page header */}
      <PageHeader
        title={server.name}
        subtitle={subtitle}
        trailing={
          <div className="flex items-center gap-2">
            <StatusBeacon status={server.status} size="md" />
            <ActionsDropdown onReload={onReload} />
          </div>
        }
      />

      <div className="px-4 md:px-8 flex flex-col gap-6 pb-8">
        {/* Badges row */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={gates.acceptingNewConnections ? "ok" : "error"}>
            {gates.acceptingNewConnections ? "Accepting" : "Blocked"}
          </Badge>
          <Badge variant={gates.meRuntimeReady ? "ok" : "warn"}>
            {gates.meRuntimeReady ? "ME Ready" : "ME Not Ready"}
          </Badge>
          <Badge variant={gates.useMiddleProxy ? "accent" : "default"}>
            {gates.useMiddleProxy ? "Middle Proxy" : "Direct"}
          </Badge>
          {gates.me2dcFallbackEnabled && (
            <Badge variant="default">Fallback</Badge>
          )}
          {gates.rerouteActive && (
            <Badge variant="warn">Reroute Active</Badge>
          )}
          {gates.readOnly && (
            <Badge variant="warn">Read-Only</Badge>
          )}
          {gates.degraded && (
            <Badge variant="error">Degraded</Badge>
          )}
        </div>

        {/* KPI Strip */}
        <GaugeStrip items={gaugeItems} />

        {/* Alerts */}
        {hasAlerts && (
          <AlertStrip alerts={alertItems} />
        )}

        {/* Mobile: DCScrollStrip + SwipeTabView */}
        <div className="md:hidden flex flex-col gap-4">
          <div>
            <SectionHeader title="Data Centers" badge={sortedDcs.length} />
            <DCScrollStrip
              items={dcItems}
              onSelect={(code) => {
                const dcNum = parseInt(code.replace("DC", ""), 10);
                const found = sortedDcs.find((d) => d.dc === dcNum) ?? null;
                setSelectedDc(found);
              }}
            />
          </div>
          <SwipeTabView tabs={mobileTabs} />
        </div>

        {/* Desktop: DC DataTable + Tabs */}
        <div className="hidden md:flex flex-col gap-6">
          <div>
            <SectionHeader title="Data Centers" badge={sortedDcs.length} />
            <DcTable dcs={sortedDcs} />
          </div>

          <Tabs defaultValue="connections">
            <TabsList>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="me-pool">ME Pool</TabsTrigger>
              <TabsTrigger value="upstreams">Upstreams</TabsTrigger>
              <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="connections">{connectionsContent}</TabsContent>
            <TabsContent value="me-pool">{mePoolContent}</TabsContent>
            <TabsContent value="upstreams">{upstreamsContent}</TabsContent>
            <TabsContent value="diagnostics">{diagnosticsContent}</TabsContent>
            <TabsContent value="events">{eventsContent}</TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Mobile DC detail sheet */}
      <Sheet open={selectedDc !== null} onOpenChange={(open) => { if (!open) setSelectedDc(null); }}>
        <SheetContent side="bottom">
          {selectedDc && (
            <>
              <SheetHeader>
                <SheetTitle>DC{selectedDc.dc} Details</SheetTitle>
              </SheetHeader>
              <SheetBody>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <span className="text-fg-muted">Coverage</span>
                    <span className={`font-mono font-semibold ${coverageColor(selectedDc.coveragePct)}`}>
                      {selectedDc.coveragePct}%
                    </span>
                    <span className="text-fg-muted">Available</span>
                    <span className={`font-mono ${selectedDc.availablePct < 100 ? "text-status-warn" : "text-fg"}`}>
                      {selectedDc.availablePct}%
                    </span>
                    <span className="text-fg-muted">Writers</span>
                    <span className="font-mono text-fg">
                      {selectedDc.aliveWriters}/{selectedDc.requiredWriters} alive
                    </span>
                    <span className="text-fg-muted">RTT</span>
                    <span className={`font-mono ${(selectedDc.rttMs ?? 0) > 300 ? "text-status-error" : (selectedDc.rttMs ?? 0) > 100 ? "text-status-warn" : "text-fg"}`}>
                      {selectedDc.rttMs != null ? `${selectedDc.rttMs}ms` : "—"}
                    </span>
                    <span className="text-fg-muted">Load</span>
                    <span className="font-mono text-fg">{selectedDc.load}</span>
                    <span className="text-fg-muted">Floor</span>
                    <span className="font-mono text-fg">
                      {selectedDc.floorMin}..{selectedDc.floorTarget}..{selectedDc.floorMax}
                      {selectedDc.floorCapped && <span className="text-status-warn ml-1">⚠ capped</span>}
                    </span>
                  </div>

                  {selectedDc.endpointWriters.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <FieldLabel>Endpoints & Writers</FieldLabel>
                      {selectedDc.endpointWriters.map((ew) => (
                        <div key={ew.endpoint} className="flex items-center gap-2 text-sm">
                          <MonoValue>{ew.endpoint}</MonoValue>
                          <span className="text-fg-muted">→</span>
                          <MonoValue>
                            {ew.activeWriters} active writer{ew.activeWriters !== 1 ? "s" : ""}
                          </MonoValue>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
