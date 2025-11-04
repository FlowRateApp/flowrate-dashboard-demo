"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert as AlertType } from "@/types";

interface AlertBannerProps {
  alert: AlertType;
  onDismiss?: () => void;
}

export function AlertBanner({ alert, onDismiss }: AlertBannerProps) {
  const severityStyles = {
    info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
    warning:
      "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
    error:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
  };

  return (
    <Alert className={cn(severityStyles[alert.severity])}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <AlertTitle className="font-semibold">{alert.title}</AlertTitle>
            <Badge variant="outline" className="text-xs border-current/50">
              {alert.severity}
            </Badge>
          </div>
          <AlertDescription className="opacity-90">
            {alert.message}
          </AlertDescription>
          {alert.actionLabel && alert.actionUrl && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-current/50 hover:bg-current/10"
              onClick={() => (window.location.href = alert.actionUrl!)}
            >
              {alert.actionLabel}
            </Button>
          )}
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss alert</span>
          </Button>
        )}
      </div>
    </Alert>
  );
}
