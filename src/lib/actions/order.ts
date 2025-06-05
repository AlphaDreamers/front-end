import { Prisma } from "@prisma/client";
import { KeyValuePair } from "../types";
import { prisma } from "../prisma";

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
