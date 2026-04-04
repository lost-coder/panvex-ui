import { useState } from "react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

type SortDir = "asc" | "desc";

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No data",
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <>
      {/* Desktop table */}
      <div className={cn("hidden md:block overflow-x-auto", className)}>
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "text-left text-[11px] text-fg-muted uppercase tracking-wider font-medium px-3 py-2",
                    col.sortable && "cursor-pointer select-none hover:text-fg",
                    col.className,
                  )}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  {col.header}
                  {sortKey === col.key && (
                    <span className="ml-1 text-accent">{sortDir === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-fg-muted py-8">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-border/50 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-bg-hover",
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-3 py-2.5", col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className={cn("flex flex-col gap-2 md:hidden", className)}>
        {data.length === 0 ? (
          <p className="text-center text-fg-muted py-8 text-sm">{emptyMessage}</p>
        ) : (
          data.map((row) => (
            <button
              key={keyExtractor(row)}
              type="button"
              onClick={() => onRowClick?.(row)}
              className="rounded-xs bg-bg-card p-3 text-left border border-transparent hover:border-border-hi transition-colors"
            >
              <div className="flex flex-col gap-1.5">
                {columns.map((col) => (
                  <div key={col.key} className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-fg-muted uppercase tracking-wider shrink-0">
                      {col.header}
                    </span>
                    <span className="text-sm text-fg text-right truncate">{col.render(row)}</span>
                  </div>
                ))}
              </div>
            </button>
          ))
        )}
      </div>
    </>
  );
}
