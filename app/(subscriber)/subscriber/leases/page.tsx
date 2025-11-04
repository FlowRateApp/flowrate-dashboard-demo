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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { getLeasesBySubscriberId, MOCK_LEASES } from "@/lib/mock-data/treasury";
import { MOCK_SUBSCRIBERS } from "@/lib/mock-data/subscriber";
import { format } from "date-fns";
import type { Lease } from "@/types";
import { RefreshCw, TrendingUp, X, Plus } from "lucide-react";

// Get first subscriber for demo
const subscriber = MOCK_SUBSCRIBERS[0];
if (!subscriber) {
  throw new Error("No subscriber data available");
}
const subscriberId = subscriber.id;

// Get leases for this subscriber
const leases = getLeasesBySubscriberId(subscriberId);

function RequestCapacityDialog() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState("");
  const [term, setTerm] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const handleSubmit = () => {
    // Submit ticket logic here
    console.log("Submitting capacity request:", { size, term, priceMin, priceMax });
    setOpen(false);
    // Reset form
    setSize("");
    setTerm("");
    setPriceMin("");
    setPriceMax("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Request More Capacity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request More Capacity</DialogTitle>
          <DialogDescription>
            Submit a capacity request ticket. Our team will match you with available treasuries.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="size">Size (BTC)</Label>
            <Input
              id="size"
              type="number"
              step="0.00000001"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="0.5"
            />
          </div>
          <div>
            <Label htmlFor="term">Term (days)</Label>
            <Input
              id="term"
              type="number"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="90"
            />
          </div>
          <div>
            <Label htmlFor="priceMin">Min Price (ppm)</Label>
            <Input
              id="priceMin"
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder="50"
            />
          </div>
          <div>
            <Label htmlFor="priceMax">Max Price (ppm)</Label>
            <Input
              id="priceMax"
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Request</Button>
        </div>
      </DialogContent>
    </Dialog>
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
    accessorKey: "treasuryId",
    header: "Pool/Treasury",
    cell: ({ row }) => (
      <span className="text-muted-foreground">Treasury {row.original.treasuryId}</span>
    ),
  },
  {
    accessorKey: "size",
    header: "Inbound Size (BTC)",
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
    cell: ({ row }) => {
      const days = row.original.daysRemaining;
      const isExpiring = days <= 14 && days > 0;
      return (
        <div className="flex items-center gap-2">
          {isExpiring && (
            <Button variant="default" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Renew Now
            </Button>
          )}
          {row.original.status === "active" && (
            <>
              <Button variant="ghost" size="sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                Scale
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </>
          )}
        </div>
      );
    },
  },
];

export default function SubscriberLeases() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <RequestCapacityDialog />
      </div>
      <DataTable
        columns={columns}
        data={leases}
        exportable
        exportFilename="subscriber-leases"
      />
    </div>
  );
}

