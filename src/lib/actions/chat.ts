"use server";

import { prisma } from "@/lib/prisma";
import { ChatData, Color, LucideIconName, Message } from "@/lib/types";
import { auth } from "../auth";

export async function getChatByOrderId(
  orderId: string
): Promise<ChatData | null> {
  const session = await auth();
  if (!session) {
    throw new Error("User not authenticated");
  }

  // Fetch chat with messages
  const chat = await prisma.chat.findUnique({
    where: { orderId },
    select: {
      id: true,
      buyerId: true,
      sellerId: true,
      buyer: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          badgeProgress: {
            where: {
              isFeatured: true,
            },
            select: {
              highestTier: true,
              badge: {
                select: {
                  title: true,
                  color: true,
                  icon: true,
                },
              },
            },
          },
        },
      },
      seller: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          badgeProgress: {
            where: {
              isFeatured: true,
            },
            select: {
              highestTier: true,
              badge: {
                select: {
                  title: true,
                  color: true,
                  icon: true,
                },
              },
            },
          },
        },
      },
      messages: {
        select: {
          id: true,
          type: true,
          status: true,
          createdAt: true,
          textContent: {
            select: {
              text: true,
              userMessage: {
                select: { userId: true },
              },
            },
          },
          mediaContent: {
            select: {
              files: {
                select: { url: true },
              },
              userMessage: {
                select: { userId: true },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!chat) {
    return null;
  }

  // Verify user has access to this chat
  if (chat.buyerId !== session.user.id && chat.sellerId !== session.user.id) {
    throw new Error("Access denied to this chat");
  }

  // Determine which user is the "other" user
  const isBuyer = session.user.id === chat.buyerId;
  const otherUserData = isBuyer ? chat.seller : chat.buyer;

  // Transform messages to our simplified format
  const messages: Message[] = chat.messages.map((msg) => ({
    id: msg.id,
    chatId: chat.id,
    senderId:
      msg.textContent?.userMessage.userId ||
      msg.mediaContent?.userMessage.userId ||
      "",
    content: msg.textContent?.text || "",
    mediaUrls: msg.mediaContent?.files.map((f) => f.url) || [],
    status: mapMessageStatus(msg.status),
    createdAt: msg.createdAt,
  }));

  return {
    id: chat.id,
    currentUserId: session.user.id,
    otherUser: {
      id: otherUserData.id,
      username: otherUserData.username,
      firstName: otherUserData.firstName,
      lastName: otherUserData.lastName,
      badge:
        otherUserData.badgeProgress.length > 0
          ? {
              title: otherUserData.badgeProgress[0].badge.title,
              tier: otherUserData.badgeProgress[0].highestTier,
              color: otherUserData.badgeProgress[0].badge.color as Color,
              icon: otherUserData.badgeProgress[0].badge.icon as LucideIconName,
            }
          : undefined,
      avatar: otherUserData.avatar || undefined,
    },
    orderId,
    messages,
  };
}

// Helper function to map Prisma MessageStatus to our simplified status
function mapMessageStatus(status: string): "sending" | "sent" | "failed" {
  switch (status) {
    case "SENDING":
      return "sending";
    case "FAILED":
      return "failed";
    default:
      return "sent";
  }
}
