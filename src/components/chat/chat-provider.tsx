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
import { Message, User } from "@/lib/types";
import { uploadFilesToCloudinary } from "@/lib/actions/cloudinary";
import { createNotification } from "@/lib/actions/notifications";

export interface ChatContextValue {
  messages: Message[];
  sendMessage: (content: string, files?: File[]) => Promise<void>;
  isConnected: boolean;
  currentUserId: string;
  otherUser: User;
}

const ChatContext = createContext<ChatContextValue | null>(null);

interface ChatProviderProps {
  children: ReactNode;
  chatId: string;
  currentUserId: string;
  otherUser: User;
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
  const socketRef = useRef<Socket | null>(null);
  const lastNotificationTime = useRef(0);
  const NOTIFICATION_THROTTLE_MS = 5000; // 5 seconds between notifications

  useEffect(() => {
    // Initialize socket connection
    const socket = io(
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
      {
        transports: ["websocket", "polling"],
        auth: {
          userId: currentUserId,
        },
      }
    );
    socketRef.current = socket;

    // Connection handlers
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join-chat", { chatId, userId: currentUserId });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
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
          msg.id === tempId ? { ...msg, status: "failed" } : msg
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

    // Check if we should emit notification
    const now = Date.now();
    const shouldNotify =
      now - lastNotificationTime.current > NOTIFICATION_THROTTLE_MS;

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

    // Emit notification only if throttle period has passed
    if (shouldNotify) {
      await createNotification(otherUser.id, "MESSAGE", {
        senderId: currentUserId,
        senderName: `${otherUser.firstName} ${otherUser.lastName}`,
        senderAvatar: otherUser.avatar,
        orderId: chatId,
      });
      lastNotificationTime.current = now;
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        isConnected,
        currentUserId,
        otherUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
