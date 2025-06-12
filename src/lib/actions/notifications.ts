"use server";

import { prisma } from "@/lib/prisma";
import { me } from "./auth";
import { NotificationType, Prisma } from "@prisma/client";
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

// Get notifications with filtering and pagination
export async function getNotifications(
  filters: NotificationFilters = {},
  pagination: NotificationPaginationOptions = { page: 1, limit: 10 }
): Promise<{ notifications: Notification[]; total: number }> {
  const { user } = await auth();
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

// Mark notifications as read
export async function markNotificationsAsRead(
  notificationIds: string[]
): Promise<void> {
  const { user } = await auth();
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
  const { user } = await auth();
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
  const { user } = await auth();
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

export const createNotification = async (
  recipientId: string,
  title: string,
  description: string,
  metadata:
    | {
        type: "ORDER_UPDATE";
        orderId: string;
      }
    | {
        type: "PAYMENT";
        txId: string;
      }
) => {
  await prisma.notification.create({
    data: {
      recipientId,
      type: metadata.type as NotificationType,
      title,
      description,
      metadata: {
        toJSON:
          metadata.type === "ORDER_UPDATE"
            ? { orderId: metadata.orderId }
            : metadata.type === "PAYMENT"
              ? { txId: metadata.txId }
              : null,
      },
    },
  });
};
