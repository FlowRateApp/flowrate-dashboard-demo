"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  timeRangeOptions?: string[];
  defaultTimeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

export function ChartWrapper({
  title,
  children,
  timeRangeOptions = ["7d", "30d", "90d"],
  defaultTimeRange = "7d",
  onTimeRangeChange,
}: ChartWrapperProps) {
  const [selectedRange, setSelectedRange] = React.useState(defaultTimeRange);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    onTimeRangeChange?.(range);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Tabs value={selectedRange} onValueChange={handleRangeChange}>
            <TabsList>
              {timeRangeOptions.map((range) => (
                <TabsTrigger key={range} value={range}>
                  {range}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

