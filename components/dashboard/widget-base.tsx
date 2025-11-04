"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface WidgetBaseProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  actions?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "col-span-1",
  md: "col-span-1 md:col-span-2",
  lg: "col-span-1 md:col-span-2 lg:col-span-3",
};

export function WidgetBase({
  title,
  icon: Icon,
  children,
  isLoading = false,
  error = null,
  actions,
  className,
  size = "md",
}: WidgetBaseProps) {
  return (
    <Card className={cn(sizeClasses[size], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-lightning-blue/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-lightning-blue" />
            </div>
          )}
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </div>
        {actions && <div>{actions}</div>}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="md" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-2">Error loading data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
