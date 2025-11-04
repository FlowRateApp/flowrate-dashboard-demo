# Research: Flowrate Dashboard Technology Decisions

**Date**: November 4, 2025  
**Feature**: Flowrate Dashboard Multi-Role Platform  
**Phase**: Phase 0 - Technology Selection & Patterns

## Overview

This document captures all technology decisions, architectural patterns, and implementation strategies for the Flowrate Dashboard. Each decision includes rationale, alternatives considered, and references to best practices.

---

## 1. Next.js 14 App Router for Multi-Dashboard Architecture

### Decision

Use **Next.js 14+ with App Router** and **route groups** to implement three separate role-based dashboards.

### Rationale

- **Route Groups**: `(treasury)`, `(subscriber)`, `(admin)` enable different layouts per role without URL nesting
- **File-based routing**: Clear separation of concerns, co-located components
- **Server Components**: Default for better performance (though we're using mostly client components)
- **Built-in optimizations**: Automatic code splitting, image optimization, font optimization

### Implementation Pattern

```typescript
app/
├── (treasury)/
│   └── treasury/
│       ├── layout.tsx        // Treasury-specific navigation
│       ├── page.tsx           // /treasury (overview)
│       ├── leases/page.tsx    // /treasury/leases
│       └── ...
├── (subscriber)/              // Similar structure
├── (admin)/                   // Similar structure
└── layout.tsx                 // Root layout (providers, theme)
```

### Alternatives Considered

- **Single layout with conditional rendering**: Rejected - harder to maintain, all code bundles together
- **Separate Next.js apps**: Rejected - overkill, no shared components, complex deployment
- **Pages Router**: Rejected - older paradigm, less ergonomic for this use case

### References

- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

---

## 2. Shadcn/UI Component Library via MCP Tool

### Decision

Use **Shadcn/UI** components installed via the **MCP Shadcn tool** for all UI primitives.

### Rationale

- **Radix UI primitives**: Accessibility (WCAG 2.1 AA) built-in, keyboard navigation, screen reader support
- **Customizable**: Copy-paste components into project, full control over implementation
- **TypeScript-first**: Strong typing, IntelliSense support
- **Tailwind CSS integration**: Seamless styling with utility classes
- **MCP tool**: Programmatic search, view, and installation of components and pre-built blocks

### Components Needed

**Core UI** (via `mcp_shadcn_view_items_in_registries`):

- `@shadcn/button`, `@shadcn/card`, `@shadcn/table`, `@shadcn/badge`
- `@shadcn/tooltip`, `@shadcn/popover`, `@shadcn/drawer`, `@shadcn/sheet`
- `@shadcn/select`, `@shadcn/input`, `@shadcn/tabs`, `@shadcn/separator`
- `@shadcn/chart` (includes Recharts integration)

**Layout Blocks** (via `mcp_shadcn_search_items_in_registries` with "dashboard"):

- Dashboard sidebar patterns
- Navigation components
- Card layouts

### Implementation Pattern

```bash
# Search for dashboard blocks
MCP: mcp_shadcn_search_items_in_registries(["@shadcn"], "dashboard sidebar")

# View specific component
MCP: mcp_shadcn_view_items_in_registries(["@shadcn/button", "@shadcn/card"])

# Get add command
MCP: mcp_shadcn_get_add_command_for_items(["@shadcn/button", "@shadcn/card"])
```

### Alternatives Considered

- **Material UI**: Rejected - heavier, opinionated styling, harder to customize
- **Chakra UI**: Rejected - different design philosophy, CSS-in-JS adds complexity
- **Headless UI**: Considered - similar to Radix but less ecosystem support
- **Custom components**: Rejected - reinventing accessibility, slow development

### References

- [Shadcn/UI Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- MCP Shadcn tool documentation (in cursor)

---

## 3. Mocked Data Architecture

### Decision

**TypeScript modules** in `/lib/mock-data/` exporting static arrays/objects with generator utilities for realistic values.

### Rationale

- **Type-safe**: Full TypeScript support, compile-time checks
- **Simple**: No build step, no database, no API layer
- **Realistic**: Generators create varied, believable data
- **Maintainable**: Easy to extend, clear data ownership per role

### Implementation Pattern

```typescript
// lib/mock-data/treasury.ts
import { Treasury, Node, Lease } from "@/types/treasury";

export const MOCK_TREASURIES: Treasury[] = [
  {
    id: "trs_001",
    name: "Acme Treasury",
    deployedBTC: 12.5,
    grossAPY: 8.2,
    netAPY: 7.5,
    // ...
  },
  // ... more entries
];

// Generator utilities
export function generateMockLeases(count: number): Lease[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `lease_${String(i).padStart(3, "0")}`,
    treasuryId: randomItem(MOCK_TREASURIES).id,
    size: randomBTC(0.5, 5),
    // ...
  }));
}
```

### Data Volume Targets

- **Treasury**: 5 treasuries, 20 nodes, 50 leases, 100 channels
- **Subscriber**: 10 subscribers, 30 leases, 15 invoices, 20 API keys
- **Admin**: 25 demand tickets, 30 compliance records, 100 audit logs

### Alternatives Considered

- **JSON files**: Rejected - no type safety, harder to generate realistic data
- **Faker.js**: Considered - adds dependency, we only need simple generators
- **MSW (Mock Service Worker)**: Rejected - overkill for static data, no API needed
- **Real backend**: Out of scope for MVP

### References

- [TypeScript Handbook - Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
- Project: Vercel dashboard examples

---

## 4. Responsive Dashboard Patterns

### Decision

**Tailwind breakpoints** with **Shadcn sidebar component** for responsive navigation. Desktop-first approach with mobile drawer.

### Rationale

- **Standard breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Desktop optimal**: Most users on desktop (treasury/admin work)
- **Mobile support**: Drawer navigation, stacked KPIs, horizontal scroll tables
- **Tablet experience**: Sidebar collapses, cards reflow to 2-column

### Implementation Pattern

```typescript
// Responsive layout
<div className="flex h-screen">
  {/* Desktop sidebar */}
  <aside className="hidden lg:flex w-64 border-r">
    <SidebarNav items={navItems} />
  </aside>

  {/* Mobile drawer */}
  <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
    <SheetContent side="left" className="lg:hidden">
      <SidebarNav items={navItems} />
    </SheetContent>
  </Sheet>

  {/* Main content */}
  <main className="flex-1 overflow-auto">
    {children}
  </main>
</div>

// Responsive KPI cards
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {kpis.map(kpi => <KPICard key={kpi.id} {...kpi} />)}
</div>
```

### Breakpoint Strategy

- **Mobile (≤768px)**: Single column, drawer nav, stacked KPIs
- **Tablet (769-1023px)**: 2-column grids, collapsed sidebar
- **Desktop (≥1024px)**: Full sidebar, 3-4 column grids, optimal experience

### Alternatives Considered

- **Mobile-first**: Rejected - dashboards are desktop-heavy, desktop is priority
- **Fixed desktop-only**: Rejected - misses mobile viewers, bad UX
- **Responsive tables only**: Rejected - entire layout needs responsiveness

### References

- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Shadcn Sidebar Component](https://ui.shadcn.com/docs/components/sidebar)

---

## 5. Chart Library: Recharts via Shadcn

### Decision

Use **Recharts** through **Shadcn chart component** for all data visualizations.

### Rationale

- **Shadcn integration**: Pre-configured chart component with theme support
- **TypeScript support**: Full type definitions
- **Composable**: Build custom charts from primitives (Line, Area, Bar, Tooltip)
- **Responsive**: Automatic resizing, works with Tailwind
- **Lightweight**: No heavy dependencies

### Chart Types Needed

1. **Stacked Area**: Treasury yield over time (routing vs lease)
2. **Line Chart**: Subscriber capacity vs usage with success rate
3. **Bar Chart**: Optional for comparisons

### Implementation Pattern

```typescript
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

<ChartContainer config={chartConfig} className="h-[300px]">
  <AreaChart data={yieldData}>
    <XAxis dataKey="date" />
    <YAxis />
    <ChartTooltip />
    <Area dataKey="routingYield" stackId="1" fill="hsl(var(--chart-1))" />
    <Area dataKey="leaseYield" stackId="1" fill="hsl(var(--chart-2))" />
  </AreaChart>
</ChartContainer>;
```

### Time Range Selector

- Default: 7 days
- Options: 7d, 30d, 90d
- Implemented as tabs above chart

### Alternatives Considered

- **Chart.js**: Rejected - less TypeScript-friendly, imperative API
- **D3.js**: Rejected - too low-level, steep learning curve, overkill
- **Victory**: Rejected - less popular, smaller ecosystem
- **Plotly**: Rejected - heavier bundle size

### References

- [Shadcn Chart Component](https://ui.shadcn.com/docs/components/chart)
- [Recharts Documentation](https://recharts.org/)

---

## 6. CSV Export without Backend

### Decision

**Client-side CSV generation** using Blob API and programmatic download trigger.

### Rationale

- **No server needed**: Pure frontend implementation
- **Fast**: Instant generation, no network delay
- **Simple**: ~50 lines of code
- **Standard format**: RFC 4180 compliant CSV

### Implementation Pattern

```typescript
// hooks/use-export-csv.ts
export function useExportCSV() {
  const exportToCSV = (data: unknown[], filename: string) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString()}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return { exportToCSV };
}

function convertToCSV(data: unknown[]): string {
  if (!data.length) return "";

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => JSON.stringify(row[header])).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}
```

### Usage

```typescript
// In component
const { exportToCSV } = useExportCSV();

<Button onClick={() => exportToCSV(leases, "treasury-leases")}>
  Export CSV
</Button>;
```

### Alternatives Considered

- **Papa Parse**: Rejected - adds dependency for simple use case
- **Server-side generation**: Rejected - no backend, unnecessary complexity
- **Excel format (.xlsx)**: Out of scope - requires library, CSV is universal

### References

- [MDN Blob API](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [RFC 4180 CSV Standard](https://tools.ietf.org/html/rfc4180)

---

## 7. Animation Strategy with Framer Motion

### Decision

**Framer Motion** for subtle, professional animations: page transitions, card interactions, drawer slides.

### Rationale

- **React integration**: Component-based, declarative API
- **Performance**: GPU-accelerated, optimized for 60fps
- **TypeScript support**: Full type definitions
- **Production-ready**: Used by major companies (Stripe, Vercel)

### Animation Targets

1. **Page transitions**: Fade + slight vertical movement
2. **Card hover**: Subtle scale (1.02x) + shadow increase
3. **Drawer**: Slide from right with backdrop fade
4. **KPI cards**: Stagger animation on mount
5. **Alert banners**: Slide down from top

### Implementation Pattern

```typescript
import { motion } from 'framer-motion';

// Page transition
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>

// Card hover
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  <Card>...</Card>
</motion.div>

// Stagger children
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="show"
>
  {kpis.map(kpi => (
    <motion.div key={kpi.id} variants={itemVariants}>
      <KPICard {...kpi} />
    </motion.div>
  ))}
</motion.div>
```

### Animation Guidelines

- **Subtle**: Avoid overwhelming users, institutional polish not flashy
- **Fast**: 200-300ms durations, snappy feel
- **Purposeful**: Every animation communicates state change
- **Performant**: Use `transform` and `opacity` only (GPU-friendly)

### Alternatives Considered

- **React Spring**: Rejected - more complex API, overkill for needs
- **CSS animations**: Considered - less powerful for complex sequences
- **GSAP**: Rejected - larger bundle, imperative API
- **No animations**: Rejected - feels static, not modern

### References

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Animation Best Practices](https://web.dev/animations/)

---

## 8. Accessibility Implementation

### Decision

**Radix UI primitives** (via Shadcn) provide WCAG 2.1 AA baseline, supplemented with custom focus management and screen reader labels.

### Rationale

- **Built-in ARIA**: Radix components include proper roles, states, properties
- **Keyboard navigation**: Tab, arrow keys, Enter, Escape all work out-of-box
- **Focus management**: Focus traps in modals, focus restoration
- **Screen reader tested**: Components tested with NVDA, VoiceOver, JAWS

### Accessibility Checklist

- [x] All interactive elements keyboard accessible
- [x] Focus indicators visible (Tailwind ring utilities)
- [x] Proper heading hierarchy (h1 → h2 → h3)
- [x] Alt text for any images/icons
- [x] Color contrast ≥4.5:1 (text), ≥3:1 (UI elements)
- [x] Form labels and error messages
- [x] Screen reader announcements for dynamic content
- [x] Skip links for main content
- [x] No keyboard traps

### Implementation Pattern

```typescript
// Proper heading hierarchy
<div>
  <h1>Treasury Dashboard</h1>
  <section>
    <h2>Overview</h2>
    {/* KPIs */}
  </section>
  <section>
    <h2>Top Counterparties</h2>
    {/* Table */}
  </section>
</div>

// Screen reader label for icon-only button
<Button aria-label="Export leases to CSV">
  <DownloadIcon />
</Button>

// Tooltip for context
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <span tabIndex={0}>Utilization %</span>
    </TooltipTrigger>
    <TooltipContent>
      Calculated as routed volume divided by channel capacity over 7 days
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

// Table with proper headers
<table>
  <thead>
    <tr>
      <th scope="col">Lease ID</th>
      <th scope="col">Counterparty</th>
      {/* ... */}
    </tr>
  </thead>
  <tbody>
    {/* ... */}
  </tbody>
</table>
```

### Testing Strategy

- **Automated**: axe DevTools, Lighthouse accessibility audit
- **Manual**: Keyboard-only navigation, screen reader testing
- **CI/CD**: Pa11y or similar in GitHub Actions

### Alternatives Considered

- **Custom accessibility**: Rejected - error-prone, time-consuming
- **Minimal compliance**: Rejected - violates constitution, poor UX
- **ARIA-only approach**: Rejected - semantic HTML is foundation

### References

- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 9. TypeScript Configuration

### Decision

**Strict mode TypeScript** with path aliases and additional strictness flags.

### Rationale

- **Type safety**: Catch errors at compile-time
- **Better DX**: IntelliSense, refactoring support
- **Maintainability**: Self-documenting code, easier onboarding
- **Next.js default**: Framework expects TypeScript

### Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"],
      "@/hooks/*": ["./hooks/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Alternatives Considered

- **JavaScript**: Rejected - loses type safety, harder to maintain
- **Loose TypeScript**: Rejected - defeats purpose, allows bugs

---

## Summary

All technology decisions documented and justified. Key choices:

- **Next.js 14 App Router** with route groups for multi-dashboard architecture
- **Shadcn/UI** via MCP tool for accessible, customizable components
- **TypeScript modules** for mocked data with generators
- **Tailwind + responsive patterns** for mobile/tablet/desktop
- **Recharts** for charts, **Framer Motion** for animations
- **Client-side CSV export**, **strict TypeScript** for type safety

All decisions align with FlowRate constitution: professional UX, accessibility, performance, maintainability.

---

**Next Steps**: Proceed to Phase 1 (data-model.md, contracts, quickstart.md)
