"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { MOCK_STATEMENTS, MOCK_TREASURIES, MOCK_LEASES } from "@/lib/mock-data/treasury";
import { format } from "date-fns";
import type { Statement } from "@/types";
import { DollarSign, TrendingUp, Clock } from "lucide-react";

// Calculate aggregates
const totalRoutingFees = MOCK_STATEMENTS.reduce((sum, s) => sum + s.routingFeesEarned, 0);
const totalLeaseFees = MOCK_STATEMENTS.reduce((sum, s) => sum + s.leaseFeesEarned, 0);
const totalFlowrateMargin = MOCK_STATEMENTS.reduce((sum, s) => sum + s.flowrateMargin, 0);
const totalVolume = MOCK_LEASES.reduce((sum, l) => sum + l.size, 0);
const avgAPY = MOCK_TREASURIES.reduce((sum, t) => sum + t.netAPY, 0) / MOCK_TREASURIES.length;

// Treasury payouts (mock data)
const treasuryPayouts = MOCK_TREASURIES.map((t) => {
  const statements = MOCK_STATEMENTS.filter((s) => s.treasuryId === t.id);
  const totalNet = statements.reduce((sum, s) => sum + s.netTotal, 0);
  return {
    treasuryName: t.name,
    amount: totalNet,
    status: "pending" as const,
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
});

// Payouts columns
const payoutColumns: ColumnDef<typeof treasuryPayouts[0]>[] = [
  {
    accessorKey: "treasuryName",
    header: "Treasury",
  },
  {
    accessorKey: "amount",
    header: "Amount (BTC)",
    cell: ({ row }) => row.original.amount.toFixed(8),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: "scheduledDate",
    header: "Scheduled Date",
    cell: ({ row }) => format(new Date(row.original.scheduledDate), "MMM dd, yyyy"),
  },
];

// Statements summary columns
const statementColumns: ColumnDef<Statement>[] = [
  {
    accessorKey: "period",
    header: "Period",
    cell: ({ row }) => {
      const period = row.original.period;
      if (!period) return "N/A";
      const [year, month] = period.split("-");
      if (!year || !month) return period;
      return format(new Date(parseInt(year), parseInt(month) - 1), "MMMM yyyy");
    },
  },
  {
    accessorKey: "grossTotal",
    header: "Gross Total (BTC)",
    cell: ({ row }) => row.original.grossTotal.toFixed(8),
  },
  {
    accessorKey: "flowrateMargin",
    header: "Flowrate Margin (BTC)",
    cell: ({ row }) => row.original.flowrateMargin.toFixed(8),
  },
  {
    accessorKey: "netTotal",
    header: "Net Total (BTC)",
    cell: ({ row }) => row.original.netTotal.toFixed(8),
  },
];

export default function AdminFinance() {
  return (
    <div className="space-y-6">

      {/* Fee Accruals Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Total Routing Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalRoutingFees.toFixed(8)}</p>
            <p className="text-sm text-muted-foreground mt-1">BTC</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Total Lease Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalLeaseFees.toFixed(8)}</p>
            <p className="text-sm text-muted-foreground mt-1">BTC</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Flowrate Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalFlowrateMargin.toFixed(8)}</p>
            <p className="text-sm text-muted-foreground mt-1">BTC captured</p>
          </CardContent>
        </Card>
      </div>

      {/* Treasury Payouts Pending */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Treasury Payouts Pending</h2>
        <DataTable
          columns={payoutColumns}
          data={treasuryPayouts}
          exportable
          exportFilename="treasury-payouts"
        />
      </div>

      {/* Monthly Statements Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Statements Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium mb-1">Statements Generated</p>
              <p className="text-2xl font-bold">{MOCK_STATEMENTS.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Last 3 months</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium mb-1">Total Volume</p>
              <p className="text-2xl font-bold">{totalVolume.toFixed(8)}</p>
              <p className="text-xs text-muted-foreground mt-1">BTC deployed</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium mb-1">Average APY</p>
              <p className="text-2xl font-bold">{avgAPY.toFixed(2)}%</p>
              <p className="text-xs text-muted-foreground mt-1">Net to treasuries</p>
            </div>
          </div>
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-2">Recent Statements</h3>
            <DataTable
              columns={statementColumns}
              data={MOCK_STATEMENTS.slice(0, 5)}
              exportable={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

