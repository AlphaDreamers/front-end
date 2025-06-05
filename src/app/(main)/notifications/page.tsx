"use client";

import { useState } from "react";
import {
  ShoppingBag,
  MessageCircle,
  Wallet,
  Bell,
  Settings,
  ExternalLink,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const USER_ROLE = "both";

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "order",
    category: "buyer",
    title: "Order #123 Delivered",
    description: "Your order has been delivered by @DesignerJane.",
    timestamp: "2 hours ago",
    isRead: false,
    actionUrl: "/orders/123",
    icon: ShoppingBag,
  },
  {
    id: "2",
    type: "payment",
    category: "buyer",
    title: "Payment of 0.5 SOL Confirmed",
    description: "Your payment has been processed successfully.",
    timestamp: "4 hours ago",
    isRead: false,
    actionUrl: "/orders/124",
    txId: "4xyz789abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
    icon: Wallet,
  },
  {
    id: "3",
    type: "message",
    category: "both",
    title: "New Message from @WebDevPro",
    description: "Hey! I have a question about your project requirements.",
    timestamp: "6 hours ago",
    isRead: true,
    actionUrl: "/messages",
    icon: MessageCircle,
  },
  {
    id: "4",
    type: "order",
    category: "seller",
    title: "New Order Placed by Buyer123",
    description: 'You have received a new order for "Logo Design Package".',
    timestamp: "1 day ago",
    isRead: false,
    actionUrl: "/orders/456",
    icon: ShoppingBag,
  },
  {
    id: "5",
    type: "gig",
    category: "seller",
    title: 'Your Gig "Build Website" is Active',
    description:
      "Your gig has been approved and is now live on the marketplace.",
    timestamp: "2 days ago",
    isRead: true,
    actionUrl: "/gigs/789",
    icon: Bell,
  },
  {
    id: "6",
    type: "system",
    category: "both",
    title: "Platform Maintenance Scheduled",
    description: "Scheduled maintenance on Dec 15, 2024 from 2-4 AM UTC.",
    timestamp: "3 days ago",
    isRead: true,
    actionUrl: "/announcements",
    icon: Settings,
  },
];

type NotificationType =
  | "all"
  | "order"
  | "message"
  | "payment"
  | "gig"
  | "system";
type NotificationStatus = "all" | "unread" | "read";
type SortOrder = "newest" | "oldest";
type TabType = "all" | "buyer" | "seller";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedTab, setSelectedTab] = useState<TabType>("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType>("all");
  const [statusFilter, setStatusFilter] = useState<NotificationStatus>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedNotifications, setSelectedNotifications] = useState<
    Set<string>
  >(new Set());
  const [visibleCount, setVisibleCount] = useState(10);

  // Filter notifications based on current filters
  const filteredNotifications = notifications
    .filter((notification) => {
      // Tab filter
      if (
        selectedTab === "buyer" &&
        notification.category !== "buyer" &&
        notification.category !== "both"
      )
        return false;
      if (
        selectedTab === "seller" &&
        notification.category !== "seller" &&
        notification.category !== "both"
      )
        return false;

      // Type filter
      if (typeFilter !== "all" && notification.type !== typeFilter)
        return false;

      // Status filter
      if (statusFilter === "unread" && notification.isRead) return false;
      if (statusFilter === "read" && !notification.isRead) return false;

      return true;
    })
    .sort((a, b) => {
      // Simple timestamp sorting (in real app, use proper date comparison)
      const timeA = Number.parseInt(a.timestamp.split(" ")[0]) || 0;
      const timeB = Number.parseInt(b.timestamp.split(" ")[0]) || 0;
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    })
    .slice(0, visibleCount);

  const unreadCount = filteredNotifications.filter((n) => !n.isRead).length;
  const hasSelectedNotifications = selectedNotifications.size > 0;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(new Set(filteredNotifications.map((n) => n.id)));
    } else {
      setSelectedNotifications(new Set());
    }
  };

  const handleSelectNotification = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedNotifications);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedNotifications(newSelected);
  };

  const markSelectedAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) =>
        selectedNotifications.has(notification.id)
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setSelectedNotifications(new Set());
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
    setSelectedNotifications(new Set());
  };

  const clearFilters = () => {
    setTypeFilter("all");
    setStatusFilter("all");
    setSortOrder("newest");
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read when clicked
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
    // In real app, navigate to actionUrl
    console.log("Navigate to:", notification.actionUrl);
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {filteredNotifications.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="mb-6">
              <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-lg text-gray-400 mb-6">
                No notifications yet. Stay active to receive updates!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-violet-500 hover:bg-violet-600 text-white"
                  onClick={() => console.log("Navigate to /gigs")}
                >
                  Browse Gigs
                </Button>
                {(USER_ROLE === "seller" || USER_ROLE === "both") && (
                  <Button
                    variant="outline"
                    className="border-violet-500 text-violet-400 hover:bg-violet-500/10"
                    onClick={() => console.log("Navigate to /seller/gigs")}
                  >
                    Create Gigs
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Notification List */
          <div className="space-y-1">
            {/* Select All Checkbox */}
            {filteredNotifications.length > 0 && (
              <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg mb-4">
                <Checkbox
                  checked={
                    selectedNotifications.size === filteredNotifications.length
                  }
                  onCheckedChange={handleSelectAll}
                  className="border-violet-500 data-[state=checked]:bg-violet-500"
                />
                <span className="text-sm text-gray-400">
                  {selectedNotifications.size > 0
                    ? `${selectedNotifications.size} selected`
                    : "Select all notifications"}
                </span>
              </div>
            )}

            {filteredNotifications.map((notification, index) => {
              const Icon = notification.icon;
              const isSelected = selectedNotifications.has(notification.id);

              return (
                <div key={notification.id}>
                  <div
                    className={cn(
                      "flex items-start gap-4 p-4 bg-gray-800 hover:bg-gray-700/20 rounded-lg transition-colors cursor-pointer group",
                      !notification.isRead && "border-l-2 border-violet-500"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Checkbox */}
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectNotification(
                          notification.id,
                          checked as boolean
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="border-violet-500 data-[state=checked]:bg-violet-500 mt-1"
                    />

                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <Icon className="w-4 h-4 text-violet-400" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3
                            className={cn(
                              "text-sm font-medium text-white group-hover:underline",
                              !notification.isRead && "font-semibold"
                            )}
                          >
                            {notification.title}
                            {!notification.isRead && (
                              <Badge className="ml-2 bg-violet-500/10 text-violet-400 text-xs">
                                New
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {notification.description}
                          </p>
                          {notification.txId && (
                            <div className="mt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(
                                    `https://explorer.solana.com/tx/${notification.txId}`,
                                    "_blank"
                                  );
                                }}
                                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                              >
                                Tx: {notification.txId.slice(0, 8)}...
                                {notification.txId.slice(-8)}
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {notification.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < filteredNotifications.length - 1 && (
                    <div className="border-b border-gray-800/50" />
                  )}
                </div>
              );
            })}

            {/* Load More */}
            {visibleCount < notifications.length && (
              <div className="text-center py-8">
                <Button
                  onClick={loadMore}
                  className="bg-violet-500 hover:bg-violet-600 text-white"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
