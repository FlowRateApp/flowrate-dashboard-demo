# Data Model: Flowrate Dashboard

**Date**: November 4, 2025  
**Feature**: Flowrate Dashboard Multi-Role Platform  
**Phase**: Phase 1 - Data Entities & Relationships

## Overview

This document defines all data entities used in the Flowrate Dashboard. Since this is a frontend-only MVP with mocked data, the "data model" consists of TypeScript interfaces representing the shape of data displayed in each role's dashboard.

**Entity Count**: 16 core entities  
**Relationships**: Defined via ID references (no database foreign keys)  
**Data Source**: Static TypeScript modules in `/lib/mock-data/`

---

## Entity Relationship Diagram

```
┌─────────────┐         ┌──────────┐
│  Treasury   │────────▶│   Node   │
└─────────────┘         └──────────┘
      │                       │
      │                       │
      ▼                       ▼
┌─────────────┐         ┌──────────────┐
│    Lease    │────────▶│   Channel    │
└─────────────┘         └──────────────┘
      │
      │
      ▼
┌─────────────┐
│ Subscriber  │
└─────────────┘
      │
      ├──────────────┐
      │              │
      ▼              ▼
┌──────────┐   ┌───────────┐
│ Invoice  │   │  API Key  │
└──────────┘   └───────────┘

      Shared Entities:
┌─────────┐  ┌───────────┐  ┌────────────┐
│  Alert  │  │ Statement │  │ Audit Log  │
└─────────┘  └───────────┘  └────────────┘
```

---

## Treasury Role Entities

### 1. Treasury

Represents an organization deploying Bitcoin capital into Lightning nodes.

```typescript
interface Treasury {
  id: string;                    // Unique identifier (e.g., 'trs_001')
  name: string;                  // Display name (e.g., 'Acme Treasury')
  deployedBTC: number;           // Total Bitcoin deployed (e.g., 12.5)
  grossAPY: number;              // Gross annual yield % (e.g., 8.2)
  netAPY: number;                // Net yield after Flowrate margin (e.g., 7.5)
  earnedToDate: number;          // Total BTC earned (e.g., 0.45)
  activeLeases: number;          // Count of active leases
  utilization: number;           // Utilization % (0-100)
  averageUptime: number;         // Average node uptime % (e.g., 99.8)
  flowrateMargin: number;        // Margin % charged by Flowrate (e.g., 0.7)
  createdAt: string;             // ISO 8601 timestamp
  payoutAddress?: string;        // Bitcoin address for payouts (optional)
}
```

**Relationships**:
- Has many `Node` (via `Node.treasuryId`)
- Has many `Lease` (via `Lease.treasuryId`)
- Has many `Statement` (via `Statement.treasuryId`)

**Validation Rules**:
- `id` must be unique and match pattern `trs_\d{3}`
- `deployedBTC`, `earnedToDate` >= 0
- `grossAPY`, `netAPY`, `utilization`, `averageUptime` between 0-100
- `grossAPY` >= `netAPY` (margin is deduction)

---

### 2. Node

A Lightning Network node operated by a treasury.

```typescript
interface Node {
  id: string;                    // Unique identifier (e.g., 'node_001')
  treasuryId: string;            // FK to Treasury
  alias: string;                 // Node alias (e.g., 'ACME-NODE-01')
  pubkey: string;                // Public key (66-char hex)
  version: string;               // LND/CLN version (e.g., 'v0.17.0')
  status: 'online' | 'offline' | 'syncing';
  ping: number;                  // Ping latency in ms (e.g., 42)
  lastRebalance: string;         // ISO 8601 timestamp
  uptime: number;                // Uptime % (0-100)
  channelCount: number;          // Total channels
  capacity: number;              // Total capacity in BTC
  feeBaseMsat: number;           // Base fee in msat
  feePPM: number;                // Fee parts-per-million
  hasSigner: boolean;            // Remote signer present
  warnings: string[];            // Array of warning messages
}
```

**Relationships**:
- Belongs to `Treasury` (via `treasuryId`)
- Has many `Channel` (via `Channel.nodeId`)

**Validation Rules**:
- `pubkey` must be 66-char hex string
- `status` must be one of enum values
- `version` recommended >= v0.16.0 (warning if outdated)

---

### 3. Lease

Agreement between Treasury (provider) and Subscriber (consumer) for liquidity capacity.

