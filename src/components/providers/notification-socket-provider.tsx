"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import io from "socket.io-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function NotificationSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.id) return;

    const socket = io({
      auth: {
        userId: session.user.id,
      },
    });

    socket.on("new-notification", (notification) => {
      // Play sound
      const audio = new Audio("/notification-sound.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {});

      // Show toast
      toast(notification.title, {
        description: notification.metadata?.message,
      });

      update({
        unreadNotifications: session.user.unreadNotifications + 1,
      });

      // Update UI
      router.refresh();
    });

    return () => {
      socket.disconnect();
    };
  }, [router, session?.user.id, session?.user.unreadNotifications, update]);

  return <>{children}</>;
}
