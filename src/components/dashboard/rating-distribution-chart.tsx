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
import { Star } from "lucide-react";

interface RatingDistributionChartProps {
  data: {
    rating: string;
    count: number;
  }[];
}

export default function RatingDistributionChart({
  data,
}: RatingDistributionChartProps) {
  const totalReviews = data.reduce((sum, item) => sum + item.count, 0);
  const hasReviews = totalReviews > 0;

  const averageRating = hasReviews
    ? data.reduce((sum, item) => sum + parseInt(item.rating) * item.count, 0) /
      totalReviews
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Distribution</CardTitle>
        <CardDescription>Customer review breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        {hasReviews ? (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="rating"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `${value} ★`}
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
                              {payload[0].payload.rating} Stars
                            </span>
                            <span className="text-lg font-bold">
                              {payload[0].value} reviews
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#facc15" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                <span className="text-lg font-bold">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                from {totalReviews} reviews
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <div className="text-center">
              <Star className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-2 text-lg font-medium text-muted-foreground">
                No reviews yet
              </p>
              <p className="text-sm text-muted-foreground">
                Complete orders to receive reviews
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
