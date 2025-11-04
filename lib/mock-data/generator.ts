/**
 * Mock Data Generator for FlowRate Dashboard
 * Generates realistic Bitcoin/Lightning data for demo purposes
 */

import type {
  TimeSeriesData,
  BitcoinPortfolio,
  YieldPerformance,
  RiskMetrics,
  Transaction,
  ChannelMetrics,
  RoutingPerformance,
  GeographicDistribution,
  CostAnalysis,
  ServiceHealth,
  Alert,
  DashboardData,
} from "@/types/dashboard";

// Constants
const BTC_PRICE = 45000; // Mock BTC price in USD

/**
 * Generate time series data with realistic fluctuations
 */
export function generateTimeSeriesData(
  days: number,
  baseValue: number,
  volatility: number = 0.1
): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const now = Date.now();
  let currentValue = baseValue;

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * 24 * 60 * 60 * 1000;
    const change = (Math.random() - 0.5) * 2 * volatility * baseValue;
    currentValue = Math.max(0, currentValue + change);

    data.push({
      timestamp,
      value: Number(currentValue.toFixed(6)),
    });
  }

  return data;
}

/**
 * Generate random number within range
 */
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate mock Bitcoin portfolio data
 */
export function generateBitcoinPortfolio(): BitcoinPortfolio {
  const totalBtc = randomInRange(5, 50);
  const allocatedPercentage = randomInRange(0.6, 0.9);
  const allocatedBtc = totalBtc * allocatedPercentage;
  const channels = Math.floor(randomInRange(10, 50));

  return {
    totalBtc: Number(totalBtc.toFixed(8)),
    totalUsd: Number((totalBtc * BTC_PRICE).toFixed(2)),
    allocatedBtc: Number(allocatedBtc.toFixed(8)),
    availableBtc: Number((totalBtc - allocatedBtc).toFixed(8)),
    channels,
    averageChannelSize: Number((allocatedBtc / channels).toFixed(8)),
  };
}

/**
 * Generate mock yield performance data
 */
export function generateYieldPerformance(): YieldPerformance {
  const currentApy = randomInRange(4, 8);
  const totalEarned = randomInRange(0.1, 2);
  const monthlyEarnings = totalEarned / 12;

  return {
    currentApy: Number(currentApy.toFixed(2)),
    averageApy: Number(randomInRange(4, 7).toFixed(2)),
    totalEarned: Number(totalEarned.toFixed(8)),
    totalEarnedUsd: Number((totalEarned * BTC_PRICE).toFixed(2)),
    monthlyEarnings: Number(monthlyEarnings.toFixed(8)),
    projectedYearly: Number((monthlyEarnings * 12).toFixed(8)),
    history: generateTimeSeriesData(90, totalEarned / 3, 0.05),
  };
}

/**
 * Generate mock risk metrics
 */
export function generateRiskMetrics(): RiskMetrics {
  const riskScore = Math.floor(randomInRange(70, 95));
  const diversificationScore = Math.floor(randomInRange(75, 100));
  const channelHealthScore = Math.floor(randomInRange(80, 100));

  const recommendations: string[] = [];
  if (riskScore < 80)
    recommendations.push("Consider diversifying channel partners");
  if (diversificationScore < 85)
    recommendations.push("Increase geographic distribution");
  if (channelHealthScore < 90)
    recommendations.push("Some channels need rebalancing");

  return {
    riskScore,
    diversificationScore,
    channelHealthScore,
    counterpartyRisk:
      riskScore > 85 ? "low" : riskScore > 70 ? "medium" : "high",
    recommendations,
  };
}

/**
 * Generate mock transaction history
 */
