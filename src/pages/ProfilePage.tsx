import { PageHeader } from "@/layout/PageHeader";
import { SettingsGroup } from "@/components/SettingsGroup";
import { SettingsRow } from "@/components/SettingsRow";
import { Select } from "@/components/ui/select";
import { Badge } from "@/primitives/Badge";
import type { ProfilePageProps } from "@/types/pages";

export function ProfilePage({ user, appearance, onAppearanceChange }: ProfilePageProps) {
  const initials = user.username.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col">
      <PageHeader title="Profile" subtitle="Account information and preferences" />

      <div className="px-4 md:px-8 flex flex-col gap-6 pb-8">
        {/* User info card */}
        <div className="rounded-xs bg-bg-card border border-border p-6 flex flex-col items-center gap-3 text-center">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center">
            <span className="text-2xl font-mono font-bold text-accent">{initials}</span>
          </div>

          {/* Username */}
          <span className="text-lg font-semibold text-fg tracking-tight">{user.username}</span>

          {/* Role + TOTP badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Badge variant="accent">{user.role}</Badge>
            {user.totpEnabled ? (
              <Badge variant="ok">2FA Enabled</Badge>
            ) : (
              <Badge variant="warn">2FA Disabled</Badge>
            )}
          </div>
        </div>

        {/* Appearance */}
        <SettingsGroup title="Appearance">
          <SettingsRow label="Theme">
            <Select
              className="w-36"
              value={appearance.theme}
              options={[
                { value: "system", label: "System" },
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
              onChange={(v) =>
                onAppearanceChange?.({
                  ...appearance,
                  theme: v as typeof appearance.theme,
                })
              }
            />
          </SettingsRow>
          <SettingsRow label="Density">
            <Select
              className="w-36"
              value={appearance.density}
              options={[
                { value: "comfortable", label: "Comfortable" },
                { value: "compact", label: "Compact" },
              ]}
              onChange={(v) =>
                onAppearanceChange?.({
                  ...appearance,
                  density: v as typeof appearance.density,
                })
              }
            />
          </SettingsRow>
          <SettingsRow label="Swipe Navigation" description="Swipe between pages on mobile">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--color-accent)] cursor-pointer"
              checked={appearance.swipeNavigation}
              onChange={(e) =>
                onAppearanceChange?.({
                  ...appearance,
                  swipeNavigation: e.target.checked,
                })
              }
            />
          </SettingsRow>
        </SettingsGroup>
      </div>
    </div>
  );
}
