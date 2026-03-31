import type { Meta, StoryObj } from "@storybook/react";
import { NodeSummaryCard, type NodeDcInfo } from "./NodeSummaryCard";

const meta: Meta<typeof NodeSummaryCard> = {
  title: "Components/NodeSummaryCard",
  component: NodeSummaryCard,
};
export default meta;
type Story = StoryObj<typeof NodeSummaryCard>;

function makeDcs(overrides?: Partial<Record<number, Partial<NodeDcInfo>>>): NodeDcInfo[] {
  return Array.from({ length: 12 }, (_, i) => {
    const base: NodeDcInfo = { dc: i + 1, status: "ok", rttMs: 10 + Math.floor(Math.random() * 20) };
    return overrides?.[i + 1] ? { ...base, ...overrides[i + 1] } : base;
  });
}

export const Healthy: Story = {
  name: "OK — collapsed by default",
  args: {
    name: "node-eu-fra-01",
    status: "ok",
    connections: 1240,
    trafficBytes: 3_200_000_000,
    cpuPct: 42,
    memPct: 61,
    dcs: makeDcs(),
  },
};

export const Degraded: Story = {
  name: "Warning — auto-expanded",
  args: {
    name: "node-ap-sin-02",
    status: "warn",
    connections: 890,
    trafficBytes: 1_480_000_000,
    cpuPct: 78,
    memPct: 72,
    dcs: makeDcs({
      3: { status: "warn", rttMs: 89 },
      7: { status: "error", rttMs: null },
    }),
  },
};

export const Critical: Story = {
  name: "Error — auto-expanded",
  args: {
    name: "node-as-tyo-05",
    status: "error",
    connections: 0,
    trafficBytes: 120_000,
    cpuPct: 95,
    memPct: 91,
    dcs: makeDcs({
      1: { status: "error", rttMs: null },
      2: { status: "error", rttMs: null },
      3: { status: "error", rttMs: null },
      7: { status: "error", rttMs: null },
    }),
  },
};

export const DashboardMix: Story = {
  name: "Dashboard — mixed state",
  render: () => (
    <div className="flex flex-col gap-2 max-w-[640px]">
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
  ),
};
