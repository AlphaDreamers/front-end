"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

interface EarningsChartProps {
  data: {
    month: string;
    earnings: number;
  }[];
  className?: string;
}

export default function EarningsChart({ data, className }: EarningsChartProps) {
  const hasData = data.length > 0;
  const totalEarnings = data.reduce((sum, item) => sum + item.earnings, 0);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Earnings Overview</CardTitle>
        <CardDescription>Your earnings over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `${value} SOL`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Month
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].payload.month}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Earnings
                            </span>
                            <span className="font-bold">
                              {payload[0].value} SOL
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorEarnings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No earnings data yet
              </p>
              <p className="text-sm text-muted-foreground">
                Complete orders to see your earnings chart
              </p>
            </div>
          </div>
        )}
        {hasData && (
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Total Period Earnings
            </p>
            <p className="text-lg font-bold">{totalEarnings.toFixed(2)} SOL</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
