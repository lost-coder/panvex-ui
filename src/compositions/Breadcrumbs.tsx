import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-xs", className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-fg-muted/40">/</span>}
            {isLast ? (
              <span className="text-fg font-medium truncate">{item.label}</span>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="text-fg-muted hover:text-fg transition-colors truncate"
              >
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