```typescript
interface Lease {
  id: string;                    // Unique identifier (e.g., 'lease_001')
  treasuryId: string;            // FK to Treasury
  subscriberId: string;          // FK to Subscriber
  lesseeAlias: string;           // Display name of lessee
  size: number;                  // Inbound capacity in BTC
  startDate: string;             // ISO 8601
  endDate: string;               // ISO 8601
  daysRemaining: number;         // Calculated field
  feeModel: 'fixed' | 'ppm';     // Fee structure
  feeAmount?: number;            // If fixed, amount in BTC
  feePPM?: number;               // If ppm, rate
  effectiveCostPPM: number;      // Normalized cost for comparison
  status: 'active' | 'pending' | 'expired' | 'cancelled';
}
```

**Relationships**:
- Belongs to `Treasury` (via `treasuryId`)
- Belongs to `Subscriber` (via `subscriberId`)

**Validation Rules**:
- `endDate` > `startDate`
- `daysRemaining` = days between now and `endDate`
- If `feeModel === 'fixed'`, `feeAmount` required
- If `feeModel === 'ppm'`, `feePPM` required
- Alert if `daysRemaining <= 14`

---

### 4. Channel

Lightning Network payment channel.

```typescript
interface Channel {
  id: string;                    // Unique identifier (e.g., 'chan_001')
  nodeId: string;                // FK to Node
  peer: string;                  // Peer node alias or pubkey
  capacity: number;              // Total capacity in BTC
  localBalance: number;          // Local balance in BTC
  remoteBalance: number;         // Remote balance in BTC
  utilization: number;           // (routed volume / capacity) * 100 over 7d
  baseFee: number;               // Base fee in msat
  feePPM: number;                // Fee rate parts-per-million
  htlcSuccessRate: number;       // Success rate % (0-100)
  uptime: number;                // Uptime % (0-100)
  isActive: boolean;             // Channel active state
  lastUpdated: string;           // ISO 8601
}
```

**Relationships**:
- Belongs to `Node` (via `nodeId`)

**Validation Rules**:
- `capacity` = `localBalance` + `remoteBalance`
- `utilization` based on 7-day routed volume (mocked calculation)
- Alert if `utilization` < target threshold (e.g., 20%)

---

### 5. Statement

Monthly financial report for a treasury.

```typescript
interface Statement {
  id: string;                    // Unique identifier (e.g., 'stmt_202311')
  treasuryId: string;            // FK to Treasury
  period: string;                // 'YYYY-MM' format
  leaseFeesEarned: number;       // BTC earned from leases
  routingFeesEarned: number;     // BTC earned from routing
  grossTotal: number;            // Sum of above
  flowrateMargin: number;        // Margin deducted (BTC)
  netTotal: number;              // grossTotal - flowrateMargin
  generatedAt: string;           // ISO 8601 timestamp
  downloadUrls: {
    csv: string;                 // URL or path to CSV
    pdf: string;                 // URL or path to PDF
  };
}
```

**Relationships**:
- Belongs to `Treasury` (via `treasuryId`)

**Validation Rules**:
- `period` must match `\d{4}-\d{2}`
- `grossTotal` = `leaseFeesEarned` + `routingFeesEarned`
- `netTotal` = `grossTotal` - `flowrateMargin`

---

## Subscriber Role Entities

### 6. Subscriber

Organization leasing guaranteed inbound capacity.

```typescript
interface Subscriber {
  id: string;                    // Unique identifier (e.g., 'sub_001')
  name: string;                  // Display name (e.g., 'BitExchange')
  inboundLeased: number;         // Total BTC leased
  expiringLeases: number;        // Count of leases expiring ≤14 days
  effectiveCostPPM: number;      // Blended cost across leases
  effectiveCostFixed: number;    // Fixed cost component (BTC)
  paymentSuccessRate: number;    // 7-day success % (0-100)
  openIncidents: number;         // Count of open issues
  channelCount: number;          // Total channels
  primaryPeers: string[];        // Array of main peer aliases
  lastPolicyUpdate: string;      // ISO 8601
}
```

**Relationships**:
- Has many `Lease` (via `Lease.subscriberId`)
- Has many `Invoice` (via `Invoice.subscriberId`)
- Has many `APIKey` (via `APIKey.subscriberId`)
- Has many `Webhook` (via `Webhook.subscriberId`)

**Validation Rules**:
- `paymentSuccessRate` between 0-100
- Alert if `paymentSuccessRate` < threshold (e.g., 95%)

---

### 7. DemandTicket

Capacity request from a subscriber processed by admins.

