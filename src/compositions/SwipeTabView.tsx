import * as React from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SwipeTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface SwipeTabViewProps {
  tabs: SwipeTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  swipeEnabled?: boolean;
  className?: string;
}

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY = 500;

export function SwipeTabView({
  tabs,
  activeTab,
  onTabChange,
  swipeEnabled = true,
  className,
}: SwipeTabViewProps) {
  const [activeIndex, setActiveIndex] = React.useState(() => {
    const idx = tabs.findIndex((t) => t.id === activeTab);
    return idx >= 0 ? idx : 0;
  });

  React.useEffect(() => {
    if (activeTab) {
      const idx = tabs.findIndex((t) => t.id === activeTab);
      if (idx >= 0) setActiveIndex(idx);
    }
  }, [activeTab, tabs]);

  function go(direction: number) {
    const next = activeIndex + direction;
    if (next < 0 || next >= tabs.length) return;
    setActiveIndex(next);
    onTabChange?.(tabs[next].id);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (!swipeEnabled) return;
    const { offset, velocity } = info;
    if (Math.abs(offset.x) > SWIPE_THRESHOLD || Math.abs(velocity.x) > SWIPE_VELOCITY) {
      go(offset.x < 0 ? 1 : -1);
    }
  }

  return (
    <div className={cn("flex flex-col overflow-hidden", className)}>
      {/* Tab bar */}
      <div className="flex border-b border-border" role="tablist">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={i === activeIndex}
            className={cn(
              "flex-1 px-3 py-2.5 text-xs font-medium tracking-wide uppercase transition-colors",
              i === activeIndex
                ? "text-accent border-b-2 border-accent"
                : "text-fg-muted hover:text-fg",
            )}
            onClick={() => {
              setActiveIndex(i);
              onTabChange?.(tab.id);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Swipeable content */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={tabs[activeIndex].id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag={swipeEnabled ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="w-full"
          >
            {tabs[activeIndex].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
