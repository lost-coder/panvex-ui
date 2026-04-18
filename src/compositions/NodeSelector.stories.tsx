// src/compositions/NodeSelector.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NodeSelector } from "./NodeSelector";

const meta: Meta<typeof NodeSelector> = {
  title: "Compositions/NodeSelector",
  component: NodeSelector,
};
export default meta;
type Story = StoryObj<typeof NodeSelector>;

const mockNodes = [
  { id: "1", name: "prod-eu-west-1", status: "ok" as const, fleetGroup: "europe" },
  { id: "2", name: "prod-eu-central-1", status: "ok" as const, fleetGroup: "europe" },
  { id: "3", name: "prod-eu-north-1", status: "warn" as const, fleetGroup: "europe" },
  { id: "4", name: "prod-us-east-1", status: "ok" as const, fleetGroup: "us-east" },
  { id: "5", name: "prod-us-east-2", status: "ok" as const, fleetGroup: "us-east" },
  { id: "6", name: "staging-us-1", status: "error" as const, fleetGroup: "us-east" },
  { id: "7", name: "prod-asia-1", status: "ok" as const, fleetGroup: "asia-pacific" },
  { id: "8", name: "prod-default-1", status: "ok" as const, fleetGroup: "default" },
  { id: "9", name: "prod-default-2", status: "ok" as const, fleetGroup: "default" },
  { id: "10", name: "prod-default-3", status: "ok" as const, fleetGroup: "default" },
];

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["1", "2", "8"]);
    return <NodeSelector nodes={mockNodes} selectedNodeIds={selected} onChange={setSelected} />;
  },
};

export const Empty: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return <NodeSelector nodes={mockNodes} selectedNodeIds={selected} onChange={setSelected} />;
  },
};

export const ManyNodes: Story = {
  render: () => {
    const fleetGroups = ["europe", "us-east", "asia-pacific", "default"] as const;
    const nodes = Array.from({ length: 50 }, (_, i) => ({
      id: String(i),
      name: `node-${String(i).padStart(3, "0")}`,
      status: (i % 10 === 0 ? "error" : i % 5 === 0 ? "warn" : "ok") as "ok" | "warn" | "error",
      fleetGroup: fleetGroups[i % fleetGroups.length]!,
    }));
    const [selected, setSelected] = useState<string[]>([]);
    return <NodeSelector nodes={nodes} selectedNodeIds={selected} onChange={setSelected} />;
  },
};
