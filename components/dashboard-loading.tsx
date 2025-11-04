import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-full">
      <LoadingSpinner size="lg" withText text="Loading dashboard..." />
    </div>
  );
}

