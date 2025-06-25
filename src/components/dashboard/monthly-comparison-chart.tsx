"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MonthlyComparisonChartProps {
  currentMonth: number;
  lastMonth: number;
}

export default function MonthlyComparisonChart({
  currentMonth,
  lastMonth,
}: MonthlyComparisonChartProps) {
  const data = [
    {
      month: "Last Month",
      orders: lastMonth,
    },
    {
      month: "This Month",
      orders: currentMonth,
    },
  ];

  const percentChange =
    lastMonth > 0
      ? ((currentMonth - lastMonth) / lastMonth) * 100
      : currentMonth > 0
        ? 100
        : 0;

  const isPositive = percentChange >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Orders</CardTitle>
        <CardDescription>Order comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {payload[0].payload.month}
                        </span>
                        <span className="text-lg font-bold">
                          {payload[0].value} orders
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="orders" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {percentChange.toFixed(1)}%
            </span>
          </div>
          <span className="text-sm text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
