"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChat } from "./chat-provider";

interface ChatHeaderProps {
  orderId: string;
}

export function ChatHeader({ orderId }: ChatHeaderProps) {
  const { otherUser } = useChat();

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b bg-card">
      <Avatar className="h-10 w-10">
        <AvatarImage src={otherUser.avatar} />
        <AvatarFallback>
          {otherUser.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div>
        <h2 className="font-semibold">{otherUser.name}</h2>
        <p className="text-xs text-muted-foreground">
          Order #{orderId.slice(-6).toUpperCase()}
        </p>
      </div>
    </div>
  );
}
