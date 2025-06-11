"use server";

import { Prisma } from "@prisma/client";
import {
  Color,
  KeyValuePair,
  LucideIconName,
  Order,
  OrderFilters,
} from "../types";
import { prisma } from "../prisma";
import { me } from "./auth";
import { formatDistanceToNow } from "date-fns";
import { createNotification } from "./notifications";
import { revalidatePath } from "next/cache";

export const getKeyValueOrders = async (
  args: Omit<Prisma.OrderFindFirstArgs, "select">
): Promise<KeyValuePair[]> => {
  const orders = await prisma.order.findMany({
    ...args,
    select: {
      id: true,
      gig: {
        select: {
          title: true,
        },
      },
      package: {
        select: {
          title: true,
        },
      },
      createdAt: true,
    },
  });

  return orders.map((order) => ({
    value: order.id,
    label: `${order.gig?.title} - ${order.package.title} (${order.createdAt.toLocaleDateString()})`,
  }));
};

export const orderPackage = async (packageId: string) => {
  const { user } = await me();
  if (!user?.isVerified) throw new Error("User not authenticated");

  const gigPackage = await prisma.package.findUnique({
    where: { id: packageId },
    include: {
      gig: {
        select: {
          id: true,
          title: true,
          sellerId: true,
        },
      },
    },
  });

  if (!gigPackage) throw new Error("Package not found");

  await prisma.order.create({
    data: {
      status: "WAITING_FOR_PAYMENT",
      buyerId: user.id,
      sellerId: gigPackage.gig.sellerId,
      packageId: gigPackage.id,
      deadline: new Date(
        Date.now() + gigPackage.deliveryTime * 24 * 60 * 60 * 1000 // Convert delivery time to milliseconds
      ),
      gigId: gigPackage.gig.id,
      chat: {
        create: {
          buyerId: user.id,
          sellerId: gigPackage.gig.sellerId,
        },
      },
    },
  });
};

