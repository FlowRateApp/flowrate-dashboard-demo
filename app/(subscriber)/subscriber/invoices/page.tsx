"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { getInvoicesBySubscriberId } from "@/lib/mock-data/subscriber";
import { MOCK_SUBSCRIBERS } from "@/lib/mock-data/subscriber";
import { format } from "date-fns";
import type { Invoice } from "@/types";
import { Download, ExternalLink } from "lucide-react";

// Get first subscriber for demo
const subscriber = MOCK_SUBSCRIBERS[0];
if (!subscriber) {
  throw new Error("No subscriber data available");
}
const subscriberId = subscriber.id;

const invoices = getInvoicesBySubscriberId(subscriberId);

// Table columns
const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    header: "Invoice ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id}</span>
    ),
  },
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
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      const currency = row.original.currency;
      return (
        <span>
          {currency === "BTC"
            ? `${amount.toFixed(8)} BTC`
            : `$${amount.toLocaleString()}`}
        </span>
      );
    },
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.currency}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const isOverdue = status === "overdue";
      return (
        <Badge
          variant={
            status === "paid"
              ? "default"
              : isOverdue
              ? "destructive"
              : "secondary"
          }
          className={isOverdue ? "bg-red-100 text-red-800" : ""}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate = new Date(row.original.dueDate);
      const isOverdue = dueDate < new Date();
      return (
        <span className={isOverdue ? "text-red-600 font-medium" : ""}>
          {format(dueDate, "MMM dd, yyyy")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" asChild>
        <a
          href={row.original.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download className="h-4 w-4 mr-1" />
          PDF
        </a>
      </Button>
    ),
  },
];

export default function SubscriberInvoices() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoices</h1>
      </div>
      <DataTable
        columns={columns}
        data={invoices}
        exportable
        exportFilename="subscriber-invoices"
      />
    </div>
  );
}

