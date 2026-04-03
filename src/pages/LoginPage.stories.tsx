import type { Meta, StoryObj } from "@storybook/react";
import { LoginPage } from "./LoginPage";

const meta = {
  title: "Pages/LoginPage",
  component: LoginPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onLogin: async (username, password, totpCode) => {
      console.log("Login:", { username, password, totpCode });
    },
  },
};

export const WithError: Story = {
  args: {
    onLogin: async () => {},
    error: "Invalid credentials",
  },
};

export const Loading: Story = {
  args: {
    onLogin: async () => {},
    loading: true,
  },
};
