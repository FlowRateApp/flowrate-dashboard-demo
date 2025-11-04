import { AppSidebar } from "@/components/layouts/app-sidebar";
import { DashboardHeader } from "@/components/layouts/dashboard-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Network,
  Server,
  CreditCard,
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    href: "/treasury",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Leases",
    href: "/treasury/leases",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Channels",
    href: "/treasury/channels",
    icon: <Network className="h-4 w-4" />,
  },
  {
    title: "Nodes",
    href: "/treasury/nodes",
    icon: <Server className="h-4 w-4" />,
  },
  {
    title: "Billing",
    href: "/treasury/billing",
    icon: <CreditCard className="h-4 w-4" />,
  },
];

const pageTitles: Record<string, string> = {
  "/treasury": "Treasury Dashboard",
  "/treasury/leases": "Leases",
  "/treasury/channels": "Channels",
  "/treasury/nodes": "Nodes",
  "/treasury/billing": "Billing",
};

export default function TreasuryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar items={navItems} title="Treasury" />
      <SidebarInset>
        <DashboardHeader defaultTitle="Treasury Dashboard" />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
