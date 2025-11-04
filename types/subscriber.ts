/**
 * Subscriber Role Type Contracts
 * Data shape definitions for Subscriber dashboard entities
 */

export interface Subscriber {
  id: string;
  name: string;
  inboundLeased: number;
  expiringLeases: number;
  effectiveCostPPM: number;
  effectiveCostFixed: number;
  paymentSuccessRate: number;
  openIncidents: number;
  channelCount: number;
  primaryPeers: string[];
  lastPolicyUpdate: string;
}

export interface DemandTicket {
  id: string;
  subscriberId: string;
  size: number;
  term: number;
  priceMin: number;
  priceMax: number;
  riskTier: 'low' | 'medium' | 'high';
  status: 'pending' | 'matched' | 'rejected';
  createdAt: string;
  matchedTreasuryId?: string;
}

export interface APIKey {
  id: string;
  subscriberId: string;
  label: string;
  keyPrefix: string;
  createdAt: string;
  lastUsed?: string;
  permissions: ('read' | 'write')[];
}

export interface Webhook {
  id: string;
  subscriberId: string;
  url: string;
  events: ('capacity-delivered' | 'expiry-warning' | 'incident')[];
  secret?: string;
  isActive: boolean;
  lastTriggered?: string;
}

export interface Invoice {
  id: string;
  subscriberId: string;
  period: string;
  amount: number;
  currency: 'BTC' | 'USD';
  status: 'paid' | 'unpaid' | 'overdue';
  dueDate: string;
  pdfUrl: string;
}

