"use client";

import { createContext, useContext, ReactNode } from "react";
import { Message, ChatUser } from "@/lib/types";

import { useChat } from "@/hooks/use-chat";

interface ChatContextValue {
  messages: Message[];
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  typingUsers: Set<string>;
  markAsRead: (messageId: string) => void;
  retryMessage: (messageId: string) => void;
  currentUser: ChatUser;
  otherUser: ChatUser;
  chatId: string;
  orderId: string;
}

const ChatContext = createContext<ChatContextValue | null>(null);

interface ChatProviderProps {
  children: ReactNode;
  chatId: string;
  orderId: string;
  currentUser: ChatUser;
  otherUser: ChatUser;
  initialMessages: Message[];
}

export function ChatProvider({
  children,
  chatId,
  orderId,
  currentUser,
  otherUser,
  initialMessages,
}: ChatProviderProps) {
  const chat = useChat({
    chatId,
    currentUser,
    initialMessages,
  });

  return (
    <ChatContext.Provider
      value={{
        ...chat,
        currentUser,
        otherUser,
        chatId,
        orderId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
}
