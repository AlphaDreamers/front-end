"use client";

import { Clock, CheckCircle, ShoppingBag, AlertTriangle } from "lucide-react";
import { StatCard } from "./stat-card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STATS_CONFIG: ((...args: any[]) => StatCardProps)[] = [
  (ordersInProgress: number) => ({
    variant: "purple" as const,
    type: "link" as const,
    size: "default" as const,
    config: {
      label: "In Progress",
      text: "Active orders",
      icon: Clock,
      value: ordersInProgress,
      href: "/dashboard/orders/in-progress",
    },
  }),
  (completedOrders: number) => ({
    variant: "green" as const,
    size: "default" as const,
    type: "link" as const,
    config: {
      label: "Completed",
      text: "Finished orders",
      value: completedOrders,
      href: "/dashboard/orders/completed",
      icon: CheckCircle,
    },
  }),
  (pendingOrders: number) => ({
    variant: "blue" as const,
    size: "default" as const,
    type: "link" as const,
    config: {
      label: "Pending",
      text: "Awaiting action",
      value: pendingOrders,
      href: "/dashboard/orders/pending",
      icon: ShoppingBag,
    },
  }),
  (disputedOrders: number) => ({
    variant: "orange" as const,
    size: "default" as const,
    type: "link" as const,
    config: {
      label: "Disputed",
      text: "Needs resolution",
      value: disputedOrders,
      href: "/dashboard/orders/disputed",
      icon: AlertTriangle,
    },
  }),
];

interface StatCardProps {
  ordersInProgress?: number;
  completedOrders?: number;
  pendingOrders?: number;
  disputedOrders?: number;
}

export function StatsSummary({
  ordersInProgress = 0,
  completedOrders = 0,
  pendingOrders = 0,
  disputedOrders = 0,
}: StatCardProps) {
  const values = [
    [ordersInProgress],
    [completedOrders],
    [pendingOrders],
    [disputedOrders],
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {STATS_CONFIG.map((item, index) => (
        <StatCard key={index} {...item(...values[index])} />
      ))}
    </div>
  );
}
