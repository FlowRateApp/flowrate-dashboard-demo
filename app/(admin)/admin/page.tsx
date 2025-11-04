"use client";

import { KPICard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_TREASURIES, MOCK_LEASES, MOCK_STATEMENTS } from "@/lib/mock-data/treasury";
import { MOCK_DEMAND_TICKETS } from "@/lib/mock-data/subscriber";
import { MOCK_COMPLIANCE_RECORDS } from "@/lib/mock-data/admin";
import { ArrowRight, Users, Shield, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Calculate aggregates
const totalSupply = MOCK_TREASURIES.reduce((sum, t) => sum + t.deployedBTC, 0);
const totalActiveLeases = MOCK_LEASES.filter((l) => l.status === "active").length;
const avgNetAPY = MOCK_TREASURIES.reduce((sum, t) => sum + t.netAPY, 0) / MOCK_TREASURIES.length;
const slaBreaches7D = 2; // Mock value
const incidentsOpen = 3; // Mock value

// Queue counts
const newSubscriberRequests = MOCK_DEMAND_TICKETS.filter((t) => t.status === "pending").length;
const kycPending = MOCK_COMPLIANCE_RECORDS.filter((c) => c.status === "pending").length;
const expiringSoon = MOCK_LEASES.filter((l) => l.daysRemaining <= 14 && l.daysRemaining > 0).length;
const reconciliationDiffs = 1; // Mock value

function QueueCard({
  title,
  count,
  description,
  href,
  icon,
}: {
  title: string;
  count: number;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <Link href={href}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            <Badge variant={count > 0 ? "destructive" : "default"}>
              {count}
            </Badge>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="ghost" size="sm" className="w-full">
            View {count > 0 ? "(" + count + ")" : ""}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}

export default function AdminCommandCenter() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Command Center</h1>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Supply (BTC)"
          value={totalSupply.toFixed(8)}
          subtitle="Total treasury capacity"
        />
        <KPICard
          title="Active Leases"
          value={totalActiveLeases}
          subtitle="Currently active"
        />
        <KPICard
          title="Avg Net APY"
          value={`${avgNetAPY.toFixed(2)}%`}
          subtitle="Average to treasuries"
        />
        <KPICard
          title="SLA Breaches (7D)"
          value={slaBreaches7D}
          subtitle="Service level breaches"
          trend={slaBreaches7D > 0 ? { value: slaBreaches7D * 10, isPositive: false } : undefined}
        />
        <KPICard
          title="Incidents Open"
          value={incidentsOpen}
          subtitle="Active incidents"
        />
      </div>

      {/* Queues */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Action Queues</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QueueCard
            title="New Requests"
            count={newSubscriberRequests}
            description="Subscriber capacity requests pending review"
            href="/admin/matchmaking"
            icon={<Users className="h-5 w-5" />}
          />
          <QueueCard
            title="KYC Pending"
            count={kycPending}
            description="Compliance verifications awaiting review"
            href="/admin/compliance"
            icon={<Shield className="h-5 w-5" />}
          />
          <QueueCard
            title="Expiring Soon"
            count={expiringSoon}
            description="Leases expiring within 14 days"
            href="/admin/orchestration"
            icon={<Clock className="h-5 w-5" />}
          />
          <QueueCard
            title="Reconciliation"
            count={reconciliationDiffs}
            description="Financial reconciliation discrepancies"
            href="/admin/finance"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
        </div>
      </div>
    </div>
  );
}

