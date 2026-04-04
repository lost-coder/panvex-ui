import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Server, Users, Settings } from "lucide-react";
import { ServersPage } from "./ServersPage";
import { AppShell } from "@/layout/AppShell";
import type { ViewMode } from "@/types/pages";

const meta = {
  title: "Pages/ServersPage",
  component: ServersPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AppShell
        navItems={[
          { id: "servers", label: "Servers", icon: <Server className="w-5 h-5" /> },
          { id: "clients", label: "Clients", icon: <Users className="w-5 h-5" /> },
          { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
        ]}
        activeId="servers"
        onNavigate={(id) => console.log("Navigate to:", id)}
      >
        <Story />
      </AppShell>
    ),
  ],
} satisfies Meta<typeof ServersPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const MOCK_SERVERS_FEW = [
  {
    id: "srv-01",
    name: "us-east-edge-01",
    status: "ok" as const,
    fleetGroupId: "us",
    connections: 12450,
    usersOnline: 12450,
    usersTotal: 25000,
    trafficBytes: 1024 * 1024 * 1024 * 4.2, // 4.2 GB
    cpuPct: 45,
    memPct: 62,
    dcCoveragePct: 100,
    uptimeSeconds: 86400 * 12,
    dcs: Array.from({ length: 12 }, (_, i) => ({
      dc: i + 1,
      status: "ok" as const,
      rttMs: 45 + i * 12,
    })),
  },
  {
    id: "srv-02",
    name: "eu-west-edge-01",
    status: "ok" as const,
    fleetGroupId: "eu",
    connections: 8200,
    usersOnline: 8200,
    usersTotal: 15400,
    trafficBytes: 1024 * 1024 * 1024 * 2.1,
    cpuPct: 28,
    memPct: 41,
    dcCoveragePct: 100,
    uptimeSeconds: 86400 * 45,
    dcs: Array.from({ length: 12 }, (_, i) => ({
      dc: i + 1,
      status: "ok" as const,
      rttMs: 30 + i * 10,
    })),
  },
  {
    id: "srv-03",
    name: "ap-south-edge-01",
    status: "warn" as const,
    fleetGroupId: "ap",
    connections: 18900,
    usersOnline: 18900,
    usersTotal: 34200,
    trafficBytes: 1024 * 1024 * 1024 * 8.5,
    cpuPct: 88,
    memPct: 91,
    dcCoveragePct: 83,
    uptimeSeconds: 86400 * 2,
    dcs: Array.from({ length: 12 }, (_, i) => ({
      dc: i + 1,
      status: i === 2 ? ("error" as const) : ("ok" as const),
      rttMs: i === 2 ? null : 50 + i * 5,
    })),
  },
];

const MOCK_SERVERS_MANY = Array.from({ length: 25 }, (_, i) => {
  const status =
    Math.random() > 0.8
      ? ("warn" as const)
      : Math.random() > 0.9
        ? ("error" as const)
        : ("ok" as const);
  const usersOnline = Math.floor(Math.random() * 20000);
  const groups = ["us", "eu", "ap"];
  return {
    id: `srv-${i}`,
    name: `edge-node-${i.toString().padStart(3, "0")}`,
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    status,
    fleetGroupId: groups[Math.floor(Math.random() * groups.length)],
    connections: usersOnline,
    usersOnline,
    usersTotal: usersOnline + Math.floor(Math.random() * 15000),
    trafficBytes: Math.floor(Math.random() * 1024 * 1024 * 1024 * 10),
    cpuPct: Math.floor(Math.random() * 100),
    memPct: Math.floor(Math.random() * 100),
    dcCoveragePct: status === "error" ? 83 : 100,
    uptimeSeconds: 86400 * Math.floor(Math.random() * 60),
    dcs: Array.from({ length: 12 }, (_, j) => ({
      dc: j + 1,
      status: status === "error" && j === 1 ? ("error" as const) : ("ok" as const),
      rttMs: status === "error" && j === 1 ? null : 40 + j * 8,
    })),
  };
});

export const AutoCards: Story = {
  args: {
    servers: MOCK_SERVERS_FEW,
    autoThreshold: 12,
    onServerClick: (id) => console.log("Clicked server:", id),
    onAddServer: () => alert("Open enrollment wizard"),
    onManageTokens: () => alert("Open token list"),
  },
};

export const AutoList: Story = {
  args: {
    servers: MOCK_SERVERS_MANY,
    autoThreshold: 12,
    onServerClick: (id) => console.log("Clicked server:", id),
    onAddServer: () => alert("Open enrollment wizard"),
    onManageTokens: () => alert("Open token list"),
  },
};

export const InteractiveToggle = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  return (
    <ServersPage
      servers={MOCK_SERVERS_MANY}
      autoThreshold={12}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onServerClick={(id) => console.log("Clicked server:", id)}
    />
  );
};
