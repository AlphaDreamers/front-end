"use server";

import { prisma } from "@/lib/prisma";
import { me } from "./auth";
import { Prisma } from "@prisma/client";
import {
  Notification,
  NotificationMetadata,
  NotificationFilters,
  NotificationPaginationOptions,
} from "@/lib/types";

// Helper function to parse metadata from description field
function parseNotificationMetadata(description: string): NotificationMetadata {
  try {
    return JSON.parse(description);
  } catch {
    return {};
  }
}

// Helper function to serialize metadata to description field
function serializeNotificationMetadata(metadata: NotificationMetadata): string {
  return JSON.stringify(metadata);
}

// Get notifications with filtering and pagination
export async function getNotifications(
  filters: NotificationFilters = {},
  pagination: NotificationPaginationOptions = { page: 1, limit: 10 }
): Promise<{ notifications: Notification[]; total: number }> {
  const { user } = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  const where: Prisma.NotificationWhereInput = {
    recipientId: user.id,
  };

  // Apply filters
  if (filters.type && filters.type.length > 0) {
    where.type = { in: filters.type };
  }

  if (filters.isRead !== undefined) {
    where.isRead = filters.isRead;
  }

  if (filters.dateRange) {
    where.createdAt = {
      gte: filters.dateRange.from,
      lte: filters.dateRange.to,
    };
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  // Calculate skip for pagination
  const skip = (pagination.page - 1) * pagination.limit;

  // Get notifications and total count in parallel
  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: pagination.limit,
      orderBy: {
        [pagination.orderBy || "createdAt"]:
          pagination.orderDirection || "desc",
      },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        isRead: true,
        recipientId: true,
        createdAt: true,
      },
    }),
    prisma.notification.count({ where }),
  ]);

  // Transform notifications to include parsed metadata
  const transformedNotifications: Notification[] = notifications.map(
    (notification) => ({
      ...notification,
      metadata: parseNotificationMetadata(notification.description),
    })
  );

  return { notifications: transformedNotifications, total };
}

// Get unread notification count
export async function getUnreadNotificationCount(): Promise<number> {
  const { user } = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  return await prisma.notification.count({
    where: {
      recipientId: user.id,
      isRead: false,
    },
  });
}

// Mark notifications as read
export async function markNotificationsAsRead(
  notificationIds: string[]
): Promise<void> {
  const { user } = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      recipientId: user.id, // Ensure user owns these notifications
    },
    data: {
      isRead: true,
    },
  });
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<void> {
  const { user } = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  await prisma.notification.updateMany({
    where: {
      recipientId: user.id,
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
  const { user } = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  await prisma.notification.deleteMany({
    where: {
      id: { in: notificationIds },
      recipientId: user.id, // Ensure user owns these notifications
    },
  });
}

// Delete all read notifications
export async function deleteAllReadNotifications(): Promise<void> {
  const { user } = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  await prisma.notification.deleteMany({
    where: {
      recipientId: user.id,
      isRead: true,
    },
  });
}

// Create a notification (for internal use)
export async function createNotification(
  recipientId: string,
  type: Prisma.NotificationType,
  title: string,
  metadata: NotificationMetadata = {}
): Promise<void> {
  await prisma.notification.create({
    data: {
      recipientId,
      type,
      title,
      description: serializeNotificationMetadata(metadata),
      isRead: false,
    },
  });
}

// Example notification creators for different types
export async function createOrderNotification(
  recipientId: string,
  orderId: string,
  title: string,
  status: string
): Promise<void> {
  await createNotification(recipientId, "ORDER_UPDATE", title, {
    orderId,
    message: `Your order status has been updated to: ${status}`,
  });
}

export async function createReviewNotification(
  recipientId: string,
  reviewData: {
    reviewId: string;
    gigId: string;
    rating: number;
    transactionId: string;
  }
): Promise<void> {
  await createNotification(
    recipientId,
    "REVIEW",
    `New ${reviewData.rating}-star review received`,
    reviewData
  );
}

export async function createPaymentNotification(
  recipientId: string,
  paymentData: {
    paymentId: string;
    orderId?: string;
    amount: number;
    transactionId: string;
  }
): Promise<void> {
  await createNotification(
    recipientId,
    "PAYMENT",
    `Payment of ${paymentData.amount} SOL received`,
    paymentData
  );
}

export async function createMessageNotification(
  recipientId: string,
  messageData: {
    orderId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
  }
): Promise<void> {
  await createNotification(
    recipientId,
    "MESSAGE",
    `New message from ${messageData.senderName}`,
    messageData
  );
}

export async function createSystemNotification(
  recipientId: string,
  title: string,
  systemData: {
    message: string;
    articleId?: string;
  }
): Promise<void> {
  await createNotification(recipientId, "SYSTEM", title, systemData);
}
