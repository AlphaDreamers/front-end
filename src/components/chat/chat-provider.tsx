"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { Message, ChatUser, ChatContextValue, SocketEvents } from "@/lib/types";
import { uploadFilesToCloudinary } from "@/lib/actions/cloudinary";

const ChatContext = createContext<ChatContextValue | null>(null);

interface ChatProviderProps {
  children: ReactNode;
  chatId: string;
  currentUserId: string;
  otherUser: ChatUser;
  initialMessages: Message[];
}

export function ChatProvider({
  children,
  chatId,
  currentUserId,
  otherUser,
  initialMessages,
}: ChatProviderProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket<SocketEvents> | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
      {
        transports: ["websocket", "polling"],
      }
    );

    socketRef.current = socket;

    // Connection handlers
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join-chat", { chatId, userId: currentUserId });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Message handlers
    socket.on("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("message-saved", ({ tempId, savedMessage }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? savedMessage : msg))
      );
    });

    socket.on("message-failed", ({ tempId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: "failed" as const } : msg
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [chatId, currentUserId]);

  const sendMessage = async (content: string, files?: File[]) => {
    if (!socketRef.current || !isConnected) return;

    // Generate temporary ID for optimistic update
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    // Upload media files if any
    let mediaUrls: string[] = [];
    if (files && files.length > 0) {
      try {
        mediaUrls = await uploadFilesToCloudinary(files, "chat_media");
      } catch (error) {
        console.error("Failed to upload files:", error);
        throw error;
      }
    }

    // Create optimistic message
    const newMessage: Message = {
      id: tempId,
      chatId,
      senderId: currentUserId,
      content,
      mediaUrls,
      status: "sending",
      createdAt: new Date(),
    };

    // Add to local state immediately
    setMessages((prev) => [...prev, newMessage]);

    // Send to server
    socketRef.current.emit("send-message", {
      message: {
        id: tempId,
        chatId,
        senderId: currentUserId,
        content,
        mediaUrls,
        status: "sending",
      },
      chatId,
    });
  };

  const value: ChatContextValue = {
    messages,
    sendMessage,
    isConnected,
    currentUserId,
    otherUser,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
