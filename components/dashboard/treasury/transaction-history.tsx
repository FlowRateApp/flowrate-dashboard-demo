"use client";

import * as React from "react";
import { WidgetBase } from "../widget-base";
import { History, ArrowDownCircle, ArrowUpCircle, Coins } from "lucide-react";
import type { Transaction } from "@/types/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TransactionHistoryProps {
  data: Transaction[];
  isLoading?: boolean;
}

export function TransactionHistoryWidget({
  data,
  isLoading,
}: TransactionHistoryProps) {
  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
        return <ArrowDownCircle className="w-5 h-5 text-lightning-green" />;
      case "withdrawal":
        return <ArrowUpCircle className="w-5 h-5 text-lightning-orange" />;
      case "yield":
        return <Coins className="w-5 h-5 text-lightning-blue" />;
      case "fee":
        return <Coins className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    const styles = {
      confirmed: "bg-lightning-green/20 text-lightning-green",
      pending: "bg-yellow-400/20 text-yellow-400",
      failed: "bg-red-400/20 text-red-400",
    };
    return styles[status];
  };

  return (
    <WidgetBase
      title="Transaction History"
      icon={History}
      isLoading={isLoading}
      size="lg"
    >
      <div className="space-y-3">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions yet
          </div>
        ) : (
          data.map((tx) => (
            <Card
              key={tx.id}
              className="transition-all cursor-pointer hover:bg-accent"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  {/* Left: Icon and Details */}
                  <div className="flex items-center gap-3 flex-1">
                    <Card className="p-2">
                      {getTransactionIcon(tx.type)}
                    </Card>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm capitalize">
                          {tx.type}
                        </p>
                        <Badge
                          variant="secondary"
                          className={getStatusBadge(tx.status)}
                        >
                          {tx.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {tx.txid
                          ? `TX: ${tx.txid.substring(0, 16)}...`
                          : new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Right: Amount */}
                  <div className="text-right">
                    <p className="font-semibold">
                      {tx.type === "withdrawal" || tx.type === "fee" ? "-" : "+"}
                      {tx.amount.toFixed(6)} BTC
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${(tx.amount * 45000).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {data.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-lightning-blue hover:text-lightning-green transition-colors">
            View all transactions →
          </button>
        </div>
      )}
    </WidgetBase>
  );
}
