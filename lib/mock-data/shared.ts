/**
 * Shared Mock Data
 * Generated data used across all roles
 */

import type { Alert } from "@/types";
import { MOCK_TREASURIES } from "./treasury";
import { MOCK_SUBSCRIBERS } from "./subscriber";
import { MOCK_LEASES } from "./treasury";
import { generateId, randomInt, randomItem, randomDate } from "./generators";

// Alert types
const ALERT_TYPES = {
  treasury: [
    {
      title: "Lease Expiring Soon",
      message: "Lease {leaseId} expires in {days} days. Consider renewal.",
      severity: "warning" as const,
      actionLabel: "Renew Now",
      actionUrl: "/treasury/leases",
    },
    {
      title: "Low Utilization",
      message:
        "Channel utilization is below target threshold. Consider rebalancing.",
      severity: "info" as const,
      actionLabel: "View Channels",
      actionUrl: "/treasury/channels",
    },
    {
      title: "Node Uptime Drop",
      message: "Node {nodeId} uptime has dropped below 99%. Check node status.",
      severity: "warning" as const,
      actionLabel: "View Nodes",
      actionUrl: "/treasury/nodes",
    },
    {
      title: "Policy Drift Detected",
      message: "Fee policy has drifted from recommended template.",
      severity: "info" as const,
      actionLabel: "Update Policy",
      actionUrl: "/treasury/nodes",
    },
  ],
  subscriber: [
    {
      title: "Capacity Under Target",
      message:
        "Current capacity is below target. Consider requesting more capacity.",
      severity: "warning" as const,
      actionLabel: "Request Capacity",
      actionUrl: "/subscriber/leases",
    },
    {
      title: "Payment Success Rate Drop",
      message: "7-day payment success rate has dropped below 95%.",
      severity: "error" as const,
      actionLabel: "View Health",
      actionUrl: "/subscriber/health",
    },
    {
      title: "Lease Expiring Soon",
      message:
        "Lease {leaseId} expires in {days} days. Renew to avoid service interruption.",
      severity: "warning" as const,
      actionLabel: "Renew Now",
      actionUrl: "/subscriber/leases",
    },
  ],
  admin: [
    {
      title: "New Subscriber Request",
      message: "New capacity request from {subscriberName} requires review.",
      severity: "info" as const,
      actionLabel: "Review Request",
      actionUrl: "/admin/matchmaking",
    },
    {
      title: "KYC Pending",
      message: "KYC verification pending for {entityName}.",
      severity: "warning" as const,
      actionLabel: "Review Compliance",
      actionUrl: "/admin/compliance",
    },
    {
      title: "SLA Breach",
      message: "SLA breach detected for lease {leaseId}.",
      severity: "error" as const,
      actionLabel: "View Details",
      actionUrl: "/admin/orchestration",
    },
  ],
};

// Generate 30 Alerts (10 per user type)
export const MOCK_ALERTS: Alert[] = [];

// Treasury alerts (10)
for (let i = 0; i < 10; i++) {
  const treasury = MOCK_TREASURIES[randomInt(0, MOCK_TREASURIES.length - 1)];
  if (!treasury) continue;
  const alertTemplate = randomItem(ALERT_TYPES.treasury);
  const expiringLease = MOCK_LEASES.find(
    (l) => l.treasuryId === treasury.id && l.daysRemaining <= 14
  );

  let message = alertTemplate.message;
  if (expiringLease) {
    message = message
      .replace("{leaseId}", expiringLease.id)
      .replace("{days}", expiringLease.daysRemaining.toString());
  }
  message = message.replace(
    "{nodeId}",
    `node_${String(randomInt(1, 20)).padStart(3, "0")}`
  );

  MOCK_ALERTS.push({
    id: generateId("alert", i + 1),
    userId: treasury.id,
    userType: "treasury",
    severity: alertTemplate.severity,
    title: alertTemplate.title,
    message,
    actionLabel: alertTemplate.actionLabel,
    actionUrl: alertTemplate.actionUrl,
    createdAt: randomDate(0, 7),
    readAt: Math.random() > 0.5 ? randomDate(0, 2) : undefined,
    dismissedAt: Math.random() > 0.7 ? randomDate(0, 1) : undefined,
  });
}

// Subscriber alerts (10)
for (let i = 0; i < 10; i++) {
  const subscriber =
    MOCK_SUBSCRIBERS[randomInt(0, MOCK_SUBSCRIBERS.length - 1)];
  if (!subscriber) continue;
  const alertTemplate = randomItem(ALERT_TYPES.subscriber);
  const expiringLease = MOCK_LEASES.find(
    (l) => l.subscriberId === subscriber.id && l.daysRemaining <= 14
  );

  let message = alertTemplate.message;
  if (expiringLease) {
    message = message
      .replace("{leaseId}", expiringLease.id)
      .replace("{days}", expiringLease.daysRemaining.toString());
  }

  MOCK_ALERTS.push({
    id: generateId("alert", 10 + i + 1),
    userId: subscriber.id,
    userType: "subscriber",
    severity: alertTemplate.severity,
    title: alertTemplate.title,
    message,
    actionLabel: alertTemplate.actionLabel,
    actionUrl: alertTemplate.actionUrl,
    createdAt: randomDate(0, 7),
    readAt: Math.random() > 0.5 ? randomDate(0, 2) : undefined,
    dismissedAt: Math.random() > 0.7 ? randomDate(0, 1) : undefined,
  });
}

// Admin alerts (10)
for (let i = 0; i < 10; i++) {
  const alertTemplate = randomItem(ALERT_TYPES.admin);
  const subscriber =
    MOCK_SUBSCRIBERS[randomInt(0, MOCK_SUBSCRIBERS.length - 1)];
  const lease = MOCK_LEASES[randomInt(0, MOCK_LEASES.length - 1)];
  if (!subscriber || !lease) continue;

  let message = alertTemplate.message;
  message = message.replace("{subscriberName}", subscriber.name);
  message = message.replace("{entityName}", subscriber.name);
  message = message.replace("{leaseId}", lease.id);

  MOCK_ALERTS.push({
    id: generateId("alert", 20 + i + 1),
    userId: "admin",
    userType: "admin",
    severity: alertTemplate.severity,
    title: alertTemplate.title,
    message,
    actionLabel: alertTemplate.actionLabel,
    actionUrl: alertTemplate.actionUrl,
    createdAt: randomDate(0, 7),
    readAt: Math.random() > 0.5 ? randomDate(0, 2) : undefined,
    dismissedAt: Math.random() > 0.7 ? randomDate(0, 1) : undefined,
  });
}

// Helper functions
export function getAlertsByUserId(
  userId: string,
  userType: Alert["userType"]
): Alert[] {
  return MOCK_ALERTS.filter(
    (a) => a.userId === userId && a.userType === userType
  );
}

export function getUnreadAlerts(
  userId: string,
  userType: Alert["userType"]
): Alert[] {
  return MOCK_ALERTS.filter(
    (a) =>
      a.userId === userId &&
      a.userType === userType &&
      !a.readAt &&
      !a.dismissedAt
  );
}
