# Tasks: Flowrate Dashboard

**Branch**: `001-flowrate-dashboard-spec`  
**Input**: Design documents from `/Users/orlando/Projects/lightning/specs/001-flowrate-dashboard-spec/`  
**Prerequisites**: plan.md (✅), research.md (✅), data-model.md (✅), contracts/ (✅), quickstart.md (✅)

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → ✅ Found: Next.js 14, TypeScript, Shadcn/UI, Tailwind CSS
   → ✅ Project structure: Single Next.js project with route groups
2. Load optional design documents:
   → ✅ data-model.md: 16 entities extracted
   → ✅ contracts/: 4 TypeScript type contract files
   → ✅ research.md: 9 technology decisions documented
   → ✅ quickstart.md: Setup instructions available
3. Generate tasks by category:
   → Setup: 4 tasks (project init, dependencies, Shadcn, structure)
   → Mock Data: 6 tasks (types, generators, 3 role data files)
   → Shared Components: 8 tasks (Shadcn installs, custom composites)
   → Treasury Dashboard: 7 tasks (layout + 6 pages)
   → Subscriber Dashboard: 7 tasks (layout + 6 pages)
   → Admin Dashboard: 8 tasks (layout + 7 pages)
   → Polish: 4 tasks (animations, responsive, accessibility, optimization)
4. Apply task rules:
   → Different files = mark [P] for parallel execution
   → Same file/dependent = sequential
   → No tests required per user specification
5. Number tasks sequentially (T001-T044)
6. ✅ Dependency graph generated
7. ✅ Parallel execution examples provided
8. Validate task completeness:
   → ✅ All 16 entities have type definitions
   → ✅ All 20 pages across 3 roles covered
   → ✅ All shared components identified