```typescript
interface DemandTicket {
  id: string;                    // Unique identifier (e.g., 'dmd_001')
  subscriberId: string;          // FK to Subscriber
  size: number;                  // Requested BTC capacity
  term: number;                  // Requested term in days
  priceMin: number;              // Min acceptable cost (ppm)
  priceMax: number;              // Max acceptable cost (ppm)
  riskTier: 'low' | 'medium' | 'high';
  status: 'pending' | 'matched' | 'rejected';
  createdAt: string;             // ISO 8601
  matchedTreasuryId?: string;    // FK to Treasury (if matched)
}
```

**Relationships**:
- Belongs to `Subscriber` (via `subscriberId`)
- May match to `Treasury` (via `matchedTreasuryId`)

---

### 8. APIKey

Credential for subscriber API integration.

```typescript
interface APIKey {
  id: string;                    // Unique identifier (e.g., 'key_001')
  subscriberId: string;          // FK to Subscriber
  label: string;                 // User-provided label
  keyPrefix: string;             // First 8 chars (e.g., 'frl_12ab')
  createdAt: string;             // ISO 8601
  lastUsed?: string;             // ISO 8601 (null if never used)
  permissions: ('read' | 'write')[];
}
```

**Note**: Full key value never stored/shown after creation (mocked security).

---

### 9. Webhook

Event notification endpoint configured by subscriber.

```typescript
interface Webhook {
  id: string;                    // Unique identifier (e.g., 'hook_001')
  subscriberId: string;          // FK to Subscriber
  url: string;                   // Callback URL
  events: ('capacity-delivered' | 'expiry-warning' | 'incident')[];
  secret?: string;               // HMAC secret (optional)
  isActive: boolean;
  lastTriggered?: string;        // ISO 8601 (null if never)
}
```

---

### 10. Invoice

Billing record for subscriber showing payment status.

```typescript
interface Invoice {
  id: string;                    // Unique identifier (e.g., 'inv_202311')
  subscriberId: string;          // FK to Subscriber
  period: string;                // 'YYYY-MM' format
  amount: number;                // BTC or USD (specify unit)
  currency: 'BTC' | 'USD';
  status: 'paid' | 'unpaid' | 'overdue';
  dueDate: string;               // ISO 8601
  pdfUrl: string;                // Link to PDF download
}
```

**Validation Rules**:
- If `status === 'overdue'`, `dueDate` < now

---

## Admin Role Entities

### 11. TreasuryPool

Grouping of treasury capacity for matchmaking.

```typescript
interface TreasuryPool {
  id: string;                    // Unique identifier (e.g., 'pool_001')
  name: string;                  // Display name
  treasuryIds: string[];         // Array of Treasury IDs
  totalCapacity: number;         // Aggregate BTC capacity
  availableCapacity: number;     // Unallocated BTC
  policy: {
    minTerm: number;             // Minimum lease term (days)
    maxExposure: number;         // Max to single lessee (BTC)
    jurisdictions: string[];     // Allowed countries
  };
}
```

---

### 12. ComplianceRecord

KYC/KYB metadata for subscriber or treasury.

```typescript
interface ComplianceRecord {
  id: string;                    // Unique identifier (e.g., 'kyc_001')
  entityId: string;              // FK to Subscriber or Treasury
  entityType: 'subscriber' | 'treasury';
  status: 'pending' | 'approved' | 'rejected';
  kycChecklist: {
    idVerified: boolean;
    addressVerified: boolean;
    entityVerified: boolean;
  };
  documentsReceived: number;     // Count
  riskScore: number;             // 0-100 (higher = riskier)
  sanctionsCheck: 'pass' | 'fail' | 'pending';
  lastUpdated: string;           // ISO 8601
}
```

**Note**: No PII stored in frontend - metadata only.

---

### 13. Contract

Formal lease agreement issued after capacity allocation.

```typescript
interface Contract {
  id: string;                    // Unique identifier (e.g., 'ctr_001')
  leaseId: string;               // FK to Lease
  treasuryId: string;            // FK to Treasury
  subscriberId: string;          // FK to Subscriber
  terms: {
    size: number;
    duration: number;            // Days
    feeStructure: string;        // Human-readable summary
  };
  issuedAt: string;              // ISO 8601
  signedByTreasury?: string;     // ISO 8601 (null if unsigned)
  signedBySubscriber?: string;   // ISO 8601 (null if unsigned)
  status: 'draft' | 'active' | 'completed';
}
```

---

### 14. AuditLog

Immutable record of system actions and events.

```typescript
interface AuditLog {
  id: string;                    // Unique identifier (e.g., 'log_001')
  timestamp: string;             // ISO 8601
  actor: {
    type: 'user' | 'system';
    id: string;                  // User ID or 'system'
    name: string;                // Display name
  };
  action: string;                // e.g., 'lease.created', 'user.login'
  entityType: string;            // e.g., 'Lease', 'User'
  entityId: string;              // Affected entity ID
  details: Record<string, unknown>; // Structured metadata
  ipAddress?: string;            // Client IP (optional)
}
```

