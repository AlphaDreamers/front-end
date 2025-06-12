import LeaveReviewForm from "@/components/reviews/leave-review-form";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{
    orderId: string;
  }>;
}) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      status: true,
      review: {
        select: {
          id: true,
        },
      },
      transaction: {
        select: {
          txId: true,
        },
      },
    },
  });

  if (!order) {
    return notFound();
  }

  if (
    order.status !== "COMPLETED" ||
    !order.transaction?.txId ||
    order.review
  ) {
    throw new Error("You cannot leave a review for this order.");
  }

  return <LeaveReviewForm orderId={orderId} />;
}
