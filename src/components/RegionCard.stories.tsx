import type { Meta, StoryObj } from "@storybook/react";
import { RegionCard } from "./RegionCard";

const meta: Meta<typeof RegionCard> = {
  title: "Components/RegionCard",
  component: RegionCard,
  argTypes: {
    status: { control: "select", options: ["ok", "warn", "error"] },
  },
};
export default meta;

type Story = StoryObj<typeof RegionCard>;

export const Default: Story = {
  args: {
    name: "EU-West",
    status: "ok",
    nodeCount: 8,
    dcCount: 3,
    clients: 4200,
    load: 42,
  },
};

export const ScrollRow: Story = {
  render: () => (
    <div className="flex gap-2 overflow-x-auto w-[375px] pb-2">
      <RegionCard name="EU-West" status="ok" nodeCount={8} dcCount={3} clients={4200} load={42} />
      <RegionCard name="US-East" status="ok" nodeCount={6} dcCount={2} clients={3100} load={55} />
      <RegionCard
        name="AP-South"
        status="warn"
        nodeCount={4}
        dcCount={2}
        clients={1800}
        load={78}
      />
      <RegionCard name="ME-Central" status="ok" nodeCount={2} dcCount={1} clients={600} load={31} />
    </div>
  ),
};
