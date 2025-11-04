"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-full p-6">
      <Card className="max-w-xl text-center">
        <CardHeader>
          <div className="w-12 h-12 rounded-full bg-red-400/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold mb-2">Dashboard Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Unable to load dashboard data. Please try refreshing.
          </p>

          <Button onClick={reset} variant="default">
            Refresh Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

