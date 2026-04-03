import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ClientAccessSheet } from "./ClientAccessSheet";

const meta: Meta<typeof ClientAccessSheet> = {
  title: "Compositions/ClientAccessSheet",
  component: ClientAccessSheet,
};
export default meta;
type Story = StoryObj<typeof ClientAccessSheet>;

const fleetGroups = [
  { id: "europe", name: "europe", nodeCount: 3 },
  { id: "us-east", name: "us-east", nodeCount: 2 },
  { id: "default", name: "default", nodeCount: 2 },
];

const nodes = [
  { id: "1", name: "prod-eu-west-1", status: "ok" as const, fleetGroup: "europe" },
  { id: "2", name: "prod-eu-central-1", status: "ok" as const, fleetGroup: "europe" },
  { id: "3", name: "prod-eu-north-1", status: "warn" as const, fleetGroup: "europe" },
  { id: "4", name: "prod-us-east-1", status: "ok" as const, fleetGroup: "us-east" },
  { id: "5", name: "staging-us-1", status: "error" as const, fleetGroup: "us-east" },
  { id: "6", name: "prod-default-1", status: "ok" as const, fleetGroup: "default" },
  { id: "7", name: "prod-default-2", status: "ok" as const, fleetGroup: "default" },
];

export const Default: Story = {
  render: () => {
    const [groups, setGroups] = useState(["europe"]);
    const [nodeIds, setNodeIds] = useState<string[]>([]);
    return (
      <div className="max-w-[480px] p-6 bg-bg border border-border rounded-xs">
        <ClientAccessSheet
          fleetGroups={fleetGroups}
          nodes={nodes}
          selectedFleetGroupIds={groups}
          selectedNodeIds={nodeIds}
          onFleetGroupsChange={setGroups}
          onNodesChange={setNodeIds}
          onSubmit={() => alert("save")}
          onCancel={() => {}}
        />
      </div>
    );
  },
};
