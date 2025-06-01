import { SystemContentType } from "@prisma/client";
import * as icons from "lucide-react";

export type LucideIconName = keyof typeof icons;

export type Color = "purple" | "green" | "gray" | "blue" | "green" | "yellow";

export type Message = { id: string } & (
  | {
      createdAt: Date;
      isRead: boolean;
      type: "TEXT";
      content: {
        text: string;
      };
      senderId: string;
    }
  | {
      createdAt: Date;
      isRead: boolean;
      type: "MEDIA";
      content: {
        urls: string[];
      };
      senderId: string;
    }
  | {
      createdAt: Date;
      isRead: boolean;
      type: "SYSTEM";
      content: {
        type: SystemContentType;
        content: string;
      };
      senderId: null;
    }
);

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
