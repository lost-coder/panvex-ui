import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppShell } from "@/layout/AppShell";
import { PageHeader } from "@/layout/PageHeader";
import { SectionHeader } from "@/layout/SectionHeader";
import { SearchFilter } from "@/compositions/SearchFilter";
import { Pagination } from "@/compositions/Pagination";
import { UserCard } from "@/components/UserCard";
import { Button } from "@/base/button";
import { Badge } from "@/primitives/Badge";
import { navItems } from "./__fixtures__/navItems";

const meta: Meta = {
  title: "Pages/UsersList",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const users = [
  {
    name: "admin_main",
    online: true,
    connections: 5,
    trafficUp: 500_000_000,
    trafficDown: 3_200_000_000,
    ips: 4,
  },
  {
    name: "proxy_user_42",
    online: true,
    connections: 2,
    trafficUp: 148_500_000,
    trafficDown: 2_480_000_000,
    ips: 2,
  },
  {
    name: "alice_vpn",
    online: true,
    connections: 1,
    trafficUp: 89_000_000,
    trafficDown: 890_000_000,
    ips: 1,
  },
  {
    name: "bob_mobile",
    online: false,
    connections: 0,
    trafficUp: 12_000_000,
    trafficDown: 85_000_000,
    ips: 1,
  },
  { name: "test_bot", online: false, connections: 0, trafficUp: 0, trafficDown: 1_200_000, ips: 1 },
  {
    name: "backup_svc",
    online: false,
    connections: 0,
    trafficUp: 45_000_000,
    trafficDown: 320_000_000,
    ips: 1,
  },
];

function UsersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>();
  const [page, setPage] = useState(1);

  const filtered = users.filter((u) => {
    if (search && !u.name.includes(search)) return false;
    if (status === "online" && !u.online) return false;
    if (status === "offline" && u.online) return false;
    return true;
  });

  return (
    <AppShell
      navItems={navItems}
      activeId="users"
      brand="PVX"
      onLogout={() => console.log("Logout clicked")}
    >
      <PageHeader
        title="Users"
        subtitle={`${users.length} configured · ${users.filter((u) => u.online).length} online`}
        trailing={<Button size="sm">+ Add User</Button>}
      />
      <div className="px-4 md:px-8 flex flex-col gap-4 pb-8">
        <SearchFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search users…"
          filters={[
            {
              key: "status",
              options: [
                { value: "all", label: "All" },
                { value: "online", label: "Online" },
                { value: "offline", label: "Offline" },
              ],
              value: status,
              onChange: setStatus,
              placeholder: "Status",
            },
          ]}
        />

        <SectionHeader
          title="Users"
          badge={filtered.length}
          trailing={<Badge variant="accent">{users.filter((u) => u.online).length} online</Badge>}
        />

        <div className="flex flex-col gap-2">
          {filtered.map((u) => (
            <UserCard key={u.name} {...u} />
          ))}
        </div>

        <Pagination page={page} totalPages={3} onPageChange={setPage} />
      </div>
    </AppShell>
  );
}

export const Default: Story = { render: () => <UsersPage /> };