9. Return: SUCCESS (44 tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- All file paths are absolute to avoid ambiguity
- Each task is specific and executable by an LLM agent

## Path Conventions

**Project Root**: `/Users/orlando/Projects/lightning/`  
**Project Type**: Single Next.js project (frontend-only)  
**Structure**: App Router with route groups `(treasury)`, `(subscriber)`, `(admin)`

---

## Phase 3.1: Foundation & Setup

**Goal**: Initialize Next.js project, install dependencies, configure Shadcn/UI, create directory structure

- [x] **T001** Initialize Next.js 14 project with TypeScript, Tailwind CSS, and App Router at `/Users/orlando/Projects/lightning/` (if not already initialized)

  - Run: `npx create-next-app@latest . --typescript --tailwind --app --use-npm`
  - Configure: TypeScript strict mode, path aliases `@/*`
  - Accept defaults: ESLint yes, src/ directory no, App Router yes

- [x] **T002** Install all required dependencies listed in quickstart.md

  - Shadcn/UI dependencies: `@radix-ui/react-slot class-variance-authority clsx tailwind-merge`
  - Chart library: `recharts`
  - Animation library: `framer-motion`
  - Form handling: `react-hook-form zod @hookform/resolvers`
  - Date utilities: `date-fns`
  - Icons: `lucide-react`

- [x] **T003** Configure Shadcn/UI and apply custom theme

  - Run: `npx shadcn@latest init` (accept defaults: Default style, Slate color, CSS variables yes)
  - Replace `/Users/orlando/Projects/lightning/app/globals.css` with custom orange/dark theme from quickstart.md
  - Verify `components.json` created

- [x] **T004** Create complete project directory structure
  - Create route group directories: `app/(treasury)/treasury/{leases,channels,nodes,billing}`
  - Create route group directories: `app/(subscriber)/subscriber/{leases,integration,invoices,health}`
  - Create route group directories: `app/(admin)/admin/{matchmaking,compliance,orchestration,finance,audit}`
  - Create component directories: `components/{ui,dashboard,layouts}`
  - Create data directories: `lib/mock-data`, `types`, `hooks`
  - Create public directory: `public/assets`

---

## Phase 3.2: Mock Data Layer

**Goal**: Create TypeScript types, implement mock data generators, populate data for all three roles

- [x] **T005** [P] Copy type contract files from contracts/ to types/

  - Copy: `specs/001-flowrate-dashboard-spec/contracts/treasury.types.ts` → `types/treasury.ts`
  - Copy: `specs/001-flowrate-dashboard-spec/contracts/subscriber.types.ts` → `types/subscriber.ts`
  - Copy: `specs/001-flowrate-dashboard-spec/contracts/admin.types.ts` → `types/admin.ts`
  - Copy: `specs/001-flowrate-dashboard-spec/contracts/shared.types.ts` → `types/shared.ts`
  - Create: `types/index.ts` exporting all types

- [x] **T006** [P] Implement mock data generator utilities in `lib/mock-data/generators.ts`

  - Functions: `randomBTC()`, `randomInt()`, `randomItem()`, `generatePubkey()`, `generateId()`, `dateNDaysAgo()`, `randomDate()`
  - Reference: data-model.md for generator specifications
  - Ensure: Realistic Bitcoin values (8 decimal places), valid Lightning pubkeys (66-char hex)

- [x] **T007** [P] Create Treasury mock data in `lib/mock-data/treasury.ts`

  - Generate: 5 treasuries, 20 nodes, 50 leases, 100 channels (per data-model.md volume targets)
  - Export: `MOCK_TREASURIES`, `MOCK_NODES`, `MOCK_LEASES`, `MOCK_CHANNELS`
  - Include: 90-day yield data points for charts (`YieldDataPoint[]`)
  - Ensure: Valid relationships (all `nodeId` references exist, all `treasuryId` references exist)

- [x] **T008** [P] Create Subscriber mock data in `lib/mock-data/subscriber.ts`

  - Generate: 10 subscribers, 20 API keys, 15 webhooks, 30 invoices
  - Export: `MOCK_SUBSCRIBERS`, `MOCK_API_KEYS`, `MOCK_WEBHOOKS`, `MOCK_INVOICES`
  - Include: 90-day capacity usage data points for charts (`CapacityDataPoint[]`)
  - Ensure: Valid relationships (all `subscriberId` references exist)

- [x] **T009** [P] Create Admin mock data in `lib/mock-data/admin.ts`

  - Generate: 25 demand tickets, 5 treasury pools, 15 compliance records, 40 contracts, 100 audit logs
  - Export: `MOCK_DEMAND_TICKETS`, `MOCK_TREASURY_POOLS`, `MOCK_COMPLIANCE_RECORDS`, `MOCK_CONTRACTS`, `MOCK_AUDIT_LOGS`
  - Ensure: Valid relationships (tickets reference subscribers, contracts reference leases)

- [x] **T010** [P] Create shared mock data in `lib/mock-data/shared.ts`
  - Generate: 30 alerts (10 per user type)
  - Export: `MOCK_ALERTS`, `MOCK_STATEMENTS`
  - Include: Statements for each treasury (3 months of monthly statements)

---

## Phase 3.3: Shared UI Components

**Goal**: Install Shadcn/UI base components, create custom composite components for dashboards

- [x] **T011** Install core Shadcn/UI components via MCP tool or CLI

  - Use MCP: `mcp_shadcn_get_add_command_for_items()` or CLI: `npx shadcn@latest add`
  - Components: `button`, `card`, `table`, `badge`, `tooltip`, `popover`, `drawer`, `sheet`
  - Components: `select`, `input`, `tabs`, `separator`, `chart`
  - Verify: All components installed to `components/ui/`

- [x] **T012** [P] Create KPI card component in `components/dashboard/kpi-card.tsx`

  - Props: `title: string`, `value: string | number`, `subtitle?: string`, `trend?: { value: number, isPositive: boolean }`
  - Use: Shadcn Card component as base
  - Styling: Responsive, shows trend indicator with up/down arrow

- [x] **T013** [P] Create data table wrapper component in `components/dashboard/data-table.tsx`

  - Props: Generic type `<T>`, `columns: ColumnDef<T>[]`, `data: T[]`, `searchable?: boolean`, `exportable?: boolean`
  - Features: Built-in sort, filter, search (if searchable), CSV export button (if exportable)
  - Use: Shadcn Table component with Tanstack Table hooks

- [x] **T014** [P] Create chart wrapper component in `components/dashboard/chart-wrapper.tsx`

  - Props: `title: string`, `children: React.ReactNode`, `timeRangeOptions?: string[]`, `defaultTimeRange?: string`
  - Features: Time range selector tabs (7d, 30d, 90d), responsive container
  - Use: Shadcn Tabs + ChartContainer

- [x] **T015** [P] Create CSV export hook in `hooks/use-export-csv.ts`

  - Function: `exportToCSV(data: unknown[], filename: string): void`
  - Implementation: Client-side Blob API as per research.md
  - Returns: Hook with `exportToCSV` function

- [x] **T016** [P] Create glossary popover component in `components/dashboard/glossary-popover.tsx`

  - Props: `term: string`, `definition: string`, `trigger?: React.ReactNode`
  - Use: Shadcn Popover with info icon trigger
  - Styling: Max width 300px, accessible via keyboard

- [x] **T017** [P] Create alert banner component in `components/dashboard/alert-banner.tsx`

  - Props: `alert: Alert`, `onDismiss?: () => void`
  - Use: Shadcn Badge for severity, dismissible
  - Variants: info (blue), warning (yellow), error (red)

- [x] **T018** [P] Create responsive navigation component in `components/layouts/dashboard-nav.tsx`
  - Props: `items: NavItem[]`, `currentPath: string`
  - Features: Desktop sidebar (lg:+), mobile drawer (md:-), active state highlighting
  - Use: Shadcn Sheet for mobile drawer, sidebar for desktop
  - Reference: Shadcn dashboard-01 block for inspiration

---

## Phase 3.4: Treasury Dashboard

**Goal**: Implement all Treasury role pages (overview, leases, channels, nodes, billing)

- [x] **T019** Create Treasury layout with navigation in `app/(treasury)/treasury/layout.tsx`

  - Import: `DashboardNav` from `components/layouts/dashboard-nav.tsx`
  - Nav items: Overview, Leases, Channels, Nodes, Billing
  - Layout: Sidebar navigation (desktop), drawer navigation (mobile), main content area
  - Branding: "Treasury Dashboard" header with non-custodial badge

- [x] **T020** Create Treasury Overview page in `app/(treasury)/treasury/page.tsx`

  - KPI row: Deployed BTC, Gross APY, Net APY, Earned to Date, Active Leases, Utilization %, Node Uptime
  - Chart: Yield over time (stacked area: routing yield + lease yield) using ChartWrapper + Recharts
  - Table: Top Counterparties (lessee, inbound size, term, days left, effective cost ppm, status)
  - Data source: `MOCK_TREASURIES[0]`, `MOCK_LEASES`, yield data points

- [x] **T021** Create Treasury Leases page in `app/(treasury)/treasury/leases/page.tsx`

  - Table: id, counterparty, size (BTC), term (start–end), days left, fee model, status, actions (Renew, Increase, Export CSV)
  - Drawer: Lease detail showing invoices/settlements timeline (use Shadcn Drawer)
  - Data source: `MOCK_LEASES` filtered by `treasuryId`
  - Functionality: Open drawer on row click, CSV export button

- [x] **T022** Create Treasury Channels page in `app/(treasury)/treasury/channels/page.tsx`

  - Table: peer, capacity, local/remote balance, utilization %, base/ppm fees, HTLC success rate, uptime, actions (View, Close with confirmation)
  - Tooltip: Explain utilization calculation (via GlossaryPopover)
  - Data source: `MOCK_CHANNELS` filtered by `nodeId` belonging to treasury
  - Functionality: Confirmation dialog for channel close action

- [x] **T023** Create Treasury Nodes page in `app/(treasury)/treasury/nodes/page.tsx`

  - Cards: Node health cards (status pill, version, ping, last rebalance, fee policy snapshot, signer presence)
  - Alerts: Warning if version outdated
  - Data source: `MOCK_NODES` filtered by `treasuryId`
  - Layout: Grid of cards (responsive: 1 col mobile, 2 cols tablet, 3 cols desktop)

- [x] **T024** Create Treasury Billing page in `app/(treasury)/treasury/billing/page.tsx`

  - Section 1: Monthly statements table (period, lease fees, routing fees, gross total, Flowrate margin, net total, download CSV)
  - Section 2: Payout destinations (read-only display, Bitcoin addresses)
  - Data source: `MOCK_STATEMENTS` filtered by `treasuryId`
  - Functionality: CSV download for each statement

- [x] **T025** Create Treasury Alerts section (integrated into overview or separate component)
  - Alert types: Leases expiring ≤14 days, utilization < target, uptime drops, policy drift
  - Display: AlertBanner components at top of overview page
  - Data source: `MOCK_ALERTS` filtered by `userType === 'treasury'`

---

## Phase 3.5: Subscriber Dashboard

**Goal**: Implement all Subscriber role pages (overview, leases, integration, invoices, health)

- [x] **T026** Create Subscriber layout with navigation in `app/(subscriber)/subscriber/layout.tsx`

  - Import: `DashboardNav` from `components/layouts/dashboard-nav.tsx`
  - Nav items: Overview, Leases, Integration, Invoices, Health
  - Layout: Sidebar navigation (desktop), drawer navigation (mobile), main content area
  - Branding: "Liquidity Subscriber" header

- [x] **T027** Create Subscriber Overview page in `app/(subscriber)/subscriber/page.tsx`

  - KPI row: Inbound Leased (BTC), Expiring (≤14d), Effective Cost (ppm & fixed), Payment Success % (7D), Open Incidents
  - Chart: Delivered inbound vs usage over time + success rate line (using ChartWrapper + Recharts)
  - Alerts: Capacity under target, success% drop, nearing expiry (AlertBanner components)
  - Data source: `MOCK_SUBSCRIBERS[0]`, capacity data points, `MOCK_ALERTS`

- [x] **T028** Create Subscriber Leases page in `app/(subscriber)/subscriber/leases/page.tsx`

  - Table: id, pool/treasury, inbound size, start–end, days left, fee model, status, actions (Renew, Scale, Cancel at term)
  - Flow: "Request More Capacity" button opening dialog/drawer with form (size, term, price band selector → submit ticket)
  - Data source: `MOCK_LEASES` filtered by `subscriberId`
  - Functionality: One-click renewal CTA on expiring leases

- [x] **T029** Create Subscriber Integration page in `app/(subscriber)/subscriber/integration/page.tsx`

  - Section 1: API Keys table (label, key prefix, created, last used, permissions) + "Create Key" button (one-time display modal)
  - Section 2: Webhook endpoints (URL, events, active status, last triggered) + "Create Webhook" button with test capability
  - Section 3: IP Allowlist (CIDR list) + add/remove controls
  - Section 4: Sample webhook payloads (capacity-delivered, expiry-warning, incident) with copy button
  - Data source: `MOCK_API_KEYS`, `MOCK_WEBHOOKS` filtered by `subscriberId`

- [x] **T030** Create Subscriber Invoices page in `app/(subscriber)/subscriber/invoices/page.tsx`

  - Table: invoice id, period, amount, currency (BTC/USD), status (paid/unpaid/overdue), due date, PDF link
  - Functionality: Click PDF link to download/view invoice
  - Data source: `MOCK_INVOICES` filtered by `subscriberId`
  - Visual indicator: Overdue invoices highlighted in red

- [x] **T031** Create Subscriber Health page in `app/(subscriber)/subscriber/health/page.tsx`

  - Read-only metrics: Channel count, primary peers list, uptime summary, last policy update
  - Alerts: Capacity under target, success% drop (AlertBanner components)
  - Data source: `MOCK_SUBSCRIBERS[0]`, computed from `MOCK_CHANNELS`
  - Layout: Card-based display of metrics

- [x] **T032** Add Subscriber-specific alerts and CTAs
  - Overview: One-click renewal CTA on expiring capacity cards
  - Leases: "Renew Now" buttons on leases expiring ≤14 days
  - Ensure: Prominent placement, clear call-to-action styling

---

## Phase 3.6: Admin Dashboard

**Goal**: Implement all Admin role pages (command center, matchmaking, compliance, orchestration, finance, audit)

- [x] **T033** Create Admin layout with navigation in `app/(admin)/admin/layout.tsx`

  - Import: `DashboardNav` from `components/layouts/dashboard-nav.tsx`
  - Nav items: Command Center, Matchmaking, Compliance, Orchestration, Finance, Audit
  - Layout: Sidebar navigation (desktop), drawer navigation (mobile), main content area
  - Branding: "Flowrate Admin" header

- [x] **T034** Create Admin Command Center (Overview) page in `app/(admin)/admin/page.tsx`

  - KPI row: Total Supply (BTC), Total Active Leases, Avg Net APY to Treasuries, SLA Breaches (7D), Incidents Open
  - Queues: New subscriber requests, KYC pending, Expiring soon, Reconciliation diffs (4 separate card sections with counts)
  - Data source: Aggregate from `MOCK_TREASURIES`, `MOCK_LEASES`, `MOCK_DEMAND_TICKETS`, `MOCK_COMPLIANCE_RECORDS`
  - Functionality: Click queue card to navigate to relevant section

- [x] **T035** Create Admin Matchmaking page in `app/(admin)/admin/matchmaking/page.tsx`

  - Table 1: Demand tickets (size, term, price range, counterparty risk tier, status) from `MOCK_DEMAND_TICKETS`
  - Table 2: Suggested treasury pools (policy, available capacity, constraints) from `MOCK_TREASURY_POOLS`
  - Action: Select ticket + pool → open allocation modal (partial/full capacity, fee terms, issue contract)
  - Data source: `MOCK_DEMAND_TICKETS`, `MOCK_TREASURY_POOLS`

- [x] **T036** Create Admin Compliance page in `app/(admin)/admin/compliance/page.tsx`

  - Section 1: KYC/KYB status table (entity name, type, checklist status, documents received, risk score, sanctions check, last updated)
  - Section 2: Lease policy rules display (min term, max single-lessee exposure, jurisdiction constraints) - editable form
  - Data source: `MOCK_COMPLIANCE_RECORDS`
  - Note: No PII displayed, metadata only

- [x] **T037** Create Admin Orchestration page in `app/(admin)/admin/orchestration/page.tsx`

  - Section 1: Channel lifecycle table (channel id, state: Pending → Opening → Active → Closing/Splicing, logs, last updated)
  - Section 2: Node fleet status (node alias, version, uptime, signer quorum, backup status, warnings)
  - Data source: `MOCK_CHANNELS` (with lifecycle state), `MOCK_NODES`
  - Functionality: Expandable rows showing per-step logs

- [x] **T038** Create Admin Finance page in `app/(admin)/admin/finance/page.tsx`

  - Section 1: Fee accruals summary (total routing fees, total lease fees, Flowrate margin capture)
  - Section 2: Treasury payouts pending (treasury name, amount, status, scheduled date)
  - Section 3: Monthly statements tracker (count generated, total volume, avg APY)
  - Data source: Aggregate from `MOCK_STATEMENTS`, `MOCK_LEASES`

- [x] **T039** Create Admin Audit page in `app/(admin)/admin/audit/page.tsx`

  - Table: timestamp, actor (user/system), action, entity type, entity id, details (expandable), IP address
  - Filters: Date range, actor type, action type, entity type
  - Export: CSV export button for filtered results
  - Data source: `MOCK_AUDIT_LOGS`
  - Functionality: Advanced filtering, sortable columns

- [x] **T040** Create Admin User Management section (integrated into audit or separate page)
  - Table: user name, role (Treasury/Subscriber/Admin), last login, API key counts, status (active/inactive)
  - Actions: View user details (read-only for MVP)
  - Data source: Derived from `MOCK_TREASURIES` + `MOCK_SUBSCRIBERS` + admin users
  - Note: Basic display only, no actual user management functionality for MVP

---

## Phase 3.7: Polish & Optimization

**Goal**: Add animations, ensure responsive design, verify accessibility, optimize performance

- [x] **T041** Add Framer Motion animations throughout the application

  - Page transitions: Fade + slight vertical movement (initial: `{ opacity: 0, y: 20 }`, animate: `{ opacity: 1, y: 0 }`)
  - Card hover effects: Subtle scale (1.02x) using `whileHover`
  - Drawer/modal animations: Slide-in from side with backdrop fade
  - KPI card stagger: Children stagger on mount (0.1s delay between cards)
  - Files to update: All page components, Card components, Drawer components
  - Guidelines: Subtle (200-300ms), GPU-friendly (transform + opacity only), purposeful

- [x] **T042** Verify and enhance responsive layouts for mobile and tablet

  - Mobile (≤768px): Test all pages, ensure drawer nav works, KPIs stack vertically, tables scroll horizontally or use card view
  - Tablet (769-1023px): Test all pages, ensure 2-column grids work, sidebar collapses
  - Desktop (≥1024px): Verify optimal 3-4 column grids, full sidebar
  - Files to check: All layout.tsx files, all page.tsx files, dashboard-nav.tsx
  - Tools: Chrome DevTools device toolbar, test on actual devices if possible

- [x] **T043** Verify accessibility (WCAG 2.1 AA compliance)

  - Manual keyboard testing: Navigate all pages using Tab, Enter, Escape, Arrow keys
  - Screen reader testing: Test with VoiceOver (Mac) or NVDA (Windows) on critical flows
  - Focus indicators: Ensure all interactive elements have visible focus rings
  - Heading hierarchy: Verify proper h1 → h2 → h3 nesting on all pages
  - Alt text: Ensure all icons have aria-labels
  - Color contrast: Verify 4.5:1 for text, 3:1 for UI elements (use Chrome DevTools or WebAIM checker)
  - Lighthouse audit: Run accessibility audit, aim for 100 score

- [x] **T044** Performance optimization and final polish
  - Code splitting: Verify Next.js automatically splits code per route (check build output)
  - Lazy loading: Implement `dynamic()` imports for heavy components (charts, large tables)
  - Image optimization: Ensure any images use Next.js `<Image>` component
  - Bundle analysis: Run `npm run build && npx @next/bundle-analyzer` to check bundle sizes
  - Lighthouse audit: Run performance audit on all 3 dashboard routes, aim for 90+ scores
  - CSS optimization: Remove unused Tailwind classes (automatic with Tailwind JIT)
  - Final verification: Test all pages, all interactions, all data displays work correctly

---

## Dependencies

### Critical Path

1. **T001-T004** (Setup) must complete before any other work
2. **T005-T010** (Mock Data) must complete before T020-T044 (all dashboard pages need data)
3. **T011-T018** (Shared Components) must complete before T019-T040 (pages need components)
4. **T019** (Treasury Layout) must complete before T020-T025
5. **T026** (Subscriber Layout) must complete before T027-T032
6. **T033** (Admin Layout) must complete before T034-T040
7. **T041-T044** (Polish) require all pages complete

### Dependency Graph

```
Setup (T001-T004)
  ├─→ Mock Data [P] (T005-T010)
  └─→ Shared Components [P] (T011-T018)
        ├─→ Treasury (T019-T025)
        ├─→ Subscriber (T026-T032)
        └─→ Admin (T033-T040)
              └─→ Polish (T041-T044)
```

---

## Parallel Execution Examples

### Batch 1: Mock Data Layer (After T004)

All mock data files are independent - can run in parallel:

```
Task T005: Copy type contracts to types/ directory
Task T006: Implement generators.ts
Task T007: Create treasury.ts mock data
Task T008: Create subscriber.ts mock data
Task T009: Create admin.ts mock data
Task T010: Create shared.ts mock data
```

### Batch 2: Shared Components (After T011)

All custom components are separate files - can run in parallel:

```
Task T012: Create kpi-card.tsx
Task T013: Create data-table.tsx
Task T014: Create chart-wrapper.tsx
Task T015: Create use-export-csv.ts hook
Task T016: Create glossary-popover.tsx
Task T017: Create alert-banner.tsx
Task T018: Create dashboard-nav.tsx
```

### Batch 3: Dashboard Pages (After Layouts)

Pages within same role cannot be parallel (share layout), but across roles can be:

```
Treasury Batch:
  Task T020: Treasury overview
  Task T021: Treasury leases
  Task T022: Treasury channels
  Task T023: Treasury nodes
  Task T024: Treasury billing
  Task T025: Treasury alerts

Subscriber Batch (can run parallel to Treasury):
  Task T027: Subscriber overview
  Task T028: Subscriber leases
  Task T029: Subscriber integration
  Task T030: Subscriber invoices
  Task T031: Subscriber health
  Task T032: Subscriber CTAs

Admin Batch (can run parallel to Treasury/Subscriber):
  Task T034: Admin command center
  Task T035: Admin matchmaking
  Task T036: Admin compliance
  Task T037: Admin orchestration
  Task T038: Admin finance
  Task T039: Admin audit
  Task T040: Admin user management
```

---

## Execution Notes

### Task Granularity

- Each task is specific enough for an LLM to implement independently
- File paths are absolute to avoid ambiguity
- Data sources are explicitly specified for each page
- Component imports are documented

### Quality Standards

- **TypeScript**: Strict mode enabled, no `any` types except where necessary
- **Naming**: PascalCase for components, camelCase for functions/variables, kebab-case for files
- **Comments**: JSDoc for complex functions, inline comments for business logic
- **Formatting**: Prettier with default settings (runs on save)

### Verification After Each Task

1. TypeScript compiles without errors (`npm run type-check`)
2. ESLint passes without errors (`npm run lint`)
3. Application runs without console errors (`npm run dev`)
4. Visual verification: Navigate to affected routes and test functionality

### Rollback Strategy

- Commit after each completed task
- If a task fails, revert to previous commit and re-attempt
- If blocked on a dependency, mark task as blocked and move to parallel tasks

---

## Task Completion Checklist

### Setup Complete (T001-T004)

- [ ] Next.js project initialized and running on http://localhost:3000
- [ ] All dependencies installed (`node_modules/` exists, no install errors)
- [ ] Shadcn/UI configured (`components.json` exists, theme applied)
- [ ] Directory structure created (all route groups, component dirs, lib dirs exist)

### Mock Data Complete (T005-T010)

- [ ] All type files copied to `types/` directory
- [ ] Generators implemented with realistic values
- [ ] Treasury mock data (5 treasuries, 20 nodes, 50 leases, 100 channels)
- [ ] Subscriber mock data (10 subscribers, 20 keys, 15 webhooks, 30 invoices)
- [ ] Admin mock data (25 tickets, 5 pools, 15 compliance, 40 contracts, 100 logs)
- [ ] Shared mock data (30 alerts, statements)

### Shared Components Complete (T011-T018)

- [ ] 13+ Shadcn/UI components installed in `components/ui/`
- [ ] KPI card component displaying correctly
- [ ] Data table with sort/filter/export working
- [ ] Chart wrapper with time range selector working
- [ ] CSV export hook functional
- [ ] Glossary popover accessible
- [ ] Alert banner displaying properly
- [ ] Responsive navigation working (desktop sidebar + mobile drawer)

### Treasury Dashboard Complete (T019-T025)

- [ ] Treasury layout with navigation working
- [ ] Overview page: 7 KPIs + yield chart + top counterparties table
- [ ] Leases page: table + drawer detail view
- [ ] Channels page: table + tooltips + confirmation dialogs
- [ ] Nodes page: health cards grid
- [ ] Billing page: statements table + payout display
- [ ] Alerts integrated into overview

### Subscriber Dashboard Complete (T026-T032)

- [ ] Subscriber layout with navigation working
- [ ] Overview page: 5 KPIs + capacity chart + alerts
- [ ] Leases page: table + request capacity flow
- [ ] Integration page: API keys + webhooks + IP allowlist + sample payloads
- [ ] Invoices page: table with status indicators
- [ ] Health page: read-only metrics cards
- [ ] Renewal CTAs prominently displayed

### Admin Dashboard Complete (T033-T040)

- [ ] Admin layout with navigation working
- [ ] Command Center: 5 KPIs + 4 queue cards
- [ ] Matchmaking page: demand tickets + treasury pools + allocation modal
- [ ] Compliance page: KYC table + policy rules
- [ ] Orchestration page: channel lifecycle + node fleet status
- [ ] Finance page: accruals + payouts + statements tracker
- [ ] Audit page: log viewer with filters + CSV export
- [ ] User management display (basic)

### Polish Complete (T041-T044)

- [ ] Framer Motion animations added (page transitions, hover effects, drawers, stagger)
- [ ] Responsive layouts verified on mobile, tablet, desktop
- [ ] Accessibility verified: keyboard nav, screen reader, focus indicators, heading hierarchy, color contrast
- [ ] Performance optimized: code splitting, lazy loading, Lighthouse score 90+

---

## Success Criteria

**MVP Complete When**:

1. ✅ All 44 tasks checked off
2. ✅ Three separate dashboard routes accessible: `/treasury`, `/subscriber`, `/admin`
3. ✅ All 20 pages render with mocked data
4. ✅ All shared components functional
5. ✅ Responsive design works across devices
6. ✅ Accessibility verified (WCAG 2.1 AA)
7. ✅ Performance targets met (<200ms loads, <2s charts, 60fps animations)
8. ✅ No console errors or TypeScript errors
9. ✅ Visual polish matches "institutional-grade" standard

**Ready for Demo**:

- All KPIs display realistic mocked values
- All charts render with 7-day default data
- All tables sortable and exportable to CSV
- All navigation working (desktop sidebar + mobile drawer)
- All interactions smooth with subtle animations
- All tooltips and glossaries explaining Lightning Network terms

---

**Total Tasks**: 44  
**Estimated Time**: 30-40 hours (solo developer) or 15-20 hours (pair programming)  
**Parallel Opportunities**: 18 tasks marked [P] can run concurrently  
**Critical Path**: T001→T004→(T005-T010)→(T011-T018)→T019→(T020-T025)→T041-T044

**Next Step**: Begin with T001 (Initialize Next.js project)
