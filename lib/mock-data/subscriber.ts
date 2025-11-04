/**
 * Subscriber Mock Data
 * Generated data for Subscriber dashboard entities
 */

import type {
  Subscriber,
  DemandTicket,
  APIKey,
  Webhook,
  Invoice,
  CapacityDataPoint,
} from "@/types";
import {
  generateId,
  randomBTC,
  randomInt,
  randomItem,
  dateNDaysAgo,
  randomDate,
  formatDate,
} from "./generators";

// Subscriber names
const SUBSCRIBER_NAMES = [
  "BitExchange",
  "CryptoPay",
  "LightningWallet",
  "FastPayments",
  "DigitalEx",
  "BlockPay",
  "CoinFlow",
  "SwiftBit",
  "RapidLightning",
  "QuickBit",
];

// Generate 10 Subscribers
export const MOCK_SUBSCRIBERS: Subscriber[] = Array.from(
  { length: 10 },
  (_, i) => {
    const inboundLeased = randomBTC(0.5, 10);
    const expiringLeases = randomInt(0, 5);
    const effectiveCostPPM = randomInt(50, 500);
    const effectiveCostFixed = randomBTC(0.001, 0.01);
    const paymentSuccessRate = randomInt(950, 1000) / 10;
    const openIncidents = randomInt(0, 3);
    const channelCount = randomInt(5, 50);
    const primaryPeers = Array.from(
      { length: randomInt(2, 5) },
      () => `peer_${String(randomInt(1, 50)).padStart(3, "0")}`
    );

    return {
      id: generateId("sub", i + 1),
      name: SUBSCRIBER_NAMES[i] || `Subscriber ${i + 1}`,
      inboundLeased: +inboundLeased.toFixed(8),
      expiringLeases,
      effectiveCostPPM,
      effectiveCostFixed: +effectiveCostFixed.toFixed(8),
      paymentSuccessRate: +paymentSuccessRate.toFixed(1),
      openIncidents,
      channelCount,
      primaryPeers,
      lastPolicyUpdate: randomDate(0, 30),
    };
  }
);

// Generate 25 Demand Tickets
export const MOCK_DEMAND_TICKETS: DemandTicket[] = Array.from(
  { length: 25 },
  (_, i) => {
    const subscriber =
      MOCK_SUBSCRIBERS[randomInt(0, MOCK_SUBSCRIBERS.length - 1)];
    const subscriberId = subscriber?.id || MOCK_SUBSCRIBERS[0]!.id;
    const size = randomBTC(0.5, 5);
    const term = randomInt(30, 180);
    const priceMin = randomInt(50, 200);
    const priceMax = randomInt(priceMin, 500);
    const riskTiers: DemandTicket["riskTier"][] = ["low", "medium", "high"];
    const riskTier = randomItem(riskTiers);
    const statuses: DemandTicket["status"][] = [
      "pending",
      "pending",
      "pending",
      "matched",
      "rejected",
    ];
    const status = randomItem(statuses);
    const matchedTreasuryId =
      status === "matched"
        ? `trs_${String(randomInt(1, 5)).padStart(3, "0")}`
        : undefined;

    return {
      id: generateId("dmd", i + 1),
      subscriberId,
      size: +size.toFixed(8),
      term,
      priceMin,
      priceMax,
      riskTier,
      status,
      createdAt: randomDate(0, 90),
      matchedTreasuryId,
    };
  }
);

// Generate 20 API Keys (1-3 per subscriber)
export const MOCK_API_KEYS: APIKey[] = [];
let keyIndex = 1;
MOCK_SUBSCRIBERS.forEach((subscriber) => {
  const keysPerSubscriber = randomInt(1, 3);
  for (let i = 0; i < keysPerSubscriber && keyIndex <= 20; i++) {
    const keyPrefix = `frl_${Array.from({ length: 4 }, () =>
      randomInt(0, 15).toString(16)
    ).join("")}`;
    const permissions: APIKey["permissions"][] = [["read"], ["read", "write"]];
    const lastUsed = Math.random() > 0.3 ? randomDate(0, 30) : undefined;

    MOCK_API_KEYS.push({
      id: generateId("key", keyIndex),
      subscriberId: subscriber.id,
      label: `API Key ${i + 1}`,
      keyPrefix,
      createdAt: randomDate(30, 365),
      lastUsed,
      permissions: randomItem(permissions),
    });
    keyIndex++;
  }
});

