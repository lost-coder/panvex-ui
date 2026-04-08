import type { Meta, StoryObj } from "@storybook/react";
import { TotpDisableSheet } from "./TotpDisableSheet";

const meta: Meta<typeof TotpDisableSheet> = {
  title: "Compositions/TotpDisableSheet",
  component: TotpDisableSheet,
};
export default meta;
type Story = StoryObj<typeof TotpDisableSheet>;

export const Default: Story = {
  args: {
    onDisable: async (password, code) => alert(`Disable with: ${password}, ${code}`),
    onCancel: () => alert("Cancelled"),
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: "Invalid password or TOTP code.",
  },
};
