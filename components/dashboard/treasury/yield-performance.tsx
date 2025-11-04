"use client";

import * as React from "react";
import { WidgetBase } from "../widget-base";
import { TrendingUp, ArrowUp } from "lucide-react";
import type { YieldPerformance } from "@/types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface YieldPerformanceProps {
  data: YieldPerformance;
  isLoading?: boolean;
}

export function YieldPerformanceWidget({
  data,
  isLoading,
}: YieldPerformanceProps) {
  return (
    <WidgetBase
      title="Yield Performance"
      icon={TrendingUp}
      isLoading={isLoading}
      size="md"
    >
      {/* Current APY */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardDescription className="text-sm mb-1">Current APY</CardDescription>
              <CardTitle className="text-4xl font-bold text-lightning-green">
                {data.currentApy.toFixed(2)}%
              </CardTitle>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <ArrowUp className="w-4 h-4 text-lightning-green" />
              <span className="text-sm font-semibold text-lightning-green">
                +
                {(
                  ((data.currentApy - data.averageApy) / data.averageApy) *
                  100
                ).toFixed(1)}
                %
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            vs {data.averageApy.toFixed(2)}% average
          </p>
        </CardContent>
      </Card>

      {/* Earnings Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
          <p className="text-xl font-bold">
            {data.totalEarned.toFixed(6)} BTC
          </p>
          <p className="text-xs text-muted-foreground">
            ${data.totalEarnedUsd.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Monthly Avg</p>
          <p className="text-xl font-bold">
            {data.monthlyEarnings.toFixed(6)} BTC
          </p>
          <p className="text-xs text-muted-foreground">
            ${(data.monthlyEarnings * 45000).toLocaleString()} USD
          </p>
        </div>
      </div>

      {/* Projection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <CardDescription className="text-xs mb-1">
                Projected Annual Yield
              </CardDescription>
              <CardTitle className="text-2xl font-bold text-lightning-blue">
                {data.projectedYearly.toFixed(6)} BTC
              </CardTitle>
            </div>
            <div className="text-right">
              <CardDescription className="text-xs mb-1">Value</CardDescription>
              <CardTitle className="text-lg font-semibold">
                ${(data.projectedYearly * 45000).toLocaleString()}
              </CardTitle>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mini Chart Placeholder */}
      <Card className="mt-4">
        <CardContent className="h-32 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Performance chart • Last 90 days
          </p>
        </CardContent>
      </Card>
    </WidgetBase>
  );
}
