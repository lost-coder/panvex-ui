import type { Meta, StoryObj } from "@storybook/react";
import { Settings, Server, Users } from "lucide-react";
import { SettingsPage } from "./SettingsPage";
import { AppShell } from "@/layout/AppShell";

const mockNavItems = [
  { id: "servers", label: "Servers", icon: <Server className="w-5 h-5" /> },
  { id: "clients", label: "Clients", icon: <Users className="w-5 h-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

const meta = {
  title: "Pages/SettingsPage",
  component: SettingsPage,
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
} satisfies Meta<typeof SettingsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    panelSettings: {
      httpPublicUrl: "https://panvex.example.com",
      grpcPublicEndpoint: "panvex.example.com:443",
    },
    appearanceSettings: {
      theme: "system",
      density: "comfortable",
      helpMode: "basic",
      swipeNavigation: true,
    },
    onPanelSettingsChange: (s) => console.log("Panel settings changed:", s),
    onAppearanceChange: (s) => console.log("Appearance changed:", s),
    onRestart: () => console.log("Restart requested"),
  },
};
