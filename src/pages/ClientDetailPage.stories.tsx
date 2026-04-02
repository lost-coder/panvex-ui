import type { Meta, StoryObj } from "@storybook/react";
import { AppShell } from "@/layout/AppShell";
import { ClientDetailPage } from "./ClientDetailPage";
import type { ClientDetailPageProps } from "@/types/pages";

const mockClient: ClientDetailPageProps["client"] = {
  id: "client-alice",
  name: "alice",
  enabled: true,
  secret: "deadbeefcafebabe1234567890abcdef",
  userAdTag: "abcd1234efgh5678abcd1234efgh5678",
  trafficUsedBytes: 1_200_000_000,
  uniqueIpsUsed: 12,
  activeTcpConns: 45,
  maxTcpConns: 100,
  maxUniqueIps: 20,
  dataQuotaBytes: 10_000_000_000,
  expirationRfc3339: "2026-12-31T00:00:00Z",
  fleetGroupIds: ["eu-west", "us-east"],
  deployments: [
    {
      agentId: "node-eu-west-1",
      desiredOperation: "upsert",
      status: "ok",
      lastError: "",
      connectionLink: "tg://proxy?server=eu-west-1.example.com&port=443&secret=deadbeefcafebabe1234567890abcdef",
      lastAppliedAtUnix: 1743600000,
    },
    {
      agentId: "node-us-east-1",
      desiredOperation: "upsert",
      status: "pending",
      lastError: "",
      connectionLink: "",
      lastAppliedAtUnix: 1743500000,
    },
    {
      agentId: "node-ap-south-1",
      desiredOperation: "upsert",
      status: "error",
      lastError: "connection refused: dial tcp 10.0.0.5:8080: connect: connection refused",
      connectionLink: "",
      lastAppliedAtUnix: 1743400000,
    },
  ],
};

const meta = {
  title: "Pages/ClientDetailPage",
  component: ClientDetailPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AppShell
        navItems={[
          { id: "servers", label: "Servers", icon: "server" },
          { id: "clients", label: "Clients", icon: "users" },
          { id: "settings", label: "Settings", icon: "settings" },
        ]}
        activeId="clients"
        onNavigate={(id) => console.log("Navigate to:", id)}
      >
        <Story />
      </AppShell>
    ),
  ],
} satisfies Meta<typeof ClientDetailPage>;

export default meta;
type Story = StoryObj<typeof ClientDetailPage>;

export const Default: Story = {
  name: "Active client with deployments",
  args: {
    client: mockClient,
    onBack: () => console.log("Back clicked"),
  },
};

export const DisabledClient: Story = {
  name: "Disabled client",
  args: {
    client: {
      ...mockClient,
      id: "client-disabled",
      name: "legacy-user",
      enabled: false,
      activeTcpConns: 0,
      uniqueIpsUsed: 0,
      trafficUsedBytes: 80_000_000,
      dataQuotaBytes: 0,
      expirationRfc3339: "",
      fleetGroupIds: [],
      userAdTag: "",
      deployments: mockClient.deployments.slice(0, 1).map((d) => ({ ...d, status: "ok" })),
    },
    onBack: () => console.log("Back clicked"),
  },
};
