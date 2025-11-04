/**
 * Admin Mock Data
 * Generated data for Admin dashboard entities
 */

import type {
  TreasuryPool,
  ComplianceRecord,
  Contract,
  AuditLog,
} from '@/types';
import { MOCK_TREASURIES } from './treasury';
import { MOCK_LEASES } from './treasury';
import { MOCK_SUBSCRIBERS } from './subscriber';
import {
  generateId,
  randomBTC,
  randomInt,
  randomItem,
  dateNDaysAgo,
  randomDate,
} from './generators';

// Generate 5 Treasury Pools
export const MOCK_TREASURY_POOLS: TreasuryPool[] = Array.from({ length: 5 }, (_, i) => {
  const treasuryIds = MOCK_TREASURIES.slice(i, i + 1 + randomInt(0, 1)).map((t) => t.id);
  const totalCapacity = treasuryIds.reduce(
    (sum, tid) => sum + (MOCK_TREASURIES.find((t) => t.id === tid)?.deployedBTC || 0),
    0
  );
  const availableCapacity = totalCapacity * (randomInt(20, 80) / 100);

  return {
    id: generateId('pool', i + 1),
    name: `Pool ${i + 1}`,
    treasuryIds,
    totalCapacity: +totalCapacity.toFixed(8),
    availableCapacity: +availableCapacity.toFixed(8),
    policy: {
      minTerm: randomInt(30, 90),
      maxExposure: randomBTC(5, 20),
      jurisdictions: randomItem([
        ['US', 'CA'],
        ['EU'],
        ['US', 'EU', 'CA'],
        ['Global'],
      ]),
    },
  };
});

// Generate 15 Compliance Records
export const MOCK_COMPLIANCE_RECORDS: ComplianceRecord[] = [];
// 10 for subscribers
MOCK_SUBSCRIBERS.slice(0, 10).forEach((subscriber, i) => {
  const kycChecklist = {
    idVerified: Math.random() > 0.2,
    addressVerified: Math.random() > 0.2,
    entityVerified: Math.random() > 0.2,
  };
  const allVerified = kycChecklist.idVerified && kycChecklist.addressVerified && kycChecklist.entityVerified;
  const statuses: ComplianceRecord['status'][] = allVerified 
    ? ['approved', 'approved', 'pending']
    : ['pending', 'pending', 'rejected'];
  const status = randomItem(statuses);
  const riskScore = randomInt(0, 100);
  const sanctionsCheck: ComplianceRecord['sanctionsCheck'] = 
    riskScore < 30 ? 'pass' : riskScore > 70 ? 'fail' : 'pending';

  MOCK_COMPLIANCE_RECORDS.push({
    id: generateId('kyc', i + 1),
    entityId: subscriber.id,
    entityType: 'subscriber',
    status,
    kycChecklist,
    documentsReceived: randomInt(0, 5),
    riskScore,
    sanctionsCheck,
    lastUpdated: randomDate(0, 90),
  });
});

// 5 for treasuries
MOCK_TREASURIES.slice(0, 5).forEach((treasury, i) => {
  const kycChecklist = {
    idVerified: true,
    addressVerified: true,
    entityVerified: true,
  };
  const status: ComplianceRecord['status'] = 'approved';
  const riskScore = randomInt(10, 40);

  MOCK_COMPLIANCE_RECORDS.push({
    id: generateId('kyc', 10 + i + 1),
    entityId: treasury.id,
    entityType: 'treasury',
    status,
    kycChecklist,
    documentsReceived: randomInt(3, 6),
    riskScore,
    sanctionsCheck: 'pass',
    lastUpdated: randomDate(0, 180),
  });
});

// Generate 40 Contracts (one per active lease)
export const MOCK_CONTRACTS: Contract[] = MOCK_LEASES.filter((l) => l.status === 'active')
  .slice(0, 40)
  .map((lease, i) => {
    const signedByTreasury = Math.random() > 0.1 ? randomDate(0, 30) : undefined;
    const signedBySubscriber = signedByTreasury ? randomDate(0, 7) : undefined;
    const status: Contract['status'] = signedByTreasury && signedBySubscriber 
      ? 'active'
      : 'draft';

    return {
      id: generateId('ctr', i + 1),
      leaseId: lease.id,
      treasuryId: lease.treasuryId,
      subscriberId: lease.subscriberId,
      terms: {
        size: lease.size,
        duration: Math.ceil((new Date(lease.endDate).getTime() - new Date(lease.startDate).getTime()) / (1000 * 60 * 60 * 24)),
        feeStructure: lease.feeModel === 'fixed' 
          ? `Fixed: ${lease.feeAmount} BTC`
          : `PPM: ${lease.feePPM}`,
      },
      issuedAt: lease.startDate,
      signedByTreasury,
      signedBySubscriber,
      status,
    };
  });

// Generate 100 Audit Logs (last 30 days)
export const MOCK_AUDIT_LOGS: AuditLog[] = Array.from({ length: 100 }, (_, i) => {
  const actions = [
    'lease.created',
    'lease.renewed',
    'capacity.allocated',
    'user.login',
    'user.logout',
    'api.key.created',
    'webhook.created',
    'contract.issued',
    'compliance.check.completed',
    'channel.opened',
    'channel.closed',
    'payment.processed',
  ];
  const entityTypes = ['Lease', 'User', 'APIKey', 'Webhook', 'Contract', 'Channel', 'Payment'];
  const actorTypes: AuditLog['actor']['type'][] = ['user', 'system'];
  const actorType = randomItem(actorTypes);
  const actorName = actorType === 'user' 
    ? randomItem(['admin@flowrate.com', 'treasury@acme.com', 'subscriber@bitexchange.com'])
    : 'system';
  const action = randomItem(actions);
  const entityType = randomItem(entityTypes);
  const entityId = generateId(entityType.toLowerCase().slice(0, 3), randomInt(1, 100));

  return {
    id: generateId('log', i + 1),
    timestamp: randomDate(0, 30),
    actor: {
      type: actorType,
      id: actorType === 'user' ? `user_${randomInt(1, 10)}` : 'system',
      name: actorName,
    },
    action,
    entityType,
    entityId,
    details: {
      ipAddress: `192.168.1.${randomInt(1, 255)}`,
      userAgent: 'Mozilla/5.0...',
    },
    ipAddress: `192.168.1.${randomInt(1, 255)}`,
  };
});

// Helper functions
export function getTreasuryPoolById(id: string): TreasuryPool | undefined {
  return MOCK_TREASURY_POOLS.find((p) => p.id === id);
}

export function getComplianceRecordByEntityId(entityId: string): ComplianceRecord | undefined {
  return MOCK_COMPLIANCE_RECORDS.find((c) => c.entityId === entityId);
}

export function getContractsByLeaseId(leaseId: string): Contract[] {
  return MOCK_CONTRACTS.filter((c) => c.leaseId === leaseId);
}

export function getAuditLogsByEntity(entityType: string, entityId: string): AuditLog[] {
  return MOCK_AUDIT_LOGS.filter((l) => l.entityType === entityType && l.entityId === entityId);
}

