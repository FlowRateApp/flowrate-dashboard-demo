"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";

interface DashboardHeaderProps {
  defaultTitle?: string;
}

const pageTitleMap: Record<string, string> = {
  "/treasury": "Treasury Dashboard",
  "/treasury/leases": "Leases",
  "/treasury/channels": "Channels",
  "/treasury/nodes": "Nodes",
  "/treasury/billing": "Billing",
  "/subscriber": "Subscriber Dashboard",
  "/subscriber/leases": "Leases",
  "/subscriber/integration": "Integration",
  "/subscriber/invoices": "Invoices",
  "/subscriber/health": "Health",
  "/admin": "Command Center",
  "/admin/matchmaking": "Matchmaking",
  "/admin/compliance": "Compliance",
  "/admin/orchestration": "Orchestration",
  "/admin/finance": "Finance",
  "/admin/audit": "Audit",
};

export function DashboardHeader({ defaultTitle }: DashboardHeaderProps) {
  const pathname = usePathname();
  const title = pageTitleMap[pathname] || defaultTitle || "Dashboard";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}

