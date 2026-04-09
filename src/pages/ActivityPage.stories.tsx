import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ActivityPage } from "./ActivityPage";
import { AppShell } from "@/layout/AppShell";
import { navItems } from "./__fixtures__/navItems";

const meta = {
  title: "Pages/Activity",
  component: ActivityPage,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <AppShell
        navItems={navItems}
        activeId="settings"
        onNavigate={(id) => console.log("Navigate to:", id)}
        onLogout={() => console.log("Logout clicked")}
      >
        <Story />
      </AppShell>
    ),
  ],
} satisfies Meta<typeof ActivityPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = Math.floor(Date.now() / 1000);

const mockJobs = [
  {
    id: "job-1",
    action: "client.create",
    status: "succeeded",
    actorId: "admin",
    targetCount: 3,
    createdAtUnix: now - 300,
  },
  {
    id: "job-2",
    action: "runtime.reload",
    status: "running",
    actorId: "admin",
    targetCount: 1,
    createdAtUnix: now - 120,
  },
  {
    id: "job-3",
    action: "client.delete",
    status: "failed",
    actorId: "operator1",
    targetCount: 2,
    createdAtUnix: now - 600,
  },
  {
    id: "job-4",
    action: "client.rotate_secret",
    status: "queued",
    actorId: "admin",
    targetCount: 1,
    createdAtUnix: now - 60,
  },
  {
    id: "job-5",
    action: "telemetry.refresh_diagnostics",
    status: "expired",
    actorId: "admin",
    targetCount: 1,
    createdAtUnix: now - 3600,
  },
];

const mockAudit = [
  {
    id: "a1",
    actorId: "admin",
    action: "auth.login",
    targetId: "session-abc",
    createdAtUnix: now - 60,
  },
  {
    id: "a2",
    actorId: "admin",
    action: "client.created",
    targetId: "client-1",
    createdAtUnix: now - 180,
  },
  {
    id: "a3",
    actorId: "operator1",
    action: "auth.login",
    targetId: "session-def",
    createdAtUnix: now - 300,
  },
  {
    id: "a4",
    actorId: "admin",
    action: "user.created",
    targetId: "operator1",
    createdAtUnix: now - 600,
  },
  {
    id: "a5",
    actorId: "admin",
    action: "enrollment.token_created",
    targetId: "tok-xyz",
    createdAtUnix: now - 900,
  },
  {
    id: "a6",
    actorId: "admin",
    action: "agent.enrolled",
    targetId: "agent-1",
    createdAtUnix: now - 1200,
  },
];

function InteractiveActivity() {
  const [tab, setTab] = useState("jobs");
  return (
    <ActivityPage jobs={mockJobs} auditEvents={mockAudit} activeTab={tab} onTabChange={setTab} />
  );
}

export const Default = {
  render: () => <InteractiveActivity />,
} satisfies Omit<Story, "args">;

export const EmptyJobs: Story = {
  args: {
    jobs: [],
    auditEvents: mockAudit,
    activeTab: "jobs",
    onTabChange: (tab) => console.log("Tab:", tab),
  },
};

export const EmptyAudit: Story = {
  args: {
    jobs: mockJobs,
    auditEvents: [],
    activeTab: "audit",
    onTabChange: (tab) => console.log("Tab:", tab),
  },
};
