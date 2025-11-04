/**
 * Treasury Role Type Contracts
 * Data shape definitions for Treasury dashboard entities
 */

export interface Treasury {
  id: string;
  name: string;
  deployedBTC: number;
  grossAPY: number;
  netAPY: number;
  earnedToDate: number;
  activeLeases: number;
  utilization: number;
  averageUptime: number;
  flowrateMargin: number;
  createdAt: string;
  payoutAddress?: string;
}

export interface Node {
  id: string;
  treasuryId: string;
  alias: string;
  pubkey: string;
  version: string;
  status: 'online' | 'offline' | 'syncing';
  ping: number;
  lastRebalance: string;
  uptime: number;
  channelCount: number;
  capacity: number;
  feeBaseMsat: number;
  feePPM: number;
  hasSigner: boolean;
  warnings: string[];
}

export interface Lease {
  id: string;
  treasuryId: string;
  subscriberId: string;
  lesseeAlias: string;
  size: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  feeModel: 'fixed' | 'ppm';
  feeAmount?: number;
  feePPM?: number;
  effectiveCostPPM: number;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
}

export interface Channel {
  id: string;
  nodeId: string;
  peer: string;
  capacity: number;
  localBalance: number;
  remoteBalance: number;
  utilization: number;
  baseFee: number;
  feePPM: number;
  htlcSuccessRate: number;
  uptime: number;
  isActive: boolean;
  lastUpdated: string;
}

export interface Statement {
  id: string;
  treasuryId: string;
  period: string;
  leaseFeesEarned: number;
  routingFeesEarned: number;
  grossTotal: number;
  flowrateMargin: number;
  netTotal: number;
  generatedAt: string;
  downloadUrls: {
    csv: string;
    pdf: string;
  };
}

