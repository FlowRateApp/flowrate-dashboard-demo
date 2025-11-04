"use client";

import { useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import {
  getAPIKeysBySubscriberId,
  getWebhooksBySubscriberId,
  MOCK_API_KEYS,
  MOCK_WEBHOOKS,
} from "@/lib/mock-data/subscriber";
import { MOCK_SUBSCRIBERS } from "@/lib/mock-data/subscriber";
import { format } from "date-fns";
import type { APIKey, Webhook } from "@/types";
import { Plus, Copy, Eye, EyeOff, TestTube } from "lucide-react";

// Get first subscriber for demo
const subscriber = MOCK_SUBSCRIBERS[0];
if (!subscriber) {
  throw new Error("No subscriber data available");
}
const subscriberId = subscriber.id;

const apiKeys = getAPIKeysBySubscriberId(subscriberId);
const webhooks = getWebhooksBySubscriberId(subscriberId);

// API Keys columns
const apiKeyColumns: ColumnDef<APIKey>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "keyPrefix",
    header: "Key Prefix",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.keyPrefix}...</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => format(new Date(row.original.createdAt), "MMM dd, yyyy"),
  },
  {
    accessorKey: "lastUsed",
    header: "Last Used",
    cell: ({ row }) =>
      row.original.lastUsed
        ? format(new Date(row.original.lastUsed), "MMM dd, yyyy")
        : "Never",
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.permissions.map((p) => (
          <Badge key={p} variant="outline">
            {p}
          </Badge>
        ))}
      </div>
    ),
  },
];

// Webhooks columns
const webhookColumns: ColumnDef<Webhook>[] = [
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.url}</span>
    ),
  },
  {
    accessorKey: "events",
    header: "Events",
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        {row.original.events.map((e) => (
          <Badge key={e} variant="outline">
            {e}
          </Badge>
        ))}
      </div>
    ),
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
    accessorKey: "lastTriggered",
    header: "Last Triggered",
    cell: ({ row }) =>
      row.original.lastTriggered
        ? format(new Date(row.original.lastTriggered), "MMM dd, HH:mm")
        : "Never",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">
        <TestTube className="h-4 w-4 mr-1" />
        Test
      </Button>
    ),
  },
];

function CreateAPIKeyDialog() {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [showKey, setShowKey] = useState(true);
  const [generatedKey] = useState("frl_abcd1234efgh5678ijkl9012mnop3456");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            This key will only be shown once. Make sure to copy it securely.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Production API Key"
            />
          </div>
          <div>
            <Label>API Key</Label>
            <div className="flex items-center gap-2">
              <Input
                value={generatedKey}
                readOnly
                type={showKey ? "text" : "password"}
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigator.clipboard.writeText(generatedKey)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ⚠️ Save this key now. You won't be able to see it again.
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SamplePayloadCard({ event, payload }: { event: string; payload: object }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{event}</CardTitle>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="text-xs bg-muted p-3 rounded overflow-auto">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}

export default function SubscriberIntegration() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Integration</h1>
      </div>

      {/* API Keys */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">API Keys</h2>
          <CreateAPIKeyDialog />
        </div>
        <DataTable columns={apiKeyColumns} data={apiKeys} />
      </div>

      {/* Webhooks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Webhook Endpoints</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Webhook
          </Button>
        </div>
        <DataTable columns={webhookColumns} data={webhooks} />
      </div>

      {/* IP Allowlist */}
      <Card>
        <CardHeader>
          <CardTitle>IP Allowlist</CardTitle>
          <CardDescription>
            Restrict API access to specific IP addresses or CIDR ranges
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              IP allowlist management is currently managed off-dashboard.
              Contact support to update your IP allowlist.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sample Payloads */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Sample Webhook Payloads</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <SamplePayloadCard
            event="capacity-delivered"
            payload={{
              event: "capacity-delivered",
              leaseId: "lease_001",
              size: "1.5",
              timestamp: "2024-01-15T10:30:00Z",
            }}
          />
          <SamplePayloadCard
            event="expiry-warning"
            payload={{
              event: "expiry-warning",
              leaseId: "lease_001",
              daysRemaining: 7,
              timestamp: "2024-01-15T10:30:00Z",
            }}
          />
          <SamplePayloadCard
            event="incident"
            payload={{
              event: "incident",
              incidentId: "inc_001",
              severity: "warning",
              message: "Channel utilization below threshold",
              timestamp: "2024-01-15T10:30:00Z",
            }}
          />
        </div>
      </div>
    </div>
  );
}