export const confirmPayment = async (orderId: string) => {
  const { user } = await me();
  if (!user?.isVerified) throw new Error("User not authenticated");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");
  if (order.buyerId !== user.id)
    throw new Error("You are not the buyer of this order");

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "IN_PROGRESS",
    },
  });

  return order;
};
export async function getOrders(
  args: Omit<Prisma.OrderFindManyArgs, "select" | "include">
): Promise<Order[]> {
  const { user } = await me();
  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const orders = await prisma.order.findMany({
    ...args,
    select: {
      id: true,
      status: true,
      deadline: true,
      createdAt: true,
      updatedAt: true,
      buyer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
          badgeProgress: {
            where: { isFeatured: true },
            select: {
              badge: {
                select: {
                  title: true,
                  color: true,
                  icon: true,
                },
              },
              highestTier: true,
            },
          },
        },
      },
      seller: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
          badgeProgress: {
            where: { isFeatured: true },
            select: {
              badge: {
                select: {
                  title: true,
                  color: true,
                  icon: true,
                },
              },
              highestTier: true,
            },
          },
          wallets: {
            where: { isMain: true },
            select: { publicKey: true },
          },
        },
      },
      package: {
        select: {
          id: true,
          title: true,
          price: true,
          deliveryTime: true,
          gig: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      chat: {
        select: { id: true },
      },
      transaction: {
        select: {
          txId: true,
          amount: true,
          senderPublicKey: true,
          receiverPublicKey: true,
          createdAt: true,
        },
      },
      gig: {
        select: {
          id: true,
          title: true,
        },
      },
      review: {
        select: {
          id: true,
        },
      },
    },
  });

  return orders.map((prismaOrder) => {
    const now = new Date();
    const deadline = new Date(prismaOrder.deadline);
    const isOverdue = isAfter(now, deadline);
    const daysUntilDeadline = differenceInDays(deadline, now);

    return {
      reviewId: prismaOrder.review?.id || null,
      id: prismaOrder.id,
      status: prismaOrder.status,
      deadline,
      createdAt: prismaOrder.createdAt,
      updatedAt: prismaOrder.updatedAt,

      buyer: {
        id: prismaOrder.buyer.id,
        firstName: prismaOrder.buyer.firstName,
        lastName: prismaOrder.buyer.lastName,
        username: prismaOrder.buyer.username,
        badge:
          prismaOrder.buyer.badgeProgress.length > 0
            ? {
                title: prismaOrder.buyer.badgeProgress[0].badge.title,
                tier: prismaOrder.buyer.badgeProgress[0].highestTier,
                color: prismaOrder.buyer.badgeProgress[0].badge.color as Color,
                icon: prismaOrder.buyer.badgeProgress[0].badge
                  .icon as LucideIconName,
              }
            : null,
        avatar: prismaOrder.buyer.avatar || null,
      },

      seller: {
        id: prismaOrder.seller.id,
        firstName: prismaOrder.seller.firstName,
        lastName: prismaOrder.seller.lastName,
        username: prismaOrder.seller.username,
        badge:
          prismaOrder.seller.badgeProgress.length > 0
            ? {
                title: prismaOrder.seller.badgeProgress[0].badge.title,
                tier: prismaOrder.seller.badgeProgress[0].highestTier,
                color: prismaOrder.seller.badgeProgress[0].badge.color as Color,
                icon: prismaOrder.seller.badgeProgress[0].badge
                  .icon as LucideIconName,
              }
            : null,
        avatar: prismaOrder.seller.avatar || null,
      },

      package: {
        id: prismaOrder.package.id,
        title: prismaOrder.package.title,
        price: prismaOrder.package.price,
        deliveryTime: prismaOrder.package.deliveryTime,
        gig: {
          id: prismaOrder.gig?.id || prismaOrder.package.gig.id,
          title: prismaOrder.gig?.title || prismaOrder.package.gig.title,
        },
      },

      chat: prismaOrder.chat ? { id: prismaOrder.chat.id } : null,
      transaction: prismaOrder.transaction
        ? {
            txId: prismaOrder.transaction.txId,
            amount: prismaOrder.transaction.amount,
            date: prismaOrder.transaction.createdAt,
            senderPublicKey: prismaOrder.transaction.senderPublicKey,
            receiverPublicKey: prismaOrder.transaction.receiverPublicKey,
          }
        : null,

      isOverdue,
      daysUntilDeadline,
      formattedDeadline: isOverdue
        ? `Overdue by ${formatDistanceToNow(deadline)}`
        : `Due ${formatDistanceToNow(deadline, { addSuffix: true })}`,
    };
  });
}
// Accept order (for sellers)
export async function acceptOrder(orderId: string): Promise<void> {
  const { user } = await me();
  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      sellerId: true,
      buyerId: true,
      status: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.sellerId !== user.id) {
    throw new Error("You can only accept your own orders");
  }

  if (order.status !== "PENDING") {
    throw new Error("Order is not in pending status");
  }

  await prisma.$transaction(async (tx) => {
    // Update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: "IN_PROGRESS" },
    });

    // Create notification for buyer
    await createNotification(order.buyerId, "ORDER_UPDATE", "Order Accepted", {
      orderId,
      message: "The seller has accepted your order and started working on it.",
    });
  });

  revalidatePath("/dashboard/orders");
}

export async function deliverWork(
  orderId: string,
  deliveryMessage: string,
  files?: string[] // URLs from file upload
): Promise<void> {
  const { user } = await me();
  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      chat: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.sellerId !== user.id) {
    throw new Error("You can only deliver your own orders");
  }

  if (order.status !== "IN_PROGRESS") {
    throw new Error("Order must be in progress to deliver");
  }

  await prisma.$transaction(async (tx) => {
    // Update order status
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "DELIVERED" as any, // Cast to bypass type checking
        updatedAt: new Date(),
      },
    });

    // Create a delivery message in chat
    if (order.chat) {
      const userMessage = await tx.userMessage.create({
        data: {
          userId: user.id,
          textContent: {
            create: {
              text: deliveryMessage || "Work delivered",
            },
          },
        },
      });

      await tx.message.create({
        data: {
          chatId: order.chat.id,
          type: "TEXT",
          status: "SENT",
          textContent: {
            connect: { id: userMessage.textContent!.id },
          },
        },
      });

      // If files are provided, create media messages
      if (files && files.length > 0) {
        const mediaFiles = await Promise.all(
          files.map((url) =>
            tx.mediaFile.create({
              data: {
                url,
                type: "DOCUMENT",
              },
            })
          )
        );

        const mediaUserMessage = await tx.userMessage.create({
          data: {
            userId: user.id,
            mediaContent: {
              create: {
                files: {
                  connect: mediaFiles.map((file) => ({ id: file.id })),
                },
              },
            },
          },
        });

        await tx.message.create({
          data: {
            chatId: order.chat.id,
            type: "MEDIA",
            status: "SENT",
            mediaContent: {
              connect: { id: mediaUserMessage.mediaContent!.id },
            },
          },
        });
      }
    }

    // Create notification for buyer
    await createNotification(order.buyerId, "ORDER_UPDATE", "Work Delivered", {
      orderId,
      message: "The seller has delivered your order. Please review and accept.",
    });
  });

  revalidatePath("/dashboard/orders");
}

