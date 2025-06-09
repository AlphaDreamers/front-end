"use client";

import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { useChat } from "./chat-provider";

interface ChatContainerProps {
  orderId: string;
}

export function ChatContainer({ orderId }: ChatContainerProps) {
  const { isConnected } = useChat();

  return (
    <div className="flex flex-col h-full">
      <ChatHeader orderId={orderId} />

      {/* Connection indicator - minimal UI feedback */}
      {!isConnected && (
        <div className="bg-yellow-500/10 text-yellow-600 text-sm text-center py-2">
          Reconnecting...
        </div>
      )}

      <ChatMessages />
      <ChatInput />
    </div>
  );
}
