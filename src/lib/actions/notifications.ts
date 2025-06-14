"use server";

import { prisma } from "@/lib/prisma";
import { NotificationType, Prisma } from "@prisma/client";
import { Notification } from "@/lib/types";
import { auth } from "../auth";

// Get notifications with filtering and pagination
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
    metadata: notification.metadata as Notification["metadata"],
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
  PAYMENT: { paymentId: string; amount: string; transactionId: string };
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

  await prisma.notification.create({
    data: {
      type,
      title,
      metadata: JSON.stringify(metadata),
      recipientId,
      isRead: false,
    },
  });
}
