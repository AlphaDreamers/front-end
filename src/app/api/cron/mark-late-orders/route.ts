import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/actions/notifications";

export async function GET() {
  const now = new Date();

  const lateOrdersRaw = await prisma.order.findMany({
    where: {
      status: "PAID",
      deadline: {
        lt: now,
      },
    },
    select: {
      id: true,
      buyerId: true,
      sellerId: true,
    },
  });

  const lateOrders = await Promise.all(
    lateOrdersRaw.flatMap((order) => [
      createNotification(
        order.buyerId,
        "ORDER_UPDATE",
        {
          orderId: order.id,
          status: "LATE",
        },
        `Your order #${order.id} is late. Please take action to resolve the issue.`
      ),

      createNotification(
        order.sellerId,
        "ORDER_UPDATE",
        {
          orderId: order.id,
          status: "LATE",
        },
        `Order #${order.id} is late. Please take action to resolve the issue.`
      ),

      // Update order status
      prisma.order.update({
        where: { id: order.id },
        data: { status: "LATE" },
      }),
    ])
  );

  return NextResponse.json({ updated: lateOrders.length });
}
