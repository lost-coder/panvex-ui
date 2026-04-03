import type { NavItem } from "@/layout/types";

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "◉" },
  { id: "nodes", label: "Nodes", icon: "⊞" },
  { id: "users", label: "Users", icon: "👤" },
  { id: "alerts", label: "Alerts", icon: "⚑" },
  { id: "settings", label: "Settings", icon: "⊕" },
];

// ─── Shared formatting helpers ────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes > 1e9) return (bytes / 1e9).toFixed(1) + " GB";
  if (bytes > 1e6) return (bytes / 1e6).toFixed(1) + " MB";
  return bytes + " B";
}

export function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  return d > 0 ? `${d}d ${h}h` : `${h}h`;
}

export function formatTime(epochSecs: number): string {
  return new Date(epochSecs * 1000).toLocaleTimeString();
}

export function coverageColor(pct: number): string {
  if (pct < 70) return "text-status-error";
  if (pct < 100) return "text-status-warn";
  return "text-status-ok";
}

export function formatQuota(bytes: number): string {
  if (bytes === 0) return "Unlimited";
  return formatBytes(bytes);
}

export function formatExpiry(rfc3339: string): string {
  if (!rfc3339) return "Never";
  return new Date(rfc3339).toLocaleDateString();
}

export function deployVariant(status: string): "ok" | "warn" | "error" | "default" {
  if (status === "ok") return "ok";
  if (status === "pending") return "warn";
  if (status === "error") return "error";
  return "default";
}
