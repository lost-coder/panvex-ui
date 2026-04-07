import { Server, Users, Settings } from "lucide-react";
import type { NavItem } from "@/layout/types";

export const navItems: NavItem[] = [
  { id: "servers", label: "Servers", icon: <Server className="w-5 h-5" /> },
  { id: "clients", label: "Clients", icon: <Users className="w-5 h-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];
