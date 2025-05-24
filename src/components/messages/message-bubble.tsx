import { format } from "date-fns";
import { Prisma } from "@prisma/client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Download, Eye, Paperclip } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";

interface MessageBubbleProps {
  message: Prisma.MessageGetPayload<{
    select: {
      content: true;
      type: true;
      createdAt: true;
      sender: true;
    };
  }>;
  userId: string;
  side: "left" | "right";
  variant?: "default" | "ghost" | "outline" | "destructive" | "secondary";
}

export function MessageBubble({
  message,
  side,
  variant = "default",
}: MessageBubbleProps) {
  const { text, attachments } = message.content as {
    text: string;
    attachments: {
      type: "image" | "file";
      data?: string;
      url?: string;
    }[];
  };
  const imageAttachments = attachments
    ? attachments.filter((att) => att.type === "image")
    : [];
  const fileAttachments = attachments
    ? attachments.filter((att) => att.type === "file")
    : [];

  return (
    <div
      className={cn(
        "flex gap-2",
        side === "left" ? "flex-row ml-auto" : "flex-row-reverse mr-auto"
      )}
    >
      <Image
        src={message.sender.avatar || "/placeholder.svg"}
        alt={message.sender.username}
        width={48}
        height={48}
        className="object-cover size-12 border rounded-full"
      />
      <div className="flex flex-col gap-1">
        <div
          className={cn("rounded-lg p-3 text-sm max-w-xs", {
            "bg-primary text-primary-foreground transition-colors duration-300 hover:bg-primary/75":
              variant === "default",
            "bg-muted text-muted-foreground transition-colors duration-300 hover:bg-muted/75":
              variant === "ghost",
            "bg-transparent text-secondary-foreground border transition-colors duration-300 hover:bg-secondary/75":
              variant === "outline",
            "bg-destructive text-destructive-foreground transition-colors duration-300 hover:bg-destructive/75":
              variant === "destructive",
            "bg-secondary text-secondary-foreground transition-colors duration-300 hover:bg-secondary/75":
              variant === "secondary",
          })}
        >
          <div>
            {text && <p className="text-sm">{text}</p>}
            {imageAttachments.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {imageAttachments.map((att, index) => (
                  <div
                    key={index}
                    className="relative w-full min-w-28 aspect-square h-full group"
                  >
                    <Image
                      src={att.data || ""}
                      alt="Attachment"
                      fill
                      className="object-cover w-full rounded group-hover:opacity-50 transition-opacity duration-300"
                    />
                    <div className="transition-opacity duration-150 opacity-0 group-hover:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
                      <Link
                        className={buttonVariants({
                          variant: "secondary",
                          size: "icon",
                        })}
                        href={att.url || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        aria-label="Download file"
                      >
                        <Download />
                      </Link>
                      <Button variant="secondary" size="icon">
                        <Eye />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {fileAttachments.length > 0 && (
              <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2">
                {fileAttachments.map((att, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-2 rounded-lg bg-secondary/50"
                  >
                    <Paperclip className="size-4" />
                    <span className="text-xs truncate flex-1">
                      {att.url ? att.url.split("/").pop() : "Unnamed File"}
                    </span>
                    <Link
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon",
                      })}
                      href={att.url || ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      aria-label="Download file"
                    >
                      <Download />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {format(new Date(message.createdAt), "h:mm a")}
        </div>
      </div>
    </div>
  );
}
