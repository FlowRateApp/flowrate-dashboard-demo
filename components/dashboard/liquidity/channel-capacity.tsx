"use client";

import * as React from "react";
import { WidgetBase } from "../widget-base";
import { Activity } from "lucide-react";
import type { ChannelMetrics } from "@/types/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ChannelCapacityProps {
  data: ChannelMetrics;
  isLoading?: boolean;
}

export function ChannelCapacityWidget({
  data,
  isLoading,
}: ChannelCapacityProps) {
  const inboundPercentage = (data.inboundLiquidity / data.totalCapacity) * 100;
  const outboundPercentage =
    (data.outboundLiquidity / data.totalCapacity) * 100;

  return (
    <WidgetBase
      title="Channel Capacity"
      icon={Activity}
      isLoading={isLoading}
      size="lg"
    >
      {/* Total Capacity */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardDescription>Total Capacity</CardDescription>
          <CardTitle className="text-4xl font-bold">
            {data.totalCapacity.toFixed(2)} BTC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Utilization: {data.utilizationRate}%
          </p>
        </CardContent>
      </Card>

      {/* Inbound vs Outbound */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Inbound</CardDescription>
            <CardTitle className="text-2xl font-bold text-lightning-green">
              {data.inboundLiquidity.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {inboundPercentage.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Outbound</CardDescription>
            <CardTitle className="text-2xl font-bold text-lightning-blue">
              {data.outboundLiquidity.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {outboundPercentage.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Balance Visualization */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-lightning-green">Inbound</span>
          <span className="text-lightning-blue">Outbound</span>
        </div>
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="absolute left-0 top-0 h-full bg-lightning-green transition-all duration-500"
            style={{ width: `${inboundPercentage}%` }}
          />
          <div
            className="absolute left-0 top-0 h-full bg-lightning-blue transition-all duration-500"
            style={{
              width: `${outboundPercentage}%`,
              marginLeft: `${inboundPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* Channel Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-lightning-blue">
              {data.activeChannels}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Active Channels
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{data.totalChannels}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Channels</p>
          </CardContent>
        </Card>
      </div>
    </WidgetBase>
  );
}
