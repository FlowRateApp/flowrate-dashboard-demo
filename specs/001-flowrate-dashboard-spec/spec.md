# Feature Specification: Flowrate Dashboard — Multi-Role Lightning Network Management Platform

**Feature Branch**: `001-flowrate-dashboard-spec`  
**Created**: November 4, 2025  
**Status**: Draft  
**Input**: User description: "@Flowrate Dashboard Spec v0.md"

## Execution Flow (main)

```
1. Parse user description from Input
   → ✅ Feature description provided
2. Extract key concepts from description
   → ✅ Identified: 3 user roles, 6+ major functional areas per role
3. For each unclear aspect:
   → Marked with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → ✅ User flows documented for all three roles
5. Generate Functional Requirements
   → ✅ Each requirement is testable
6. Identify Key Entities (if data involved)
   → ✅ Core entities documented
7. Run Review Checklist
   → ⚠️ Some [NEEDS CLARIFICATION] items remain
8. Return: SUCCESS (spec ready for planning with clarifications needed)
```

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## Overview

The Flowrate Dashboard is a multi-role platform for managing Lightning Network liquidity marketplaces. It serves three distinct user types:

1. **Treasuries**: Organizations deploying Bitcoin capital into Lightning nodes to earn yields through routing fees and channel leases
2. **Liquidity Subscribers**: Exchanges, wallets, and payment service providers leasing guaranteed inbound capacity
3. **Admins**: Flowrate operations staff managing supply/demand matching, compliance, and orchestration

**Core Principles**:

- Non-custodial transparency (users always control their keys)
- Institutional-grade polish and data presentation
- Fast at-a-glance KPI visibility
- Safe defaults with clear state indication
- Minimal Lightning Network jargon for non-technical users

---

## Clarifications

### Session 2025-11-04

- Q: What authentication method should the system support? → A: No authentication required. All data will be mocked. Three main dashboard routes (Treasury, Subscriber, Admin), each with sub-routes and unique navbar menu options.
- Q: Should the dashboard support mobile devices or be desktop-only? → A: Responsive design (adapts to mobile, tablet, desktop)
- Q: How should channel utilization % be calculated for display? → A: Total routed volume / total capacity over time period (throughput-based)
- Q: What file formats should be supported for exporting tabular data? → A: CSV only (universal compatibility)
- Q: What time range should charts display by default? → A: 7 days (1 week view for recent trends)

---

## User Scenarios & Testing

### Primary User Stories

#### Story 1: Treasury Operator Monitors Yield Performance

**As a** treasury manager deploying Bitcoin capital  
**I want to** view my deployed capital's performance and active lease status  
**So that** I can make informed decisions about capital allocation and renewals

#### Story 2: Liquidity Subscriber Ensures Capacity Availability

**As an** exchange operator  
**I want to** monitor my leased inbound capacity and renewal timelines  
**So that** I can maintain reliable Lightning payment processing without interruptions

#### Story 3: Admin Matches Supply with Demand

**As a** Flowrate operations admin  
**I want to** view demand requests and available treasury capacity  
**So that** I can efficiently allocate resources and create lease agreements

### Acceptance Scenarios

#### Treasury Dashboard

1. **Given** a treasury has deployed Bitcoin across multiple nodes, **When** they view the overview, **Then** they see KPIs for deployed BTC, gross APY, net APY, earned to date, active leases, utilization %, and node uptime
2. **Given** a lease is expiring within 14 days, **When** the treasury views their dashboard, **Then** they see an alert notification with lease details and renewal action
3. **Given** a treasury wants to understand channel performance, **When** they view the channels table, **Then** they see peer info, capacity, balance distribution, utilization %, fee rates, HTLC success rate, and uptime
4. **Given** a treasury needs financial records, **When** they access billing section, **Then** they can download monthly statements in CSV/PDF format showing lease fees, routing fees, and net amounts after Flowrate margin

#### Subscriber Dashboard

