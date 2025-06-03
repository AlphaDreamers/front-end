"use client";

import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { ConnectionStatus } from "./connection-status";
import { useChatContext } from "./chat-provider";
import { OrderDetails } from "@/lib/types";

interface ChatContainerProps {
  order: OrderDetails;
}

export function ChatContainer({ order }: ChatContainerProps) {
  const { isConnected, error } = useChatContext();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ChatHeader order={order} />

      {/* Connection status bar */}
      {(!isConnected || error) && (
        <ConnectionStatus isConnected={isConnected} error={error} />
      )}

      <ChatMessages />
      <ChatInput />
    </div>
  );
}
