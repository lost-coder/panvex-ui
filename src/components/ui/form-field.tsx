import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  description,
  error,
  htmlFor,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-fg leading-none">
        {label}
      </label>
      {description && <p className="text-[11px] text-fg-muted leading-snug">{description}</p>}
      {children}
      {error && <p className="text-[11px] text-status-error font-mono leading-snug">{error}</p>}
    </div>
  );
}