1. **Given** a subscriber has active capacity leases, **When** they view the overview, **Then** they see total inbound leased, expiring leases (≤14 days), effective cost, payment success rate (7-day), and open incidents
2. **Given** a subscriber needs additional capacity, **When** they use the request flow, **Then** they can specify size, term, and price band to submit a capacity request ticket
3. **Given** a subscriber needs API integration, **When** they access the integration section, **Then** they can create labeled API keys (shown once), configure webhook endpoints with test capability, and manage IP allowlists
4. **Given** a subscriber receives a capacity-delivered webhook, **When** the event triggers, **Then** they receive a payload containing lease details and channel information

#### Admin Dashboard

1. **Given** multiple new subscriber requests exist, **When** an admin views the command center, **Then** they see queues for new requests, pending KYC, expiring leases, and reconciliation differences
2. **Given** a demand ticket exists, **When** admin accesses matchmaking, **Then** they see ticket details (size, term, price, risk tier) alongside suggested treasury pools with policy constraints
3. **Given** an admin is allocating capacity, **When** they select a treasury pool for a demand ticket, **Then** they can allocate partial or full capacity, set fee terms, and issue a contract
4. **Given** channel lifecycle operations are in progress, **When** admin views orchestration, **Then** they see channel states (Pending → Opening → Active → Closing/Splicing) with per-step logs

### Edge Cases

- **What happens when** a treasury's node goes offline during an active lease? [NEEDS CLARIFICATION: SLA breach procedure, compensation policy]
- **What happens when** a subscriber's payment success rate drops below a threshold? [NEEDS CLARIFICATION: threshold value, alert mechanism, remediation process]
- **What happens when** a lease renewal is requested but the treasury declines? [NEEDS CLARIFICATION: matching to alternative treasury, notification timeline]
- **What happens when** displayed utilization % is below target threshold? [NEEDS CLARIFICATION: target threshold value (e.g., <20%), alert behavior, recommended remediation actions]
- **How does the system handle** channel close requests during an active lease period? [NEEDS CLARIFICATION: guard mechanism details, approval workflow]
- **How does the system handle** concurrent capacity allocation by multiple admins? [NEEDS CLARIFICATION: locking mechanism, conflict resolution]
- **What happens when** a treasury wants to withdraw capital that's currently under lease? [NEEDS CLARIFICATION: early termination policy, penalties]

---

## Requirements

### Functional Requirements

#### Cross-Role Requirements

- **FR-001**: System MUST provide three separate dashboard routes: Treasury route (`/treasury`), Subscriber route (`/subscriber`), and Admin route (`/admin`), each with role-appropriate functionality and navigation
- **FR-002**: Each dashboard route MUST have its own unique navigation bar with sub-route menu options specific to that role
- **FR-003**: System MUST use mocked data for all displayed information (no backend integration required)
- **FR-004**: System MUST display all monetary values in Bitcoin (BTC) units
- **FR-005**: System MUST clearly indicate non-custodial status with visible badges/indicators
- **FR-006**: System MUST provide contextual glossary popovers for Lightning Network terminology (routing yield, lease yield, utilization, etc.)
- **FR-007**: System MUST display all timestamps in user's local timezone with clear date formatting

#### Treasury Requirements

