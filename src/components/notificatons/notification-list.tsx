// src/components/notifications/notification-list.tsx

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bell, Check, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Notification } from "@/lib/types";
import { NotificationCard } from "./notification-card";
import {
  deleteNotifications,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
} from "@/lib/actions/notifications";
import { groupNotificationsByDate } from "@/lib/utils";

interface NotificationListProps {
  notifications: Notification[];
  showGrouping?: boolean;
}

export function NotificationList({
  notifications,
  showGrouping = true,
}: NotificationListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedNotifications, setSelectedNotifications] = useState<
    Set<string>
  >(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<
    string | null
  >(null);

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

  // Check if some but not all notifications are selected
  const isSomeSelected =
    selectedNotifications.size > 0 &&
    selectedNotifications.size < notifications.length;

  // Handle single notification deletion
  const handleDelete = (notificationId: string) => {
    setNotificationToDelete(notificationId);
    setShowDeleteDialog(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (!notificationToDelete) return;

    const notificationIds =
      notificationToDelete === "bulk"
        ? Array.from(selectedNotifications)
        : [notificationToDelete];

    startTransition(async () => {
      try {
        await deleteNotifications(notificationIds);
        toast.success(
          notificationIds.length === 1
            ? "Notification deleted successfully"
            : `${notificationIds.length} notifications deleted successfully`
        );
        setSelectedNotifications(new Set());
        router.refresh();
      } catch (error) {
        toast.error("Failed to delete notifications");
      } finally {
        setShowDeleteDialog(false);
        setNotificationToDelete(null);
      }
    });
  };

  // Handle marking single notification as read
  const handleMarkAsRead = (notificationId: string) => {
    startTransition(async () => {
      try {
        await markNotificationsAsRead([notificationId]);
        toast.success("Notification marked as read");
        router.refresh();
      } catch (error) {
        toast.error("Failed to mark notification as read");
      }
    });
  };

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
      } catch (error) {
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
      } catch (error) {
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
    setNotificationToDelete("bulk");
    setShowDeleteDialog(true);
  };

  // Empty state
  if (notifications.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Bell className="h-12 w-12 mb-4 text-gray-600" />
          <p className="text-lg font-medium">No notifications found</p>
          <p className="text-sm text-gray-500 mt-1">
            You're all caught up! Check back later for new updates.
          </p>
        </div>
      </Card>
    );
  }

  // Group notifications by date if enabled
  const notificationGroups = showGrouping
    ? groupNotificationsByDate(notifications)
    : [["All", notifications]];

  return (
    <div className="space-y-4">
      {/* Bulk action bar */}
      {notifications.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isAllSelected}
              indeterminate={isSomeSelected}
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

      {/* Notifications grouped by date */}
      {notificationGroups.map(([groupLabel, groupNotifications]) => (
        <div key={groupLabel} className="space-y-3">
          {showGrouping && (
            <h3 className="text-sm font-medium text-gray-400 px-1">
              {groupLabel}
            </h3>
          )}
          <div className="space-y-3">
            {groupNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                isChecked={selectedNotifications.has(notification.id)}
                onCheckedChange={handleCheckedChange}
                onDelete={handleDelete}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="size-5 text-red-500" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {notificationToDelete === "bulk"
                ? `Are you sure you want to delete ${selectedNotifications.size} selected notification${
                    selectedNotifications.size > 1 ? "s" : ""
                  }? This action cannot be undone.`
                : "Are you sure you want to delete this notification? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              disabled={isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Skeleton loader for notifications
export function NotificationListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
        <Skeleton className="h-5 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="p-6 bg-gray-900 border-gray-700">
          <div className="flex items-start gap-4">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
