"use client";

import { formatDistanceToNow } from "date-fns";
import { File, Image as ImageIcon } from "lucide-react";
import { Prisma } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useSession } from "../session-provider";
import Image from "next/image";
import Link from "next/link";

interface ConversationItemProps {
  chat: Prisma.ChatGetPayload<{
    include: {
      messages: true;
      seller: true;
      buyer: true;
      order: true;
    };
  }>;
}

export function ConversationItem({ chat }: ConversationItemProps) {
  const { user } = useSession();

  const contact = chat.buyerId === user?.id ? chat.seller : chat.buyer;

  const [lastMessage] = chat.messages;

  const unreadCount = chat.messages.reduce(
    (count, message) =>
      message.isRead === false && message.senderId !== user?.id
        ? count + 1
        : count,
    0
  );

  return (
    <Link
      href={`/chats/${chat.id}`}
      className={cn(
        "flex items-start gap-3 px-4 py-6 transition-all hover:bg-muted/50 hover:border-l-4 hover:border-primary"
      )}
    >
      <Image
        src={contact.avatar || "/placeholder.svg"}
        alt={contact.username}
        width={40}
        height={40}
        className="object-cover rounded-full size-10"
      />

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{contact.username}</span>
            {contact.isVerified && (
              <Badge
                variant="outline"
                className="text-chart-2 border-chart-2/50 bg-chart-2/25"
              >
                Verified
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {lastMessage
              ? formatDistanceToNow(lastMessage?.createdAt, {
                  addSuffix: true,
                })
              : "No messages yet"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground truncate max-w-[180px]">
            {lastMessage?.type === "TEXT" ? (
              ((lastMessage?.content as Prisma.JsonObject)["text"] as string)
            ) : lastMessage?.type === "IMAGES" ? (
              <ImageIcon className="size-4" />
            ) : lastMessage?.type === "FILES" ? (
              <File className="size-4" />
            ) : (
              "Started a conversation"
            )}
          </p>

          {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
        </div>
      </div>
    </Link>
  );
}
