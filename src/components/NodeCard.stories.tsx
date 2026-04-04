import type { Meta, StoryObj } from "@storybook/react";
import { NodeCard } from "./NodeCard";

const meta: Meta<typeof NodeCard> = {
  title: "Components/NodeCard",
  component: NodeCard,
  argTypes: {
    status: { control: "select", options: ["ok", "warn", "error"] },
  },
};
export default meta;

type Story = StoryObj<typeof NodeCard>;

export const Healthy: Story = {
  args: {
    name: "node-eu-fra-01",
    status: "ok",
    health: 99,
    cpu: 42,
    mem: 61,
    clients: 1240,
    region: "EU-West",
  },
};

export const WithAlert: Story = {
  args: {
    name: "node-ap-syd-03",
    status: "error",
    health: 47,
    cpu: 94,
    mem: 88,
    clients: 320,
    region: "AP-South",
    alert: "Health below threshold — failover pending",
  },
};

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-[375px]">
      <NodeCard
        name="node-eu-fra-01"
        status="ok"
        health={99}
        cpu={42}
        mem={61}
        clients={1240}
        region="EU-West"
      />
      <NodeCard
        name="node-us-nyc-02"
        status="warn"
        health={78}
        cpu={71}
        mem={65}
        clients={890}
        region="US-East"
      />
      <NodeCard
        name="node-ap-syd-03"
        status="error"
        health={47}
        cpu={94}
        mem={88}
        clients={320}
        region="AP-South"
        alert="Health below threshold"
      />
    </div>
  ),
};
