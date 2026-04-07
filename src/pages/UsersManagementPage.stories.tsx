import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { UsersManagementPage } from "./UsersManagementPage";
import { AppShell } from "@/layout/AppShell";
import { navItems } from "./__fixtures__/navItems";
import type { UserFormData, UserFormSheetProps } from "@/types/pages";

const meta = {
  title: "Pages/UsersManagement",
  component: UsersManagementPage,
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
} satisfies Meta<typeof UsersManagementPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUsers = [
  { id: "u1", username: "admin", role: "admin" as const, totpEnabled: true, createdAt: "2025-01-15" },
  { id: "u2", username: "operator1", role: "operator" as const, totpEnabled: false, createdAt: "2025-03-10" },
  { id: "u3", username: "viewer_ro", role: "viewer" as const, totpEnabled: false, createdAt: "2025-06-01" },
];

export const Default: Story = {
  args: {
    users: mockUsers,
    onAdd: () => console.log("Add user"),
    onEdit: (id) => console.log("Edit user:", id),
    onDelete: (id) => console.log("Delete user:", id),
    onResetTotp: (id) => console.log("Reset TOTP:", id),
  },
};

export const Empty: Story = {
  args: {
    users: [],
    onAdd: () => console.log("Add user"),
    onEdit: (id) => console.log("Edit user:", id),
    onDelete: (id) => console.log("Delete user:", id),
    onResetTotp: (id) => console.log("Reset TOTP:", id),
  },
};

function InteractiveUsersPage() {
  const [sheet, setSheet] = useState<UserFormSheetProps | undefined>();
  const [formData, setFormData] = useState<UserFormData>({ username: "", password: "", role: "viewer" });

  return (
    <UsersManagementPage
      users={mockUsers}
      onAdd={() => {
        setFormData({ username: "", password: "", role: "viewer" });
        setSheet({
          mode: "create",
          data: formData,
          onChange: setFormData,
          onSubmit: () => { console.log("Submit:", formData); setSheet(undefined); },
          onCancel: () => setSheet(undefined),
        });
      }}
      onEdit={(id) => {
        const user = mockUsers.find((u) => u.id === id);
        if (!user) return;
        const editData = { username: user.username, password: "", role: user.role };
        setFormData(editData);
        setSheet({
          mode: "edit",
          data: editData,
          onChange: setFormData,
          onSubmit: () => { console.log("Save:", formData); setSheet(undefined); },
          onCancel: () => setSheet(undefined),
        });
      }}
      onDelete={(id) => console.log("Delete:", id)}
      onResetTotp={(id) => console.log("Reset TOTP:", id)}
      sheet={sheet ? { ...sheet, data: formData, onChange: setFormData } : undefined}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveUsersPage />,
};
