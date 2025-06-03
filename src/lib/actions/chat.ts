"use server";

import { uploadFileToCloudinary } from "../actions";
import { prisma } from "../prisma";
import { Chat, OrderDetails, UploadPreset } from "../types";
import { me } from "./auth";

export async function getOrderDetails(
  orderId: string
): Promise<OrderDetails | null> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        createdAt: true,
        deadline: true,
        package: {
          select: {
            title: true,
            price: true,
          },
        },
      },
    });

    return order;
  } catch (error) {
    console.error("Error fetching order details:", error);
    return null;
  }
}



export const getChatByOrderId = async (
  orderId: string
): Promise<Chat | null> => {
  const currentUser = await me();

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const chat = await prisma.chat.findUnique({
    where: {
      orderId,
    },
    select: {
      id: true,
      buyer: {
        select: {
          id: true,
          username: true,
          avatar: true,
          firstName: true,
          lastName: true,
        },
      },
      seller: {
        select: {
          id: true,
          username: true,
          avatar: true,
          firstName: true,
          lastName: true,
        },
      },
      messages: {
        select: {
          id: true,
          type: true,
          readBy: {
            select: {
              id: true,
            },
          },
          systemContent: {
            select: {
              type: true,
              content: true,
            },
          },
          textContent: {
            select: {
              text: true,
              userMessage: {
                select: {
                  userId: true,
                },
              },
            },
          },
          mediaContent: {
            select: {
              files: {
                select: {
                  url: true,
                },
              },
              userMessage: {
                select: {
                  userId: true,
                },
              },
            },
          },
          createdAt: true,
        },
      },
    },
  });

  if (!chat) {
    return null;
  }

  return {
    ...chat,
    messages: chat.messages.map((ms) => ({
      id: ms.id,
      createdAt: ms.createdAt,
      isRead: ms.readBy.some((user) => user.id === currentUser.id),
      type: ms.type,
      content:
        ms.type === "TEXT"
          ? {
              text: ms.textContent?.text || "",
            }
          : ms.type === "MEDIA"
            ? {
                urls: ms.mediaContent?.files.map((url) => url.url) || [],
              }
            : {
                type: ms.systemContent?.type,
                content: ms.systemContent?.content || "",
              },
      senderId:
        ms.textContent?.userMessage.userId ||
        ms.mediaContent?.userMessage.userId ||
        null,
    })),
  } as Chat;
};