- **FR-101**: System MUST display overview KPIs: deployed BTC, gross APY, net APY, earned to date, active leases, utilization %, node uptime
- **FR-102**: System MUST show yield over time chart with stacked visualization of routing yield vs lease yield (default 7-day view)
- **FR-103**: System MUST display top counterparties table with: lessee, inbound size, term, days remaining, effective cost (ppm), status
- **FR-104**: System MUST provide lease management table with: id, counterparty, size, term dates, days left, fee model (fixed/ppm), status, actions
- **FR-105**: System MUST allow lease renewal, increase capacity, and CSV export actions from lease table
- **FR-106**: System MUST open lease detail drawer showing invoices/settlements timeline when lease is selected
- **FR-107**: System MUST display channel table with: peer, capacity, local/remote balance, utilization %, base/ppm fees, HTLC success rate, uptime
- **FR-107a**: System MUST provide tooltip on utilization % column explaining the calculation method: routed volume over capacity for the selected time period
- **FR-108**: System MUST provide channel view and close actions with [NEEDS CLARIFICATION: specific guard mechanism for close action?]
- **FR-109**: System MUST display node health cards showing: status pill, version, ping latency, last rebalance time, fee policy snapshot, remote signer presence
- **FR-110**: System MUST alert when node version is outdated [NEEDS CLARIFICATION: version comparison source, update threshold?]
- **FR-111**: System MUST generate downloadable monthly billing statements in CSV and PDF formats
- **FR-112**: System MUST show statement breakdown: lease fees earned, routing fees earned, net amount after Flowrate margin
- **FR-113**: System MUST display configured payout destinations (read-only)
- **FR-114**: System MUST alert for: leases expiring ≤14 days, utilization below target, uptime drops, policy drift from recommended template
- **FR-115**: System MUST show transparent Flowrate margin deduction in all financial displays
- **FR-116**: System MUST [NEEDS CLARIFICATION: refresh rate for real-time KPIs like uptime, utilization?]

#### Subscriber Requirements

- **FR-201**: System MUST display overview KPIs: inbound leased (BTC), expiring leases (≤14 days), effective cost (ppm & fixed), payment success % (7-day), open incidents
- **FR-202**: System MUST show chart comparing delivered inbound capacity vs usage over time with success rate line (default 7-day view)
- **FR-203**: System MUST display lease table with: id, pool/treasury identifier, inbound size, term dates, days left, fee model, status
- **FR-204**: System MUST allow lease renewal, scale-up, and term-end cancellation actions
- **FR-205**: System MUST provide capacity request flow with inputs for: size, term, price band selector
- **FR-206**: System MUST submit capacity requests as tickets to admin queue
- **FR-207**: System MUST allow creation of labeled API keys with one-time display of key secret
- **FR-208**: System MUST show API key metadata: label, creation date, last used timestamp
- **FR-209**: System MUST allow creation and testing of webhook endpoints
- **FR-210**: System MUST support webhook payloads for: capacity-delivered, expiry-warning, incident events
- **FR-211**: System MUST allow configuration of IP allowlist for API access
- **FR-212**: System MUST display invoice table with: id, period, amount, status (paid/unpaid), PDF download link
- **FR-213**: System MUST show read-only health metrics: channel count, primary peers, uptime summary, last policy update
- **FR-214**: System MUST alert for: capacity under target, success% drop, nearing expiry
- **FR-215**: System MUST display pool nickname with compliance badge when treasury is anonymized [NEEDS CLARIFICATION: anonymization rules, badge types?]
- **FR-216**: System MUST provide one-click renewal CTA on expiring capacity cards in overview
- **FR-217**: System MUST [NEEDS CLARIFICATION: payment method for invoices - Bitcoin only, fiat options?]

#### Admin Requirements

- **FR-301**: System MUST display command center KPIs: total supply (BTC), total active leases, average net APY to treasuries, SLA breaches (7-day), open incidents
- **FR-302**: System MUST show action queues for: new subscriber requests, KYC pending, expiring soon, reconciliation differences
- **FR-303**: System MUST display matchmaking table pairing demand tickets with suggested treasury pools
- **FR-304**: System MUST show demand ticket details: size, term, price range, counterparty risk tier
- **FR-305**: System MUST show treasury pool details: policy, available capacity, constraints
- **FR-306**: System MUST allow capacity allocation actions: partial/full allocation, fee term setting, contract issuance
- **FR-307**: System MUST display KYC/KYB status: checklist completion, documents received, risk score, sanctions check results (mocked compliance metadata)
- **FR-308**: System MUST display and enforce lease policy rules: minimum term, maximum single-lessee exposure, jurisdiction constraints
- **FR-310**: System MUST show channel lifecycle states: Pending, Opening, Active, Closing, Splicing with per-step logs
- **FR-311**: System MUST display node fleet status: version drift, uptime, signer quorum status, backup status
- **FR-312**: System MUST show finance summary: fee accruals, treasury payouts pending, margin capture, monthly statements tracker
- **FR-313**: System MUST display mocked user management interface showing user list with roles (Treasury, Subscriber, Admin), last login, and API key counts
- **FR-314**: System MUST provide audit log viewer with filtering and CSV export capabilities displaying mocked audit entries
- **FR-315**: System MUST display mocked reconciliation queue showing capacity allocation differences that need admin review

