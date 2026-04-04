import { cn } from "@/lib/utils";

export interface SLABannerProps {
  value: string;
  label: string;
  details?: string;
  className?: string;
}

export function SLABanner({ value, label, details, className }: SLABannerProps) {
  return (
    <div className={cn("rounded-xs bg-bg-card p-4 flex items-baseline gap-3", className)}>
      <span className="text-3xl font-mono font-bold text-status-ok leading-none">{value}</span>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-fg">{label}</span>
        {details && <span className="text-[11px] text-fg-muted mt-0.5">{details}</span>}
      </div>
    </div>
  );
}
