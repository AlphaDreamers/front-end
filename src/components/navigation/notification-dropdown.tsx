// src/components/navigation/notification-dropdown.tsx
"use client";

import Link from "next/link";
import { Bell, Package, MessageSquare, Star, Wallet } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface NotificationDropdownProps {
  unreadCount: number;
}

// Mock notification data - in real app, this would come from API
const mockNotifications = [
  {
    id: "1",
    type: "order",
    title: "New Order Received",
    description: 'Someone ordered your "Logo Design" gig',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    isRead: false,
    icon: Package,
    href: "/dashboard/orders/123",
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    description: "@buyer123 sent you a message",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    icon: MessageSquare,
    href: "/messages/456",
  },
  {
    id: "3",
    type: "review",
    title: "New Review",
    description: "You received a 5-star review!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: true,
    icon: Star,
    href: "/dashboard/reviews",
  },
  {
    id: "4",
    type: "payment",
    title: "Payment Received",
    description: "0.5 SOL has been added to your wallet",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    icon: Wallet,
    href: "/dashboard/wallets",
  },
];

export default function NotificationDropdown({
  unreadCount,
}: NotificationDropdownProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return Package;
      case "message":
        return MessageSquare;
      case "review":
        return Star;
      case "payment":
        return Wallet;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-blue-500";
      case "message":
        return "text-green-500";
      case "review":
        return "text-yellow-500";
      case "payment":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuItem className="flex items-center justify-between">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <ScrollArea className="h-[300px]">
          {mockNotifications.length > 0 ? (
            <div className="space-y-1 p-1">
              {mockNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);

                return (
                  <Link
                    key={notification.id}
                    href={notification.href}
                    className="block"
                  >
                    <DropdownMenuItem
                      className={cn(
                        "flex items-start gap-3 p-3 cursor-pointer",
                        !notification.isRead && "bg-accent/50"
                      )}
                    >
                      <div className={cn("mt-0.5", iconColor)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="mt-1">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                      )}
                    </DropdownMenuItem>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/notifications"
            className="w-full text-center text-sm font-medium cursor-pointer"
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
