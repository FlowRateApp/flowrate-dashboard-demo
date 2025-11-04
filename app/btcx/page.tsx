"use client";

import * as React from "react";
import { Suspense } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardLoading } from "@/components/dashboard-loading";
import { useRealtimeData } from "@/hooks/use-realtime-data";
import { BitcoinPortfolioWidget } from "@/components/dashboard/treasury/bitcoin-portfolio";
import { YieldPerformanceWidget } from "@/components/dashboard/treasury/yield-performance";
import { RiskAssessmentWidget } from "@/components/dashboard/treasury/risk-assessment";
import { TransactionHistoryWidget } from "@/components/dashboard/treasury/transaction-history";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

function TreasuryDashboardContent() {
  const { data, isLoading } = useRealtimeData("treasury", 15000);

  if (isLoading || !data || !data.treasury) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" withText text="Loading treasury data..." />
      </div>
    );
  }

  const { portfolio, yield: yieldData, risk, transactions } = data.treasury;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Treasury Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your Bitcoin portfolio and yield performance in real-time
        </p>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Row 1 */}
        <BitcoinPortfolioWidget data={portfolio} />

        {/* Row 2 */}
        <YieldPerformanceWidget data={yieldData} />
        <RiskAssessmentWidget data={risk} />

        {/* Row 3 */}
        <TransactionHistoryWidget data={transactions} />
      </div>
    </div>
  );
}

export default function TreasuryDashboard() {
  return (
    <DashboardLayout>
      <Suspense fallback={<DashboardLoading />}>
        <TreasuryDashboardContent />
      </Suspense>
    </DashboardLayout>
  );
}
