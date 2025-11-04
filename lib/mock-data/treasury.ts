/**
 * Treasury Mock Data
 * Generated data for Treasury dashboard entities
 */

import type {
  Treasury,
  Node,
  Lease,
  Channel,
  Statement,
  YieldDataPoint,
} from "@/types";
import {
  generateId,
  generatePubkey,
  generateBitcoinAddress,
  randomBTC,
  randomInt,
  randomItem,
  dateNDaysAgo,
  randomDate,
  formatDate,
} from "./generators";

// Treasury names for variety
const TREASURY_NAMES = [
  "Acme Treasury",
  "Bitcoin Capital Partners",
  "Lightning Ventures",
  "Crypto Yield Fund",
  "Digital Assets Management",
];

// Node aliases templates
const NODE_ALIASES = [
  "ACME-NODE",
  "BCP-NODE",
  "LV-NODE",
  "CAF-NODE",
  "DAM-NODE",
];

// Subscriber names (will be referenced in leases)
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

// Generate 5 Treasuries
export const MOCK_TREASURIES: Treasury[] = Array.from({ length: 5 }, (_, i) => {
  const deployedBTC = randomBTC(0.5, 50);
  const grossAPY = randomInt(60, 120) / 10; // 6.0% to 12.0%
  const flowrateMargin = 0.7;
  const netAPY = grossAPY - flowrateMargin;
  const activeLeases = randomInt(3, 15);
  const utilization = randomInt(40, 95);
  const averageUptime = randomInt(980, 1000) / 10; // 98.0% to 100.0%
  const earnedToDate = randomBTC(0.01, deployedBTC * 0.1);

  return {
    id: generateId("trs", i + 1),
    name: TREASURY_NAMES[i] || `Treasury ${i + 1}`,
    deployedBTC: +deployedBTC.toFixed(8),
    grossAPY: +grossAPY.toFixed(2),
    netAPY: +netAPY.toFixed(2),
    earnedToDate: +earnedToDate.toFixed(8),
    activeLeases,
    utilization: +utilization.toFixed(1),
    averageUptime: +averageUptime.toFixed(1),
    flowrateMargin,
    createdAt: dateNDaysAgo(randomInt(30, 365)),
    payoutAddress: generateBitcoinAddress(),
  };
});

// Generate 20 Nodes (4 per treasury)
export const MOCK_NODES: Node[] = [];
let nodeIndex = 1;
MOCK_TREASURIES.forEach((treasury, treasuryIndex) => {
  const nodesPerTreasury = randomInt(2, 5);
  for (let i = 0; i < nodesPerTreasury && nodeIndex <= 20; i++) {
    const version = `v0.${randomInt(16, 17)}.${randomInt(0, 5)}`;
    const statuses: Node["status"][] = [
      "online",
      "online",
      "online",
      "syncing",
    ];
    const status = randomItem(statuses);
    const warnings: string[] = [];
    if (version < "v0.17.0") {
      warnings.push("Node version outdated - update recommended");
    }

    MOCK_NODES.push({
      id: generateId("node", nodeIndex),
      treasuryId: treasury.id,
      alias: `${NODE_ALIASES[treasuryIndex] || "NODE"}-${String(i + 1).padStart(
        2,
        "0"
      )}`,
      pubkey: generatePubkey(),
      version,
      status,
      ping: randomInt(10, 150),
      lastRebalance: randomDate(0, 7),
      uptime: randomInt(950, 1000) / 10,
      channelCount: randomInt(5, 30),
      capacity: randomBTC(0.1, treasury.deployedBTC / nodesPerTreasury),
      feeBaseMsat: randomInt(100, 1000),
      feePPM: randomInt(1, 100),
      hasSigner: Math.random() > 0.5,
      warnings,
    });
    nodeIndex++;
  }
});

