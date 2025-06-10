"use client";

import { format } from "date-fns";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const showStatusIcon = () => {
    if (!isOwn) return null;

    switch (message.status) {
      case "sending":
        return (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        );
      case "failed":
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex gap-2", isOwn && "justify-end")}>
      <div className={cn("max-w-[70%] space-y-1", isOwn && "items-end")}>
        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
            message.status === "failed" && "opacity-70"
          )}
        >
          {/* Text content */}
          {message.content && (
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}

          {/* Media content */}
          {message.mediaUrls.length > 0 && (
            <div
              className={cn(
                "grid gap-2 mt-2",
                message.mediaUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"
              )}
            >
              {message.mediaUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  className="rounded-lg object-cover w-full cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(url, "_blank")}
                />
              ))}
            </div>
          )}
        </div>

        {/* Timestamp and status */}
        <div
          className={cn(
            "flex items-center gap-1 text-xs text-muted-foreground px-2",
            isOwn && "justify-end"
          )}
        >
          <span>{format(new Date(message.createdAt), "HH:mm")}</span>
          {showStatusIcon()}
        </div>
      </div>
    </div>
  );
}
