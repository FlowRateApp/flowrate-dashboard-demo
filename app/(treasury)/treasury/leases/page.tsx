"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { MOCK_LEASES, getLeasesByTreasuryId } from "@/lib/mock-data/treasury";
import { MOCK_TREASURIES } from "@/lib/mock-data/treasury";
import { format } from "date-fns";
import type { Lease } from "@/types";
import { RefreshCw, TrendingUp, Download } from "lucide-react";

// Get first treasury for demo
const treasury = MOCK_TREASURIES[0];
if (!treasury) {
  throw new Error("No treasury data available");
}
const treasuryId = treasury.id;

const leases = getLeasesByTreasuryId(treasuryId);

// Lease detail drawer component
function LeaseDetailDrawer({ lease }: { lease: Lease }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Lease Details</DrawerTitle>
            <DrawerDescription>Lease ID: {lease.id}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Counterparty</p>
                <p className="font-medium">{lease.lesseeAlias}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Size</p>
                <p className="font-medium">{lease.size.toFixed(8)} BTC</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {format(new Date(lease.startDate), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">
                  {format(new Date(lease.endDate), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
                <p className="font-medium">{lease.daysRemaining}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fee Model</p>
                <p className="font-medium">{lease.feeModel}</p>
              </div>
              {lease.feeModel === "fixed" && lease.feeAmount && (
                <div>
                  <p className="text-sm text-muted-foreground">Fee Amount</p>
                  <p className="font-medium">{lease.feeAmount.toFixed(8)} BTC</p>
                </div>
              )}
              {lease.feeModel === "ppm" && lease.feePPM && (
                <div>
                  <p className="text-sm text-muted-foreground">Fee PPM</p>
                  <p className="font-medium">{lease.feePPM}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Effective Cost</p>
                <p className="font-medium">{lease.effectiveCostPPM} ppm</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={
                    lease.status === "active"
                      ? "default"
                      : lease.status === "pending"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {lease.status}
                </Badge>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Invoices & Settlements</p>
              <p className="text-sm text-muted-foreground">
                Settlement timeline will be displayed here in a future update.
              </p>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// Table columns
const columns: ColumnDef<Lease>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "lesseeAlias",
    header: "Counterparty",
  },
  {
    accessorKey: "size",
    header: "Size (BTC)",
    cell: ({ row }) => row.original.size.toFixed(8),
  },
  {
    accessorKey: "term",
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
      return days > 0 ? (
        <span className={days <= 14 ? "text-yellow-600 font-medium" : ""}>
          {days}
        </span>
      ) : (
        <span className="text-muted-foreground">Expired</span>
      );
    },
  },
  {
    accessorKey: "feeModel",
    header: "Fee Model",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.feeModel.toUpperCase()}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === "active"
              ? "default"
              : status === "pending"
              ? "secondary"
              : "outline"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <LeaseDetailDrawer lease={row.original} />
        {row.original.status === "active" && (
          <>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Renew
            </Button>
            <Button variant="ghost" size="sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              Increase
            </Button>
          </>
        )}
      </div>
    ),
  },
];

export default function TreasuryLeases() {
  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={leases}
        exportable
        exportFilename="treasury-leases"
      />
    </div>
  );
}

