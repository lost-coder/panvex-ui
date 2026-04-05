import type { Meta, StoryObj } from "@storybook/react";
import { Server, Users, Settings } from "lucide-react";
import { AppShell } from "@/layout/AppShell";
import { ClientsPage } from "./ClientsPage";
import type { ClientListItem } from "@/types/pages";

const makeClient = (
  id: string,
  name: string,
  overrides: Partial<ClientListItem> = {},
): ClientListItem => ({
  id,
  name,
  enabled: true,
  assignedNodesCount: 3,
  expirationRfc3339: "2026-12-31T00:00:00Z",
  trafficUsedBytes: 500_000_000,
  uniqueIpsUsed: 5,
  activeTcpConns: 0,
  dataQuotaBytes: 10_000_000_000,
  lastDeployStatus: "ok",
  ...overrides,
});

const mockClients: ClientListItem[] = [
  makeClient("1", "alice", {
    activeTcpConns: 45,
    trafficUsedBytes: 1_200_000_000,
    uniqueIpsUsed: 12,
    lastDeployStatus: "ok",
  }),
  makeClient("2", "bob", {
    enabled: false,
    activeTcpConns: 0,
    trafficUsedBytes: 50_000_000,
    uniqueIpsUsed: 2,
    lastDeployStatus: "error",
  }),
  makeClient("3", "carol", {
    activeTcpConns: 8,
    trafficUsedBytes: 300_000_000,
    uniqueIpsUsed: 8,
    dataQuotaBytes: 0,
    lastDeployStatus: "ok",
    expirationRfc3339: "",
  }),
  makeClient("4", "dave", {
    enabled: true,
    activeTcpConns: 0,
    trafficUsedBytes: 900_000_000,
    uniqueIpsUsed: 3,
    lastDeployStatus: "pending",
    expirationRfc3339: "2026-03-01T00:00:00Z",
  }),
  makeClient("5", "eve", {
    enabled: false,
    activeTcpConns: 0,
    trafficUsedBytes: 12_000,
    uniqueIpsUsed: 1,
    lastDeployStatus: "error",
    assignedNodesCount: 1,
  }),
  makeClient("6", "frank", {
    activeTcpConns: 120,
    trafficUsedBytes: 5_500_000_000,
    uniqueIpsUsed: 35,
    dataQuotaBytes: 0,
    lastDeployStatus: "ok",
  }),
  makeClient("7", "grace", {
    activeTcpConns: 3,
    trafficUsedBytes: 210_000_000,
    uniqueIpsUsed: 4,
    lastDeployStatus: "pending",
    assignedNodesCount: 2,
  }),
  makeClient("8", "heidi", {
    enabled: true,
    activeTcpConns: 0,
    trafficUsedBytes: 0,
    uniqueIpsUsed: 0,
    lastDeployStatus: "ok",
    expirationRfc3339: "",
  }),
];

const manyClients: ClientListItem[] = [
  ...mockClients,
  makeClient("9", "ivan", {
    activeTcpConns: 22,
    trafficUsedBytes: 700_000_000,
    lastDeployStatus: "ok",
  }),
  makeClient("10", "judy", { enabled: false, lastDeployStatus: "error" }),
  makeClient("11", "kevin", {
    activeTcpConns: 5,
    trafficUsedBytes: 100_000_000,
    lastDeployStatus: "pending",
  }),
  makeClient("12", "laura", {
    activeTcpConns: 60,
    trafficUsedBytes: 2_000_000_000,
    uniqueIpsUsed: 20,
    dataQuotaBytes: 0,
  }),
  makeClient("13", "mike", {
    enabled: false,
    lastDeployStatus: "ok",
    expirationRfc3339: "2025-01-01T00:00:00Z",
  }),
  makeClient("14", "nancy", {
    activeTcpConns: 11,
    trafficUsedBytes: 450_000_000,
    lastDeployStatus: "ok",
  }),
  makeClient("15", "oscar", {
    activeTcpConns: 0,
    trafficUsedBytes: 80_000_000,
    lastDeployStatus: "pending",
    assignedNodesCount: 5,
  }),
];

const meta = {
  title: "Pages/ClientsPage",
  component: ClientsPage,
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
        activeId="clients"
        onNavigate={(id) => console.log("Navigate to:", id)}
      >
        <Story />
      </AppShell>
    ),
  ],
} satisfies Meta<typeof ClientsPage>;

export default meta;
type Story = StoryObj<typeof ClientsPage>;

export const Default: Story = {
  name: "Few clients — cards view",
  args: {
    clients: mockClients.slice(0, 5),
    autoThreshold: 6,
    onClientClick: (id) => console.log("Client clicked:", id),
    onCreate: async (data) => { console.log("Create client:", data); await new Promise((r) => setTimeout(r, 500)); },
  },
};

export const ManyClients: Story = {
  name: "Many clients — list view",
  args: {
    clients: manyClients,
    autoThreshold: 6,
    onClientClick: (id) => console.log("Client clicked:", id),
    onCreate: async (data) => { console.log("Create client:", data); await new Promise((r) => setTimeout(r, 500)); },
  },
};
