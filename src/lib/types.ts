import { SystemContentType } from "@prisma/client";

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

export type Chat = {
  id: string;
  buyer: {
    id: string;
    username: string;
    avatar: string | null;
    firstName: string;
    lastName: string;
  };
  seller: {
    id: string;
    username: string;
    avatar: string | null;
    firstName: string;
    lastName: string;
  };
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
