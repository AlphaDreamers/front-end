import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

const seed = async () => {
  const orderStatuses: OrderStatus[] = [
    "WAITING_FOR_PAYMENT",
    "PENDING",
    "IN_PROGRESS",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
  ];

  await Promise.all(
    (
      await prisma.order.findMany({
        select: {
          id: true,
        },
      })
    ).map(async (order) => {
      const randomStatus = faker.helpers.arrayElement(orderStatuses);
      await prisma.order.update({
        where: { id: order.id },
        data: { status: randomStatus },
      });
    })
  );
  console.log("Orders updated with random statuses");
  // You can add more seeding logic here if needed
};

// Run the seed function
seed().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
