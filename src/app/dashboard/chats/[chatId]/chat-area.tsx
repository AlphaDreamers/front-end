"use client";

import { z } from "zod";
import { io, Socket } from "socket.io-client";
import { useEffect, useState, useRef } from "react";

import { Chat, Message } from "@/lib/types";
import { SendMessageFormSchema } from "@/lib/schemas";
import { uploadFileToCloudinary } from "@/lib/actions";
import ChatInput from "@/components/chat/chat-input";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <main className="flex flex-col h-full">
      <ScrollArea className="flex-1 max-h-full">
        <div className="flex flex-col gap-4 overflow-y-auto p-4">
          {messages.map((ms) => (
            <MessageBubble
              message={ms}
              key={ms.id}
              side={ms.senderId === currentUserId ? "right" : "left"}
              variant={ms.senderId === currentUserId ? "default" : "secondary"}
            />
          ))}
        </div>
      </ScrollArea>
      {isOtherTyping && (
        <div className="ml-auto mr-4 my-4 border w-fit px-4 py-2 rounded-full text-sm text-muted-foreground animate-pulse bg-muted">
          <span>Other user is typing...</span>
        </div>
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

interface MessageBubbleProps {
  message: Message;
  side: "left" | "right";
  variant?: "default" | "outline" | "secondary";
}

const MessageBubble = ({
  message,
  side = "right",
  variant = "default",
}: MessageBubbleProps) => {
  switch (message.type) {
    case "TEXT": {
      return (
        <div
          className={cn(
            "flex gap-2",
            side === "right" ? "flex-row-reverse" : "flex-row"
          )}
        >
          <Image
            src="https://picsum.photos/200/300/?random=1"
            alt="User Avatar"
            className="size-12 rounded-full border shadow shadow-primary aspect-square"
            width={32}
            height={32}
          />
          <div
            className={cn(
              "flex flex-col max-w-[400px]",
              side === "right" ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn("flex items-center rounded py-2 px-4 text-sm", {
                "bg-primary text-primary-foreground": variant === "default",
                "bg-secondary text-secondary-foreground":
                  variant === "secondary",
              })}
            >
              {message.content.text}
            </div>
            <time className="text-xs text-muted-foreground ml-2">
              {formatDistanceToNow(new Date(message.createdAt), {
                addSuffix: true,
              })}
            </time>
          </div>
        </div>
      );
    }
    case "MEDIA": {
      return (
        <div
          className={cn(
            "flex gap-2",
            side === "right" ? "flex-row-reverse" : "flex-row"
          )}
        >
          <Image
            src="https://picsum.photos/200/300/?random=1"
            alt="User Avatar"
            className="size-12 rounded-full border shadow shadow-primary aspect-square"
            width={32}
            height={32}
          />
          <div
            className={cn(
              "flex flex-col max-w-[400px]",
              side === "right" ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn("flex items-center rounded py-2 px-4 text-sm", {
                "bg-primary text-primary-foreground": variant === "default",
                "bg-secondary text-secondary-foreground":
                  variant === "secondary",
              })}
            >
              {message.content.urls.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  className="max-h-60 max-w-full rounded"
                  width={200}
                  height={200}
                />
              ))}
            </div>
            <time className="text-xs text-muted-foreground ml-2">
              {formatDistanceToNow(new Date(message.createdAt), {
                addSuffix: true,
              })}
            </time>
          </div>
        </div>
      );
    }
    case "SYSTEM": {
      return (
        <div className="text-center text-sm text-muted-foreground my-4">
          {message.content.content}
        </div>
      );
    }
  }
};
