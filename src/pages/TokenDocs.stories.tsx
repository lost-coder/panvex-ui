import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { StatusDot } from "@/primitives/StatusDot";
import { StatusBeacon } from "@/primitives/StatusBeacon";
import { Badge } from "@/primitives/Badge";
import { ProgressBar } from "@/primitives/ProgressBar";
import { MiniChart } from "@/primitives/MiniChart";
import { Spinner } from "@/primitives/Spinner";
import { Skeleton } from "@/primitives/Skeleton";

const meta: Meta = {
  title: "Foundation/Design Tokens",
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj;

function StatefulThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  return <ThemeToggle value={theme} onChange={setTheme} />;
}

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-10 w-10 rounded-xs ${className}`} />
      <span className="text-xs font-mono text-fg-muted">{name}</span>
    </div>
  );
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-8 max-w-[600px]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-fg">Color Palette</h2>
        <StatefulThemeToggle />
      </div>

      <section>
        <h3 className="text-xs text-fg-muted uppercase tracking-wider mb-3">Backgrounds</h3>
        <div className="grid grid-cols-2 gap-3">
          <Swatch name="bg" className="bg-bg border border-border-hi" />
          <Swatch name="bg-card" className="bg-bg-card border border-border-hi" />
          <Swatch name="bg-card-hi" className="bg-bg-card-hi border border-border-hi" />
          <Swatch name="bg-hover" className="bg-bg-hover border border-border-hi" />
        </div>
      </section>

      <section>
        <h3 className="text-xs text-fg-muted uppercase tracking-wider mb-3">Foregrounds</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-fg font-medium">fg</span>
            <span className="text-[10px] text-fg-muted">Primary text</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-fg-muted font-medium">fg-muted</span>
            <span className="text-[10px] text-fg-muted">Secondary text</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-fg-faint font-medium">fg-faint</span>
            <span className="text-[10px] text-fg-muted">Borders, dividers</span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xs text-fg-muted uppercase tracking-wider mb-3">Status</h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <StatusDot status="ok" size="md" />
            <span className="text-xs font-mono text-fg-muted">#34d399 ok</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="warn" size="md" />
            <span className="text-xs font-mono text-fg-muted">#f59e0b warn</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="error" size="md" />
            <span className="text-xs font-mono text-fg-muted">#ef4444 error</span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xs text-fg-muted uppercase tracking-wider mb-3">Accent</h3>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xs bg-accent" />
          <span className="text-xs font-mono text-fg-muted">#60a5fa accent</span>
        </div>
      </section>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-[600px]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-fg">Typography</h2>
        <StatefulThemeToggle />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-fg-muted uppercase tracking-wider">Sans — Inter</span>
          <span className="text-3xl font-sans font-bold text-fg">Panvex Control Panel</span>
          <span className="text-xl font-sans font-semibold text-fg">Dashboard Overview</span>
          <span className="text-base font-sans text-fg">Body text for descriptions</span>
          <span className="text-sm font-sans text-fg-muted">Muted secondary information</span>
          <span className="text-xs font-sans text-fg-muted">Caption and label text</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-fg-muted uppercase tracking-wider">
            Mono — JetBrains Mono
          </span>
          <span className="text-xl font-mono font-bold text-fg">99.98%</span>
          <span className="text-sm font-mono text-fg">node-eu-fra-01</span>
          <span className="text-xs font-mono text-fg-muted">185.76.151.1:443</span>
          <span className="text-[10px] font-mono text-fg-muted">sha256:a1b2c3d4e5</span>
        </div>
      </div>
    </div>
  ),
};

export const Animations: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-[600px]">
      <h2 className="text-lg font-semibold text-fg">Animations</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center gap-2">
          <StatusBeacon status="ok" size="lg" />
          <span className="text-[10px] text-fg-muted">beacon-glow</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <StatusDot status="ok" size="md" animated />
          <span className="text-[10px] text-fg-muted">breathe</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="lg" />
          <span className="text-[10px] text-fg-muted">spin</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <span className="text-[10px] text-fg-muted">pulse</span>
        </div>
      </div>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-[600px]">
      <h2 className="text-lg font-semibold text-fg">Border Radius</h2>
      <div className="flex gap-4">
        {[
          { name: "xs (8px)", cls: "rounded-xs" },
          { name: "sm (10px)", cls: "rounded-sm" },
          { name: "DEFAULT (12px)", cls: "rounded" },
          { name: "full", cls: "rounded-full" },
        ].map((r) => (
          <div key={r.name} className="flex flex-col items-center gap-2">
            <div className={`h-12 w-12 bg-bg-card border border-border-hi ${r.cls}`} />
            <span className="text-[10px] text-fg-muted">{r.name}</span>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-fg mt-4">Component Showcase</h2>
      <div className="flex flex-wrap gap-3">
        <Badge>default</Badge>
        <Badge variant="ok">online</Badge>
        <Badge variant="warn">degraded</Badge>
        <Badge variant="error">offline</Badge>
        <Badge variant="accent">admin</Badge>
      </div>
      <div className="flex flex-col gap-3 w-[250px]">
        <ProgressBar value={42} label="CPU" />
        <ProgressBar value={78} label="MEM" />
      </div>
      <MiniChart data={[30, 35, 42, 38, 45, 55, 48, 52, 60, 58]} width={250} height={40} />
    </div>
  ),
};
