import type { Meta, StoryObj } from "@storybook/react";
import { UserCard } from "./UserCard";

const meta: Meta<typeof UserCard> = {
  title: "Components/UserCard",
  component: UserCard,
};
export default meta;

type Story = StoryObj<typeof UserCard>;

export const Online: Story = {
  args: {
    name: "proxy_user_42",
    online: true,
    connections: 3,
    trafficUp: 148_500_000,
    trafficDown: 2_480_000_000,
    ips: 2,
  },
};

export const Offline: Story = {
  args: {
    name: "test_account",
    online: false,
    connections: 0,
    trafficUp: 12_000_000,
    trafficDown: 85_000_000,
    ips: 1,
  },
};

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-[400px]">
      <UserCard
        name="admin_main"
        online={true}
        connections={5}
        trafficUp={500_000_000}
        trafficDown={3_200_000_000}
        ips={4}
      />
      <UserCard
        name="proxy_user_42"
        online={true}
        connections={2}
        trafficUp={148_500_000}
        trafficDown={2_480_000_000}
        ips={2}
      />
      <UserCard
        name="test_bot"
        online={false}
        connections={0}
        trafficUp={0}
        trafficDown={1_200_000}
        ips={1}
      />
    </div>
  ),
};
