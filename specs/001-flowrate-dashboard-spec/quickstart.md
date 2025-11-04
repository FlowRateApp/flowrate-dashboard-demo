# Quickstart: Flowrate Dashboard

**Last Updated**: November 4, 2025  
**Project**: Flowrate Dashboard Multi-Role Platform  
**Time to First Screen**: ~5 minutes

## Prerequisites

- **Node.js**: 18.17.0 or higher ([download](https://nodejs.org/))
- **Package Manager**: npm, yarn, or pnpm (npm comes with Node.js)
- **Code Editor**: VS Code recommended with extensions:
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
  - [TypeScript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)
  - [Cursor](https://cursor.sh/) (if using Cursor IDE)

## Initial Setup

### 1. Clone Repository (if not already cloned)

```bash
# Navigate to project directory
cd /Users/orlando/Projects/lightning
```

### 2. Initialize Next.js Project

```bash
# Create Next.js app with TypeScript, Tailwind, App Router
npx create-next-app@latest . --typescript --tailwind --app --use-npm

# Answer prompts:
# ✔ Would you like to use TypeScript? Yes
# ✔ Would you like to use ESLint? Yes
# ✔ Would you like to use Tailwind CSS? Yes
# ✔ Would you like to use `src/` directory? No
# ✔ Would you like to use App Router? Yes
# ✔ Would you like to customize the default import alias? Yes (@/*)
```

### 3. Install Dependencies

```bash
# Install Shadcn/UI dependencies
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge

# Install chart library
npm install recharts

# Install animation library
npm install framer-motion

# Install form handling
npm install react-hook-form zod @hookform/resolvers

# Install date utilities
npm install date-fns

# Install icons
npm install lucide-react
```

### 4. Configure Shadcn/UI

```bash
# Initialize Shadcn/UI
npx shadcn@latest init

# Answer prompts:
# ✔ Which style would you like to use? › Default
# ✔ Which color would you like to use as base color? › Slate
# ✔ Would you like to use CSS variables for colors? › yes
```

This creates `components.json` for component configuration.

### 5. Apply Custom Theme

Replace the contents of `app/globals.css` with the custom theme:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 20 14.3% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 20 14.3% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 20 14.3% 4.1%;
    --primary: 24.6 95% 53.1%;
    --primary-foreground: 60 9.1% 97.8%;
    --secondary: 60 4.8% 95.9%;
    --secondary-foreground: 24 9.8% 10%;
    --muted: 60 4.8% 95.9%;
    --muted-foreground: 25 5.3% 44.7%;
    --accent: 60 4.8% 95.9%;
    --accent-foreground: 24 9.8% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 60 9.1% 97.8%;
    --border: 20 5.9% 90%;
    --input: 20 5.9% 90%;
    --ring: 24.6 95% 53.1%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 20 14.3% 4.1%;
    --foreground: 60 9.1% 97.8%;
    --card: 20 14.3% 4.1%;
    --card-foreground: 60 9.1% 97.8%;
    --popover: 20 14.3% 4.1%;
    --popover-foreground: 60 9.1% 97.8%;
    --primary: 20.5 90.2% 48.2%;
    --primary-foreground: 60 9.1% 97.8%;
    --secondary: 12 6.5% 15.1%;
    --secondary-foreground: 60 9.1% 97.8%;
    --muted: 12 6.5% 15.1%;
    --muted-foreground: 24 5.4% 63.9%;
    --accent: 12 6.5% 15.1%;
    --accent-foreground: 60 9.1% 97.8%;
    --destructive: 0 72.2% 50.6%;
    --destructive-foreground: 60 9.1% 97.8%;
    --border: 12 6.5% 15.1%;
    --input: 12 6.5% 15.1%;
    --ring: 20.5 90.2% 48.2%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 6. Install Initial Shadcn Components

Use Cursor's MCP tool or CLI to add base components:

```bash
# Core components needed for MVP
npx shadcn@latest add button card table badge tooltip popover drawer sheet select input tabs separator

# Chart component (includes Recharts)
npx shadcn@latest add chart
```

Or via MCP tool in Cursor:

- Search for components: `mcp_shadcn_search_items_in_registries(["@shadcn"], "button")`
- View components: `mcp_shadcn_view_items_in_registries(["@shadcn/button"])`
- Get add command: `mcp_shadcn_get_add_command_for_items(["@shadcn/button"])`

## Project Structure Setup

Create the directory structure:

```bash
# Create directories
mkdir -p app/\(treasury\)/treasury/{leases,channels,nodes,billing}
mkdir -p app/\(subscriber\)/subscriber/{leases,integration,invoices,health}
mkdir -p app/\(admin\)/admin/{matchmaking,compliance,orchestration,finance,audit}
mkdir -p components/{ui,dashboard,layouts}
mkdir -p lib/mock-data
mkdir -p types
mkdir -p hooks
mkdir -p public/assets
```

## Create Mock Data

### 1. Copy Type Definitions

Copy the contract types from `specs/001-flowrate-dashboard-spec/contracts/` to `types/`:

```bash
cp specs/001-flowrate-dashboard-spec/contracts/*.types.ts types/
```

### 2. Create Generator Utilities

Create `lib/mock-data/generators.ts`:

```typescript
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
  return Array.from({ length: 66 }, () => randomInt(0, 15).toString(16)).join(
    ""
  );
}

export function generateId(prefix: string, index: number): string {
  return `${prefix}_${String(index).padStart(3, "0")}`;
}

export function dateNDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}
```

### 3. Create Sample Mock Data

Create `lib/mock-data/treasury.ts`:

```typescript
import { Treasury } from "@/types/treasury.types";
import { generateId, randomBTC, randomInt } from "./generators";

export const MOCK_TREASURIES: Treasury[] = [
  {
    id: generateId("trs", 1),
    name: "Acme Treasury",
    deployedBTC: 12.5,
    grossAPY: 8.2,
    netAPY: 7.5,
    earnedToDate: 0.45,
    activeLeases: 8,
    utilization: 78.3,
    averageUptime: 99.8,
    flowrateMargin: 0.7,
    createdAt: new Date("2024-01-15").toISOString(),
    payoutAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  },
  // Add 4 more...
];
```

## Run Development Server

```bash
# Start dev server
npm run dev

# Open browser
open http://localhost:3000
```

You should see the Next.js default landing page.

## Create First Dashboard Route

### 1. Treasury Overview Page

Create `app/(treasury)/treasury/page.tsx`:

```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MOCK_TREASURIES } from "@/lib/mock-data/treasury";

export default function TreasuryOverview() {
  const treasury = MOCK_TREASURIES[0];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Treasury Dashboard</h1>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Deployed BTC</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{treasury.deployedBTC}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net APY</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{treasury.netAPY}%</p>
          </CardContent>
        </Card>

        {/* Add more KPI cards */}
      </div>
    </div>
  );
}
```

### 2. Create Treasury Layout with Navigation

Create `app/(treasury)/treasury/layout.tsx`:

```typescript
import Link from "next/link";

export default function TreasuryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Treasury</h2>
        <nav className="space-y-2">
          <Link href="/treasury" className="block p-2 hover:bg-accent rounded">
            Overview
          </Link>
          <Link
            href="/treasury/leases"
            className="block p-2 hover:bg-accent rounded"
          >
            Leases
          </Link>
          <Link
            href="/treasury/channels"
            className="block p-2 hover:bg-accent rounded"
          >
            Channels
          </Link>
          <Link
            href="/treasury/nodes"
            className="block p-2 hover:bg-accent rounded"
          >
            Nodes
          </Link>
          <Link
            href="/treasury/billing"
            className="block p-2 hover:bg-accent rounded"
          >
            Billing
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
```

### 3. Test Treasury Dashboard

Navigate to `http://localhost:3000/treasury` - you should see the treasury overview with KPI cards.

## Common Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler check

# Shadcn
npx shadcn@latest add [component-name]  # Add component
npx shadcn@latest diff   # Check for component updates
```

## Development Workflow

### 1. Check Mocked Data

Inspect mock data in `lib/mock-data/*.ts` to understand available entities and their relationships.

### 2. Add Shadcn Components

Use MCP tool in Cursor or CLI to search and add components:

```bash
# Search for dashboard-related blocks
mcp_shadcn_search_items_in_registries(["@shadcn"], "dashboard")

# View specific component
mcp_shadcn_view_items_in_registries(["@shadcn/table"])

# Add component
npx shadcn@latest add table
```

### 3. Create Pages

Follow the pattern:

1. Create page in appropriate route group (`(treasury)`, `(subscriber)`, `(admin)`)
2. Import mock data from `lib/mock-data/`
3. Use Shadcn components for UI
4. Add Framer Motion for animations

### 4. Verify Your Changes

- **Manual testing**: Navigate to route in browser, test interactions
- **Browser DevTools**: Check console for errors, inspect elements
- **Responsive design**: Test on different screen sizes

### 5. Check Accessibility

Run Lighthouse audit:

```bash
npm run build
npm run start
# Open Chrome DevTools → Lighthouse → Run Accessibility Audit
```

## Troubleshooting

### Issue: "Module not found" errors

**Solution**: Ensure path aliases are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: Tailwind styles not applying

**Solution**: Check `tailwind.config.ts` includes all content paths:

```typescript
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  // ...
};
```

### Issue: Shadcn components look unstyled

**Solution**: Ensure `globals.css` is imported in root layout:

```typescript
// app/layout.tsx
import "./globals.css";
```

### Issue: Mock data not updating

**Solution**: Restart dev server (hot reload doesn't always catch mock data changes):

```bash
# Stop server (Ctrl+C)
npm run dev
```

## Next Steps

1. **Complete Treasury Dashboard**: Implement all pages (leases, channels, nodes, billing)
2. **Build Subscriber Dashboard**: Replicate pattern for subscriber routes
3. **Build Admin Dashboard**: Create admin routes with matchmaking, compliance, etc.
4. **Add Charts**: Use Recharts with Shadcn chart component for visualizations
5. **Implement CSV Export**: Create `use-export-csv.ts` hook
6. **Add Animations**: Wrap components with Framer Motion
7. **Responsive Design**: Test on mobile, tablet, desktop breakpoints
8. **Accessibility Verification**: Manual testing with keyboard and screen reader

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Shadcn/UI**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com
- **Recharts**: https://recharts.org
- **Framer Motion**: https://www.framer.com/motion
- **TypeScript**: https://www.typescriptlang.org/docs

## Support

For questions or issues:

1. Check this quickstart guide
2. Review `research.md` for technology decisions
3. Inspect `data-model.md` for entity definitions
4. Check `.cursorrules` for Cursor IDE guidance

---

**Estimated Setup Time**: 5-10 minutes  
**First Dashboard Route**: Additional 10-15 minutes  
**Complete MVP**: See `tasks.md` (generated via `/tasks` command)
