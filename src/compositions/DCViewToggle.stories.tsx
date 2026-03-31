import type { Meta, StoryObj } from "@storybook/react";
import { DCViewToggle } from "./DCViewToggle";
import { DCScrollStrip } from "./DCScrollStrip";
import { LEDGrid } from "./LEDGrid";

const meta: Meta<typeof DCViewToggle> = {
  title: "Compositions/DCViewToggle",
  component: DCViewToggle,
};
export default meta;

type Story = StoryObj<typeof DCViewToggle>;

const dcItems = [
  { code: "FRA", city: "Frankfurt", latency: 12, load: 34, status: "ok" as const },
  { code: "AMS", city: "Amsterdam", latency: 18, load: 42, status: "ok" as const },
  { code: "SIN", city: "Singapore", latency: 145, load: 78, status: "warn" as const },
  { code: "SYD", city: "Sydney", latency: 999, load: 95, status: "error" as const },
];

const ledItems = [
  { status: "ok" as const, label: "FRA", sublabel: "Frankfurt" },
  { status: "ok" as const, label: "AMS", sublabel: "Amsterdam" },
  { status: "warn" as const, label: "SIN", sublabel: "Singapore" },
  { status: "error" as const, label: "SYD", sublabel: "Sydney" },
];

export const Default: Story = {
  render: () => (
    <div className="w-[375px]">
      <DCViewToggle
        cardsView={<DCScrollStrip items={dcItems} />}
        gridView={<LEDGrid items={ledItems} />}
      />
    </div>
  ),
};
