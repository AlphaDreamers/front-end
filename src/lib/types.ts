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

export interface Testimonial {
  id: string;
  author: User;
  content: string;
  rating: number;
}

interface Tag {
  id: string;
  label: string;
}

export interface Gig {
  id: string;
  seller: User;
  image: string;
  startsAtPrice: number;
  tags: Tag[];
  title: string;
  description: string;
  averageRating: number;
  ratingCount: number;
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

export type MessageStatus =
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";

export type Message =
  | {
      id: string;
      senderId: string | null;
      status?: MessageStatus;
      createdAt: Date;
      isRead: boolean;
      type: "TEXT";
      content: { text: string };
    }
  | {
      id: string;
      senderId: string | null;
      status?: MessageStatus;
      createdAt: Date;
      isRead: boolean;
      type: "MEDIA";
      content: { urls: string[] };
    }
  | {
      id: string;
      senderId: string | null;
      status?: MessageStatus;
      createdAt: Date;
      isRead: boolean;
      type: "SYSTEM";
      content: { type: string; content: string };
    };

export interface ChatUser {
  id: string;
  name: string;
  avatar: string | null;
  role?: "buyer" | "seller";
}

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
  id: string;
  title: string;
};

export interface Review {
  id: string;
  gigId: string;
  gigTitle: string;
  author: User;
  rating: number;
  comment: string;
  createdAt: string;
  solanaTx: string;
  response?: string;
}
