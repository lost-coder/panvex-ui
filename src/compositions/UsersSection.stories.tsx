import type { Meta, StoryObj } from "@storybook/react";
import { UsersSection } from "./UsersSection";

const meta: Meta<typeof UsersSection> = {
  title: "Compositions/UsersSection",
  component: UsersSection,
};
export default meta;
type Story = StoryObj<typeof UsersSection>;

export const Default: Story = {
  args: {
    users: [
      { id: "1", username: "admin", role: "admin", totpEnabled: true, createdAt: "2026-01-15" },
      {
        id: "2",
        username: "operator1",
        role: "operator",
        totpEnabled: false,
        createdAt: "2026-02-20",
      },
      { id: "3", username: "viewer1", role: "viewer", totpEnabled: false, createdAt: "2026-03-10" },
    ],
    onAdd: () => alert("add"),
    onEdit: (id) => alert(`edit ${id}`),
    onResetTotp: (id) => alert(`reset totp ${id}`),
    onDelete: (id) => alert(`delete ${id}`),
  },
};
