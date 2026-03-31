import { cn } from "@/lib/utils";
import { AlertItem, type AlertItemProps } from "@/components/AlertItem";

export interface AlertStripProps {
  alerts: AlertItemProps[];
  className?: string;
}

export function AlertStrip({ alerts, className }: AlertStripProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {alerts.map((alert, i) => (
        <AlertItem key={i} {...alert} />
      ))}
    </div>
  );
}
