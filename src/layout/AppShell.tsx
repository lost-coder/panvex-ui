import { cn } from "@/lib/utils";
import { Sidebar, type SidebarProps } from "./Sidebar";
import { BottomNav, type BottomNavProps } from "./BottomNav";
import type { NavItem } from "./types";

export interface AppShellProps {
  navItems: NavItem[];
  activeId: string;
  brand?: string;
  sidebarFooter?: React.ReactNode;
  onNavigate?: (id: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function AppShell({
  navItems,
  activeId,
  brand,
  sidebarFooter,
  onNavigate,
  children,
  className,
}: AppShellProps) {
  return (
    <div className={cn("min-h-screen bg-bg", className)}>
      <Sidebar
        items={navItems}
        activeId={activeId}
        brand={brand}
        footer={sidebarFooter}
        onNavigate={onNavigate}
      />

      <main className="md:ml-[60px] pb-16 md:pb-0 min-h-screen">{children}</main>

      <BottomNav items={navItems} activeId={activeId} onNavigate={onNavigate} />
    </div>
  );
}
