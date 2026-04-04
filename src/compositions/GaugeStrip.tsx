import { cn } from "@/lib/utils";
import { GaugeCell, type GaugeCellProps } from "@/primitives/GaugeCell";

export interface GaugeStripProps {
  items: GaugeCellProps[];
  className?: string;
}

export function GaugeStrip({ items, className }: GaugeStripProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", "md:grid-cols-4", className)}>
      {items.map((item, i) => (
        <GaugeCell key={i} {...item} />
      ))}
    </div>
  );
}
