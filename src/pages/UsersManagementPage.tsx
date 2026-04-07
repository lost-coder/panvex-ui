import { PageHeader } from "@/layout/PageHeader";
import { UsersSection } from "@/compositions/UsersSection";
import { UserFormSheet } from "@/compositions/UserFormSheet";
import type { UsersManagementPageProps } from "@/types/pages";

export function UsersManagementPage({
  users,
  onAdd,
  onEdit,
  onDelete,
  onResetTotp,
  sheet,
}: UsersManagementPageProps) {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="User Management"
        subtitle={`${users.length} user${users.length !== 1 ? "s" : ""}`}
      />

      <div className="px-4 md:px-8 pb-8">
        <UsersSection
          users={users}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
          onResetTotp={onResetTotp}
        />
      </div>

      {sheet && (
        <UserFormSheet
          mode={sheet.mode}
          data={sheet.data}
          onChange={sheet.onChange}
          onSubmit={sheet.onSubmit}
          onCancel={sheet.onCancel}
          loading={sheet.loading}
          error={sheet.error}
        />
      )}
    </div>
  );
}
