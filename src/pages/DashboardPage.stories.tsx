import type { Meta, StoryObj } from "@storybook/react";
import { AppShell } from "@/layout/AppShell";
import { PageHeader } from "@/layout/PageHeader";
import { SectionHeader } from "@/layout/SectionHeader";
import { AlertStrip } from "@/compositions/AlertStrip";
import { Timeline } from "@/compositions/Timeline";
import { Badge } from "@/primitives/Badge";
import { MiniChart } from "@/primitives/MiniChart";
import { NodeSummaryCard, type NodeDcInfo } from "@/components/NodeSummaryCard";
import { navItems } from "./_shared";

const meta: Meta = {
  title: "Pages/Dashboard",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

function makeDcs(overrides?: Partial<Record<number, Partial<NodeDcInfo>>>): NodeDcInfo[] {
  return Array.from({ length: 12 }, (_, i) => {
    const base: NodeDcInfo = { dc: i + 1, status: "ok", rttMs: 10 + Math.floor(Math.random() * 18) };
    return overrides?.[i + 1] ? { ...base, ...overrides[i + 1] } : base;
  });
}

/*
  GlobalKpi: responsive
  - mobile: inline text strip (compact)
  - desktop: card grid (fills the space)
*/
function GlobalKpi() {
  const kpis = [
    { label: "Nodes", value: "3", sub: "2 ok · 1 degraded" },
    { label: "Connections", value: "4,280", sub: "3,910 active" },
    { label: "Traffic", value: "10.28 GB", sub: "cumulative" },
    { label: "SLA 30d", value: "99.97%", sub: "target 99.9%", accent: true },
  ];

  return (
    <>
      {/* Mobile: compact text line */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-mono md:hidden">
        {kpis.map((k) => (
          <span key={k.label} className="text-fg-muted">
            {k.label.toLowerCase()}{" "}
            <span className={k.accent ? "text-status-ok font-medium" : "text-fg font-medium"}>{k.value}</span>
          </span>
        ))}
      </div>

      {/* Desktop: card grid */}
      <div className="hidden md:grid grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xs bg-bg-card border border-border px-4 py-3 flex flex-col gap-0.5">
            <span className="text-[10px] text-fg-muted uppercase tracking-wider">{k.label}</span>
            <span className={`text-xl font-mono font-semibold leading-tight ${k.accent ? "text-status-ok" : "text-fg"}`}>
              {k.value}
            </span>
            <span className="text-[10px] text-fg-muted">{k.sub}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/*
  TrendRow: only on desktop — fills horizontal space without cluttering mobile
*/
function TrendRow() {
  const items = [
    { label: "Connections", data: [3800, 3900, 4100, 3950, 4200, 4280], color: "#60a5fa", current: "4,280" },
    { label: "Traffic", data: [7.2, 8.1, 8.8, 9.4, 9.9, 10.3], color: "#34d399", current: "10.3 GB" },
    { label: "Error Rate", data: [0.04, 0.02, 0.05, 0.01, 0.07, 0.03], color: "#f59e0b", current: "0.03%" },
  ];
  return (
    <div className="hidden md:grid grid-cols-3 gap-3">
      {items.map((c) => (
        <div key={c.label} className="rounded-xs bg-bg-card border border-border px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10px] text-fg-muted uppercase tracking-wider">{c.label}</span>
            <span className="text-base font-mono font-semibold text-fg">{c.current}</span>
          </div>
          <MiniChart data={c.data} color={c.color} width={100} height={28} />
        </div>
      ))}
    </div>
  );
}

export const Default: Story = {
  name: "Mixed — issues on one node",
  render: () => (
    <AppShell navItems={navItems} activeId="dashboard" brand="PVX" sidebarFooter="v0.1.0">
      <PageHeader title="Dashboard" subtitle="System overview" />
      <div className="px-4 md:px-8 flex flex-col gap-5 pb-8">

        <GlobalKpi />

        {/* Nodes — vertical on mobile, horizontal grid on desktop */}
        <div>
          <SectionHeader title="Nodes" badge={3} />
          <div className="flex flex-col md:grid md:grid-cols-3 gap-2 md:gap-3 md:items-start">
            <NodeSummaryCard
              name="node-eu-fra-01"
              status="ok"
              connections={1240}
              trafficBytes={3_200_000_000}
              cpuPct={42}
              memPct={61}
              dcs={makeDcs()}
            />
            <NodeSummaryCard
              name="node-ap-sin-02"
              status="warn"
              connections={890}
              trafficBytes={1_480_000_000}
              cpuPct={78}
              memPct={72}
              dcs={makeDcs({
                3: { status: "warn", rttMs: 89 },
                7: { status: "error", rttMs: null },
              })}
            />
            <NodeSummaryCard
              name="node-us-nyc-03"
              status="ok"
              connections={2150}
              trafficBytes={5_600_000_000}
              cpuPct={35}
              memPct={48}
              dcs={makeDcs()}
            />
          </div>
        </div>

        {/* Trends — desktop only */}
        <TrendRow />

        {/* Alerts */}
        <div>
          <SectionHeader title="Alerts" badge={2} />
          <AlertStrip alerts={[
            { severity: "crit", message: "DC7 down on node-ap-sin-02 — coverage 0%", source: "me-quality", timestamp: "12:04" },
            { severity: "warn", message: "DC3 degraded on node-ap-sin-02 — rtt 89ms", source: "me-quality", timestamp: "12:04" },
          ]} />
        </div>

        {/* Events */}
        <div>
          <SectionHeader title="Recent Events" trailing={<Badge variant="accent">live</Badge>} />
          <Timeline events={[
            { status: "error", time: "12:04", message: "DC7 lost on node-ap-sin-02" },
            { status: "warn", time: "12:04", message: "DC3 degraded on node-ap-sin-02" },
            { status: "ok", time: "11:30", message: "Runtime reload on 3 nodes" },
          ]} />
        </div>
      </div>
    </AppShell>
  ),
};

export const AllHealthy: Story = {
  name: "All Healthy",
  render: () => (
    <AppShell navItems={navItems} activeId="dashboard" brand="PVX" sidebarFooter="v0.1.0">
      <PageHeader title="Dashboard" subtitle="System overview" />
      <div className="px-4 md:px-8 flex flex-col gap-5 pb-8">

        <GlobalKpi />

        <div>
          <SectionHeader title="Nodes" badge={3} />
          <div className="flex flex-col md:grid md:grid-cols-3 gap-2 md:gap-3 md:items-start">
            <NodeSummaryCard name="node-eu-fra-01" status="ok" connections={1240} trafficBytes={3_200_000_000} cpuPct={42} memPct={61} dcs={makeDcs()} />
            <NodeSummaryCard name="node-ap-sin-02" status="ok" connections={890} trafficBytes={1_480_000_000} cpuPct={38} memPct={52} dcs={makeDcs()} />
            <NodeSummaryCard name="node-us-nyc-03" status="ok" connections={2150} trafficBytes={5_600_000_000} cpuPct={35} memPct={48} dcs={makeDcs()} />
          </div>
        </div>

        <TrendRow />

        <div>
          <SectionHeader title="Recent Events" trailing={<Badge variant="accent">live</Badge>} />
          <Timeline events={[
            { status: "ok", time: "11:30", message: "Runtime reload on 3 nodes" },
            { status: "ok", time: "10:15", message: "User alice_vpn created" },
          ]} />
        </div>
      </div>
    </AppShell>
  ),
};
