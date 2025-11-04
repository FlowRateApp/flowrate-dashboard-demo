"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { GlossaryPopover } from "@/components/dashboard/glossary-popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
  MOCK_CHANNELS,
  MOCK_NODES,
  getNodesByTreasuryId,
  getChannelsByNodeId,
} from "@/lib/mock-data/treasury";
import { MOCK_TREASURIES } from "@/lib/mock-data/treasury";
import type { Channel } from "@/types";
import { X } from "lucide-react";
import { format } from "date-fns";

// Get first treasury for demo
const treasury = MOCK_TREASURIES[0];
if (!treasury) {
  throw new Error("No treasury data available");
}
const treasuryId = treasury.id;

// Get all channels for treasury's nodes
const nodes = getNodesByTreasuryId(treasuryId);
const allChannels = nodes.flatMap((node) => getChannelsByNodeId(node.id));

// Channel detail drawer component
function ChannelDetailDrawer({ channel }: { channel: Channel }) {
  const node = nodes.find((n) => n.id === channel.nodeId);
  
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Channel Details</DrawerTitle>
            <DrawerDescription>Channel ID: {channel.id}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Channel ID</p>
                <p className="font-mono text-xs font-medium">{channel.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Node</p>
                <p className="font-medium">{node?.alias || channel.nodeId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peer</p>
                <p className="font-mono text-xs font-medium">{channel.peer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={channel.isActive ? "default" : "secondary"}>
                  {channel.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-medium">{channel.capacity.toFixed(8)} BTC</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Utilization</p>
                <p className="font-medium">{channel.utilization.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Local Balance</p>
                <p className="font-medium">{channel.localBalance.toFixed(8)} BTC</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remote Balance</p>
                <p className="font-medium">{channel.remoteBalance.toFixed(8)} BTC</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Base Fee</p>
                <p className="font-medium">{channel.baseFee} msat</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fee PPM</p>
                <p className="font-medium">{channel.feePPM}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">HTLC Success Rate</p>
                <p className="font-medium">{channel.htlcSuccessRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="font-medium">{channel.uptime.toFixed(1)}%</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {format(new Date(channel.lastUpdated), "MMM dd, yyyy HH:mm:ss")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// Table columns
const columns: ColumnDef<Channel>[] = [
  {
    accessorKey: "peer",
    header: "Peer",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.peer}</span>
    ),
  },
  {
    accessorKey: "capacity",
    header: "Capacity (BTC)",
    cell: ({ row }) => row.original.capacity.toFixed(8),
  },
  {
    accessorKey: "localBalance",
    header: "Local Balance",
    cell: ({ row }) => row.original.localBalance.toFixed(8),
  },
  {
    accessorKey: "remoteBalance",
    header: "Remote Balance",
    cell: ({ row }) => row.original.remoteBalance.toFixed(8),
  },
  {
    accessorKey: "utilization",
    header: () => (
      <div className="flex items-center gap-2">
        Utilization %
        <GlossaryPopover
          term="Utilization %"
          definition="Channel utilization is calculated as: (Total routed volume over time period ÷ Total channel capacity) × 100. This metric shows how actively the channel is being used for routing payments."
        />
      </div>
    ),
    cell: ({ row }) => {
      const util = row.original.utilization;
      return (
        <span className={util > 80 ? "text-green-600 font-medium" : ""}>
          {util.toFixed(1)}%
        </span>
      );
    },
  },
  {
    accessorKey: "baseFee",
    header: "Base Fee",
    cell: ({ row }) => `${row.original.baseFee} msat`,
  },
  {
    accessorKey: "feePPM",
    header: "Fee PPM",
    cell: ({ row }) => row.original.feePPM,
  },
  {
    accessorKey: "htlcSuccessRate",
    header: "HTLC Success Rate",
    cell: ({ row }) => `${row.original.htlcSuccessRate.toFixed(1)}%`,
  },
  {
    accessorKey: "uptime",
    header: "Uptime",
    cell: ({ row }) => `${row.original.uptime.toFixed(1)}%`,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ChannelDetailDrawer channel={row.original} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={!row.original.isActive}>
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Close Channel?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to close channel {row.original.id}? This
                action will initiate the channel closure process. The channel
                will remain open until all pending HTLCs are settled.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Close Channel</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ),
  },
];

export default function TreasuryChannels() {
  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={allChannels}
        exportable
        exportFilename="treasury-channels"
      />
    </div>
  );
}

