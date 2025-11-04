# Implementation Plan: Flowrate Dashboard

**Branch**: `001-flowrate-dashboard-spec` | **Date**: November 4, 2025 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/Users/orlando/Projects/lightning/specs/001-flowrate-dashboard-spec/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → ✅ Feature spec loaded successfully
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → ✅ Technical stack defined: Next.js, Tailwind CSS, Shadcn/UI
   → ⚠️  Some spec clarifications remain (acceptable for MVP with mocked data)
3. Fill the Constitution Check section
   → ✅ Assessed against FlowRate constitution
4. Evaluate Constitution Check section
   → ✅ All constitutional requirements aligned
   → ✅ Update Progress Tracking: Initial Constitution Check PASS
5. Execute Phase 0 → research.md
   → ✅ Completed
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, .cursorrules
   → ✅ Completed
7. Re-evaluate Constitution Check section
   → ✅ No new violations introduced
   → ✅ Update Progress Tracking: Post-Design Constitution Check PASS
8. Plan Phase 2 → Task generation approach documented
9. ✅ STOP - Ready for /tasks command
```

## Summary

The Flowrate Dashboard is a multi-role Lightning Network liquidity management platform serving three distinct users: **Treasuries** (Bitcoin capital deployers earning yields), **Liquidity Subscribers** (exchanges/wallets leasing inbound capacity), and **Admins** (Flowrate ops managing supply/demand matching).

**Technical Approach**: Next.js 14+ with App Router, TypeScript, Tailwind CSS, and Shadcn/UI component library. All data is mocked (no backend), with three separate route-based dashboards (`/treasury`, `/subscriber`, `/admin`). Responsive design supporting mobile, tablet, and desktop with institutional-grade polish, smooth Framer Motion animations, and data visualization via Recharts. Focus on clarity over Lightning Network jargon with contextual glossaries and 7-day default chart views.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 18+  
**Framework**: Next.js 14+ (App Router)  
**Primary Dependencies**:

- **UI**: Shadcn/UI (Radix UI primitives), Tailwind CSS 3.x, Framer Motion
- **Charts**: Recharts (included in Shadcn chart components)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Utils**: date-fns, clsx, tailwind-merge

**Storage**: None (mocked data via TypeScript modules in `/lib/mock-data/`)  
**Testing**: None (no tests required for MVP demo)  
**Target Platform**: Web browsers (modern Chrome, Firefox, Safari, Edge)  
**Project Type**: Web (frontend-only, Next.js single project)  
**Performance Goals**:

- Dashboard load: <200ms (critical KPIs)
- Table interactions: <200ms (filter/sort)
- Chart rendering: <2s (7-day default view)
- Smooth 60fps animations

**Constraints**:

- Desktop-first responsive (≥1024px optimal, ≤768px mobile, 769-1023px tablet)
- WCAG 2.1 AA accessibility compliance
- CSV-only export format
- No authentication (direct route access)
- 7-day default time range for all charts

**Scale/Scope**:

- 3 separate role-based dashboard routes
- ~20 unique page views across all roles
- ~15-20 reusable Shadcn/UI components
- ~10 custom composite components
- ~6 chart types (stacked area, line, bar)
- ~500 mocked data entities

**Theme**: Custom orange/dark brown palette defined in CSS variables (provided by user)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Code Quality Standards

- [x] **Clear naming conventions**: TypeScript with strict mode, PascalCase components, camelCase functions, kebab-case files
- [x] **Modular architecture**: Separation by role route (`/app/(treasury|subscriber|admin)`), shared components in `/components`, utilities in `/lib`
- [x] **Documentation strategy**: JSDoc for complex functions, README for setup, inline comments for business logic, Storybook candidate for component library
- [x] **Technical debt tracking**: GitHub issues with `tech-debt` label

### User Experience Consistency

- [x] **Design system**: Shadcn/UI with custom theme, consistent spacing/typography via Tailwind
- [x] **Accessibility**: WCAG 2.1 AA via Radix primitives, keyboard navigation, screen reader support
- [x] **User flow validation**: Manual verification of each role's primary scenarios
- [x] **Performance metrics**: Web Vitals monitoring (LCP, FID, CLS)

### Performance Requirements

- [x] **Response time SLAs**: <200ms KPI loads, <2s chart renders (measured via Navigation Timing API)
- [x] **Resource optimization**: Code splitting per route, lazy-load heavy components, optimized images
- [x] **Caching**: Static generation for layout shells, client-side caching for mock data
- [x] **Performance monitoring**: Manual Lighthouse audits during development

## Project Structure

### Documentation (this feature)

```
specs/001-flowrate-dashboard-spec/
├── spec.md              # Feature specification (input)
├── plan.md              # This file (implementation plan)
├── research.md          # Technology decisions & patterns
├── data-model.md        # Mock data entities & relationships
├── quickstart.md        # Local setup & dev workflow
└── contracts/           # TypeScript types for mock data contracts
    ├── treasury.types.ts
    ├── subscriber.types.ts
    └── admin.types.ts
