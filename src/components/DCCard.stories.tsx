import type { Meta, StoryObj } from "@storybook/react";
import { DCCard } from "./DCCard";

const meta: Meta<typeof DCCard> = {
  title: "Components/DCCard",
  component: DCCard,
  argTypes: {
    status: { control: "select", options: ["ok", "warn", "error"] },
  },
};
export default meta;

type Story = StoryObj<typeof DCCard>;

export const Ok: Story = {
  args: { code: "FRA", city: "Frankfurt", latency: 12, load: 34, status: "ok" },
};

export const Warn: Story = {
  args: { code: "SIN", city: "Singapore", latency: 145, load: 78, status: "warn" },
};

export const Error: Story = {
  args: { code: "SYD", city: "Sydney", latency: 999, load: 95, status: "error" },
};

export const ScrollRow: Story = {
  render: () => (
    <div className="flex gap-2 overflow-x-auto w-[375px] pb-2">
      <DCCard code="FRA" city="Frankfurt" latency={12} load={34} status="ok" />
      <DCCard code="AMS" city="Amsterdam" latency={18} load={42} status="ok" />
      <DCCard code="SIN" city="Singapore" latency={145} load={78} status="warn" />
      <DCCard code="SYD" city="Sydney" latency={999} load={95} status="error" />
      <DCCard code="NYC" city="New York" latency={85} load={55} status="ok" />
      <DCCard code="TKY" city="Tokyo" latency={110} load={61} status="ok" />
    </div>
  ),
};
