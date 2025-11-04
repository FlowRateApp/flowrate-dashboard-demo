"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { MOCK_COMPLIANCE_RECORDS } from "@/lib/mock-data/admin";
import { MOCK_TREASURIES } from "@/lib/mock-data/treasury";
import { MOCK_SUBSCRIBERS } from "@/lib/mock-data/subscriber";
import { format } from "date-fns";
import type { ComplianceRecord } from "@/types";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

// Get entity names for display
function getEntityName(record: ComplianceRecord): string {
  if (record.entityType === "treasury") {
    const treasury = MOCK_TREASURIES.find((t) => t.id === record.entityId);
    return treasury?.name || record.entityId;
  } else {
    const subscriber = MOCK_SUBSCRIBERS.find((s: typeof MOCK_SUBSCRIBERS[0]) => s.id === record.entityId);
    return subscriber?.name || record.entityId;
  }
}

// Compliance records columns
const complianceColumns: ColumnDef<ComplianceRecord>[] = [
  {
    accessorKey: "entityName",
    header: "Entity Name",
    cell: ({ row }) => getEntityName(row.original),
  },
  {
    accessorKey: "entityType",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.entityType}</Badge>
    ),
  },
  {
    accessorKey: "kycChecklist",
    header: "KYC Checklist",
    cell: ({ row }) => {
      const checklist = row.original.kycChecklist;
      const allVerified = checklist.idVerified && checklist.addressVerified && checklist.entityVerified;
      return (
        <div className="flex items-center gap-2">
          {allVerified ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-yellow-600" />
          )}
          <span className="text-xs">
            ID: {checklist.idVerified ? "✓" : "✗"}, Addr: {checklist.addressVerified ? "✓" : "✗"}, Entity: {checklist.entityVerified ? "✓" : "✗"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "documentsReceived",
    header: "Documents",
  },
  {
    accessorKey: "riskScore",
    header: "Risk Score",
    cell: ({ row }) => {
      const score = row.original.riskScore;
      return (
        <Badge
          variant={
            score < 30
              ? "default"
              : score < 70
              ? "secondary"
              : "destructive"
          }
        >
          {score}
        </Badge>
      );
    },
  },
  {
    accessorKey: "sanctionsCheck",
    header: "Sanctions",
    cell: ({ row }) => {
      const check = row.original.sanctionsCheck;
      return (
        <Badge
          variant={
            check === "pass"
              ? "default"
              : check === "fail"
              ? "destructive"
              : "secondary"
          }
        >
          {check}
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
            status === "approved"
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
    accessorKey: "lastUpdated",
    header: "Last Updated",
    cell: ({ row }) => format(new Date(row.original.lastUpdated), "MMM dd, yyyy"),
  },
];

export default function AdminCompliance() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compliance & Risk</h1>
      </div>

      {/* KYC/KYB Status */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">KYC/KYB Status</h2>
        <DataTable
          columns={complianceColumns}
          data={MOCK_COMPLIANCE_RECORDS}
          exportable
          exportFilename="compliance-records"
        />
      </div>

      {/* Lease Policy Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Lease Policy Rules</CardTitle>
          <CardDescription>
            Configure default lease policy rules and constraints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium mb-1">Minimum Term</p>
              <p className="text-2xl font-bold">30 days</p>
              <p className="text-xs text-muted-foreground mt-1">Default minimum lease duration</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium mb-1">Max Single Exposure</p>
              <p className="text-2xl font-bold">20 BTC</p>
              <p className="text-xs text-muted-foreground mt-1">Maximum per lessee</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium mb-1">Jurisdictions</p>
              <p className="text-lg font-medium">US, EU, CA</p>
              <p className="text-xs text-muted-foreground mt-1">Allowed jurisdictions</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Note: Policy rules are managed off-dashboard. Contact system administrator to modify.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

