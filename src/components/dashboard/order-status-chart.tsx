"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface OrderStatusChartProps {
  data: {
    status: string;
    count: number;
  }[];
}

const COLORS = {
  "pending payment": "#3b82f6",
  paid: "#8b5cf6",
  delivered: "#10b981",
  completed: "#22c55e",
  dispute: "#ef4444",
  refunded: "#f59e0b",
  expired: "#6b7280",
  cancelled: "#e11d48",
  late: "#dc2626",
};

export default function OrderStatusChart({ data }: OrderStatusChartProps) {
  const hasData = data.length > 0 && data.some((item) => item.count > 0);
  const totalOrders = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Distribution</CardTitle>
        <CardDescription>Orders by status</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[entry.status as keyof typeof COLORS] || "#94a3b8"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload[0]) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium capitalize">
                              {payload[0].payload.status}
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
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
          </>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No orders yet
              </p>
              <p className="text-sm text-muted-foreground">
                Your order distribution will appear here
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
