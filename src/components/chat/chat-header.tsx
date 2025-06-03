"use client";

import { ArrowLeft, Info, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useChatContext } from "./chat-provider";
import { OrderDetails } from "@/lib/types";
import { formatOrderStatus } from "@/lib/utils";

interface ChatHeaderProps {
  order: OrderDetails;
}

export function ChatHeader({ order }: ChatHeaderProps) {
  const { otherUser, typingUsers, currentUser } = useChatContext();
  const router = useRouter();

  const isOtherUserTyping = typingUsers.has(otherUser.id);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Avatar className="h-10 w-10">
          <AvatarImage src={otherUser.avatar || undefined} />
          <AvatarFallback>
            {otherUser.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">{otherUser.name}</h2>
            <Badge variant="outline" className="text-xs capitalize">
              {currentUser.role === "buyer" ? "Seller" : "Buyer"}
            </Badge>
          </div>

          {isOtherUserTyping ? (
            <p className="text-xs text-muted-foreground animate-pulse">
              typing...
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Order #{order.id.slice(-6)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={getStatusVariant(order.status)}>
          {formatOrderStatus(order.status)}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Info className="h-4 w-4 mr-2" />
              Order Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
}
