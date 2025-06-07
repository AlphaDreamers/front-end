// src/lib/types/notifications.ts

import { NotificationType as PrismaNotificationType } from "@prisma/client";

// Base notification type that matches the Prisma schema
export interface BaseNotification {
  id: string;
  type: PrismaNotificationType;
  title: string;
  description: string;
  isRead: boolean;
  recipientId: string;
  createdAt: Date;
}

// Extended notification type with metadata stored in description field as JSON
export interface NotificationMetadata {
  reviewId?: string;
  gigId?: string;
  orderId?: string;
  paymentId?: string;
  transactionId?: string;
  rating?: number;
  amount?: number;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  articleId?: string;
  message?: string;
}

// Combined notification type used in the UI
export interface Notification extends BaseNotification {
  metadata: NotificationMetadata;
}

// Filter options for notifications
export interface NotificationFilters {
  type?: PrismaNotificationType[];
  isRead?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}

// Pagination options
export interface NotificationPaginationOptions {
  page: number;
  limit: number;
  orderBy?: "createdAt" | "type";
  orderDirection?: "asc" | "desc";
}
