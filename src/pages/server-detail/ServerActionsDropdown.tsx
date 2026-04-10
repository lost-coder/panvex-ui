import React from "react";
import { MoreVertical } from "lucide-react";

export interface ServerActionsDropdownProps {
  onReload?: () => void;
  onBoostDetail?: () => void;
  onRename?: () => void;
  onDeregister?: () => void;
}

export function ServerActionsDropdown({
  onReload,
  onBoostDetail,
  onRename,
  onDeregister,
}: ServerActionsDropdownProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-xs hover:bg-white/10 transition-colors text-fg-muted hover:text-fg"
        title="Server actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-xs bg-bg-card border border-border shadow-lg py-1 flex flex-col">
            <button
              onClick={() => {
                onReload?.();
                setOpen(false);
              }}
              className="px-3 py-2 text-left text-sm text-fg hover:bg-bg-card-hover transition-colors"
            >
              Reload Runtime
            </button>
            {onBoostDetail && (
              <button
                onClick={() => {
                  onBoostDetail();
                  setOpen(false);
                }}
                className="px-3 py-2 text-left text-sm text-fg hover:bg-bg-card-hover transition-colors"
              >
                Refresh Diagnostics
              </button>
            )}
            {onRename && (
              <button
                onClick={() => {
                  onRename();
                  setOpen(false);
                }}
                className="px-3 py-2 text-left text-sm text-fg hover:bg-bg-card-hover transition-colors"
              >
                Rename Server
              </button>
            )}
            {onDeregister && (
              <>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={() => {
                    onDeregister();
                    setOpen(false);
                  }}
                  className="px-3 py-2 text-left text-sm text-status-error hover:bg-bg-card-hover transition-colors"
                >
                  Deregister Server
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
