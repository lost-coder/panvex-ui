import type { Meta, StoryObj } from "@storybook/react";
import { EnrollmentTokensPage } from "./EnrollmentTokensPage";
import { AppShell } from "@/layout/AppShell";
import { navItems } from "./__fixtures__/navItems";

const meta = {
  title: "Pages/EnrollmentTokens",
  component: EnrollmentTokensPage,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <AppShell
        navItems={navItems}
        activeId="servers"
        onNavigate={(id) => console.log("Navigate to:", id)}
        onLogout={() => console.log("Logout clicked")}
      >
        <Story />
      </AppShell>
    ),
  ],
} satisfies Meta<typeof EnrollmentTokensPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const now = Math.floor(Date.now() / 1000);

const mockTokens = [
  {
    value: "tok_abc123def456ghi789jkl012mno345pq",
    fleetGroupId: "eu-west-1",
    status: "active" as const,
    issuedAtUnix: now - 3600,
    expiresAtUnix: now + 82800,
  },
  {
    value: "tok_xyz789uvw456rst123opq012nml345ab",
    fleetGroupId: "us-east-1",
    status: "consumed" as const,
    issuedAtUnix: now - 86400,
    expiresAtUnix: now - 3600,
  },
  {
    value: "tok_qrs456tuv789wxy012zab345cde678fgh",
    fleetGroupId: "ap-south-1",
    status: "expired" as const,
    issuedAtUnix: now - 172800,
    expiresAtUnix: now - 86400,
  },
  {
    value: "tok_ijk012lmn345opq678rst901uvw234xyz",
    fleetGroupId: "eu-west-1",
    status: "revoked" as const,
    issuedAtUnix: now - 259200,
    expiresAtUnix: now - 172800,
  },
];

export const Default: Story = {
  args: {
    tokens: mockTokens,
    onCreateToken: () => console.log("Create token"),
    onRevoke: (value) => console.log("Revoke:", value),
  },
};

export const Empty: Story = {
  args: {
    tokens: [],
    onCreateToken: () => console.log("Create token"),
    onRevoke: (value) => console.log("Revoke:", value),
  },
};
