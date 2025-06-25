"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Notification } from "@/lib/types";
import { NotificationCard } from "./notification-card";
import {
  markNotificationsAsRead,
  markAllNotificationsAsRead,
} from "@/lib/actions/notifications";

interface NotificationListProps {
  notifications: Notification[];
  showGrouping?: boolean;
}

export function NotificationList({ notifications }: NotificationListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedNotifications, setSelectedNotifications] = useState<
    Set<string>
  >(new Set());

  // Handle checkbox state changes
  const handleCheckedChange = (checked: boolean, notificationId: string) => {
    setSelectedNotifications((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(notificationId);
      } else {
        newSet.delete(notificationId);
      }
      return newSet;
    });
  };

  // Select/deselect all notifications
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(new Set(notifications.map((n) => n.id)));
    } else {
      setSelectedNotifications(new Set());
    }
  };

  // Check if all notifications are selected
  const isAllSelected =
    notifications.length > 0 &&
    selectedNotifications.size === notifications.length;

  // Handle bulk mark as read
  const handleBulkMarkAsRead = () => {
    if (selectedNotifications.size === 0) {
      toast.error("No notifications selected");
      return;
    }

    startTransition(async () => {
      try {
        await markNotificationsAsRead(Array.from(selectedNotifications));
        toast.success(
          `Marked ${selectedNotifications.size} notification${
            selectedNotifications.size > 1 ? "s" : ""
          } as read`
        );
        setSelectedNotifications(new Set());
        router.refresh();
      } catch {
        toast.error("Failed to mark notifications as read");
      }
    });
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      try {
        await markAllNotificationsAsRead();
        toast.success("All notifications marked as read");
        router.refresh();
      } catch {
        toast.error("Failed to mark all notifications as read");
      }
    });
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedNotifications.size === 0) {
      toast.error("No notifications selected");
      return;
    }
  };

  return (
    <div className="space-y-4">
      {/* Bulk action bar */}
      {notifications.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Select all notifications"
              className="border-gray-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
            />
            <span className="text-sm text-gray-400">
              {selectedNotifications.size > 0
                ? `${selectedNotifications.size} selected`
                : "Select all"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedNotifications.size > 0 ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkMarkAsRead}
                  disabled={isPending}
                  className="border-gray-600 hover:bg-gray-800"
                >
                  <Check className="size-4 mr-1" />
                  Mark as read
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkDelete}
                  disabled={isPending}
                  className="border-red-600 text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="size-4 mr-1" />
                  Delete
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handleMarkAllAsRead}
                disabled={isPending}
                className="border-gray-600 hover:bg-gray-800"
              >
                <Check className="size-4 mr-1" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            isChecked={selectedNotifications.has(notification.id)}
            onCheckedChange={handleCheckedChange}
          />
        ))}
      </div>
    </div>
  );
}
