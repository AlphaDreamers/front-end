"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatDateDivider } from "./chat-date-divider";
import { useChatContext } from "./chat-provider";
import { groupMessagesByDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function ChatMessages() {
  const { messages, isLoading, currentUser } = useChatContext();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Group messages by date
  const messageGroups = groupMessagesByDate(messages);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  // Detect if user is scrolling up
  const handleScroll = () => {
    if (!scrollAreaRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isAtBottom);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="flex-1 px-4"
      onScroll={handleScroll}
    >
      <div className="py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-2">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Start the conversation by sending a message below
            </p>
          </div>
        ) : (
          <>
            {Object.entries(messageGroups).map(([date, dateMessages]) => (
              <div key={date}>
                <ChatDateDivider date={date} />
                <div className="space-y-3">
                  {dateMessages.map((message, index) => {
                    const previousMessage = dateMessages[index - 1];
                    const showAvatar =
                      !previousMessage ||
                      previousMessage.senderId !== message.senderId ||
                      message.type === "SYSTEM";

                    return (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isOwn={message.senderId === currentUser.id}
                        showAvatar={showAvatar}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
