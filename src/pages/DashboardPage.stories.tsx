import type { Meta, StoryObj } from "@storybook/react";
import { LayoutDashboard, Server, Users, Settings } from "lucide-react";
import { DashboardPage } from "./DashboardPage";
import { AppShell } from "@/layout/AppShell";

const mockNavItems = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "servers", label: "Servers", icon: <Server className="w-5 h-5" /> },
  { id: "clients", label: "Clients", icon: <Users className="w-5 h-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

const meta = {
  title: "Pages/DashboardPage",
  component: DashboardPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AppShell
        navItems={mockNavItems}
        activeId="dashboard"
        onNavigate={(id) => console.log("Navigate to:", id)}
      >
        <Story />
      </AppShell>
    ),
  ],
} satisfies Meta<typeof DashboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockData = {
  overview: {
    kpis: [
      { label: "Fleet Health", value: "98.2%", accent: true },
      { label: "Active Nodes", value: "142", sub: "of 150 total" },
      { label: "Global Traffic", value: "4.2 TB", sub: "last 24h" },
      { label: "Active Connections", value: "450k", sub: "current" },
    ],
    trends: [],
    alerts: [
      {
        severity: "crit" as const,
        message: "us-east-db-1 heartbeat lost",
        timestamp: "Just now",
        source: "us-east-db-1",
      },
      {
        severity: "warn" as const,
        message: "eu-central payload routing latency > 200ms",
        timestamp: "5m ago",
        source: "eu-central-router",
      },
      {
        severity: "warn" as const,
        message: "Node count mismatch in ap-south pool",
        timestamp: "12m ago",
        source: "ap-south",
      },
    ],
    attentionNodes: [
      {
        id: "n1",
        name: "us-east-db-1",
        status: "error" as const,
        connections: 0,
        trafficBytes: 0,
        cpuPct: 0,
        memPct: 0,
        dcs: Array.from({ length: 12 }, (_, i) => ({
          dc: i + 1,
          status: "error" as const,
          rttMs: null,
        })),
      },
      {
        id: "n2",
        name: "eu-central-router",
        status: "warn" as const,
        connections: 45000,
        trafficBytes: 2500000000,
        cpuPct: 85,
        memPct: 60,
        dcs: Array.from({ length: 12 }, (_, i) => ({
          dc: i + 1,
          status:
            i === 2 || i === 7 ? ("error" as const) : i === 4 ? ("warn" as const) : ("ok" as const),
          rttMs: i === 2 || i === 7 ? null : i === 4 ? 315 : 45 + i * 12,
        })),
      },
    ],
    healthyNodes: [
      {
        id: "n3",
        name: "us-west-edge-1",
        status: "ok" as const,
        cpuPct: 15,
        memPct: 40,
        connections: 12000,
        trafficBytes: 1.2e9,
        region: "us-west",
        dcs: [],
      },
      {
        id: "n4",
        name: "us-west-edge-2",
        status: "ok" as const,
        cpuPct: 22,
        memPct: 35,
        connections: 15500,
        trafficBytes: 2.1e9,
        region: "us-west",
        dcs: [],
      },
      {
        id: "n5",
        name: "eu-west-edge-1",
        status: "ok" as const,
        cpuPct: 18,
        memPct: 42,
        connections: 9800,
        trafficBytes: 0.8e9,
        region: "eu-west",
        dcs: [],
      },
      {
        id: "n6",
        name: "ap-south-edge-1",
        status: "ok" as const,
        cpuPct: 45,
        memPct: 55,
        connections: 25000,
        trafficBytes: 4.5e9,
        region: "ap-south",
        dcs: [],
      },
      {
        id: "n7",
        name: "ap-northeast-1",
        status: "ok" as const,
        cpuPct: 12,
        memPct: 28,
        connections: 8500,
        trafficBytes: 0.6e9,
        region: "ap-northeast",
        dcs: [],
      },
    ],
  },
  timeline: {
    events: [
      { status: "error" as const, message: "us-east-db-1 heartbeat lost", time: "Just now" },
      {
        status: "ok" as const,
        message: "Config update deployed to eu-central pool",
        time: "15m ago",
      },
      { status: "ok" as const, message: "ap-south-edge-1 finished syncing", time: "1h ago" },
      { status: "warn" as const, message: "Spike in error rate (5xx) detected", time: "2h ago" },
    ],
  },
};

export const Default: Story = {
  args: {
    ...mockData,
    onNodeClick: (id) => console.log("Node clicked:", id),
    onCreate: async (data) => { console.log("Create client:", data); await new Promise((r) => setTimeout(r, 500)); },
  },
};
