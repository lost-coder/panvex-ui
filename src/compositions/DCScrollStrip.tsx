import { cn } from "@/lib/utils";
import { DCCard, type DCCardProps } from "@/components/DCCard";

export interface DCScrollStripProps {
  items: DCCardProps[];
  onSelect?: (code: string) => void;
  className?: string;
}

export function DCScrollStrip({
  items,
  onSelect,
  className,
}: DCScrollStripProps) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin",
        "md:grid md:grid-cols-4 md:overflow-visible md:snap-none md:pb-0",
        "xl:grid-cols-6",
        className,
      )}
    >
      {items.map((item) => (
        <DCCard
          key={item.code}
          {...item}
          onClick={() => onSelect?.(item.code)}
          className="shrink-0 md:shrink"
        />
      ))}
    </div>
  );
}
