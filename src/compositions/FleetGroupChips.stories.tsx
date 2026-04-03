// src/compositions/FleetGroupChips.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FleetGroupChips } from "./FleetGroupChips";

const meta: Meta<typeof FleetGroupChips> = {
  title: "Compositions/FleetGroupChips",
  component: FleetGroupChips,
};
export default meta;
type Story = StoryObj<typeof FleetGroupChips>;

const groups = [
  { id: "europe", name: "europe", nodeCount: 12 },
  { id: "asia", name: "asia-pacific", nodeCount: 8 },
  { id: "us-east", name: "us-east", nodeCount: 6 },
  { id: "us-west", name: "us-west", nodeCount: 4 },
  { id: "default", name: "default", nodeCount: 3 },
];

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["europe"]);
    return <FleetGroupChips groups={groups} selected={selected} onChange={setSelected} />;
  },
};

export const NoneSelected: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return <FleetGroupChips groups={groups} selected={selected} onChange={setSelected} />;
  },
};
