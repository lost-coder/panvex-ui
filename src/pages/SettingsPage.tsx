import { PageHeader } from "@/layout/PageHeader";
import { SettingsGroup } from "@/components/SettingsGroup";
import { SettingsRow } from "@/components/SettingsRow";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { SettingsPageProps } from "@/types/pages";

export function SettingsPage({
  panelSettings,
  appearanceSettings,
  onPanelSettingsChange,
  onAppearanceChange,
  onRestart,
  onManageUsers,
}: SettingsPageProps) {
  return (
    <div className="flex flex-col">
      <PageHeader title="Settings" subtitle="Configure your control plane" />

      <div className="px-4 md:px-8 flex flex-col gap-6 pb-8">
        {/* Panel */}
        <SettingsGroup title="Panel">
          <SettingsRow
            label="HTTP Public URL"
            description="Public-facing URL for this control plane"
          >
            <Input
              className="w-64"
              value={panelSettings.httpPublicUrl}
              placeholder="https://panvex.example.com"
              onChange={(e) =>
                onPanelSettingsChange?.({
                  ...panelSettings,
                  httpPublicUrl: e.target.value,
                })
              }
            />
          </SettingsRow>
          <SettingsRow label="gRPC Endpoint" description="Agent connection endpoint">
            <Input
              className="w-64"
              value={panelSettings.grpcPublicEndpoint}
              placeholder="panvex.example.com:443"
              onChange={(e) =>
                onPanelSettingsChange?.({
                  ...panelSettings,
                  grpcPublicEndpoint: e.target.value,
                })
              }
            />
          </SettingsRow>
        </SettingsGroup>

        {/* Appearance */}
        <SettingsGroup title="Appearance">
          <SettingsRow label="Theme">
            <Select
              className="w-36"
              value={appearanceSettings.theme}
              options={[
                { value: "system", label: "System" },
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
              onChange={(v) =>
                onAppearanceChange?.({
                  ...appearanceSettings,
                  theme: v as typeof appearanceSettings.theme,
                })
              }
            />
          </SettingsRow>
          <SettingsRow label="Density">
            <Select
              className="w-36"
              value={appearanceSettings.density}
              options={[
                { value: "comfortable", label: "Comfortable" },
                { value: "compact", label: "Compact" },
              ]}
              onChange={(v) =>
                onAppearanceChange?.({
                  ...appearanceSettings,
                  density: v as typeof appearanceSettings.density,
                })
              }
            />
          </SettingsRow>
          <SettingsRow label="Help Mode">
            <Select
              className="w-36"
              value={appearanceSettings.helpMode}
              options={[
                { value: "off", label: "Off" },
                { value: "basic", label: "Basic" },
                { value: "full", label: "Full" },
              ]}
              onChange={(v) =>
                onAppearanceChange?.({
                  ...appearanceSettings,
                  helpMode: v as typeof appearanceSettings.helpMode,
                })
              }
            />
          </SettingsRow>
          <SettingsRow label="Swipe Navigation" description="Swipe between pages on mobile">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--color-accent)] cursor-pointer"
              checked={appearanceSettings.swipeNavigation}
              onChange={(e) =>
                onAppearanceChange?.({
                  ...appearanceSettings,
                  swipeNavigation: e.target.checked,
                })
              }
            />
          </SettingsRow>
        </SettingsGroup>

        {/* Administration */}
        {onManageUsers && (
          <SettingsGroup title="Administration">
            <SettingsRow
              label="User Management"
              description="Create, edit, and manage user accounts"
            >
              <Button size="sm" onClick={onManageUsers}>
                Manage Users
              </Button>
            </SettingsRow>
          </SettingsGroup>
        )}

        {/* System */}
        <SettingsGroup title="System">
          <SettingsRow
            label="Restart Control Plane"
            description="Gracefully restart the control-plane process"
          >
            <Button variant="danger" size="sm" onClick={onRestart}>
              Restart
            </Button>
          </SettingsRow>
        </SettingsGroup>
      </div>
    </div>
  );
}
