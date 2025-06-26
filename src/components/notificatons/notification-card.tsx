"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Star,
  Eye,
  MessageSquare,
  ExternalLink,
  MoreHorizontal,
  Check,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification, NotificationMetadata } from "@/lib/types";
import {
  getNotificationIcon,
  getNotificationColor,
  getNotificationBgColor,
  getNotificationBorderColor,
} from "@/lib/utils";
import { toast } from "sonner";
import {
  deleteNotifications,
  markNotificationsAsRead,
} from "@/lib/actions/notifications";
import { useRouter } from "next/navigation";

interface NotificationCardProps {
  notification: Notification;
  isChecked: boolean;
  onCheckedChange: (checked: boolean, notificationId: string) => void;
}

export function NotificationCard({
  notification,
  isChecked,
  onCheckedChange,
}: NotificationCardProps) {
  const { refresh } = useRouter();
  const [isDropdownOpen] = useState(false);

  const Icon = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type);
  const iconBgColor = getNotificationBgColor(notification.type);
  const borderColor = getNotificationBorderColor(notification.type);

  const handleDelete = async () => {
    toast.promise(async () => await deleteNotifications([notification.id]), {
      loading: "Deleting notification...",
      success: () => {
        refresh();
        return "Notification deleted successfully!";
      },
      error: (err) => {
        const message =
          err instanceof Error ? err.message : "An error occurred";
        return message;
      },
    });
  };

  const handleMarkAsRead = () => {
    toast.promise(
      async () => await markNotificationsAsRead([notification.id]),
      {
        loading: "Marking notification as read...",
        success: () => {
          refresh();
          return "Notification marked as read!";
        },
        error: (err) => {
          const message =
            err instanceof Error ? err.message : "An error occurred";
          return message;
        },
      }
    );
  };

  // Get action buttons based on notification type
  const getActionButtons = () => {
    const { metadata } = notification;

    switch (notification.type) {
      case "REVIEW":
        const reviewMetadata = metadata as NotificationMetadata<"REVIEW">;
        return (
          <div className="flex items-center gap-2 mt-3">
            {reviewMetadata.reviewId && (
              <Link href={`/dashboard/reviews`}>
                <Button size="sm" variant="outline" aria-label="View review">
                  <Eye />
                  View Review
                </Button>
              </Link>
            )}
            {reviewMetadata.gigId && (
              <Link href={`/gigs/${reviewMetadata.gigId}`}>
                <Button size="sm" variant="ghost" aria-label="View gig">
                  <Eye />
                  View Gig
                </Button>
              </Link>
            )}
          </div>
        );

      case "ORDER_UPDATE":
        const orderMetadata = metadata as NotificationMetadata<"ORDER_UPDATE">;
        return orderMetadata.orderId ? (
          <div className="mt-3">
            <Link href={`/orders`}>
              <Button size="sm" variant="outline" aria-label="View order">
                <Eye />
                View Order
              </Button>
            </Link>
          </div>
        ) : null;

      case "PAYMENT":
        const paymentMetadata = metadata as NotificationMetadata<"PAYMENT">;
        return paymentMetadata.paymentId ? (
          <div className="mt-3">
            <Link href={`/dashboard/wallets`}>
              <Button size="sm" variant="outline" aria-label="View payment">
                <Eye />
                View Payment
              </Button>
            </Link>
          </div>
        ) : null;

      case "MESSAGE":
        const messageMetadata = metadata as NotificationMetadata<"MESSAGE">;
        return messageMetadata.orderId ? (
          <div className="mt-3">
            <Link href={`/orders/${messageMetadata.orderId}/chat`}>
              <Button size="sm" variant="outline" aria-label="View chat">
                <MessageSquare />
                View Chat
              </Button>
            </Link>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  // Get footer content based on notification type
  const getFooterContent = () => {
    const { metadata } = notification;

    switch (notification.type) {
      case "REVIEW":
        const reviewMetadata = metadata as NotificationMetadata<"REVIEW">;
        return (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {typeof reviewMetadata.rating === "number" && (
              <div
                className="flex items-center gap-1"
                aria-label={`Rating: ${reviewMetadata.rating} stars`}
              >
                <Star className="size-3 fill-amber-500 text-amber-500" />
                <span>{reviewMetadata.rating} stars</span>
              </div>
            )}
            {reviewMetadata.transactionId && (
              <Link
                href={`https://explorer.solana.com/tx/${reviewMetadata.transactionId}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-xs text-muted-foreground hover:no-underline hover:text-primary w-fit h-fit p-0 m-0"
                )}
                aria-label="View transaction on Solana Explorer"
              >
                View on Solana Explorer
                <ExternalLink className="size-3 ml-1" />
              </Link>
            )}
          </div>
        );

      case "ORDER_UPDATE":
        const orderUpdateMetadata =
          metadata as NotificationMetadata<"ORDER_UPDATE">;
        return orderUpdateMetadata.orderId ? (
          <div className="text-sm text-muted-foreground">
            <span>Order ID: {orderUpdateMetadata.orderId}</span>
            {orderUpdateMetadata.status && (
              <span className="ml-2">Status: {orderUpdateMetadata.status}</span>
            )}
          </div>
        ) : null;

      case "PAYMENT":
        const paymentMetadata = metadata as NotificationMetadata<"PAYMENT">;
        return (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {paymentMetadata.amount && (
              <span>Amount: {paymentMetadata.amount} SOL</span>
            )}
            {paymentMetadata.transactionId && (
              <Link
                href={`/dashboard/orders/${paymentMetadata.transactionId}`}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-xs text-muted-foreground hover:no-underline hover:text-primary w-fit h-fit p-0 m-0"
                )}
                aria-label="View transaction details"
              >
                View Transaction
                <ExternalLink className="size-3 ml-1" />
              </Link>
            )}
          </div>
        );

      case "MESSAGE":
        const messageMetadata = metadata as NotificationMetadata<"MESSAGE">;
        return messageMetadata.senderId ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {messageMetadata.senderAvatar && (
              <Image
                src={messageMetadata.senderAvatar}
                className="size-5 rounded-full object-cover"
                alt={messageMetadata.senderName || "Sender"}
                width={20}
                height={20}
              />
            )}
            <span>
              {messageMetadata.senderName || "Sender"}{" "}
              {messageMetadata.orderId &&
                `re: Order ID: ${messageMetadata.orderId}`}
            </span>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        "relative group transition-all duration-200",
        !notification.isRead && cn(borderColor, "bg-primary/5")
      )}
    >
      {!notification.isRead && (
        <Badge
          className="absolute top-0 left-0 translate-x-1/3 -translate-y-1/2 bg-primary text-primary-foreground border-primary"
          aria-label="Unread"
        >
          Unread
        </Badge>
      )}

      <CardContent className="flex flex-row items-center gap-4">
        <Checkbox
          checked={isChecked}
          onCheckedChange={(checked) =>
            onCheckedChange(!!checked, notification.id)
          }
          aria-label={`Select notification: ${notification.title}`}
        />

        <div className={cn("p-2 rounded-lg", iconBgColor, iconColor)}>
          <Icon className="size-6" />
        </div>

        <div className="flex-1 space-y-2">
          <CardTitle className="text-lg font-bold text-foreground">
            {notification.title}
          </CardTitle>

          {notification.metadata.message && (
            <CardDescription className="text-muted-foreground line-clamp-2 leading-relaxed">
              {notification.metadata.message}
            </CardDescription>
          )}

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <time dateTime={notification.createdAt.toISOString()}>
              {formatDistanceToNow(notification.createdAt, {
                addSuffix: true,
              })}
            </time>
            {getFooterContent()}
          </div>

          {getActionButtons()}
        </div>
      </CardContent>

      {/* Action dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="More options"
            className={cn(
              "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity",
              isDropdownOpen && "opacity-100"
            )}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-24">
          {!notification.isRead && (
            <DropdownMenuItem
              onClick={handleMarkAsRead}
              className="text-nowrap"
            >
              <Check />
              Mark as read
            </DropdownMenuItem>
          )}
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
