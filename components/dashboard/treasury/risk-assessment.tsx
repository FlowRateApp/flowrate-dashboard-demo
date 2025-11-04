"use client";

import * as React from "react";
import { WidgetBase } from "../widget-base";
import { Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskMetrics } from "@/types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RiskAssessmentProps {
  data: RiskMetrics;
  isLoading?: boolean;
}

export function RiskAssessmentWidget({ data, isLoading }: RiskAssessmentProps) {
  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-lightning-green";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getRiskLabel = (risk: string) => {
    const labels = {
      low: {
        text: "Low Risk",
        color: "text-lightning-green bg-lightning-green/20",
      },
      medium: {
        text: "Medium Risk",
        color: "text-yellow-400 bg-yellow-400/20",
      },
      high: { text: "High Risk", color: "text-red-400 bg-red-400/20" },
    };
    return labels[risk as keyof typeof labels] || labels.low;
  };

  const riskLabel = getRiskLabel(data.counterpartyRisk);

  return (
    <WidgetBase
      title="Risk Assessment"
      icon={Shield}
      isLoading={isLoading}
      size="md"
    >
      {/* Overall Risk Score */}
      <div className="text-center mb-6">
        <Card className="inline-flex flex-col items-center">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm mb-2">Overall Risk Score</CardDescription>
            <CardTitle className={cn("text-5xl font-bold", getRiskColor(data.riskScore))}>
              {data.riskScore}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">/100</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs mb-1">Diversification</CardDescription>
            <CardTitle
              className={cn(
                "text-2xl font-bold",
                getRiskColor(data.diversificationScore)
              )}
            >
              {data.diversificationScore}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs mb-1">Channel Health</CardDescription>
            <CardTitle
              className={cn(
                "text-2xl font-bold",
                getRiskColor(data.channelHealthScore)
              )}
            >
              {data.channelHealthScore}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Counterparty Risk */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Counterparty Risk</p>
            <Badge
              className={cn("text-xs", riskLabel.color)}
            >
              {riskLabel.text}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Recommendations
          </p>
          {data.recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      )}

      {data.recommendations.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-lightning-green">
            ✓ All risk metrics look healthy
          </p>
        </div>
      )}
    </WidgetBase>
  );
}
