import { DashboardNav } from "@/components/layouts/dashboard-nav";
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
    <div className="flex h-screen">
      <DashboardNav
        items={navItems}
        title="Subscriber Dashboard"
        currentPath="/subscriber"
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
