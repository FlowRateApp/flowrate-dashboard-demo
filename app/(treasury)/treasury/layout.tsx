import { DashboardNav } from "@/components/layouts/dashboard-nav";
import {
  LayoutDashboard,
  FileText,
  Network,
  Server,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { title: "Overview", href: "/treasury", icon: <LayoutDashboard className="h-4 w-4" /> },
  { title: "Leases", href: "/treasury/leases", icon: <FileText className="h-4 w-4" /> },
  { title: "Channels", href: "/treasury/channels", icon: <Network className="h-4 w-4" /> },
  { title: "Nodes", href: "/treasury/nodes", icon: <Server className="h-4 w-4" /> },
  { title: "Billing", href: "/treasury/billing", icon: <CreditCard className="h-4 w-4" /> },
];

export default function TreasuryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <DashboardNav
        items={navItems}
        title="Treasury Dashboard"
        currentPath="/treasury"
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

