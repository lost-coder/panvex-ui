import type { Meta, StoryObj } from "@storybook/react";
import { TotpSetupSheet } from "./TotpSetupSheet";

const meta: Meta<typeof TotpSetupSheet> = {
  title: "Compositions/TotpSetupSheet",
  component: TotpSetupSheet,
};
export default meta;
type Story = StoryObj<typeof TotpSetupSheet>;

export const Default: Story = {
  args: {
    secret: "JBSWY3DPEHPK3PXP",
    otpauthUrl: "otpauth://totp/Panvex:admin?secret=JBSWY3DPEHPK3PXP&issuer=Panvex",
    onEnable: async (password, code) => alert(`Enable with: ${password}, ${code}`),
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
    error: "Invalid TOTP code. Please try again.",
  },
};