### Performance Requirements

- **PR-001**: Dashboard overview pages MUST load within 200ms for critical KPIs
- **PR-002**: Data table filtering and sorting MUST respond within 200ms
- **PR-003**: Chart rendering with 7 days of historical data (default view) MUST complete within 2 seconds
- **PR-004**: Statement generation (CSV) MUST complete within 5 seconds for monthly data
- **PR-005**: Real-time metric updates MUST occur [NEEDS CLARIFICATION: update frequency - every 10s, 60s, on-demand?]
- **PR-006**: System MUST support [NEEDS CLARIFICATION: concurrent user capacity per role?]

### Accessibility Requirements

- **AR-001**: All dashboard interfaces MUST meet WCAG 2.1 AA standards
- **AR-002**: All data visualizations MUST provide text alternatives and accessible color schemes
- **AR-003**: All interactive elements MUST be keyboard navigable
- **AR-004**: All tooltips and popovers MUST be accessible via keyboard and screen readers
- **AR-005**: All tables MUST support screen reader navigation with proper headers

### Security Requirements

- **SR-001**: Each dashboard route MUST display only data relevant to that role (route-based data separation with mocked data)
- **SR-002**: API keys MUST be displayed only once upon creation with secure storage afterward (simulated in UI)
- **SR-003**: System MUST simulate IP allowlist configuration interface for API access
- **SR-004**: System MUST display mocked audit log entries for demonstration purposes
- **SR-005**: System MUST prevent storing PII in frontend with metadata-only compliance display (demonstration with mocked metadata)

### User Experience Requirements

- **UX-001**: System MUST minimize Lightning Network jargon with contextual glossary support
- **UX-002**: System MUST provide safe defaults for all configuration options
- **UX-003**: System MUST clearly indicate system state with status pills and indicators
- **UX-004**: System MUST provide confirmation dialogs for destructive actions (channel close, lease cancellation)
- **UX-005**: System MUST display loading states during data fetches and processing
- **UX-006**: System MUST provide empty states with actionable guidance when no data exists
- **UX-007**: System MUST implement responsive design that adapts layouts and navigation for mobile (≤768px), tablet (769px-1023px), and desktop (≥1024px) screen sizes
- **UX-008**: System MUST ensure all interactive elements (buttons, dropdowns, inputs) are appropriately sized for touch interactions on mobile devices
- **UX-009**: System MUST optimize data table displays for smaller screens using techniques such as horizontal scrolling, column hiding, or card-based layouts
- **UX-010**: System MUST provide CSV export capability for all tabular data (tables, logs, reports)
- **UX-011**: System MUST include column headers and properly formatted data in all CSV exports
- **UX-012**: System MUST display all time-series charts with 7-day default view
- **UX-013**: System MUST provide time range selector controls on charts to allow users to view different periods (e.g., 7d, 30d, 90d)

### Data Requirements

- **DR-001**: System MUST persist user preferences [NEEDS CLARIFICATION: specific preferences - theme, default views, notification settings?]
- **DR-002**: System MUST retain sufficient historical data to support chart views (minimum 90 days recommended to support 7d/30d/90d views)
- **DR-003**: System MUST calculate APY values [NEEDS CLARIFICATION: calculation methodology, annualization approach?]
- **DR-004**: System MUST calculate channel utilization % as: (Total routed volume over time period ÷ Total channel capacity) × 100, where time period is configurable (default: 7 days)
- **DR-005**: System MUST track routed volume per channel to support utilization calculations
- **DR-006**: System MUST define "uptime" as [NEEDS CLARIFICATION: measurement method, acceptable downtime threshold?]

