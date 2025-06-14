"use server";

import { prisma } from "@/lib/prisma";
import { ChatData, Message } from "@/lib/types";
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
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
        },
      },
      seller: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
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
      name: `${otherUserData.firstName} ${otherUserData.lastName}`,
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
