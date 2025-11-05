"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { getStatementsByTreasuryId } from "@/lib/mock-data/treasury";
import { MOCK_TREASURIES } from "@/lib/mock-data/treasury";
import { format } from "date-fns";
import type { Statement } from "@/types";
import { Download } from "lucide-react";
import { useExportCSV } from "@/hooks/use-export-csv";

// Get first treasury for demo
const treasury = MOCK_TREASURIES[0];
if (!treasury) {
  throw new Error("No treasury data available");
}
const treasuryId = treasury.id;

const statements = getStatementsByTreasuryId(treasuryId);

// Export button component
function ExportButton({ statement }: { statement: Statement }) {
  const { exportToCSV } = useExportCSV();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        exportToCSV([statement], `statement-${statement.period}`);
      }}
    >
      <Download className="h-4 w-4 mr-1" />
      CSV
    </Button>
  );
}

// Table columns
const columns: ColumnDef<Statement>[] = [
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
    accessorKey: "leaseFeesEarned",
    header: "Lease Fees (BTC)",
    cell: ({ row }) => row.original.leaseFeesEarned.toFixed(8),
  },
  {
    accessorKey: "routingFeesEarned",
    header: "Routing Fees (BTC)",
    cell: ({ row }) => row.original.routingFeesEarned.toFixed(8),
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
    cell: ({ row }) => (
      <span className="font-medium">{row.original.netTotal.toFixed(8)}</span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ExportButton statement={row.original} />
        <Button variant="outline" size="sm" asChild>
          <a
            href={row.original.downloadUrls.pdf}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="h-4 w-4 mr-1" />
            PDF
          </a>
        </Button>
      </div>
    ),
  },
];

export default function TreasuryBilling() {
  if (!treasury) {
    throw new Error("No treasury data available");
  }

  return (
    <div className="space-y-6">
      {/* Monthly Statements */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Monthly Statements</h2>
        <DataTable
          columns={columns}
          data={statements}
          exportable
          exportFilename="treasury-statements"
        />
      </div>

      {/* Payout Destinations */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Destinations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Payout destinations are managed off-dashboard. Current address:
            </p>
            {treasury.payoutAddress && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Bitcoin Address
                </p>
                <p className="font-mono text-sm break-all">
                  {treasury.payoutAddress}
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Note: Address management is handled through the Flowrate admin
              panel.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