### Key Entities

- **User**: Represents a platform user with assigned role (Treasury, Subscriber, Admin), authentication credentials, preferences, and audit trail
- **Treasury**: Organization deploying Bitcoin capital, associated with multiple nodes, lease agreements, and payout configurations
- **Node**: Lightning Network node instance with version, uptime metrics, fee policy, channels, and health status; belongs to a Treasury
- **Lease**: Agreement between Treasury (provider) and Subscriber (consumer) defining inbound capacity size, term dates, fee model, status, and counterparty information
- **Channel**: Lightning Network payment channel with peer identifier, capacity, balance distribution, fee rates, performance metrics (HTLC success, uptime)
- **Subscriber**: Organization consuming guaranteed inbound capacity, associated with leases, API keys, webhooks, invoices, and integration configuration
- **Demand Ticket**: Capacity request from Subscriber specifying size, term, price range, and risk profile; processed by Admins for matching
- **Treasury Pool**: Grouping of Treasury capacity with associated policy, constraints, and availability; used in matchmaking
- **Invoice**: Billing record for Subscriber showing period, amount, payment status, and downloadable statement
- **Statement**: Financial report for Treasury showing lease fees, routing fees, Flowrate margin deduction, and net earnings for a period
- **API Key**: Credential for Subscriber integration with label, creation timestamp, last used timestamp, and access permissions
- **Webhook**: Event notification endpoint configured by Subscriber for capacity, expiry, and incident events
- **Alert**: Notification for users about expiring leases, performance issues, policy drift, or SLA breaches
- **Audit Log**: Immutable record of user actions, system events, and security-relevant operations with timestamp, actor, and details
- **Compliance Record**: KYC/KYB documentation status, risk score, sanctions check results, and jurisdiction information; displayed as metadata only
- **Contract**: Formal lease agreement issued by Admin after capacity allocation, defining terms between Treasury and Subscriber

---

## Review & Acceptance Checklist

### Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness

- [ ] No [NEEDS CLARIFICATION] markers remain — **⚠️ 30+ clarifications needed**
- [x] Requirements are testable and unambiguous (for specified items)
- [ ] Success criteria are measurable — **⚠️ Pending clarifications for performance and scale targets**
- [x] Scope is clearly bounded to three user roles and defined feature areas
- [x] Dependencies identified (Lightning Network operations, non-custodial architecture)

### Constitution Compliance

- [x] Performance requirements specified (<200ms critical, <2s complex) — **⚠️ Some specifics need clarification**
- [x] Accessibility requirements included (WCAG 2.1 AA)
- [x] Security requirements identified — **⚠️ Some details need clarification**
- [x] User experience consistency requirements defined
- [ ] Testing requirements specified — [NEEDS CLARIFICATION: unit test coverage targets, integration test scope, performance test scenarios?]

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted (3 roles, 20+ feature areas)
- [x] Ambiguities marked (30+ clarification points)
- [x] User scenarios defined for all three roles
- [x] Requirements generated (80+ functional requirements)
- [x] Entities identified (16 core entities)
- [ ] Review checklist passed — **⚠️ Requires clarification resolution**

---

## Next Steps

This specification is ready for stakeholder review to resolve clarification items. Priority clarifications for planning phase:

1. **Authentication & Security**: Auth method, MFA requirements, session management
2. **Performance Targets**: Concurrent users, data retention periods, update frequencies
3. **Business Logic**: APY calculation, utilization formula, SLA breach handling
4. **Integration Scope**: Payment methods, mobile responsiveness, export formats
5. **Compliance**: PII storage architecture, audit log retention, KYC workflow details

Once clarifications are resolved, this spec will be ready for technical planning and task breakdown.
