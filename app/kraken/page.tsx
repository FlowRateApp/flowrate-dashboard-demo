"use client";

import * as React from "react";
import { Suspense } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardLoading } from "@/components/dashboard-loading";
import { useRealtimeData } from "@/hooks/use-realtime-data";
import { ChannelCapacityWidget } from "@/components/dashboard/liquidity/channel-capacity";
import { RoutingSuccessWidget } from "@/components/dashboard/liquidity/routing-success";
import { GeographicDistributionWidget } from "@/components/dashboard/liquidity/geographic-distribution";
import { CostAnalysisWidget } from "@/components/dashboard/liquidity/cost-analysis";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";

function LiquidityDashboardContent() {
  const { data, isLoading } = useRealtimeData("liquidity", 15000);

  if (isLoading || !data || !data.liquidity) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" withText text="Loading liquidity data..." />
      </div>
    );
  }

  const { channels, routing, geographic, costs, health } = data.liquidity;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Liquidity Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your Lightning Network channels and payment routing
          performance
        </p>
      </div>

      {/* Service Health Banner */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-lightning-green animate-pulse" />
              <span className="font-semibold">Service Status: Healthy</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Uptime: </span>
                <span className="text-lightning-green font-semibold">
                  {health.uptime}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Response: </span>
                <span className="text-lightning-blue font-semibold">
                  {health.responseTime}ms
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Row 1 */}
        <ChannelCapacityWidget data={channels} />

        {/* Row 2 */}
        <RoutingSuccessWidget data={routing} />
        <GeographicDistributionWidget data={geographic} />

        {/* Row 3 */}
        <CostAnalysisWidget data={costs} />
      </div>
    </div>
  );
}

export default function LiquidityDashboard() {
  return (
    <DashboardLayout>
      <Suspense fallback={<DashboardLoading />}>
        <LiquidityDashboardContent />
      </Suspense>
    </DashboardLayout>
  );
}
