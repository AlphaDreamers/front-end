"use server";

import { MediaFile, Prisma } from "@prisma/client";
import { Color, LucideIconName, Order } from "../types";
import { prisma } from "../prisma";
import { differenceInDays, formatDistanceToNow, isAfter } from "date-fns";
import { revalidatePath } from "next/cache";
import { uploadFilesToCloudinary } from "./cloudinary";
import { auth } from "../auth";
import { createNotification } from "./notifications";
import { sendEmail } from "./email";
import { checkPowerBuyerBadge, checkTopRatedSellerBadge } from "./badges";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const getOrders = async (
  args: Omit<Prisma.OrderFindManyArgs, "select" | "include">
): Promise<Order[]> => {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to view orders.");
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
      completedAt: true,
    },
  });

  const transformedOrders = orders.map((prismaOrder) => {
    const now = new Date();
    const deadline = new Date(prismaOrder.deadline);
    const isOverdue = isAfter(now, deadline);
    const daysUntilDeadline = differenceInDays(deadline, now);

    return {
      reviewId: prismaOrder.review?.id || undefined,
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
            : undefined,
        avatar: prismaOrder.buyer.avatar || undefined,
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
            : undefined,
        avatar: prismaOrder.seller.avatar || undefined,
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

      chat: prismaOrder.chat ? { id: prismaOrder.chat.id } : undefined,
      transaction: prismaOrder.transaction
        ? {
            txId: prismaOrder.transaction.txId,
            amount: prismaOrder.transaction.amount,
            date: prismaOrder.transaction.createdAt,
            senderPublicKey: prismaOrder.transaction.senderPublicKey,
            receiverPublicKey: prismaOrder.transaction.receiverPublicKey,
          }
        : undefined,

      isOverdue,
      daysUntilDeadline,
      formattedDeadline: isOverdue
        ? `Overdue by ${formatDistanceToNow(deadline)}`
        : `Due ${formatDistanceToNow(deadline, { addSuffix: true })}`,
      completedAt: prismaOrder.completedAt || undefined,
    };
  });

  return transformedOrders;
};

export const createOrder = async (
  packageId: string
): Promise<ActionResult<{ orderId: string }>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to create an order.",
      };
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
            seller: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!pkg) {
      return {
        success: false,
        error: "Package not found. Please refresh and try again.",
      };
    }

    if (pkg.gig.sellerId === session.user.id) {
      return {
        success: false,
        error: "You cannot purchase your own gig.",
      };
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          status: "PENDING_PAYMENT",
          buyerId: session.user.id,
          sellerId: pkg.gig.sellerId,
          packageId: pkg.id,
          deadline: new Date(
            Date.now() + pkg.deliveryTime * 24 * 60 * 60 * 1000
          ),
          gigId: pkg.gig.id,
          chat: {
            create: {
              buyerId: session.user.id,
              sellerId: pkg.gig.sellerId,
            },
          },
        },
      });

      return newOrder;
    });

    await createNotification(
      pkg.gig.sellerId,
      "ORDER_UPDATE",
      {
        orderId: order.id,
        status: order.status,
      },
      `New order created for your gig "${pkg.gig.title}" by ${session.user.username}`
    );

    return {
      success: true,
      data: { orderId: order.id },
    };
  } catch (error) {
    console.error("Create order error:", error);
    return {
      success: false,
      error: "Failed to create order. Please try again.",
    };
  }
};

export const cancelOrder = async (
  orderId: string
): Promise<ActionResult<void>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to cancel an order.",
      };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        buyerId: true,
        sellerId: true,
      },
    });

    if (!order) {
      return {
        success: false,
        error: "Order not found.",
      };
    }

    if (order.buyerId !== session.user.id) {
      return {
        success: false,
        error: "You can only cancel your own orders.",
      };
    }

    if (order.status !== "PENDING_PAYMENT") {
      return {
        success: false,
        error:
          "Only orders pending payment can be cancelled. Please contact support for other cases.",
      };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    await createNotification(
      order.sellerId,
      "ORDER_UPDATE",
      {
        orderId: order.id,
        status: "CANCELLED",
      },
      `Order ${orderId} has been cancelled by the buyer`
    );

    revalidatePath("/dashboard/orders");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Cancel order error:", error);
    return {
      success: false,
      error: "Failed to cancel order. Please try again.",
    };
  }
};

