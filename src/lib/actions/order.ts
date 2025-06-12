"use server";

import { MediaFile, Prisma } from "@prisma/client";
import { Color, KeyValuePair, LucideIconName, Order } from "../types";
import { prisma } from "../prisma";
import { me } from "./auth";
import { differenceInDays, formatDistanceToNow, isAfter } from "date-fns";
import { createNotification } from "./notifications";
import { revalidatePath } from "next/cache";
import { uploadFilesToCloudinary } from "./cloudinary";

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

export async function getOrders(
  args: Omit<Prisma.OrderFindManyArgs, "select" | "include">
): Promise<Order[]> {
  const { user } = await auth();
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

export const createOrder = async (packageId: string) => {
  const { user } = await auth();

  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
    select: {
      id: true,
      deliveryTime: true,
      title: true,
      gig: {
        select: {
          title: true,
          sellerId: true,
          id: true,
        },
      },
    },
  });

  if (!pkg) {
    throw new Error("Package not found");
  }

  const order = await prisma.order.create({
    data: {
      status: "PENDING_PAYMENT",
      buyerId: user.id,
      sellerId: pkg.gig.sellerId,
      packageId: pkg.id,
      deadline: new Date(Date.now() + pkg.deliveryTime * 24 * 60 * 60 * 1000),
      gigId: pkg.gig.id,
      chat: {
        create: {
          buyerId: user.id,
          sellerId: pkg.gig.sellerId,
        },
      },
    },
  });

  await createNotification(
    pkg.gig.sellerId,
    "New Order Received",
    `You have a new order for ${pkg.gig.title} - ${pkg.title}.`,
    {
      type: "ORDER_UPDATE",
      orderId: order.id,
    }
  );

  await createNotification(
    user.id,
    "Order Created",
    `Your order for ${pkg.gig.title} - ${pkg.title} has been created. Please proceed to payment.`,
    {
      type: "ORDER_UPDATE",
      orderId: order.id,
    }
  );

  return order;
};

export const expireOrder = async (orderId: string) => {
  const { user } = await auth();

  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      status: true,
      buyerId: true,
      sellerId: true,
      createdAt: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "PENDING_PAYMENT") {
    throw new Error("Order is not in pending payment status");
  }

  if (order.buyerId !== user.id && order.sellerId !== user.id) {
    throw new Error("You can only expire your own orders");
  }

  if (order.createdAt.getTime() + 24 * 60 * 60 * 1000 > Date.now()) {
    throw new Error("Order can only be expired after 24 hours");
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: "EXPIRED" },
    });

    await createNotification(
      order.buyerId,
      "Order Expired",
      "Your order has expired due to non-payment. Please create a new order if you still wish to proceed.",
      {
        type: "ORDER_UPDATE",
        orderId,
      }
    );
  });

  revalidatePath("/dashboard/orders");
};

export const confirmPayment = async (
  orderId: string,
  txId: string,
  amount: number,
  senderPublicKey: string,
  receiverPublicKey: string
) => {
  const { user } = await auth();

  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      status: true,
      buyerId: true,
      sellerId: true,
      package: {
        select: {
          gig: {
            select: {
              sellerId: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "PENDING_PAYMENT") {
    throw new Error("Order is not in pending payment status");
  }

  if (order.buyerId !== user.id) {
    throw new Error("You can only confirm payment for your own orders");
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        transaction: {
          create: {
            txId,
            amount,
            senderPublicKey,
            receiverPublicKey,
          },
        },
      },
    });

    await createNotification(
      order.sellerId,
      "Payment Confirmed",
      "The buyer has confirmed payment. You can now start working on the order.",
      {
        type: "ORDER_UPDATE",
        orderId,
      }
    );

    await createNotification(
      order.buyerId,
      "Payment Confirmed",
      `Payment of ${amount} SOL for your order has been confirmed.`,
      {
        type: "PAYMENT",
        txId,
      }
    );
  });

  revalidatePath("/dashboard/orders");
};

