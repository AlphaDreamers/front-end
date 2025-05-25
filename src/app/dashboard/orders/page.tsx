import {
  CheckCircle,
  Clock,
  ExternalLink,
  HelpCircle,
  MessageSquare,
  PackageSearch,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import { OrderStatus } from "@prisma/client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger, 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import SearchBar from "@/components/search-bar";
import FilterCard from "@/components/filter-card";
import { getCurrentUser } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import SolanaBuyButton from "@/components/solana-pay-button";

export default async function OrdersPage({}: {
  searchParams: Promise<{
    role: string;
    query?: string;
  }>;
}) {
  const user = await getCurrentUser();

  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/orders");
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: [{ buyerId: user.id }, { sellerId: user.id }],
    },
    select: {
      id: true,
      package: {
        select: {
          gig: {
            select: {
              title: true,
            },
          },
          price: true,
        },
      },
      createdAt: true,
      status: true,
      buyer: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      seller: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      deadline: true,
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all your orders in one place
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg border-purple-800/20">
          <PackageSearch className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-center">
            {"No orders found"}
          </h3>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Orders matching your criteria will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {orders.map((order) => {
            const contact =
              order.buyer.id === user.id ? order.seller : order.buyer;

            return (
              <Card key={order.id}>
                <CardContent className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-lg">
                          {order.package.gig.title}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <span>Order #{order.id.substring(0, 8)}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {formatDistanceToNow(new Date(order.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>

                      <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="flex items-center mt-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={contact.avatar || "/placeholder.svg"}
                          alt={contact.username}
                        />
                        <AvatarFallback>
                          {contact.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="text-sm font-medium">
                          {contact.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {contact.id === order.buyer.id ? "Buyer" : "Seller"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock
                          className={`h-4 w-4 mr-1.5 ${
                            order.createdAt < new Date()
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={`text-sm ${order.createdAt < new Date() ? "text-red-500 font-medium" : "text-muted-foreground"}`}
                        >
                          {order.createdAt < new Date()
                            ? `Overdue by ${formatDistanceToNow(order.deadline)}`
                            : `Due ${formatDistanceToNow(order.deadline, { addSuffix: true })}`}
                        </span>
                      </div>

                      <div className="text-xl font-semibold text-primary">
                        {order.package.price} SOL
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-3">
                    {order.status === "WAITING_FOR_PAYMENT" && (
                      <SolanaBuyButton
                        recipient={contact.id}
                        orderId={order.id}
                        numberOfSol={order.package.price}
                      />
                    )}

                    <Link
                      href={`/orders/${order.id}`}
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                        }),
                        "w-full justify-start"
                      )}
                    >
                      <ExternalLink />
                      View Details
                    </Link>

                    {order.status === "COMPLETED" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <CheckCircle />
                            Mark as Delivered
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Mark Order as Delivered</DialogTitle>
                            <DialogDescription>
                              Ensure the delivery is sent to{" "}
                              <Link
                                className={cn(
                                  buttonVariants({
                                    variant: "link",
                                  }),
                                  "inline p-0 m-0"
                                )}
                                href={`/chat/${order.id}`}
                              >
                                {contact.username}
                              </Link>{" "}
                              before marking it as delivered.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="flex flex-row">
                            <Button className="flex-1" variant="destructive">
                              Cancel
                            </Button>
                            <Button className="flex-1">Confirm</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Link
                      href={`/orders/${order.id}/deliver`}
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                        }),
                        "w-full justify-start"
                      )}
                    >
                      <MessageSquare />
                      Message
                    </Link>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <HelpCircle />
                          Get Support
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Request Support</DialogTitle>
                          <DialogDescription>
                            Describe the issue you&apos;re experiencing with
                            this order.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Textarea
                            placeholder="Describe your issue..."
                            className="min-h-[120px]"
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button>Submit Request</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  let config = {
    variant: "secondary",
    className: "text-sm",
    label: "Unknown Status",
  };
  switch (status) {
    case "WAITING_FOR_PAYMENT": {
      config = {
        variant: "secondary",
        className: "bg-purple-600 hover:bg-purple-700 text-white",
        label: "Waiting for Payment",
      };
      break;
    }
    case "PENDING": {
      config = {
        variant: "secondary",
        className: "bg-yellow-600 hover:bg-yellow-700 text-white",
        label: "Pending",
      };
      break;
    }
    case "IN_PROGRESS": {
      config = {
        variant: "secondary",
        className: "bg-blue-600 hover:bg-blue-700 text-white",
        label: "In Progress",
      };
      break;
    }
    case "COMPLETED": {
      config = {
        variant: "success",
        className: "bg-green-600 hover:bg-green-700 text-white",
        label: "Completed",
      };
      break;
    }
    case "CANCELLED": {
      config = {
        variant: "destructive",
        className: "bg-red-600 hover:bg-red-700 text-white",
        label: "Cancelled",
      };
      break;
    }
  }

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
