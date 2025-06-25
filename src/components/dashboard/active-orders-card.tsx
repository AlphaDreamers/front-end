"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Order } from "@/lib/types";
import { useSession } from "next-auth/react";

interface ActiveOrdersCardProps {
  orders: Order[];
}

const statusConfig = {
  PAID: {
    label: "In Progress",
    variant: "default" as const,
    icon: Clock,
    color: "text-purple-500",
  },
  DELIVERED: {
    label: "Under Review",
    variant: "secondary" as const,
    icon: CheckCircle,
    color: "text-green-500",
  },
};

export default function ActiveOrdersCard({
  orders = [],
}: ActiveOrdersCardProps) {
  const session = useSession();
  const [viewMode, setViewMode] = useState<"buyer" | "seller">("seller");
  const hasOrders = orders.length > 0;

  const filteredOrders = orders.filter((order) => {
    if (session.status !== "authenticated") return false;
    if (viewMode === "buyer") {
      return order.buyer.id === session.data?.user.id;
    }
    return order.seller.id === session.data?.user.id;
  });

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Active Orders</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-muted p-1">
            <Button
              variant={viewMode === "buyer" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 px-3 text-xs",
                viewMode === "buyer" && "shadow-sm"
              )}
              onClick={() => setViewMode("buyer")}
            >
              As Buyer
            </Button>
            <Button
              variant={viewMode === "seller" ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 px-3 text-xs",
                viewMode === "seller" && "shadow-sm"
              )}
              onClick={() => setViewMode("seller")}
            >
              As Seller
            </Button>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/orders">
              View All
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {hasOrders ? (
          <div className="divide-y">
            {filteredOrders.map((order) => {
              const status =
                statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = status?.icon || AlertCircle;
              const otherParty =
                viewMode === "buyer" ? order.seller : order.buyer;

              return (
                <div
                  key={order.id}
                  className="group relative p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <Image
                        src={otherParty.avatar || "/avatar-fallback.png"}
                        alt={`${otherParty.firstName} ${otherParty.lastName}`}
                        width={48}
                        height={48}
                        className="rounded-full border-2 border-background"
                      />
                      {order.isOverdue && (
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-red-500 p-1">
                          <AlertCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold line-clamp-1">
                            {order.package.gig.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {order.package.title} • {order.package.price} SOL
                          </p>
                        </div>
                        <Badge
                          variant={status?.variant || "outline"}
                          className="ml-2 shrink-0"
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status?.label || order.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {order.formattedDeadline}
                        </span>
                        <span>
                          {viewMode === "buyer" ? "Seller" : "Buyer"}:{" "}
                          <span className="font-medium">
                            @{otherParty.username}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {order.chat && (
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/dashboard/orders/${order.id}/chat`}>
                            <MessageSquare className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No active orders</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {viewMode === "buyer"
                ? "Orders you've placed will appear here"
                : "Orders from your buyers will appear here"}
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/gigs">
                Browse Gigs
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
