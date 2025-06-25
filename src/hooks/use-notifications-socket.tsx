"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import io, { Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Notification } from "@/lib/types";

interface UseNotificationsSocketOptions {
  onNotification?: (notification: Notification) => void;
  playSound?: boolean;
}

export function useNotificationsSocket({
  onNotification,
  playSound = true,
}: UseNotificationsSocketOptions = {}) {
  const { data: session, status } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  console.log(
    "[NotificationSocket] Hook called with session status:",
    status,
    "user:",
    session?.user?.id
  );

  // Initialize audio element for notification sounds
  useEffect(() => {
    if (playSound && typeof window !== "undefined") {
      audioRef.current = new Audio("/notification-sound.mp3");
      audioRef.current.volume = 0.5;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, [playSound]);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (audioRef.current && playSound) {
      audioRef.current.play().catch((err) => {
        console.warn("Failed to play notification sound:", err);
      });
    }
  }, [playSound]);

  useEffect(() => {
    console.log(
      "[NotificationSocket] Effect running. Status:",
      status,
      "User ID:",
      session?.user?.id
    );

    // Only connect if we have an authenticated session
    if (status !== "authenticated" || !session?.user?.id) {
      console.log(
        "[NotificationSocket] Skipping connection - not authenticated"
      );
      return;
    }

    // Get the session token from the cookie
    const getSessionToken = () => {
      const cookies = document.cookie.split(";");
      console.log("[NotificationSocket] Looking for session token in cookies");

      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        console.log(`[NotificationSocket] Checking cookie: ${name}`);

        if (
          name === "next-auth.session-token" ||
          name === "__Secure-next-auth.session-token"
        ) {
          const token = decodeURIComponent(value);
          console.log(
            "[NotificationSocket] Found session token:",
            token.substring(0, 20) + "..."
          );
          return token;
        }
      }

      console.warn("[NotificationSocket] No session token found in cookies");
      return null;
    };

    const sessionToken = getSessionToken();
    if (!sessionToken) {
      console.warn("[NotificationSocket] Cannot connect - no session token");
      return;
    }

    // Initialize socket connection with authentication
    console.log("[NotificationSocket] Initializing socket connection...");
    const socket = io({
      auth: {
        sessionToken,
      },
      // Add these options for better debugging
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"], // Try both transports
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      console.log(
        "[NotificationSocket] ✅ Socket connected! Socket ID:",
        socket.id
      );
    });

    socket.on("connect_error", (error) => {
      console.error(
        "[NotificationSocket] ❌ Socket connection error:",
        error.message
      );
      console.error(
        "[NotificationSocket] Error type:",
        "type" in error && error.type
      );
      console.error("[NotificationSocket] Full error:", error);

      // If authentication fails, the session might be invalid
      if (
        error.message.includes("Authentication failed") ||
        error.message.includes("Invalid or expired session")
      ) {
        console.log(
          "[NotificationSocket] Authentication issue detected, refreshing router"
        );
        // Trigger a session refresh
        router.refresh();
      }
    });

    // Handle new notifications
    socket.on("new-notification", (notification: Notification) => {
      console.log(
        "[NotificationSocket] 🔔 Received new notification:",
        notification
      );

      // Play sound
      playNotificationSound();

      // Show toast notification
      toast(notification.title, {
        description: notification.metadata?.message,
        action: {
          label: "View",
          onClick: () => {
            router.push("/notifications");
          },
        },
      });

      // Call the callback if provided
      if (onNotification) {
        onNotification(notification);
      }

      // Refresh the router to update the notification count in the navbar
      router.refresh();
    });

    socket.on("disconnect", (reason) => {
      console.log("[NotificationSocket] Socket disconnected. Reason:", reason);

      // Handle reconnection for certain disconnect reasons
      if (reason === "io server disconnect") {
        // The server forcefully disconnected, likely due to auth issues
        console.log(
          "[NotificationSocket] Server initiated disconnect, refreshing router"
        );
        router.refresh();
      }
    });

    // Log all events for debugging
    socket.onAny((eventName, ...args) => {
      console.log(`[NotificationSocket] Event received: ${eventName}`, args);
    });

    // Cleanup on unmount or session change
    return () => {
      console.log("[NotificationSocket] Cleaning up socket connection");
      if (socket.connected) {
        socket.disconnect();
      }
      socketRef.current = null;
    };
  }, [
    session?.user?.id,
    status,
    router,
    onNotification,
    playNotificationSound,
  ]);

  return {
    isConnected: socketRef.current?.connected ?? false,
    socket: socketRef.current,
  };
}
