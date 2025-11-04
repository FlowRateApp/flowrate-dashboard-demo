"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNodesByTreasuryId } from "@/lib/mock-data/treasury";
import { MOCK_TREASURIES } from "@/lib/mock-data/treasury";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle2, Clock, Server } from "lucide-react";

// Get first treasury for demo
const treasury = MOCK_TREASURIES[0];
if (!treasury) {
  throw new Error("No treasury data available");
}
const treasuryId = treasury.id;

const nodes = getNodesByTreasuryId(treasuryId);

function NodeHealthCard({ node }: { node: typeof nodes[0] }) {
  const statusColors = {
    online: "bg-green-500",
    offline: "bg-red-500",
    syncing: "bg-yellow-500",
  };

  const statusIcons = {
    online: CheckCircle2,
    offline: AlertTriangle,
    syncing: Clock,
  };

  const StatusIcon = statusIcons[node.status];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            {node.alias}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${statusColors[node.status]}`}
            />
            <Badge
              variant={
                node.status === "online"
                  ? "default"
                  : node.status === "offline"
                  ? "destructive"
                  : "secondary"
              }
            >
              {node.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Version</p>
            <p className="font-medium">{node.version}</p>
            {node.version < "v0.17.0" && (
              <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Outdated
              </p>
            )}
          </div>
          <div>
            <p className="text-muted-foreground">Ping</p>
            <p className="font-medium">{node.ping} ms</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Rebalance</p>
            <p className="font-medium">
              {format(new Date(node.lastRebalance), "MMM dd, HH:mm")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Uptime</p>
            <p className="font-medium">{node.uptime.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Channels</p>
            <p className="font-medium">{node.channelCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Capacity</p>
            <p className="font-medium">{node.capacity.toFixed(8)} BTC</p>
          </div>
        </div>
        <div className="pt-4 border-t space-y-2">
          <p className="text-sm font-medium">Fee Policy</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Base: </span>
              <span className="font-medium">{node.feeBaseMsat} msat</span>
            </div>
            <div>
              <span className="text-muted-foreground">PPM: </span>
              <span className="font-medium">{node.feePPM}</span>
            </div>
          </div>
        </div>
        {node.hasSigner && (
          <div className="pt-2">
            <Badge variant="outline" className="text-xs">
              Remote Signer Present
            </Badge>
          </div>
        )}
        {node.warnings.length > 0 && (
          <div className="pt-2 space-y-1">
            {node.warnings.map((warning, i) => (
              <p key={i} className="text-xs text-yellow-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {warning}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function TreasuryNodes() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Nodes</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <NodeHealthCard key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}

