import type { Meta, StoryObj } from "@storybook/react";
import { DCScrollStrip } from "./DCScrollStrip";

const meta: Meta<typeof DCScrollStrip> = {
  title: "Compositions/DCScrollStrip",
  component: DCScrollStrip,
};
export default meta;

type Story = StoryObj<typeof DCScrollStrip>;

const dcItems = [
  { code: "FRA", city: "Frankfurt", latency: 12, load: 34, status: "ok" as const },
  { code: "AMS", city: "Amsterdam", latency: 18, load: 42, status: "ok" as const },
  { code: "SIN", city: "Singapore", latency: 145, load: 78, status: "warn" as const },
  { code: "SYD", city: "Sydney", latency: 999, load: 95, status: "error" as const },
  { code: "NYC", city: "New York", latency: 85, load: 55, status: "ok" as const },
  { code: "TKY", city: "Tokyo", latency: 110, load: 61, status: "ok" as const },
  { code: "LDN", city: "London", latency: 22, load: 38, status: "ok" as const },
  { code: "LAX", city: "Los Angeles", latency: 95, load: 50, status: "ok" as const },
  { code: "MUM", city: "Mumbai", latency: 160, load: 72, status: "warn" as const },
  { code: "SAO", city: "São Paulo", latency: 180, load: 65, status: "ok" as const },
  { code: "JNB", city: "Johannesburg", latency: 200, load: 40, status: "ok" as const },
  { code: "DXB", city: "Dubai", latency: 130, load: 55, status: "ok" as const },
];

export const Default: Story = {
  args: { items: dcItems },
  decorators: [
    (Story) => (
      <div className="w-[375px]">
        <Story />
      </div>
    ),
  ],
};

export const Desktop: Story = {
  args: { items: dcItems },
  decorators: [
    (Story) => (
      <div className="w-[900px]">
        <Story />
      </div>
    ),
  ],
};
