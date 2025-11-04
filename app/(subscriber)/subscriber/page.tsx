"use client";

import { useState, useMemo } from "react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { ChartWrapper } from "@/components/dashboard/chart-wrapper";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_SUBSCRIBERS, MOCK_CAPACITY_DATA } from "@/lib/mock-data/subscriber";
import { getUnreadAlerts } from "@/lib/mock-data/shared";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";

// Get first subscriber for demo
const subscriber = MOCK_SUBSCRIBERS[0];
if (!subscriber) {
  throw new Error("No subscriber data available");
}
const subscriberId = subscriber.id;

// Get alerts
const alerts = getUnreadAlerts(subscriberId, "subscriber");

const chartConfig = {
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-1))",
  },
  used: {
    label: "Used",
    color: "hsl(var(--chart-2))",
  },
  successRate: {
    label: "Success Rate",
    color: "hsl(var(--chart-3))",
  },
};

export default function SubscriberOverview() {
  if (!subscriber) {
    throw new Error("No subscriber data available");
  }

  // Time range state for chart
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");

  // Prepare capacity chart data based on selected time range
  const chartData = useMemo(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const data = MOCK_CAPACITY_DATA.slice(-days);
    return data.map((point) => ({
      date: format(new Date(point.date), "MMM dd"),
      delivered: point.delivered,
      used: point.used,
      successRate: point.successRate,
    }));
  }, [timeRange]);

  return (
    <div className="space-y-6">

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <AlertBanner key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Inbound Leased (BTC)"
          value={subscriber.inboundLeased.toFixed(8)}
          subtitle="Total capacity leased"
        />
        <KPICard
          title="Expiring (≤14d)"
          value={subscriber.expiringLeases}
          subtitle="Leases expiring soon"
          trend={
            subscriber.expiringLeases > 0
              ? { value: subscriber.expiringLeases * 10, isPositive: false }
              : undefined
          }
        />
        <KPICard
          title="Effective Cost"
          value={`${subscriber.effectiveCostPPM} ppm`}
          subtitle={`${subscriber.effectiveCostFixed.toFixed(8)} BTC fixed`}
        />
        <KPICard
          title="Payment Success % (7D)"
          value={`${subscriber.paymentSuccessRate.toFixed(1)}%`}
          subtitle="7-day success rate"
        />
        <KPICard
          title="Open Incidents"
          value={subscriber.openIncidents}
          subtitle="Active issues"
        />
      </div>

      {/* Capacity Chart */}
      <ChartWrapper
        title="Delivered Inbound vs. Usage"
        defaultTimeRange="7d"
        timeRangeOptions={["7d", "30d", "90d"]}
        onTimeRangeChange={(range) => setTimeRange(range as "7d" | "30d" | "90d")}
      >
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="delivered"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                name="Delivered"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="used"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                name="Used"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="successRate"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Success Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartWrapper>

      {/* Quick Actions */}
      {subscriber.expiringLeases > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-yellow-900">
                {subscriber.expiringLeases} lease{subscriber.expiringLeases !== 1 ? "s" : ""} expiring soon
              </p>
              <p className="text-sm text-yellow-700">
                Renew now to avoid service interruption
              </p>
            </div>
            <Button variant="default" asChild>
              <a href="/subscriber/leases">
                Renew Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

