"use client";

import * as React from "react";
import { WidgetBase } from "../widget-base";
import { Globe } from "lucide-react";
import type { GeographicDistribution } from "@/types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface GeographicDistributionProps {
  data: GeographicDistribution[];
  isLoading?: boolean;
}

export function GeographicDistributionWidget({
  data,
  isLoading,
}: GeographicDistributionProps) {
  const getRegionColorClass = (index: number) => {
    const colors = [
      "[&>div]:bg-lightning-blue",
      "[&>div]:bg-lightning-green",
      "[&>div]:bg-lightning-orange",
      "[&>div]:bg-purple-500",
      "[&>div]:bg-pink-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <WidgetBase
      title="Geographic Distribution"
      icon={Globe}
      isLoading={isLoading}
      size="md"
    >
      {/* Distribution Bars */}
      <div className="space-y-4">
        {data.map((region, index) => (
          <div key={region.region}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">
                {region.region}
              </span>
              <div className="text-right">
                <span className="font-semibold">
                  {region.percentage}%
                </span>
                <span className="text-muted-foreground text-xs ml-2">
                  ({region.channels} channels)
                </span>
              </div>
            </div>

            <Progress
              value={region.percentage}
              className={cn("h-3", getRegionColorClass(index))}
            />

            <p className="text-xs text-muted-foreground mt-1">
              Capacity: {region.capacity.toFixed(2)} BTC
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-lightning-blue">
                {data.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Regions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-lightning-green">
                {data.reduce((sum, r) => sum + r.channels, 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Channels</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </WidgetBase>
  );
}
