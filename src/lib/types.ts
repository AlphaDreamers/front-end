import { OrderStatus, SocialLinkType, Tier } from "@prisma/client";
import * as icons from "lucide-react";
import { NotificationType as PrismaNotificationType } from "@prisma/client";

export type LucideIconName = keyof typeof icons;

export type Color = "purple" | "green" | "gray" | "blue" | "green" | "yellow";

export interface JWTToken {
  id: string;
}

export const CLODUINARY_CONFIG = {
  user_avatars: "users/avatars",
  user_banners: "users/banners",
  chat_media: "chats/media",
  gig_images: "gigs/images",
};

export type UploadPreset = keyof typeof CLODUINARY_CONFIG;

export interface OrderDetails {
  id: string;
  status: string;
  createdAt: Date;
  deadline: Date;
  package: {
    title: string;
    price: number;
  };
}

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
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  } | null;
}

export interface DashboardReview extends Review {
  sellerResponse: string | null;
  sellerRespondedAt: Date | null;
  order: {
    id: string;
  };
  gig: {
    id: string;
    title: string;
  };
}

export interface Testimonial {
  id: string;
  rating: number;
  content: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

export interface ReviewStats {
  total: number;
  average: number;
  distribution: Record<number, number>;
}

export interface GigSearchParams {
  q?: string;
  page?: string;
  category?: string;
  "price-min"?: string;
  "price-max"?: string;
  rating?: string;
  dateAdded?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  badge: {
    title: string;
    tier: string;
    color: string;
    icon: LucideIconName;
  } | null;
  avatar: string | null;
}

export interface ReviewFilterParams {
  rating?: string;
  sort?: string;
  skip?: number;
  take?: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface FaqPageSearchParams {
  q?: string;
  page?: string;
}

export interface DetailedGigPackage {
  id: string;
  price: number;
  title: string;
  deliveryTime: number;
  revisions: number;
  features: PackageFeature[];
}

interface BaseGig {
  id: string;
  image: string;
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
  seller: {
    id: string;
    username: string;
    avatar: string | null;
    firstName: string;
    lastName: string;
    badge: {
      title: string;
      tier: string;
    } | null;
  };
  isBookmarked: boolean;
  tags: {
    id: string;
    label: string;
  }[];
}

interface PackageFeature {
  id: string;
  label: string;
  isIncluded: boolean;
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

export interface DetailedGig {
  id: string;
  title: string;
  description: string;
  images: string[];
  packages: DetailedGigPackage[];
  seller: {
    firstName: string;
    lastName: string;
    username: string;
    avatar: string | null;
    badge: {
      tier: Tier;
      title: string;
      icon: LucideIconName;
      color: string;
    } | null;
  };
  avgRating: number;
  reviewCount: number;
  reviews: Review[];
  faqs: {
    id: string;
    question: string;
    answer: string;
  }[];
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
  type: PrismaNotificationType;
  title: string;
  description: string;
  isRead: boolean;
  recipientId: string;
  createdAt: Date;
}

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

export interface Notification extends BaseNotification {
  metadata: NotificationMetadata;
}

export interface NotificationFilters {
  type?: PrismaNotificationType[];
  isRead?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
}

export interface NotificationPaginationOptions {
  page: number;
  limit: number;
  orderBy?: "createdAt" | "type";
  orderDirection?: "asc" | "desc";
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

export interface UserProfileFields {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string | null;
  banner: string | null;
  headline: string | null;
  bio: string | null;
  isKycVerified: boolean;
  skills?: { id: string }[];
  socialLinks?: { id: string }[];
  portfolioItems?: { id: string }[];
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

export interface DashboardStats {
  totalBadges: number;
  earnedBadges: number;
  totalAchievements: number;
  featuredAchievements: number;
  verificationProgress: number;
}

export interface Transaction {
  txId: string;
  amount: number;
  date: Date;
  senderPublicKey: string;
  receiverPublicKey: string;
}

export interface DetailedWallet {
  publicKey: string;
  name: string;
  isMain: boolean;
  createdAt: Date;
  transactions: Transaction[];
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
  primaryImage: string;
  images: string[];
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

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface ChatData {
  id: string;
  currentUserId: string;
  otherUser: ChatUser;
  orderId: string;
  messages: Message[];
}

export interface ChatContextValue {
  messages: Message[];
  sendMessage: (content: string, files?: File[]) => Promise<void>;
  isConnected: boolean;
  currentUserId: string;
  otherUser: ChatUser;
}

// Socket event types for type safety
export interface SocketEvents {
  // Client to server
  "join-chat": { chatId: string; userId: string };
  "send-message": { message: Omit<Message, "createdAt">; chatId: string };

  // Server to client
  "new-message": Message;
  "message-saved": { tempId: string; savedMessage: Message };
  "message-failed": { tempId: string };
  connect: void;
  disconnect: void;
  error: string;
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
  chat: OrderChat | null;
  transaction: Transaction | null;
  isOverdue: boolean;
  daysUntilDeadline: number;
  formattedDeadline: string;
  reviewId: string | null;
}

export interface OrderFilters {
  role: "buyer" | "seller";
  status?: OrderStatus[];
  deadline?: "upcoming" | "overdue" | "all";
  priceRange?: {
    min: number;
    max: number;
  };
  search?: string;
}

export interface OrderCardAction {
  type: "button" | "link" | "dialog";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?:
    | "default"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost"
    | "link";
  onClick?: () => void;
  href?: string;
  dialog?: React.ReactNode;
}

export interface OrderVerificationProgress {
  badgeTitle: string;
  currentProgress: number;
  totalRequired: number;
  contributesToBadge: boolean;
}
