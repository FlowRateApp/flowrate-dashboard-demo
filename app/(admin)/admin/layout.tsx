import { AppSidebar } from "@/components/layouts/app-sidebar";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <AppSidebar items={navItems} title="Admin" />
      <SidebarInset>
        <DashboardHeader defaultTitle="Flowrate Admin" />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
