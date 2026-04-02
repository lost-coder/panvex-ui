import { cn } from "@/lib/utils";

export interface MonoValueProps {
  children: React.ReactNode;
  className?: string;
}

export function MonoValue({ children, className }: MonoValueProps) {
  return (
    <span className={cn("font-mono text-xs text-fg", className)}>
      {children}
    </span>
  );
}