export function generateTransactions(count: number = 10): Transaction[] {
  const types: Transaction["type"][] = [
    "deposit",
    "withdrawal",
    "yield",
    "fee",
  ];
  const statuses: Transaction["status"][] = [
    "confirmed",
    "confirmed",
    "confirmed",
    "pending",
  ];
  const transactions: Transaction[] = [];

  for (let i = 0; i < count; i++) {
    transactions.push({
      id: `tx_${Math.random().toString(36).substr(2, 9)}`,
      type: types[Math.floor(Math.random() * types.length)],
      amount: Number(randomInRange(0.001, 0.5).toFixed(8)),
      timestamp:
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      txid:
        Math.random() > 0.5
          ? Math.random().toString(36).substr(2, 16)
          : undefined,
    });
  }

  return transactions.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Generate mock channel metrics
 */
export function generateChannelMetrics(): ChannelMetrics {
  const totalCapacity = randomInRange(10, 100);
  const utilizationRate = randomInRange(0.5, 0.85);
  const inboundPercentage = randomInRange(0.4, 0.6);
  const totalChannels = Math.floor(randomInRange(20, 100));
  const activePercentage = randomInRange(0.8, 1);

  return {
    totalCapacity: Number(totalCapacity.toFixed(2)),
    inboundLiquidity: Number((totalCapacity * inboundPercentage).toFixed(2)),
    outboundLiquidity: Number(
      (totalCapacity * (1 - inboundPercentage)).toFixed(2)
    ),
    utilizationRate: Number((utilizationRate * 100).toFixed(1)),
    activeChannels: Math.floor(totalChannels * activePercentage),
    totalChannels,
  };
}

/**
 * Generate mock routing performance
 */
export function generateRoutingPerformance(): RoutingPerformance {
  const totalPayments = Math.floor(randomInRange(10000, 100000));
  const successRate = randomInRange(0.95, 0.995);
  const successfulPayments = Math.floor(totalPayments * successRate);

  return {
    successRate: Number((successRate * 100).toFixed(2)),
    totalPayments,
    successfulPayments,
    failedPayments: totalPayments - successfulPayments,
    averageResponseTime: Math.floor(randomInRange(300, 800)),
    totalFeesEarned: Number(randomInRange(0.5, 5).toFixed(6)),
    history: generateTimeSeriesData(30, 100, 5),
  };
}

/**
 * Generate mock geographic distribution
 */
export function generateGeographicDistribution(): GeographicDistribution[] {
  const regions = [
    "North America",
    "Europe",
    "Asia Pacific",
    "Latin America",
    "Middle East",
  ];

  let remainingPercentage = 100;
  return regions.map((region, index) => {
    const isLast = index === regions.length - 1;
    const percentage = isLast
      ? remainingPercentage
      : Math.floor(randomInRange(10, 30));
    remainingPercentage -= percentage;

    const channels = Math.floor(randomInRange(5, 30));
    const capacity = Number(randomInRange(5, 30).toFixed(2));

    return { region, channels, capacity, percentage };
  });
}

/**
 * Generate mock cost analysis
 */
export function generateCostAnalysis(): CostAnalysis {
  const monthlySubscription = 4999;
  const channelFees = Number(randomInRange(100, 500).toFixed(2));
  const rebalancingCosts = Number(randomInRange(50, 200).toFixed(2));
  const totalCosts = monthlySubscription + channelFees + rebalancingCosts;
  const totalPayments = Math.floor(randomInRange(10000, 50000));
  const costPerPayment = Number((totalCosts / totalPayments).toFixed(4));

  const selfManaged = totalCosts * 1.5;
  const savings = selfManaged - totalCosts;

  return {
    monthlySubscription,
    channelFees,
    rebalancingCosts,
    totalCosts,
    costPerPayment,
    comparison: {
      selfManaged: Number(selfManaged.toFixed(2)),
      flowRate: totalCosts,
      savings: Number(savings.toFixed(2)),
    },
  };
}

/**
 * Generate mock service health
 */
export function generateServiceHealth(): ServiceHealth {
  const uptime = randomInRange(99.5, 99.99);
  const responseTime = Math.floor(randomInRange(250, 600));
  const activeAlerts = Math.floor(Math.random() * 3);

  return {
    uptime: Number(uptime.toFixed(3)),
    lastDowntime:
      Math.random() > 0.8 ? Date.now() - 7 * 24 * 60 * 60 * 1000 : null,
    responseTime,
    activeAlerts,
    status: uptime > 99.9 ? "healthy" : uptime > 99 ? "degraded" : "down",
  };
}

/**
 * Generate mock alerts
 */
export function generateAlerts(count: number = 3): Alert[] {
  const alertTemplates = [
    {
      type: "info" as const,
      title: "Channel Rebalancing Complete",
      message:
        "Successfully rebalanced 3 channels to optimize liquidity distribution.",
    },
    {
      type: "success" as const,
      title: "New Yield Payment",
      message: "Received 0.00125 BTC in routing fees for the past 24 hours.",
    },
    {
      type: "warning" as const,
      title: "Channel Capacity Low",
      message: "Channel #12345 is at 95% capacity. Consider rebalancing soon.",
    },
    {
      type: "info" as const,
      title: "Network Upgrade Scheduled",
      message: "Planned maintenance window: Tomorrow 2:00 AM - 4:00 AM UTC.",
    },
  ];

  return Array.from(
    { length: Math.min(count, alertTemplates.length) },
    (_, i) => ({
      id: `alert_${i}`,
      ...alertTemplates[i],
      timestamp: Date.now() - Math.floor(Math.random() * 24) * 60 * 60 * 1000,
      read: Math.random() > 0.5,
    })
  );
}

/**
 * Generate complete dashboard data
 */
export function generateDashboardData(
  view: "treasury" | "liquidity"
): DashboardData {
  return {
    treasury:
      view === "treasury"
        ? {
            portfolio: generateBitcoinPortfolio(),
            yield: generateYieldPerformance(),
            risk: generateRiskMetrics(),
            transactions: generateTransactions(),
          }
        : undefined,
    liquidity:
      view === "liquidity"
        ? {
            channels: generateChannelMetrics(),
            routing: generateRoutingPerformance(),
            geographic: generateGeographicDistribution(),
            costs: generateCostAnalysis(),
            health: generateServiceHealth(),
          }
        : undefined,
    alerts: generateAlerts(),
    lastUpdated: Date.now(),
  };
}
