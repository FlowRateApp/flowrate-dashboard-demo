import { AppSidebar } from "@/components/layouts/app-sidebar";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Receipt,
  Activity,
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    href: "/subscriber",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Leases",
    href: "/subscriber/leases",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Integration",
    href: "/subscriber/integration",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    title: "Invoices",
    href: "/subscriber/invoices",
    icon: <Receipt className="h-4 w-4" />,
  },
  {
    title: "Health",
    href: "/subscriber/health",
    icon: <Activity className="h-4 w-4" />,
  },
];

export default function SubscriberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar items={navItems} title="Subscriber" />
      <SidebarInset>
        <DashboardHeader defaultTitle="Subscriber Dashboard" />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
