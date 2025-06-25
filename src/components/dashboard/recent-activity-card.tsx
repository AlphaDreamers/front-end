"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  MessageSquare,
  DollarSign,
  Star,
  Package,
  ArrowRight,
  Activity,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Notification } from "@/lib/types";
import { NotificationType } from "@prisma/client";

interface RecentActivityCardProps {
  notifications: Notification[];
}

const notificationConfig: Record<
  NotificationType,
  {
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }
> = {
  ORDER_UPDATE: {
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  MESSAGE: {
    icon: MessageSquare,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  PAYMENT: {
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  REVIEW: {
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
};

export default function RecentActivityCard({
  notifications = [],
}: RecentActivityCardProps) {
  const hasNotifications = notifications.length > 0;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/notifications">
            View All
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {hasNotifications ? (
          <div className="divide-y">
            {notifications.map((notification) => {
              const config = notificationConfig[notification.type];
              const Icon = config?.icon || Bell;

              return (
                <div
                  key={notification.id}
                  className={cn(
                    "group relative p-4 transition-colors",
                    notification.isRead
                      ? "hover:bg-muted/50"
                      : "bg-primary/5 hover:bg-primary/10"
                  )}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        "rounded-full p-2 shrink-0 aspect-square max-w-8 max-h-8",
                        config?.bgColor || "bg-muted"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          config?.color || "text-muted-foreground"
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-relaxed">
                        {notification.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                        {!notification.isRead && (
                          <Badge variant="secondary" className="h-5 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No recent activity</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Your notifications and updates will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
