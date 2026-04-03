// src/compositions/AgentConnectionSection.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { AgentConnectionSection } from "./AgentConnectionSection";

const meta: Meta<typeof AgentConnectionSection> = {
  title: "Compositions/AgentConnectionSection",
  component: AgentConnectionSection,
};
export default meta;
type Story = StoryObj<typeof AgentConnectionSection>;

export const Online: Story = {
  args: {
    data: {
      presenceState: "online",
      lastSeenAt: "2 seconds ago",
      agentId: "agent-7",
      version: "v1.2.3",
      fleetGroup: "europe",
      certificate: { issuedAt: "Apr 3, 2026", expiresAt: "May 3, 2026", remainingDays: 30 },
    },
    onAllowReEnrollment: () => alert("Allow re-enrollment"),
    onRevokeGrant: () => {},
  },
};

export const CertExpiring: Story = {
  args: {
    data: {
      presenceState: "online",
      lastSeenAt: "5 seconds ago",
      agentId: "agent-3",
      version: "v1.2.3",
      fleetGroup: "default",
      certificate: { issuedAt: "Mar 4, 2026", expiresAt: "Apr 3, 2026", remainingDays: 1 },
    },
    onAllowReEnrollment: () => {},
    onRevokeGrant: () => {},
  },
};

export const WithRecoveryGrant: Story = {
  args: {
    data: {
      presenceState: "offline",
      lastSeenAt: "3 hours ago",
      agentId: "agent-5",
      version: "v1.1.0",
      fleetGroup: "us-east",
      certificate: { issuedAt: "Mar 1, 2026", expiresAt: "Mar 31, 2026", remainingDays: 0 },
      recoveryGrant: { status: "allowed", expiresAtUnix: Math.floor(Date.now() / 1000) + 900 },
    },
    onAllowReEnrollment: () => {},
    onRevokeGrant: () => alert("Revoke grant"),
  },
};
