import { cn } from "@/lib/utils";
import { PageHeader } from "@/layout/PageHeader";
import { ViewModeToggle } from "@/compositions/ViewModeToggle";
import { SearchFilter } from "@/compositions/SearchFilter";
import { NodeSummaryCard } from "@/components/NodeSummaryCard";
import { StatusDot } from "@/primitives/StatusDot";
import { TrafficCell } from "@/primitives/TrafficCell";
import type { ServersPageProps, ServerListItem, ViewMode } from "@/types/pages";

function ServerCardView({ servers, onServerClick }: { servers: ServerListItem[]; onServerClick?: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {servers.map((s) => (
        <div key={s.id} onClick={() => onServerClick?.(s.id)} className="cursor-pointer">
          <NodeSummaryCard
            name={s.name}
            status={s.status}
            connections={s.connections}
            trafficBytes={s.trafficBytes}
            cpuPct={s.cpuPct}
            memPct={s.memPct}
            dcs={[]}
          />
        </div>
      ))}
    </div>
  );
}

function ServerListView({ servers, onServerClick }: { servers: ServerListItem[]; onServerClick?: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-0.5">
      {servers.map((s) => (
        <button
          key={s.id}
          onClick={() => onServerClick?.(s.id)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xs bg-bg-card border border-border hover:border-accent transition-colors text-left w-full"
        >
          <StatusDot status={s.status} />
          <span className="text-sm font-medium text-fg flex-1 min-w-0 truncate">{s.name}</span>
          <span className="text-xs text-fg-muted font-mono">{s.connections} conn</span>
          <TrafficCell bytes={s.trafficBytes} />
        </button>
      ))}
    </div>
  );
}

export function ServersPage({
  servers,
  viewMode,
  autoThreshold,
  onViewModeChange,
  onServerClick,
}: ServersPageProps) {
  const effectiveMode: ViewMode = viewMode ?? (servers.length <= autoThreshold ? "cards" : "list");

  return (
    <>
      <PageHeader title="Servers" subtitle={`${servers.length} nodes`} />
      <div className="px-4 md:px-8 pb-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <SearchFilter placeholder="Filter servers..." className="flex-1 max-w-xs" />
          <ViewModeToggle mode={effectiveMode} onChange={(m) => onViewModeChange?.(m)} />
        </div>

        {effectiveMode === "cards" ? (
          <ServerCardView servers={servers} onServerClick={onServerClick} />
        ) : (
          <ServerListView servers={servers} onServerClick={onServerClick} />
        )}
      </div>
    </>
  );
}
