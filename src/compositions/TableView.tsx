import * as React from "react";
import { Search, ChevronLeft, ChevronRight, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ViewModeToggle } from "@/compositions/ViewModeToggle";
import type { ViewMode } from "@/types/pages";

export interface TableViewFilter {
  key: string;
  value: string;
  onChange: (val: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface TableViewColumn {
  key: string;
  label: string;
}

export interface TableViewProps<T = unknown> {
  // Toolbar — search
  search?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  // Toolbar — filters
  filters?: TableViewFilter[];
  // Toolbar — view mode toggle
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  // Toolbar — column visibility
  columnVisibility?: Record<string, boolean>;
  onColumnVisibilityChange?: (key: string, visible: boolean) => void;
  availableColumns?: TableViewColumn[];
  // Content
  children: React.ReactNode;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

function Divider() {
  return <div className="w-px self-stretch bg-border" />;
}

export function TableView<T = unknown>({
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters,
  viewMode,
  onViewModeChange,
  columnVisibility,
  onColumnVisibilityChange,
  availableColumns,
  children,
  currentPage = 1,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: TableViewProps<T>) {
  const hasFilters = filters && filters.length > 0;
  const hasViewMode = viewMode !== undefined && onViewModeChange !== undefined;
  const hasColumnPicker =
    availableColumns && availableColumns.length > 0 && onColumnVisibilityChange;

  // Derived pagination display
  const showPagination = totalPages !== undefined && totalPages > 1;
  const rangeStart =
    totalItems !== undefined && pageSize !== undefined
      ? (currentPage - 1) * pageSize + 1
      : undefined;
  const rangeEnd =
    totalItems !== undefined && pageSize !== undefined
      ? Math.min(currentPage * pageSize, totalItems)
      : undefined;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 bg-bg-card p-2 rounded-xl border border-border">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-fg-muted pointer-events-none" />
          <Input
            type="search"
            value={search ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>

        {/* Right controls */}
        {(hasFilters || hasColumnPicker || hasViewMode) && (
          <div className="flex gap-2 items-center">
            {/* Filters */}
            {hasFilters &&
              filters!.map((f, i) => (
                <Select
                  key={f.key}
                  value={f.value}
                  onChange={f.onChange}
                  options={f.options}
                  placeholder={f.placeholder ?? "All"}
                />
              ))}

            {/* Divider before column picker / view mode */}
            {hasFilters && (hasColumnPicker || hasViewMode) && <Divider />}

            {/* Column visibility picker */}
            {hasColumnPicker && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-xs border border-border-hi",
                      "bg-bg-card text-fg-muted hover:text-fg transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                    )}
                    aria-label="Toggle columns"
                  >
                    <Columns3 className="size-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-52 p-3">
                  <p className="text-xs font-medium text-fg-muted uppercase tracking-wider mb-2">
                    Columns
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {availableColumns!.map((col) => {
                      const visible = columnVisibility?.[col.key] ?? true;
                      return (
                        <label
                          key={col.key}
                          className="flex items-center gap-2 cursor-pointer select-none text-sm text-fg"
                        >
                          <input
                            type="checkbox"
                            checked={visible}
                            onChange={(e) =>
                              onColumnVisibilityChange!(
                                col.key,
                                e.target.checked,
                              )
                            }
                            className="accent-accent"
                          />
                          {col.label}
                        </label>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Divider between column picker and view mode */}
            {hasColumnPicker && hasViewMode && <Divider />}

            {/* View mode toggle — hidden on mobile */}
            {hasViewMode && (
              <div className="hidden sm:block">
                <ViewModeToggle
                  mode={viewMode!}
                  onChange={onViewModeChange!}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {children}

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-fg-muted font-mono">
            {rangeStart !== undefined && rangeEnd !== undefined && totalItems !== undefined
              ? `Showing ${rangeStart}–${rangeEnd} of ${totalItems}`
              : `Page ${currentPage} of ${totalPages}`}
          </span>

          <div className="flex gap-1">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className={cn(
                "flex items-center justify-center h-8 w-8 rounded-xs border border-border-hi",
                "bg-bg-card text-fg-muted hover:text-fg transition-colors",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages! }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-xs border font-mono text-xs transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                    page === currentPage
                      ? "bg-accent border-accent text-white"
                      : "bg-bg-card border-border-hi text-fg-muted hover:text-fg",
                  )}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages!}
              className={cn(
                "flex items-center justify-center h-8 w-8 rounded-xs border border-border-hi",
                "bg-bg-card text-fg-muted hover:text-fg transition-colors",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
              )}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
