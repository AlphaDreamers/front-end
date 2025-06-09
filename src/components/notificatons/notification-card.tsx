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
  HelpCircle,
  MessageSquare,
  ExternalLink,
  MoreHorizontal,
  Check,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification } from "@/lib/types";
import {
  getNotificationIcon,
  getNotificationColor,
  getNotificationBgColor,
  getNotificationBorderColor,
} from "@/lib/utils";

interface NotificationCardProps {
  notification: Notification;
  isChecked: boolean;
  onCheckedChange: (checked: boolean, notificationId: string) => void;
  onDelete: (notificationId: string) => void;
  onMarkAsRead: (notificationId: string) => void;
}

export function NotificationCard({
  notification,
  isChecked,
  onCheckedChange,
  onDelete,
  onMarkAsRead,
}: NotificationCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const Icon = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type);
  const iconBgColor = getNotificationBgColor(notification.type);
  const borderColor = getNotificationBorderColor(notification.type);

  // Get action buttons based on notification type
  const getActionButtons = () => {
    const { metadata } = notification;

    switch (notification.type) {
      case "REVIEW":
        return (
          <div className="flex items-center gap-2 mt-3">
            {metadata.reviewId && (
              <Link href={`/dashboard/reviews/${metadata.reviewId}`}>
                <Button size="sm" variant="outline">
                  <Eye className="size-4 mr-1" />
                  View Review
                </Button>
              </Link>
            )}
            {metadata.gigId && (
              <Link href={`/gigs/${metadata.gigId}`}>
                <Button size="sm" variant="ghost">
                  <Eye className="size-4 mr-1" />
                  View Gig
                </Button>
              </Link>
            )}
          </div>
        );

      case "ORDER_UPDATE":
        return metadata.orderId ? (
          <div className="mt-3">
            <Link href={`/orders/${metadata.orderId}`}>
              <Button size="sm" variant="outline">
                <Eye className="size-4 mr-1" />
                View Order
              </Button>
            </Link>
          </div>
        ) : null;

      case "PAYMENT":
        return metadata.paymentId ? (
          <div className="mt-3">
            <Link href={`/dashboard/payments/${metadata.paymentId}`}>
              <Button size="sm" variant="outline">
                <Eye className="size-4 mr-1" />
                View Payment
              </Button>
            </Link>
          </div>
        ) : null;

      case "MESSAGE":
        return metadata.orderId ? (
          <div className="mt-3">
            <Link href={`/orders/${metadata.orderId}/chat`}>
              <Button size="sm" variant="outline">
                <MessageSquare className="size-4 mr-1" />
                View Chat
              </Button>
            </Link>
          </div>
        ) : null;

      case "SYSTEM":
        return metadata.articleId ? (
          <div className="mt-3">
            <Link href={`/help/${metadata.articleId}`}>
              <Button size="sm" variant="outline">
                <HelpCircle className="size-4 mr-1" />
                Learn More
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
        return (
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {metadata.rating && (
              <div className="flex items-center gap-1">
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                <span>{metadata.rating} stars</span>
              </div>
            )}
            {metadata.transactionId && (
              <Link
                href={`https://explorer.solana.com/tx/${metadata.transactionId}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-xs text-gray-400 hover:no-underline hover:text-violet-400 w-fit h-fit p-0 m-0"
                )}
              >
                View on Solana Explorer
                <ExternalLink className="size-3 ml-1" />
              </Link>
            )}
          </div>
        );

      case "ORDER_UPDATE":
        return metadata.orderId ? (
          <div className="text-sm text-gray-400">
            <span>Order ID: {metadata.orderId}</span>
          </div>
        ) : null;

      case "PAYMENT":
        return (
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {metadata.amount !== undefined && (
              <span>Amount: {metadata.amount} SOL</span>
            )}
            {metadata.transactionId && (
              <Link
                href={`/dashboard/orders/transactions/${metadata.transactionId}`}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-xs text-gray-400 hover:no-underline hover:text-violet-400 w-fit h-fit p-0 m-0"
                )}
              >
                View Transaction
                <ExternalLink className="size-3 ml-1" />
              </Link>
            )}
          </div>
        );

      case "MESSAGE":
        return metadata.senderId ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {metadata.senderAvatar && (
              <Image
                src={metadata.senderAvatar}
                className="size-5 rounded-full object-cover"
                alt={metadata.senderName || "Sender"}
                width={20}
                height={20}
              />
            )}
            {metadata.orderId && (
              <span>Message regarding Order ID: {metadata.orderId}</span>
            )}
          </div>
        ) : null;

      case "SYSTEM":
        return metadata.message ? (
          <div className="text-sm text-gray-400">
            <span>{metadata.message}</span>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        "relative group bg-gray-900 border-gray-700 transition-all duration-200 hover:bg-gray-900/80",
        !notification.isRead && cn(borderColor, "bg-violet-500/5")
      )}
    >
      {!notification.isRead && (
        <Badge
          className="absolute top-0 left-0 translate-x-1/3 -translate-y-1/2 bg-violet-500 text-white border-violet-400"
          aria-label="Unread"
        >
          Unread
        </Badge>
      )}

      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Checkbox for bulk actions */}
          <Checkbox
            checked={isChecked}
            onCheckedChange={(checked) =>
              onCheckedChange(checked as boolean, notification.id)
            }
            aria-label={`Select notification: ${notification.title}`}
            className="mt-1 border-gray-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
          />

          {/* Icon */}
          <div className={cn("p-2 rounded-lg", iconBgColor, iconColor)}>
            <Icon className="size-6" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <CardTitle className="text-lg font-bold text-white">
              {notification.title}
            </CardTitle>

            {notification.metadata.message && (
              <CardDescription className="text-gray-300 line-clamp-2 leading-relaxed">
                {notification.metadata.message}
              </CardDescription>
            )}

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <time dateTime={notification.createdAt.toISOString()}>
                {formatDistanceToNow(notification.createdAt, {
                  addSuffix: true,
                })}
              </time>
              {getFooterContent()}
            </div>

            {getActionButtons()}
          </div>
        </div>
      </CardContent>

      {/* Action dropdown */}
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
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

        <DropdownMenuContent align="end" className="w-48">
          {!notification.isRead && (
            <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
              <Check className="size-4 mr-2" />
              Mark as read
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => onDelete(notification.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
          >
            <Trash2 className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