```

### Source Code (Next.js App Router structure)

```
/Users/orlando/Projects/lightning/
├── app/
│   ├── (treasury)/          # Treasury dashboard route group
│   │   ├── treasury/
│   │   │   ├── page.tsx     # Overview (default)
│   │   │   ├── leases/
│   │   │   ├── channels/
│   │   │   ├── nodes/
│   │   │   ├── billing/
│   │   │   └── layout.tsx   # Treasury-specific nav
│   │   └── ...
│   ├── (subscriber)/        # Subscriber dashboard route group
│   │   ├── subscriber/
│   │   │   ├── page.tsx     # Overview
│   │   │   ├── leases/
│   │   │   ├── integration/
│   │   │   ├── invoices/
│   │   │   ├── health/
│   │   │   └── layout.tsx   # Subscriber-specific nav
│   │   └── ...
│   ├── (admin)/             # Admin dashboard route group
│   │   ├── admin/
│   │   │   ├── page.tsx     # Command Center
│   │   │   ├── matchmaking/
│   │   │   ├── compliance/
│   │   │   ├── orchestration/
│   │   │   ├── finance/
│   │   │   ├── audit/
│   │   │   └── layout.tsx   # Admin-specific nav
│   │   └── ...
│   ├── layout.tsx           # Root layout (theme provider)
│   └── globals.css          # Tailwind + custom theme CSS
│
├── components/
│   ├── ui/                  # Shadcn/UI base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── chart.tsx
│   │   ├── drawer.tsx
│   │   ├── badge.tsx
│   │   ├── tooltip.tsx
│   │   └── ... (15-20 Shadcn components)
│   ├── dashboard/           # Composite dashboard components
│   │   ├── kpi-card.tsx
│   │   ├── data-table.tsx
│   │   ├── chart-wrapper.tsx
│   │   ├── alert-banner.tsx
│   │   ├── export-button.tsx
│   │   └── glossary-popover.tsx
│   └── layouts/
│       ├── dashboard-nav.tsx
│       └── mobile-nav.tsx
│
├── lib/
│   ├── mock-data/
│   │   ├── treasury.ts      # Treasury mocked entities
│   │   ├── subscriber.ts    # Subscriber mocked entities
│   │   ├── admin.ts         # Admin mocked entities
│   │   └── generators.ts    # Data generation utilities
│   ├── utils.ts             # Utility functions (cn, formatters)
│   └── constants.ts         # Static config (chart defaults, etc.)
│
├── hooks/
│   ├── use-mobile.ts        # Responsive breakpoint hook
│   └── use-export-csv.ts    # CSV export logic
│
├── types/
│   ├── treasury.ts          # Treasury domain types
│   ├── subscriber.ts        # Subscriber domain types
│   └── admin.ts             # Admin domain types
│
├── public/
│   └── assets/              # Static assets (if needed)
│
├── components.json          # Shadcn/UI configuration
├── tailwind.config.ts       # Tailwind + custom theme
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies
└── .cursorrules             # Cursor IDE context (Phase 1 output)
```

**Structure Decision**: Single Next.js project (frontend-only) using App Router with route groups for role-based dashboards. Each role gets its own layout and nested routes. Shadcn/UI components installed via MCP tool, mocked data isolated in `/lib/mock-data/`, domain types ensure type safety across the application.

## Phase 0: Outline & Research

**Status**: ✅ Complete

### Research Topics

1. **Next.js 14 App Router best practices for multi-dashboard applications**

   - Decision: Use route groups `(treasury)`, `(subscriber)`, `(admin)` for separate layouts
   - Rationale: Allows isolated navigation per role without affecting URL structure
   - Alternatives: Middleware-based routing (rejected: no auth needed), separate Next.js apps (rejected: overkill)

2. **Shadcn/UI component selection via MCP tool**

   - Decision: Use MCP `mcp_shadcn_*` tools to search and view registry components/blocks
   - Rationale: Pre-built, accessible components with Radix UI primitives
   - Components needed: button, card, table, chart, drawer, badge, tooltip, select, input, tabs, popover, separator, sidebar
   - Blocks needed: dashboard layouts, sidebar navigation patterns. In the shadcn registry there's a pre built block called dashboard-01, that should be used as inspiration for for the dashboard layouts.

3. **Mocked data architecture for realistic demo**

   - Decision: TypeScript modules exporting arrays/objects with helper generators
   - Rationale: Type-safe, easy to extend, no build complexity
   - Pattern: `/lib/mock-data/[role].ts` with faker-like utilities for realistic values

4. **Responsive dashboard patterns**

   - Decision: Tailwind breakpoints (sm: 640, md: 768, lg: 1024, xl: 1280) + mobile drawer nav
   - Rationale: Standard Tailwind approach, collapsible sidebar on mobile
   - Pattern: Shadcn sidebar component with responsive variants

5. **Chart library within Shadcn ecosystem**

   - Decision: Recharts (bundled with Shadcn chart component)
   - Rationale: TypeScript support, composable, integrates with Shadcn theming
   - Chart types: Area (stacked), Line, Bar (for tables/summary)

6. **CSV export without backend**

   - Decision: Client-side generation via Blob API + download trigger
   - Rationale: Simple, fast, no server needed
   - Pattern: Custom hook `use-export-csv.ts` with table data transformer

7. **Animation strategy with Framer Motion**

   - Decision: Page transitions + card hover effects + drawer animations
   - Rationale: Smooth, professional feel without overwhelming users
   - Pattern: Wrap route changes, subtle scale/opacity on cards, drawer slide-in

8. **Accessibility implementation**
   - Decision: Radix primitives provide ARIA by default, supplement with focus management
   - Rationale: WCAG 2.1 AA baseline, keyboard nav tested
   - Pattern: Focus traps in drawers, roving tabindex in tables, screen reader labels

**Output**: See `/Users/orlando/Projects/lightning/specs/001-flowrate-dashboard-spec/research.md` (created next)

## Phase 1: Design & Contracts

**Status**: ✅ Complete

### Deliverables

1. **data-model.md**: Defines 16 entities (Treasury, Node, Lease, Channel, Subscriber, etc.) with TypeScript interfaces
2. **contracts/\*.types.ts**: Type definitions for each role's data contracts
3. **quickstart.md**: Setup instructions, dev server, mock data inspection
4. **.cursorrules**: Cursor IDE context with tech stack and recent changes

**Entity Extraction** (from spec → data-model.md):

- Treasury, Node, Lease, Channel (Treasury role)
- Subscriber, Demand Ticket, API Key, Webhook, Invoice (Subscriber role)
- Admin, Compliance Record, Audit Log, Contract (Admin role)
- Shared: Alert, Statement

**Mock Data Strategy**:

- Each role gets dedicated mock file with 10-50 sample entities
- Generators create realistic Bitcoin addresses, timestamps, APY values
- Relationships maintained via IDs (e.g., Lease references Treasury & Subscriber)

**Test Scenarios** (from user stories → quickstart.md):

- Treasury: View overview KPIs, drill into lease details, export CSV
- Subscriber: Monitor capacity, request scale-up, configure API keys
- Admin: Review queues, allocate capacity, audit logs

**No REST API contracts**: This is a frontend-only app with mocked data, so traditional API contracts are replaced with TypeScript type contracts ensuring data shape consistency.

**Output**:

- `/Users/orlando/Projects/lightning/specs/001-flowrate-dashboard-spec/data-model.md`
- `/Users/orlando/Projects/lightning/specs/001-flowrate-dashboard-spec/contracts/*.types.ts`
- `/Users/orlando/Projects/lightning/specs/001-flowrate-dashboard-spec/quickstart.md`
- `/Users/orlando/Projects/lightning/.cursorrules` (updated via script in next step)

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

The `/tasks` command will load `.specify/templates/tasks-template.md` and generate ~35-40 tasks organized by:

1. **Foundation** (4-6 tasks):

   - Initialize Next.js project with TypeScript
   - Configure Tailwind CSS with custom theme
   - Install Shadcn/UI and core components via MCP tool
   - Set up project structure (folders, aliases)

2. **Mock Data Layer** (6-8 tasks) [P]:

   - Create TypeScript types for each role
   - Implement mock data generators
   - Create Treasury mock data
   - Create Subscriber mock data
   - Create Admin mock data
   - Verify data integrity

3. **Shared UI Components** (8-10 tasks) [P]:

   - Install Shadcn components via MCP (button, card, table, etc.)
   - Create KPI card component
   - Create data table wrapper with sort/filter
   - Create chart wrapper with time range selector
   - Create CSV export button + hook
   - Create glossary popover
   - Create alert banner
   - Verify component integration

4. **Treasury Dashboard** (6-7 tasks):

   - Treasury layout + navigation
   - Overview page (KPIs + chart + top counterparties)
   - Leases page (table + drawer detail)
   - Channels page (table + tooltips)
   - Nodes page (health cards)
   - Billing page (statements + export)

5. **Subscriber Dashboard** (6-7 tasks):

   - Subscriber layout + navigation
   - Overview page (KPIs + chart + alerts)
   - Leases page (table + request flow)
   - Integration page (API keys + webhooks)
   - Invoices page (table + PDF links)
   - Health page (read-only metrics)

6. **Admin Dashboard** (7-8 tasks):

   - Admin layout + navigation
   - Command Center (KPIs + queues)
   - Matchmaking page (tickets + allocation)
   - Compliance page (KYC status + policies)
   - Orchestration page (channel lifecycle + fleet)
   - Finance page (accruals + statements tracker)
   - Audit page (log viewer + export)

7. **Polish & Optimization** (3-4 tasks):
   - Add Framer Motion animations
   - Responsive mobile layouts
   - Accessibility verification
   - Performance optimization (code splitting, lazy load)

**Ordering Strategy**:

- Foundation → Mock Data → Shared Components → Role Dashboards → Polish
- Tasks marked [P] can be executed in parallel (independent files)
- Each role's pages depend on shared components

**Estimated Output**: 35-40 numbered, sequentially ordered tasks in `tasks.md`

**Dependencies**:

- Tasks 1-4 (foundation) must complete before any other work
- Tasks 5-10 (mock data) must complete before dashboard pages
- Tasks 11-18 (shared components) must complete before dashboard pages
- Tasks 19-36 (dashboards) can be partially parallelized per role
- Tasks 37-40 (polish) require all pages complete

**IMPORTANT**: This phase is executed by the `/tasks` command, NOT by `/plan`

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (manual or via `/tasks` command)  
**Phase 4**: Implementation following TypeScript best practices  
**Phase 5**: Manual validation via quickstart.md, browser testing, accessibility verification

## Complexity Tracking

_No constitutional violations - all checks passed._

This implementation follows FlowRate's constitution principles:

- **Custody Sovereignty**: No backend, no user data, purely informational demo
- **Infrastructure Excellence**: Enterprise-grade UI patterns, accessibility, performance
- **Transparent Operations**: Mocked data clearly labeled, margin calculations visible
- **Professional Operations**: Institutional polish via Shadcn/UI and smooth animations

## Progress Tracking

**Phase Status**:

- [x] Phase 0: Research complete (/plan command) ✅
- [x] Phase 1: Design complete (/plan command) ✅
- [x] Phase 2: Task planning complete (/plan command - approach documented) ✅
- [x] Phase 3: Tasks generated (/tasks command) ✅
- [ ] Phase 4: Implementation (execute tasks.md)
- [ ] Phase 5: Manual validation

**Gate Status**:

- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved (MVP scope) ✅
- [x] Complexity deviations documented (N/A - no violations) ✅

**Artifacts Generated**:

- [x] `/specs/001-flowrate-dashboard-spec/research.md` (9 technology decisions documented)
- [x] `/specs/001-flowrate-dashboard-spec/data-model.md` (16 entities defined)
- [x] `/specs/001-flowrate-dashboard-spec/contracts/*.types.ts` (4 type contract files)
- [x] `/specs/001-flowrate-dashboard-spec/quickstart.md` (5-minute setup guide)
- [x] `/specs/001-flowrate-dashboard-spec/tasks.md` (44 executable tasks)
- [x] `/.cursor/rules/specify-rules.mdc` (Cursor IDE context updated)

---

_Based on Constitution v1.1.0 - See `.specify/memory/constitution.md`_
