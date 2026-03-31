import { cn } from "@/lib/utils";
import { LEDIndicator, type LEDIndicatorProps } from "@/primitives/LEDIndicator";

export interface LEDGridProps {
  items: LEDIndicatorProps[];
  activeCode?: string;
  onSelect?: (label: string) => void;
  className?: string;
}

export function LEDGrid({
  items,
  activeCode,
  onSelect,
  className,
}: LEDGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-4 gap-1",
        "md:grid-cols-6",
        className,
      )}
    >
      {items.map((item) => (
        <LEDIndicator
          key={item.label}
          {...item}
          active={item.label === activeCode}
          onClick={() => onSelect?.(item.label)}
        />
      ))}
    </div>
  );
}
