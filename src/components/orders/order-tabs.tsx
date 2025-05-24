"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { OrderList } from "./order-list";
import { OrderSearch } from "./order-search";

interface OrderTabsProps {
  orders: any[];
  userType: "buyer" | "seller" | "both";
}

export function OrderTabs({ orders, userType }: OrderTabsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const activeOrders = orders.filter(
    (order) => order.status === "in_progress" || order.status === "delivered"
  );

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled" || order.status === "disputed"
  );

  const filterOrders = (orders: any[]) => {
    if (!searchQuery) return orders;

    return orders.filter(
      (order) =>
        order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (userType === "buyer"
          ? order.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
          : order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  return (
    <div className="space-y-4 w-full">
      <OrderSearch onSearch={setSearchQuery} />

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-purple-600"
          >
            Active ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-purple-600"
          >
            Completed ({completedOrders.length})
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="data-[state=active]:bg-purple-600"
          >
            Cancelled ({cancelledOrders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          <OrderList
            orders={filterOrders(activeOrders)}
            userType={userType}
            emptyMessage="No active orders found"
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <OrderList
            orders={filterOrders(completedOrders)}
            userType={userType}
            emptyMessage="No completed orders found"
          />
        </TabsContent>

        <TabsContent value="cancelled" className="mt-0">
          <OrderList
            orders={filterOrders(cancelledOrders)}
            userType={userType}
            emptyMessage="No cancelled orders found"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
