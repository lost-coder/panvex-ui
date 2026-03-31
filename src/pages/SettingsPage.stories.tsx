import type { Meta, StoryObj } from "@storybook/react";
import { AppShell } from "@/layout/AppShell";
import { PageHeader } from "@/layout/PageHeader";
import { SettingsGroup } from "@/components/SettingsGroup";
import { SettingsRow } from "@/components/SettingsRow";
import { Toggle } from "@/components/ui/toggle";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/primitives/Badge";
import { navItems } from "./_shared";

const meta: Meta = {
  title: "Pages/Settings",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <AppShell navItems={navItems} activeId="settings" brand="PVX">
      <PageHeader title="Settings" subtitle="Panel configuration" />
      <div className="px-4 md:px-8 flex flex-col gap-8 pb-8 max-w-[640px]">

        <SettingsGroup title="Connection" description="Proxy and transport settings">
          <SettingsRow label="Transport Mode" description="ME or Direct routing">
            <Badge variant="accent">middle proxy</Badge>
          </SettingsRow>
          <SettingsRow label="Accept Connections" description="Gate for new client connections">
            <Toggle checked={true} onChange={() => {}} />
          </SettingsRow>
          <SettingsRow label="ME2DC Fallback" description="Fall back to direct on ME failure">
            <Toggle checked={true} onChange={() => {}} />
          </SettingsRow>
          <SettingsRow label="Fast Fallback" description="Quick switch to direct">
            <Toggle checked={false} onChange={() => {}} />
          </SettingsRow>
        </SettingsGroup>

        <SettingsGroup title="Polling" description="Data refresh intervals">
          <SettingsRow label="Realtime interval" description="Health, gates, connections">
            <Select
              options={[
                { value: "3", label: "3s" },
                { value: "5", label: "5s" },
                { value: "10", label: "10s" },
              ]}
              value="5"
              onChange={() => {}}
              className="w-[80px]"
            />
          </SettingsRow>
          <SettingsRow label="Medium interval" description="Quality, events, summary">
            <Select
              options={[
                { value: "15", label: "15s" },
                { value: "30", label: "30s" },
                { value: "60", label: "60s" },
              ]}
              value="30"
              onChange={() => {}}
              className="w-[80px]"
            />
          </SettingsRow>
        </SettingsGroup>

        <SettingsGroup title="Security" description="API access and authentication">
          <SettingsRow label="API Auth Header" description="Require auth header for API calls">
            <Toggle checked={true} onChange={() => {}} />
          </SettingsRow>
          <SettingsRow label="IP Whitelist" description="Restrict API to whitelisted CIDRs">
            <Toggle checked={false} onChange={() => {}} />
          </SettingsRow>
          <SettingsRow label="Log Level">
            <Select
              options={[
                { value: "error", label: "Error" },
                { value: "warn", label: "Warn" },
                { value: "info", label: "Info" },
                { value: "debug", label: "Debug" },
              ]}
              value="info"
              onChange={() => {}}
              className="w-[100px]"
            />
          </SettingsRow>
        </SettingsGroup>

        <SettingsGroup title="Nodes" description="Manage connected Telemt nodes">
          <SettingsRow label="Add Node URL" description="Telemt API base URL">
            <Input placeholder="https://node.example.com:8443" className="w-[260px]" />
          </SettingsRow>
        </SettingsGroup>

        <div className="flex justify-end gap-2">
          <Button variant="ghost">Reset</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </AppShell>
  ),
};
