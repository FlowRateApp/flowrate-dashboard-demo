"use client";

import * as React from "react";
import { WidgetBase } from "../widget-base";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import type { BitcoinPortfolio } from "@/types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BitcoinPortfolioProps {
  data: BitcoinPortfolio;
  isLoading?: boolean;
}

export function BitcoinPortfolioWidget({
  data,
  isLoading,
}: BitcoinPortfolioProps) {
  const allocationPercentage = (data.allocatedBtc / data.totalBtc) * 100;

  return (
    <WidgetBase
      title="Bitcoin Portfolio"
      icon={Wallet}
      isLoading={isLoading}
      size="lg"
    >
      {/* Total Balance */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
        <p className="text-4xl font-bold mb-1">
          {data.totalBtc.toFixed(4)} BTC
        </p>
        <p className="text-lg text-muted-foreground">
          ≈ ${data.totalUsd.toLocaleString()} USD
        </p>
      </div>

      {/* Allocation Grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-lightning-green" />
              <CardDescription className="text-sm">Allocated (Earning)</CardDescription>
            </div>
            <CardTitle className="text-2xl font-bold text-lightning-green">
              {data.allocatedBtc.toFixed(4)} BTC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {allocationPercentage.toFixed(1)}% of portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-muted-foreground" />
              <CardDescription className="text-sm">Available (Idle)</CardDescription>
            </div>
            <CardTitle className="text-2xl font-bold">
              {data.availableBtc.toFixed(4)} BTC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {(100 - allocationPercentage).toFixed(1)}% of portfolio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Channel Info */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-lightning-blue">
              {data.channels}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Active Channels</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-lightning-blue">
              {data.averageChannelSize.toFixed(3)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Avg Channel (BTC)</p>
          </CardContent>
        </Card>
      </div>

      {/* Allocation Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Allocation</span>
          <span className="text-lightning-green font-semibold">
            {allocationPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-lightning-green to-lightning-blue rounded-full transition-all duration-500"
            style={{ width: `${allocationPercentage}%` }}
          />
        </div>
      </div>
    </WidgetBase>
  );
}