export const deliverWork = async ({
  orderId,
  files,
  links,
  explanation,
}: {
  orderId: string;
  files?: File[];
  links?: string[];
  explanation: string;
}): Promise<ActionResult<void>> => {
  if (files?.some((f) => f.size > 1024 * 1024)) {
    return {
      success: false,
      error:
        "File size exceeds the 1MB limit. Please reduce file size and try again.",
    };
  }

  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to deliver work.",
      };
    }

    if (!explanation || explanation.trim().length === 0) {
      return {
        success: false,
        error: "Please provide an explanation for your delivery.",
      };
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
      return {
        success: false,
        error: "Order not found.",
      };
    }

    if (order.sellerId !== session.user.id) {
      return {
        success: false,
        error: "You can only deliver work for your own orders.",
      };
    }

    if (order.status !== "PAID" && order.status !== "DISPUTE") {
      return {
        success: false,
        error: "Order must be paid or in dispute to deliver work.",
      };
    }

    if (!order.chat) {
      return {
        success: false,
        error: "Order chat not found. Please contact support.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "DELIVERED",
          updatedAt: new Date(),
        },
      });

      // Upload and create media files if provided
      let mediaFiles: MediaFile[] = [];
      if (files && files.length > 0) {
        try {
          const uploadedFiles = await uploadFilesToCloudinary(
            files,
            "chat_media"
          );
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
        } catch {
          throw new Error("Failed to upload files");
        }
      }

      // Create link message if links provided
      if (links && links.length > 0) {
        await tx.message.create({
          data: {
            chatId: order.chat!.id,
            type: "TEXT",
            textContent: {
              create: {
                userMessage: {
                  create: { userId: session.user.id },
                },
                text: `Delivery Links:\n${links.join("\n")}`,
              },
            },
          },
        });
      }

      // Create explanation message
      await tx.message.create({
        data: {
          chatId: order.chat!.id,
          type: "TEXT",
          textContent: {
            create: {
              userMessage: {
                create: { userId: session.user.id },
              },
              text: `Delivery Explanation:\n${explanation}`,
            },
          },
        },
      });

      // Create media message if files were uploaded
      if (mediaFiles.length > 0) {
        await tx.message.create({
          data: {
            chatId: order.chat!.id,
            type: "MEDIA",
            mediaContent: {
              create: {
                userMessage: {
                  create: {
                    userId: session.user.id,
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
    });

    await sendEmail(order.buyerId, "orderDelivered", {
      orderId: order.id,
    });

    await createNotification(
      order.buyerId,
      "ORDER_UPDATE",
      {
        orderId: order.id,
        status: "DELIVERED",
      },
      `Your order ${orderId} has been delivered by the seller`
    );

    revalidatePath("/dashboard/orders");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Deliver work error:", error);
    return {
      success: false,
      error:
        error instanceof Error && error.message === "Failed to upload files"
          ? "Failed to upload files. Please check file sizes and try again."
          : "Failed to deliver work. Please try again.",
    };
  }
};

export const rejectDelivery = async (
  orderId: string
): Promise<ActionResult<void>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to reject a delivery.",
      };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        buyerId: true,
        sellerId: true,
        seller: {
          select: {
            email: true,
          },
        },
        deadline: true,
      },
    });

    if (!order) {
      return {
        success: false,
        error: "Order not found.",
      };
    }

    if (order.buyerId !== session.user.id) {
      return {
        success: false,
        error: "You can only reject deliveries for your own orders.",
      };
    }

    if (order.status !== "DELIVERED") {
      return {
        success: false,
        error: "Only delivered orders can be rejected.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Calculate the new deadline: either extend by 48h, or set to 48h from now, whichever is later
      const now = new Date();
      const extendedDeadline = new Date(
        order.deadline.getTime() + 48 * 60 * 60 * 1000
      );
      const minDeadline = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      const newDeadline =
        extendedDeadline > minDeadline ? extendedDeadline : minDeadline;

      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "DISPUTE",
          deadline: newDeadline,
        },
      });
    });

    await sendEmail(order.seller.email, "revisionRequested", {
      orderId: order.id,
    });

    await createNotification(
      order.sellerId,
      "ORDER_UPDATE",
      {
        orderId: order.id,
        status: "DISPUTE",
      },
      `Your delivery for order ${orderId} has been rejected. Please provide a revision.`
    );

    revalidatePath("/dashboard/orders");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Reject delivery error:", error);
    return {
      success: false,
      error: "Failed to reject delivery. Please try again.",
    };
  }
};

export const acceptDelivery = async (
  orderId: string
): Promise<ActionResult<void>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to accept a delivery.",
      };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        sellerId: true,
        buyerId: true,
        status: true,
      },
    });

    if (!order) {
      return {
        success: false,
        error: "Order not found.",
      };
    }

    if (order.buyerId !== session.user.id) {
      return {
        success: false,
        error: "You can only accept deliveries for your own orders.",
      };
    }

    if (order.status !== "DELIVERED") {
      return {
        success: false,
        error: "Only delivered orders can be accepted.",
      };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    await createNotification(
      order.sellerId,
      "ORDER_UPDATE",
      {
        orderId: order.id,
        status: "COMPLETED",
      },
      `Great news! Your order ${orderId} has been accepted and completed.`
    );

    await prisma.$transaction(async (tx) => {
      await checkPowerBuyerBadge(session.user.id, tx);
      await checkTopRatedSellerBadge(order.sellerId, tx);
    });

    revalidatePath("/dashboard/orders");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Accept delivery error:", error);
    return {
      success: false,
      error: "Failed to accept delivery. Please try again.",
    };
  }
};
