import {
  MediaType,
  NotificationType,
  OrderStatus,
  SocialLinkType,
  Tier,
} from "@prisma/client";
import * as icons from "lucide-react";
import { REVIEW_FILTERS_CONFIG } from "./utils";

export interface DetailedGig {
  id: string;
  title: string;
  description: string;
  media: Media[]; // Updated from images: string[]
  packages: DetailedGigPackage[];
  seller: User;
  avgRating: number;
  reviewCount: number;
  faqs: {
    id: string;
    question: string;
    answer: string;
  }[];
}

export interface Media {
  id: string;
  url: string; // Cloudinary or external URL
  type: MediaType; // Using the Prisma enum
}

export interface DetailedGigPackage {
  id: string;
  price: number;
  title: string;
  deliveryTime: number;
  revisions: number;
  features: PackageFeature[];
}

interface PackageFeature {
  id: string;
  label: string;
  isIncluded: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  badge?: {
    title: string;
    tier: string;
    color: Color;
    icon: LucideIconName;
  };
  avatar?: string;
}

export type LucideIconName = keyof typeof icons;

export type Color = "purple" | "green" | "gray" | "blue" | "green" | "yellow";

export const CLOUDINARY_CONFIG = {
  user_avatars: "users/avatars",
  user_banners: "users/banners",
  chat_media: "chats/media",
  gig_images: "gigs/images",
};

export type UploadPreset = keyof typeof CLOUDINARY_CONFIG;

export type KeyValuePair = {
  value: string;
  label: string;
};

export interface Review {
  id: string;
  rating: number;
  title: string;
  description: string;
  createdAt: Date;
  author: User;
  txId?: string;
  sellerResponse?: string;
  sellerRespondedAt?: Date;
}

export interface DashboardReview extends Review {
  order: {
    id: string;
  };
  gig: {
    id: string;
    title: string;
  };
}

export interface GigSearchParams {
  q?: string;
  page?: string;
  min_rating?: string;
  verified?: string;
  category?: string;
  price?: string;
  added_after?: string;
}

export interface GigSearchParams {
  q?: string;
  page?: string;
  verified?: string;
  category?: string;
  price?: string;
  added_after?: string;
  min_rating?: string;
}

export interface ReviewStats {
  total: number;
  average: number;
  distribution: Record<number, number>;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  badge?: {
    title: string;
    tier: string;
    color: Color;
    icon: LucideIconName;
  };
  avatar?: string;
}

export type ReviewSearchParams = Record<
  (typeof REVIEW_FILTERS_CONFIG)[number]["paramKey"],
  string
> & {
  q?: string;
  page?: string;
};

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface FaqPageSearchParams {
  q?: string;
  page?: string;
}

interface BaseGig {
  id: string;
  primaryImage?: string;
  startsAtPrice: number;
  title: string;
  description: string;
  averageRating: number;
  ratingCount: number;
  category: {
    id: string;
    label: string;
    icon: LucideIconName;
    color: Color;
  };
}

export interface Gig extends BaseGig {
  seller: User;
  isBookmarked: boolean;
  tags: {
    id: string;
    label: string;
  }[];
}

interface GigPackage {
  id: string;
  title: string;
  price: number;
  orderCnt: number;
}

export interface DashboardGig extends BaseGig {
  packages: GigPackage[];
  totalOrders: number;
}

export interface Category {
  id: string;
  label: string;
  gigsCnt: number;
  icon: LucideIconName;
  color: Color;
}

export interface BaseNotification {
  id: string;
  type: NotificationType;
  title: string;
  isRead: boolean;
  recipientId: string;
  createdAt: Date;
}

// Metadata types for each notification type
type NotificationMetadataMap = {
  ORDER_UPDATE: {
    orderId: string;
    status?: string;
    message?: string;
  };
  REVIEW: {
    reviewId: string;
    gigId: string;
    rating: number;
    transactionId: string;
    message?: string;
  };
  MESSAGE: {
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    orderId: string;
    message?: string;
  };
  PAYMENT: {
    paymentId: string;
    amount: string;
    transactionId: string;
    message?: string;
  };
  SYSTEM: {
    articleId?: string;
    message?: string;
  };
};

export type NotificationMetadata<
  T extends NotificationType = NotificationType,
> = T extends keyof NotificationMetadataMap
  ? NotificationMetadataMap[T]
  : never;

export interface Notification extends BaseNotification {
  metadata: NotificationMetadata<NotificationType>;
}

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
  quietHoursStartTime?: string; // hh:mm format
  quietHoursEndTime?: string; // hh:mm format
}

export interface BadgeWithProgress {
  id: string;
  title: string;
  description: string;
  icon: LucideIconName;
  color: Color;
  progress: number;
  progressCap: number;
  tier: Tier;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIconName;
  color: Color;
  tier: Tier;
  isFeatured: boolean;
  earnedAt: Date;
}

export interface Transaction {
  txId: string;
  amount: number;
  date: Date;
  senderPublicKey: string;
  receiverPublicKey: string;
}

export interface DetailedUser {
  email: string;
  id: string;
  gigCnt: number;
  gigs: Gig[];
  firstName: string;
  lastName: string;
  username: string;
  reviews: Review[];
  ratingCnt: number;
  avgRating: number;
  portfolioItemsCnt: number;
  portfolioItems: PortfolioItem[];
  socialLinks: SocialLink[];
  skills: UserSkill[];
  bio?: string;
  isKycVerified: boolean;
  banner?: string;
  avatar?: string;
  joinedAt: Date;
  isVerified: boolean;
  headline?: string;
  badge?: {
    id: string;
    icon: LucideIconName;
    color: Color;
    tier: Tier;
    title: string;
  };
  ordersCnt: number;
}
export interface PortfolioItem {
  id: string;
  primaryImage?: string;
  media: Media[];
  title: string;
  description?: string;
  url?: string;
}

export interface SocialLink {
  id: string;
  url: string;
  type: SocialLinkType;
}

interface UserSkill {
  id: string;
  level: number;
  title: string;
}

export type EncryptedWalletData = {
  encryptedPrivateKey: string;
  salt: string;
  iv: string;
};
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string; // Text content
  mediaUrls: string[]; // Array of Cloudinary URLs
  status: "sending" | "sent" | "failed";
  createdAt: Date;
}

export interface ChatData {
  id: string;
  currentUserId: string;
  otherUser: User;
  orderId: string;
  messages: Message[];
}

export interface OrderPackage {
  id: string;
  title: string;
  price: number;
  deliveryTime: number;
  gig: {
    id: string;
    title: string;
  };
}

export interface OrderChat {
  id: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  buyer: User;
  seller: User;
  package: OrderPackage;
  chat?: OrderChat;
  transaction?: Transaction;
  isOverdue: boolean;
  daysUntilDeadline: number;
  formattedDeadline: string;
  reviewId?: string;
  completedAt?: Date;
}
