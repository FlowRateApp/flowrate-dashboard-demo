"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface AppSidebarProps {
  items: NavItem[];
  title: string;
}

export function AppSidebar({ items, title }: AppSidebarProps) {
  const pathname = usePathname();
  const normalizedPathname = pathname ?? "";
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={cn("border-b", state === "collapsed" && "p-0")}>
        <div
          className={cn(
            "flex items-center gap-2 py-4",
            state === "collapsed" ? "justify-center w-full" : "px-2"
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <span className="text-sm font-bold">F</span>
          </div>
          {state === "expanded" && (
            <h2 className="text-lg font-semibold">{title}</h2>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className={cn(state === "collapsed" && "items-center px-0")}>
          {items.map((item) => {
            const isActive =
              normalizedPathname === item.href ||
              normalizedPathname.startsWith(item.href + "/");
            return (
              <SidebarMenuItem key={item.href} className={cn(state === "collapsed" && "flex justify-center w-full")}>
                <SidebarMenuButton
                  asChild
                  tooltip={state === "collapsed" ? item.title : undefined}
                  isActive={isActive}
                  className={cn(
                    state === "collapsed" && "mx-auto"
                  )}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

