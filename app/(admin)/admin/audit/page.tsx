"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { MOCK_AUDIT_LOGS } from "@/lib/mock-data/admin";
import { MOCK_TREASURIES } from "@/lib/mock-data/treasury";
import { MOCK_SUBSCRIBERS } from "@/lib/mock-data/subscriber";
import { format } from "date-fns";
import type { AuditLog } from "@/types";
import { ChevronDown, ChevronRight } from "lucide-react";

// User management data (derived from treasuries and subscribers)
const userManagementData = [
  ...MOCK_TREASURIES.map((t) => ({
    name: t.name,
    role: "Treasury" as const,
    lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    apiKeyCount: 0,
    status: "active" as const,
  })),
  ...MOCK_SUBSCRIBERS.map((s: typeof MOCK_SUBSCRIBERS[0]) => ({
    name: s.name,
    role: "Subscriber" as const,
    lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    apiKeyCount: Math.floor(Math.random() * 3) + 1,
    status: "active" as const,
  })),
];

// Audit log columns
const auditLogColumns: ColumnDef<AuditLog>[] = [
  {
    id: "expand",
    cell: ({ row }) => {
      const [expanded, setExpanded] = useState(false);
      return (
        <button onClick={() => setExpanded(!expanded)} className="p-1">
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
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => format(new Date(row.original.timestamp), "MMM dd, yyyy HH:mm:ss"),
  },
  {
    accessorKey: "actor",
    header: "Actor",
    cell: ({ row }) => {
      const actor = row.original.actor;
      return (
        <div className="flex items-center gap-2">
          <Badge variant={actor.type === "user" ? "default" : "secondary"}>
            {actor.type}
          </Badge>
          <span className="text-sm">{actor.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.action}</span>
    ),
  },
  {
    accessorKey: "entityType",
    header: "Entity Type",
  },
  {
    accessorKey: "entityId",
    header: "Entity ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.entityId}</span>
    ),
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.ipAddress || "N/A"}</span>
    ),
  },
];

// User management columns
const userColumns: ColumnDef<typeof userManagementData[0]>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.role}</Badge>
    ),
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => format(new Date(row.original.lastLogin), "MMM dd, yyyy"),
  },
  {
    accessorKey: "apiKeyCount",
    header: "API Keys",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <button className="text-sm text-primary hover:underline">View Details</button>
    ),
  },
];

export default function AdminAudit() {
  const [actorFilter, setActorFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");

  const filteredLogs = MOCK_AUDIT_LOGS.filter((log) => {
    if (actorFilter !== "all" && log.actor.type !== actorFilter) return false;
    if (actionFilter !== "all" && !log.action.includes(actionFilter)) return false;
    if (entityFilter !== "all" && log.entityType !== entityFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Audit & Users</h1>
      </div>

      {/* Audit Log */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Audit Log</h2>
          <div className="flex items-center gap-2">
            <Select value={actorFilter} onValueChange={setActorFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Actor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actors</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="lease">Lease</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="channel">Channel</SelectItem>
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="Lease">Lease</SelectItem>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Channel">Channel</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DataTable
          columns={auditLogColumns}
          data={filteredLogs}
          exportable
          exportFilename="audit-logs"
        />
      </div>

      {/* User Management */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">User Management</h2>
        <DataTable
          columns={userColumns}
          data={userManagementData}
          exportable
          exportFilename="users"
        />
      </div>
    </div>
  );
}

