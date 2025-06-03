import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

import { Message, ChatUser } from "@/lib/types";
import { uploadFilesToCloudinary } from "@/lib/actions/cloudinary";
import { toast } from "sonner";

interface UseChatProps {
  chatId: string;
  currentUser: ChatUser;
  initialMessages: Message[];
}

type UserChatStatus = "disconnected" | "connecting" | "connected";

interface SocketEvents {
  connect: () => void;
  disconnect: () => void;
  message: (message: Message) => void;
  "message-saved": (data: { message: Message; tempId: string }) => void;
  "message-error": (data: { tempId: string; error: string }) => void;
  "typing-start": (data: { userId: string; userName: string }) => void;
  "typing-stop": (data: { userId: string }) => void;
  "message-delivered": (data: { messageId: string }) => void;
  "message-read": (data: { messageId: string; userId: string }) => void;
  error: (error: string) => void;
}

export function useChat({
  chatId,
  currentUser,
  initialMessages,
}: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Initialize socket connection
  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
      {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      }
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);
      setIsLoading(false);
      socket.emit("join-chat", { chatId, userId: currentUser.id });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setError("Connection lost. Attempting to reconnect...");
    });

    // Message handlers
    socket.on("message", (message: Message) => {
      setMessages((prev) => {
        // Avoid duplicate messages
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });

      // Mark as delivered if from other user
      if (message.senderId !== currentUser.id) {
        socket.emit("message-delivered", {
          messageId: message.id,
          chatId,
        });
      }
    });

    socket.on("message-saved", ({ message, tempId }) => {
      setMessages((prev) => prev.map((m) => (m.id === tempId ? message : m)));
    });

    socket.on("message-error", ({ tempId, error }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, status: "failed" as const } : m
        )
      );

      toast.success(
        JSON.stringify({
          title: "Failed to send message",
          description: error || "Please try again",
          variant: "destructive",
        })
      );
    });

    // Typing indicators
    socket.on("typing-start", ({ userId }) => {
      if (userId !== currentUser.id) {
        setTypingUsers((prev) => new Set(prev).add(userId));
      }
    });

    socket.on("typing-stop", ({ userId }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    // Message status updates
    socket.on("message-delivered", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId && m.status !== "read"
            ? { ...m, status: "delivered" as const }
            : m
        )
      );
    });

    socket.on("message-read", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: "read" as const } : m
        )
      );
    });

    // Error handling
    socket.on("error", (error: string) => {
      setError(error);
      toast.success(
        JSON.stringify({
          title: "Chat Error",
          description: error,
          variant: "destructive",
        })
      );
    });

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socket.disconnect();
    };
  }, [chatId, currentUser.id, toast]);

  const sendMessage = useCallback(
    async (content: string, attachments?: File[]) => {
      if (
        !socketRef.current ||
        (!content && (!attachments || attachments.length === 0))
      ) {
        return;
      }

      const tempId = `temp-${Date.now()}-${Math.random()}`;
      let urls: string[] = [];

      // Upload attachments if any
      if (attachments && attachments.length > 0) {
        try {
          urls = await uploadFilesToCloudinary(attachments, "chat_media");
        } catch (error) {
          toast.success(
            JSON.stringify({
              title: "Upload failed",
              description: "Failed to upload attachments",
              variant: "destructive",
            })
          );
          return;
        }
      }

      const newMessage: Message = {
        id: tempId,
        type: urls.length > 0 ? "MEDIA" : "TEXT",
        content: urls.length > 0 ? { urls } : { text: content },
        senderId: currentUser.id,
        status: "sending",
        createdAt: new Date(),
        isRead: false,
      };

      // Optimistically add message
      setMessages((prev) => [...prev, newMessage]);

      // Send via socket
      socketRef.current.emit("message", {
        message: newMessage,
        chatId,
      });
    },
    [chatId, currentUser.id, toast]
  );

  const markAsRead = useCallback(
    (messageId: string) => {
      if (!socketRef.current) return;

      socketRef.current.emit("message-read", {
        messageId,
        chatId,
        userId: currentUser.id,
      });
    },
    [chatId, currentUser.id]
  );

  const retryMessage = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m.id === messageId);
      if (!message || !socketRef.current) return;

      // Update status to sending
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: "sending" as const } : m
        )
      );

      // Resend
      socketRef.current.emit("message", {
        message: { ...message, status: "sending" },
        chatId,
      });
    },
    [messages, chatId]
  );

  return {
    messages,
    sendMessage,
    isConnected,
    isLoading,
    error,
    typingUsers,
    markAsRead,
    retryMessage,
  };
}
