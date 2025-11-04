"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { MOCK_CHANNELS, MOCK_NODES } from "@/lib/mock-data/treasury";
import { ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";

// Add lifecycle state to channels (mock data)
type ChannelWithLifecycle = typeof MOCK_CHANNELS[0] & {
  lifecycleState: "Pending" | "Opening" | "Active" | "Closing" | "Splicing";
  logs: string[];
};

const channelsWithLifecycle: ChannelWithLifecycle[] = MOCK_CHANNELS.slice(0, 20).map((ch, i): ChannelWithLifecycle => ({
  ...ch,
  lifecycleState: (["Pending", "Opening", "Active", "Closing", "Splicing"] as const)[
    i % 5
  ] || "Pending",
  logs: [
    `Channel ${ch.id} initialized`,
    `Opening transaction broadcasted`,
    `Channel confirmed on-chain`,
    `Channel ready for routing`,
  ],
}));

// Channel lifecycle columns
const channelColumns: ColumnDef<ChannelWithLifecycle>[] = [
  {
    id: "expand",
    cell: ({ row }) => {
      const [expanded, setExpanded] = useState(false);
      return (
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Channel ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "lifecycleState",
    header: "State",
    cell: ({ row }) => {
      const state = row.original.lifecycleState;
      return (
        <Badge
          variant={
            state === "Active"
              ? "default"
              : state === "Pending" || state === "Opening"
              ? "secondary"
              : "destructive"
          }
        >
          {state}
        </Badge>
      );
    },
  },
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
    accessorKey: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = new Date(row.original.lastUpdated);
      return date.toLocaleString();
    },
  },
];

// Node fleet columns
const nodeColumns: ColumnDef<typeof MOCK_NODES[0]>[] = [
  {
    accessorKey: "alias",
    header: "Node Alias",
  },
  {
    accessorKey: "version",
    header: "Version",
    cell: ({ row }) => {
      const version = row.original.version;
      const isOutdated = version < "v0.17.0";
      return (
        <div className="flex items-center gap-2">
          <span>{version}</span>
          {isOutdated && (
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "uptime",
    header: "Uptime %",
    cell: ({ row }) => `${row.original.uptime.toFixed(1)}%`,
  },
  {
    accessorKey: "hasSigner",
    header: "Signer",
    cell: ({ row }) => (
      <Badge variant={row.original.hasSigner ? "default" : "secondary"}>
        {row.original.hasSigner ? "Present" : "Missing"}
      </Badge>
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
            status === "online"
              ? "default"
              : status === "offline"
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
    accessorKey: "warnings",
    header: "Warnings",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.warnings.map((w, i) => (
          <Badge key={i} variant="outline" className="text-xs">
            {w}
          </Badge>
        ))}
      </div>
    ),
  },
];

export default function AdminOrchestration() {
  return (
    <div className="space-y-6">

      {/* Channel Lifecycle */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Channel Lifecycle</h2>
        <DataTable
          columns={channelColumns}
          data={channelsWithLifecycle}
          exportable
          exportFilename="channel-lifecycle"
        />
      </div>

      {/* Node Fleet Status */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Node Fleet Status</h2>
        <DataTable
          columns={nodeColumns}
          data={MOCK_NODES}
          exportable
          exportFilename="node-fleet"
        />
      </div>
    </div>
  );
}

