"use client";

import { z } from "zod";
import { io, Socket } from "socket.io-client";
import { useEffect, useState, useRef } from "react";

import { Chat, Message } from "@/lib/types";
import { SendMessageFormSchema } from "@/lib/schemas";
import { uploadFileToCloudinary } from "@/lib/actions";
import ChatInput from "@/components/chat/chat-input";

interface ChatAreaProps {
  chat: Chat;
  currentUserId: string;
}

const ChatArea = ({ chat, currentUserId }: ChatAreaProps) => {
  const socketRef = useRef<Socket | null>(null);

  const [isOtherTyping, setIsOtherTyping] = useState(false);

  const [messages, setMessages] = useState(chat.messages);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL as string, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to chat server");
      socket.emit("join-chat", { chatId: chat.id });
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on(
      "message-saved",
      ({ message, tempId }: { message: Message; tempId: string }) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === tempId ? message : msg))
        );
      }
    );

    socket.on("message-error", ({ tempId }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== tempId)
      );
    });

    socket.on("typing-start", ({ userId }) => {
      if (userId !== currentUserId) {
        setIsOtherTyping(true);
      }
    });

    socket.on("typing-stop", ({ userId }) => {
      if (userId !== currentUserId) {
        setIsOtherTyping(false);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [chat.id, currentUserId]);

  const handleSendMessage = async (
    data: z.infer<typeof SendMessageFormSchema>
  ) => {
    if (!socketRef.current) return;
    const socket = socketRef.current;

    if (data.attachments?.length) {
      const fileUrls = await Promise.all(
        data.attachments?.map((file) =>
          uploadFileToCloudinary(file, "chat_media")
        ) || []
      );

      const newMessage: Message = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        isRead: false,
        senderId: currentUserId,
        type: "MEDIA",
        content: { urls: fileUrls },
      };

      setMessages((prev) => [...prev, newMessage]);
      socket.emit("message", {
        message: newMessage,
        chatId: chat.id,
      });
    }

    if (data.text && data.text.trim()) {
      console.log("Sending text message:", data.text.trim());
      const newMessage: Message = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        isRead: false,
        senderId: currentUserId,
        type: "TEXT",
        content: { text: data.text.trim() },
      };

      setMessages((prev) => [...prev, newMessage]);

      socket.emit("message", {
        message: newMessage,
        chatId: chat.id,
      });
    }
  };

  return (
    <main className="flex flex-col h-full w-full">
      <div></div>
      <div className="flex-1">
        {messages.map((ms) => (
          <div key={ms.id}>{JSON.stringify(ms)}</div>
        ))}
      </div>
      {isOtherTyping && (
        <div className="text-sm text-muted-foreground">User is typing...</div>
      )}
      <ChatInput
        onSendMessage={handleSendMessage}
        onTypingStart={() => {
          if (socketRef.current) {
            socketRef.current.emit("typing-start", {
              chatId: chat.id,
              userId: currentUserId,
            });
          }
        }}
        onTypingStop={() => {
          if (socketRef.current) {
            socketRef.current.emit("typing-stop", {
              chatId: chat.id,
              userId: currentUserId,
            });
          }
        }}
      />
    </main>
  );
};

export default ChatArea;
