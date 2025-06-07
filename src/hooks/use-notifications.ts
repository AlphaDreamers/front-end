// src/hooks/use-notifications.ts

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {type  Notification } from "@/lib/types/notifications";
import {
  getUnreadNotificationCount,
  markNotificationsAsRead,
  deleteNotifications,
} from "@/lib/actions/notifications";

interface UseNotificationsOptions {
  // Enable polling for new notifications
  enablePolling?: boolean;
  // Polling interval in milliseconds
  pollingInterval?: number;
  // Callback when new notifications arrive
  onNewNotification?: (notification: Notification) => void;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const {
    enablePolling = false,
    pollingInterval = 30000, // 30 seconds default
    onNewNotification,
  } = options;

  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch unread notification count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch unread notification count:", error);
    }
  }, []);

  // Mark notifications as read with optimistic update
  const markAsRead = useCallback(
    async (notificationIds: string[]) => {
      setIsLoading(true);

      // Optimistic update
      const previousCount = unreadCount;
      setUnreadCount((prev) => Math.max(0, prev - notificationIds.length));

      try {
        await markNotificationsAsRead(notificationIds);
        toast.success(
          notificationIds.length === 1
            ? "Notification marked as read"
            : `${notificationIds.length} notifications marked as read`
        );
        router.refresh();
      } catch (error) {
        // Revert optimistic update on error
        setUnreadCount(previousCount);
        toast.error("Failed to mark notifications as read");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [unreadCount, router]
  );

  // Delete notifications
  const deleteNotifs = useCallback(
    async (notificationIds: string[]) => {
      setIsLoading(true);

      try {
        await deleteNotifications(notificationIds);
        toast.success(
          notificationIds.length === 1
            ? "Notification deleted"
            : `${notificationIds.length} notifications deleted`
        );

        // Refresh the unread count after deletion
        await fetchUnreadCount();
        router.refresh();
      } catch (error) {
        toast.error("Failed to delete notifications");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUnreadCount, router]
  );

  // Polling for new notifications (basic implementation)
  useEffect(() => {
    if (!enablePolling) return;

    // Initial fetch
    fetchUnreadCount();

    // Set up polling interval
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [enablePolling, pollingInterval, fetchUnreadCount]);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    // This is a placeholder - you would implement actual sound playing here
    // For example, using the Web Audio API or an audio element
    try {
      const audio = new Audio("/sounds/notification.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignore errors (e.g., autoplay blocked)
      });
    } catch (error) {
      console.error("Failed to play notification sound:", error);
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      toast.error("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }, []);

  // Show browser notification
  const showBrowserNotification = useCallback(
    async (title: string, options?: NotificationOptions) => {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;

      try {
        const notification = new Notification(title, {
          icon: "/icon-192x192.png",
          badge: "/icon-72x72.png",
          ...options,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
          router.push("/notifications");
        };
      } catch (error) {
        console.error("Failed to show browser notification:", error);
      }
    },
    [requestNotificationPermission, router]
  );

  return {
    unreadCount,
    isLoading,
    markAsRead,
    deleteNotifications: deleteNotifs,
    fetchUnreadCount,
    playNotificationSound,
    requestNotificationPermission,
    showBrowserNotification,
  };
}

// Hook for managing notification preferences
export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState({
    // Email notifications
    emailReviews: true,
    emailOrders: true,
    emailPayments: true,
    emailMessages: true,
    emailSystem: true,

    // Browser notifications
    browserEnabled: false,
    browserReviews: true,
    browserOrders: true,
    browserPayments: true,
    browserMessages: true,
    browserSystem: false,

    // Sound notifications
    soundEnabled: true,
    soundVolume: 0.5,
  });

  // Load preferences from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("notification-preferences");
    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load notification preferences:", error);
      }
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((newPreferences: typeof preferences) => {
    setPreferences(newPreferences);
    localStorage.setItem(
      "notification-preferences",
      JSON.stringify(newPreferences)
    );
    toast.success("Notification preferences saved");
  }, []);

  // Toggle a specific preference
  const togglePreference = useCallback(
    (key: keyof typeof preferences) => {
      const newPreferences = {
        ...preferences,
        [key]: !preferences[key],
      };
      savePreferences(newPreferences);
    },
    [preferences, savePreferences]
  );

  return {
    preferences,
    savePreferences,
    togglePreference,
  };
}
