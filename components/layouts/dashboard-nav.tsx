"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface DashboardNavProps {
  items: NavItem[];
  title: string;
  currentPath: string;
}

export function DashboardNav({ items, title, currentPath }: DashboardNavProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const normalizedPathname = pathname ?? currentPath ?? "";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r flex-col">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {items.map((item) => {
            const isActive =
              normalizedPathname === item.href ||
              normalizedPathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {items.map((item) => {
              const isActive =
                normalizedPathname === item.href ||
                normalizedPathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}

