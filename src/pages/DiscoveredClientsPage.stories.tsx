import type { Meta, StoryObj } from "@storybook/react";
import { Server, Users, Settings } from "lucide-react";
import { AppShell } from "@/layout/AppShell";
import { DiscoveredClientsPage } from "./DiscoveredClientsPage";
import type { DiscoveredClientItem } from "@/types/pages";

const now = Math.floor(Date.now() / 1000);

const makeDiscovered = (
  id: string,
  clientName: string,
  overrides: Partial<DiscoveredClientItem> = {},
): DiscoveredClientItem => ({
  id,
  agentId: "agent-000001",
  nodeName: "node-eu-1",
  clientName,
  status: "pending_review",
  totalOctets: 500_000_000,
  currentConnections: 0,
  activeUniqueIps: 3,
  links: { classic: [], secure: [], tls: [] },
  maxTcpConns: 0,
  maxUniqueIps: 0,
  dataQuotaBytes: 0,
  expiration: "",
  discoveredAtUnix: now - 3600,
  updatedAtUnix: now - 600,
  ...overrides,
});

const mockClients: DiscoveredClientItem[] = [
  makeDiscovered("d-1", "alice", {
    currentConnections: 12,
    totalOctets: 2_100_000_000,
    activeUniqueIps: 8,
  }),
  makeDiscovered("d-2", "bob", {
    currentConnections: 3,
    totalOctets: 150_000_000,
    activeUniqueIps: 2,
  }),
  makeDiscovered("d-3", "carol", {
    currentConnections: 0,
    totalOctets: 40_000_000,
    activeUniqueIps: 1,
    discoveredAtUnix: now - 86400,
  }),
  makeDiscovered("d-4", "dave", {
    status: "adopted",
    currentConnections: 25,
    totalOctets: 800_000_000,
    activeUniqueIps: 6,
    discoveredAtUnix: now - 172800,
  }),
  makeDiscovered("d-5", "eve", {
    status: "ignored",
    currentConnections: 0,
    totalOctets: 1_000,
    activeUniqueIps: 1,
    discoveredAtUnix: now - 259200,
  }),
];

const meta = {
  title: "Pages/DiscoveredClientsPage",
  component: DiscoveredClientsPage,
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
        onLogout={() => console.log("Logout clicked")}
      >
        <Story />
      </AppShell>
    ),
  ],
} satisfies Meta<typeof DiscoveredClientsPage>;

export default meta;
type Story = StoryObj<typeof DiscoveredClientsPage>;

export const Default: Story = {
  name: "Mixed statuses",
  args: {
    clients: mockClients,
    onAdopt: (id) => console.log("Adopt:", id),
    onIgnore: (id) => console.log("Ignore:", id),
    onBack: () => console.log("Back to clients"),
  },
};

export const AllPending: Story = {
  name: "All pending review",
  args: {
    clients: mockClients.filter((c) => c.status === "pending_review"),
    onAdopt: (id) => console.log("Adopt:", id),
    onIgnore: (id) => console.log("Ignore:", id),
    onBack: () => console.log("Back to clients"),
  },
};

export const Empty: Story = {
  name: "No discovered clients",
  args: {
    clients: [],
    onBack: () => console.log("Back to clients"),
  },
};

export const Busy: Story = {
  name: "Busy state (adopting/ignoring)",
  args: {
    clients: mockClients.filter((c) => c.status === "pending_review"),
    onAdopt: (id) => console.log("Adopt:", id),
    onIgnore: (id) => console.log("Ignore:", id),
    onBack: () => console.log("Back to clients"),
    busy: true,
  },
};
