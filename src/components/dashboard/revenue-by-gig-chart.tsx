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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DollarSign } from "lucide-react";

interface RevenueByGigChartProps {
  data: {
    name: string;
    revenue: number;
  }[];
}

export default function RevenueByGigChart({ data }: RevenueByGigChartProps) {
  const hasData = data.length > 0;
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Gigs</CardTitle>
        <CardDescription>Revenue by gig</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data} layout="horizontal">
                <XAxis
                  type="number"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `${value} SOL`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  width={100}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {payload[0].payload.name}
                            </span>
                            <span className="text-lg font-bold">
                              {payload[0].value} SOL
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Total Revenue
                </span>
              </div>
              <span className="text-lg font-bold">
                {totalRevenue.toFixed(2)} SOL
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <div className="text-center">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-2 text-lg font-medium text-muted-foreground">
                No revenue data yet
              </p>
              <p className="text-sm text-muted-foreground">
                Create gigs and complete orders
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
