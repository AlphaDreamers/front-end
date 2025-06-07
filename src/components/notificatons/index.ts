// src/components/notifications/index.ts

export { NotificationCard } from "./notification-card";
export {
  NotificationList,
  NotificationListSkeleton,
} from "./notification-list";
export { NotificationFilters } from "./notification-filters";

// Re-export types for convenience
export type {
  Notification,
  NotificationMetadata,
  NotificationFilters as NotificationFiltersType,
} from "@/lib/types/notifications";
