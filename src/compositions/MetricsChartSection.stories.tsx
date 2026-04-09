import type { Meta, StoryObj } from "@storybook/react";
import { MetricsChartSection, type MetricsPoint } from "./MetricsChartSection";
import { useState } from "react";

const meta: Meta<typeof MetricsChartSection> = {
  title: "Compositions/MetricsChartSection",
  component: MetricsChartSection,
};
export default meta;

function generatePoints(hours: number): MetricsPoint[] {
  const now = Date.now();
  const points: MetricsPoint[] = [];
  const intervalMs = hours <= 1 ? 60_000 : hours <= 6 ? 60_000 : 3600_000;
  const count = Math.floor((hours * 3600_000) / intervalMs);

  for (let i = 0; i < count; i++) {
    const t = new Date(now - (count - i) * intervalMs).toISOString();
    const base = Math.sin(i / 20) * 20 + 40;
    points.push({
      t,
      cpuAvg: Math.max(0, base + Math.random() * 15),
      cpuMax: Math.max(0, base + 10 + Math.random() * 20),
      memAvg: 55 + Math.random() * 10,
      memMax: 60 + Math.random() * 15,
      diskAvg: 30 + Math.random() * 5,
      diskMax: 35 + Math.random() * 5,
      connectionsAvg: Math.floor(100 + Math.sin(i / 15) * 50 + Math.random() * 20),
      connectionsMax: Math.floor(150 + Math.random() * 30),
      activeUsersAvg: Math.floor(20 + Math.random() * 10),
      activeUsersMax: Math.floor(30 + Math.random() * 10),
      dcCoverageMin: Math.max(0, 95 - Math.random() * 10 - (i % 30 === 0 ? 20 : 0)),
      load1m: 0.5 + Math.random() * 1.5,
      netUploadMbps: 5 + Math.sin(i / 10) * 3 + Math.random() * 2,
      netDownloadMbps: 15 + Math.sin(i / 8) * 8 + Math.random() * 5,
    });
  }
  return points;
}

const RANGE_HOURS: Record<string, number> = { "1h": 1, "6h": 6, "24h": 24, "7d": 168 };

function InteractiveChart() {
  const [range, setRange] = useState("6h");
  const points = generatePoints(RANGE_HOURS[range] ?? 6);
  return (
    <div className="max-w-4xl">
      <MetricsChartSection
        points={points}
        resolution={RANGE_HOURS[range] > 24 ? "hourly" : "raw"}
        timeRange={range}
        onTimeRangeChange={setRange}
      />
    </div>
  );
}

type Story = StoryObj<typeof MetricsChartSection>;

export const Default: Story = {
  render: () => <InteractiveChart />,
};

export const Empty: Story = {
  args: {
    points: [],
    resolution: "raw",
    timeRange: "24h",
  },
};
