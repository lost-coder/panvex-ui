import type { Meta, StoryObj } from "@storybook/react";
import { LEDGrid } from "./LEDGrid";

const meta: Meta<typeof LEDGrid> = {
  title: "Compositions/LEDGrid",
  component: LEDGrid,
};
export default meta;

type Story = StoryObj<typeof LEDGrid>;

const ledItems = [
  { status: "ok" as const, label: "FRA", sublabel: "Frankfurt" },
  { status: "ok" as const, label: "AMS", sublabel: "Amsterdam" },
  { status: "warn" as const, label: "SIN", sublabel: "Singapore" },
  { status: "error" as const, label: "SYD", sublabel: "Sydney" },
  { status: "ok" as const, label: "NYC", sublabel: "New York" },
  { status: "ok" as const, label: "TKY", sublabel: "Tokyo" },
  { status: "ok" as const, label: "LDN", sublabel: "London" },
  { status: "ok" as const, label: "LAX", sublabel: "Los Angeles" },
  { status: "warn" as const, label: "MUM", sublabel: "Mumbai" },
  { status: "ok" as const, label: "SAO", sublabel: "São Paulo" },
  { status: "ok" as const, label: "JNB", sublabel: "Johannesburg" },
  { status: "ok" as const, label: "DXB", sublabel: "Dubai" },
];

export const Default: Story = {
  args: { items: ledItems },
};

export const WithActive: Story = {
  args: { items: ledItems, activeCode: "SIN" },
};
