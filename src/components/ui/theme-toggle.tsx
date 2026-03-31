import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <button
      type="button"
      onClick={() => setLight((v) => !v)}
      className={cn(
        "h-8 px-2.5 rounded-xs text-xs font-mono transition-colors",
        "bg-bg-card border border-border-hi text-fg-muted hover:text-fg",
        className,
      )}
    >
      {light ? "☀ Light" : "☾ Dark"}
    </button>
  );
}