export const cancelOrder = async (orderId: string): Promise<void> => {
  const { user } = await auth();

  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      status: true,
      buyerId: true,
      sellerId: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.buyerId === user.id) {
    if (order.status === "PENDING_PAYMENT") {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        });

        await createNotification(
          order.sellerId,
          "Order Cancelled",
          "The buyer has cancelled the order before payment.",
          {
            type: "ORDER_UPDATE",
            orderId,
          }
        );
      });

      revalidatePath("/dashboard/orders");
    } else {
      throw new Error("You can only cancel orders that are pending payment");
    }
  } else if (order.sellerId === user.id) {
    if (order.status === "PAID") {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        });

        await createNotification(
          order.buyerId,
          "Order Cancelled",
          "The seller has cancelled the order after payment.",
          {
            type: "ORDER_UPDATE",
            orderId,
          }
        );
      });

      revalidatePath("/dashboard/orders");
    } else {
      throw new Error("You can only cancel orders that are paid");
    }
  } else {
    throw new Error("You can only cancel your own orders");
  }
};

export const deliverWork = async ({
  orderId,
  files,
  explanation,
}: {
  orderId: string;
  files?: File[];
  explanation: string;
}) => {
  const { user } = await auth();

  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      sellerId: true,
      buyerId: true,
      chat: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.sellerId !== user.id) {
    throw new Error("You can only deliver your own orders");
  }

  if (order.status !== "PAID") {
    throw new Error("Order must be in paid status to deliver");
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "DELIVERED",
        updatedAt: new Date(),
      },
    });

    let mediaFiles: MediaFile[] = [];
    if (files && files.length > 0) {
      const uploadedFiles = await uploadFilesToCloudinary(files, "chat_media");
      mediaFiles = await Promise.all(
        uploadedFiles.map((url) =>
          tx.mediaFile.create({
            data: {
              url,
              type: "DOCUMENT",
            },
          })
        )
      );
    }

    await tx.message.create({
      data: {
        chatId: order.chat!.id,
        type: "TEXT",
        textContent: {
          create: {
            userMessage: {
              create: { userId: user.id },
            },
            text: explanation,
          },
        },
      },
    });

    if (mediaFiles.length > 0) {
      await tx.message.create({
        data: {
          chatId: order.chat!.id,
          type: "MEDIA",
          mediaContent: {
            create: {
              userMessage: {
                create: {
                  userId: user.id,
                },
              },
              files: {
                connect: mediaFiles.map((file) => ({ id: file.id })),
              },
            },
          },
        },
      });
    }

    await createNotification(
      order.buyerId,
      "Work Delivered",
      "The seller has delivered your order. Please review and accept.",
      {
        type: "ORDER_UPDATE",
        orderId,
      }
    );
  });

  revalidatePath("/dashboard/orders");
};

export const rejectDelivery = async (orderId: string): Promise<void> => {
  const { user } = await auth();

  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      status: true,
      buyerId: true,
      sellerId: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.buyerId !== user.id) {
    throw new Error("You can only reject deliveries for your own orders");
  }

  if (order.status !== "DELIVERED") {
    throw new Error("Order must be delivered to reject");
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: "DISPUTE" },
    });

    await createNotification(
      order.sellerId,
      "Delivery Rejected",
      "The buyer has rejected your delivery and opened a dispute. Please resolve the issue.",
      {
        type: "ORDER_UPDATE",
        orderId,
      }
    );
  });

  revalidatePath("/dashboard/orders");
};

export const acceptDelivery = async (orderId: string): Promise<void> => {
  const { user } = await auth();

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

  if (order.buyerId !== user.id) {
    throw new Error("You can only accept deliveries for your own orders");
  }

  if (order.status !== "DELIVERED") {
    throw new Error("Order must be delivered to accept");
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    });

    await createNotification(
      order.sellerId,
      "Order Completed",
      "The buyer has accepted your delivery. Order is now complete.",
      {
        type: "ORDER_UPDATE",
        orderId,
      }
    );
  });

  revalidatePath("/dashboard/orders");
};
