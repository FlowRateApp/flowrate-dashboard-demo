/**
 * Shared Type Contracts
 * Data shape definitions used across all roles
 */

export interface Alert {
  id: string;
  userId: string;
  userType: 'treasury' | 'subscriber' | 'admin';
  severity: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
  dismissedAt?: string;
}

export interface YieldDataPoint {
  date: string;
  routingYield: number;
  leaseYield: number;
}

export interface CapacityDataPoint {
  date: string;
  delivered: number;
  used: number;
  successRate: number;
}

