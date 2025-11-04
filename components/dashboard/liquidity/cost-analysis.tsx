"use client";

import * as React from "react";
import { WidgetBase } from "../widget-base";
import { DollarSign, TrendingDown } from "lucide-react";
import type { CostAnalysis } from "@/types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CostAnalysisProps {
  data: CostAnalysis;
  isLoading?: boolean;
}

export function CostAnalysisWidget({ data, isLoading }: CostAnalysisProps) {
  const savingsPercentage =
    (data.comparison.savings / data.comparison.selfManaged) * 100;

  return (
    <WidgetBase
      title="Cost Analysis"
      icon={DollarSign}
      isLoading={isLoading}
      size="lg"
    >
      {/* Total Monthly Costs */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardDescription>Total Monthly Cost</CardDescription>
          <CardTitle className="text-4xl font-bold">
            ${data.totalCosts.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            ${data.costPerPayment.toFixed(4)} per payment
          </p>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <CardDescription className="text-xs mb-1">Subscription</CardDescription>
            <CardTitle className="text-lg font-bold">
              ${data.monthlySubscription.toLocaleString()}
            </CardTitle>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <CardDescription className="text-xs mb-1">Channel Fees</CardDescription>
            <CardTitle className="text-lg font-bold">
              ${data.channelFees.toLocaleString()}
            </CardTitle>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <CardDescription className="text-xs mb-1">Rebalancing</CardDescription>
            <CardTitle className="text-lg font-bold">
              ${data.rebalancingCosts.toLocaleString()}
            </CardTitle>
          </CardContent>
        </Card>
      </div>

      {/* Savings Comparison */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-lightning-green" />
            <CardTitle className="text-sm font-semibold">vs. Self-Managed</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Self-Managed Cost
            </span>
            <span className="font-semibold">
              ${data.comparison.selfManaged.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">FlowRate Cost</span>
            <span className="font-semibold text-lightning-blue">
              ${data.comparison.flowRate.toLocaleString()}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-lightning-green">
              Monthly Savings
            </span>
            <div className="text-right">
              <p className="text-2xl font-bold text-lightning-green">
                ${data.comparison.savings.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {savingsPercentage.toFixed(1)}% reduction
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </WidgetBase>
  );
}