// Generate 50 Leases (distributed across treasuries and subscribers)
export const MOCK_LEASES: Lease[] = [];
let leaseIndex = 1;
MOCK_TREASURIES.forEach((treasury) => {
  const leasesPerTreasury = randomInt(8, 12);
  for (let i = 0; i < leasesPerTreasury && leaseIndex <= 50; i++) {
    const subscriberId = `sub_${String(randomInt(1, 10)).padStart(3, "0")}`;
    const lesseeAlias = randomItem(SUBSCRIBER_NAMES);
    const size = randomBTC(0.1, 5);
    const startDate = randomDate(90, 365);
    const endDate = new Date(
      new Date(startDate).getTime() + randomInt(30, 180) * 24 * 60 * 60 * 1000
    ).toISOString();
    const daysRemaining = Math.ceil(
      (new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    const feeModel = randomItem(["fixed", "ppm"] as const);
    const feeAmount = feeModel === "fixed" ? randomBTC(0.001, 0.01) : undefined;
    const feePPM = feeModel === "ppm" ? randomInt(50, 500) : undefined;
    const effectiveCostPPM =
      feeModel === "ppm" ? feePPM! : (feeAmount! / size) * 1000000;
    const statuses: Lease["status"][] = [
      "active",
      "active",
      "active",
      "pending",
      "expired",
    ];
    const status = randomItem(statuses);

    MOCK_LEASES.push({
      id: generateId("lease", leaseIndex),
      treasuryId: treasury.id,
      subscriberId,
      lesseeAlias,
      size: +size.toFixed(8),
      startDate,
      endDate,
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      feeModel,
      feeAmount,
      feePPM,
      effectiveCostPPM: Math.round(effectiveCostPPM),
      status,
    });
    leaseIndex++;
  }
});

// Generate 100 Channels (distributed across nodes)
export const MOCK_CHANNELS: Channel[] = [];
let channelIndex = 1;
MOCK_NODES.forEach((node) => {
  const channelsPerNode = randomInt(3, 10);
  for (let i = 0; i < channelsPerNode && channelIndex <= 100; i++) {
    const capacity = randomBTC(0.05, 1);
    const localBalance = randomBTC(0, capacity * 0.8);
    const remoteBalance = capacity - localBalance;
    const routedVolume7d = randomBTC(0, capacity * 2);
    const utilization = (routedVolume7d / capacity) * 100;

    MOCK_CHANNELS.push({
      id: generateId("chan", channelIndex),
      nodeId: node.id,
      peer: `peer_${String(randomInt(1, 50)).padStart(3, "0")}`,
      capacity: +capacity.toFixed(8),
      localBalance: +localBalance.toFixed(8),
      remoteBalance: +remoteBalance.toFixed(8),
      utilization: +utilization.toFixed(1),
      baseFee: randomInt(100, 1000),
      feePPM: randomInt(1, 100),
      htlcSuccessRate: randomInt(950, 1000) / 10,
      uptime: randomInt(950, 1000) / 10,
      isActive: Math.random() > 0.1,
      lastUpdated: randomDate(0, 1),
    });
    channelIndex++;
  }
});

// Generate 15 Statements (3 per treasury, last 3 months)
export const MOCK_STATEMENTS: Statement[] = [];
MOCK_TREASURIES.forEach((treasury) => {
  for (let month = 0; month < 3; month++) {
    const periodDate = new Date();
    periodDate.setMonth(periodDate.getMonth() - month);
    const period = `${periodDate.getFullYear()}-${String(
      periodDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const leaseFeesEarned = randomBTC(0.01, 0.5);
    const routingFeesEarned = randomBTC(0.005, 0.3);
    const grossTotal = leaseFeesEarned + routingFeesEarned;
    const flowrateMargin = grossTotal * (treasury.flowrateMargin / 100);
    const netTotal = grossTotal - flowrateMargin;

    MOCK_STATEMENTS.push({
      id: `stmt_${period}`,
      treasuryId: treasury.id,
      period,
      leaseFeesEarned: +leaseFeesEarned.toFixed(8),
      routingFeesEarned: +routingFeesEarned.toFixed(8),
      grossTotal: +grossTotal.toFixed(8),
      flowrateMargin: +flowrateMargin.toFixed(8),
      netTotal: +netTotal.toFixed(8),
      generatedAt: new Date(
        periodDate.getFullYear(),
        periodDate.getMonth() + 1,
        1
      ).toISOString(),
      downloadUrls: {
        csv: `/api/statements/${treasury.id}/${period}.csv`,
        pdf: `/api/statements/${treasury.id}/${period}.pdf`,
      },
    });
  }
});

// Generate 90 days of yield data points
export const MOCK_YIELD_DATA: YieldDataPoint[] = Array.from(
  { length: 90 },
  (_, i) => {
    const date = formatDate(dateNDaysAgo(89 - i));
    return {
      date,
      routingYield: randomBTC(0.001, 0.05),
      leaseYield: randomBTC(0.01, 0.1),
    };
  }
);

// Helper function to get treasury by ID
export function getTreasuryById(id: string): Treasury | undefined {
  return MOCK_TREASURIES.find((t) => t.id === id);
}

// Helper function to get nodes by treasury ID
export function getNodesByTreasuryId(treasuryId: string): Node[] {
  return MOCK_NODES.filter((n) => n.treasuryId === treasuryId);
}

// Helper function to get leases by treasury ID
export function getLeasesByTreasuryId(treasuryId: string): Lease[] {
  return MOCK_LEASES.filter((l) => l.treasuryId === treasuryId);
}

// Helper function to get channels by node ID
export function getChannelsByNodeId(nodeId: string): Channel[] {
  return MOCK_CHANNELS.filter((c) => c.nodeId === nodeId);
}

// Helper function to get statements by treasury ID
export function getStatementsByTreasuryId(treasuryId: string): Statement[] {
  return MOCK_STATEMENTS.filter((s) => s.treasuryId === treasuryId);
}

// Helper function to get leases by subscriber ID
export function getLeasesBySubscriberId(subscriberId: string): Lease[] {
  return MOCK_LEASES.filter((l) => l.subscriberId === subscriberId);
}
