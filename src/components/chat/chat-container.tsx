"use client";

import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { useChat } from "./chat-provider";

export function ChatContainer() {
  const { isConnected } = useChat();

  return (
    <>
      {/* Connection indicator - minimal UI feedback */}
      {!isConnected && (
        <div className="bg-yellow-500/10 text-yellow-600 text-sm text-center py-2">
          Reconnecting...
        </div>
      )}

      <ChatMessages />
      <ChatInput />
    </>
  );
}