// Generate 15 Webhooks (0-2 per subscriber)
export const MOCK_WEBHOOKS: Webhook[] = [];
let webhookIndex = 1;
MOCK_SUBSCRIBERS.forEach((subscriber) => {
  const webhooksPerSubscriber = randomInt(0, 2);
  for (let i = 0; i < webhooksPerSubscriber && webhookIndex <= 15; i++) {
    const events: Webhook["events"][] = [
      ["capacity-delivered"],
      ["expiry-warning"],
      ["incident"],
      ["capacity-delivered", "expiry-warning"],
      ["capacity-delivered", "expiry-warning", "incident"],
    ];
    const lastTriggered = Math.random() > 0.4 ? randomDate(0, 7) : undefined;

    MOCK_WEBHOOKS.push({
      id: generateId("hook", webhookIndex),
      subscriberId: subscriber.id,
      url: `https://api.${subscriber.name.toLowerCase()}.com/webhooks/flowrate`,
      events: randomItem(events) as Webhook["events"],
      secret:
        Math.random() > 0.5 ? `secret_${randomInt(1000, 9999)}` : undefined,
      isActive: Math.random() > 0.2,
      lastTriggered,
    });
    webhookIndex++;
  }
});

// Generate 30 Invoices (3 per subscriber, last 3 months)
export const MOCK_INVOICES: Invoice[] = [];
MOCK_SUBSCRIBERS.forEach((subscriber) => {
  for (let month = 0; month < 3; month++) {
    const periodDate = new Date();
    periodDate.setMonth(periodDate.getMonth() - month);
    const period = `${periodDate.getFullYear()}-${String(
      periodDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const amount = randomBTC(0.01, 0.5);
    const currency = randomItem(["BTC", "USD"] as const);
    const dueDate = new Date(
      periodDate.getFullYear(),
      periodDate.getMonth() + 1,
      15
    ).toISOString();
    const isOverdue = new Date(dueDate) < new Date();
    const statuses: Invoice["status"][] = isOverdue
      ? ["overdue", "unpaid"]
      : ["paid", "paid", "unpaid"];
    const status = randomItem(statuses);

    MOCK_INVOICES.push({
      id: `inv_${subscriber.id}_${period}`,
      subscriberId: subscriber.id,
      period,
      amount:
        currency === "BTC" ? +amount.toFixed(8) : +(amount * 50000).toFixed(2),
      currency,
      status,
      dueDate,
      pdfUrl: `/api/invoices/${subscriber.id}/${period}.pdf`,
    });
  }
});

// Generate 90 days of capacity data points
export const MOCK_CAPACITY_DATA: CapacityDataPoint[] = Array.from(
  { length: 90 },
  (_, i) => {
    const date = formatDate(dateNDaysAgo(89 - i));
    const delivered = randomBTC(0.5, 10);
    const used = randomBTC(delivered * 0.3, delivered * 0.9);
    const successRate = randomInt(950, 1000) / 10;

    return {
      date,
      delivered: +delivered.toFixed(8),
      used: +used.toFixed(8),
      successRate: +successRate.toFixed(1),
    };
  }
);

// Helper functions
export function getSubscriberById(id: string): Subscriber | undefined {
  return MOCK_SUBSCRIBERS.find((s) => s.id === id);
}

export function getDemandTicketsBySubscriberId(
  subscriberId: string
): DemandTicket[] {
  return MOCK_DEMAND_TICKETS.filter((t) => t.subscriberId === subscriberId);
}

export function getAPIKeysBySubscriberId(subscriberId: string): APIKey[] {
  return MOCK_API_KEYS.filter((k) => k.subscriberId === subscriberId);
}

export function getWebhooksBySubscriberId(subscriberId: string): Webhook[] {
  return MOCK_WEBHOOKS.filter((w) => w.subscriberId === subscriberId);
}

export function getInvoicesBySubscriberId(subscriberId: string): Invoice[] {
  return MOCK_INVOICES.filter((inv) => inv.subscriberId === subscriberId);
}
