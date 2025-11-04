import { DashboardNav } from "@/components/layouts/dashboard-nav";
import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  DollarSign,
  FileText,
} from "lucide-react";

const navItems = [
  {
    title: "Command Center",
    href: "/admin",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Matchmaking",
    href: "/admin/matchmaking",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Compliance",
    href: "/admin/compliance",
    icon: <Shield className="h-4 w-4" />,
  },
  {
    title: "Orchestration",
    href: "/admin/orchestration",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    title: "Finance",
    href: "/admin/finance",
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    title: "Audit",
    href: "/admin/audit",
    icon: <FileText className="h-4 w-4" />,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <DashboardNav
        items={navItems}
        title="Flowrate Admin"
        currentPath="/admin"
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

