"use server";

import { prisma } from "@/lib/prisma";
import { NotificationType, Prisma } from "@prisma/client";
import { Notification, NotificationMetadata } from "@/lib/types";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";

export async function getNotifications(
  args: Omit<Prisma.NotificationFindManyArgs, "select" | "include"> = {}
): Promise<Notification[]> {
  const session = await auth();
  if (!session) {
    throw new Error("User is not authenticated");
  }
  // Get notifications and total count in parallel
  const notifications = await prisma.notification.findMany({
    ...args,
    select: {
      id: true,
      type: true,
      title: true,
      isRead: true,
      recipientId: true,
      createdAt: true,
      metadata: true,
    },
  });

  return notifications.map((notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    isRead: notification.isRead,
    recipientId: notification.recipientId,
    createdAt: notification.createdAt,
    metadata: notification.metadata as NotificationMetadata<
      typeof notification.type
    >,
  }));
}

export async function getNotificationCnt(
  args: Omit<Prisma.NotificationCountArgs, "select" | "include"> = {}
): Promise<number> {
  const session = await auth();
  if (!session) {
    throw new Error("User is not authenticated");
  }

  const count = await prisma.notification.count({
    ...args,
    where: {
      ...args.where,
      recipientId: session.user.id,
    },
  });
  return count;
}

export async function markNotificationsAsRead(
  notificationIds: string[]
): Promise<void> {
  const session = await auth();
  if (!session) {
    throw new Error("User is not authenticated");
  }

  await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      recipientId: session.user.id,
    },
    data: {
      isRead: true,
    },
  });

  revalidatePath("/dashboard//notifications");
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const session = await auth();
  if (!session) {
    throw new Error("User is not authenticated");
  }

  await prisma.notification.updateMany({
    where: {
      recipientId: session.user.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
  revalidatePath("/dashboard//notifications");
}

// Delete notifications
export async function deleteNotifications(
  notificationIds: string[]
): Promise<void> {
  const session = await auth();
  if (!session) {
    throw new Error("User is not authenticated");
  }

  await prisma.notification.deleteMany({
    where: {
      id: { in: notificationIds },
      recipientId: session.user.id,
    },
  });

  revalidatePath("/dashboard/notifications");
}

type NotificationParams = {
  ORDER_UPDATE: { orderId: string; status?: string };
  REVIEW: {
    reviewId: string;
    gigId: string;
    rating: number;
    transactionId: string;
  };
  MESSAGE: {
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    orderId: string;
  };
  PAYMENT: { paymentId: string; amount: number; transactionId: string };
};

export async function createNotification<T extends NotificationType>(
  recipientId: string,
  type: T,
  params: NotificationParams[T],
  message?: string
) {
  let title: string;
  let metadata: Record<string, unknown> = {};

  switch (type) {
    case "ORDER_UPDATE": {
      const { orderId, status } = params as NotificationParams["ORDER_UPDATE"];
      title = status
        ? `Order #${orderId} updated to ${status}`
        : `Update for Order #${orderId}`;
      metadata = { orderId };
      if (status) metadata.status = status;
      break;
    }

    case "REVIEW": {
      const { reviewId, gigId, rating, transactionId } =
        params as NotificationParams["REVIEW"];
      title = `New review received for gig #${gigId}`;
      metadata = { reviewId, gigId, rating, transactionId };
      break;
    }

    case "MESSAGE": {
      const {
        senderId,
        senderName,
        senderAvatar,
        orderId: messageOrderId,
      } = params as NotificationParams["MESSAGE"];
      title = `New message from ${senderName}`;
      metadata = {
        senderId,
        senderName,
        senderAvatar,
        orderId: messageOrderId,
      };
      break;
    }

    case "PAYMENT": {
      const { paymentId, amount, transactionId } =
        params as NotificationParams["PAYMENT"];
      title = `Payment of ${amount} SOL processed`;
      metadata = { paymentId, amount, transactionId };
      break;
    }

    default:
      throw new Error(`Unsupported notification type: ${type}`);
  }

  // Add optional message to metadata for description
  if (message) {
    metadata.message = message;
  }

  const notification = await prisma.notification.create({
    data: {
      type,
      title,
      metadata: JSON.stringify(metadata),
      recipientId,
      isRead: false,
    },
  });

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId: recipientId },
  });
  const now = new Date();
  const userTime = new Date(
    now.toLocaleString("en-US", { timeZone: preferences?.timezone || "UTC" })
  );
  const currentMinutes = userTime.getHours() * 60 + userTime.getMinutes();

  let isOutsideQuietHours = true;

  if (
    preferences?.quietHoursEnabled &&
    preferences.quietHoursStartTime &&
    preferences.quietHoursEndTime
  ) {
    const [startH, startM] = preferences.quietHoursStartTime
      .split(":")
      .map(Number);
    const [endH, endM] = preferences.quietHoursEndTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (startMinutes < endMinutes) {
      // Quiet hours same day (e.g., 22:00 to 08:00 is invalid in this format)
      isOutsideQuietHours = !(
        currentMinutes >= startMinutes && currentMinutes < endMinutes
      );
    } else {
      // Quiet hours span midnight (e.g., 22:00 to 08:00)
      isOutsideQuietHours =
        currentMinutes >= endMinutes && currentMinutes < startMinutes;
    }
  }

  const isInAppEnabled = (() => {
    switch (type) {
      case "ORDER_UPDATE":
        return preferences?.ordersEnabled && preferences.ordersInApp;
      case "REVIEW":
        return preferences?.reviewsEnabled && preferences.reviewsInApp;
      case "MESSAGE":
        return preferences?.messagesEnabled && preferences.messagesInApp;
      case "PAYMENT":
        return true; // Assuming no preference is stored for payments, always notify
      default:
        return false;
    }
  })();

  if (isInAppEnabled && isOutsideQuietHours) {
    try {
      const io = global.io;

      if (io) {
        io.to(`user:${recipientId}`).emit("new-notification", {
          id: notification.id,
          type: notification.type,
          title: notification.title,
          isRead: notification.isRead,
          recipientId: notification.recipientId,
          createdAt: notification.createdAt,
          metadata: metadata,
        });

        console.log(`Notification pushed to user ${recipientId} via Socket.io`);
      } else {
        console.warn(
          "Socket.io instance not available - notification saved but not pushed in real-time"
        );
      }
    } catch (error) {
      console.error("Error pushing notification via Socket.io:", error);
    }
  }
}
