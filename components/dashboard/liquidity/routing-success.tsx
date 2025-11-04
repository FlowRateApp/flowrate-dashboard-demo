"use client";

import * as React from "react";
import { WidgetBase } from "../widget-base";
import { Zap, CheckCircle, XCircle } from "lucide-react";
import type { RoutingPerformance } from "@/types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RoutingSuccessProps {
  data: RoutingPerformance;
  isLoading?: boolean;
}

export function RoutingSuccessWidget({ data, isLoading }: RoutingSuccessProps) {
  return (
    <WidgetBase
      title="Routing Performance"
      icon={Zap}
      isLoading={isLoading}
      size="md"
    >
      {/* Success Rate */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardDescription>Success Rate</CardDescription>
          <CardTitle className="text-4xl font-bold text-lightning-green">
            {data.successRate.toFixed(2)}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Industry avg: 95.0%</p>
        </CardContent>
      </Card>

      {/* Payment Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-lightning-green" />
              <CardDescription className="text-xs">Successful</CardDescription>
            </div>
            <CardTitle className="text-2xl font-bold text-lightning-green">
              {data.successfulPayments.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-400" />
              <CardDescription className="text-xs">Failed</CardDescription>
            </div>
            <CardTitle className="text-2xl font-bold">
              {data.failedPayments.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-3">
        <Card>
          <CardContent className="flex justify-between items-center p-3">
            <span className="text-sm text-muted-foreground">Avg Response Time</span>
            <span className="font-semibold text-lightning-blue">
              {data.averageResponseTime}ms
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center p-3">
            <span className="text-sm text-muted-foreground">Total Payments</span>
            <span className="font-semibold">
              {data.totalPayments.toLocaleString()}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-between items-center p-3">
            <span className="text-sm text-muted-foreground">Fees Earned</span>
            <span className="font-semibold text-lightning-green">
              {data.totalFeesEarned.toFixed(6)} BTC
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Mini Chart Placeholder */}
      <Card className="mt-4">
        <CardContent className="h-24 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">
            Success rate trend • Last 30 days
          </p>
        </CardContent>
      </Card>
    </WidgetBase>
  );
}
