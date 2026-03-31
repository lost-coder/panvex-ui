import type { Meta, StoryObj } from "@storybook/react";
import { AppShell } from "@/layout/AppShell";
import { PageHeader } from "@/layout/PageHeader";
import { SectionHeader } from "@/layout/SectionHeader";
import { Breadcrumbs } from "@/compositions/Breadcrumbs";
import { GaugeStrip } from "@/compositions/GaugeStrip";
import { DCScrollStrip } from "@/compositions/DCScrollStrip";
import { AlertStrip } from "@/compositions/AlertStrip";
import { Timeline } from "@/compositions/Timeline";
import { ActionList } from "@/compositions/ActionList";
import { ClientsRow } from "@/compositions/ClientsRow";
import { StatusBeacon } from "@/primitives/StatusBeacon";
import { Badge } from "@/primitives/Badge";
import { ProgressBar } from "@/primitives/ProgressBar";
import { MiniChart } from "@/primitives/MiniChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { navItems } from "./_shared";

const meta: Meta = {
  title: "Pages/NodeDetail",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const dcItems = [
  { code: "DC1", city: "DC 1", latency: 12, load: 340, status: "ok" as const },
  { code: "DC2", city: "DC 2", latency: 14, load: 280, status: "ok" as const },
  { code: "DC3", city: "DC 3", latency: 89, load: 95, status: "warn" as const },
  { code: "DC4", city: "DC 4", latency: 18, load: 310, status: "ok" as const },
  { code: "DC5", city: "DC 5", latency: 22, load: 150, status: "ok" as const },
];

export const Default: Story = {
  render: () => (
    <AppShell navItems={navItems} activeId="nodes" brand="PVX">
      <div className="px-4 md:px-8 pt-3">
        <Breadcrumbs items={[{ label: "Nodes" }, { label: "node-eu-fra-01" }]} />
      </div>
      <PageHeader
        title="node-eu-fra-01"
        subtitle="EU West · Telemt v3.2.1 · Uptime 14d 7h"
        trailing={<StatusBeacon status="ok" size="md" />}
      />
      <div className="px-4 md:px-8 flex flex-col gap-6 pb-8">

        <div>
          <SectionHeader title="Server Metrics" />
          <GaugeStrip items={[
            { value: "42", unit: "%", label: "CPU" },
            { value: "6.1", unit: "GB", label: "Memory" },
            { value: "99.98", unit: "%", label: "Health" },
            { value: "14d 7h", label: "Uptime" },
          ]} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xs bg-bg-card p-4 flex flex-col gap-2">
            <span className="text-[11px] text-fg-muted uppercase tracking-wider">Gates</span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="ok">accepting</Badge>
              <Badge variant="ok">ME ready</Badge>
              <Badge variant="accent">middle proxy</Badge>
              <Badge>startup: ready</Badge>
            </div>
          </div>
          <div className="rounded-xs bg-bg-card p-4 flex flex-col gap-2">
            <span className="text-[11px] text-fg-muted uppercase tracking-wider">Bandwidth</span>
            <ProgressBar value={62} label="Channel utilization" />
            <MiniChart data={[45, 48, 52, 55, 60, 58, 62]} color="#60a5fa" width={200} height={32} />
          </div>
        </div>

        <div>
          <SectionHeader title="Telegram DC Connections" badge={5} />
          <DCScrollStrip items={dcItems} />
        </div>

        <div>
          <SectionHeader title="Connections" />
          <ClientsRow total={1240} active={1180} />
        </div>

        <div>
          <SectionHeader title="Alerts" badge={1} />
          <AlertStrip alerts={[
            { severity: "warn", message: "DC3 coverage at 68%, 2 writers degraded", source: "me-quality", timestamp: "12:04" },
          ]} />
        </div>

        <Tabs defaultValue="activity">
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          </TabsList>
          <TabsContent value="activity">
            <Timeline events={[
              { status: "ok", time: "12:05", message: "Config v2.4.1 deployed" },
              { status: "warn", time: "12:04", message: "DC3 writer degraded", detail: "rtt 89ms" },
              { status: "ok", time: "11:30", message: "Runtime reload completed" },
            ]} />
          </TabsContent>
          <TabsContent value="actions">
            <ActionList actions={[
              { icon: "⟳", label: "Restart Node", description: "Graceful restart with drain" },
              { icon: "🔄", label: "Reload Runtime", description: "Re-read config without restart" },
              { icon: "📋", label: "View Logs", description: "Open real-time log stream" },
              { icon: "⏻", label: "Force Stop", description: "Immediately terminate", variant: "danger" as const },
            ]} />
          </TabsContent>
          <TabsContent value="diagnostics">
            <div className="text-sm text-fg-muted py-4">Self-test, pool state, quality metrics…</div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  ),
};
