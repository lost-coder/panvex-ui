import { cn } from "@/lib/utils";
import { ActionItem, type ActionItemProps } from "@/components/ActionItem";

export interface ActionListProps {
  actions: ActionItemProps[];
  className?: string;
}

export function ActionList({ actions, className }: ActionListProps) {
  return (
    <div className={cn("flex flex-col divide-y divide-border", className)}>
      {actions.map((action) => (
        <ActionItem key={action.label} {...action} />
      ))}
    </div>
  );
}
