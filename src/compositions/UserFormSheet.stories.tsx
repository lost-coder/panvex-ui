import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { UserFormSheet } from "./UserFormSheet";
import type { UserFormData } from "@/types/pages";

const meta: Meta<typeof UserFormSheet> = {
  title: "Compositions/UserFormSheet",
  component: UserFormSheet,
};
export default meta;
type Story = StoryObj<typeof UserFormSheet>;

export const Create: Story = {
  render: () => {
    const [data, setData] = useState<UserFormData>({
      username: "",
      password: "",
      role: "operator",
    });
    return (
      <div className="max-w-[400px] p-6 bg-bg border border-border rounded-xs">
        <UserFormSheet
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
    const [data, setData] = useState<UserFormData>({
      username: "admin",
      password: "",
      role: "admin",
    });
    return (
      <div className="max-w-[400px] p-6 bg-bg border border-border rounded-xs">
        <UserFormSheet
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
