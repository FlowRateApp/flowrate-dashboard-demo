"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { Badge } from "@/components/ui/badge";
import { getSubscriberById } from "@/lib/mock-data/subscriber";
import { getUnreadAlerts } from "@/lib/mock-data/shared";
import { MOCK_SUBSCRIBERS } from "@/lib/mock-data/subscriber";
import { format } from "date-fns";
import { Activity, Network, Clock, CheckCircle2 } from "lucide-react";

// Get first subscriber for demo
const subscriber = MOCK_SUBSCRIBERS[0];
if (!subscriber) {
  throw new Error("No subscriber data available");
}
const subscriberId = subscriber.id;

const alerts = getUnreadAlerts(subscriberId, "subscriber");

export default function SubscriberHealth() {
  if (!subscriber) {
    throw new Error("No subscriber data available");
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Health</h1>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <AlertBanner key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* Health Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Channel Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{subscriber.channelCount}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Active channels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Payment Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {subscriber.paymentSuccessRate.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              7-day average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Last Policy Update
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              {format(new Date(subscriber.lastPolicyUpdate), "MMM dd, yyyy")}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Policy last updated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Open Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{subscriber.openIncidents}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Active issues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Primary Peers */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Peers</CardTitle>
          <CardDescription>
            Primary Lightning Network peers for this subscriber
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {subscriber.primaryPeers.map((peer) => (
              <Badge key={peer} variant="outline" className="font-mono text-xs">
                {peer}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Uptime Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Uptime Summary</CardTitle>
          <CardDescription>
            Overall system availability metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Channel Availability
              </span>
              <span className="font-medium">99.8%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Payment Success Rate
              </span>
              <span className="font-medium">
                {subscriber.paymentSuccessRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Average Response Time
              </span>
              <span className="font-medium">42ms</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