---

## Shared Entities

### 15. Alert

Notification for users about events requiring attention.

```typescript
interface Alert {
  id: string;                    // Unique identifier (e.g., 'alert_001')
  userId: string;                // Target user (Treasury/Subscriber/Admin)
  userType: 'treasury' | 'subscriber' | 'admin';
  severity: 'info' | 'warning' | 'error';
  title: string;                 // Short title
  message: string;               // Full message
  actionLabel?: string;          // CTA text (e.g., 'Renew Now')
  actionUrl?: string;            // CTA link
  createdAt: string;             // ISO 8601
  readAt?: string;               // ISO 8601 (null if unread)
  dismissedAt?: string;          // ISO 8601 (null if not dismissed)
}
```

**Alert Types**:
- Lease expiring ≤14 days
- Utilization below target
- Uptime drops
- Payment success rate drops
- Policy drift from template

---

### 16. YieldDataPoint

Time-series data for yield charts.

```typescript
interface YieldDataPoint {
  date: string;                  // ISO 8601 date (YYYY-MM-DD)
  routingYield: number;          // BTC earned from routing
  leaseYield: number;            // BTC earned from leases
}
```

Used for Treasury "Yield over time" chart.

---

## Mock Data Generation Strategy

### Volume Targets

| Entity              | Count | Notes                                |
| ------------------- | ----- | ------------------------------------ |
| Treasury            | 5     | Diverse sizes (0.5 - 50 BTC)         |
| Node                | 20    | 2-5 per treasury                     |
| Lease               | 50    | Mix of active/pending/expired        |
| Channel             | 100   | 3-10 per node                        |
| Statement           | 15    | 3 months per treasury                |
| Subscriber          | 10    | Exchanges, wallets, PSPs             |
| DemandTicket        | 25    | Pending matches                      |
| APIKey              | 20    | 1-3 per subscriber                   |
| Webhook             | 15    | 0-2 per subscriber                   |
| Invoice             | 30    | 3 months per subscriber              |
| TreasuryPool        | 5     | Aggregated capacity                  |
| ComplianceRecord    | 15    | Mix of statuses                      |
| Contract            | 40    | Issued contracts                     |
| AuditLog            | 100   | Last 30 days of activity             |
| Alert               | 30    | 5-10 per user type                   |
| YieldDataPoint      | 90    | 90 days of daily data (for 7/30/90d) |

### Generator Utilities

```typescript
// lib/mock-data/generators.ts

export function randomBTC(min: number, max: number): number {
  return +(Math.random() * (max - min) + min).toFixed(8);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomItem<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

export function generatePubkey(): string {
  return Array.from({ length: 66 }, () =>
    randomInt(0, 15).toString(16)
  ).join('');
}

export function generateId(prefix: string, index: number): string {
  return `${prefix}_${String(index).padStart(3, '0')}`;
}

export function dateNDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function randomDate(startDaysAgo: number, endDaysAgo: number): string {
  const days = randomInt(endDaysAgo, startDaysAgo);
  return dateNDaysAgo(days);
}
```

---

## Type Export Structure

```typescript
// types/treasury.ts
export type { Treasury, Node, Lease, Channel, Statement };

// types/subscriber.ts
export type { Subscriber, DemandTicket, APIKey, Webhook, Invoice };

// types/admin.ts
export type { TreasuryPool, ComplianceRecord, Contract, AuditLog };

// types/shared.ts
export type { Alert, YieldDataPoint };

// types/index.ts
export * from './treasury';
export * from './subscriber';
export * from './admin';
export * from './shared';
```

---

## Validation Rules Summary

1. **Referential Integrity**: All FK references point to valid entities
2. **Date Logic**: `endDate` > `startDate`, expiration calculations correct
3. **Numeric Ranges**: Percentages 0-100, positive amounts
4. **Status Transitions**: Only valid state changes (e.g., pending → active → expired)
5. **Alerts**: Auto-generated based on business rules (14-day expiry, etc.)

---

## Next Steps

1. Implement TypeScript interfaces in `/types/` directory
2. Create mock data files in `/lib/mock-data/` using generators
3. Export centralized data access functions (e.g., `getTreasuryById`)
4. Test data integrity (all relationships valid, calculations correct)

---

**Completion Criteria**: All 16 entities defined, generators implemented, mock data accessible via typed imports.

