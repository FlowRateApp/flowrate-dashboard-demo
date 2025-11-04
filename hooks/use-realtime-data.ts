"use client";

import { useState, useEffect, useCallback } from "react";
import type { DashboardData, DashboardView } from "@/types/dashboard";
import { generateDashboardData } from "@/lib/mock-data/generator";

/**
 * Hook for simulating real-time dashboard data updates
 * Mimics WebSocket-like behavior with periodic updates
 */
export function useRealtimeData(
  view: DashboardView,
  updateInterval: number = 10000
) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshData = useCallback(() => {
    try {
      const newData = generateDashboardData(view);
      setData(newData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  }, [view]);

  useEffect(() => {
    // Initial load
    setIsLoading(true);
    refreshData();
    setIsLoading(false);

    // Set up periodic updates
    const interval = setInterval(refreshData, updateInterval);

    return () => clearInterval(interval);
  }, [view, updateInterval, refreshData]);

  return {
    data,
    isLoading,
    error,
    refresh: refreshData,
  };
}
