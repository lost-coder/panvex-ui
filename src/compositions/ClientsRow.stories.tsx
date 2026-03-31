import type { Meta, StoryObj } from "@storybook/react";
import { ClientsRow } from "./ClientsRow";

const meta: Meta<typeof ClientsRow> = {
  title: "Compositions/ClientsRow",
  component: ClientsRow,
};
export default meta;

type Story = StoryObj<typeof ClientsRow>;

export const Default: Story = {
  args: { total: 12480, active: 11200 },
};
