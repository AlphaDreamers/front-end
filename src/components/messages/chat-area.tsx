"use client";

import { Info } from "lucide-react";
import { Prisma, User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SocketEvent } from "@/lib/socket-events";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import Image from "next/image";

interface ChatAreaProps {
  chat: Prisma.ChatGetPayload<{
    include: {
      messages: {
        select: {
          id: true;
          senderId: true;
          content: true;
          type: true;
          createdAt: true;
          sender: true;
        };
      };
      buyer: true;
      seller: true;
      order: true;
    };
  }>;
  user: User;
}

type Message = Prisma.MessageGetPayload<{
  select: {
    id: true;
    senderId: true;
    content: true;
    type: true;
    createdAt: true;
    sender: true;
  };
}>;

export function ChatArea({ chat, user }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>(
    chat.messages as Message[]
  );
  const socketRef = useRef<Socket>(null);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit(SocketEvent.JOIN_ROOM, { chatId: chat.id });
    });

    socket.on(SocketEvent.JOIN_ROOM, ({ chatId: joined }) => {
      console.log(`Joined chat room: ${joined}`);
    });

    socket.on(SocketEvent.MESSAGE, (messages: Message[]) => {
      setMessages((prevMessages) => [...prevMessages, ...messages]);
    });

    socket.on(SocketEvent.MESSAGE_ACK, ({ chatId, messageIds }) => {
      console.log(`Messages ${messageIds} sent successfully to chat ${chatId}`);
    });

    socket.on(SocketEvent.MESSAGE_ERROR, ({ chatId, error }) => {
      console.error(`Error in chat ${chatId}: ${error}`);
    });

    return () => {
      socket.emit(SocketEvent.LEAVE_ROOM, { chatId: chat.id });
      socket.disconnect();
    };
  }, [chat.id]);

  const onSendMessage = async (text?: string, attachments?: File[]) => {
    const messages: Message[] = [];
    const content: {
      text?: string;
      attachments?: { type: string; data?: string; url?: string }[];
    } = {};

    if (text) {
      content.text = text;
    }

    if (attachments && attachments.length > 0) {
      // Convert attachments to base64 if image, otherwise just use file name as url placeholder
      content.attachments = await Promise.all(
        attachments.map(
          (att) =>
            new Promise<{ type: string; data?: string; url?: string }>(
              (resolve) => {
                if (att.type.startsWith("image/")) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    resolve({ type: "image", data: reader.result as string });
                  };
                  reader.readAsDataURL(att);
                } else {
                  resolve({ type: "file", url: att.name });
                }
              }
            )
        )
      );
    }

    if (text || (content.attachments && content.attachments.length > 0)) {
      messages.push({
        id: Date.now().toString(), // Temporary ID, server can override
        senderId: user.id,
        content,
        type: content.attachments ? "ATTACHMENTS" : "TEXT",
        sender: user,
        createdAt: new Date(),
      });
    }

    setMessages((prevMessages) => [...prevMessages, ...messages]);
    socketRef.current?.emit(SocketEvent.MESSAGE, {
      chatId: chat.id,
      messages,
    });
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const contact = chat.sellerId === user.id ? chat.buyer : chat.seller;

  const isOnline = true;

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Image
            src={contact.avatar || "/placeholder.svg"}
            alt={contact.username}
            width={48}
            height={48}
            className="object-cover size-12 border rounded-full"
          />
          <div>
            <h3 className="font-medium">{contact.username}</h3>
            <p className="text-xs text-muted-foreground">
              {isOnline ? (
                <span className="text-green-500">● Online</span>
              ) : (
                <span className="text-red-500">● Offline</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {chat.orderId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Info className="h-4 w-4 mr-2" />
                  Order Details
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Order #{chat.orderId}</DropdownMenuItem>
                <DropdownMenuItem>Extend Delivery Time</DropdownMenuItem>
                <DropdownMenuItem>Request Revision</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((ms) => (
          <MessageBubble
            key={ms.id}
            message={ms}
            userId={user.id}
            side={ms.senderId === user.id ? "right" : "left"}
            variant={ms.senderId === user.id ? "default" : "secondary"}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-2 py-4 border-t border-border">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}
