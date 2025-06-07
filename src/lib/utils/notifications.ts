// src/lib/utils/notifications.ts

import { NotificationType } from "@prisma/client";
import {
  Star,
  Package,
  DollarSign,
  MessageSquare,
  Settings,
  LucideIcon,
} from "lucide-react";

// Get the appropriate icon for each notification type
export function getNotificationIcon(type: NotificationType): LucideIcon {
  const iconMap: Record<NotificationType, LucideIcon> = {
    REVIEW: Star,
    ORDER_UPDATE: Package,
    PAYMENT: DollarSign,
    MESSAGE: MessageSquare,
    SYSTEM: Settings,
  };

  return iconMap[type] || Settings;
}

// Get the color class for each notification type
export function getNotificationColor(type: NotificationType): string {
  const colorMap: Record<NotificationType, string> = {
    REVIEW: "text-yellow-400",
    ORDER_UPDATE: "text-blue-400",
    PAYMENT: "text-green-400",
    MESSAGE: "text-purple-400",
    SYSTEM: "text-gray-400",
  };

  return colorMap[type] || "text-gray-400";
}

// Get the background color class for notification icons
export function getNotificationBgColor(type: NotificationType): string {
  const bgColorMap: Record<NotificationType, string> = {
    REVIEW: "bg-yellow-400/10",
    ORDER_UPDATE: "bg-blue-400/10",
    PAYMENT: "bg-green-400/10",
    MESSAGE: "bg-purple-400/10",
    SYSTEM: "bg-gray-400/10",
  };

  return bgColorMap[type] || "bg-gray-400/10";
}

// Get the border color for unread notifications
export function getNotificationBorderColor(type: NotificationType): string {
  const borderColorMap: Record<NotificationType, string> = {
    REVIEW: "border-yellow-500/50",
    ORDER_UPDATE: "border-blue-500/50",
    PAYMENT: "border-green-500/50",
    MESSAGE: "border-purple-500/50",
    SYSTEM: "border-gray-500/50",
  };

  return borderColorMap[type] || "border-gray-500/50";
}

// Format notification title based on type
export function formatNotificationTitle(type: NotificationType): string {
  const titleMap: Record<NotificationType, string> = {
    REVIEW: "New Review",
    ORDER_UPDATE: "Order Update",
    PAYMENT: "Payment Received",
    MESSAGE: "New Message",
    SYSTEM: "System Notification",
  };

  return titleMap[type] || "Notification";
}

// Get filter options for notification types
export function getNotificationTypeFilters() {
  return [
    { value: "REVIEW", label: "Reviews", icon: Star, color: "text-yellow-400" },
    {
      value: "ORDER_UPDATE",
      label: "Orders",
      icon: Package,
      color: "text-blue-400",
    },
    {
      value: "PAYMENT",
      label: "Payments",
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      value: "MESSAGE",
      label: "Messages",
      icon: MessageSquare,
      color: "text-purple-400",
    },
    {
      value: "SYSTEM",
      label: "System",
      icon: Settings,
      color: "text-gray-400",
    },
  ];
}

// Get read status filter options
export function getReadStatusFilters() {
  return [
    { value: "all", label: "All Notifications" },
    { value: "unread", label: "Unread Only" },
    { value: "read", label: "Read Only" },
  ];
}

// Group notifications by date
export function groupNotificationsByDate(notifications: any[]) {
  const groups: Record<string, any[]> = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    "This Month": [],
    Older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  notifications.forEach((notification) => {
    const notificationDate = new Date(notification.createdAt);

    if (notificationDate >= today) {
      groups.Today.push(notification);
    } else if (notificationDate >= yesterday) {
      groups.Yesterday.push(notification);
    } else if (notificationDate >= weekAgo) {
      groups["This Week"].push(notification);
    } else if (notificationDate >= monthAgo) {
      groups["This Month"].push(notification);
    } else {
      groups.Older.push(notification);
    }
  });

  // Remove empty groups
  return Object.entries(groups).filter(
    ([, notifications]) => notifications.length > 0
  );
}
