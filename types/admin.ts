/**
 * Admin Role Type Contracts
 * Data shape definitions for Admin dashboard entities
 */

export interface TreasuryPool {
  id: string;
  name: string;
  treasuryIds: string[];
  totalCapacity: number;
  availableCapacity: number;
  policy: {
    minTerm: number;
    maxExposure: number;
    jurisdictions: string[];
  };
}

export interface ComplianceRecord {
  id: string;
  entityId: string;
  entityType: 'subscriber' | 'treasury';
  status: 'pending' | 'approved' | 'rejected';
  kycChecklist: {
    idVerified: boolean;
    addressVerified: boolean;
    entityVerified: boolean;
  };
  documentsReceived: number;
  riskScore: number;
  sanctionsCheck: 'pass' | 'fail' | 'pending';
  lastUpdated: string;
}

export interface Contract {
  id: string;
  leaseId: string;
  treasuryId: string;
  subscriberId: string;
  terms: {
    size: number;
    duration: number;
    feeStructure: string;
  };
  issuedAt: string;
  signedByTreasury?: string;
  signedBySubscriber?: string;
  status: 'draft' | 'active' | 'completed';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: {
    type: 'user' | 'system';
    id: string;
    name: string;
  };
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
}

