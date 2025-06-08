import * as icons from "lucide-react";

export type LucideIconName = keyof typeof icons;

export type Color = "purple" | "green" | "gray" | "blue" | "green" | "yellow";

type User = {
  id: string;
  username: string;
  avatar: string | null;
  firstName: string;
  lastName: string;
  publicKey: string | null;
  badge: {
    title: string;
  } | null;
};

export type Chat = {
  id: string;
  buyer: User;
  seller: User;
  messages: Message[];
};

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

export interface Category {
  id: string;
  label: string;
  gigsCnt: number;
  icon: LucideIconName;
  color: Color;
}

export interface Gig {
  id: string;
  seller: {
    id: string;
    username: string;
    avatar: string | null;
    firstName: string;
    lastName: string;
    publicKey: string | null;
    badge: {
      title: string;
      tier: string;
    } | null;
  };
  image: string;
  startsAtPrice: number;
  tags: {
    id: string;
    label: string;
  }[];
  title: string;
  description: string;
  averageRating: number;
  ratingCount: number;
  isBookmarked: boolean;
}

interface GigPackage {
  id: string;
  title: string;
  price: number;
  orderCnt: number;
}

export interface DashboardGig {
  id: string;
  image: string;
  startsAtPrice: number;
  title: string;
  description: string;
  averageRating: number;
  ratingCount: number;
  category: Category;
  packages: GigPackage[];
  totalOrders: number;
}

export type MessageStatus = "sent" | "delivered" | "failed";

export type Message = {
  id: string;
  createdAt: Date;
} & (
  | {
      senderId: string;
      status: MessageStatus;
      type: "TEXT";
      content: { text: string };
      sender: {
        avatar: string | null;
        firstName: string;
        lastName: string;
        username: string;
      };
    }
  | {
      senderId: string;
      status: MessageStatus;
      type: "MEDIA";
      content: { urls: string[] };
    }
  | {
      senderId: null;
      status: null;
      type: "SYSTEM";
      content: { type: string; content: string };
    }
);

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
  key: string;
  value: string;
};

export interface ProfileUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  banner: string | null;
  headline: string | null;
  bio: string | null;
  isKycVerified: boolean;
  joinedAt: Date;
  featuredBadge: {
    title: string;
    tier: string;
  } | null;
  skills: {
    id: string;
    title: string;
    level: number;
  }[];
  socialLinks: {
    id: string;
    type: string;
    url: string;
  }[];
  stats: {
    totalGigs: number;
    averageRating: number;
    totalReviews: number;
    completedOrders: number;
  };
}

export interface ProfilePortfolioItem {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
}

export interface ProfileReview {
  id: string;
  rating: number;
  title: string;
  description: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  } | null;
  createdAt: Date;
  sellerResponse: string | null;
  sellerRespondedAt: Date | null;
}

// types/reviews.ts

// Base Review type that represents the common structure
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

// Dashboard Review extends Review with seller response capabilities and order/gig info
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

// Testimonial type for homepage testimonials
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
