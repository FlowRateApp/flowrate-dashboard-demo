/**
 * Dashboard Types for FlowRate Platform
 * Mock data structures for Treasury and Liquidity dashboards
 */

// Common Types
export interface TimeSeriesData {
  timestamp: number;
  value: number;
}

// Treasury Dashboard Types
export interface BitcoinPortfolio {
  totalBtc: number;
  totalUsd: number;
  allocatedBtc: number;
  availableBtc: number;
  channels: number;
  averageChannelSize: number;
}

export interface YieldPerformance {
  currentApy: number;
  averageApy: number;
  totalEarned: number;
  totalEarnedUsd: number;
  monthlyEarnings: number;
  projectedYearly: number;
  history: TimeSeriesData[];
}

export interface RiskMetrics {
  riskScore: number; // 0-100
  diversificationScore: number;
  channelHealthScore: number;
  counterpartyRisk: "low" | "medium" | "high";
  recommendations: string[];
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "yield" | "fee";
  amount: number;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
  txid?: string;
}

// Liquidity Dashboard Types
export interface ChannelMetrics {
  totalCapacity: number;
  inboundLiquidity: number;
  outboundLiquidity: number;
  utilizationRate: number;
  activeChannels: number;
  totalChannels: number;
}

export interface RoutingPerformance {
  successRate: number;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  averageResponseTime: number;
  totalFeesEarned: number;
  history: TimeSeriesData[];
}

export interface GeographicDistribution {
  region: string;
  channels: number;
  capacity: number;
  percentage: number;
}

export interface CostAnalysis {
  monthlySubscription: number;
  channelFees: number;
  rebalancingCosts: number;
  totalCosts: number;
  costPerPayment: number;
  comparison: {
    selfManaged: number;
    flowRate: number;
    savings: number;
  };
}

export interface ServiceHealth {
  uptime: number;
  lastDowntime: number | null;
  responseTime: number;
  activeAlerts: number;
  status: "healthy" | "degraded" | "down";
}

// Dashboard View Type
export type DashboardView = "treasury" | "liquidity";

// Alert Types
export interface Alert {
  id: string;
  type: "warning" | "error" | "info" | "success";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

// API Response Types (for real-time simulation)
export interface DashboardData {
  treasury?: {
    portfolio: BitcoinPortfolio;
    yield: YieldPerformance;
    risk: RiskMetrics;
    transactions: Transaction[];
  };
  liquidity?: {
    channels: ChannelMetrics;
    routing: RoutingPerformance;
    geographic: GeographicDistribution[];
    costs: CostAnalysis;
    health: ServiceHealth;
  };
  alerts: Alert[];
  lastUpdated: number;
}
