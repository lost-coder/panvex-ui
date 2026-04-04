import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ClientFormSheet } from "./ClientFormSheet";
import type { ClientFormData } from "@/types/pages";

const meta: Meta<typeof ClientFormSheet> = {
  title: "Compositions/ClientFormSheet",
  component: ClientFormSheet,
};
export default meta;
type Story = StoryObj<typeof ClientFormSheet>;

const emptyData: ClientFormData = {
  name: "",
  userAdTag: "",
  expirationRfc3339: "",
  maxTcpConns: 0,
  maxUniqueIps: 0,
  dataQuotaBytes: 0,
};

const existingData: ClientFormData = {
  name: "premium-users",
  userAdTag: "premium_channel",
  expirationRfc3339: "2026-12-31T23:59:59Z",
  maxTcpConns: 100,
  maxUniqueIps: 50,
  dataQuotaBytes: 1073741824,
};

export const Create: Story = {
  render: () => {
    const [data, setData] = useState(emptyData);
    return (
      <div className="max-w-[480px] p-6 bg-bg border border-border rounded-xs">
        <ClientFormSheet
          mode="create"
          data={data}
          onChange={setData}
          onSubmit={() => alert("create")}
          onCancel={() => {}}
        />
      </div>
    );
  },
};

export const Edit: Story = {
  render: () => {
    const [data, setData] = useState(existingData);
    return (
      <div className="max-w-[480px] p-6 bg-bg border border-border rounded-xs">
        <ClientFormSheet
          mode="edit"
          data={data}
          onChange={setData}
          onSubmit={() => alert("save")}
          onCancel={() => {}}
        />
      </div>
    );
  },
};
