import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./form-field";
import { Input } from "./input";
import { Select } from "./select";
import { Toggle } from "./toggle";

const meta: Meta<typeof FormField> = {
  title: "UI/FormField",
  component: FormField,
};
export default meta;

type Story = StoryObj<typeof FormField>;

export const WithInput: Story = {
  render: () => (
    <FormField
      label="Server Name"
      description="Unique identifier for this node"
      className="w-[300px]"
    >
      <Input placeholder="node-eu-fra-01" />
    </FormField>
  ),
};

export const WithError: Story = {
  render: () => (
    <FormField label="Port" error="Port must be between 1024 and 65535" className="w-[300px]">
      <Input defaultValue="80" />
    </FormField>
  ),
};

export const WithSelect: Story = {
  render: () => (
    <FormField label="Region" className="w-[300px]">
      <Select
        options={[
          { value: "eu", label: "Europe" },
          { value: "us", label: "United States" },
          { value: "ap", label: "Asia Pacific" },
        ]}
        onChange={() => {}}
      />
    </FormField>
  ),
};

export const WithToggle: Story = {
  render: () => (
    <div className="flex items-center justify-between w-[300px]">
      <FormField label="Enable TLS" description="Encrypt client connections">
        <span />
      </FormField>
      <Toggle checked={true} onChange={() => {}} />
    </div>
  ),
};
