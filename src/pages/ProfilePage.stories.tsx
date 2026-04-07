import type { Meta, StoryObj } from "@storybook/react";
import { Settings, Server, Users } from "lucide-react";
import { ProfilePage } from "./ProfilePage";
import { AppShell } from "@/layout/AppShell";

const mockNavItems = [
  { id: "servers", label: "Servers", icon: <Server className="w-5 h-5" /> },
  { id: "clients", label: "Clients", icon: <Users className="w-5 h-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

const mockAppearance = {
  theme: "system" as const,
  density: "comfortable" as const,
  helpMode: "basic" as const,
  swipeNavigation: true,
};

const meta = {
  title: "Pages/ProfilePage",
  component: ProfilePage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <AppShell
        navItems={mockNavItems}
        activeId="settings"
        onNavigate={(id) => console.log("Navigate to:", id)}
        onLogout={() => console.log("Logout clicked")}
      >
        <Story />
      </AppShell>
    ),
  ],
} satisfies Meta<typeof ProfilePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      id: "u1",
      username: "admin",
      role: "admin",
      totpEnabled: true,
    },
    appearance: mockAppearance,
    onAppearanceChange: (s) => console.log("Appearance changed:", s),
  },
};

export const NoTotp: Story = {
  args: {
    user: {
      id: "u2",
      username: "operator",
      role: "operator",
      totpEnabled: false,
    },
    appearance: mockAppearance,
    onAppearanceChange: (s) => console.log("Appearance changed:", s),
  },
};
