import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import FilterCard from "@/components/FilterCard";
import SearchBar from "@/components/SearchBar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Progress,
} from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/lib/types";
import Pagination from "@/components/Pagination";
import { Prisma, PrismaClient } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

const prisma = new PrismaClient();

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    query?: string;
    unreadOnly?: boolean;
    status?: OrderStatus;
    role?: "buyer" | "seller";
    page?: number;
  }>;
}>) {
  const filters = await searchParams;

  const [chats, count] = await Promise.all([
  
  ]);

  return (
    <main className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <SearchBar />

        <FilterCard
          config={[
            {
              id: "unreadOnly",
              label: "Unread Only",
              type: "switch",
            },
            {
              id: "status",
              label: "Order Status",
              type: "radio",
              options: [
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Completed" },
                { value: "in-progress", label: "In Progress" },
                { value: "awaiting-payment", label: "Awaiting Payment" },
                { value: "pending-delivery", label: "Pending Delivery" },
              ],
            },
            {
              id: "role",
              label: "User Role",
              type: "radio",
              options: [
                { value: "buyer", label: "Buyer" },
                { value: "seller", label: "Seller" },
              ],
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {chats.map((chat) => (
          <Card key={chat.id} className="py-4">
            <CardHeader className="flex items-center gap-4 px-4">
              {"avatar" in chat.seller && chat.seller.avatar ? (
                <Image
                  src={chat.seller.avatar}
                  alt={chat.seller.username}
                  width={48}
                  height={48}
                  className="rounded-full border object-cover"
                />
              ) : (
                <span>
                  {chat.seller.name.charAt(0).toUpperCase()}
                  {chat.seller.surname.charAt(0).toUpperCase()}
                </span>
              )}

              <div className="flex-1 min-h-full">
                <h4 className="font-medium">{chat.seller.username}</h4>

                <p className="text-sm  text-muted-foreground">
                  {chat.order.title}
                </p>
              </div>

              <div className="self-start text-xs text-muted-foreground">
                {chat.last_message?.created_at}
              </div>
            </CardHeader>

            <CardContent className="px-4">
              <div>
                <p className="text-sm font-mono">{chat.last_message?.text}</p>
              </div>

              <Badge variant="secondary" className="mt-2">
                <span className="font-medium">SOL</span>
                <span className="mx-0.5">·</span>
                <span>{chat.order.price}</span>
                <span className="ml-1 text-muted-foreground">
                  ({chat.order.price * 20} USD)
                </span>
              </Badge>
            </CardContent>

            {/* Milestone Progress */}
            <CardFooter className="flex-row px-4 gap-4 mt-auto">
              <div className="flex-1">
                <div className="flex w-full justify-between text-xs mb-1 text-muted-foreground">
                  <span>{/*chat.milestone*/}</span>
                  <span>{/*conversation.milestoneDeadline*/}</span>
                </div>
                <Progress
                  //value={chat.milestoneProgress}
                  className={cn({
                    "bg-chart-4 *:bg-chart-2":
                      chat.order.status === "completed",
                    "bg-yellow-500":
                      chat.order.status === "in-progress" ||
                      chat.order.status === "pending-delivery",
                    "bg-red-500": chat.order.status === "awaiting-payment",
                  })}
                />
              </div>

              <Link
                href={`/chat/${chat.id}`}
                className={buttonVariants({
                  className: "text-sm",
                  size: "sm",
                })}
              >
                View Conversation
                <ArrowRight />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Pagination totalPages={count} />
    </main>
  );
}
