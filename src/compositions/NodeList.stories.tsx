import type { Meta, StoryObj } from "@storybook/react";
import { NodeList } from "./NodeList";

const meta: Meta<typeof NodeList> = {
  title: "Compositions/NodeList",
  component: NodeList,
};
export default meta;

type Story = StoryObj<typeof NodeList>;

export const Default: Story = {
  args: {
    nodes: [
      { name: "node-eu-fra-01", status: "ok", health: 99, cpu: 42, mem: 61, clients: 1240, region: "EU-West" },
      { name: "node-us-nyc-02", status: "warn", health: 78, cpu: 71, mem: 65, clients: 890, region: "US-East" },
      { name: "node-ap-syd-03", status: "error", health: 47, cpu: 94, mem: 88, clients: 320, region: "AP-South", alert: "Health below threshold" },
      { name: "node-eu-ams-04", status: "ok", health: 97, cpu: 35, mem: 52, clients: 1100, region: "EU-West" },
      { name: "node-us-lax-05", status: "ok", health: 95, cpu: 55, mem: 60, clients: 760, region: "US-West" },
      { name: "node-ap-tky-06", status: "ok", health: 96, cpu: 48, mem: 58, clients: 930, region: "AP-East" },
    ],
  },
};
