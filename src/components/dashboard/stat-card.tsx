"use client";

import Link from "next/link";
import { type LucideIcon, TrendingUp, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import Rating from "../rating";

type TrendUpConfig = {
  type: "trend-up";
  config: {
    label: string;
    percentChange: number;
    text: string;
    value: number;
    icon: LucideIcon;
    suffix?: string;
  };
};

type TrendDownConfig = {
  type: "trend-down";
  config: {
    label: string;
    percentChange: number;
    text: string;
    value: number;
    icon: LucideIcon;
    suffix?: string;
  };
};

type LinkConfig = {
  type: "link";
  config: {
    label: string;
    text: string;
    value: number;
    href: string;
    icon: LucideIcon;
    suffix?: string;
  };
};

type RatingConfig = {
  type: "rating";
  config: {
    label: string;
    text: string;
    value: number;
    icon: LucideIcon;
    suffix?: string;
  };
};

type ProgressConfig = {
  type: "progress";
  config: {
    label: string;
    value: number;
    text: string;
    icon: LucideIcon;
    suffix?: string;
  };
};

type StatsConfig =
  | TrendUpConfig
  | TrendDownConfig
  | LinkConfig
  | RatingConfig
  | ProgressConfig;

export type StatCardProps = {
  size?: "default" | "sm" | "lg";
  variant?: "purple" | "green" | "blue" | "orange" | "yellow" | "gray";
} & StatsConfig;

export function StatCard({
  size = "default",
  variant = "gray",
  ...props
}: StatCardProps) {
  const { type, config } = props;
  const Icon = config.icon;

  // Variant styles
  const variantStyles = {
    purple: {
      card: "bg-gradient-to-br from-purple-900/40 to-black border-purple-800/30 hover:border-purple-700/50",
      icon: "bg-purple-500/10 text-purple-400",
      iconColor: "text-purple-400",
    },
    green: {
      card: "bg-gradient-to-br from-green-900/40 to-black border-green-800/30 hover:border-green-700/50",
      icon: "bg-green-500/10 text-green-400",
      iconColor: "text-green-400",
    },
    blue: {
      card: "bg-gradient-to-br from-blue-900/40 to-black border-blue-800/30 hover:border-blue-700/50",
      icon: "bg-blue-500/10 text-blue-400",
      iconColor: "text-blue-400",
    },
    orange: {
      card: "bg-gradient-to-br from-orange-900/40 to-black border-orange-800/30 hover:border-orange-700/50",
      icon: "bg-orange-500/10 text-orange-400",
      iconColor: "text-orange-400",
    },
    yellow: {
      card: "bg-gradient-to-br from-gray-900/40 to-black border-gray-800/30 hover:border-gray-700/50",
      icon: "bg-yellow-500/10 text-yellow-400",
      iconColor: "text-yellow-400",
    },
    gray: {
      card: "bg-gradient-to-br from-gray-900/40 to-black border-gray-800/30 hover:border-gray-700/50",
      icon: "bg-gray-500/10 text-gray-400",
      iconColor: "text-gray-400",
    },
  };

  const currentVariant = variantStyles[variant];

  const renderContent = () => {
    if (size === "sm") {
      return (
        <>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Icon className={cn("h-4 w-4 mr-2", currentVariant.iconColor)} />
              {config.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {type === "trend-up" && (
              <>
                <div className="text-2xl font-bold">
                  {config.value.toLocaleString()}
                  {config.suffix || ""}
                </div>
                <div className="flex items-center mt-1 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                  <span className="text-green-400">
                    +{config.percentChange}%
                  </span>
                  <span className="text-muted-foreground ml-1">
                    {config.text}
                  </span>
                </div>
              </>
            )}
            {type === "trend-down" && (
              <>
                <div className="text-2xl font-bold">
                  {config.value.toLocaleString()}
                  {config.suffix || ""}
                </div>
                <div className="flex items-center mt-1 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1 text-red-400" />
                  <span className="text-red-400">-{config.percentChange}%</span>
                  <span className="text-muted-foreground ml-1">
                    {config.text}
                  </span>
                </div>
              </>
            )}
            {type === "rating" && (
              <>
                <div className="flex items-baseline">
                  <div className="text-2xl font-bold">
                    {config.value.toFixed(1)}
                    {config.suffix || ""}
                  </div>
                  <div className="text-xs text-muted-foreground ml-2">
                    {config.text}
                  </div>
                </div>
                <Rating rating={config.value} />
              </>
            )}
            {type === "progress" && (
              <>
                <div className="text-2xl font-bold">
                  {config.value.toFixed(1)}%{config.suffix || ""}
                </div>
                <Progress value={config.value} className="h-1.5" />
                <div className="text-xs text-muted-foreground mt-1">
                  {config.text}
                </div>
              </>
            )}
            {type === "link" && (
              <>
                <div className="text-2xl font-bold">
                  {config.value.toLocaleString()}
                  {config.suffix || ""}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {config.text}
                </div>
              </>
            )}
          </CardContent>
        </>
      );
    }

    return (
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {config.label}
            </p>
            {type === "trend-up" && size === "lg" ? (
              <div className="flex items-baseline mt-2">
                <h3 className="text-3xl font-bold">
                  {config.value.toFixed(4)}
                  {config.suffix || ""}
                </h3>
                {config.suffix && (
                  <span className="ml-2 text-sm font-medium text-purple-400">
                    {config.suffix}
                  </span>
                )}
              </div>
            ) : (
              <h3
                className={cn(
                  "font-bold mt-2",
                  size === "lg" ? "text-3xl" : "text-2xl"
                )}
              >
                {type === "rating"
                  ? config.value.toFixed(1)
                  : config.value.toLocaleString()}
                {config.suffix || ""}
              </h3>
            )}
            <p className="text-sm text-muted-foreground mt-1">{config.text}</p>
          </div>
          <div className={cn("p-3 rounded-full", currentVariant.icon)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {type === "trend-up" && (
          <div className="mt-4 flex items-center text-xs text-green-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>
              +{config.percentChange}% {config.text}
            </span>
          </div>
        )}
        {type === "trend-down" && (
          <div className="mt-4 flex items-center text-xs text-red-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>
              -{config.percentChange}% {config.text}
            </span>
          </div>
        )}

        {type === "link" && (
          <Link
            href={config.href}
            className="mt-4 flex items-center text-xs text-green-400"
          >
            <ArrowUpRight className="h-3 w-3 mr-1" />
            <span>View all</span>
          </Link>
        )}

        {type === "rating" && (
          <div className="mt-4">
            <Rating rating={config.value} />
          </div>
        )}

        {type === "progress" && (
          <div className="mt-4">
            <Progress value={config.value} className="h-2" />
          </div>
        )}
      </CardContent>
    );
  };

  return (
    <Card className={cn(currentVariant.card, "transition-colors")}>
      {renderContent()}
    </Card>
  );
}
