export interface UserSettings {
  timezone: string;
  language: string;
  ordersEnabled: boolean;
  ordersEmail: boolean;
  ordersInApp: boolean;
  messagesEnabled: boolean;
  messagesEmail: boolean;
  messagesInApp: boolean;
  reviewsEnabled: boolean;
  reviewsEmail: boolean;
  reviewsInApp: boolean;
  quietHoursEnabled: boolean;
  quietHoursStartTime: null | string; // hh:mm format
  quietHoursEndTime: null | string; // hh:mm format
}