// Accept delivery (for buyers)
export async function acceptDelivery(orderId: string): Promise<void> {
  const { user } = await me();
  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      buyerId: true,
      sellerId: true,
      status: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.buyerId !== user.id) {
    throw new Error("You can only accept deliveries for your own orders");
  }

  if (order.status !== "DELIVERED") {
    throw new Error("Order must be delivered to accept");
  }

  await prisma.$transaction(async (tx) => {
    // Update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    });

    // Create notification for seller
    await createNotification(
      order.sellerId,
      "ORDER_UPDATE",
      "Delivery Accepted",
      {
        orderId,
        message: "The buyer has accepted your delivery. Order completed!",
      }
    );
  });

  revalidatePath("/dashboard/orders");
}

// Request revision (for buyers)
export async function requestRevision(
  orderId: string,
  revisionDetails: string
): Promise<void> {
  const { user } = await me();
  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      chat: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.buyerId !== user.id) {
    throw new Error("You can only request revisions for your own orders");
  }

  if (order.status !== "DELIVERED") {
    throw new Error("Order must be delivered to request revision");
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "IN_PROGRESS",
        deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    });
    if (order.chat) {
      const userMessage = await tx.userMessage.create({
        data: {
          userId: user.id,
          textContent: {
            create: {
              text: `Revision requested: ${revisionDetails}`,
            },
          },
        },
      });

      await tx.message.create({
        data: {
          chatId: order.chat.id,
          type: "TEXT",
          status: "SENT",
          textContent: {
            connect: { id: userMessage.textContent!.id },
          },
        },
      });
    }

    // Create notification for seller
    await createNotification(
      order.sellerId,
      "ORDER_UPDATE",
      "Revision Requested",
      {
        orderId,
        message:
          "The buyer has requested revisions. Deadline extended by 48 hours.",
      }
    );
  });

  revalidatePath("/dashboard/orders");
}

// Cancel order
export async function cancelOrder(
  orderId: string,
  reason: string
): Promise<void> {
  const { user } = await me();
  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      buyerId: true,
      sellerId: true,
      status: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Check if user is buyer or seller
  const isBuyer = order.buyerId === user.id;
  const isSeller = order.sellerId === user.id;

  if (!isBuyer && !isSeller) {
    throw new Error("You can only cancel your own orders");
  }

  // Only allow cancellation before completion
  if (order.status === "COMPLETED") {
    throw new Error("Cannot cancel completed orders");
  }

  await prisma.$transaction(async (tx) => {
    // Update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" as any },
    });

    // Create notification for the other party
    const recipientId = isBuyer ? order.sellerId : order.buyerId;
    const cancellerRole = isBuyer ? "buyer" : "seller";

    await createNotification(recipientId, "ORDER_UPDATE", "Order Cancelled", {
      orderId,
      message: `The ${cancellerRole} has cancelled the order. Reason: ${reason}`,
    });
  });

  revalidatePath("/dashboard/orders");
}

// Get verification progress for orders
export async function getOrderVerificationProgress(
  userId: string
): Promise<{ contributesToBadge: boolean; progress: number; total: number }> {
  const completedOrders = await prisma.order.count({
    where: {
      sellerId: userId,
      status: "COMPLETED",
      review: {
        rating: { gt: 2.5 },
      },
    },
  });

  // Assuming 5 orders needed for verification
  const requiredOrders = 5;

  return {
    contributesToBadge: true,
    progress: completedOrders,
    total: requiredOrders,
  };
}
function isAfter(now: Date, deadline: Date) {
  return now.getTime() > deadline.getTime();
}
function differenceInDays(deadline: Date, now: Date) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((deadline.getTime() - now.getTime()) / msPerDay);
}
