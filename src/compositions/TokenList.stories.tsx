// src/compositions/TokenList.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { TokenList } from "./TokenList";

const meta: Meta<typeof TokenList> = {
  title: "Compositions/TokenList",
  component: TokenList,
};
export default meta;
type Story = StoryObj<typeof TokenList>;

const now = Math.floor(Date.now() / 1000);

export const Default: Story = {
  args: {
    tokens: [
      { value: "enr_a7f3b2c8d9e0f12345678", fleetGroupId: "europe", status: "active", issuedAtUnix: now - 600, expiresAtUnix: now + 3000 },
      { value: "enr_b8c4d3e9f0a12345678ab", fleetGroupId: "default", status: "consumed", issuedAtUnix: now - 7200, expiresAtUnix: now - 3600 },
      { value: "enr_c9d5e4f0a1b23456789bc", fleetGroupId: "us-east", status: "expired", issuedAtUnix: now - 90000, expiresAtUnix: now - 3600 },
      { value: "enr_d0e6f5a1b2c34567890cd", fleetGroupId: "europe", status: "revoked", issuedAtUnix: now - 86400, expiresAtUnix: now + 3600 },
    ],
    onRevoke: (v) => alert(`Revoke: ${v}`),
  },
};

export const Empty: Story = {
  args: { tokens: [], onRevoke: () => {} },
};
