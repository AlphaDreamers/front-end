import { Prisma } from "@prisma/client";
import { KeyValuePair } from "../types";
import { prisma } from "../prisma";
import { me } from "./auth";

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
    id: order.id,
    title: `${order.gig?.title} - ${order.package.title} (${order.createdAt.toLocaleDateString()})`,
  }));
};

export const orderPackage = async (packageId: string) => {
  const user = await me();
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
