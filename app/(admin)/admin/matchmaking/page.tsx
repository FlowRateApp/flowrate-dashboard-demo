"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { MOCK_DEMAND_TICKETS } from "@/lib/mock-data/subscriber";
import { MOCK_TREASURY_POOLS } from "@/lib/mock-data/admin";
import { format } from "date-fns";
import type { DemandTicket, TreasuryPool } from "@/types";
import { CheckCircle2, X } from "lucide-react";

// Demand Tickets columns
const demandTicketColumns: ColumnDef<DemandTicket>[] = [
  {
    accessorKey: "id",
    header: "Ticket ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "size",
    header: "Size (BTC)",
    cell: ({ row }) => row.original.size.toFixed(8),
  },
  {
    accessorKey: "term",
    header: "Term (days)",
  },
  {
    accessorKey: "priceRange",
    header: "Price Range (ppm)",
    cell: ({ row }) => `${row.original.priceMin} - ${row.original.priceMax}`,
  },
  {
    accessorKey: "riskTier",
    header: "Risk Tier",
    cell: ({ row }) => {
      const tier = row.original.riskTier;
      return (
        <Badge
          variant={
            tier === "low"
              ? "default"
              : tier === "medium"
              ? "secondary"
              : "destructive"
          }
        >
          {tier}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === "matched"
              ? "default"
              : status === "rejected"
              ? "destructive"
              : "secondary"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => format(new Date(row.original.createdAt), "MMM dd, yyyy"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      if (row.original.status !== "pending") return null;
      return <AllocateDialog ticket={row.original} />;
    },
  },
];

// Treasury Pools columns
const treasuryPoolColumns: ColumnDef<TreasuryPool>[] = [
  {
    accessorKey: "name",
    header: "Pool Name",
  },
  {
    accessorKey: "totalCapacity",
    header: "Total Capacity (BTC)",
    cell: ({ row }) => row.original.totalCapacity.toFixed(8),
  },
  {
    accessorKey: "availableCapacity",
    header: "Available (BTC)",
    cell: ({ row }) => row.original.availableCapacity.toFixed(8),
  },
  {
    accessorKey: "policy",
    header: "Policy",
    cell: ({ row }) => {
      const policy = row.original.policy;
      return (
        <div className="text-xs space-y-1">
          <div>Min Term: {policy.minTerm} days</div>
          <div>Max Exposure: {policy.maxExposure.toFixed(8)} BTC</div>
          <div>Jurisdictions: {policy.jurisdictions.join(", ")}</div>
        </div>
      );
    },
  },
];

function AllocateDialog({ ticket }: { ticket: DemandTicket }) {
  const [open, setOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<string>("");
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [feePPM, setFeePPM] = useState("");

  const handleAllocate = () => {
    console.log("Allocating:", { ticket, selectedPool, allocatedAmount, feePPM });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Allocate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Allocate Capacity</DialogTitle>
          <DialogDescription>
            Match demand ticket {ticket.id} with a treasury pool
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <Label className="text-xs">Requested Size</Label>
              <p className="font-medium">{ticket.size.toFixed(8)} BTC</p>
            </div>
            <div>
              <Label className="text-xs">Term</Label>
              <p className="font-medium">{ticket.term} days</p>
            </div>
            <div>
              <Label className="text-xs">Price Range</Label>
              <p className="font-medium">{ticket.priceMin} - {ticket.priceMax} ppm</p>
            </div>
            <div>
              <Label className="text-xs">Risk Tier</Label>
              <Badge variant="outline">{ticket.riskTier}</Badge>
            </div>
          </div>

          <div>
            <Label htmlFor="pool">Select Treasury Pool</Label>
            <select
              id="pool"
              value={selectedPool}
              onChange={(e) => setSelectedPool(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            >
              <option value="">Select a pool...</option>
              {MOCK_TREASURY_POOLS.map((pool) => (
                <option key={pool.id} value={pool.id}>
                  {pool.name} ({pool.availableCapacity.toFixed(8)} BTC available)
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="amount">Allocated Amount (BTC)</Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              value={allocatedAmount}
              onChange={(e) => setAllocatedAmount(e.target.value)}
              placeholder={ticket.size.toString()}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Can allocate partial or full amount
            </p>
          </div>

          <div>
            <Label htmlFor="feePPM">Fee PPM</Label>
            <Input
              id="feePPM"
              type="number"
              value={feePPM}
              onChange={(e) => setFeePPM(e.target.value)}
              placeholder={`${ticket.priceMin} - ${ticket.priceMax}`}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAllocate} disabled={!selectedPool || !allocatedAmount || !feePPM}>
            Issue Contract
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminMatchmaking() {
  return (
    <div className="space-y-6">

      {/* Demand Tickets */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Demand Tickets</h2>
        <DataTable
          columns={demandTicketColumns}
          data={MOCK_DEMAND_TICKETS}
          exportable
          exportFilename="demand-tickets"
        />
      </div>

      {/* Treasury Pools */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Treasury Pools</h2>
        <DataTable
          columns={treasuryPoolColumns}
          data={MOCK_TREASURY_POOLS}
          exportable
          exportFilename="treasury-pools"
        />
      </div>
    </div>
  );
}

