import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ServersPage } from "./ServersPage";
import { AppShell } from "@/layout/AppShell";
import { Server, Users, Settings } from "lucide-react";
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
          { id: "servers", label: "Servers", icon: <Server size={18} />, active: true },
          { id: "clients", label: "Clients", icon: <Users size={18} /> },
          { id: "settings", label: "Settings", icon: <Settings size={18} /> },
        ]}
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
    status: "healthy" as const,
    connections: 12450,
    trafficBytes: 1024 * 1024 * 1024 * 4.2, // 4.2 GB
    cpuPct: 45,
    memPct: 62,
  },
  {
    id: "srv-02",
    name: "eu-west-edge-01",
    status: "healthy" as const,
    connections: 8200,
    trafficBytes: 1024 * 1024 * 1024 * 2.1,
    cpuPct: 28,
    memPct: 41,
  },
  {
    id: "srv-03",
    name: "ap-south-edge-01",
    status: "warning" as const,
    connections: 18900,
    trafficBytes: 1024 * 1024 * 1024 * 8.5,
    cpuPct: 88,
    memPct: 91,
  },
];

const MOCK_SERVERS_MANY = Array.from({ length: 25 }, (_, i) => ({
  id: `srv-${i}`,
  name: `edge-node-${i.toString().padStart(3, "0")}`,
  status: Math.random() > 0.8 ? ("warning" as const) : ("healthy" as const),
  connections: Math.floor(Math.random() * 20000),
  trafficBytes: Math.floor(Math.random() * 1024 * 1024 * 1024 * 10),
  cpuPct: Math.floor(Math.random() * 100),
  memPct: Math.floor(Math.random() * 100),
}));

export const AutoCards: Story = {
  args: {
    servers: MOCK_SERVERS_FEW,
    autoThreshold: 12,
    onServerClick: (id) => console.log("Clicked server:", id),
  },
};

export const AutoList: Story = {
  args: {
    servers: MOCK_SERVERS_MANY,
    autoThreshold: 12,
    onServerClick: (id) => console.log("Clicked server:", id),
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
