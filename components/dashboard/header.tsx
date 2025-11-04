"use client";

import * as React from "react";
import { Bell, User, RefreshCw } from "lucide-react";

export function DashboardHeader() {
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // Trigger data refresh
    window.location.reload();
  };

  return (
    <header className="border-b px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumb / Title */}
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg text-muted-foreground hover:text-lightning-blue transition-all hover:bg-accent"
            aria-label="Refresh data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg text-muted-foreground hover:text-lightning-blue transition-all hover:bg-accent"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-lightning-orange rounded-full" />
          </button>

          {/* User Avatar */}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-all hover:bg-accent"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-lightning-blue/20 flex items-center justify-center">
              <User className="w-5 h-5 text-lightning-blue" />
            </div>
            <span className="hidden sm:block text-sm font-medium">
              Demo User
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
