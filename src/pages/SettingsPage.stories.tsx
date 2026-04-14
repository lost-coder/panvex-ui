import type { Meta, StoryObj } from "@storybook/react";
import { Settings, Server, Users } from "lucide-react";
import { SettingsPage } from "./SettingsPage";
import { SettingsGroup } from "@/components/SettingsGroup";
import { SettingsRow } from "@/components/SettingsRow";
import { Button } from "@/base/button";
import { Toggle } from "@/base/toggle";
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

const MockUpdatesSection = () => (
  <SettingsGroup title="Software Updates">
    <SettingsRow label="Panel Version" description="Currently running">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-fg">v0.0.1</span>
        <Button size="sm" onClick={() => console.log("Update panel")}>
          Update to v0.0.2
        </Button>
      </div>
    </SettingsRow>
    <SettingsRow label="Agent Version" description="Latest available">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-fg">v0.0.1</span>
        <Button size="sm" variant="outline" onClick={() => console.log("Update all agents")}>
          Update All Agents
        </Button>
      </div>
    </SettingsRow>
    <SettingsRow label="Auto-update" description="Automatically install new versions">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          Panel <Toggle checked={false} onChange={() => {}} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          Agents <Toggle checked={true} onChange={() => {}} />
        </label>
      </div>
    </SettingsRow>
  </SettingsGroup>
);

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
    onManageUsers: () => console.log("Manage users clicked"),
    retentionSettings: {
      ts_raw_seconds: 86400,
      ts_hourly_seconds: 604800,
      ts_dc_seconds: 2592000,
      ip_history_seconds: 604800,
      event_history_seconds: 259200,
    },
    onRetentionChange: (s) => console.log("Retention changed:", s),
    children: <MockUpdatesSection />,
  },
};

export const NonAdmin: Story = {
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
  },
};
