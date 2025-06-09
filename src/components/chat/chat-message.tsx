"use client";

import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Check,
  CheckCheck,
  AlertCircle,
  Download,
  FileText,
} from "lucide-react";
import { Message } from "@/lib/types";
import { useChatContext } from "./chat-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

export function ChatMessage({ message, isOwn, showAvatar }: ChatMessageProps) {
  const { currentUser, otherUser, retryMessage } = useChatContext();
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const user = isOwn ? currentUser : otherUser;

  if (message.type === "SYSTEM") {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
          {message.content.content}
        </div>
      </div>
    );
  }

  const renderMessageStatus = () => {
    if (!isOwn || message.type === "SYSTEM") return null;

    switch (message.status) {
      case "sending":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "sent":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case "failed":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => retryMessage(message.id)}
                >
                  <AlertCircle className="h-3 w-3 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Failed to send. Click to retry.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (message.type === "TEXT") {
      return (
        <div
          className={cn(
            "rounded-2xl px-4 py-2 max-w-[80%] md:max-w-[60%] break-words",
            isOwn ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content.text}</p>
        </div>
      );
    }

    if (message.type === "MEDIA") {
      return (
        <div
          className={cn(
            "rounded-2xl p-2 max-w-[80%] md:max-w-[60%]",
            isOwn ? "bg-primary/10 ml-auto" : "bg-muted"
          )}
        >
          <div className="grid grid-cols-2 gap-2">
            {message.content.urls.map((url, index) => (
              <div key={index} className="relative group">
                {imageError[url] ? (
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                ) : (
                  <img
                    src={url}
                    alt={`Attachment ${index + 1}`}
                    className="rounded-lg object-cover aspect-square w-full"
                    onError={() =>
                      setImageError((prev) => ({ ...prev, [url]: true }))
                    }
                  />
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => window.open(url, "_blank")}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={cn("flex gap-3 group", isOwn && "flex-row-reverse")}>
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8 mt-auto">
          <AvatarImage src={user.avatar || undefined} />
          <AvatarFallback className="text-xs">
            {user.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      {!showAvatar && !isOwn && <div className="w-8" />}

      <div className={cn("flex flex-col gap-1", isOwn && "items-end")}>
        {renderContent()}

        <div
          className={cn(
            "flex items-center gap-1 px-2",
            isOwn ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
          {renderMessageStatus()}
        </div>
      </div>
    </div>
  );
}
