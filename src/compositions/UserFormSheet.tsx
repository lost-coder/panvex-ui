import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { UserFormSheetProps } from "@/types/pages";

export function UserFormSheet({
  mode,
  data,
  onChange,
  onSubmit,
  onCancel,
  loading,
  error,
}: UserFormSheetProps) {
  function update<K extends keyof typeof data>(key: K, value: (typeof data)[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{mode === "create" ? "Add User" : "Edit User"}</SheetTitle>
        </SheetHeader>
        <SheetBody>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-fg-muted">Panel administrator account.</p>

            <div>
              <label className="text-xs font-medium text-fg-muted uppercase tracking-wider block mb-1.5">
                Username *
              </label>
              <Input
                value={data.username}
                onChange={(e) => update("username", e.target.value)}
                placeholder="admin"
                disabled={loading || mode === "edit"}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-fg-muted uppercase tracking-wider block mb-1.5">
                Password {mode === "create" ? "*" : "(leave blank to keep)"}
              </label>
              <Input
                type="password"
                value={data.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder={mode === "edit" ? "••••••••" : ""}
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-fg-muted uppercase tracking-wider block mb-1.5">
                Role *
              </label>
              <Select
                value={data.role}
                options={[
                  { value: "admin", label: "Admin — Full access" },
                  { value: "operator", label: "Operator — Manage nodes & clients" },
                  { value: "viewer", label: "Viewer — Read-only" },
                ]}
                onChange={(v) => update("role", v as typeof data.role)}
              />
            </div>

            {error && <div className="text-xs text-status-error">{error}</div>}

            <div className="flex gap-2 justify-end mt-2">
              <Button variant="ghost" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button
                onClick={onSubmit}
                disabled={loading || !data.username || (mode === "create" && !data.password)}
              >
                {loading ? "Saving..." : mode === "create" ? "Add User" : "Save Changes"}
              </Button>
            </div>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
