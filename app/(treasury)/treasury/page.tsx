"use client";

import { useState, useMemo } from "react";
import { KPICard } from "@/components/dashboard/kpi-card";
import { ChartWrapper } from "@/components/dashboard/chart-wrapper";
import { DataTable } from "@/components/dashboard/data-table";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { Badge } from "@/components/ui/badge";
import {
  MOCK_TREASURIES,
  MOCK_LEASES,
  MOCK_YIELD_DATA,
} from "@/lib/mock-data/treasury";
import { getUnreadAlerts } from "@/lib/mock-data/shared";
import { ColumnDef } from "@tanstack/react-table";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";
import type { Lease } from "@/types";

export default function TreasuryOverview() {
  // Get first treasury for demo
  const treasury = MOCK_TREASURIES[0];
  if (!treasury) {
    throw new Error("No treasury data available");
  }
  const treasuryId = treasury.id;

  // Get top counterparties (leases)
  const topCounterparties = MOCK_LEASES.filter(
    (l) => l.treasuryId === treasuryId && l.status === "active"
  )
    .slice(0, 10)
    .sort((a, b) => b.size - a.size);

  // Get alerts
  const alerts = getUnreadAlerts(treasuryId, "treasury");

  // Time range state for chart
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");

  // Prepare yield chart data based on selected time range
  const chartData = useMemo(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const data = MOCK_YIELD_DATA.slice(-days);
    return data.map((point) => ({
      date: format(new Date(point.date), "MMM dd"),
      routing: point.routingYield,
      lease: point.leaseYield,
    }));
  }, [timeRange]);

  const chartConfig = {
    routing: {
      label: "Routing Yield",
      color: "hsl(var(--chart-1))",
    },
    lease: {
      label: "Lease Yield",
      color: "hsl(var(--chart-2))",
    },
  };

  // Top Counterparties table columns
  const counterpartyColumns: ColumnDef<Lease>[] = [
    {
      accessorKey: "lesseeAlias",
      header: "Lessee",
    },
    {
      accessorKey: "size",
      header: "Inbound Size (BTC)",
      cell: ({ row }) => {
        return row.original.size.toFixed(8);
      },
    },
    {
      accessorKey: "endDate",
      header: "Term",
      cell: ({ row }) => {
        const start = format(new Date(row.original.startDate), "MMM dd");
        const end = format(new Date(row.original.endDate), "MMM dd");
        return `${start} - ${end}`;
      },
    },
    {
      accessorKey: "daysRemaining",
      header: "Days Left",
      cell: ({ row }) => {
        const days = row.original.daysRemaining;
        return days > 0 ? `${days}` : "Expired";
      },
    },
    {
      accessorKey: "effectiveCostPPM",
      header: "Effective Cost (ppm)",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Badge variant="outline">Non-Custodial</Badge>
      </div>

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
          title="Deployed BTC"
          value={treasury.deployedBTC.toFixed(8)}
          subtitle="Total capital deployed"
        />
        <KPICard
          title="Gross APY"
          value={`${treasury.grossAPY.toFixed(2)}%`}
          subtitle="Before Flowrate margin"
        />
        <KPICard
          title="Net APY"
          value={`${treasury.netAPY.toFixed(2)}%`}
          subtitle="After Flowrate margin"
          trend={{ value: 2.5, isPositive: true }}
        />
        <KPICard
          title="Earned to Date"
          value={treasury.earnedToDate.toFixed(8)}
          subtitle="Total BTC earned"
        />
        <KPICard
          title="Active Leases"
          value={treasury.activeLeases}
          subtitle="Currently active"
        />
        <KPICard
          title="Utilization %"
          value={`${treasury.utilization.toFixed(1)}%`}
          subtitle="Channel utilization"
        />
        <KPICard
          title="Node Uptime"
          value={`${treasury.averageUptime.toFixed(1)}%`}
          subtitle="Average across nodes"
        />
      </div>

      {/* Yield Chart */}
      <ChartWrapper
        title="Yield Over Time"
        defaultTimeRange="7d"
        timeRangeOptions={["7d", "30d", "90d"]}
        onTimeRangeChange={(range) =>
          setTimeRange(range as "7d" | "30d" | "90d")
        }
      >
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="routing"
                stackId="1"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="lease"
                stackId="1"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartWrapper>

      {/* Top Counterparties Table */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Top Counterparties</h2>
        <DataTable
          columns={counterpartyColumns}
          data={topCounterparties}
          exportable
          exportFilename="treasury-top-counterparties"
        />
      </div>
    </div>
  );
}
